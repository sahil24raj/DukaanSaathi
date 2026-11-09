import React from 'react';
import { SystemStatus } from '../types';
import { Cpu, Zap, Layers, Server, Globe2 } from 'lucide-react';

interface AboutPageProps {
  systemStatus: SystemStatus | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ systemStatus }) => {
  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-8 text-white">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Great Indian AI Internship Challenge by Gnani AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Dukaan Saathi <span className="text-emerald-400 font-normal text-2xl">(दुकान साथी)</span>
        </h1>
        <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">
          A production-quality Hindi/Hinglish Voice Assistant engineered specifically for 12+ million Indian Kirana and small retail store owners.
        </p>
      </div>

      {/* Target Users */}
      <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Globe2 className="w-5 h-5 text-emerald-400" />
          <span>लक्षित उपयोगकर्ता (Target Users & Problem Statement)</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          Small Indian grocery store owners face massive peak-hour rush, handwritten paper billing bottlenecks, linguistic dialect variations, and mental math mistakes. 
          Dukaan Saathi turns spoken colloquial Hindi and Hinglish into structured orders, checks live catalog inventory, computes the bill, and confirms in natural Hindi audio.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-zinc-800/60 rounded-2xl text-center border border-white/[0.05]">
            <span className="text-xl block mb-1">🏪</span>
            <span className="text-xs font-bold text-white block">Kirana Stores</span>
            <span className="text-[10px] text-neutral-400">Groceries & daily staples</span>
          </div>
          <div className="p-3.5 bg-zinc-800/60 rounded-2xl text-center border border-white/[0.05]">
            <span className="text-xl block mb-1">💊</span>
            <span className="text-xs font-bold text-white block">Medical Shops</span>
            <span className="text-[10px] text-neutral-400">Over-the-counter retail</span>
          </div>
          <div className="p-3.5 bg-zinc-800/60 rounded-2xl text-center border border-white/[0.05]">
            <span className="text-xl block mb-1">📱</span>
            <span className="text-xs font-bold text-white block">General Stores</span>
            <span className="text-[10px] text-neutral-400">Recharge & FMCG goods</span>
          </div>
          <div className="p-3.5 bg-zinc-800/60 rounded-2xl text-center border border-white/[0.05]">
            <span className="text-xl block mb-1">🏙️</span>
            <span className="text-xs font-bold text-white block">Tier-2/3 Retailers</span>
            <span className="text-[10px] text-neutral-400">Vernacular-first commerce</span>
          </div>
        </div>
      </div>

      {/* Gnani AI Pipeline Architecture */}
      <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Gnani AI Model Integrations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-zinc-800/50 backdrop-blur-sm">
            <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full inline-block">
              Speech-to-Text
            </span>
            <h4 className="font-extrabold text-sm text-white mt-2.5">Gnani Prisma v2.5</h4>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Optimized for regional Indian English, Hindi, and mixed dialect speech with high telephony and noisy background resilience.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-zinc-800/50 backdrop-blur-sm">
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-block">
              Text-to-Speech
            </span>
            <h4 className="font-extrabold text-sm text-white mt-2.5">Gnani Timbre v2.5</h4>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Natural, prosody-rich Hindi voice synthesis speaking back confirmation bills warmly to store owners and customers.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-zinc-800/50 backdrop-blur-sm">
            <span className="text-xs font-bold text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 rounded-full inline-block">
              Order Extraction
            </span>
            <h4 className="font-extrabold text-sm text-white mt-2.5">Evon v3.3 & Rules</h4>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Structured JSON order extraction with deterministic regex fallback for Hindi numerals (aadha, do, paanch, teen).
            </p>
          </div>
        </div>
      </div>

      {/* Technical Architecture Flow */}
      <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-neutral-400" />
          <span>Technical Architecture Flow</span>
        </h3>

        <div className="p-4 bg-zinc-950/80 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed border border-white/[0.08] shadow-inner">
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
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-zinc-900/60 rounded-3xl p-6 border border-emerald-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/30">
            S
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Project Contributor</h4>
            <p className="text-xs text-neutral-300">
              <strong>Sahil</strong> — full-stack development, product design, Gnani API integration, testing, demo.
            </p>
          </div>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Submission for <strong>Great Indian AI Internship Challenge by Gnani AI</strong>. 
          Built with React, TypeScript, Vite, Tailwind CSS, FastAPI, and SQLAlchemy.
        </p>
      </div>

      {/* Live System Configuration */}
      {systemStatus && (
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-3">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Active Server Configuration</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-800/60 rounded-xl border border-white/[0.05]">
              <span className="text-neutral-400 block font-mono text-[10px]">STT ENGINE</span>
              <strong className="text-white font-medium">{systemStatus.stt_engine}</strong>
            </div>
            <div className="p-3 bg-zinc-800/60 rounded-xl border border-white/[0.05]">
              <span className="text-neutral-400 block font-mono text-[10px]">TTS ENGINE</span>
              <strong className="text-white font-medium">{systemStatus.tts_engine}</strong>
            </div>
            <div className="p-3 bg-zinc-800/60 rounded-xl border border-white/[0.05]">
              <span className="text-neutral-400 block font-mono text-[10px]">PARSER ENGINE</span>
              <strong className="text-white font-medium">{systemStatus.parser_engine}</strong>
            </div>
            <div className="p-3 bg-zinc-800/60 rounded-xl border border-white/[0.05]">
              <span className="text-neutral-400 block font-mono text-[10px]">GNANI KEYS</span>
              <strong className={systemStatus.gnani_api_key_configured ? 'text-emerald-400' : 'text-amber-400'}>
                {systemStatus.gnani_api_key_configured ? 'Configured (Live)' : 'Not Set (.env fallback active)'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
