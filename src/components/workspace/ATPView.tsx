import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Sparkles, Download, Save, FileSpreadsheet } from 'lucide-react';
import { SchoolProfile, ATPRow, CurriculumDoc } from '../../types';
import { storageService } from '../../services/storage';
import { docxExporter } from '../../services/docxExporter';
import { excelExporter } from '../../services/excelExporter';

interface ATPViewProps {
  school: SchoolProfile;
  onOpenAISummon: () => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
}

export const ATPView: React.FC<ATPViewProps> = ({ school, onOpenAISummon, onOpenEditor }) => {
  const [kelas, setKelas] = useState(school.kelasDiampu || 'Kelas 4');
  const [fase, setFase] = useState(school.fase || 'Fase B');
  const [mataPelajaran, setMataPelajaran] = useState(school.mataPelajaran || 'PJOK');

  const [rows, setRows] = useState<ATPRow[]>([
    { id: '1', no: 1, kodeTP: 'TP 4.1', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan variasi pola gerak dasar menendang, menghentikan, dan menggiring bola pada sepak bola.', materi: 'Permainan Bola Besar (Sepak Bola)', urutan: 1, alokasiWaktu: '12 JP', catatan: 'Praktik Lapangan' },
    { id: '2', no: 2, kodeTP: 'TP 4.2', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan variasi passing bawah dan servis pada permainan bola voli.', materi: 'Permainan Bola Voli', urutan: 2, alokasiWaktu: '12 JP', catatan: 'Drill dan Game Situasi' },
    { id: '3', no: 3, kodeTP: 'TP 4.3', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan teknik melempar, menangkap, dan memukul bola pada permainan kasti.', materi: 'Permainan Kasti', urutan: 3, alokasiWaktu: '12 JP', catatan: 'Permainan Tradisional' },
    { id: '4', no: 4, kodeTP: 'TP 4.4', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan kombinasi gerak lari cepat dan lompat jauh gaya jongkok.', materi: 'Atletik (Lari & Lompat)', urutan: 4, alokasiWaktu: '12 JP', catatan: 'Pengukuran Prestasi' },
    { id: '5', no: 5, kodeTP: 'TP 4.5', cpTerkait: 'Kebugaran Jasmani', deskripsiTP: 'Mempraktikkan rangkaian latihan kelincahan (shuttle run) dan kekuatan push up/sit up.', materi: 'Kebugaran Jasmani', urutan: 5, alokasiWaktu: '14 JP', catatan: 'Tes Kebugaran Siswa' },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleAddRow = () => {
    const newNo = rows.length + 1;
    setRows([
      ...rows,
      {
        id: `atp-${Date.now()}`,
        no: newNo,
        kodeTP: `TP 4.${newNo}`,
        cpTerkait: 'Elemen Pemahaman',
        deskripsiTP: '',
        materi: '',
        urutan: newNo,
        alokasiWaktu: '10 JP',
        catatan: '',
      },
    ]);
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id).map((r, i) => ({ ...r, no: i + 1, urutan: i + 1 })));
  };

  const createDocObject = (): CurriculumDoc => ({
    id: `doc-atp-${Date.now()}`,
    title: `Alur Tujuan Pembelajaran (ATP) ${mataPelajaran} ${kelas} (${fase})`,
    type: 'ATP',
    kelas,
    fase,
    mataPelajaran,
    tahunPelajaran: school.tahunPelajaran,
    semester: '1 & 2',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: { rows },
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

  const handleDownloadExcel = () => {
    const doc = createDocObject();
    excelExporter.exportToExcel(doc, school);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Alur Tujuan Pembelajaran (ATP) SD</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rangkaian Tujuan Pembelajaran yang tersusun secara sistematis dan logis di dalam fase secara utuh dan terpadu.
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
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan ATP'}</span>
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
          <button
            type="button"
            onClick={handleDownloadExcel}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* ATP Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Tabel Alur Pembelajaran</h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Alur
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-2 text-center w-10">No</th>
                <th className="py-2.5 px-2 text-center w-20">Kode</th>
                <th className="py-2.5 px-3">Tujuan Pembelajaran (TP)</th>
                <th className="py-2.5 px-3 w-48">Materi Pembelajaran</th>
                <th className="py-2.5 px-2 text-center w-24">Alokasi</th>
                <th className="py-2.5 px-3 w-44">Catatan KBM</th>
                <th className="py-2.5 px-2 text-center w-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, index) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2 text-center font-bold text-slate-500">{index + 1}</td>
                  <td className="py-2 px-2 text-center font-bold text-blue-700">{r.kodeTP}</td>
                  <td className="py-2 px-3">
                    <textarea
                      rows={2}
                      value={r.deskripsiTP}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRows(rows.map((item) => (item.id === r.id ? { ...item, deskripsiTP: val } : item)));
                      }}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={r.materi}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRows(rows.map((item) => (item.id === r.id ? { ...item, materi: val } : item)));
                      }}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="text"
                      value={r.alokasiWaktu}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRows(rows.map((item) => (item.id === r.id ? { ...item, alokasiWaktu: val } : item)));
                      }}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs text-center font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={r.catatan}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRows(rows.map((item) => (item.id === r.id ? { ...item, catatan: val } : item)));
                      }}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(r.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
