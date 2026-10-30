import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  BookOpen,
  ClipboardList,
  Upload,
  Eye,
  Download,
  School,
  Trash2,
  CheckCircle,
  FileCheck,
  Search,
  Plus,
  Globe,
} from 'lucide-react';
import { CurriculumDoc, SchoolProfile } from '../types';
import { docxExporter } from '../services/docxExporter';

interface DashboardViewProps {
  documents: CurriculumDoc[];
  school: SchoolProfile;
  onOpenWorkspace: (targetMenu?: string) => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
  onDeleteDocument: (id: string) => void;
  onOpenAISummon: () => void;
  onOpenPublishModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  school,
  onOpenWorkspace,
  onOpenEditor,
  onDeleteDocument,
  onOpenAISummon,
  onOpenPublishModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Dynamic Real Statistics
  const totalDocs = documents.length;
  const totalModul = documents.filter((d) => d.type === 'MODUL_AJAR' || d.type === 'RPP_RINGKAS').length;
  const totalProtaPromes = documents.filter((d) => d.type === 'PROTA' || d.type === 'PROMES').length;
  const totalJurnal = documents.filter((d) => d.type === 'JURNAL').length;

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.kelas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedFilter === 'ALL' || d.type === selectedFilter;
    return matchesSearch && matchesType;
  });

  const handleDownloadWord = async (doc: CurriculumDoc, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(doc.id);
    try {
      await docxExporter.exportDocument(doc, school);
    } catch (err) {
      console.error('Word export failed:', err);
      alert('Gagal membuat file Word. Silakan periksa isi dokumen.');
    } finally {
      setDownloadingId(null);
    }
  };

  const menuCards = [
    { id: 'SCHOOL_PROFILE', title: 'Identitas Sekolah & Guru', desc: 'Kelola data sekolah, guru, kepala sekolah & logo', icon: School, color: 'from-blue-600 to-blue-700' },
    { id: 'CP_TP', title: 'CP dan TP', desc: 'Kelola Capaian & Tujuan Pembelajaran Kurikulum Merdeka', icon: Layers, color: 'from-sky-600 to-blue-700' },
    { id: 'ATP', title: 'Alur Tujuan Pembelajaran', desc: 'Susun alur pembelajaran fase A, B, C & alokasi waktu', icon: BookOpen, color: 'from-indigo-600 to-indigo-700' },
    { id: 'PROTA', title: 'Program Tahunan (PROTA)', desc: 'Distribusi tujuan pembelajaran dan jam pelajaran setahun', icon: Calendar, color: 'from-teal-600 to-emerald-700' },
    { id: 'PROMES', title: 'Program Semester (PROMES)', desc: 'Matriks pembagian alokasi minggu efektif per semester', icon: Calendar, color: 'from-emerald-600 to-teal-700' },
    { id: 'MODUL_AJAR', title: 'Modul Ajar / RPP', desc: 'Generator 6-Langkah lengkap 19 komponen dengan AI', icon: FileText, color: 'from-blue-700 to-indigo-800' },
    { id: 'JURNAL', title: 'Jurnal Harian Mengajar', desc: 'Pencatatan KBM harian, presensi siswa & refleksi', icon: ClipboardList, color: 'from-amber-600 to-orange-700' },
    { id: 'LKPD', title: 'Asesmen dan LKPD', desc: 'Buat lembar kerja siswa, soal latihan & rubrik penilaian', icon: FileCheck, color: 'from-purple-600 to-indigo-700' },
    { id: 'IMPORT', title: 'Import Dokumen', desc: 'Ekstrak berkas lama DOCX, XLSX, CSV, atau PDF', icon: Upload, color: 'from-rose-600 to-pink-700' },
    { id: 'EDITOR', title: 'Preview & Editor Dokumen', desc: 'Editor 2-panel dengan tampilan kertas cetak', icon: Eye, color: 'from-slate-700 to-slate-800' },
    { id: 'TEMPLATES', title: 'Template Manager', desc: 'Kelola format baku dan sesuaikan komponen modul', icon: Layers, color: 'from-cyan-600 to-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Kurikulum Merdeka SD Terintegrasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">EDU PLAN AI</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Buat perangkat pembelajaran SD lebih cepat, rapi, dan mudah dikelola. Kombinasi kecerdasan buatan Gemini dan template dokumen terstruktur menghasilkan dokumen Word (.docx) asli yang sah dan dapat dicetak langsung.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
              {/* Mandatory Big START Button */}
              <button
                type="button"
                onClick={() => onOpenWorkspace()}
                className="group px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base tracking-wide rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>START WORKSPACE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenAISummon}
                className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-blue-200 border border-slate-700 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Susun dengan AI</span>
              </button>

              {onOpenPublishModal && (
                <button
                  type="button"
                  onClick={onOpenPublishModal}
                  className="px-5 py-3.5 bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 hover:text-white border border-emerald-600/70 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Publikasi Gratis (Link & PWA)</span>
                </button>
              )}
            </div>
          </div>

          {/* School Badge Widget */}
          <div className="w-full md:w-80 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-5 text-xs text-slate-300 shadow-xl">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  {school.namaSekolah || 'Sekolah Belum Diisi'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {school.npsn ? `NPSN: ${school.npsn}` : 'NPSN: -'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Guru Pengampu:</span>
                <span className="font-semibold text-white">{school.namaGuru || 'Belum Diisi'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">Jabatan & Mapel:</span>
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/40 text-xs font-bold tracking-wide shadow-sm">
                    {school.jabatanGuru || 'Guru Kelas / Mapel'}
                  </span>
                  <span className="text-slate-300 text-xs font-medium">
                    {school.kelasDiampu || 'Kelas 4'} ({school.fase || 'Fase B'})
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tahun Pelajaran:</span>
                <span className="text-white">{school.tahunPelajaran} • {school.semester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kepala Sekolah:</span>
                <span className="text-white truncate max-w-[150px]">{school.namaKepalaSekolah || 'Belum Diisi'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Dynamic Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Dokumen</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalDocs}</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Tersimpan di sistem</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Modul Ajar / RPP</span>
              <span className="text-2xl font-bold text-blue-600 mt-1 block">{totalModul}</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Perangkat ajar kelas</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">PROTA & PROMES</span>
              <span className="text-2xl font-bold text-teal-600 mt-1 block">{totalProtaPromes}</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Program tahunan & semester</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Jurnal Harian</span>
              <span className="text-2xl font-bold text-amber-600 mt-1 block">{totalJurnal}</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Catatan KBM harian</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 11 Main Menu Action Cards */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Menu Perangkat Pembelajaran SD</h2>
              <p className="text-xs text-slate-500">Pilih menu untuk menyusun, mengedit, mengimpor, atau mencetak dokumen.</p>
            </div>
            <button
              onClick={onOpenAISummon}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-semibold shadow hover:opacity-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Susun dengan AI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => onOpenWorkspace(card.id)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                    <span>Buka Menu</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Documents Table Section */}
        <div className="mt-14 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Perpustakaan Dokumen Tersimpan</h2>
              <p className="text-xs text-slate-500">Daftar perangkat pembelajaran yang telah dibuat dan dapat diedit atau diunduh ke format Word.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari dokumen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={onOpenAISummon}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Dokumen Baru
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs font-medium">
            {[
              { id: 'ALL', label: 'Semua Dokumen' },
              { id: 'MODUL_AJAR', label: 'Modul Ajar' },
              { id: 'PROTA', label: 'PROTA' },
              { id: 'PROMES', label: 'PROMES' },
              { id: 'ATP', label: 'ATP' },
              { id: 'JURNAL', label: 'Jurnal Harian' },
              { id: 'LKPD', label: 'LKPD' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p>Tidak ada dokumen yang sesuai dengan pencarian.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Dokumen</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Kelas & Mapel</th>
                    <th className="py-3 px-4">Terakhir Diubah</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => onOpenEditor(doc)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-blue-700">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="line-clamp-1">{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {doc.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {doc.kelas} • {doc.mataPelajaran}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(doc.updatedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Siap Cetak
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onOpenEditor(doc)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          Buka / Edit
                        </button>
                        <button
                          type="button"
                          disabled={downloadingId === doc.id}
                          onClick={(e) => handleDownloadWord(doc, e)}
                          title="Unduh File DOCX Asli"
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          {downloadingId === doc.id ? (
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>Word</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus dokumen "${doc.title}"?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          title="Hapus"
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
