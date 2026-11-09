import React, { useState } from 'react';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { StatusIndicator } from '../components/StatusIndicator';
import { OrderCard } from '../components/OrderCard';
import { api, playHindiAudio } from '../services/api';
import { ParsedOrderResponse, ProcessingState, SystemStatus } from '../types';
import { CheckCircle2, Store } from 'lucide-react';

interface OrderTakingPageProps {
  systemStatus?: SystemStatus | null;
  onOrderPlaced?: () => void;
  onNavigateToOrders?: () => void;
}

export const OrderTakingPage: React.FC<OrderTakingPageProps> = ({
  onOrderPlaced,
  onNavigateToOrders
}) => {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [parsedOrder, setParsedOrder] = useState<ParsedOrderResponse | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | undefined>(undefined);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [orderSuccessAlert, setOrderSuccessAlert] = useState<{ id: number; total: number } | null>(null);
  const [engineTag, setEngineTag] = useState<string>('');

  // Handle incoming recorded audio (from Mic or File Upload)
  const handleAudioRecorded = async (blob: Blob, filename = 'recording.wav') => {
    try {
      setErrorMessage('');
      setOrderSuccessAlert(null);
      setParsedOrder(null);
      setAudioBase64(undefined);

      // Step 1: Transcribing via Gnani Prisma v2.5 STT
      setProcessingState('transcribing');
      setEngineTag('Gnani Prisma v2.5 STT');
      const transcribeRes = await api.transcribeAudio(blob, filename);
      setCurrentTranscript(transcribeRes.transcript);

      // Step 2: Understanding Order via LLM / Rules
      setProcessingState('parsing');
      setEngineTag('Order Extraction Engine');
      const parsedRes = await api.parseOrder(transcribeRes.transcript);
      setParsedOrder(parsedRes);

      // Step 3: Checking stock
      setProcessingState('checking_stock');
      await new Promise((r) => setTimeout(r, 200));

      // Step 4: Spoken Hindi Response via Gnani Timbre v2.5 TTS
      setProcessingState('speaking');
      setEngineTag('Gnani Timbre v2.5 TTS');
      const speechRes = await api.speakText(parsedRes.hindi_reply);
      setAudioBase64(speechRes.audio_base64);

      // Play audio naturally
      await playHindiAudio(parsedRes.hindi_reply, speechRes.audio_base64, () => {
        setProcessingState('ready');
      });
      setProcessingState('ready');
    } catch (err: any) {
      console.error('Pipeline processing error:', err);
      setProcessingState('error');
      setErrorMessage(err.message || 'Error processing audio order');
    }
  };

  // Direct text order parsing (for quick evaluation or typed queries)
  const handleTextOrderDirect = async (text: string) => {
    try {
      setErrorMessage('');
      setOrderSuccessAlert(null);
      setCurrentTranscript(text);

      setProcessingState('parsing');
      setEngineTag('Order Extraction Engine');
      const parsedRes = await api.parseOrder(text);
      setParsedOrder(parsedRes);

      setProcessingState('checking_stock');
      await new Promise((r) => setTimeout(r, 200));

      setProcessingState('speaking');
      setEngineTag('Gnani Timbre v2.5 TTS');
      const speechRes = await api.speakText(parsedRes.hindi_reply);
      setAudioBase64(speechRes.audio_base64);

      await playHindiAudio(parsedRes.hindi_reply, speechRes.audio_base64, () => {
        setProcessingState('ready');
      });
      setProcessingState('ready');
    } catch (err: any) {
      console.error('Parsing error:', err);
      setProcessingState('error');
      setErrorMessage(err.message || 'Error parsing text order');
    }
  };

  // Replay speech response
  const handleReplaySpeech = () => {
    if (parsedOrder?.hindi_reply) {
      playHindiAudio(parsedOrder.hindi_reply, audioBase64);
    }
  };

  // Modify quantity inside order
  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (!parsedOrder) return;
    const updatedItems = [...parsedOrder.items];
    const item = updatedItems[index];
    item.quantity = newQty;
    item.line_total = Math.round(newQty * item.unit_price);
    item.in_stock = item.available_stock >= newQty;

    const newTotal = updatedItems.reduce((acc, it) => acc + it.line_total, 0);
    setParsedOrder({
      ...parsedOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  // Remove item from order
  const handleRemoveItem = (index: number) => {
    if (!parsedOrder) return;
    const updatedItems = parsedOrder.items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((acc, it) => acc + it.line_total, 0);
    setParsedOrder({
      ...parsedOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  // Confirm and persist order
  const handleConfirmOrder = async () => {
    if (!parsedOrder || parsedOrder.items.length === 0) return;
    setIsConfirming(true);
    try {
      const saved = await api.createOrder({
        customer_transcript: currentTranscript || parsedOrder.transcript,
        hindi_response: parsedOrder.hindi_reply,
        items: parsedOrder.items
      });

      setOrderSuccessAlert({ id: saved.id, total: saved.total_amount });
      setParsedOrder(null);
      setCurrentTranscript('');
      setProcessingState('idle');
      if (onOrderPlaced) onOrderPlaced();
    } catch (err: any) {
      alert(`ऑर्डर सेव करने में त्रुटि: ${err.message}`);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReset = () => {
    setParsedOrder(null);
    setCurrentTranscript('');
    setProcessingState('idle');
    setErrorMessage('');
    setOrderSuccessAlert(null);
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <Store className="w-3.5 h-3.5 text-amber-600" />
          <span>दुकानदार और ग्राहकों के लिए स्मार्ट वॉइस सहायक</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          दुकान साथी — आसान बोलकर बिलिंग
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Just click the mic, speak in Hindi or Hinglish. Dukaan Saathi understands quantities, checks stock, and replies back in Hindi!
        </p>
      </div>

      {/* Pipeline Status Stepper */}
      <div className="mb-6">
        <StatusIndicator
          state={processingState}
          errorMessage={errorMessage}
          sourceInfo={engineTag}
        />
      </div>

      {/* Success Banner if Order Placed */}
      {orderSuccessAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">
                ऑर्डर नंबर #{orderSuccessAlert.id} सफलतापूर्वक दर्ज हुआ!
              </h4>
              <p className="text-xs text-emerald-700">
                कुल बिल: ₹{Math.round(orderSuccessAlert.total)} • स्टॉक स्वतः अपडेट हो गया है।
              </p>
            </div>
          </div>
          {onNavigateToOrders && (
            <button
              onClick={onNavigateToOrders}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              आर्डर देखें (View Orders)
            </button>
          )}
        </div>
      )}

      {/* Voice Recorder Hero */}
      <VoiceRecorder
        state={processingState}
        onAudioRecorded={handleAudioRecorded}
        onTextOrderDirect={handleTextOrderDirect}
        disabled={isConfirming}
      />

      {/* Parsed Order Card */}
      {parsedOrder && (
        <OrderCard
          order={parsedOrder}
          transcript={currentTranscript}
          onUpdateItemQuantity={handleUpdateItemQuantity}
          onRemoveItem={handleRemoveItem}
          onConfirmOrder={handleConfirmOrder}
          onReset={handleReset}
          onReplaySpeech={handleReplaySpeech}
          isConfirming={isConfirming}
        />
      )}

      {/* Quick Tips / Instructions for Kirana Shopkeeper */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500">
        <div className="p-3 bg-white/70 rounded-xl border border-slate-200/70">
          <span className="font-semibold text-slate-700 block mb-1">🗣️ किसी भी भाषा में बोलें</span>
          हिंदी, हिंग्लिश या इंग्लिश में आर्डर बोलें। उदा: "दो किलो चावल, एक लीटर तेल"।
        </div>
        <div className="p-3 bg-white/70 rounded-xl border border-slate-200/70">
          <span className="font-semibold text-slate-700 block mb-1">⚖️ संख्या और यूनिट समझ</span>
          आधा किलो, 1 packet, 2 litre, 500g जैसी मात्राओं की स्वचालित पहचान।
        </div>
        <div className="p-3 bg-white/70 rounded-xl border border-slate-200/70">
          <span className="font-semibold text-slate-700 block mb-1">🔊 बोलकर पुष्टि</span>
          Gnani Timbre आवाज़ में तुरंत बिल और सामान बोलकर ग्राहक को सुनाता है।
        </div>
      </div>
    </div>
  );
};
