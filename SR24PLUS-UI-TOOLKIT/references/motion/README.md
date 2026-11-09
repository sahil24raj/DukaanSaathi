# Motion (formerly Framer Motion) — Technical Engineering Reference

**Official Repository:** [motiondivision/motion](https://github.com/motiondivision/motion)  
**Documentation:** [motion.dev](https://motion.dev/)  
**License:** MIT

---

## 1. Overview & Purpose
Motion (formerly Framer Motion) is the gold standard React animation library for declarative layout animations, spring physics, gesture handling, and exit transitions. In the **SR24PLUS UI Engineering Toolkit**, Motion is the **primary animation engine** for micro-interactions, page transitions, accordion flows, and accessible spring animations.

---

## 2. Installation
```bash
# Motion for React
npm install motion

# Or legacy package name if maintaining existing codebases
# npm install framer-motion
```

---

## 3. Core Architecture & Mental Model
1. **`motion.*` HTML primitives**: Replaces standard HTML tags (`<motion.div>`, `<motion.button>`, `<motion.section>`).
2. **Spring Physics**: Physics-driven motion (`type: "spring", stiffness: 300, damping: 30`) that adapts dynamically without duration clipping.
3. **`AnimatePresence`**: Handles element removal and unmounting transitions cleanly without ghost states.
4. **`layout` & `layoutId`**: Fluid FLIP-based layout transitions (e.g. animated tabs, morphing modals, pill selectors).
5. **Hardware Acceleration**: Automatically prioritizes GPU-accelerated CSS properties (`transform: translate3d/scale`, `opacity`).

---

## 4. Production Implementation Patterns

### Pattern A: FLIP Animated Segmented Navigation Bar
```tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';

interface TabItem {
  id: string;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending Khata' },
  { id: 'settled', label: 'Settled' },
  { id: 'analytics', label: 'Reports' },
];

export const SegmentedNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <nav className="flex items-center gap-1.5 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl max-w-fit">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {/* The active pill background morphs smoothly across tabs via layoutId */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-neutral-800 border border-neutral-700/60 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
```

### Pattern B: Accessible Staggered List Entrance
```tsx
import React from 'react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
};

export const StaggeredCardList: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {items.map((text, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.985 }}
          className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl"
        >
          <p className="text-sm font-medium text-neutral-200">{text}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};
```

---

## 5. Performance & Accessibility Standards
1. **Never Animate Layout Properties Directly**: Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly. Use `transform` (`scale`, `x`, `y`) or Motion's `layout` prop which computes FLIP transforms on the GPU.
2. **Honoring `prefers-reduced-motion`**:
   Use Motion's built-in `useReducedMotion()` hook:
   ```tsx
   import { useReducedMotion } from 'motion/react';

   const shouldReduceMotion = useReducedMotion();
   const animation = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
   ```
3. **Exit Animations**: Always wrap components using exit animations in `<AnimatePresence mode="wait">` to prevent layout jumps.

