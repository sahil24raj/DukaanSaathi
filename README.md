# Dukaan Saathi (दुकान साथी) 🏪
### *AI-Powered Hindi/Hinglish Voice Assistant for Small Indian Kirana Stores*

[![Built for](https://img.shields.io/badge/Built%20for-Gnani%20AI%20Challenge-orange.svg)](https://gnani.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.2+-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)

---

## 📌 Executive Summary
**Dukaan Saathi** is an intelligent, voice-first billing and inventory assistant designed specifically for over 12 million small Indian neighborhood retailers (*kirana* stores, medical shops, general merchants in Tier-2/3 cities). 

Store owners or customers speak orders in natural **colloquial Hindi or Hinglish** (e.g. *"Bhaiya, do kilo chawal aur ek litre refined oil chahiye"*). Dukaan Saathi captures the audio, transcribes it via **Gnani Prisma v2.5 STT**, extracts items and quantities with **Gnani Evon v3.3 / Deterministic Hindi Rule Engine**, verifies live stock in SQLite, computes the total, and replies back with natural spoken Hindi audio using **Gnani Timbre v2.5 TTS** (*"Aapka order: 2 kilo chawal aur 1 litre refined oil. Total ₹300. Confirm karein?"*).

---

## 🎯 The Problem
1. **Peak-Hour Billing Bottlenecks**: During evening rushes, shopkeepers juggle mental math, handwritten slips (*kaccha parcha*), and phone inquiries.
2. **Dialect & Numerals Variety**: Real orders use colloquial units (*aadha kilo, pao, dedh, packet, bottle, tube*) that traditional English-centric POS software fails to understand.
3. **Noisy Bazaar Acoustic Environment**: Indian markets have ambient vehicle noise, market shouting, and low-bandwidth telephony audio.
4. **Manual Stock Discrepancies**: Physical stock is rarely updated in real-time because existing inventory software is overly complex.

---

## 👥 Target Users
- **Kirana Store Owners**: Daily staples, grains, oils, spices, and snacks.
- **Medical & Chemist Retailers**: Over-the-counter medicine and hygiene supplies.
- **General Stores & Recharge Outlets**: Packaged goods, soaps, shampoos, batteries.
- **Small Retailers across Tier-2/Tier-3 Indian Cities**: Retailers who prefer communicating in Hindi/Hinglish over complex English keyboards.

---

## 🌟 Key Features
- 🎙️ **One-Tap Voice Assistant ("Boliye")**: Real-time microphone capture with audio waveform visualization and WAV file upload support.
- 🗣️ **Hindi & Hinglish Natural Speech Understanding**: Accurately extracts Hindi numerals (*aadha, ek, do, teen, chaar, paanch, dedh, dhai*) and colloquial units (*kilo, litre, packet, bottle, tube*).
- 🔍 **Fuzzy Product & Alias Matching**: Resolves variants automatically (*chawal/chaval/rice*, *tel/oil/refined*, *atta/flour*, *cheeni/sugar*, *namak/salt*, *parle-g/biscuit*).
- 📦 **Automated Inventory & Stock Tracking**: Real-time stock validation, automated deduction upon order confirmation, and low-stock alerts (< 10 units).
- 🔊 **Voice Confirmation Spoken in Hindi**: Automatically speaks back order confirmation and total bill in natural Hindi tone.
- 📊 **Kirana Business Dashboard**: Real-time analytics tracking daily revenue, order volume, top 5 selling items, and low-stock inventory alerts.
- 📡 **Noise & Telephony Benchmark Suite**: Built-in testing tool with 4 synthetic audio benchmarks (Clean Hindi, Noisy Market, 8kHz Phone-Call, Fast Hinglish).
- 🛡️ **Zero PII & 100% Synthetic Privacy**: Zero collection of personal telephone numbers, PAN, Aadhaar, or sensitive customer details.

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │     Frontend: React + Vite + Tailwind CSS    │
                    │  (Boliye Hero UI • Orders • Inventory • Dash)│
                    └──────────────────────┬───────────────────────┘
                                           │
                        Audio / WAV / Text │ REST API
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         Backend: FastAPI (Python 3.14)       │
                    │  (Pydantic V2 • Modular Gnani AI Adapters)   │
                    └──────┬───────────────┬───────────────┬───────┘
                           │               │               │
        1. Speech-to-Text  │               │ 2. Order NLU  │ 3. Text-to-Speech
                           ▼               ▼               ▼
                 ┌───────────────────┐ ┌───────────────┐ ┌───────────────────┐
                 │Gnani Prisma v2.5  │ │Gnani Evon v3.3│ │Gnani Timbre v2.5  │
                 │(Hindi/Hinglish STT│ │or Deterministic│ │(Natural Hindi TTS│
                 │with Noise Filter) │ │Rule Parser    │ │Speech Generation) │
                 └───────────────────┘ └───────┬───────┘ └───────────────────┘
                                               │
                                               ▼
                                 ┌───────────────────────────┐
                                 │   SQLite + SQLAlchemy     │
                                 │(Products, Orders, Stock)  │
                                 └───────────────────────────┘
```

---

## 🤖 Gnani AI Models Utilized
1. **Gnani Prisma v2.5 STT**:
   - High-accuracy Speech-to-Text tailored for Indian accents, regional phonetics, and noisy telephony environments.
   - Endpoint adapter: `backend/app/services/gnani_stt.py`
2. **Gnani Timbre v2.5 TTS**:
   - Expressive text-to-speech synthesis generating warm, natural Hindi audio replies.
   - Endpoint adapter: `backend/app/services/gnani_tts.py`
3. **Gnani Evon v3.3 LLM / Deterministic Parser Fallback**:
   - Parses unstructured Hindi text into strict JSON order schemas.
   - If keys are missing, gracefully falls back to Dukaan Saathi's built-in deterministic Hindi regex parser.
   - Module: `backend/app/services/order_parser.py`

---

## 📁 Project Directory Structure
```
P1/
├── backend/
│   ├── app/
│   │   ├── config.py              # Settings & environment variables
│   │   ├── database.py            # SQLite database session & engine
│   │   ├── models.py              # SQLAlchemy Product, Order, OrderItem
│   │   ├── schemas.py             # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── catalog.py         # Fuzzy alias matcher & stock manager
│   │   │   ├── gnani_stt.py       # Gnani Prisma v2.5 STT adapter
│   │   │   ├── gnani_tts.py       # Gnani Timbre v2.5 TTS adapter
│   │   │   ├── order_parser.py    # Hindi/Hinglish NLU & rule fallback
│   │   │   └── audio_generator.py # Synthetic PCM 16kHz audio generator
│   │   ├── routers/
│   │   │   ├── products.py        # /api/products catalog endpoints
│   │   │   ├── voice.py           # /api/transcribe, /api/parse-order, /api/speak
│   │   │   ├── orders.py          # /api/orders endpoints
│   │   │   └── dashboard.py       # /api/dashboard & /api/system-status
│   │   └── main.py                # FastAPI entry point
│   ├── demo_audio/                # Pre-generated 4 synthetic WAV test files
│   ├── seed.py                    # Database catalog seed script
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/            # VoiceRecorder, OrderCard, Navbar, StatusIndicator
│   │   ├── pages/                 # OrderTaking, Orders, Inventory, Dashboard, DemoAudio, About
│   │   ├── services/api.ts        # Typed API & Web Speech synthesizer fallback
│   │   └── types/index.ts         # TypeScript data contracts
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── seed.py                        # Root convenience seed script
├── main.py                        # Root convenience backend launcher
├── .env.example                   # Environment configuration template
├── PROJECT_SUBMISSION.md          # Internship challenge submission summary
├── DEMO_SCRIPT.md                 # 60-second video demo walkthrough script
├── LINKEDIN_POST.md               # LinkedIn showcase post
└── README.md                      # Comprehensive documentation
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ and npm

### 1. Clone & Configure Environment
```bash
# Clone the repository
cd P1

# Create .env from template
cp .env.example .env
```
*(Optional) Add your Gnani API keys to `.env` if you have live console credentials:*
```ini
GNANI_API_KEY=your_gnani_api_key_here
GNANI_STT_ENDPOINT=https://api.gnani.ai/v2.5/stt
GNANI_TTS_ENDPOINT=https://api.gnani.ai/v2.5/tts
EVON_API_KEY=your_evon_key_here
```
> **Note**: If you don't have Gnani API keys yet, Dukaan Saathi runs in **High-Fidelity Mock & Local Synth Mode** automatically! You can test the complete voice order pipeline right out of the box with zero external dependencies.

---

### 2. Backend Setup & Seeding
```bash
# Install backend dependencies
python -m pip install -r backend/requirements.txt

# Seed the product catalog (Chawal, Atta, Dal, Oil, Sugar, Salt, Biscuit, Detergent, Shampoo, Toothpaste)
python seed.py

# Start the FastAPI server (runs on http://localhost:8000)
python -m uvicorn main:app --reload --port 8000
```

---

### 3. Frontend Setup
In a new terminal window:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck endpoint |
| `GET` | `/api/products` | Lists all products with prices, stock, and aliases |
| `PUT` | `/api/products/{id}` | Updates stock quantity or price |
| `POST` | `/api/products/seed` | Reseeds default 10 kirana products |
| `POST` | `/api/transcribe` | Accepts WAV audio file, calls Gnani Prisma v2.5 STT, returns transcript |
| `POST` | `/api/parse-order` | Takes transcript text, returns structured JSON items, prices, and Hindi voice reply |
| `POST` | `/api/orders` | Confirms order, validates and decrements stock, records order |
| `GET` | `/api/orders` | Retrieves recent orders history |
| `POST` | `/api/speak` | Takes Hindi reply text, returns synthesized WAV audio via Gnani Timbre |
| `GET` | `/api/speak/stream` | Audio stream endpoint for HTML5 audio playback |
| `GET` | `/api/dashboard` | Returns total orders, total revenue, top sellers, and low-stock warnings |
| `GET` | `/api/demo-samples` | Returns metadata and audio URLs for the 4 noise/telephony test cases |

---

## 🧪 Sample Audio & Test Cases

Try these Hindi/Hinglish utterances in the app:
1. **Clean Order**:
   - Spoken: *"Bhaiya, do kilo chawal aur ek litre refined oil chahiye."*
   - Extracted: 2 kg Chawal (₹120) + 1 litre Refined Oil (₹180) = **Total ₹300**
2. **Multiple Items**:
   - Spoken: *"paanch kg atta aur do packet biscuit dena"*
   - Extracted: 5 kg Atta (₹225) + 2 packet Biscuit (₹40) = **Total ₹265**
3. **Fractions & Numerals**:
   - Spoken: *"aadha kg cheeni aur ek kg salt"*
   - Extracted: 0.5 kg Sugar (₹24) + 1 kg Salt (₹25) = **Total ₹49**
4. **Hinglish FMCG**:
   - Spoken: *"ek bottle shampoo aur do toothpaste de do"*
   - Extracted: 1 bottle Shampoo (₹99) + 2 tube Toothpaste (₹150) = **Total ₹249**

---

## ⚠️ Limitations
- **Background Interference**: Extreme background noise (> 85dB SPL) may reduce phonetic confidence in low-end hardware microphones.
- **Dialect Lexicon**: Currently trained on standard Khari Boli Hindi, Hinglish, and common North/Central Indian bazaar idioms. Regional dialects (Bhojpuri, Maithili, Marwari) can be extended with fine-tuning.

---

## 🔮 Future Roadmap
- 📲 **WhatsApp Voice Integration**: Enable shopkeepers to receive voice notes over WhatsApp Business API and auto-generate PDF invoices.
- 🖨️ **Bluetooth Thermal Printer Integration**: One-click thermal receipt printing over Web Bluetooth.
- 🌐 **Expanded Indian Languages**: Extend pipeline to Tamil, Telugu, Kannada, Bengali, and Marathi using Gnani's 14+ Indian language models.
- 💳 **UPI QR Integration**: Spoken dynamic QR code display for instant payment collection.

---

## 👤 Author & Credits
- **Developer**: Sahil
- **Project**: Dukaan Saathi
- **Challenge**: Great Indian AI Internship Challenge by **Gnani AI**
- **License**: MIT License

