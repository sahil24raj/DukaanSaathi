# Frontend Performance & Core Web Vitals Standards

**Standard:** SR24PLUS High-Performance Web Engineering  
**Targets:** 60fps Steady Frame Rate | Sub-second LCP | Zero CLS | Minimal INP

---

## 1. Core Web Vitals (CWV) Thresholds

| Metric | Target | Focus Area |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 1.8s` | Server response, critical image preloading, hero font loading |
| **INP (Interaction to Next Paint)** | `< 150ms` | Main-thread JavaScript budget, input debounce, non-blocking state updates |
| **CLS (Cumulative Layout Shift)** | `< 0.05` | Aspect ratios on images/canvases, reserved height for dynamic banners |

---

## 2. 3D & Heavy Asset Lazy-Loading Pattern
Never load Three.js, React Three Fiber, or 3D models on initial page boot if they sit below the fold or require user activation.

```tsx
import React, { Suspense, lazy } from 'react';

// Lazy-load the heavy 3D canvas bundle (Three.js + R3F is ~500KB)
const LazyInteractive3DHero = lazy(() =>
  import('./Interactive3DHero').then((module) => ({
    default: module.Interactive3DHero,
  }))
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[500px]">
      <Suspense
        fallback={
          <div className="w-full h-[500px] flex items-center justify-center bg-neutral-950 rounded-2xl border border-neutral-900">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        }
      >
        <LazyInteractive3DHero />
      </Suspense>
    </section>
  );
};
```

---

## 3. Font Optimization Strategy
1. **System Font Fallback First**: Use modern system font stacks or self-hosted WOFF2 fonts with `font-display: swap`.
2. **Preload Critical Fonts**:
   ```html
   <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>
   ```
3. **Avoid Loading Unused Weights**: Use a single Variable Font (`wght 100 900`) instead of loading 6 separate static font files.

---

## 4. React Rendering & State Budget
1. **Keep Local State Local**: Do not hoist transient search input or voice recording timer state into global stores (Zustand/Redux). Hoisting causes whole-page re-renders on every keystroke.
2. **Transition Heavy Renders**: Wrap search filtering or data table updates in React 18 `useTransition()`:
   ```tsx
   const [isPending, startTransition] = useTransition();

   const handleFilter = (query: string) => {
     startTransition(() => {
       setFilteredItems(filterLargeDataset(query));
     });
   };
   ```
3. **Virtualize Lists Over 100 Rows**: For large inventory or transaction lists (>100 items), use virtual windowing (`@tanstack/react-virtual` or lightweight windowing) to render only visible DOM nodes.

---

## 5. CSS & Bundle Hygiene
- Use Tailwind CSS with automatic purge / Content scanning.
- Avoid importing entire icon libraries (`import * as Icons from 'lucide-react'`). Import named exports (`import { Check, Mic } from 'lucide-react'`) to enable tree-shaking.
- Eliminate unused npm packages immediately.
