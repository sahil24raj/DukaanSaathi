import React from 'react';
import { Mic, Cpu, Brain, CheckSquare, Volume2, AlertCircle, Radio } from 'lucide-react';
import { ProcessingState } from '../types';

interface StatusIndicatorProps {
  state: ProcessingState;
  errorMessage?: string;
  sourceInfo?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  state,
  errorMessage,
  sourceInfo,
}) => {
  if (state === 'idle') {
    return (
      <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs sm:text-sm py-2">
        <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span className="font-medium">
          माइक दबाएं और हिंदी या हिंग्लिश में ऑर्डर बोलें (Click mic to speak Hindi/Hinglish order)
        </span>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex items-center justify-center space-x-2 bg-rose-50 text-rose-800 border border-rose-200 px-4 py-3 rounded-xl text-xs sm:text-sm max-w-lg mx-auto shadow-2xs">
        <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
        <span className="font-semibold">{errorMessage || 'त्रुटि हुई। कृपया दोबारा प्रयास करें (Something went wrong. Please try again.)'}</span>
      </div>
    );
  }

  const steps = [
    { key: 'listening', label: 'Listening', labelHi: 'सुन रहे हैं...', icon: Mic },
    { key: 'transcribing', label: 'STT Audio', labelHi: 'Gnani Prisma v2.5', icon: Cpu },
    { key: 'parsing', label: 'Understanding', labelHi: 'आर्डर निकाल रहे हैं', icon: Brain },
    { key: 'checking_stock', label: 'Inventory', labelHi: 'स्टॉक जांच...', icon: CheckSquare },
    { key: 'speaking', label: 'Voice TTS', labelHi: 'Gnani Timbre v2.5 बोल रहा है', icon: Volume2 },
  ];

  const getCurrentStepIndex = () => {
    switch (state) {
      case 'listening': return 0;
      case 'transcribing': return 1;
      case 'parsing': return 2;
      case 'checking_stock': return 3;
      case 'speaking': return 4;
      case 'ready': return 5;
      default: return 0;
    }
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      {/* Visual Progress Line */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 -z-0 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, (currentIndex / 4) * 100)}%` }}
        />

        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;

          return (
            <div key={s.key} className="flex flex-col items-center z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100 scale-105'
                    : isDone
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-[10px] mt-1.5 font-bold tracking-tight ${
                isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {sourceInfo && (
        <div className="text-center mt-3">
          <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Engine: {sourceInfo}
          </span>
        </div>
      )}
    </div>
  );
};
