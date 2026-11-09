import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { SystemStatus } from '../types';

interface ApiKeyBannerProps {
  systemStatus: SystemStatus | null;
  onOpenSettings?: () => void;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ systemStatus, onOpenSettings }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !systemStatus) return null;

  if (systemStatus.gnani_api_key_configured) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Gnani AI Connected:</strong> Live voice pipeline active via <strong>Prisma v2.5 STT</strong> and <strong>Timbre v2.5 TTS</strong>.
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside aria-label="API Notice" className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <span className="p-1 bg-white/20 rounded-md">
            <KeyRound className="w-4 h-4 text-white" />
          </span>
          <span>
            <strong>Gnani API key missing — add it in .env to enable live voice.</strong>
          </span>
          <span className="hidden md:inline text-amber-100 text-xs font-normal">
            (Running in high-fidelity prototype mode with realistic Hindi STT & local voice synthesis)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1"
            >
              <span>View Env Config</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
