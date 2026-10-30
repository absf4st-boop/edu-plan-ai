import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Eye, Save, Sparkles } from 'lucide-react';
import { documentImporter, ExtractedDocumentData } from '../../services/documentImporter';
import { CurriculumDoc, DocumentType, SchoolProfile } from '../../types';
import { storageService } from '../../services/storage';

interface ImportViewProps {
  school: SchoolProfile;
  onDocumentImported: (doc: CurriculumDoc) => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({
  school,
  onDocumentImported,
  onOpenEditor,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedDocumentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapping state
  const [targetType, setTargetType] = useState<DocumentType>('MODUL_AJAR');
  const [docTitle, setDocTitle] = useState('');
  const [kelas, setKelas] = useState(school.kelasDiampu || 'Kelas 4');
  const [mataPelajaran, setMataPelajaran] = useState('IPAS');
  const [editableText, setEditableText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProcessFile = async (file: File) => {
    setError(null);
    setLoading(true);
    setSavedSuccess(false);

    try {
      if (file.size > 15 * 1024 * 1024) {
        throw new Error('Ukuran file maksimal 15MB.');
      }

      const res = await documentImporter.importFile(file);
      setExtracted(res);
      setTargetType(res.suggestedType || 'MODUL_AJAR');
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      setEditableText(res.rawText);
    } catch (err: any) {
      setError(err?.message || 'Gagal membaca isi berkas. Pastikan format file sesuai.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleSaveImportedDoc = () => {
    if (!docTitle.trim()) {
      setError('Judul dokumen wajib diisi.');
      return;
    }

    const doc: CurriculumDoc = {
      id: `doc-import-${Date.now()}`,
      title: docTitle.trim(),
      type: targetType,
      kelas,
      fase: kelas === 'Kelas 1' || kelas === 'Kelas 2' ? 'Fase A' : kelas === 'Kelas 3' || kelas === 'Kelas 4' ? 'Fase B' : 'Fase C',
      mataPelajaran,
      tahunPelajaran: school.tahunPelajaran,
      semester: school.semester || 'Ganjil',
      updatedAt: new Date().toISOString(),
      status: 'reviewed',
      content: {
        rawExtractedText: editableText,
        tableData: extracted?.tableData || null,
        importedFileName: extracted?.fileName,
      },
    };

    storageService.saveDocument(doc);
    onDocumentImported(doc);
    setSavedSuccess(true);
    setTimeout(() => {
      onOpenEditor(doc);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <Upload className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Import Berkas Dokumen Kurikulum</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Unggah berkas Microsoft Word (.docx), Excel (.xlsx/.csv), atau PDF untuk diekstrak strukturnya menjadi perangkat pembelajaran di EDU PLAN AI.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {!extracted && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all bg-white ${
            dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800">Tarik dan Letakkan Berkas di Sini</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Mendukung file dokumen <strong>.docx</strong>, lembar sebar <strong>.xlsx / .csv</strong>, atau <strong>.pdf</strong> (Maks. 15 MB)
          </p>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow transition-all cursor-pointer">
            <FileText className="w-4 h-4" /> Pilih Berkas dari Komputer
            <input
              type="file"
              accept=".docx,.xlsx,.xls,.csv,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Extracted Preview & Mapping Panel */}
      {extracted && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                  {extracted.fileType}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{extracted.fileName}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ukuran: {(extracted.fileSize / 1024).toFixed(1)} KB • Teks berhasil diekstrak dan siap dipetakan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setExtracted(null)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Ganti Berkas
            </button>
          </div>

          {/* Mapping Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen Baru</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Petakan ke Jenis Dokumen</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as DocumentType)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="MODUL_AJAR">Modul Ajar / RPP</option>
                <option value="PROTA">Program Tahunan (PROTA)</option>
                <option value="PROMES">Program Semester (PROMES)</option>
                <option value="ATP">Alur Tujuan Pembelajaran (ATP)</option>
                <option value="JURNAL">Jurnal Harian</option>
                <option value="LKPD">LKPD & Asesmen</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={mataPelajaran}
                onChange={(e) => setMataPelajaran(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="IPAS">IPAS</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                <option value="PJOK">PJOK</option>
              </select>
            </div>
          </div>

          {/* Extracted Content Viewer / Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Hasil Ekstraksi Isi Dokumen (Dapat Diedit Langsung):</span>
              <span className="text-[11px] font-normal text-slate-400">Pastikan teks tersusun rapi</span>
            </label>
            <textarea
              rows={12}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl font-mono text-xs bg-slate-50 text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Dokumen akan disimpan ke perpustakaan EDU PLAN AI Anda.
            </span>

            <button
              type="button"
              onClick={handleSaveImportedDoc}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'Tersimpan! Membuka editor...' : 'Simpan & Buka di Editor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
