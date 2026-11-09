# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Small kirana (neighborhood grocery) shop owners and attendants across India (Tier-1, Tier-2, Tier-3 cities and towns).
- Small retail merchants (general stores, FMCG outlets, medical and recharge kiosks).
- Hindi-speaking and regional-language operators with limited technical or typing fluency who prioritize speed, accuracy, and ease of use over complex ERP interfaces.

## Product Purpose

Dukan Sathi (दुकान साथी) is an AI-powered business management platform and voice partner engineered specifically for Indian kirana and local retail shopkeepers. It eliminates manual paper note-taking (*kaccha khata / parcha*), mental math errors during rush hours, and inventory guessing by letting shopkeepers operate sales, stock, credit (*udhaar*), and accounts simply by speaking in natural Hindi and Hinglish.

## Positioning

Unlike generic SaaS point-of-sale systems built for Western supermarkets or modern barcode-heavy retail, Dukan Sathi understands regional colloquial Hindi speech, fractions (*aadha kilo, pao, dedh, dhai*), multi-item commands (*"Raju ko do kilo chini aur ek packet surf de do"*), customer credit ledgers (*udhaar khata*), and local product aliases (*cheeni/shakkar, tel/refined, atta/gehu ka atta*) hands-free with real-time stock and ledger reconciliation.

## Operating Context

- High-distraction, noisy Indian market environments with crowded counters and peak morning/evening rushes.
- Dusty physical counters where hands are often handling grain bags, oil packets, or weighing scales.
- Mobile, tablet, or counter laptop environments where typing long product names or numbers is slow and error-prone.
- Dual-language operation: Hindi (Devanagari) and Hinglish (Latin transliteration) alongside clear Indian Rupee (₹) financial metrics.

## Capabilities and Constraints

- **Voice-Driven Order Taking & POS**: Real-time Hindi/Hinglish speech recognition, intent and entity parsing, item matching, and spoken confirmation response in Hindi.
- **Smart Billing & POS**: Rapid product search, fast quantity adjustments, cart with GST and discounts, cash & UPI payment capture, printable invoices (*kaccha aur pakka bill*).
- **Inventory & Stock Tracking**: Real-time stock alerts (< 10 units), purchase and selling price records, one-tap stock adjustments.
- **Customer Udhaar Ledger (खाता)**: Customer profiles, running credit balance, recording partial payments, payment reminders, transaction timeline.
- **Business Analytics**: Today's sales, gross profit, daily/monthly reports, top-selling items, cash vs. UPI vs. udhaar breakdown.
- **Resilience & Fallbacks**: Fully operational deterministic rule parser fallback when external LLMs are unreachable; synthetic and Web Speech audio fallbacks.
- **Privacy Guarantee**: Zero tracking or collection of personal phone numbers, Aadhaar, PAN, or financial credentials.

## Brand Commitments

- **Name**: Dukan Sathi (दुकान साथी) — "Your Smart Digital Business Partner".
- **Tone & Personality**: Friendly, trustworthy, practical, intelligent, and deeply rooted in Indian retail reality.
- **Visual Stance**: Clean, professional, and accessible Indian retail tech aesthetic. Warm saffron/amber (`#d97706` / `#b45309`) and deep bahi-khata ledger emerald green (`#047857`), paired with crisp paper white and slate tones. Avoid generic SaaS purples, excessive glowing gradients, or unnecessary glassmorphism.

## Evidence on Hand

- Production-grade FastAPI backend with SQLite database tracking products, orders, items, and inventory.
- Seeded Kirana catalog with 10 standard categories, Hindi aliases, and realistic prices.
- Built-in synthetic audio generation and 4 real-world test cases (Clean Hindi, Noisy Bazaar, Telephony 8kHz, Fast Hinglish).
- 7/7 passing backend unit tests verified in test suite.

## Product Principles

1. **Speak, Don't Type**: The voice interface is a first-class citizen, not an afterthought. Every core transaction can be initiated by speaking.
2. **Respect the Rush**: Zero multi-step confirmation modals during active billing. Every millisecond counts when a line of customers is waiting.
3. **Clarity Over Cleverness**: Numbers, currency symbols, and quantities must be legible from 3 feet away on a low-brightness counter screen.
4. **Honest Bahi-Khata Trust**: Udhaar and cash accounting must mirror traditional Indian ledger habits with zero hidden calculations.
5. **Robust Without Internet Surprises**: The shop continues operating even with spotty connectivity or missing cloud keys.
