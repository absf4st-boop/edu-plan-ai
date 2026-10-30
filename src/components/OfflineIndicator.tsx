import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 border border-amber-450 px-3.5 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      <WifiOff className="w-3.5 h-3.5" />
      <span>Mode Offline — Aplikasi tetap berjalan menggunakan penyimpanan lokal (IndexedDB).</span>
    </div>
  );
};
