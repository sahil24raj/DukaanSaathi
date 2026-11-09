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
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <Radio className="w-3.5 h-3.5 text-amber-600" />
          <span>रॉबस्ट नॉइज़ और टेलीफोनी ऑडियो टेस्टिंग (Noise & Telephony Benchmarks)</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">डेमो ऑडियो सैंपल्स (Sample Voice Tests)</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Real-world Indian kirana conditions: acoustic reverberation, loud bazaar crowd chatter, 8kHz telephony bandwidth, and fast bilingual dialects.
          All test files are synthetic simulations ensuring zero PII.
        </p>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 text-emerald-900 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <strong>Privacy & Synthetic Guarantee:</strong> All demo audio samples and datasets are 100% synthetically generated.
          No real customer calls, phone numbers, Aadhaar, PAN, or personal financial data are collected or processed.
        </div>
      </div>

      {/* Samples List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">सैंपल्स लोड हो रहे हैं...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {samples.map((sample) => {
            const result = testResults[sample.id];
            const isTesting = testingSampleId === sample.id;

            return (
              <div
                key={sample.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {sample.category}
                    </span>
                    <span className="text-xs font-semibold text-amber-700">{sample.title_hi}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{sample.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{sample.description}</p>

                  {/* Synthetic Audio Player */}
                  <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="flex items-center">
                        <Volume2 className="w-3.5 h-3.5 mr-1 text-slate-400" /> Play Synthetic WAV
                      </span>
                      <span className="font-mono text-[10px]">16kHz Mono</span>
                    </div>
                    <audio
                      controls
                      src={sample.audio_url}
                      className="w-full h-8 mt-1"
                      preload="none"
                    />
                  </div>

                  {/* Transcript */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Ground Truth Transcript:
                    </span>
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs font-medium text-slate-900 italic">
                      "{sample.sample_text}"
                    </div>
                  </div>

                  {/* Expected vs Extracted */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Expected Order Items:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sample.expected_items.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded-md"
                        >
                          {it.qty} {it.unit} {it.product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Live Extracted Order Result (if tested) */}
                  {result && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                        <span className="flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Extracted Order (Success)
                        </span>
                        <span>₹{Math.round(result.total)}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mb-1">
                        Voice Reply: <em>"{result.hindi_reply}"</em>
                      </p>
                      <div className="text-[10px] text-emerald-700 font-mono">
                        Parser: {result.parse_method} • Confidence: {Math.round(result.confidence * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleRunSample(sample)}
                    disabled={isTesting}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <Play className={`w-3.5 h-3.5 fill-slate-700 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Parsing...' : 'Benchmark Extract'}</span>
                  </button>

                  {onLoadSampleIntoAssistant && (
                    <button
                      onClick={() => onLoadSampleIntoAssistant(sample.sample_text)}
                      className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center space-x-1 shadow-xs"
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
