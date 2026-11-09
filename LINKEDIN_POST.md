# 📢 LinkedIn Post: Dukaan Saathi (दुकान साथी)

Copy-pasteable post for LinkedIn submission and public showcase:

---

Over 12 million neighborhood *kirana* stores power everyday India. Yet, during peak rush hours, shopkeepers are still forced to balance handwritten slips, mental math, and desktop software that only understands English.

To solve this, I built **Dukaan Saathi (दुकान साथी)** for the **Great Indian AI Internship Challenge by Gnani.ai** 🚀

🏪 **What is Dukaan Saathi?**  
It is a voice-first, vernacular assistant tailored specifically for Indian kirana store owners. Instead of typing, the shopkeeper or customer simply speaks an order in natural colloquial Hindi or Hinglish:

🗣️ *"Bhaiya, do kilo chawal aur ek litre refined oil chahiye."*

Here is how the end-to-end AI pipeline brings it to life in under 800ms:

1️⃣ **Voice Transcription via Gnani Prisma v2.5 STT**: Transcribes colloquial Indian accents with resilience to bustling market noise and 8kHz telephony audio.  
2️⃣ **Order Intelligence & NLU (Gnani Evon v3.3 + Deterministic Fallback)**: Automatically parses Hindi numbers (*aadha, ek, do, teen, paanch*), units (*kilo, litre, packet, bottle, tube*), and uses fuzzy alias matching to map variants like *"chaval"*, *"tel"*, and *"surf"* to the store catalog.  
3️⃣ **Inventory & Billing**: Checks live stock in SQLite, calculates line items, and deducts inventory on confirmation.  
4️⃣ **Spoken Natural Hindi Voice via Gnani Timbre v2.5 TTS**: The dukaan speaks back the confirmation:  
🔊 *"Aapka order: 2 kilo chawal aur 1 litre refined oil. Total ₹300. Confirm karein?"*  
5️⃣ **Store Analytics Dashboard**: Real-time sales metrics, top-selling items, and low-stock alerts (< 10 units) for proactive replenishment.

💡 **Key Takeaways from the Build**:
- Built with a modern full-stack architecture: React, TypeScript, Vite, Tailwind CSS, Python FastAPI, and SQLite.
- Clean adapter design ensures the app works seamlessly with live Gnani API endpoints or with fallback local synthesis for local development.
- Zero PII: 100% synthetic audio and simulated data ensuring privacy compliance.

Building for Bharat means building voice-first and vernacular-first. Excited to share this prototype!

Check out the code and demo script on GitHub: [Link to Repo]

#GnaniAI #GreatIndianAIInternshipChallenge #VoiceAI #ConversationalAI #SpeechToText #TextToSpeech #FastAPI #React #FullStack #BharatTech #ArtificialIntelligence #IndianStartups

