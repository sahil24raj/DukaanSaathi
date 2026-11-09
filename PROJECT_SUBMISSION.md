# Project Submission: Dukaan Saathi (दुकान साथी)

**Great Indian AI Internship Challenge by Gnani AI**  
**Submission Category**: Speech & Vernacular AI Applications  
**Candidate / Contributor**: **Sahil** — full-stack development, product design, Gnani API integration, testing, demo  

---

## 1. Project Title
**Dukaan Saathi (दुकान साथी)** — Hindi/Hinglish Voice Assistant for Small Indian Kirana Stores

---

## 2. Problem Statement
Over 12 million small neighborhood *kirana* stores, medical shops, and retail merchants form the economic backbone of Indian retail. However, during peak morning and evening rush hours:
- Shopkeepers face bottlenecks writing down items by hand or calculating bills mentally under noisy market conditions.
- Traditional Point-of-Sale (POS) software is rigid, desktop-bound, English-only, and completely detached from the reality of Indian shopkeepers who communicate in colloquial Hindi and Hinglish.
- Stock tracking is virtually non-existent or done through memory, leading to lost sales when high-demand items run out.
- Regional counting terms (*"aadha kilo", "dedh litre", "dhai packet", "pao"*) break conventional software.

---

## 3. Target Users
- **Kirana Store Owners**: Daily groceries, grains, flours, pulses, cooking oils, and spices.
- **Medical & Chemist Stores**: Rapid over-the-counter health and personal care items.
- **General Merchants & FMCG Stores**: Soaps, biscuits, detergents, toothpastes, shampoos.
- **Tier-2 & Tier-3 City Retailers**: Merchants who value speed, vernacular interaction, and zero complicated typing.

---

## 4. The Solution
**Dukaan Saathi** provides a frictionless voice-first interface:
1. **Speak Naturally**: The shopkeeper or customer taps the large **"Boliye"** mic button and speaks in everyday Hindi or Hinglish (e.g. *"Bhaiya, do kilo chawal aur ek litre refined oil chahiye"*).
2. **Vernacular Speech Recognition**: The audio is processed by **Gnani Prisma v2.5 STT**, optimized for Indian accents, ambient bazaar noise, and telephony bandwidth.
3. **Smart Order Understanding**: Dukaan Saathi parses Hindi numbers, fractions, colloquial units, and matches raw words (*chaval, tel, cheeni, surf*) against the store catalog using fuzzy alias matching.
4. **Instant Stock Verification & Calculation**: The system verifies inventory, computes prices, and checks stock availability in a lightweight local SQLite database.
5. **Natural Spoken Response**: Using **Gnani Timbre v2.5 TTS**, Dukaan Saathi speaks back the order confirmation and total bill warmly in Hindi (*"Aapka order: 2 kilo chawal aur 1 litre refined oil. Total ₹300. Confirm karein?"*).
6. **Automated Inventory & Analytics**: Confirming the order automatically decrements stock, prints/saves the digital receipt, and updates the live sales dashboard.

---

## 5. Gnani AI Models & Architecture Used
- **Gnani Prisma v2.5 STT**: Speech-to-text engine for transcribing Hindi/Hinglish speech with noisy background tolerance.
- **Gnani Timbre v2.5 TTS**: Voice synthesis engine generating high-prosody, natural-sounding Hindi voice responses.
- **Gnani Evon v3.3 / Deterministic Rule Parser**: Structured JSON entity extraction for kirana items, quantities, and units with guaranteed fallback.
- **Modular Adapter Architecture**: Fully isolated API client layers (`gnani_stt.py`, `gnani_tts.py`, `order_parser.py`) with zero-downtime mock mode and `.env` configuration.

---

## 6. Member Contribution
> **Sahil — full-stack development, product design, Gnani API integration, testing, demo**
- Designed end-to-end user experience and bilingual (Hindi/English) UI in React and Tailwind CSS.
- Implemented Python FastAPI backend with SQLAlchemy SQLite models and REST endpoints.
- Built fuzzy product matching, Hindi numeral parsing (*aadha, ek, do, teen, chaar, paanch*), and colloquial unit converters.
- Engineered resilient adapters for Gnani Prisma v2.5 and Timbre v2.5 with synthetic audio generator and mock fallbacks.
- Developed the noise and telephony benchmark suite with 4 synthetic audio test cases.
- Authored test suites, database seeds, and documentation.

---

## 7. Demo Video Script (60 Seconds)

See [DEMO_SCRIPT.md](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/P1/DEMO_SCRIPT.md) for the complete timestamped walkthrough script.

