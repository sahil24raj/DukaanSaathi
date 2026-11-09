# 3D Web Experience Architecture & Blueprint

**Target:** WebGL / Three.js / React Three Fiber interactive 3D landing experiences and product viewports.  
**Use Cases:** Vibe Arena 3D Lobby, Hardware Product Customizer, Interactive Spatial Data Viewer.

---

## 1. System Architecture
A production 3D web experience must balance visual fidelity with mobile battery consumption and network latency.

```
+-------------------------------------------------------------------------+
| DOM Overlay (HTML HUD): Floating badges, title, CTA buttons             |
+-------------------------------------------------------------------------+
| <Canvas> (WebGL 2.0 / Three.js)                                         |
|  - ResizeObserver & Aspect Ratio Calculation                            |
|  - Camera Controller (PresentationControls / OrbitControls)             |
|  - Lighting: Environment (IBL) + Key Directional Light (Shadows)        |
|  - 3D Model: DRACO GLB + Optimized PBR Materials                        |
|  - Ground: ContactShadows (Zero GPU shadow map cost)                    |
|  - Post-Processing (Optional): Bloom, Chromatic Aberration, Vignette    |
+-------------------------------------------------------------------------+
| Fallback Layer: Accessible 2D WebP image shown if WebGL is disabled     |
+-------------------------------------------------------------------------+
```

---

## 2. Production Code Blueprint

```tsx
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PresentationControls,
  Float,
  Environment,
  ContactShadows,
  useGLTF,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';

interface SceneModelProps {
  modelPath: string;
}

const SceneModel: React.FC<SceneModelProps> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // Subtle breathing animation
    const t = state.clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1.5} />;
};

export const Production3DExperience: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  return (
    <div className="relative w-full h-[600px] bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800">
      {/* 2D HTML Overlay / HUD */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
          Interactive 3D Inspector
        </span>
        <h2 className="text-2xl font-bold text-white mt-2">Drag to inspect 360&deg;</h2>
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                Loading 3D asset...
              </div>
            </Html>
          }
        >
          <PresentationControls
            global={false}
            cursor={true}
            speed={1.5}
            zoom={1}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
              <SceneModel modelPath={modelPath} />
            </Float>
          </PresentationControls>

          <Environment preset="city" />

          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.7}
            scale={6}
            blur={2}
            far={3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
```

