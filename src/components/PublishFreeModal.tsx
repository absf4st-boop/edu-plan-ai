import React, { useState } from 'react';
import {
  Globe,
  Share2,
  Copy,
  Check,
  Download,
  Smartphone,
  ExternalLink,
  X,
  Server,
  Cloud,
  Layers,
  Sparkles,
  QrCode
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { generateQRCodeSVG } from '../utils/qrCode';

interface PublishFreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishFreeModal: React.FC<PublishFreeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'link' | 'pwa' | 'hosting'>('link');
  const [copied, setCopied] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  // The permanent Cloud Run URL for this applet or current window origin
  const defaultPublicUrl = 'https://ais-pre-kcwjrqsoo2uormhp6egbtw-672826080873.asia-northeast1.run.app';
  const currentUrl = typeof window !== 'undefined' && window.location.origin.includes('run.app')
    ? window.location.origin
    : defaultPublicUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    const text = `Halo Bapak/Ibu Guru! 🌟\n\nBerikut link aplikasi *EDU PLAN AI* — Asisten Digital Penyusun Perangkat Pembelajaran SD Kurikulum Merdeka (Modul Ajar, PROTA, PROMES, ATP, Jurnal):\n${currentUrl}\n\nAplikasi ini gratis, bisa langsung dibuka di browser atau dipasang di HP!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const qrImageUrl = generateQRCodeSVG(currentUrl, 220);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Publikasikan Aplikasi (Gratis Selamanya)</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aplikasi siap dibagikan ke seluruh guru SD tanpa biaya hosting atau toko aplikasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'link'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Tautan Publik & QR
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'pwa'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Pasang di HP / Laptop (PWA)
          </button>
          <button
            onClick={() => setActiveTab('hosting')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'hosting'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            Hosting Sendiri Gratis
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'link' && (
            <div className="space-y-6">
              {/* Live URL Box */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Link Publik Aktif Sekarang
                  </span>
                  <span className="text-xs text-slate-400">Siap Dikelola & Diakses Guru</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-700/80">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="bg-transparent flex-1 text-sm font-mono text-slate-200 outline-none select-all truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin Link'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={shareToWhatsApp}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Bagikan ke WhatsApp Guru / Sekolah
                  </button>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka di Tab Baru
                  </a>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md border border-slate-200 max-w-[210px] mx-auto">
                  <img
                    src={qrImageUrl}
                    alt="QR Code EDU PLAN AI"
                    className="w-40 h-40 object-contain rounded-lg"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-bold text-slate-800 mt-2 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-sky-600" /> SCAN UNTUK BUKA DI HP
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Scan Langsung dengan Kamera HP
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bapak/Ibu Guru cukup arahkan kamera HP Android atau iPhone ke QR Code di samping untuk langsung membuka EDU PLAN AI tanpa perlu install dari Google Play Store.
                  </p>
                  <div className="pt-2">
                    {isInstallable && (
                      <button
                        onClick={install}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-medium shadow-md transition"
                      >
                        <Download className="w-4 h-4" />
                        Pasang Aplikasi di Perangkat Ini
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">
                      Teknologi Progressive Web App (PWA) Aktif
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      EDU PLAN AI telah dilengkapi manifest PWA dan Service Worker. Guru dapat menginstalnya seperti aplikasi native Android/iOS secara <strong>100% GRATIS</strong> tanpa perlu membayar biaya pendaftaran developer akun Play Store ($25) atau App Store ($99/tahun).
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Status: {isInstalled ? '✅ Sudah Terpasang' : isInstallable ? '🚀 Siap Dipasang 1-Klik' : '⚡ Siap melalui browser'}
                  </span>
                  {isInstallable && (
                    <button
                      onClick={install}
                      className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-md flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Pasang Sekarang
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions per platform */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Android / Chrome */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sky-300">
                    <Smartphone className="w-4 h-4" />
                    Untuk Android & Google Chrome
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                    <li>Buka tautan EDU PLAN AI di Google Chrome HP.</li>
                    <li>Ketuk ikon titik tiga di pojok kanan atas.</li>
                    <li>Pilih <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                    <li>Ikon EDU PLAN AI akan muncul di layar menu HP layaknya aplikasi biasa.</li>
                  </ol>
                </div>

                {/* iPhone / Safari */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-300">
                    <Smartphone className="w-4 h-4" />
                    Untuk iPhone / iPad (Safari)
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                    <li>Buka tautan aplikasi di browser <strong>Safari</strong> iPhone.</li>
                    <li>Ketuk tombol <strong>Bagikan (Share)</strong> di bilah bawah (ikon kotak tanda panah ke atas).</li>
                    <li>Gulir ke bawah dan ketuk <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</li>
                    <li>Ketuk "Tambah" di pojok kanan atas.</li>
                  </ol>
                </div>

                {/* Windows PC / Laptop */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-emerald-300">
                    <Layers className="w-4 h-4" />
                    Untuk Laptop / PC (Windows & Mac)
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                    <li>Buka tautan aplikasi di Google Chrome atau Microsoft Edge.</li>
                    <li>Klik ikon komputer kecil di bilah alamat kanan atas (Install App).</li>
                    <li>Aplikasi akan berjalan di jendela terpisah tanpa gangguan tab browser.</li>
                  </ol>
                </div>

                {/* Offline Cache */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-purple-300">
                    <Cloud className="w-4 h-4" />
                    Penyimpanan Lokal Offline
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Semua modul ajar, dokumen PROTA, PROMES, dan profil sekolah tersimpan secara offline di browser (IndexedDB). Tetap bisa dibuka meski koneksi internet sekolah sedang lambat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hosting' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300">
                Aplikasi ini sudah 100% modular dan file konfigurasi <strong>Vercel (vercel.json)</strong> serta <strong>Netlify (netlify.toml)</strong> sudah disiapkan secara otomatis. Anda dapat mempublikasikannya secara mandiri ke platform berikut secara gratis:
              </p>

              <div className="space-y-3">
                {/* Method 1: AI Studio Cloud (Already Active) */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">1. AI Studio Cloud Run (Sedang Aktif — Paling Mudah)</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Aktif Sekarang</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Tidak perlu setting apa pun lagi! Tautan di tab pertama sudah langsung aktif di server Google Cloud Run secara gratis dan dapat langsung dipakai oleh seluruh guru.
                    </p>
                  </div>
                </div>

                {/* Method 2: Vercel */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 mt-0.5">
                    <Server className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">2. Vercel Hosting (Gratis Selamanya)</span>
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono">vercel.json Ready</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      1. Upload repo proyek ke GitHub.<br />
                      2. Masuk ke <strong>vercel.com</strong> (gratis dengan akun GitHub).<br />
                      3. Klik <strong>Add New Project &rarr; Import</strong>. Vercel akan otomatis mengenali Vite dan men-deploy dalam 1 menit!
                    </p>
                  </div>
                </div>

                {/* Method 3: Netlify */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">3. Netlify (Gratis Selamanya)</span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono">netlify.toml Ready</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Cukup jalankan <code>npm run build</code>, lalu seret folder <code>dist</code> ke <strong>app.netlify.com/drop</strong> untuk langsung mendapatkan website online gratis dengan sertifikat SSL gratis!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with creator mark */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Dibuat &amp; dikembangkan oleh:</span>
            <span className="font-mono text-sky-400 font-semibold">huseinapriyanto</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
