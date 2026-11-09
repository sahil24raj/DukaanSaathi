import React, { useState } from 'react';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { StatusIndicator } from '../components/StatusIndicator';
import { OrderCard } from '../components/OrderCard';
import { Acoustic3DCanvas } from '../components/Acoustic3DCanvas';
import { api, playHindiAudio } from '../services/api';
import { ParsedOrderResponse, ProcessingState, SystemStatus } from '../types';
import { CheckCircle2, Store, Printer, ArrowRight, Activity } from 'lucide-react';

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

  // Direct text order parsing
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

  const handleReplaySpeech = () => {
    if (parsedOrder?.hindi_reply) {
      playHindiAudio(parsedOrder.hindi_reply, audioBase64);
    }
  };

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
    <div className="py-8 px-4 max-w-5xl mx-auto space-y-6">
      
      {/* Visual Header with 3D Core Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" />
            <span>लाइव वॉयस बिलिंग काउंटर • Live Voice Billing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            बोलिए, दुकान साथी तुरंत बिल बनाएगा
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed max-w-xl">
            माइक बटन दबाएं और हिंदी या हिंग्लिश में बोलें। यह सीधे Gnani AI स्पीच इंजन से कनेक्ट होकर सामान, मात्रा, और स्टॉक की जांच कर तुरंत बिल व रसीद तैयार करता है।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-zinc-300 font-mono">Gnani Prisma v2.5</strong> STT
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-zinc-300">Deterministic Parsing</span>
            </span>
            <span>•</span>
            <span className="text-zinc-400">Offline Fallback Ready</span>
          </div>
        </div>

        {/* Mini 3D Sphere Visualizer */}
        <div className="lg:col-span-4 h-48 sm:h-52 rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden relative shadow-inner flex items-center justify-center">
          <Acoustic3DCanvas 
            isListening={processingState === 'transcribing' || processingState === 'speaking' || isConfirming}
            className="w-full h-full"
          />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono pointer-events-none">
            <span>3D SPATIAL CORE</span>
            <span className={processingState === 'idle' ? 'text-zinc-600' : 'text-emerald-400 font-bold animate-pulse'}>
              {processingState.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline Status Stepper */}
      <StatusIndicator
        state={processingState}
        errorMessage={errorMessage}
        sourceInfo={engineTag}
      />

      {/* Success Banner if Order Placed */}
      {orderSuccessAlert && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-300">
                ऑर्डर #{orderSuccessAlert.id} दर्ज हुआ!
              </h4>
              <p className="text-xs text-emerald-400/80">
                कुल राशि: <strong className="font-mono tabular-nums text-white">₹{orderSuccessAlert.total}</strong> • स्टॉक और खाता अपडेट हो गया
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>पर्चा प्रिंट</span>
            </button>
            {onNavigateToOrders && (
              <button
                onClick={onNavigateToOrders}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-900/50"
              >
                <span>आर्डर लिस्ट देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mic Audio Recorder Component */}
      <VoiceRecorder
        state={processingState}
        onAudioRecorded={handleAudioRecorded}
        onTextOrderDirect={handleTextOrderDirect}
        disabled={processingState !== 'idle' && processingState !== 'ready'}
      />

      {/* Extracted Order Card */}
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

    </div>
  );
};
