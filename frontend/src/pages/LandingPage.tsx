import React, { useState } from 'react';
import { 
  Mic, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Boxes, 
  CreditCard, 
  Receipt, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenVoiceDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenVoiceDemo }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [simulatedSample, setSimulatedSample] = useState<number>(0);

  const demoSamples = [
    {
      text: 'Bhaiya, do kilo chawal aur ek litre refined oil chahiye.',
      items: [
        { name: 'Chawal (चावल)', qty: '2 kg', price: 120 },
        { name: 'Refined Oil (तेल)', qty: '1 L', price: 140 }
      ],
      total: 260
    },
    {
      text: 'Paanch kg atta aur do packet Parle-G biscuit dena jaldi se.',
      items: [
        { name: 'Atta (आटा)', qty: '5 kg', price: 180 },
        { name: 'Biscuit (बिस्कुट)', qty: '2 pkt', price: 20 }
      ],
      total: 200
    },
    {
      text: 'Aadha kilo cheeni aur ek packet Tata namak de do.',
      items: [
        { name: 'Cheeni (चीनी)', qty: '0.5 kg', price: 24 },
        { name: 'Tata Namak (नमक)', qty: '1 pkt', price: 28 }
      ],
      total: 52
    }
  ];

  const currentSample = demoSamples[simulatedSample];

  const handleCycleSample = () => {
    setSimulatedSample((prev) => (prev + 1) % demoSamples.length);
  };

  const features = [
    {
      icon: Mic,
      title: 'आवाज़ से बिलिंग (Voice-First Billing)',
      desc: 'टाइपिंग छोड़िए। बस बोलिए: "2 किलो चीनी, 1 लीटर तेल" और सिस्टम तुरंत बिल, मात्रा और स्टॉक कैलकुलेट कर देगा।'
    },
    {
      icon: Receipt,
      title: 'तेज़ POS और थर्मल प्रिंट (5-Second POS)',
      desc: 'काउंटर रश में 5 सेकंड में बिल बनाएं। 80mm/58mm थर्मल प्रिंटर से पर्चा निकालें या WhatsApp पर भेजें।'
    },
    {
      icon: CreditCard,
      title: 'डिजिटल बही-खाता (Udhaar Khata)',
      desc: 'ग्राहक के नाम से उधारी जोड़ें और जमा दर्ज करें। हिसाब में शून्य गलती और WhatsApp पेमेंट रिमाइंडर की सुविधा।'
    },
    {
      icon: Boxes,
      title: 'लाइव स्टॉक ट्रैकिंग (Live Inventory)',
      desc: 'बिल बनते ही स्टॉक स्वतः घटता है। कम स्टॉक होने पर तत्काल अलर्ट मिलता है ताकि बिक्री कभी न रुके।'
    },
    {
      icon: TrendingUp,
      title: 'दैनिक मुनाफा व रिपोर्ट (Daily Analytics)',
      desc: 'आज कितनी कुल बिक्री हुई, कितना नकद आया, कितना UPI और कौन सा सामान सबसे ज्यादा बिका — सब एक नज़र में।'
    },
    {
      icon: ShieldCheck,
      title: '100% सुरक्षित और स्थानीय डेटा (Local Engine)',
      desc: 'कोई गैर-ज़रूरी फोन नंबर या आधार डेटा नहीं। ऑफलाइन मोड और स्थानीय SQLite डेटाबेस के साथ सुरक्षित।'
    }
  ];

  const comparisonRows = [
    {
      feature: 'आर्डर लेने की गति (Speed)',
      traditional: 'पेन-कॉपी पर 2-3 मिनट',
      complexPos: 'कीबोर्ड/बारकोड पर 1-2 मिनट',
      dukaanSaathi: 'सिर्फ 3 सेकंड — बोलकर'
    },
    {
      feature: 'उधार हिसाब (Udhaar Tracking)',
      traditional: 'डायरी के पन्ने पलटना, हिसाब में चूक',
      complexPos: 'जटिल एकाउंटिंग सॉफ्टवेयर',
      dukaanSaathi: '1-क्लिक ग्राहक खाता + WhatsApp पर्चा'
    },
    {
      feature: 'भाषा और बोलचाल (Language)',
      traditional: 'स्थानीय बोली',
      complexPos: 'सिर्फ अंग्रेज़ी',
      dukaanSaathi: 'हिंदी, हिंग्लिश और बोलचाल की भाषा'
    },
    {
      feature: 'हार्डवेयर की आवश्यकता (Hardware)',
      traditional: 'कागज़ और डायरी',
      complexPos: '₹40,000+ का भारी कंप्यूटर/मशीन',
      dukaanSaathi: 'कोई भी सामान्य फोन, टैबलेट या लैपटॉप'
    }
  ];

  const faqs = [
    {
      q: 'क्या यह ऐप हिंदी और हिंग्लिश समझता है?',
      a: 'हाँ, दुकान साथी को विशेष रूप से भारतीय किराना स्टोर की बोलचाल की हिंदी और हिंग्लिश के लिए तैयार किया गया है। यह "आधा किलो", "डेढ़ लीटर", "दो पैकेट" जैसी सभी स्थानीय इकाइयों को सटीक समझता है।'
    },
    {
      q: 'अगर दुकान में इंटरनेट न हो या धीमा हो तो?',
      a: 'दुकान साथी का कोर बिलिंग और कैटलॉग इंजन स्थानीय रूप से काम करता है। इंटरनेट धीमा होने पर भी इसका नियम-आधारित पार्सर पूरी तेज़ी से आर्डर बनाता है।'
    },
    {
      q: 'क्या इसके लिए किसी महंगे कंप्यूटर की ज़रूरत है?',
      a: 'बिल्कुल नहीं। यह किसी भी सामान्य मोबाइल फोन, टैबलेट, लैपटॉप या पुराने काउंटर पीसी पर किसी भी ब्राउज़र में तुरंत चलता है।'
    },
    {
      q: 'क्या हम थर्मल प्रिंटर से पर्चा निकाल सकते हैं?',
      a: 'हाँ, हर बिल पर एक-क्लिक प्रिंट विकल्प है जो 80mm और 58mm थर्मल प्रिंटर तथा सामान्य A4 प्रिंटर दोनों पर साफ बिल निकालता है।'
    }
  ];

  return (
    <div className="bg-transparent text-neutral-200 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 3D Interactive Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-white/[0.08]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/[0.06] blur-[150px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Domain Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Voice AI for Indian Kirana & Retail Stores</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                अब दुकान संभालेगा आपका{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  स्मार्ट साथी
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
                Sales, stock, udhaar aur hisaab — sab kuch ek jagah. Bas boliye aur Dukaan Saathi turant bill banayega.
              </p>

              {/* Conversion Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
                >
                  <span>POS बिलिंग शुरू करें (Start Billing)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={onOpenVoiceDemo}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 text-white border border-white/[0.12] hover:border-emerald-500/50 font-semibold text-sm transition-all backdrop-blur-md active:scale-95 cursor-pointer shadow-md"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>लाइव वॉयस असिस्टेंट (Boliye)</span>
                </button>
              </div>

              {/* Real Operational Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">
                    &lt; 280ms
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium mt-0.5">
                    Gnani STT Latency
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-400">
                    100%
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium mt-0.5">
                    Offline Rule Fallback
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">
                    ₹0
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium mt-0.5">
                    No Proprietary Machine
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Interactive POS Terminal Glass HUD (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-zinc-950/50 backdrop-blur-xl border border-white/[0.12] p-6 shadow-2xl overflow-hidden group">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                      LIVE VOICE BILLING HUD
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 font-mono bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.08]">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Gnani Prisma v2.5</span>
                  </div>
                </div>

                {/* Voice Simulation Prompter */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-400 uppercase tracking-wider text-[10px] font-bold flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Customer Voice Order:</span>
                    </span>
                    <button
                      onClick={handleCycleSample}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Next Order</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] relative group-hover:border-emerald-500/30 transition-colors">
                    <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                      &ldquo;{currentSample.text}&rdquo;
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>Hindi Natural Speech</span>
                      <span className="text-emerald-400 font-bold">100% Parsed</span>
                    </div>
                  </div>

                  {/* Extracted Bill Items */}
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 pb-1.5">
                      Live Parsed Line Items
                    </div>
                    <div className="divide-y divide-white/[0.06] bg-black/30 rounded-xl px-3 py-1 border border-white/[0.06]">
                      {currentSample.items.map((it, idx) => (
                        <div key={idx} className="py-2 flex justify-between items-center text-xs">
                          <span className="text-neutral-200 font-medium">
                            {it.name} <span className="text-neutral-500 font-mono text-[11px]">({it.qty})</span>
                          </span>
                          <span className="font-mono font-bold text-white tabular-nums">
                            ₹{it.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-neutral-400 block">
                        Calculated Total
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">GST & Discounts Auto-applied</span>
                    </div>
                    <span className="text-2xl font-black font-mono tabular-nums text-emerald-400">
                      ₹{currentSample.total}
                    </span>
                  </div>

                  {/* Action inside HUD */}
                  <div className="pt-2">
                    <button
                      onClick={onOpenVoiceDemo}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-emerald-900/40"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>माइक से नया आर्डर बोलें (Try Live Voice)</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6 Core Kirana Capabilities (Bento Style) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
            दुकानदार की ज़रूरतें (Engineered For Retail)
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            किराना व्यापार को आसान बनाने वाले 6 टूल्स
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison: Diary vs Heavy POS vs Dukaan Saathi */}
      <section className="py-16 bg-zinc-950/30 backdrop-blur-xl border-y border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              पारंपरिक तरीके बनाम दुकान साथी
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              कागज़ की डायरी और भारी ₹40,000 की मशीनों के मुकाबले दुकान साथी क्यों बेहतर है
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-900/80 text-neutral-300 font-bold uppercase tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">सुविधा (Feature)</th>
                  <th className="py-3.5 px-4 text-neutral-500 font-medium">पेन-कॉपी डायरी</th>
                  <th className="py-3.5 px-4 text-neutral-500 font-medium">भारी POS मशीन</th>
                  <th className="py-3.5 px-4 sm:px-6 text-emerald-400 bg-emerald-950/40 font-bold border-l border-emerald-500/20">
                    दुकान साथी (Dukaan Saathi)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-white">{row.feature}</td>
                    <td className="py-3.5 px-4 text-neutral-400">{row.traditional}</td>
                    <td className="py-3.5 px-4 text-neutral-400">{row.complexPos}</td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-400 bg-emerald-950/20 border-l border-emerald-500/20">
                      ✓ {row.dukaanSaathi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            दुकानदारों के सामान्य सवालों के स्पष्ट और सीधे जवाब
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal border-t border-white/[0.06] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="py-16 bg-gradient-to-br from-emerald-950 via-[#0a1612] to-[#09090b] border-t border-emerald-500/20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            आज ही अपनी दुकान को डिजिटल और स्मार्ट बनाएं
          </h2>
          <p className="mt-3 text-sm text-neutral-300 max-w-xl mx-auto font-normal">
            कोई क्रेडिट कार्ड या भारी सेटअप नहीं। सीधे ब्राउज़र में चलाएं और पहले दिन से समय बचाएं।
          </p>
          <div className="mt-8">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-neutral-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              POS काउंटर खोलें (Open POS Counter)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
