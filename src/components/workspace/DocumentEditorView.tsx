import React, { useState } from 'react';
import {
  FileText,
  Save,
  Download,
  Eye,
  Edit3,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  Sparkles,
} from 'lucide-react';
import { CurriculumDoc, SchoolProfile } from '../../types';
import { storageService } from '../../services/storage';
import { docxExporter } from '../../services/docxExporter';

interface DocumentEditorViewProps {
  document: CurriculumDoc;
  school: SchoolProfile;
  onBack: () => void;
  onOpenAISummon: () => void;
}

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({
  document: initialDoc,
  school,
  onBack,
  onOpenAISummon,
}) => {
  const [doc, setDoc] = useState<CurriculumDoc>(initialDoc);
  const [viewMode, setViewMode] = useState<'PREVIEW' | 'EDIT'>('PREVIEW');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Editable text content
  const [rawText, setRawText] = useState<string>(() => {
    if (typeof doc.content === 'string') return doc.content;
    if (doc.content?.rawExtractedText) return doc.content.rawExtractedText;
    return JSON.stringify(doc.content, null, 2);
  });

  const handleSave = () => {
    let updatedContent = doc.content;
    try {
      if (typeof doc.content === 'object' && !doc.content?.rawExtractedText) {
        // Try parsing JSON if valid
        const parsed = JSON.parse(rawText);
        updatedContent = parsed;
      } else {
        updatedContent = { ...doc.content, rawExtractedText: rawText };
      }
    } catch {
      updatedContent = { ...doc.content, rawExtractedText: rawText };
    }

    const updatedDoc: CurriculumDoc = {
      ...doc,
      content: updatedContent,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveDocument(updatedDoc);
    setDoc(updatedDoc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadWord = async () => {
    setDownloading(true);
    try {
      await docxExporter.exportDocument(doc, school);
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor file Word.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Extract sections list for left panel
  const getSectionsList = () => {
    if (doc.type === 'MODUL_AJAR') {
      return [
        { id: 'all', title: 'Seluruh Dokumen' },
        { id: 'identitas', title: 'I. Informasi Umum & Identitas' },
        { id: 'kompetensi', title: 'II. Kompetensi Awal & Profil Pancasila' },
        { id: 'tujuan', title: 'III. Tujuan Pembelajaran' },
        { id: 'pemantik', title: 'IV. Pertanyaan Pemantik & Pemahaman' },
        { id: 'kegiatan', title: 'V. Langkah Pembelajaran (KBM)' },
        { id: 'asesmen', title: 'VI. Asesmen & Rubrik Penilaian' },
        { id: 'diferensiasi', title: 'VII. Diferensiasi & Remedial' },
        { id: 'lampiran', title: 'VIII. Lampiran & Lembar Kerja' },
        { id: 'pengesahan', title: 'IX. Lembar Pengesahan' },
      ];
    }
    return [
      { id: 'all', title: 'Seluruh Dokumen' },
      { id: 'kop', title: 'Kop Surat Satuan Pendidikan' },
      { id: 'tabel', title: 'Tabel Matriks Konten' },
      { id: 'pengesahan', title: 'Lembar Pengesahan' },
    ];
  };

  const sections = getSectionsList();

  return (
    <div className="space-y-4">
      {/* Editor Top Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                {doc.type.replace('_', ' ')}
              </span>
              <h2 className="text-base font-bold text-slate-900 truncate max-w-md">{doc.title}</h2>
            </div>
            <p className="text-xs text-slate-500">
              {doc.kelas} • {doc.mataPelajaran} • TP {doc.tahunPelajaran}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View / Edit Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('PREVIEW')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'PREVIEW' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Pratinjau Kertas
            </button>
            <button
              type="button"
              onClick={() => setViewMode('EDIT')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'EDIT' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Editor Teks
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAISummon}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Edit</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveSuccess ? 'Tersimpan!' : 'Simpan'}</span>
          </button>

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadWord}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Memproses...' : 'Unduh Word (.docx)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Cetak Dokumen"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Panel Kiri: Navigasi Bagian Dokumen */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Struktur & Navigasi Bab
          </h3>
          <div className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex justify-between">
              <span>Status Dokumen:</span>
              <span className="font-bold text-emerald-600">Siap Cetak</span>
            </div>
            <div className="flex justify-between">
              <span>Ukuran Kertas:</span>
              <span className="font-semibold text-slate-700">A4 Standar</span>
            </div>
            <div className="flex justify-between">
              <span>Format Ekspor:</span>
              <span className="font-semibold text-blue-700">DOCX Valid</span>
            </div>
          </div>
        </div>

        {/* Panel Kanan: Preview Lembar Kertas / Editor Teks */}
        <div className="lg:col-span-3">
          {viewMode === 'PREVIEW' ? (
            /* Realistic Paper Preview (A4 Look) */
            <div className="bg-slate-200/60 p-4 sm:p-8 rounded-2xl overflow-x-auto flex justify-center">
              <div className="bg-white max-w-[800px] w-full min-h-[1050px] shadow-2xl p-8 sm:p-14 text-slate-900 font-serif border border-slate-200 text-xs sm:text-sm leading-relaxed">
                {/* School Header Kop */}
                <div className="text-center pb-3 border-b-4 border-double border-black mb-6">
                  <h4 className="font-bold uppercase text-xs sm:text-sm">
                    PEMERINTAH KABUPATEN {school.kabupaten.toUpperCase()}
                  </h4>
                  <h4 className="font-bold uppercase text-xs sm:text-sm">DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
                  <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wide">
                    {school.namaSekolah.toUpperCase()}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-600 italic mt-0.5">
                    Alamat: {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi} | NPSN: {school.npsn || '20322746'}
                  </p>
                </div>

                {/* Title */}
                <div className="text-center my-6">
                  <h2 className="text-base sm:text-lg font-extrabold uppercase text-blue-950">
                    {doc.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-sans mt-1">
                    Tahun Pelajaran {school.tahunPelajaran}
                  </p>
                </div>

                {/* Body Content Rendering */}
                {doc.type === 'MODUL_AJAR' || doc.type === 'RPP_RINGKAS' ? (
                  <div className="space-y-6 font-sans text-xs sm:text-sm">
                    {/* A. Informasi Umum */}
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm uppercase mb-2">A. Informasi Umum</h4>
                      <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg grid grid-cols-2 gap-2 text-xs">
                        <div><strong>Nama Penyusun:</strong> {doc.content?.identitas?.namaPenyusun || school.namaGuru}</div>
                        <div><strong>Institusi:</strong> {doc.content?.identitas?.institusi || school.namaSekolah}</div>
                        <div><strong>Mata Pelajaran:</strong> {doc.mataPelajaran}</div>
                        <div><strong>Fase / Kelas:</strong> {doc.fase} / {doc.kelas}</div>
                        <div><strong>Alokasi Waktu:</strong> {doc.content?.identitas?.alokasiWaktu || '4 x 35 Menit'}</div>
                        <div><strong>Model:</strong> {doc.content?.modelPembelajaran || 'Problem Based Learning'}</div>
                      </div>
                    </div>

                    {/* B. Komponen Inti */}
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm uppercase mb-2">B. Komponen Inti</h4>
                      <div className="space-y-3">
                        <div>
                          <strong>1. Tujuan Pembelajaran (TP):</strong>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {(doc.content?.komponenInti?.tujuanPembelajaran || ['Memahami konsep pembelajaran']).map((tp: string, i: number) => (
                              <li key={i}>{tp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>2. Pemahaman Bermakna:</strong>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {(doc.content?.komponenInti?.pemahamanBermakna || ['Penerapan dalam kehidupan sehari-hari']).map((m: string, i: number) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>3. Pertanyaan Pemantik:</strong>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {(doc.content?.komponenInti?.pertanyaanPemantik || ['Mengapa materi ini penting?']).map((p: string, i: number) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* C. Kegiatan Pembelajaran */}
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm uppercase mb-2">C. Langkah-Langkah Pembelajaran</h4>
                      {(doc.content?.komponenInti?.kegiatanPembelajaran || []).map((k: any, i: number) => (
                        <div key={i} className="mb-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                          <span className="font-bold text-blue-800 block mb-1">Pertemuan ke-{k.pertemuanKe || i + 1}:</span>
                          <div className="space-y-1.5 pl-2 text-xs">
                            <p><strong>Pendahuluan:</strong> {Array.isArray(k.pendahuluan) ? k.pendahuluan.join(' ') : k.pendahuluan}</p>
                            <p><strong>Kegiatan Inti:</strong> {Array.isArray(k.inti) ? k.inti.join(' ') : k.inti}</p>
                            <p><strong>Penutup:</strong> {Array.isArray(k.penutup) ? k.penutup.join(' ') : k.penutup}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* D. Asesmen */}
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm uppercase mb-2">D. Asesmen & Penilaian</h4>
                      <p><strong>Formatif:</strong> {doc.content?.komponenInti?.asesmen?.formatif || 'Observasi dan LKPD'}</p>
                      <p className="mt-1"><strong>Sumatif:</strong> {doc.content?.komponenInti?.asesmen?.sumatif || 'Tes tertulis akhir lingkup materi'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs leading-relaxed font-sans">
                    <pre className="whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {rawText}
                    </pre>
                  </div>
                )}

                {/* Signature Block */}
                <div className="mt-16 pt-8 grid grid-cols-2 gap-8 text-center font-sans text-xs">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-semibold">Kepala Sekolah</p>
                    <div className="h-16" />
                    <p className="font-bold underline">{school.namaKepalaSekolah}</p>
                    <p className="text-[11px] text-slate-500">NIP. {school.nipKepalaSekolah || '-'}</p>
                  </div>
                  <div>
                    <p>{school.kabupaten}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-semibold">{school.jabatanGuru || 'Guru Kelas'}</p>
                    <div className="h-16" />
                    <p className="font-bold underline">{school.namaGuru}</p>
                    <p className="text-[11px] text-slate-500">NIP. {school.nipGuru || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Text Raw Editor */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-xs font-bold text-slate-700">Editor Konten Mentah Dokumen</span>
                <span className="text-xs text-slate-400">Edit teks lalu klik Simpan</span>
              </div>
              <textarea
                rows={22}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-4 font-mono text-xs border border-slate-300 rounded-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan Teks
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
