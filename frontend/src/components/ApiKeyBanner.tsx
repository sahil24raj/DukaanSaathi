import React from 'react';
import { SystemStatus } from '../types';

interface ApiKeyBannerProps {
  systemStatus: SystemStatus | null;
  onOpenSettings?: () => void;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = () => {
  // Free Browser Web Speech & Kirana Engine are active by default - no annoying warning popups!
  return null;
};
