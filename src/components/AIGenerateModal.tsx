import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle, FileText, ArrowRight, Download } from 'lucide-react';
import { SchoolProfile, DocumentType, CurriculumDoc } from '../types';
import { aiService } from '../services/ai';
import { storageService } from '../services/storage';
import { docxExporter } from '../services/docxExporter';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: DocumentType;
  school: SchoolProfile;
  onDocumentCreated: (doc: CurriculumDoc) => void;
  onOpenEditor?: (doc: CurriculumDoc) => void;
}

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'MODUL_AJAR',
  school,
  onDocumentCreated,
  onOpenEditor,
}) => {
  const [docType, setDocType] = useState<DocumentType>(defaultType);
  const [kelas, setKelas] = useState(school.kelasDiampu || 'Kelas 4');
  const [fase, setFase] = useState(school.fase || 'Fase B');
  const [mataPelajaran, setMataPelajaran] = useState(school.mataPelajaran || 'PJOK');
  const [materiTopik, setMateriTopik] = useState('Variasi dan Kombinasi Pola Gerak Dasar Permainan Bola');
  const [alokasiWaktu, setAlokasiWaktu] = useState('4 x 35 Menit (2 Pertemuan)');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(school.semester || 'Ganjil');
  const [catatanKhusus, setCatatanKhusus] = useState('Sertakan diferensiasi proses dan pengamatan langsung.');

  const [loading, setLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<CurriculumDoc | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKelasChange = (val: string) => {
    setKelas(val);
    if (val === 'Kelas 1' || val === 'Kelas 2') setFase('Fase A');
    else if (val === 'Kelas 3' || val === 'Kelas 4') setFase('Fase B');
    else setFase('Fase C');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiTopik.trim()) {
      setError('Masukkan materi atau topik pembelajaran.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedDoc(null);

    try {
      const content = await aiService.generateDocument({
        type: (docType === 'RPP_RINGKAS' ? 'MODUL_AJAR' : docType) as 'MODUL_AJAR' | 'PROTA' | 'PROMES' | 'ATP' | 'CP_TP' | 'JURNAL' | 'LKPD',
        schoolName: school.namaSekolah,
        teacherName: school.namaGuru,
        kelas,
        fase,
        mataPelajaran,
        semester,
        materiTopik,
        alokasiWaktu,
        catatanKhusus,
      });

      // Construct doc object
      const typeLabel =
        docType === 'MODUL_AJAR' ? 'Modul Ajar' :
        docType === 'PROTA' ? 'Program Tahunan (PROTA)' :
        docType === 'PROMES' ? 'Program Semester (PROMES)' :
        docType === 'ATP' ? 'ATP' :
        docType === 'JURNAL' ? 'Jurnal Harian' : 'LKPD & Asesmen';

      const newDoc: CurriculumDoc = {
        id: `doc-${docType.toLowerCase()}-${Date.now()}`,
        title: `${typeLabel} ${mataPelajaran} ${kelas} — ${materiTopik}`,
        type: docType,
        kelas,
        fase,
        mataPelajaran,
        tahunPelajaran: school.tahunPelajaran,
        semester,
        updatedAt: new Date().toISOString(),
        status: 'draft',
        content,
      };

      storageService.saveDocument(newDoc);
      setGeneratedDoc(newDoc);
      onDocumentCreated(newDoc);
    } catch (err: any) {
      setError(err?.message || 'Gagal menyusun dokumen dengan AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDownloadWord = async () => {
    if (!generatedDoc) return;
    try {
      await docxExporter.exportDocument(generatedDoc, school);
    } catch (err) {
      console.error(err);
      alert('Terjadi kendala saat membuat file Word.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Susun Dokumen dengan AI</h3>
              <p className="text-xs text-blue-200">Penyusunan Perangkat Pembelajaran SD Kurikulum Merdeka Cepat & Terstruktur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {generatedDoc ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Dokumen Berhasil Disusun!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  <strong>{generatedDoc.title}</strong> telah tersimpan di perpustakaan dokumen Anda dan siap digunakan atau disunting.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleDirectDownloadWord}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" /> Unduh Dokumen Word (.docx) Valid
                </button>
                {onOpenEditor && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenEditor(generatedDoc);
                      onClose();
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Buka & Edit di Editor
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setGeneratedDoc(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Susun Dokumen Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Document Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" /> Jenis Dokumen yang Disusun
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'MODUL_AJAR', label: 'Modul Ajar Lengkap' },
                    { id: 'PROTA', label: 'Program Tahunan (PROTA)' },
                    { id: 'PROMES', label: 'Program Semester (PROMES)' },
                    { id: 'ATP', label: 'Alur Tujuan Pembelajaran' },
                    { id: 'JURNAL', label: 'Jurnal Harian Mengajar' },
                    { id: 'LKPD', label: 'LKPD & Asesmen' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDocType(item.id as DocumentType)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                        docType === item.id
                          ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas SD</label>
                  <select
                    value={kelas}
                    onChange={(e) => handleKelasChange(e.target.value)}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={mataPelajaran}
                    onChange={(e) => setMataPelajaran(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="IPAS">IPAS (Sains & Sosial)</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="PJOK">PJOK</option>
                    <option value="Seni Rupa">Seni Rupa</option>
                    <option value="Seni Musik">Seni Musik</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="PAI dan Budi Pekerti">PAI & Budi Pekerti</option>
                    <option value="Muatan Lokal (Bahasa Jawa)">Bahasa Jawa (Mulok)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              {/* Topic / Materi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Materi / Topik Pembelajaran</label>
                <input
                  type="text"
                  value={materiTopik}
                  onChange={(e) => setMateriTopik(e.target.value)}
                  placeholder="Contoh: Bagian Tubuh Tumbuhan dan Fotosintesis"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Alokasi Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alokasi Waktu (JP)</label>
                  <input
                    type="text"
                    value={alokasiWaktu}
                    onChange={(e) => setAlokasiWaktu(e.target.value)}
                    placeholder="Contoh: 4 x 35 Menit (2 Pertemuan)"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan Pendidikan</label>
                  <input
                    type="text"
                    value={school.namaSekolah}
                    disabled
                    className="w-full text-xs p-2 border border-slate-200 bg-slate-100 text-slate-600 rounded-lg"
                  />
                </div>
              </div>

              {/* Catatan Khusus */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instruksi Khusus untuk AI (Opsional)</label>
                <textarea
                  rows={2}
                  value={catatanKhusus}
                  onChange={(e) => setCatatanKhusus(e.target.value)}
                  placeholder="Contoh: Sertakan diferensiasi untuk siswa visual dan kinestetik, sertakan kegiatan observasi di taman sekolah..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyusun Dokumen dengan AI Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Susun {docType.replace('_', ' ')} Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
