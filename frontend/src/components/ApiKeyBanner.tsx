import React from 'react';
import { KeyRound, ChevronRight } from 'lucide-react';
import { SystemStatus } from '../types';

interface ApiKeyBannerProps {
  systemStatus: SystemStatus | null;
  onOpenSettings?: () => void;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ systemStatus, onOpenSettings }) => {
  // If API key is configured or status is not yet loaded, DO NOT show any banner!
  if (!systemStatus || systemStatus.gnani_api_key_configured) {
    return null;
  }

  // Only show subtle notice if truly missing
  return (
    <div className="bg-amber-950/80 border-b border-amber-800/60 text-amber-200 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Gnani API Key Missing:</strong> Add <code className="bg-black/30 px-1 py-0.5 rounded text-[11px] font-mono">GNANI_API_KEY</code> in <code className="bg-black/30 px-1 py-0.5 rounded text-[11px] font-mono">.env</code> to activate live speech recognition.
          </span>
        </div>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Settings</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
