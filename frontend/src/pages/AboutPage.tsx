import React from 'react';
import { SystemStatus } from '../types';
import { Cpu, Zap, Layers, Server, Globe2 } from 'lucide-react';

interface AboutPageProps {
  systemStatus: SystemStatus | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ systemStatus }) => {
  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Great Indian AI Internship Challenge by Gnani AI</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Dukaan Saathi (दुकान साथी)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          A production-quality Hindi/Hinglish Voice Assistant engineered specifically for 12+ million Indian Kirana and small retail store owners.
        </p>
      </div>

      {/* Target Users */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Globe2 className="w-5 h-5 text-amber-600" />
          <span>लक्षित उपयोगकर्ता (Target Users & Problem Statement)</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Small Indian grocery store owners face massive peak-hour rush, handwritten paper billing bottlenecks, linguistic dialect variations, and mental math mistakes. 
          Dukaan Saathi turns spoken colloquial Hindi and Hinglish into structured orders, checks live catalog inventory, computes the bill, and confirms in natural Hindi audio.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl text-center">
            <span className="text-xl block mb-1">🏪</span>
            <span className="text-xs font-bold text-slate-800 block">Kirana Stores</span>
            <span className="text-[10px] text-slate-500">Groceries & daily staples</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-center">
            <span className="text-xl block mb-1">💊</span>
            <span className="text-xs font-bold text-slate-800 block">Medical Shops</span>
            <span className="text-[10px] text-slate-500">Over-the-counter retail</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-center">
            <span className="text-xl block mb-1">📱</span>
            <span className="text-xs font-bold text-slate-800 block">General Stores</span>
            <span className="text-[10px] text-slate-500">Recharge & FMCG goods</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-center">
            <span className="text-xl block mb-1">🏙️</span>
            <span className="text-xs font-bold text-slate-800 block">Tier-2/3 Retailers</span>
            <span className="text-[10px] text-slate-500">Vernacular-first commerce</span>
          </div>
        </div>
      </div>

      {/* Gnani AI Pipeline Architecture */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-emerald-600" />
          <span>Gnani AI Model Integrations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Speech-to-Text
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 mt-2">Gnani Prisma v2.5</h4>
            <p className="text-xs text-slate-500 mt-1">
              Optimized for regional Indian English, Hindi, and mixed dialect speech with high telephony and noisy background resilience.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Text-to-Speech
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 mt-2">Gnani Timbre v2.5</h4>
            <p className="text-xs text-slate-500 mt-1">
              Natural, prosody-rich Hindi voice synthesis speaking back confirmation bills warmly to store owners and customers.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
            <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
              Order Extraction
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 mt-2">Evon v3.3 & Rules</h4>
            <p className="text-xs text-slate-500 mt-1">
              Structured JSON order extraction with deterministic regex fallback for Hindi numerals (aadha, do, paanch, teen).
            </p>
          </div>
        </div>
      </div>

      {/* Technical Architecture Flow */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-slate-700" />
          <span>Technical Architecture Flow</span>
        </h3>

        <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
          <pre>{`[Shopkeeper / Customer Voice (Mic or WAV)]
       │
       ▼  (Browser MediaRecorder API)
[FastAPI Backend: /api/transcribe]
       │
       ▼  (Gnani Prisma v2.5 STT)
[Hindi/Hinglish Transcript: "Bhaiya, do kilo chawal aur ek litre refined oil"]
       │
       ▼  (Gnani Evon LLM / Deterministic Rule-based Parser)
[Structured JSON: { Chawal: 2kg, Refined Oil: 1L }]
       │
       ▼  (SQLite Database Catalog + Fuzzy Alias Matching)
[Stock Verification: Chawal (50kg avail), Oil (20L avail) -> Bill: ₹300]
       │
       ▼  (Gnani Timbre v2.5 TTS)
[Natural Hindi Audio: "Aapka order: 2 kilo chawal aur 1 litre refined oil. Total ₹300. Confirm karein?"]
       │
       ▼
[User Confirms -> Deducts Stock -> Saves to Orders SQLite -> Updates Dashboard]`}</pre>
        </div>
      </div>

      {/* Submission Credentials & Author Info */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 rounded-3xl p-6 border border-amber-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-950">Project Contributor</h4>
            <p className="text-xs text-slate-600">
              <strong>Sahil</strong> — full-stack development, product design, Gnani API integration, testing, demo.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Submission for <strong>Great Indian AI Internship Challenge by Gnani AI</strong>. 
          Built with React, TypeScript, Vite, Tailwind CSS, FastAPI, and SQLAlchemy.
        </p>
      </div>

      {/* Live System Configuration */}
      {systemStatus && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Server className="w-4 h-4 text-slate-500" />
            <span>Active Server Configuration</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block font-mono text-[10px]">STT ENGINE</span>
              <strong className="text-slate-800">{systemStatus.stt_engine}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block font-mono text-[10px]">TTS ENGINE</span>
              <strong className="text-slate-800">{systemStatus.tts_engine}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block font-mono text-[10px]">PARSER ENGINE</span>
              <strong className="text-slate-800">{systemStatus.parser_engine}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block font-mono text-[10px]">GNANI KEYS</span>
              <strong className={systemStatus.gnani_api_key_configured ? 'text-emerald-700' : 'text-amber-700'}>
                {systemStatus.gnani_api_key_configured ? 'Configured (Live)' : 'Not Set (.env fallback active)'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
