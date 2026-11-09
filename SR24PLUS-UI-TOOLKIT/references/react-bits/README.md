# React Bits — Technical Engineering Reference

**Official Repository:** [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits)  
**Documentation:** [reactbits.dev](https://reactbits.dev/)  
**License:** MIT

---

## 1. Overview & Purpose
React Bits is a curated collection of lightweight, copy-pasteable React animations, backgrounds, text effects, and interactive UI components built with Tailwind CSS, WebGL, and Framer Motion / Motion. In the **SR24PLUS UI Engineering Toolkit**, React Bits provides inspiration for:
- Particle background meshes.
- Variable font weight scrubbers and magnetic button interactions.
- Spotlight hover effects on high-ticket cards.
- Glitch and shimmer text loaders.

---

## 2. Component Architecture: Zero-Bloat Copy-Paste Pattern
Rather than installing large omnibus npm packages, React Bits advocates **copy-paste component architecture** (similar to shadcn/ui). This prevents dependency lock-in and allows full customization of animation timings and Tailwind tokens.

---

## 3. Production Implementation: Interactive Spotlight Card

```tsx
import React, { useRef, useState, MouseEvent } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(16, 185, 129, 0.15)', // Default Emerald glow
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 transition-colors duration-300 ${className}`}
    >
      {/* Interactive spotlight follower layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

---

## 4. Engineering & Anti-Slop Guidelines
1. **Never use generic purple glow**: Use brand-specific tinting (e.g. emerald/green for Kirana billing, deep indigo/blue for enterprise SaaS).
2. **Performance (Pointer Events)**: Ensure spotlight gradient container has `pointer-events: none` to prevent mouse event throttling on child buttons and inputs.
3. **Mobile Handling**: On touch devices without hover capability, disable mouse position tracking via `@media (hover: hover)`.
