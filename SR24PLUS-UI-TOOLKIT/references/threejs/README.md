# Three.js — Technical Engineering Reference

**Official Repository:** [mrdoob/three.js](https://github.com/mrdoob/three.js)  
**Documentation:** [threejs.org/docs](https://threejs.org/docs/)  
**License:** MIT

---

## 1. Overview & Purpose
Three.js is the foundational JavaScript 3D library used to create WebGL and WebGPU scenes directly in modern web browsers. In the **SR24PLUS UI Engineering Toolkit**, raw Three.js is utilized for:
- Low-level scene management and custom WebGL shaders (`ShaderMaterial`).
- Custom canvas pipelines where React overhead must be eliminated.
- Custom post-processing passes and compute pipelines.

---

## 2. Installation & Core Dependencies
```bash
# Core library and TypeScript definitions
npm install three
npm install --save-dev @types/three

# Optional: Addon loaders and controls (standard in three/addons)
# Note: In modern Three.js (r150+), addons are bundled within 'three/addons/*'
```

---

## 3. Architecture & Mental Model
A production Three.js scene consists of four interconnected pillars:
1. **Scene graph (`THREE.Scene`)**: The tree holding meshes, lights, and cameras.
2. **Camera (`THREE.PerspectiveCamera` / `THREE.OrthographicCamera`)**: Projects 3D space to 2D view.
3. **Renderer (`THREE.WebGLRenderer`)**: Renders scene from camera viewpoint with antialiasing, color management, and tone mapping.
4. **Animation loop (`requestAnimationFrame`)**: Drives physics, updates uniforms, and triggers renders.

```
+-------------------------------------------------------+
|                    THREE.Scene                        |
|   +-------------------+       +-------------------+   |
|   |   THREE.Mesh      |       | THREE.Light       |   |
|   |  (Geometry + Mat) |       | (Directional/Amb) |   |
|   +-------------------+       +-------------------+   |
+-------------------------------------------------------+
                           |
                           v
+--------------------+            +---------------------+
| THREE.Camera       | ---------> | THREE.WebGLRenderer | ---> <canvas>
+--------------------+            +---------------------+
```

---

## 4. Production Implementation Pattern

```typescript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneController {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera with responsive aspect ratio
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 2, 5);

    // 3. Renderer with high-DPI clamping and tone mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Clamp to 2 for performance
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // 5. Lighting
    this.setupLighting();

    // 6. Responsive listener
    this.setupResizeObserver();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0001;
    this.scene.add(dirLight);
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });
    this.resizeObserver.observe(this.container);
  }

  public start(): void {
    const renderLoop = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.resizeObserver?.disconnect();
    this.controls.dispose();

    // Traverse and dispose geometries, textures, materials to prevent VRAM memory leaks
    this.scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => this.disposeMaterial(mat));
        } else {
          this.disposeMaterial(mesh.material);
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }

  private disposeMaterial(material: THREE.Material): void {
    material.dispose();
    for (const key of Object.keys(material)) {
      const prop = (material as any)[key];
      if (prop && typeof prop === 'object' && 'minFilter' in prop) {
        (prop as THREE.Texture).dispose();
      }
    }
  }
}
```

---

## 5. Performance Engineering Rules
1. **Device Pixel Ratio (DPR)**: Never use raw `window.devicePixelRatio` on retina screens (3x/4x); clamp to `Math.min(window.devicePixelRatio, 2)`.
2. **Draw Call Budget**: Keep total draw calls below **50-80** for mobile 60fps web interfaces. Use `THREE.InstancedMesh` for repeated objects.
3. **Geometry Optimization**: Avoid high polycount models (>100k vertices). Compress assets using glTF + DRACO compression.
4. **VRAM Disposal**: Always implement recursive disposal of geometries, materials, and textures when scenes unmount to prevent GPU memory leaks.
5. **Frustum Culling**: Ensure `mesh.frustumCulled = true` (default) is preserved.

---

## 6. Accessibility & Fallbacks
- **`prefers-reduced-motion`**: Detect user preference and disable continuous rotation or intense camera movements:
  ```typescript
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    controls.autoRotate = false;
  }
  ```
- **WebGL Capability Detection**: If WebGL 2.0 is unavailable or blocked, render an accessible 2D vector image or CSS illustration fallback with ARIA descriptive labels.

