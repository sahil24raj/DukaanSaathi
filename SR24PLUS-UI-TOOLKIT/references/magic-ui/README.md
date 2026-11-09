# Magic UI — Technical Engineering Reference

**Official Repository:** [magicuidesign/magicui](https://github.com/magicuidesign/magicui)  
**Documentation:** [magicui.design](https://magicui.design/)  
**License:** MIT

---

## 1. Overview & Purpose
Magic UI is a modern UI library built on top of Tailwind CSS, React, and Motion. It delivers high-tier landing page components, animated borders, bento grids, marquee integrations, and interactive particle canvases. In the **SR24PLUS UI Engineering Toolkit**, Magic UI patterns are adapted for:
- Bento grid layouts with distinct content hierarchy.
- Border beams and subtle gradient lines.
- Accessible marquee strips for trusted customer brands.
- Interactive terminal simulations for developer products.

---

## 2. Core Dependencies
```bash
# Standard peer dependencies
npm install clsx tailwind-merge motion lucide-react
```

---

## 3. Production Implementation: The Intentional Bento Grid Pattern
Generic AI sites produce monotonous grids where every box has identical size and styling. The **SR24PLUS Bento Architecture** enforces intentional hierarchy with varied spans, focal points, and purposeful metrics.

```tsx
import React from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface BentoItemProps {
  title: string;
  description: string;
  header: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

export const BentoCard: React.FC<BentoItemProps> = ({
  title,
  description,
  header,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 transition-all duration-300 hover:border-neutral-700 hover:shadow-xl ${className}`}
    >
      <div className="w-full mb-4 overflow-hidden rounded-xl bg-neutral-950/50">
        {header}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-neutral-800 text-emerald-400 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const ProductionBentoSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Feature 1 (Spans 2 columns) */}
        <BentoCard
          className="md:col-span-2"
          title="Instant Voice-to-Bill Extraction"
          description="Transcribes Hindi, Hinglish, and regional speech in real time with automated item matching and catalog pricing."
          icon={<Zap className="w-5 h-5" />}
          header={
            <div className="h-44 p-4 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-950/30 to-neutral-900">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full mb-2">
                Latency &lt; 280ms
              </span>
              <p className="text-sm font-medium text-neutral-200">
                &ldquo;Bhaiya, do kilo chawal aur ek packet namak dena&rdquo;
              </p>
            </div>
          }
        />

        {/* Regular Feature 2 */}
        <BentoCard
          title="Automated Udhaar Ledger"
          description="Keep credit customer balances synchronized with automatic WhatsApp reminders and 1-click settlement."
          icon={<ShieldCheck className="w-5 h-5" />}
          header={
            <div className="h-44 flex items-center justify-center bg-neutral-950/60 text-2xl font-bold text-neutral-200">
              ₹14,850 <span className="text-xs text-neutral-400 ml-1">Tracked</span>
            </div>
          }
        />
      </div>
    </section>
  );
};
```

---

## 4. Anti-Slop Enforcement
- Avoid decorative animated blobs that burn CPU cycles without conveying information.
- Always tie bento card visualizations to **real product state** or functional mockups, not abstract floating 3D spheres.
- Maintain consistent padding, border radius, and typography hierarchy across all cards.
