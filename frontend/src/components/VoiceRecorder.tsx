import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Radio } from 'lucide-react';
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

  // Real-world Kirana voice queries
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
        stream.getTracks().forEach((track) => track.stop());
        onAudioRecorded(audioBlob, 'mic_recording.wav');
      };

      mediaRecorder.start(250);
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
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-2xl shadow-xs border border-slate-200/90 max-w-2xl mx-auto">
      
      {/* Central Tactile Mic Button */}
      <div className="relative my-3 flex items-center justify-center">
        {isRecording && (
          <div className="absolute -inset-3 rounded-full border-2 border-rose-500/40 animate-ping pointer-events-none" />
        )}

        <button
          onClick={handleMicClick}
          disabled={disabled || (state !== 'idle' && state !== 'ready' && !isRecording)}
          aria-label={isRecording ? 'ऑर्डर रोकना (Stop Recording)' : 'बोलिए (Speak Order)'}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-md ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 ring-4 ring-rose-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/25 ring-4 ring-emerald-50 active:scale-95'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isRecording ? (
            <>
              <Square className="w-8 h-8 fill-white mb-1" />
              <span className="text-xs font-mono font-bold tracking-wider">{formatTime(recordSeconds)}</span>
              <span className="text-[10px] font-semibold text-rose-100">रोकें (Stop)</span>
            </>
          ) : (
            <>
              <Mic className="w-9 h-9 sm:w-10 sm:h-10 mb-1" />
              <span className="text-base font-extrabold tracking-tight">बोलिए</span>
              <span className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">Tap & Speak</span>
            </>
          )}
        </button>
      </div>

      {/* Recording Waveform Visualization */}
      {isRecording && (
        <div className="flex items-center gap-1.5 my-3 h-8">
          <span className="w-1 bg-rose-500 rounded-full wave-bar-1" />
          <span className="w-1 bg-rose-500 rounded-full wave-bar-2" />
          <span className="w-1 bg-rose-500 rounded-full wave-bar-3" />
          <span className="w-1 bg-rose-500 rounded-full wave-bar-4" />
          <span className="w-1 bg-rose-500 rounded-full wave-bar-5" />
          <span className="w-1 bg-rose-500 rounded-full wave-bar-2" />
          <span className="w-1 bg-rose-500 rounded-full wave-bar-4" />
          <span className="w-1 bg-rose-500 rounded-full wave-bar-1" />
        </div>
      )}

      {/* Status Instruction */}
      <div className="text-center mt-2">
        <h3 className="text-base font-bold text-slate-900">
          {isRecording ? 'सुन रहे हैं... बोलिए (Listening...)' : 'दुकानदार या ग्राहक की आवाज में बोलें'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
          {isRecording
            ? 'उदा: "भैया 2 किलो चावल और 1 लीटर रिफाइंड तेल दे दो"'
            : 'Hindi / Hinglish voice assistant powered by Gnani Prisma v2.5 STT'}
        </p>
      </div>

      {/* Secondary Controls: File Upload & Quick Utterance Chips */}
      <div className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Upload Audio File */}
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/wav,audio/mp3,audio/webm,audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isRecording}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload WAV File</span>
          </button>
        </div>

        {/* Quick Sample Order Pills */}
        <div className="text-xs text-slate-400 font-medium">
          या नीचे दिया कोई भी सैंपल टेस्ट करें:
        </div>
      </div>

      {/* Sample Query Buttons */}
      <div className="w-full mt-3 flex flex-wrap gap-1.5 justify-center">
        {quickTestOrders.map((sample, idx) => (
          <button
            key={idx}
            title={sample.text}
            onClick={() => onTextOrderDirect && onTextOrderDirect(sample.text)}
            disabled={disabled || isRecording}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-300 text-xs font-medium transition-all cursor-pointer"
          >
            <Radio className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
            <span>{sample.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};
