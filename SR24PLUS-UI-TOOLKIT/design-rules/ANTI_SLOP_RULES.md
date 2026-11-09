# Anti-Slop Engineering Rules & Audit Checklist

**Standard:** SR24PLUS Strict Quality Gate  
**Reference Repositories:** [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)

---

## 1. What is "AI Slop"?
AI Slop is the generic, thoughtless output produced when LLMs generate web code without strict taste constraints. It turns every website into an interchangeable dark-mode SaaS clone with purple gradient text, glowing rounded cards, and uninspired marketing fluff.

---

## 2. The Strict Anti-Slop Prohibitions

| Slop Pattern | Why It Fails | What To Do Instead |
| :--- | :--- | :--- |
| **Purple-to-Cyan Gradients Everywhere** | Looks like 2023 Crypto/AI template soup; destroys brand credibility. | Use solid, high-contrast typography or subtle 2-tone gradients anchored in your actual brand palette. |
| **Oversized Glassmorphism (`backdrop-blur-xl` on everything)** | Blurry backgrounds reduce text legibility and spike GPU fill-rate. | Use solid opaque or semi-opaque surfaces (`bg-neutral-900 border border-neutral-800`). |
| **Decorative Floating 3D Donuts/Blobs** | Meaningless visual noise that distracts from core value. | Render actual product screenshots, real data tables, or functional interactive widgets. |
| **Empty Emoji Headers ("🚀 Supercharge your ⚡ Workflow")** | Cheapens enterprise tone; looks like spam. | Use clear, authoritative prose paired with precision SVG icons (Lucide/Heroicons). |
| **Endless Repetitive 3-Column Card Grids** | Visual monotony; conveys no information priority. | Use asymmetric layouts, bento arrangements, or clean horizontal list rows with clear primary vs secondary emphasis. |
| **Full Page Scroll Locking** | Infuriates users, breaks accessibility screen readers and mouse wheels. | Keep normal document scroll; use sticky sidebars or standard timeline layouts. |
| **Fake Testimonials & Metric Badges** | Fabricated quotes ("John D., CEO of TechCorp") destroy user trust immediately. | Show honest developer metrics, customer case studies, or omit testimonials completely until real users provide them. |

---

## 3. Copywriting Anti-Slop Directives
- **Banned Words**: Never use:
  - *"Supercharge"*
  - *"Unleash"*
  - *"Revolutionize"*
  - *"Seamless"*
  - *"Next-gen / Next-generation"*
  - *"Game changer"*
  - *"Powering the future"*
- **Mandatory Writing Style**:
  - Plain, factual, active voice.
  - State **what the tool does**, **who it is for**, and **the exact metric or outcome**.
  - Example:  
    *Bad:* "Unleash next-gen AI power to supercharge your kirana store."  
    *Good:* "Speak in Hindi or Hinglish to take orders, check stock, and calculate bills in under 2 seconds."

---

## 4. Visual Quality Checklist (The Pre-Release Gate)
Before marking any UI task complete, run through this 10-point audit:
- [ ] 1. Is there a single brand primary color with clear purpose?
- [ ] 2. Are contrast ratios at least 4.5:1 for body copy (WCAG AA)?
- [ ] 3. Does the page look distinct without glowing purple borders?
- [ ] 4. Are icons SVG-based with consistent stroke width?
- [ ] 5. Does the UI work seamlessly on mobile (375px) without horizontal overflow?
- [ ] 6. Are buttons clearly distinguishable from background cards?
- [ ] 7. Are hover, active, and keyboard focus states implemented?
- [ ] 8. Are numbers tabular (`tabular-nums`) in data tables and currency displays?
- [ ] 9. Do animations complete in <300ms without blocking interaction?
- [ ] 10. Does the page convey its core value within 3 seconds of viewing?

