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
  Zap 
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenVoiceDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenVoiceDemo }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const demoUtterance = 'Bhaiya, do kilo chawal aur ek litre refined oil chahiye.';

  const features = [
    {
      icon: Mic,
      title: 'आवाज़ से बिलिंग (Voice-First Order Taking)',
      desc: 'टाइपिंग और डायरी भूल जाइए। बस बोलिए: "2 किलो चीनी, 1 लीटर तेल" और सिस्टम तुरंत बिल, मात्रा और स्टॉक कैलकुलेट कर देगा।'
    },
    {
      icon: Receipt,
      title: '5-सेकंड POS बिलिंग व थर्मल प्रिंट',
      desc: 'भीड़ के समय तेज़ी से बिल बनाएं। 80mm/58mm थर्मल प्रिंटर से पर्चा निकालें या 1-क्लिक में WhatsApp बिल भेजें।'
    },
    {
      icon: CreditCard,
      title: 'डिजिटल उधार बही-खाता (Khata Ledger)',
      desc: 'ग्राहक के नाम से उधारी जोड़ें और जमा दर्ज करें। WhatsApp पर ऑटोमैटिक पेमेंट रिमाइंडर भेजें बिना किसी झिझक के।'
    },
    {
      icon: Boxes,
      title: 'लाइव स्टॉक ट्रैकिंग (Live Inventory)',
      desc: 'बिल बनते ही स्टॉक स्वतः घटता है। कम स्टॉक होने पर नारंगी अलर्ट मिलता है ताकि बिक्री कभी न रुके।'
    },
    {
      icon: TrendingUp,
      title: 'दैनिक मुनाफा व बिक्री रिपोर्ट (Analytics)',
      desc: 'आज कितनी कुल बिक्री हुई, कितना नकद आया, कितना UPI और कौन सा सामान सबसे ज्यादा बिका — सब एक नज़र में।'
    },
    {
      icon: ShieldCheck,
      title: '100% सुरक्षित और स्थानीय डेटा (Safe & Local)',
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
    <div className="bg-slate-50 text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-200/90 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Domain Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-6 border border-emerald-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Voice AI for Indian Kirana & Retail Stores</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              अब दुकान संभालेगा आपका <span className="text-emerald-700">स्मार्ट साथी</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Sales, stock, udhaar aur hisaab — sab kuch ek jagah. Bas boliye aur Dukaan Saathi turant bill banayega.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-sm shadow-emerald-700/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>POS बिलिंग शुरू करें (Start Billing)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVoiceDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-emerald-600" />
                <span>लाइव आवाज़ डेमो (Try Voice AI)</span>
              </button>
            </div>

            {/* Real Operational Metrics */}
            <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-6 pt-8 border-t border-slate-100 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  &lt; 280ms
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  STT Voice Latency
                </div>
              </div>
              <div className="border-x border-slate-100">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 tabular-nums">
                  100%
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  Offline-Safe Fallback
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  ₹0
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  No Expensive Hardware
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Live Demo Preview Box */}
          <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Live Interactive Voice Console
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">Gnani Prisma v2.5</span>
            </div>

            <div className="my-4 bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                बोलचाल का वाक्य (Spoken Input):
              </p>
              <p className="text-base font-bold text-slate-900 mt-1">
                &ldquo;{demoUtterance}&rdquo;
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Chawal: 2 kg @ ₹60 = ₹120
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Refined Oil: 1 L @ ₹140 = ₹140
                  </span>
                </div>
                <span className="text-sm font-extrabold font-mono tabular-nums text-emerald-700">
                  Total: ₹260
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Try asking in Hindi, Hinglish, or Local units (Aadha kilo, Paanch packet)</span>
              </div>
              <button
                onClick={onOpenVoiceDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Test Live Voice Mic</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Pillar Bento Grid Features */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            दुकानदार की ज़रूरतें (Tailored For Kirana)
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            किराना व्यापार को आसान बनाने वाले 6 मुख्य टूल्स
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Section: Diary vs Complex POS vs Dukaan Saathi */}
      <section className="py-14 bg-white border-y border-slate-200/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              पारंपरिक तरीके बनाम दुकान साथी
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              क्यों हज़ारों छोटे दुकानदार डायरी और जटिल सॉफ्टवेयर छोड़ रहे हैं
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">सुविधा (Feature)</th>
                  <th className="py-3.5 px-4 text-slate-400 font-semibold">पेन-कॉपी डायरी</th>
                  <th className="py-3.5 px-4 text-slate-400 font-semibold">भारी POS मशीन</th>
                  <th className="py-3.5 px-4 sm:px-6 text-emerald-800 bg-emerald-50/80 font-bold">दुकान साथी (Dukaan Saathi)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">{row.feature}</td>
                    <td className="py-3.5 px-4 text-slate-500">{row.traditional}</td>
                    <td className="py-3.5 px-4 text-slate-500">{row.complexPos}</td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-700 bg-emerald-50/40">
                      ✓ {row.dukaanSaathi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            दुकानदारों के सामान्य सवालों के स्पष्ट और सीधे जवाब
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-700' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            आज ही अपनी दुकान को डिजिटल और स्मार्ट बनाएं
          </h2>
          <p className="mt-2 text-sm text-emerald-100 max-w-xl mx-auto font-medium">
            कोई क्रेडिट कार्ड या भारी सेटअप नहीं। सीधे ब्राउज़र में चलाएं और पहले दिन से समय बचाएं।
          </p>
          <div className="mt-6">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              POS काउंटर खोलें (Open POS Counter)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
