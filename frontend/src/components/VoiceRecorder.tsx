import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Sparkles } from 'lucide-react';
import { ProcessingState } from '../types';

interface VoiceRecorderProps {
  state: ProcessingState;
  onAudioRecorded: (blob: Blob, filename?: string) => void;
  onTextOrderDirect?: (text: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  state,
  onAudioRecorded,
  onTextOrderDirect,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested quick test queries for rapid evaluation
  const quickTestOrders = [
    { label: '2 kg Chawal + 1 L Oil', text: 'Bhaiya, do kilo chawal aur ek litre refined oil chahiye.' },
    { label: '5 kg Atta + 2 Biscuits', text: 'paanch kg atta aur do packet biscuit dena' },
    { label: '0.5 kg Cheeni + Namak', text: 'aadha kg cheeni aur ek kg namak dena' },
    { label: 'Shampoo + Toothpaste', text: 'ek bottle shampoo aur do toothpaste de do' }
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
        onAudioRecorded(audioBlob, 'mic_recording.wav');
      };

      mediaRecorder.start(250); // Slice chunks every 250ms
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
      alert('माइक्रोफोन अनुमति नहीं मिली (Microphone access denied). You can also upload a WAV file or use the sample buttons below!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleMicClick = () => {
    if (disabled) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAudioRecorded(file, file.name);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-amber-100/80 max-w-2xl mx-auto">
      {/* Central Hero Mic Button */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Ripple rings while recording */}
        {isRecording && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-orange-400/30 animate-ping pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full bg-orange-300/20 animate-pulse pointer-events-none" />
          </>
        )}

        <button
          onClick={handleMicClick}
          disabled={disabled || (state !== 'idle' && state !== 'ready' && !isRecording)}
          aria-label={isRecording ? 'ऑर्डर रोकना (Stop Recording)' : 'बोलिए (Speak Order)'}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
            isRecording
              ? 'bg-red-600 text-white mic-active-glow scale-105'
              : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isRecording ? (
            <>
              <Square className="w-10 h-10 fill-white mb-1" />
              <span className="text-xs font-bold uppercase tracking-wider">{formatTime(recordSeconds)}</span>
              <span className="text-[11px] font-medium text-red-100">Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 mb-1 drop-shadow" />
              <span className="text-sm font-bold tracking-wide">बोलिए</span>
              <span className="text-[10px] font-medium text-amber-100 tracking-wider uppercase">Boliye / Tap</span>
            </>
          )}
        </button>
      </div>

      {/* Recording Subtitle & Status */}
      <div className="text-center mt-2">
        <h3 className="text-base font-semibold text-slate-800">
          {isRecording ? 'सुन रहे हैं... बोलिए (Listening...)' : 'दुकानदार या ग्राहक की आवाज में बोलें'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          {isRecording
            ? 'उदा: "भैया 2 किलो चावल और 1 लीटर रिफाइंड तेल दे दो"'
            : 'Tap the mic and speak any grocery order in natural Hindi or Hinglish'}
        </p>
      </div>

      {/* Secondary Controls: File Upload & Quick Utterance Chips */}
      <div className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Upload Audio File */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*,.wav,.mp3,.m4a,.ogg"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isRecording}
            className="flex items-center space-x-2 text-xs text-slate-600 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 px-3 py-1.5 rounded-lg transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload WAV audio</span>
          </button>
        </div>

        {/* Quick Test Pre-fills */}
        {onTextOrderDirect && (
          <div className="flex items-center space-x-1.5 flex-wrap justify-center">
            <span className="text-[11px] text-slate-400 flex items-center mr-1">
              <Sparkles className="w-3 h-3 mr-1 text-amber-500" /> Test text:
            </span>
            {quickTestOrders.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onTextOrderDirect(item.text)}
                disabled={disabled || isRecording}
                className="text-[11px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-1 rounded-md transition border border-slate-200/60"
                title={item.text}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
