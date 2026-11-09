# Responsive Design & Multi-Device Standards

**Standard:** SR24PLUS Adaptive Interface Engineering  
**Scope:** Mobile (320px - 480px), Tablet (481px - 1024px), Desktop (1025px - 1920px), Ultrawide (1920px+)

---

## 1. Core Principles
1. **Mobile First, Not Mobile As An Afterthought**: Design mobile layouts as first-class ergonomic tools. Kirana store owners, delivery partners, and mobile users operate one-handed on 375px screens under direct sunlight.
2. **No Horizontal Scroll Outliers**: Every container, table, pre-block, and canvas must have strict `max-w-full overflow-hidden` or horizontal scroll containment.
3. **Fluid Typography with `clamp()`**: Headers and body text must scale smoothly between viewport boundaries without abrupt layout breaks.

---

## 2. Touch Target Ergonomics
- **Minimum Interactive Size**: All buttons, links, toggles, and dropdown triggers must meet a minimum hit area of **44x44px** (Apple HIG) or **48x48px** (Material Design).
- **Safe Area Insets**: Always incorporate `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)` for notched iPhones and gesture home indicators:
  ```css
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  ```
- **Tap Feedback**: Every touchable component must provide instant active feedback without 300ms tap delay (`touch-action: manipulation`).

---

## 3. Responsive Data Displays (Tables vs Cards)
- **Desktop (>= 1024px)**: Full tabular views with sorting, aligned columns, and sticky action headers.
- **Mobile (< 768px)**: Automatically transform tabular data into stacked **Data Cards** with primary status badges and prominent actions, eliminating frustrating side-scrolling.

```tsx
// Pattern: Adaptive Table-to-Card Component
export const OrderRecordRow: React.FC<{ order: any }> = ({ order }) => {
  return (
    <>
      {/* Desktop Table Row */}
      <tr className="hidden md:table-row border-b border-neutral-800 hover:bg-neutral-900/40">
        <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
        <td className="py-3 px-4 font-medium">{order.customer}</td>
        <td className="py-3 px-4 tabular-nums">₹{order.total}</td>
        <td className="py-3 px-4"><span className="badge">{order.status}</span></td>
      </tr>

      {/* Mobile Stacked Card */}
      <div className="md:hidden p-4 mb-3 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-neutral-400">{order.id}</span>
          <span className="badge">{order.status}</span>
        </div>
        <p className="text-sm font-semibold text-neutral-100">{order.customer}</p>
        <p className="text-base font-bold tabular-nums text-emerald-400">₹{order.total}</p>
      </div>
    </>
  );
};
```

---

## 4. Breakpoint Standards
```css
/* Tailwind CSS Standard Alignment */
sm:  640px   /* Large phones / small tablets */
md:  768px   /* Tablets portrait */
lg:  1024px  /* Laptops / landscape tablets */
xl:  1280px  /* Desktop workstations */
2xl: 1536px  /* High-resolution displays */
```
Always verify layouts at `375px` (iPhone SE / standard phone), `768px` (iPad), and `1440px` (MacBook / Desktop).
