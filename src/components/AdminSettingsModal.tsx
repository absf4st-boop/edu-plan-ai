import React, { useState } from 'react';
import { X, School, KeyRound, Download, Upload, User, Save, Trash2, CheckCircle2, AlertCircle, Cloud, FileSpreadsheet } from 'lucide-react';
import { SchoolProfile, UserAccount } from '../types';
import { storageService } from '../services/storage';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenGoogleWorkspace?: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
  onOpenAuth,
  onLogout,
  onOpenGoogleWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<'SCHOOL' | 'PASSWORD' | 'BACKUP' | 'ACCOUNT' | 'GOOGLE_WORKSPACE'>('SCHOOL');

  // School profile state
  const [profile, setProfile] = useState<SchoolProfile>(() => storageService.getSchoolProfile());

  // Password update state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Status message
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentUser: UserAccount | null = storageService.getUserAccount();

  if (!isOpen) return null;

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMsg({ type: 'error', text: 'Ukuran logo maksimal 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProfile((prev) => ({ ...prev, logoBase64: base64 }));
        setMsg({ type: 'success', text: 'Logo berhasil diunggah! Tekan Simpan Perubahan.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSchoolProfile(profile);
    setMsg({ type: 'success', text: 'Identitas sekolah dan guru berhasil diperbarui!' });
    onProfileUpdated();
  };

  const handleUpdateAccessPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 4) {
      setMsg({ type: 'error', text: 'Kata sandi baru minimal 4 karakter.' });
      return;
    }

    setPassLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/access-gate/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: 'Kata sandi akses EDU PLAN AI berhasil diganti oleh administrator!' });
        setCurrentPass('');
        setNewPass('');
      } else {
        setMsg({ type: 'error', text: data.message || 'Gagal mengubah kata sandi.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal terhubung ke server untuk mengubah kata sandi.' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = storageService.exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_eduplan_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ type: 'success', text: 'File cadangan berhasil diunduh ke komputer Anda.' });
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const res = storageService.importBackupData(text);
        if (res.success) {
          setMsg({ type: 'success', text: res.message });
          setProfile(storageService.getSchoolProfile());
          onProfileUpdated();
        } else {
          setMsg({ type: 'error', text: res.message });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Pengaturan & Administrasi Sistem</h3>
            <p className="text-xs text-slate-400">Identitas Sekolah, Sandi Akses Global & Cadangan Data</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('SCHOOL'); setMsg(null); }}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'SCHOOL' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            Identitas Sekolah & Guru
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('PASSWORD'); setMsg(null); }}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'PASSWORD' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Sandi Akses Global
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('BACKUP'); setMsg(null); }}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'BACKUP' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            Cadangan & Pemulihan
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('ACCOUNT'); setMsg(null); }}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'ACCOUNT' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            Akun Guru
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('GOOGLE_WORKSPACE'); setMsg(null); }}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'GOOGLE_WORKSPACE' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-blue-600" />
            <span>Google Drive & Sheets</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Admin</span>
          </button>
        </div>

        {/* Status Message */}
        {msg && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
              msg.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {msg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'SCHOOL' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center bg-white overflow-hidden relative">
                  {profile.logoBase64 ? (
                    <img src={profile.logoBase64} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <School className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block">Logo Satuan Pendidikan</span>
                  <span className="text-[11px] text-slate-500 block mb-2">Format PNG/JPG untuk kop dokumen resmi.</span>
                  <div className="flex gap-2">
                    <label className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      Pilih Logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    {profile.logoBase64 && (
                      <button
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, logoBase64: undefined }))}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
                  <input
                    type="text"
                    value={profile.namaSekolah}
                    onChange={(e) => setProfile({ ...profile, namaSekolah: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN (Opsional)</label>
                  <input
                    type="text"
                    value={profile.npsn}
                    onChange={(e) => setProfile({ ...profile, npsn: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Sekolah</label>
                  <input
                    type="text"
                    value={profile.alamat}
                    onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={profile.kecamatan}
                    onChange={(e) => setProfile({ ...profile, kecamatan: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kabupaten / Kota</label>
                  <input
                    type="text"
                    value={profile.kabupaten}
                    onChange={(e) => setProfile({ ...profile, kabupaten: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={profile.tahunPelajaran}
                    onChange={(e) => setProfile({ ...profile, tahunPelajaran: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester Aktif</label>
                  <select
                    value={profile.semester}
                    onChange={(e) => setProfile({ ...profile, semester: e.target.value as any })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 mt-3">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Data Guru Pengampu</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Guru</label>
                    <input
                      type="text"
                      value={profile.namaGuru}
                      onChange={(e) => setProfile({ ...profile, namaGuru: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Guru (Kosongkan jika belum ada)</label>
                    <input
                      type="text"
                      value={profile.nipGuru}
                      onChange={(e) => setProfile({ ...profile, nipGuru: e.target.value })}
                      placeholder="Biarkan kosong jika tidak ada"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas yang Diampu</label>
                    <select
                      value={profile.kelasDiampu}
                      onChange={(e) => {
                        const k = e.target.value;
                        const f = k === 'Kelas 1' || k === 'Kelas 2' ? 'Fase A' : k === 'Kelas 3' || k === 'Kelas 4' ? 'Fase B' : 'Fase C';
                        setProfile({ ...profile, kelasDiampu: k, fase: f });
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Kelas 1">Kelas 1 (Fase A)</option>
                      <option value="Kelas 2">Kelas 2 (Fase A)</option>
                      <option value="Kelas 3">Kelas 3 (Fase B)</option>
                      <option value="Kelas 4">Kelas 4 (Fase B)</option>
                      <option value="Kelas 5">Kelas 5 (Fase C)</option>
                      <option value="Kelas 6">Kelas 6 (Fase C)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan</label>
                    <input
                      type="text"
                      value={profile.jabatanGuru}
                      onChange={(e) => setProfile({ ...profile, jabatanGuru: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 mt-3">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Data Kepala Sekolah</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                    <input
                      type="text"
                      value={profile.namaKepalaSekolah}
                      onChange={(e) => setProfile({ ...profile, namaKepalaSekolah: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                    <input
                      type="text"
                      value={profile.nipKepalaSekolah}
                      onChange={(e) => setProfile({ ...profile, nipKepalaSekolah: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {activeTab === 'PASSWORD' && (
            <form onSubmit={handleUpdateAccessPassword} className="space-y-4 max-w-md">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                <strong>Sandi Akses Halaman Depan:</strong>
                <p className="mt-1">
                  Sandi ini berlaku untuk semua guru yang mengakses sistem EDU PLAN AI. Sebagai administrator, Anda dapat memperbaruinya di sini kapan saja.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Masukkan sandi lama atau default (guru2026)"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                {passLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi Akses Global'}
              </button>
            </form>
          )}

          {activeTab === 'BACKUP' && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" /> Unduh Cadangan Data (Backup)
                </h4>
                <p className="text-xs text-slate-600 mt-1 mb-3">
                  Simpan seluruh dokumen Modul Ajar, PROTA, PROMES, ATP, Jurnal Harian, dan identitas ke dalam satu file JSON aman di perangkat Anda.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium rounded-lg shadow cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Unduh Backup JSON
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" /> Pulihkan Data dari Cadangan (Restore)
                </h4>
                <p className="text-xs text-slate-600 mt-1 mb-3">
                  Pilih file JSON cadangan EDU PLAN AI yang sebelumnya telah diunduh untuk memulihkan seluruh data perangkat pembelajaran.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-medium rounded-lg shadow cursor-pointer">
                  <Upload className="w-4 h-4" /> Pilih File JSON Cadangan
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ACCOUNT' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {currentUser?.nama?.charAt(0) || 'H'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentUser?.nama || profile.namaGuru}</h4>
                  <p className="text-xs text-slate-500">{currentUser?.email || 'Akun Guru Terverifikasi'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">
                    Status: Aktif & Terverifikasi OTP
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Ganti Akun / Daftar Baru
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Keluar dari Sistem (Kunci)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'GOOGLE_WORKSPACE' && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Integrasi Data Pusat Google Drive & Google Sheets
                    </h4>
                    <p className="text-slate-500">
                      Olah dan sinkronkan data kurikulum SD ke cloud penyimpanan Google Workspace Anda.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-blue-100 text-slate-600 space-y-1.5">
                  <p className="font-semibold text-slate-800">Fitur Pengolahan Administrator:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Pencadangan otomatis file JSON ke folder <strong>EDU PLAN AI - Data Pusat SD</strong> di Drive.</li>
                    <li>Pembuatan spreadsheet multi-tab (Profil, Dokumen, CP & TP, Jurnal) di Google Sheets.</li>
                    <li>Akses berkas langsung tanpa perlu unduh-unggah manual ke komputer.</li>
                  </ul>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenGoogleWorkspace) onOpenGoogleWorkspace();
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>Buka Panel Google Drive & Sheets Pusat</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
