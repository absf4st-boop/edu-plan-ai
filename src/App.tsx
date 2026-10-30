import React, { useState } from 'react';
import { SchoolProfile, CurriculumDoc } from './types';
import { storageService } from './services/storage';
import { AccessGateScreen } from './components/AccessGateScreen';
import { AuthModal } from './components/AuthModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WorkspaceContainer } from './components/WorkspaceContainer';
import { AIGenerateModal } from './components/AIGenerateModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { PublishFreeModal } from './components/PublishFreeModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Gate Unlock State (starts locked as requested)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => storageService.isGateUnlocked());

  // Navigation State: 'DASHBOARD' | 'WORKSPACE'
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'WORKSPACE'>('DASHBOARD');
  const [targetWorkspaceMenu, setTargetWorkspaceMenu] = useState<string>('MODUL_AJAR');

  // School Profile & Documents State
  const [school, setSchool] = useState<SchoolProfile>(() => storageService.getSchoolProfile());
  const [documents, setDocuments] = useState<CurriculumDoc[]>(() => storageService.getDocuments());
  const [activeEditorDoc, setActiveEditorDoc] = useState<CurriculumDoc | null>(null);

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [isAISummonOpen, setIsAISummonOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Sync state
  const refreshData = () => {
    setSchool(storageService.getSchoolProfile());
    setDocuments(storageService.getDocuments());
  };

  const handleUnlockGate = () => {
    storageService.setGateUnlocked(true);
    setIsUnlocked(true);
  };

  const handleLogout = () => {
    storageService.setGateUnlocked(false);
    setIsUnlocked(false);
    setCurrentView('DASHBOARD');
  };

  const handleOpenWorkspace = (targetMenu?: string) => {
    if (targetMenu) {
      if (targetMenu === 'EDITOR' && documents.length > 0) {
        setActiveEditorDoc(documents[0]);
      } else {
        setTargetWorkspaceMenu(targetMenu);
      }
    }
    setCurrentView('WORKSPACE');
  };

  const handleOpenEditor = (doc: CurriculumDoc) => {
    setActiveEditorDoc(doc);
    setTargetWorkspaceMenu('EDITOR');
    setCurrentView('WORKSPACE');
  };

  const handleDeleteDocument = (id: string) => {
    storageService.deleteDocument(id);
    refreshData();
  };

  const handleDocumentCreated = (doc: CurriculumDoc) => {
    refreshData();
    setActiveEditorDoc(doc);
  };

  // If locked, show the Gate Access screen first
  if (!isUnlocked) {
    return (
      <div className="font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
        <AccessGateScreen
          onUnlock={handleUnlockGate}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            handleUnlockGate();
            refreshData();
          }}
        />

        <PublishFreeModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
        />

        <OfflineIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        school={school}
        activeView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenSettings={() => setIsAdminSettingsOpen(true)}
        onLogout={handleLogout}
        onOpenAISummon={() => setIsAISummonOpen(true)}
        onOpenGoogleWorkspace={() => setIsWorkspaceModalOpen(true)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'DASHBOARD' ? (
          <DashboardView
            documents={documents}
            school={school}
            onOpenWorkspace={handleOpenWorkspace}
            onOpenEditor={handleOpenEditor}
            onDeleteDocument={handleDeleteDocument}
            onOpenAISummon={() => setIsAISummonOpen(true)}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
          />
        ) : (
          <WorkspaceContainer
            school={school}
            initialMenu={targetWorkspaceMenu}
            activeEditorDoc={activeEditorDoc}
            onProfileUpdated={refreshData}
            onOpenAISummon={() => setIsAISummonOpen(true)}
            onOpenEditor={handleOpenEditor}
            onBackToDashboard={() => setCurrentView('DASHBOARD')}
          />
        )}
      </div>

      {/* Global "Susun dengan AI" Modal */}
      <AIGenerateModal
        isOpen={isAISummonOpen}
        onClose={() => setIsAISummonOpen(false)}
        school={school}
        onDocumentCreated={handleDocumentCreated}
        onOpenEditor={handleOpenEditor}
      />

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
        onProfileUpdated={refreshData}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenGoogleWorkspace={() => setIsWorkspaceModalOpen(true)}
      />

      {/* Google Workspace Cloud Data Modal */}
      <GoogleWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        school={school}
        documents={documents}
        cpList={storageService.getCPAvailable()}
        tpList={storageService.getTPAvailable()}
      />

      {/* Auth / Teacher OTP Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          handleUnlockGate();
          refreshData();
        }}
      />

      {/* Free Publish & Share Modal */}
      <PublishFreeModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />

      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Global Footer with Creator Credit */}
      <footer className="mt-auto py-4 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
            <span className="font-bold text-slate-800">EDU PLAN AI</span>
            <span>— Asisten Digital Guru SD Kurikulum Merdeka</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Pembuat: <span className="font-bold text-blue-600">huseinapriyanto</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
