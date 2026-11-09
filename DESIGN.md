# Design System: Dukan Sathi (दुकान साथी)

<!-- impeccable:design-schema 1 -->

## Design Direction & Ethos

Dukan Sathi is a distinctive, trustworthy, and modern Indian retail technology platform. It deliberately departs from generic Western AI SaaS templates (excessive purple gradients, floating cards, artificial glassmorphism, decorative illustrations) in favor of **authentic, practical Indian retail utility**:

- **Bahi-Khata Trust**: Grounded in the enduring visual reassurance of Indian ledger accounting — sharp contrast, clean tabular lines, clear green credit receipts, and amber warning states.
- **Counter Visibility**: High visual hierarchy optimized for counter tablets, laptops, and mobile screens viewed from an arm's length in diverse shop lighting.
- **Devanagari-First Typography**: Seamless pairing of Inter for crisp Latin numerals/tabular figures with Noto Sans Devanagari for warm Hindi phrasing.

---

## Color Palette & Semantic Tokens

### Primary Brand
- `brand-primary` / **Deep Saffron Amber**: `#d97706` (Amber-600) / Hover: `#b45309` (Amber-700) / Light: `#fef3c7` (Amber-100)
- `brand-secondary` / **Ledger Emerald Green**: `#047857` (Emerald-700) / Dark: `#065f46` (Emerald-800) / Light: `#d1fae5` (Emerald-100)

### Surfaces & Backgrounds
- `surface-canvas`: `#f8fafc` (Slate-50) / `#fdfbf7` (Warm Canvas White)
- `surface-card`: `#ffffff` (Pure White)
- `surface-subtle`: `#f1f5f9` (Slate-100)
- `surface-muted`: `#e2e8f0` (Slate-200)

### Borders & Dividing Lines
- `border-default`: `#e2e8f0` (Slate-200)
- `border-subtle`: `#f1f5f9` (Slate-100)
- `border-accent`: `#fde68a` (Amber-200)

### Text Hierarchy
- `text-primary`: `#0f172a` (Slate-900) — High contrast for bills, names, and key metrics
- `text-secondary`: `#475569` (Slate-600) — Sublabels, units, and dates
- `text-muted`: `#94a3b8` (Slate-400) — Secondary details and placeholders
- `text-inverse`: `#ffffff` (White)

### Feedback & Status Tokens
- `status-success`: `#059669` (Emerald-600) / Background: `#ecfdf5`
- `status-warning` (Low stock / Pending): `#d97706` (Amber-600) / Background: `#fffbeb`
- `status-danger` (Overdue udhaar / Out of stock): `#dc2626` (Red-600) / Background: `#fef2f2`
- `status-info`: `#0284c7` (Sky-600) / Background: `#f0f9ff`

---

## Typography Standards

- **Primary Typeface**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Vernacular Devanagari Typeface**: `Noto Sans Devanagari`, `system-ui`, `sans-serif`
- **Tabular Numerals**: `font-variant-numeric: tabular-nums` for all price columns, calculations, and stock counts
- **Scale Hierarchy**:
  - `Hero Headline`: `text-3xl sm:text-4xl font-extrabold tracking-tight`
  - `Section Title`: `text-xl sm:text-2xl font-bold tracking-tight text-slate-900`
  - `Card / Widget Title`: `text-base font-semibold text-slate-800`
  - `Body Text`: `text-sm leading-relaxed text-slate-600`
  - `Caption & Metadata`: `text-xs font-medium text-slate-500`
  - `Key Metric / Price`: `text-2xl sm:text-3xl font-black text-slate-900`

---

## Elevation & Depth

- Avoid hard black drop-shadows or unblurred neon glows.
- Use multi-layer soft ambient shadows with a slight warm tint:
  - `elevation-card`: `box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)`
  - `elevation-hover`: `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)`
  - `elevation-modal`: `box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

---

## Component Language

1. **Large Touch-Friendly Buttons**: Minimum `44px` touch targets with clear active/disabled states.
2. **Tabular Ledgers**: Clean, border-lined transaction rows with right-aligned numerical amounts.
3. **Hero Voice Interaction Element**: Central, distinct mic affordance with state-driven visual feedback (Idle, Listening, Processing, Speaking).
4. **Print-Friendly Bill Structure**: Invoices render cleanly in both high-contrast screen mode and black-and-white standard 80mm thermal receipt and A4 printouts.

