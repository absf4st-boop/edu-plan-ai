import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Cloud,
  FileSpreadsheet,
  FolderOpen,
  RefreshCw,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initGoogleAuth,
  signInWithGoogleWorkspace,
  logoutGoogleWorkspace,
  getCachedAccessToken,
} from '../services/googleAuth';
import { googleDriveService, GoogleDriveFile } from '../services/googleDriveService';
import { googleSheetsService, CreatedSpreadsheet } from '../services/googleSheetsService';
import { SchoolProfile, CurriculumDoc, CPItem, TPItem } from '../types';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  documents: CurriculumDoc[];
  cpList: CPItem[];
  tpList: TPItem[];
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({
  isOpen,
  onClose,
  school,
  documents,
  cpList,
  tpList,
}) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Drive state
  const [folderId, setFolderId] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [createdSheet, setCreatedSheet] = useState<CreatedSpreadsheet | null>(null);

  // Destructive Confirmation Dialog State (MANDATORY per Workspace Skill)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    onConfirm: () => {},
  });

  // Track auth state
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );

    const token = getCachedAccessToken();
    if (token) {
      setAccessToken(token);
    }

    return () => unsubscribe();
  }, [isOpen]);

  // Load files when folder or token is available
  useEffect(() => {
    if (accessToken) {
      refreshDriveFiles(accessToken);
    }
  }, [accessToken]);

  const handleSignIn = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await signInWithGoogleWorkspace();
      setGoogleUser(res.user);
      setAccessToken(res.accessToken);
      setStatusMsg({ type: 'success', text: `Berhasil terhubung ke akun Google Workspace: ${res.user.email}` });
      await refreshDriveFiles(res.accessToken);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Gagal login dengan akun Google. Pastikan izin Google Drive & Sheets diberikan.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGoogleWorkspace();
      setGoogleUser(null);
      setAccessToken(null);
      setDriveFiles([]);
      setFolderId(null);
      setStatusMsg({ type: 'success', text: 'Tautan Google Workspace telah diputuskan.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal logout.' });
    }
  };

  const refreshDriveFiles = async (token: string) => {
    try {
      const fid = await googleDriveService.getOrCreateAppFolder(token);
      setFolderId(fid);
      const files = await googleDriveService.listFilesInFolder(token, fid);
      setDriveFiles(files);
    } catch (err: any) {
      console.warn('Gagal memuat file drive:', err);
    }
  };

  // 1. Sync & Backup to Google Drive with User Confirmation
  const handleTriggerSyncDrive = () => {
    if (!accessToken) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Sinkronkan Data ke Google Drive?',
      description: `Aplikasi akan mengunggah file cadangan data master kurikulum (${documents.length} dokumen, profil sekolah, dan database CP/TP) ke folder 'EDU PLAN AI - Data Pusat SD' di Google Drive Anda.`,
      confirmText: 'Ya, Sinkronkan Sekarang',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        setStatusMsg(null);

        try {
          const fid = folderId || (await googleDriveService.getOrCreateAppFolder(accessToken));
          setFolderId(fid);

          const backupData = {
            exportDate: new Date().toISOString(),
            app: 'EDU PLAN AI',
            school,
            documents,
            cpList,
            tpList,
          };

          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `EDU_PLAN_AI_Backup_${timestamp}.json`;

          const uploaded = await googleDriveService.uploadBackupJson(accessToken, fid, backupData, filename);
          setStatusMsg({
            type: 'success',
            text: `Data berhasil dicadangkan ke Google Drive: "${uploaded.name}".`,
          });
          await refreshDriveFiles(accessToken);
        } catch (err: any) {
          setStatusMsg({ type: 'error', text: err.message || 'Gagal mencadangkan ke Google Drive.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 2. Export Master Curriculum to Google Sheets with User Confirmation
  const handleTriggerExportSheets = () => {
    if (!accessToken) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Buat Master Spreadsheet di Google Sheets?',
      description: `Aplikasi akan membuat spreadsheet baru di Google Drive Anda dengan 4 lembar kerja terstruktur: Profil Sekolah, Daftar Dokumen (${documents.length}), Database CP & TP (${tpList.length}), dan Jurnal Harian.`,
      confirmText: 'Buat Spreadsheet Baru',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        setStatusMsg(null);

        try {
          const title = `EDU PLAN AI — Data Master Kurikulum SD (${new Date().toLocaleDateString('id-ID')})`;
          const result = await googleSheetsService.createCurriculumSpreadsheet(
            accessToken,
            title,
            school,
            documents,
            cpList,
            tpList
          );

          setCreatedSheet(result);
          setStatusMsg({
            type: 'success',
            text: `Google Spreadsheet berhasil dibuat: "${title}". Klik tombol di bawah untuk membukanya.`,
          });
          await refreshDriveFiles(accessToken);
        } catch (err: any) {
          setStatusMsg({ type: 'error', text: err.message || 'Gagal membuat Google Spreadsheet.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 3. Delete file with Mandatory Confirmation
  const handleDeleteFile = (file: GoogleDriveFile) => {
    if (!accessToken) return;

    setConfirmDialog({
      isOpen: true,
      title: `Hapus File dari Google Drive?`,
      description: `Apakah Anda yakin ingin menghapus "${file.name}" dari Google Drive Anda? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Hapus File',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        setStatusMsg(null);

        try {
          await googleDriveService.deleteFile(accessToken, file.id);
          setStatusMsg({ type: 'success', text: `File "${file.name}" berhasil dihapus dari Google Drive.` });
          await refreshDriveFiles(accessToken);
        } catch (err: any) {
          setStatusMsg({ type: 'error', text: err.message || 'Gagal menghapus file.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base flex items-center gap-2">
                <span>Pengolahan Data Pusat — Google Drive & Sheets</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40 uppercase">
                  Akses Admin
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Kelola sinkronisasi cloud, cadangan perangkat pembelajaran, dan spreadsheet kurikulum.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2 text-xs ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMsg.text}</span>
            </div>
          )}

          {/* Connection State Card */}
          {!accessToken ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Hubungkan Akun Google Administrator
              </h3>
              <p className="text-xs text-slate-500 max-w-md mb-5 leading-relaxed">
                Sambungkan akun Google Anda untuk mengelola file perangkat kurikulum di Google Drive dan menghasilkan laporan spreadsheet di Google Sheets.
              </p>

              {/* Official Google Material Sign-in Button */}
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loading}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-full border border-slate-300 shadow-sm transition-all hover:shadow cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{loading ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Connected User Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-3">
                  {googleUser?.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border border-blue-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {googleUser?.displayName?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {googleUser?.displayName || 'Administrator'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {googleUser?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terhubung</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Putuskan sambungan"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Operations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Action 1: Google Drive Sync */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      Cadangkan ke Google Drive
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Simpan cadangan data master (profil sekolah, seluruh dokumen, dan CP/TP) ke folder <strong>EDU PLAN AI - Data Pusat SD</strong> di Drive Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerSyncDrive}
                    disabled={loading}
                    className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{loading ? 'Memproses...' : 'Sinkronkan Sekarang'}</span>
                  </button>
                </div>

                {/* Action 2: Google Sheets Export */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      Ekspor ke Google Sheets
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Buat spreadsheet multi-tab berisi daftar dokumen, statistik sekolah, database CP/TP, dan jurnal harian mengajar.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleTriggerExportSheets}
                      disabled={loading}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{loading ? 'Memproses...' : 'Buat Google Sheets'}</span>
                    </button>

                    {createdSheet && (
                      <a
                        href={createdSheet.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka di Google Sheets</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Cloud Files Explorer in Google Drive */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-800">
                      File di Folder: EDU PLAN AI - Data Pusat SD ({driveFiles.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => accessToken && refreshDriveFiles(accessToken)}
                    title="Perbarui daftar"
                    className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {driveFiles.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Belum ada file di folder Google Drive. Lakukan sinkronisasi atau ekspor spreadsheet di atas.
                  </div>
                ) : (
                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-200 bg-white">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {file.modifiedTime
                              ? new Date(file.modifiedTime).toLocaleString('id-ID')
                              : 'Baru saja'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Buka di Google Drive"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Integrasi Resmi Google Workspace API</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Mandatory Destructive Action Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{confirmDialog.title}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{confirmDialog.description}</p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors cursor-pointer"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
