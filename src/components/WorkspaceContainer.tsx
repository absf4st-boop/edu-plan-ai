import React, { useState } from 'react';
import {
  School,
  Layers,
  BookOpen,
  Calendar,
  FileText,
  ClipboardList,
  FileCheck,
  Upload,
  Eye,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import { SchoolProfile, CurriculumDoc, DocumentType } from '../types';
import { SchoolProfileView } from './workspace/SchoolProfileView';
import { CPTPView } from './workspace/CPTPView';
import { ATPView } from './workspace/ATPView';
import { PROTAView } from './workspace/PROTAView';
import { PROMESView } from './workspace/PROMESView';
import { ModulAjarWizard } from './workspace/ModulAjarWizard';
import { JurnalView } from './workspace/JurnalView';
import { LKPDView } from './workspace/LKPDView';
import { ImportView } from './workspace/ImportView';
import { TemplateManagerView } from './workspace/TemplateManagerView';
import { DocumentEditorView } from './workspace/DocumentEditorView';

interface WorkspaceContainerProps {
  school: SchoolProfile;
  initialMenu?: string;
  activeEditorDoc: CurriculumDoc | null;
  onProfileUpdated: () => void;
  onOpenAISummon: () => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
  onBackToDashboard: () => void;
}

export const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({
  school,
  initialMenu = 'MODUL_AJAR',
  activeEditorDoc,
  onProfileUpdated,
  onOpenAISummon,
  onOpenEditor,
  onBackToDashboard,
}) => {
  const [activeMenu, setActiveMenu] = useState<string>(
    activeEditorDoc ? 'EDITOR' : initialMenu
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentEditingDoc, setCurrentEditingDoc] = useState<CurriculumDoc | null>(activeEditorDoc);

  const navItems = [
    { id: 'MODUL_AJAR', label: 'Modul Ajar / RPP', icon: FileText, tag: 'Utama' },
    { id: 'PROTA', label: 'Program Tahunan (PROTA)', icon: Calendar },
    { id: 'PROMES', label: 'Program Semester (PROMES)', icon: Calendar },
    { id: 'ATP', label: 'Alur Tujuan Pembelajaran', icon: BookOpen },
    { id: 'CP_TP', label: 'CP dan TP', icon: Layers },
    { id: 'JURNAL', label: 'Jurnal Harian Mengajar', icon: ClipboardList },
    { id: 'LKPD', label: 'Asesmen & LKPD', icon: FileCheck },
    { id: 'IMPORT', label: 'Import Dokumen', icon: Upload },
    { id: 'TEMPLATES', label: 'Template Manager', icon: SlidersHorizontal },
    { id: 'SCHOOL_PROFILE', label: 'Identitas Sekolah & Guru', icon: School },
  ];

  const handleSelectDocForEditor = (doc: CurriculumDoc) => {
    setCurrentEditingDoc(doc);
    setActiveMenu('EDITOR');
    onOpenEditor(doc);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Workspace Subheader / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-800">Workspace Perangkat Pembelajaran</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-bold">
            {navItems.find((n) => n.id === activeMenu)?.label || (activeMenu === 'EDITOR' ? 'Preview & Editor' : activeMenu)}
          </span>
        </div>

        {/* Mobile toggle button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar Nav */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform md:relative md:translate-x-0 md:border md:rounded-2xl md:shadow-sm md:h-fit ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 md:hidden">
            <span className="font-bold text-sm text-slate-800">Menu Workspace</span>
            <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick AI Trigger In Sidebar */}
          <div className="mb-4">
            <button
              type="button"
              onClick={onOpenAISummon}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Susun dengan AI</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveMenu(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.tag && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* School Badge in Sidebar */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-800 block">{school.namaSekolah}</span>
            <span>{school.namaGuru}</span>
            <span className="block text-slate-400">{school.kelasDiampu || 'Kelas 4'} ({school.fase || 'Fase B'})</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeMenu === 'SCHOOL_PROFILE' && (
            <SchoolProfileView school={school} onProfileUpdated={onProfileUpdated} />
          )}

          {activeMenu === 'CP_TP' && (
            <CPTPView school={school} onOpenAISummon={onOpenAISummon} />
          )}

          {activeMenu === 'ATP' && (
            <ATPView
              school={school}
              onOpenAISummon={onOpenAISummon}
              onOpenEditor={handleSelectDocForEditor}
            />
          )}

          {activeMenu === 'PROTA' && (
            <PROTAView
              school={school}
              onOpenAISummon={onOpenAISummon}
              onOpenEditor={handleSelectDocForEditor}
            />
          )}

          {activeMenu === 'PROMES' && (
            <PROMESView
              school={school}
              onOpenAISummon={onOpenAISummon}
              onOpenEditor={handleSelectDocForEditor}
            />
          )}

          {activeMenu === 'MODUL_AJAR' && (
            <ModulAjarWizard
              school={school}
              onOpenAISummon={onOpenAISummon}
              onOpenEditor={handleSelectDocForEditor}
            />
          )}

          {activeMenu === 'JURNAL' && (
            <JurnalView
              school={school}
              onOpenAISummon={onOpenAISummon}
              onOpenEditor={handleSelectDocForEditor}
            />
          )}

          {activeMenu === 'LKPD' && (
            <LKPDView
              school={school}
              onOpenAISummon={onOpenAISummon}
              onOpenEditor={handleSelectDocForEditor}
            />
          )}

          {activeMenu === 'IMPORT' && (
            <ImportView
              school={school}
              onDocumentImported={handleSelectDocForEditor}
              onOpenEditor={handleSelectDocForEditor}
            />
          )}

          {activeMenu === 'TEMPLATES' && <TemplateManagerView />}

          {activeMenu === 'EDITOR' && currentEditingDoc && (
            <DocumentEditorView
              document={currentEditingDoc}
              school={school}
              onBack={() => setActiveMenu('MODUL_AJAR')}
              onOpenAISummon={onOpenAISummon}
            />
          )}
        </main>
      </div>
    </div>
  );
};
