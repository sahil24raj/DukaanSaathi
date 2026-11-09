import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DemoSample, ParsedOrderResponse } from '../types';
import { Radio, Play, CheckCircle2, ArrowRight, ShieldCheck, Volume2 } from 'lucide-react';

interface DemoAudioPageProps {
  onLoadSampleIntoAssistant?: (text: string) => void;
}

export const DemoAudioPage: React.FC<DemoAudioPageProps> = ({ onLoadSampleIntoAssistant }) => {
  const [samples, setSamples] = useState<DemoSample[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testingSampleId, setTestingSampleId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, ParsedOrderResponse>>({});

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const data = await api.getDemoSamples();
        setSamples(data);
      } catch (err) {
        console.error('Failed to load demo samples:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  const handleRunSample = async (sample: DemoSample) => {
    setTestingSampleId(sample.id);
    try {
      const parsed = await api.parseOrder(sample.sample_text);
      setTestResults((prev) => ({ ...prev, [sample.id]: parsed }));
    } catch (err) {
      console.error('Error testing sample:', err);
    } finally {
      setTestingSampleId(null);
    }
  };

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-6 text-white">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2 backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>रॉबस्ट नॉइज़ और टेलीफोनी ऑडियो टेस्टिंग (Noise & Telephony Benchmarks)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          डेमो ऑडियो सैंपल्स <span className="text-emerald-400 font-normal text-xl">(Sample Voice Tests)</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          Real-world Indian kirana conditions: acoustic reverberation, loud bazaar crowd chatter, 8kHz telephony bandwidth, and fast bilingual dialects.
          All test files are synthetic simulations ensuring zero PII.
        </p>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center space-x-3.5 text-emerald-300 text-xs backdrop-blur-md">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <strong className="text-white">Privacy & Synthetic Guarantee:</strong> All demo audio samples and datasets are 100% synthetically generated.
          No real customer calls, phone numbers, Aadhaar, PAN, or personal financial data are collected or processed.
        </div>
      </div>

      {/* Samples List */}
      {loading ? (
        <div className="text-center py-16 bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/[0.08] text-neutral-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">सैंपल्स लोड हो रहे हैं...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {samples.map((sample) => {
            const result = testResults[sample.id];
            const isTesting = testingSampleId === sample.id;

            return (
              <div
                key={sample.id}
                className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-800 text-neutral-300 border border-white/[0.05]">
                      {sample.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">{sample.title_hi}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{sample.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{sample.description}</p>

                  {/* Synthetic Audio Player */}
                  <div className="mt-4 bg-zinc-800/60 p-3 rounded-2xl border border-white/[0.05]">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                      <span className="flex items-center">
                        <Volume2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Play Synthetic WAV
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">16kHz Mono</span>
                    </div>
                    <audio
                      controls
                      src={sample.audio_url}
                      className="w-full h-8 mt-1 accent-emerald-500"
                      preload="none"
                    />
                  </div>

                  {/* Transcript */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Ground Truth Transcript:
                    </span>
                    <div className="p-3 bg-zinc-800/70 border border-white/[0.08] rounded-xl text-xs font-medium text-neutral-200 italic">
                      "{sample.sample_text}"
                    </div>
                  </div>

                  {/* Expected vs Extracted */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Expected Order Items:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sample.expected_items.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-zinc-800 text-neutral-300 font-medium px-2.5 py-1 rounded-lg border border-white/[0.05]"
                        >
                          {it.qty} {it.unit} {it.product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Live Extracted Order Result (if tested) */}
                  {result && (
                    <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl animate-fadeIn space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1">
                        <span className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                          Extracted Order (Success)
                        </span>
                        <span className="font-mono text-sm text-emerald-400 font-extrabold">₹{Math.round(result.total).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[11px] text-neutral-300 mb-1">
                        Voice Reply: <em className="text-emerald-300">"{result.hindi_reply}"</em>
                      </p>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        Parser: {result.parse_method} • Confidence: {Math.round(result.confidence * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => handleRunSample(sample)}
                    disabled={isTesting}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-neutral-200 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current text-emerald-400 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Parsing...' : 'Benchmark Extract'}</span>
                  </button>

                  {onLoadSampleIntoAssistant && (
                    <button
                      onClick={() => onLoadSampleIntoAssistant(sample.sample_text)}
                      className="py-2.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition flex items-center space-x-1 shadow-md shadow-emerald-500/20 cursor-pointer"
                      title="Run inside voice assistant hero"
                    >
                      <span>Try in Assistant</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
