import React from 'react';
import { Mic, Cpu, Brain, CheckSquare, Volume2, AlertCircle, Sparkles } from 'lucide-react';
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
      <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm py-2">
        <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
        <span>माइक दबाएं और हिंदी या हिंग्लिश में ऑर्डर बोलें (Click mic to speak in Hindi/Hinglish)</span>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex items-center justify-center space-x-2 bg-red-50 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl text-sm max-w-lg mx-auto">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{errorMessage || 'त्रुटि हुई। कृपया दोबारा प्रयास करें (Something went wrong. Please try again.)'}</span>
      </div>
    );
  }

  const steps = [
    { key: 'listening', label: 'Listening', labelHi: 'सुन रहे हैं...', icon: Mic },
    { key: 'transcribing', label: 'Transcribing', labelHi: 'Gnani Prisma v2.5...', icon: Cpu },
    { key: 'parsing', label: 'Understanding', labelHi: 'ऑर्डर समझ रहे हैं...', icon: Brain },
    { key: 'checking_stock', label: 'Checking Stock', labelHi: 'स्टॉक जांच...', icon: CheckSquare },
    { key: 'speaking', label: 'Speaking', labelHi: 'Gnani Timbre v2.5 बोल रहा है...', icon: Volume2 },
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
      {/* Visual pill steps */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 -z-0 rounded-full transition-all duration-500"
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
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-100 scale-110'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-[11px] mt-1 font-medium transition-colors ${
                isCurrent ? 'text-amber-700 font-semibold' : isDone ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {sourceInfo && (
        <p className="text-center text-xs text-slate-500 mt-2 font-mono">
          Engine: {sourceInfo}
        </p>
      )}
    </div>
  );
};

