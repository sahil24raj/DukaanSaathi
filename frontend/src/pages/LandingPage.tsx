import React, { useState } from 'react';
import { 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Boxes, 
  CreditCard, 
  Receipt, 
  Play, 
  Volume2,
  ChevronDown
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenVoiceDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenVoiceDemo }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Mic,
      title: 'आवाज़ से बिलिंग (Voice-First Billing)',
      desc: 'टाइपिंग छोड़िए। बस बोलिए: "2 किलो चीनी, 1 लीटर तेल" और सिस्टम तुरंत बिल, मात्रा और स्टॉक कैलकुलेट कर देगा।'
    },
    {
      icon: Receipt,
      title: 'तेज़ POS और कच्चा/पक्का बिल',
      desc: 'काउंटर रश में 5 सेकंड में बिल बनाएं। 80mm थर्मल प्रिंटर या WhatsApp पर्चा भेजने की पूरी सुविधा।'
    },
    {
      icon: CreditCard,
      title: 'डिजिटल बही-खाता (Udhaar Ledger)',
      desc: 'ग्राहक के नाम से उधारी जोड़ें और जमा दर्ज करें। हिसाब में शून्य गलती और समय पर पेमेंट याद दिलाने की सुविधा।'
    },
    {
      icon: Boxes,
      title: 'लाइव स्टॉक ट्रैकिंग (Smart Inventory)',
      desc: 'सामान बिकते ही स्टॉक स्वतः घटता है। 10 से कम यूनिट होने पर तुरंत अलर्ट मिलता है ताकि बिक्री न रुके।'
    },
    {
      icon: TrendingUp,
      title: 'दैनिक मुनाफा व रिपोर्ट (Analytics)',
      desc: 'आज कितनी कुल बिक्री हुई, नकद कितना, UPI कितना, और कौन सा सामान सबसे ज्यादा बिका — सब एक नज़र में।'
    },
    {
      icon: ShieldCheck,
      title: '100% सुरक्षित और स्थानीय (Safe & Local)',
      desc: 'कोई गैर-ज़रूरी फोन नंबर या आधार डेटा नहीं। ऑफलाइन मोड और स्थानीय SQLite डेटाबेस के साथ सुरक्षित।'
    }
  ];

  const faqs = [
    {
      q: 'क्या यह ऐप हिंदी और हिंग्लिश समझता है?',
      a: 'हाँ, दुकान साथी को विशेष रूप से भारतीय बोलचाल की हिंदी और हिंग्लिश के लिए तैयार किया गया है। यह "आधा किलो", "डेढ़ लीटर", "दो पैकेट" जैसी सभी स्थानीय इकाइयों को सटीक समझता है।'
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
    <div className="bg-[#faf8f5] text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-amber-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-5 border border-amber-200 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>भारतीय किराना और रिटेल दुकानों के लिए पहला वॉइस असिस्टेंट</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              अब दुकान संभालेगा आपका <span className="text-amber-600 underline decoration-amber-300 decoration-wavy underline-offset-6">स्मार्ट साथी</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
              Sales, stock, udhaar aur hisaab — sab kuch ek jagah. Bas boliye aur Dukan Sathi kaam karega.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-base shadow-lg shadow-amber-600/25 transition flex items-center justify-center space-x-2"
              >
                <span>दुकान खोलें (Open App)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenVoiceDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-300 font-semibold text-base transition flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-slate-700 text-slate-700" />
                <span>लाइव वॉइस डेमो देखें (Try Voice)</span>
              </button>
            </div>

            {/* Live Trust Metrics */}
            <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-slate-200/80 text-center">
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900">100%</span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">हिंदी और हिंग्लिश सपोर्ट</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900">&lt; 1 Sec</span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">वॉइस से बिल तैयार</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900">0%</span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">टाइपिंग का झंझट</p>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual Interface Preview */}
          <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 font-mono text-slate-300">Dukan Sathi Counter View</span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                Gnani AI Prisma & Timbre Active
              </span>
            </div>

            <div className="p-6 md:p-8 bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Voice Simulation */}
                <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                      ग्राहक की आवाज़ (Spoken Input)
                    </span>
                    <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "राजू को दो किलो चीनी और एक पैकेट बिस्कुट दे दो।"
                  </p>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-900 block">दुकान साथी का जवाब (Voice Response):</span>
                    <p className="text-emerald-800 font-medium">
                      "राजू के खाते में 2 किलो चीनी (₹96) और 1 पैकेट बिस्कुट (₹20). कुल ₹116 दर्ज करें?"
                    </p>
                  </div>
                </div>

                {/* Instant POS Slip */}
                <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">कच्चा पर्चा #104</h4>
                      <p className="text-xs text-slate-400">Customer: Raju (नियमित ग्राहक)</p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      उधार खाता (Udhaar)
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-slate-700">2 kg Sugar (चीनी) @ ₹48</span>
                      <span className="font-bold text-slate-900">₹96.00</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-slate-700">1 packet Parle-G @ ₹20</span>
                      <span className="font-bold text-slate-900">₹20.00</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500">कुल बिल (Total):</span>
                    <span className="text-xl font-black text-slate-900">₹116.00</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={onGetStarted}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                      बिल कन्फर्म करें (Save Bill)
                    </button>
                    <button 
                      onClick={onGetStarted}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                    >
                      प्रिंट पर्चा
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            दुकान की हर ज़रूरत के लिए व्यावहारिक समाधान
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            बिना किसी जटिल मेनू या कंप्यूटर कोर्स के। आपकी भाषा में, आपकी सुविधा से।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple 3-Step "How It Works" */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              यह कैसे काम करता है? (How It Works)
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              केवल 3 सरल चरणों में आपकी दुकान का काम पूरा
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">माइक दबाएं और बोलें</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                ग्राहक का आर्डर हिंदी या हिंग्लिश में बोलें। कोई टाइपिंग या बारकोड स्कैनिंग ज़रूरी नहीं।
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">सिस्टम समझता और जोड़ता है</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Gnani AI मात्रा, सामान, रेट और स्टॉक की जांच कर तुरंत कुल बिल कैलकुलेट करता है।
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 font-black text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">पर्चा प्रिंट करें या सेव करें</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                नकद, UPI या उधार चुनकर एक क्लिक में बिल पक्का करें। स्टॉक और खाता स्वतः अपडेट।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plan Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          भारतीय दुकानदारों के लिए पारदर्शी योजना
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          शुरुआत बिल्कुल मुफ्त। कोई छुपा हुआ शुल्क नहीं।
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">फ्री प्लान (Free Starter)</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-black text-slate-900">₹0</span>
              <span className="text-xs text-slate-500">/ हमेशा मुफ्त</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>असीमित वॉइस ऑर्डर बिलिंग</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>कैटलॉग और इन्वेंटरी मैनेजमेंट</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>दैनिक बिक्री रिपोर्ट व कच्चा पर्चा प्रिंट</span>
              </li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              मुफ्त शुरू करें
            </button>
          </div>

          {/* Pro Merchant */}
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-300 shadow-md space-y-4 relative">
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
              लोकप्रिय
            </span>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">प्रो व्यापारी (Pro Dukaan)</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-black text-amber-950">₹199</span>
              <span className="text-xs text-amber-800">/ महीना</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>सब कुछ जो फ्री प्लान में है</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>WhatsApp पर स्वचालित बिल व पेमेंट लिंक</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>उधार वसूली के लिए ऑटो रिमाइंडर SMS</span>
              </li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
            >
              प्रो चुनें
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-8">
            अक्सर पूछे जाने वाले सवाल (FAQ)
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-sm text-slate-800 flex justify-between items-center hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 font-bold text-base">
              <span>🏪</span>
              <span>Dukan Sathi (दुकान साथी)</span>
            </div>
            <p className="text-slate-400 mt-1 text-xs">
              AI-powered business management platform for Indian small shopkeepers.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-slate-300">
            <button onClick={onGetStarted} className="hover:text-amber-400 transition">Billing POS</button>
            <button onClick={onOpenVoiceDemo} className="hover:text-amber-400 transition">Voice Demo</button>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">Built for Great Indian AI Internship Challenge by Gnani AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
