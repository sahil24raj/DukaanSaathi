# SR24PLUS UI Engineering Principles

**Version:** 1.0.0  
**Scope:** Permanent Standard for SR24Plus, Dukan Sathi, Vibe Arena, and All Future Software Projects.

---

## 1. Core Philosophy: Intentional, Distinctive, Trustworthy
Every interface designed under this toolkit must reject lazy, generic AI clichés in favor of distinctive, brand-tailored, and battle-tested craftsmanship. We design for clarity, speed, tactile feedback, and human trust.

---

## 2. The 10 Invariant Design Principles

1. **No Generic AI SaaS Templates**:  
   Every product must possess an unmistakable visual identity derived from its actual domain, target users, and workflow constraints.
2. **No Unnecessary Purple/Violet AI Glows**:  
   Aesthetics must reflect the brand's genuine emotional tone (e.g. emerald/green for commerce, slate/blue for developer tools, terracotta/warm stone for regional retail).
3. **No Decorative Without Functionality**:  
   Every visual element, shadow, border, or icon must convey state, hierarchy, boundary, or feedback. If it doesn't serve the user, remove it.
4. **No Arbitrary Card Containers**:  
   Do not wrap every paragraph in a rounded box with a glowing border. Use typography, white space, and subtle rule dividers to group content.
5. **No Meaningless 3D Objects**:  
   3D is reserved for physical product inspection, spatial data visualization, or core brand anchors. Never insert floating spheres or abstract donuts simply to fill empty space.
6. **No Excessive Scroll Hijacking**:  
   Preserve natural browser scrolling physics. Avoid scroll-locked full-page slides unless building a dedicated visual essay.
7. **No Emoji-Soup as Icons**:  
   Use precise, crisp SVG icon sets (Lucide Icons, Radix Icons, Heroicons) with consistent stroke weight (1.5px or 1.75px).
8. **No Fake Statistics or Marketing Vanity**:  
   Never show fake counters ("99.999% Loved by 50,000,000 people"). Ground proofs in verifiable product capabilities, real demo data, or domain facts.
9. **No Inconsistent Spacing or Font Confusion**:  
   Adhere strictly to a 4px/8px spatial rhythm and a defined typographic scale with appropriate font pairing.
10. **Tactile Feedback on Every Interactive Element**:  
    Every button, input, toggle, and link must provide immediate visual confirmation: hover, active, focus-visible, and disabled states.

---

## 3. Brand Identity & Color Token Architecture
Never hardcode hex values inside components. Always structure color tokens semantically:

```css
:root {
  /* Surface Tokens */
  --surface-base: #0a0a0b;
  --surface-subtle: #141416;
  --surface-elevated: #1e1e22;
  --surface-overlay: rgba(26, 26, 30, 0.85);

  /* Border Tokens */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);
  --border-focus: #10b981;

  /* Text Tokens */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --text-inverse: #020617;

  /* Brand / Action Tokens (e.g., Retail Green) */
  --brand-primary: #10b981;
  --brand-primary-hover: #059669;
  --brand-surface: rgba(16, 185, 129, 0.12);

  /* Status Tokens */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-danger: #ef4444;
  --status-info: #3b82f6;
}
```

---

## 4. Typography Scale & Hierarchy
- **Display / Hero**: `font-display`, clamp(2.5rem, 5vw, 4.25rem), tracking-tight, font-extrabold.
- **Section Heading (H2)**: clamp(1.75rem, 3vw, 2.5rem), tracking-tight, font-bold.
- **Card / Subsection (H3)**: 1.125rem to 1.25rem (18px - 20px), font-semibold.
- **Body Regular**: 0.9375rem (15px) or 1rem (16px), line-height 1.6, text-secondary.
- **Captions & Metadata**: 0.75rem to 0.8125rem (12px - 13px), tracking-wide, text-tertiary.
- **Monospace / Numerical Data**: `font-mono`, tabular-nums (`font-variant-numeric: tabular-nums`).

---

## 5. Spacing System
Follow an 8-point grid with 4-point micro-adjustments:
- Micro: `4px` (gap-1), `8px` (gap-2), `12px` (gap-3)
- Standard: `16px` (p-4), `24px` (p-6), `32px` (p-8)
- Macro / Layout: `48px` (py-12), `64px` (py-16), `96px` (py-24)

