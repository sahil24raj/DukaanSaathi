# React Three Fiber (R3F) — Technical Engineering Reference

**Official Repository:** [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber)  
**Documentation:** [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/)  
**License:** MIT

---

## 1. Overview & Purpose
React Three Fiber is a declarative React renderer for Three.js. It brings React's component model, hooks, and reactive lifecycle to WebGL without introducing runtime performance penalties. In the **SR24PLUS UI Engineering Toolkit**, R3F is the **primary 3D framework** for React/Next.js/Vite applications.

---

## 2. Installation & Core Dependencies
```bash
# Core dependencies for modern React 18/19
npm install three @types/three @react-three/fiber
```

---

## 3. Component Architecture & Principles
1. **The `<Canvas>` Component**: Creates a WebGL context, default scene, camera, resize observer, and animation loop.
2. **Intrinsic Elements**: All Three.js classes map directly to camelCase JSX elements (`THREE.Mesh` -> `<mesh>`, `THREE.BoxGeometry` -> `<boxGeometry>`).
3. **The `useFrame` Hook**: Replaces manual `requestAnimationFrame`. Runs on every rendered frame before drawing.
4. **The `useThree` Hook**: Accesses the state store (`scene`, `camera`, `gl`, `size`, `viewport`).

---

## 4. Production Implementation Pattern

```tsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveOrbProps {
  color?: string;
  wireframe?: boolean;
}

export const InteractiveOrb: React.FC<InteractiveOrbProps> = ({
  color = '#2563eb',
  wireframe = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Smooth rotation and reactive animation in frame loop
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.5;

    // Smooth hover lerp
    const targetScale = active ? 1.3 : hovered ? 1.15 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={() => setActive(!active)}
      castShadow
      receiveShadow
    >
      <icosahedronGeometry args={[1, 16]} />
      <meshStandardMaterial
        color={hovered ? '#1d4ed8' : color}
        roughness={0.2}
        metalness={0.8}
        wireframe={wireframe}
      />
    </mesh>
  );
};

export const ProductionSceneCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-2xl bg-neutral-950">
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]} // Performance clamp: min 1, max 2
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <InteractiveOrb color="#3b82f6" />
      </Canvas>
    </div>
  );
};
```

---

## 5. R3F Performance Best Practices
- **Never mutate state inside `useFrame`**: Calling `useState` inside `useFrame` triggers 60/120 React re-renders per second. Mutate Three.js object properties directly via `ref.current`.
- **DPR Clamping**: Always specify `dpr={[1, 2]}` on `<Canvas>`.
- **Demand Rendering (`frameloop="demand"`)**: For static or UI-driven 3D scenes (like product configurators), switch to `frameloop="demand"` to render only when user interacts or state changes, dropping idle GPU consumption to 0%.
- **Automatic Cleanup**: R3F automatically disposes of geometries and materials on unmount. If using custom shaders or manual textures, manage cleanup via `useEffect`.

---

## 6. Accessibility & Mobile Optimization
- **Touch Targets**: Prevent 3D canvas from swallowing page scroll on touch screens by applying `touch-action: pan-y` on the canvas container CSS.
- **Pointer Event Propagation**: Always use `e.stopPropagation()` in 3D pointer handlers when raycasting nested objects.
- **Fallback Content**: Always provide accessible HTML content inside `<Suspense fallback={<LoadingSkeleton />}>` or overlay for screen readers (`aria-hidden="true"` on canvas).
