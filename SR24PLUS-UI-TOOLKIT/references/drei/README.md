# Drei (@react-three/drei) — Technical Engineering Reference

**Official Repository:** [pmndrs/drei](https://github.com/pmndrs/drei)  
**Documentation:** [drei.docs.pmnd.rs](https://drei.docs.pmnd.rs/)  
**License:** MIT

---

## 1. Overview & Purpose
Drei is the official collection of battle-tested helpers, abstractions, loaders, shaders, and controls for React Three Fiber. In the **SR24PLUS UI Engineering Toolkit**, Drei eliminates thousands of lines of boilerplate for:
- Asset loading (`useGLTF`, `useTexture`).
- Environment & studio lighting (`Environment`, `ContactShadows`, `AccumulativeShadows`).
- Camera controllers (`OrbitControls`, `PresentationControls`, `ScrollControls`).
- High-performance UI overlays (`Html`, `Float`, `Billboard`).
- Mesh optimization (`Instances`, `MeshReflectorMaterial`, `Preload`).

---

## 2. Installation
```bash
npm install @react-three/drei
```

---

## 3. Key Production Abstractions

| Component / Hook | Purpose | Performance Impact |
| :--- | :--- | :--- |
| `useGLTF` | Loads glTF/GLB models with automatic DRACO decoding & cache | High efficiency; reuses parsed buffer geometries |
| `Environment` | HDR environment maps for photorealistic image-based lighting (IBL) | Pre-filtered radiance map; 1 draw call |
| `ContactShadows` | Soft ground contact shadows without real-time directional shadow maps | Baked canvas shadow; drops shadow map cost |
| `Html` | Renders standard React HTML/DOM elements projected into 3D coordinates | Accessible overlays with z-index & occlude |
| `Float` | Subtle organic levitation and rotation animation without manual loops | Optimized CPU math; low overhead |
| `PresentationControls` | Touch-safe constrained orbiting for hero product cards | Prevents page scroll hijacking on mobile |

---

## 4. Production Implementation: Interactive 3D Product Showcase

```tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  PresentationControls,
  Float,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
  Preload
} from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} position={[0, -0.5, 0]} />;
}

// Pre-load asset to eliminate cold start stutter
useGLTF.preload('/models/product.glb');

export const ShowcaseExperience: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-800/80 backdrop-blur-md text-white text-xs font-medium">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                Loading 3D asset...
              </div>
            </Html>
          }
        >
          {/* Constrained controls that work naturally on mobile swipe */}
          <PresentationControls
            global={false}
            cursor={true}
            speed={1.5}
            zoom={1}
            rotation={[0, 0.2, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
              <Model url="/models/product.glb" />
            </Float>
          </PresentationControls>

          {/* Studio HDR Lighting */}
          <Environment preset="city" />

          {/* High-quality soft ground shadow without directional light matrix overhead */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.65}
            scale={8}
            blur={1.5}
            far={4}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};
```

---

## 5. Performance Checklist
- **Asset Preloading**: Always call `useGLTF.preload(url)` at the top module scope for critical models to avoid layout shift.
- **Occlusion on `<Html>`**: Use `occlude="blending"` or `occlude={[ref1, ref2]}` if HTML labels should hide behind 3D geometry.
- **DRACO Decoder**: Place DRACO decoder binaries in `/public/draco/` and configure `useGLTF(url, '/draco/')` for 70%+ smaller GLB network payloads.

