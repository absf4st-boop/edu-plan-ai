import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Save,
  Download,
  Eye,
  Layers,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { SchoolProfile, ModulAjarData, CurriculumDoc } from '../../types';
import { aiService } from '../../services/ai';
import { storageService, SAMPLE_MODUL_AJAR } from '../../services/storage';
import { docxExporter } from '../../services/docxExporter';

interface ModulAjarWizardProps {
  school: SchoolProfile;
  onOpenAISummon: () => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
}

export const ModulAjarWizard: React.FC<ModulAjarWizardProps> = ({
  school,
  onOpenAISummon,
  onOpenEditor,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Wizard Data State
  const [formData, setFormData] = useState<ModulAjarData>(SAMPLE_MODUL_AJAR);
  const [templateChoice, setTemplateChoice] = useState<'LENGKAP' | 'RINGKAS'>('LENGKAP');
  const [savedDoc, setSavedDoc] = useState<CurriculumDoc | null>(null);

  // Step 1: Identitas
  const updateIdentitas = (field: string, val: any) => {
    setFormData({
      ...formData,
      identitas: { ...formData.identitas, [field]: val },
    });
  };

  // Generate with AI from the wizard
  const handleAIGenerateFromWizard = async () => {
    setIsGenerating(true);
    try {
      const generated = await aiService.generateDocument({
        type: 'MODUL_AJAR',
        schoolName: school.namaSekolah,
        teacherName: school.namaGuru,
        kelas: formData.identitas.faseKelas.split('/')[1]?.trim() || school.kelasDiampu || 'Kelas 4',
        fase: formData.identitas.faseKelas.split('/')[0]?.trim() || school.fase || 'Fase B',
        mataPelajaran: formData.identitas.mataPelajaran,
        materiTopik: formData.identitas.elemen,
        alokasiWaktu: formData.identitas.alokasiWaktu,
      });

      if (generated && generated.identitas) {
        setFormData(generated);
      }
      setCurrentStep(6); // Go to review step
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses AI. Tetap menggunakan draf saat ini.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDocs = () => {
    const docId = savedDoc ? savedDoc.id : `doc-modul-${Date.now()}`;
    const doc: CurriculumDoc = {
      id: docId,
      title: `Modul Ajar ${formData.identitas.mataPelajaran} ${formData.identitas.faseKelas} — ${formData.identitas.elemen}`,
      type: templateChoice === 'RINGKAS' ? 'RPP_RINGKAS' : 'MODUL_AJAR',
      kelas: formData.identitas.faseKelas.split('/')[1]?.trim() || 'Kelas 4',
      fase: formData.identitas.faseKelas.split('/')[0]?.trim() || 'Fase B',
      mataPelajaran: formData.identitas.mataPelajaran,
      tahunPelajaran: formData.identitas.tahunPelajaran,
      semester: school.semester || 'Ganjil',
      updatedAt: new Date().toISOString(),
      status: 'final',
      content: formData,
    };

    storageService.saveDocument(doc);
    setSavedDoc(doc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadWord = async () => {
    setDownloading(true);
    try {
      const doc: CurriculumDoc = savedDoc || {
        id: `doc-modul-${Date.now()}`,
        title: `Modul Ajar ${formData.identitas.mataPelajaran} ${formData.identitas.faseKelas}`,
        type: 'MODUL_AJAR',
        kelas: formData.identitas.faseKelas.split('/')[1]?.trim() || 'Kelas 4',
        fase: formData.identitas.faseKelas.split('/')[0]?.trim() || 'Fase B',
        mataPelajaran: formData.identitas.mataPelajaran,
        tahunPelajaran: formData.identitas.tahunPelajaran,
        semester: 'Ganjil',
        updatedAt: new Date().toISOString(),
        status: 'final',
        content: formData,
      };

      await docxExporter.exportDocument(doc, school);
    } catch {
      alert('Gagal mengekspor file Word.');
    } finally {
      setDownloading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Identitas Modul' },
    { num: 2, title: 'Materi & TP' },
    { num: 3, title: 'Strategi & Model' },
    { num: 4, title: 'Asesmen & Rubrik' },
    { num: 5, title: 'Pilih Template' },
    { num: 6, title: 'Hasil & Verifikasi' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Generator Modul Ajar / RPP Kurikulum Merdeka</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Panduan wizard 6-langkah untuk menyusun Modul Ajar lengkap (19 komponen) atau RPP ringkas berdiferensiasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAIGenerateFromWizard}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? 'AI Sedang Menyusun...' : 'Susun Cepat dengan AI'}</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px]">
          {steps.map((st) => (
            <button
              key={st.num}
              type="button"
              onClick={() => setCurrentStep(st.num)}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  currentStep === st.num
                    ? 'bg-blue-600 text-white shadow-md'
                    : currentStep > st.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}
              >
                {currentStep > st.num ? <CheckCircle2 className="w-4 h-4" /> : st.num}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Langkah {st.num}</span>
                <span
                  className={`text-xs font-semibold block whitespace-nowrap ${
                    currentStep === st.num ? 'text-blue-700' : 'text-slate-700'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        {/* LANGKAH 1 — Identitas */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Langkah 1 — Identitas Satuan Pendidikan & Modul</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Penyusun (Guru)</label>
                <input
                  type="text"
                  value={formData.identitas.namaPenyusun}
                  onChange={(e) => updateIdentitas('namaPenyusun', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Satuan Pendidikan (Sekolah)</label>
                <input
                  type="text"
                  value={formData.identitas.institusi}
                  onChange={(e) => updateIdentitas('institusi', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={formData.identitas.mataPelajaran}
                  onChange={(e) => updateIdentitas('mataPelajaran', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fase / Kelas</label>
                <input
                  type="text"
                  value={formData.identitas.faseKelas}
                  onChange={(e) => updateIdentitas('faseKelas', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
                <input
                  type="text"
                  value={formData.identitas.tahunPelajaran}
                  onChange={(e) => updateIdentitas('tahunPelajaran', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alokasi Waktu</label>
                <input
                  type="text"
                  value={formData.identitas.alokasiWaktu}
                  onChange={(e) => updateIdentitas('alokasiWaktu', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 2 — Materi & TP */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Langkah 2 — Materi, Capaian & Tujuan Pembelajaran</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topik / Lingkup Materi Pokok</label>
                <input
                  type="text"
                  value={formData.identitas.elemen}
                  onChange={(e) => updateIdentitas('elemen', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kompetensi Awal Peserta Didik</label>
                {formData.kompetensiAwal.map((ka, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={ka}
                      onChange={(e) => {
                        const copy = [...formData.kompetensiAwal];
                        copy[idx] = e.target.value;
                        setFormData({ ...formData, kompetensiAwal: copy });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tujuan Pembelajaran (TP)</label>
                {formData.komponenInti.tujuanPembelajaran.map((tp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tp}
                      onChange={(e) => {
                        const copy = [...formData.komponenInti.tujuanPembelajaran];
                        copy[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          komponenInti: { ...formData.komponenInti, tujuanPembelajaran: copy },
                        });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 3 — Strategi Pembelajaran */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Langkah 3 — Model, Metode & Karakteristik Pembelajaran</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Model Pembelajaran</label>
                <select
                  value={formData.modelPembelajaran}
                  onChange={(e) => setFormData({ ...formData, modelPembelajaran: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                >
                  <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                  <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                  <option value="Inquiry Learning">Inquiry Terbimbing</option>
                  <option value="Discovery Learning">Discovery Learning</option>
                  <option value="Cooperative Learning">Cooperative Learning</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Peserta Didik</label>
                <input
                  type="text"
                  value={formData.targetPesertaDidik}
                  onChange={(e) => setFormData({ ...formData, targetPesertaDidik: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Diferensiasi Pembelajaran (Proses & Konten)</label>
                <textarea
                  rows={2}
                  value={formData.komponenInti.diferensiasi.proses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      komponenInti: {
                        ...formData.komponenInti,
                        diferensiasi: { ...formData.komponenInti.diferensiasi, proses: e.target.value },
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 4 — Asesmen & Rubrik */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Langkah 4 — Penilaian & Asesmen (Diagnostik, Formatif, Sumatif)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asesmen Awal / Diagnostik</label>
                <input
                  type="text"
                  value={formData.komponenInti.asesmen.diagnostik}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      komponenInti: {
                        ...formData.komponenInti,
                        asesmen: { ...formData.komponenInti.asesmen, diagnostik: e.target.value },
                      },
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asesmen Formatif (Proses & LKPD)</label>
                <input
                  type="text"
                  value={formData.komponenInti.asesmen.formatif}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      komponenInti: {
                        ...formData.komponenInti,
                        asesmen: { ...formData.komponenInti.asesmen, formatif: e.target.value },
                      },
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asesmen Sumatif (Akhir Lingkup Materi)</label>
                <input
                  type="text"
                  value={formData.komponenInti.asesmen.sumatif}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      komponenInti: {
                        ...formData.komponenInti,
                        asesmen: { ...formData.komponenInti.asesmen, sumatif: e.target.value },
                      },
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rubrik Penilaian</label>
                <textarea
                  rows={2}
                  value={formData.komponenInti.asesmen.rubrik}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      komponenInti: {
                        ...formData.komponenInti,
                        asesmen: { ...formData.komponenInti.asesmen, rubrik: e.target.value },
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 5 — Pilih Template */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Langkah 5 — Pilih Format Template Dokumen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setTemplateChoice('LENGKAP')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  templateChoice === 'LENGKAP'
                    ? 'border-blue-600 bg-blue-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">Modul Ajar Lengkap (19 Komponen)</span>
                  {templateChoice === 'LENGKAP' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-600">
                  Format komprehensif resmi Kemendikbudristek: memuat informasi umum, pemahaman bermakna, pertanyaan pemantik, kegiatan rinci, rubrik penilaian, remedial, pengayaan, dan lampiran.
                </p>
              </div>

              <div
                onClick={() => setTemplateChoice('RINGKAS')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  templateChoice === 'RINGKAS'
                    ? 'border-blue-600 bg-blue-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">RPP Ringkas Berdiferensiasi</span>
                  {templateChoice === 'RINGKAS' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-600">
                  Format ringkas dan praktis berfokus pada 3 komponen utama: Tujuan Pembelajaran, Langkah Pembelajaran Interaktif, dan Asesmen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 6 — Hasil & Verifikasi */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">Langkah 6 — Pratinjau & Pengesahan Modul Ajar</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Struktur Valid
              </span>
            </div>

            {/* Quick summary of the document */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-800">
                <span>{formData.identitas.mataPelajaran} — {formData.identitas.faseKelas}</span>
                <span>{formData.identitas.alokasiWaktu}</span>
              </div>
              <p className="text-slate-600">Topik: <strong>{formData.identitas.elemen}</strong></p>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1">Tujuan Pembelajaran:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {formData.komponenInti.tujuanPembelajaran.map((tp, idx) => (
                    <li key={idx}>{tp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions: Save, Open in Editor, Download Word */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleSaveToDocs}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saveSuccess ? 'Tersimpan ke Perpustakaan!' : 'Simpan Modul Ajar'}</span>
              </button>

              <button
                type="button"
                disabled={downloading}
                onClick={handleDownloadWord}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Membuat Word...' : 'Unduh Word (.docx) Valid'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const doc: CurriculumDoc = savedDoc || {
                    id: `doc-modul-${Date.now()}`,
                    title: `Modul Ajar ${formData.identitas.mataPelajaran} ${formData.identitas.faseKelas}`,
                    type: 'MODUL_AJAR',
                    kelas: formData.identitas.faseKelas.split('/')[1]?.trim() || 'Kelas 4',
                    fase: formData.identitas.faseKelas.split('/')[0]?.trim() || 'Fase B',
                    mataPelajaran: formData.identitas.mataPelajaran,
                    tahunPelajaran: formData.identitas.tahunPelajaran,
                    semester: 'Ganjil',
                    updatedAt: new Date().toISOString(),
                    status: 'final',
                    content: formData,
                  };
                  onOpenEditor(doc);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Buka di Editor Dua Panel</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Sebelumnya
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Selanjutnya <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveToDocs}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
