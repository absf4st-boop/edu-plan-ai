import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA on the home screen, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition transform hover:scale-105 active:scale-95"
        title="Pasang aplikasi EDU PLAN AI secara gratis di HP atau Komputer Anda"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Pasang Aplikasi</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          title="Pasang di iPhone/iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Pasang di iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-750 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  Pasang di iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed space-y-2">
                1. Buka tautan ini di browser <strong>Safari</strong>.<br />
                2. Ketuk tombol <strong>Bagikan (Share)</strong> di bilah bawah (ikon kotak dengan panah ke atas).<br />
                3. Gulir ke bawah dan ketuk <strong>Tambah ke Layar Utama (Add to Home Screen)</strong>.<br />
                4. Ketuk <strong>Tambah</strong> di pojok kanan atas.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
