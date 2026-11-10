import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Radio, Send } from 'lucide-react';
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
  const [liveSpokenText, setLiveSpokenText] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const recognizedTranscriptRef = useRef<string>('');
  const latestInterimRef = useRef<string>('');

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
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      recognizedTranscriptRef.current = '';
      latestInterimRef.current = '';
      setLiveSpokenText('');

      // Initialize Web Speech API native speech recognition (Chrome, Edge, Android Chrome, Safari)
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.lang = 'hi-IN';
          rec.continuous = true;
          rec.interimResults = true;
          
          rec.onresult = (event: any) => {
            let fullFinal = '';
            let interim = '';
            for (let i = 0; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                fullFinal += event.results[i][0].transcript + ' ';
              } else {
                interim += event.results[i][0].transcript;
              }
            }
            const currentCombined = (fullFinal + interim).trim();
            if (fullFinal.trim()) {
              recognizedTranscriptRef.current = fullFinal.trim();
            }
            latestInterimRef.current = currentCombined;
            setLiveSpokenText(currentCombined);
          };

          rec.onerror = (e: any) => {
            console.warn('Speech recognition warning/info:', e);
          };

          rec.start();
          recognitionRef.current = rec;
        } catch (e) {
          console.warn('Native speech recognition notice:', e);
        }
      }

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

        // Prioritize what the user actually spoke in real time
        setTimeout(() => {
          const finalSpoken = (recognizedTranscriptRef.current || latestInterimRef.current || liveSpokenText).trim();
          if (finalSpoken && onTextOrderDirect) {
            onTextOrderDirect(finalSpoken);
          } else {
            // If mic audio was recorded without live speech recognition
            onAudioRecorded(audioBlob, 'mic_recording.wav');
          }
        }, 150);
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access notice:', err);
      alert('माइक्रोफोन अनुमति नहीं मिली (Microphone access denied). You can still type your order or click any of the quick sample buttons below!');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

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
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl max-w-2xl mx-auto text-white">
      
      {/* Live Hearing Transcript Display */}
      {liveSpokenText ? (
        <div className="w-full mb-4 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-center animate-fadeIn shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
            🎙️ सुन रहे हैं (Live Speech Detected):
          </span>
          <p className="text-sm sm:text-base font-bold text-white italic">
            &ldquo;{liveSpokenText}&rdquo;
          </p>
        </div>
      ) : null}

      {/* Central Tactile Mic Button */}
      <div className="relative my-3 flex items-center justify-center">
        {isRecording && (
          <div className="absolute -inset-4 rounded-full border-2 border-rose-500/50 animate-ping pointer-events-none" />
        )}

        <button
          onClick={handleMicClick}
          disabled={disabled || (state !== 'idle' && state !== 'ready' && !isRecording)}
          aria-label={isRecording ? 'ऑर्डर रोकना (Stop Recording)' : 'बोलिए (Speak Order)'}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-xl ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40 ring-4 ring-rose-500/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-4 ring-emerald-500/20 active:scale-95'
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
              <span className="text-base font-black tracking-tight">बोलिए</span>
              <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">TAP & SPEAK</span>
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
        <h3 className="text-base font-bold text-white">
          {isRecording ? 'सुन रहे हैं... बोलिए (Listening...)' : 'दुकानदार या ग्राहक की आवाज में बोलें'}
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
          {isRecording
            ? 'उदा: "भैया 2 किलो चावल और 1 लीटर रिफाइंड तेल दे दो"'
            : 'Hindi / Hinglish Voice AI (Web Speech & Kirana Parser Active)'}
        </p>
      </div>

      {/* Instant Direct Text Order Input Box */}
      <div className="w-full mt-5 flex items-center gap-2">
        <input
          type="text"
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && customText.trim()) {
              onTextOrderDirect?.(customText.trim());
              setCustomText('');
            }
          }}
          placeholder="या यहाँ लिखकर बोलें (उदा: 2 किलो चावल, 1 तेल)..."
          className="flex-1 bg-black/50 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={() => {
            if (customText.trim()) {
              onTextOrderDirect?.(customText.trim());
              setCustomText('');
            }
          }}
          disabled={!customText.trim()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center space-x-1"
        >
          <span>आर्डर लें</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Secondary Controls: File Upload & Quick Utterance Chips */}
      <div className="w-full mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
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
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] bg-zinc-800/80 hover:bg-zinc-700/80 text-xs font-semibold text-zinc-300 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>WAV ऑडियो अपलोड</span>
          </button>
        </div>

        {/* Quick Sample Order Pills */}
        <div className="text-xs text-zinc-400 font-medium">
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
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-white/[0.08] hover:border-emerald-500/40 text-xs font-medium transition cursor-pointer"
          >
            <Radio className="w-3 h-3 text-zinc-400" />
            <span>{sample.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};
