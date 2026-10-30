import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Sparkles, Download, Save, FileSpreadsheet, Check } from 'lucide-react';
import { SchoolProfile, PROMESRow, CurriculumDoc } from '../../types';
import { storageService } from '../../services/storage';
import { docxExporter } from '../../services/docxExporter';
import { excelExporter } from '../../services/excelExporter';

interface PROMESViewProps {
  school: SchoolProfile;
  onOpenAISummon: () => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
}

export const PROMESView: React.FC<PROMESViewProps> = ({ school, onOpenAISummon, onOpenEditor }) => {
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(school.semester || 'Ganjil');
  const [kelas, setKelas] = useState(school.kelasDiampu || 'Kelas 4');
  const [fase, setFase] = useState(school.fase || 'Fase B');
  const [mataPelajaran, setMataPelajaran] = useState(school.mataPelajaran || 'PJOK');

  const bulanList = semester === 'Genap'
    ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni']
    : ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const [rows, setRows] = useState<PROMESRow[]>([
    {
      id: '1',
      no: 1,
      tujuanPembelajaran: 'Mempraktikkan variasi pola gerak dasar lokomotor, non-lokomotor, dan manipulatif permainan bola besar',
      materi: 'Permainan Bola Besar (Sepak Bola/Voli)',
      alokasiWaktu: 12,
      distribusiMinggu: { 'Juli_W3': true, 'Juli_W4': true, 'Agustus_W1': true },
      keterangan: 'TM 1-3',
    },
    {
      id: '2',
      no: 2,
      tujuanPembelajaran: 'Mempraktikkan variasi pola gerak dasar permainan bola kecil (kasti/rounders)',
      materi: 'Permainan Bola Kecil (Kasti)',
      alokasiWaktu: 12,
      distribusiMinggu: { 'Agustus_W2': true, 'Agustus_W3': true, 'Agustus_W4': true },
      keterangan: 'TM 4-6',
    },
    {
      id: '3',
      no: 3,
      tujuanPembelajaran: 'Mempraktikkan gerak dasar jalan, lari, lompat, dan lempar pada aktivitas atletik',
      materi: 'Aktivitas Atletik Dasar',
      alokasiWaktu: 12,
      distribusiMinggu: { 'September_W1': true, 'September_W2': true, 'September_W3': true },
      keterangan: 'TM 7-9',
    },
    {
      id: '4',
      no: 4,
      tujuanPembelajaran: 'Penilaian Sumatif Tengah Semester (STS) Praktik dan Teori PJOK',
      materi: 'Sumatif Tengah Semester',
      alokasiWaktu: 4,
      distribusiMinggu: { 'September_W4': true },
      keterangan: 'STS',
    },
    {
      id: '5',
      no: 5,
      tujuanPembelajaran: 'Mempraktikkan pola gerak dasar senam lantai (keseimbangan dan berguling)',
      materi: 'Senam Lantai',
      alokasiWaktu: 12,
      distribusiMinggu: { 'Oktober_W1': true, 'Oktober_W2': true, 'Oktober_W3': true },
      keterangan: 'TM 10-12',
    },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const toggleWeek = (rowId: string, weekKey: string) => {
    setRows(
      rows.map((r) => {
        if (r.id !== rowId) return r;
        const current = r.distribusiMinggu || {};
        return {
          ...r,
          distribusiMinggu: {
            ...current,
            [weekKey]: !current[weekKey],
          },
        };
      })
    );
  };

  const handleAddRow = () => {
    const newNo = rows.length + 1;
    const newRow: PROMESRow = {
      id: `row-${Date.now()}`,
      no: newNo,
      tujuanPembelajaran: '',
      materi: '',
      alokasiWaktu: 10,
      distribusiMinggu: {},
      keterangan: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id).map((r, i) => ({ ...r, no: i + 1 })));
  };

  const createDocObject = (): CurriculumDoc => ({
    id: `doc-promes-${Date.now()}`,
    title: `Program Semester (PROMES) ${mataPelajaran} ${kelas} ${semester} — TP ${school.tahunPelajaran}`,
    type: 'PROMES',
    kelas,
    fase,
    mataPelajaran,
    tahunPelajaran: school.tahunPelajaran,
    semester,
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      bulanList,
      mingguPerBulan: 4,
      rows,
    },
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
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Program Semester (PROMES) Kurikulum Merdeka</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penjabaran program tahunan ke dalam alokasi waktu per bulan dan minggu efektif pelaksanaan KBM semester.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAISummon}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Susun dengan AI</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDoc}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan PROMES'}</span>
          </button>

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadWord}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Word</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadExcel}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Identity Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
          <select
            value={mataPelajaran}
            onChange={(e) => setMataPelajaran(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="IPAS">IPAS (Sains & Sosial)</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Matematika">Matematika</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
            <option value="PJOK">PJOK</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Kelas SD</label>
          <select
            value={kelas}
            onChange={(e) => {
              const k = e.target.value;
              const f = k === 'Kelas 1' || k === 'Kelas 2' ? 'Fase A' : k === 'Kelas 3' || k === 'Kelas 4' ? 'Fase B' : 'Fase C';
              setKelas(k);
              setFase(f);
            }}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <label className="block font-semibold text-slate-700 mb-1">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value as any)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Ganjil">Semester Ganjil (Juli - Des)</option>
            <option value="Genap">Semester Genap (Jan - Jun)</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
          <input
            type="text"
            value={school.tahunPelajaran}
            disabled
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-bold"
          />
        </div>
      </div>

      {/* Promes Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Matriks Distribusi Minggu Efektif KBM</h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Baris
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th rowSpan={2} className="py-2.5 px-2 text-center border-r border-slate-200 w-10">No</th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 min-w-[220px]">Tujuan Pembelajaran</th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 min-w-[160px]">Materi Pokok</th>
                <th rowSpan={2} className="py-2.5 px-2 text-center border-r border-slate-200 w-16">JP</th>
                {bulanList.map((bulan) => (
                  <th key={bulan} colSpan={4} className="py-1 px-2 text-center border-r border-slate-200 bg-slate-100/70 font-bold text-blue-900">
                    {bulan}
                  </th>
                ))}
                <th rowSpan={2} className="py-2.5 px-2 text-center w-10">Aksi</th>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-100/40 text-[10px] text-slate-500 font-bold text-center">
                {bulanList.flatMap((bulan) =>
                  [1, 2, 3, 4].map((w) => (
                    <th key={`${bulan}_W${w}`} className="py-1 px-1 border-r border-slate-200 w-6">
                      {w}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2 text-center font-bold text-slate-500 border-r border-slate-100">{index + 1}</td>
                  <td className="py-2 px-3 border-r border-slate-100">
                    <input
                      type="text"
                      value={row.tujuanPembelajaran}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRows(rows.map((r) => (r.id === row.id ? { ...r, tujuanPembelajaran: val } : r)));
                      }}
                      className="w-full p-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 border-r border-slate-100">
                    <input
                      type="text"
                      value={row.materi}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRows(rows.map((r) => (r.id === row.id ? { ...r, materi: val } : r)));
                      }}
                      className="w-full p-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-1 text-center font-bold border-r border-slate-100">
                    <input
                      type="number"
                      value={row.alokasiWaktu}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRows(rows.map((r) => (r.id === row.id ? { ...r, alokasiWaktu: val } : r)));
                      }}
                      className="w-12 p-1 text-center border border-slate-300 rounded text-xs font-bold"
                    />
                  </td>

                  {/* Interactive week checkboxes */}
                  {bulanList.flatMap((bulan) =>
                    [1, 2, 3, 4].map((w) => {
                      const weekKey = `${bulan}_W${w}`;
                      const isChecked = !!row.distribusiMinggu?.[weekKey];
                      return (
                        <td
                          key={weekKey}
                          onClick={() => toggleWeek(row.id, weekKey)}
                          className={`py-1 px-1 text-center border-r border-slate-100 cursor-pointer transition-colors ${
                            isChecked ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-200 text-slate-300'
                          }`}
                        >
                          {isChecked ? <Check className="w-3.5 h-3.5 mx-auto" /> : '-'}
                        </td>
                      );
                    })
                  )}

                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
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
