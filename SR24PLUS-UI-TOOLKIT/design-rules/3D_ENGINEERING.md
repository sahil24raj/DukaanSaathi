# 3D Engineering Standards & Performance Directives

**Standard:** SR24PLUS Creative 3D Web Development  
**Core Stack:** Three.js | React Three Fiber (R3F) | Drei | GLSL

---

## 1. When to Use 3D (And When to Forbid It)

### Permitted 3D Use Cases:
- **Interactive Product Inspection**: 360° rotation, material toggling, exploded views of hardware/devices.
- **Spatial Data Visualization**: Graphs, geographic topology, node-link network graphs.
- **Brand Hero Anchor**: A purposeful, highly crafted visual centerpiece reflecting the core identity (e.g. an interactive audio wave visualizer for a voice platform).
- **Gamified / Spatial Interfaces**: Immersive onboarding, interactive environments (e.g. Vibe Arena).

### Forbidden 3D Use Cases:
- Floating abstract spheres, torus knots, or floating cylinders placed solely to fill whitespace on a generic landing page.
- 3D elements that block user scrolling or capture touch gestures unintentionally.
- Unoptimized 3D models (>15MB GLB) on mobile landing pages that destroy LCP and Core Web Vitals.

---

## 2. 3D Architecture Standard: R3F + Drei

```
[ Page Component (Next.js / Vite) ]
        |
        +---> [ <Suspense fallback={<Accessible2DHero />}> ]
                    |
                    +---> [ <Canvas dpr={[1, 2]} camera={{...}}> ]
                                |
                                +---> [ Scene Container (R3F) ]
                                |           |
                                |           +---> Lights (Ambient + Directional)
                                |           +---> Environment / Studio Map
                                |           +---> Interactive Mesh Component
                                |           +---> ContactShadows
                                |
                                +---> [ Html Overlay (HUD / Labels) ]
```

---

## 3. Lighting & Materials
1. **PBR Standard**: Use `MeshStandardMaterial` or `MeshPhysicalMaterial` for realistic metalness, roughness, and light falloff.
2. **Environment Maps**: Use low-resolution HDR environment maps (`<Environment preset="city" />`) for realistic reflections with 1 draw call.
3. **Shadow Optimization**: Prefer `<ContactShadows />` for floor planes. If real-time directional shadows are required:
   - Clamp shadow map resolution to `1024x1024`.
   - Tighten camera frustum to the bounding box of the active model.
   - Use `THREE.PCFSoftShadowMap`.

---

## 4. Geometry & Texture Optimization
- **Asset Size Limit**: Total 3D assets loaded on initial page view must not exceed **2.5MB**.
- **DRACO Compression**: Always compress glTF models with DRACO or Meshopt (`gltf-pipeline -i model.gltf -o model.glb -d`).
- **Texture Dimensions**: Textures must be powers of two (512x512 or 1024x1024). Never load 4K (4096x4096) textures on a mobile web canvas.
- **Instancing**: For more than 10 repeated meshes, use `<Instances>` or `THREE.InstancedMesh` to collapse draw calls into a single batch.

---

## 5. Lifecycle & Disposal Rules
WebGL memory leaks crash mobile tabs. Adhere strictly to these rules:
1. Every manually created `THREE.Geometry`, `THREE.Material`, and `THREE.Texture` must have `.dispose()` invoked on unmount.
2. In R3F, unmounting components automatically triggers disposal; do not retain global references to geometries or materials in window variables.
3. Clamp pixel ratio: `<Canvas dpr={[1, Math.min(window.devicePixelRatio, 2)]}>`.

---

## 6. Accessibility & Reduced-Motion
- Check `prefers-reduced-motion`. If true:
  - Stop automated spinning, oscillations, and flying cameras.
  - Position the 3D model statically in its primary informational pose.
- Provide descriptive `alt` text or ARIA live regions in the accompanying HTML structure so screen readers understand the 3D content.
