import React, { useState } from 'react';
import { FileCheck, Plus, Trash2, Sparkles, Download, Save, Eye, CheckCircle2 } from 'lucide-react';
import { SchoolProfile, LKPDData, CurriculumDoc } from '../../types';
import { storageService } from '../../services/storage';
import { docxExporter } from '../../services/docxExporter';

interface LKPDViewProps {
  school: SchoolProfile;
  onOpenAISummon: () => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
}

export const LKPDView: React.FC<LKPDViewProps> = ({ school, onOpenAISummon, onOpenEditor }) => {
  const [data, setData] = useState<LKPDData>({
    judul: 'Lembar Kerja Peserta Didik (LKPD): Variasi Gerak Dasar Permainan Bola',
    mataPelajaran: school.mataPelajaran || 'PJOK',
    kelas: school.kelasDiampu || 'Kelas 4',
    fase: school.fase || 'Fase B',
    semester: school.semester || 'Ganjil',
    alokasiWaktu: '70 Menit (2 JP)',
    tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi dan mempraktikkan variasi gerak dasar manipulatif menendang dan menghentikan bola.',
    petunjukBelajar: [
      'Berdoalah sebelum mengerjakan lembar kegiatan.',
      'Bekerjasamalah dengan anggota kelompokmu secara rukun dan tertib.',
      'Gunakan kaca pembesar untuk mengamati urat daun dan bulu akar dengan hati-hati.',
      'Tuliskan hasil pengamatanmu pada tabel yang telah disediakan.',
    ],
    ringkasanMateri: 'Tumbuhan tersusun atas organ akar, batang, daun, bunga, buah dan biji. Daun adalah tempat fotosintesis menggunakan zat hijau daun klorofil dan sinar matahari.',
    langkahAktivitas: [
      'Amati 2 jenis daun yang ada di taman sekolah SDN Kasepuhan 04 Batang.',
      'Gambarkan pola susunan tulang daunnya (menyirip/menjari/sejajar).',
      'Diskusikan bagaimana air mengalir dari akar ke pucuk daun.',
    ],
    soalLatihan: [
      {
        id: 'q1',
        nomor: 1,
        tipe: 'Pilihan Ganda',
        pertanyaan: 'Bagian tumbuhan yang bertugas menyerap air dan unsur hara dari tanah adalah ...',
        opsi: ['A. Daun', 'B. Batang', 'C. Akar', 'D. Bunga'],
        kunciJawaban: 'C. Akar',
      },
      {
        id: 'q2',
        nomor: 2,
        tipe: 'Pilihan Ganda',
        pertanyaan: 'Zat hijau pada daun tumbuhan yang berfungsi mengolah makanan dinamakan ...',
        opsi: ['A. Oksigen', 'B. Klorofil', 'C. Glukosa', 'D. Stomata'],
        kunciJawaban: 'B. Klorofil',
      },
      {
        id: 'q3',
        nomor: 3,
        tipe: 'Isian Singkat',
        pertanyaan: 'Sebutkan 3 macam bentuk susunan tulang daun yang sering kamu jumpai!',
        kunciJawaban: 'Menyirip, menjari, sejajar/melengkung.',
      },
    ],
    rubrikPenilaian: [
      {
        kriteria: 'Ketelitian Pengamatan Organ',
        skor4: 'Mengamati 5 organ dengan sangat rinci dan deskripsi akurat.',
        skor3: 'Mengamati 4 organ dengan cukup jelas.',
        skor2: 'Mengamati 2-3 organ secara umum.',
        skor1: 'Hanya menyebutkan 1 organ tanpa deskripsi.',
      },
    ],
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const createDocObject = (): CurriculumDoc => ({
    id: `doc-lkpd-${Date.now()}`,
    title: `${data.judul} — ${data.kelas}`,
    type: 'LKPD',
    kelas: data.kelas,
    fase: data.fase,
    mataPelajaran: data.mataPelajaran,
    tahunPelajaran: school.tahunPelajaran,
    semester: data.semester,
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: data,
  });

  const handleSaveDoc = () => {
    const doc = createDocObject();
    storageService.saveDocument(doc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadWord = async () => {
    setDownloading(true);
    try {
      const doc = createDocObject();
      await docxExporter.exportDocument(doc, school);
    } catch {
      alert('Gagal mengekspor file Word.');
    } finally {
      setDownloading(false);
    }
  };

  const handleAddQuestion = () => {
    const nextNo = data.soalLatihan.length + 1;
    setData({
      ...data,
      soalLatihan: [
        ...data.soalLatihan,
        {
          id: `q-${Date.now()}`,
          nomor: nextNo,
          tipe: 'Pilihan Ganda',
          pertanyaan: '',
          opsi: ['A. ', 'B. ', 'C. ', 'D. '],
          kunciJawaban: 'A',
        },
      ],
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setData({
      ...data,
      soalLatihan: data.soalLatihan.filter((q) => q.id !== id).map((q, i) => ({ ...q, nomor: i + 1 })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FileCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Asesmen & Lembar Kerja Peserta Didik (LKPD)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Susun lembar aktivitas eksplorasi siswa, asesmen formatif interaktif, dan rubrik penilaian 4 skala.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAISummon}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Susun dengan AI</span>
          </button>
          <button
            type="button"
            onClick={handleSaveDoc}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan LKPD'}</span>
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadWord}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Word</span>
          </button>
        </div>
      </div>

      {/* Identitas LKPD Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Judul LKPD</label>
          <input
            type="text"
            value={data.judul}
            onChange={(e) => setData({ ...data, judul: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-lg font-bold"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Alokasi Waktu</label>
          <input
            type="text"
            value={data.alokasiWaktu}
            onChange={(e) => setData({ ...data, alokasiWaktu: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-lg"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block font-semibold text-slate-700 mb-1">Tujuan Pembelajaran (TP)</label>
          <input
            type="text"
            value={data.tujuanPembelajaran}
            onChange={(e) => setData({ ...data, tujuanPembelajaran: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      {/* Petunjuk Belajar & Ringkasan Materi */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-900 mb-1.5">Ringkasan Konsep Materi Siswa</label>
          <textarea
            rows={3}
            value={data.ringkasanMateri}
            onChange={(e) => setData({ ...data, ringkasanMateri: e.target.value })}
            className="w-full p-2.5 border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-900 mb-1.5">Langkah Kerja & Aktivitas Siswa</label>
          {data.langkahAktivitas.map((act, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <span className="font-bold text-slate-500 w-6 pt-2">{idx + 1}.</span>
              <input
                type="text"
                value={act}
                onChange={(e) => {
                  const copy = [...data.langkahAktivitas];
                  copy[idx] = e.target.value;
                  setData({ ...data, langkahAktivitas: copy });
                }}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Soal Latihan & Asesmen Formatif */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-slate-900">Daftar Soal Asesmen & Latihan Siswa</h3>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Soal
          </button>
        </div>

        <div className="space-y-4">
          {data.soalLatihan.map((q, qIdx) => (
            <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900 text-sm">Soal No. {qIdx + 1} ({q.tipe})</span>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pertanyaan / Perintah</label>
                <textarea
                  rows={2}
                  value={q.pertanyaan}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData({
                      ...data,
                      soalLatihan: data.soalLatihan.map((item) => (item.id === q.id ? { ...item, pertanyaan: val } : item)),
                    });
                  }}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              {q.opsi && q.opsi.length > 0 && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilihan Jawaban</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.opsi.map((op, opIdx) => (
                      <input
                        key={opIdx}
                        type="text"
                        value={op}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newOpsi = [...(q.opsi || [])];
                          newOpsi[opIdx] = val;
                          setData({
                            ...data,
                            soalLatihan: data.soalLatihan.map((item) =>
                              item.id === q.id ? { ...item, opsi: newOpsi } : item
                            ),
                          });
                        }}
                        className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
