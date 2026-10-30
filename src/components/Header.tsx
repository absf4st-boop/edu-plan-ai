import React from 'react';
import { School, Settings, LogOut, LayoutDashboard, Sparkles, BookOpen, Cloud, Globe } from 'lucide-react';
import { SchoolProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  school: SchoolProfile;
  activeView: 'DASHBOARD' | 'WORKSPACE';
  onNavigate: (view: 'DASHBOARD' | 'WORKSPACE') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenAISummon?: () => void;
  onOpenGoogleWorkspace?: () => void;
  onOpenPublishModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  school,
  activeView,
  onNavigate,
  onOpenSettings,
  onLogout,
  onOpenAISummon,
  onOpenGoogleWorkspace,
  onOpenPublishModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding & School */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('DASHBOARD')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {school.logoBase64 ? (
                <img src={school.logoBase64} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
              ) : (
                <School className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  EDU PLAN AI
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  SD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                {school.namaSekolah || 'Identitas Sekolah Belum Diisi'} • TP {school.tahunPelajaran}
              </p>
            </div>
          </button>
        </div>

        {/* Center: Global Quick AI Action Button */}
        {onOpenAISummon && (
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenAISummon}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer animate-pulse hover:animate-none"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Susun dengan AI</span>
            </button>
          </div>
        )}

        {/* Right: User, Navigation & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeView === 'WORKSPACE' ? (
            <button
              onClick={() => onNavigate('DASHBOARD')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('WORKSPACE')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Workspace</span>
            </button>
          )}

          {/* Teacher Badge */}
          <div className="hidden lg:flex flex-col text-right pr-2 pl-3 border-l border-slate-800">
            <span className="text-xs font-bold text-slate-200 truncate max-w-[140px]">
              {school.namaGuru || 'Guru Belum Diisi'}
            </span>
            <span className="text-[10px] text-slate-400">
              {school.jabatanGuru || 'Guru Kelas / Mapel'} {school.kelasDiampu ? `(${school.kelasDiampu})` : ''}
            </span>
          </div>

          {/* Google Workspace Cloud Data Button */}
          {onOpenGoogleWorkspace && (
            <button
              onClick={onOpenGoogleWorkspace}
              title="Data Pusat (Google Drive & Sheets)"
              className="px-2.5 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900/90 text-cyan-300 hover:text-white border border-blue-800/80 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            >
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">Data Pusat (Drive & Sheets)</span>
            </button>
          )}

          {/* Publikasi Gratis Button */}
          {onOpenPublishModal && (
            <button
              onClick={onOpenPublishModal}
              title="Publikasikan Gratis ke Seluruh Guru (Link & PWA)"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-600/70 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-md shadow-emerald-950/40"
            >
              <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Publikasi Gratis</span>
            </button>
          )}

          {/* In-App PWA Install Button */}
          <PWAInstallButton />

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Pengaturan Identitas & Sandi"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Kunci & Keluar"
            className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
