import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Sparkles, Download, Save, FileSpreadsheet, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { SchoolProfile, PROTARow, CurriculumDoc } from '../../types';
import { storageService } from '../../services/storage';
import { docxExporter } from '../../services/docxExporter';
import { excelExporter } from '../../services/excelExporter';

interface PROTAViewProps {
  school: SchoolProfile;
  onOpenAISummon: () => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
}

export const PROTAView: React.FC<PROTAViewProps> = ({ school, onOpenAISummon, onOpenEditor }) => {
  const [kelas, setKelas] = useState(school.kelasDiampu || 'Kelas 4');
  const [fase, setFase] = useState(school.fase || 'Fase B');
  const [mataPelajaran, setMataPelajaran] = useState(school.mataPelajaran || 'PJOK');
  const [rows, setRows] = useState<PROTARow[]>([
    { id: '1', no: 1, semester: '1', tujuanPembelajaran: 'Mempraktikkan variasi pola gerak dasar lokomotor, non-lokomotor, dan manipulatif dalam permainan bola besar (sepak bola/voli)', materiPembelajaran: 'Permainan Bola Besar', alokasiWaktu: 12, keterangan: 'Bab 1' },
    { id: '2', no: 2, semester: '1', tujuanPembelajaran: 'Mempraktikkan variasi pola gerak dasar dalam permainan bola kecil (kasti/rounders)', materiPembelajaran: 'Permainan Bola Kecil (Kasti)', alokasiWaktu: 12, keterangan: 'Bab 2' },
    { id: '3', no: 3, semester: '1', tujuanPembelajaran: 'Mempraktikkan gerak dasar jalan, lari, lompat, dan lempar pada aktivitas atletik', materiPembelajaran: 'Aktivitas Atletik Dasar', alokasiWaktu: 12, keterangan: 'Bab 3' },
    { id: '4', no: 4, semester: '1', tujuanPembelajaran: 'Mempraktikkan pola gerak dasar dominan senam lantai (keseimbangan, berguling)', materiPembelajaran: 'Senam Lantai', alokasiWaktu: 12, keterangan: 'Bab 4' },
    { id: '5', no: 5, semester: '2', tujuanPembelajaran: 'Mempraktikkan variasi pola gerak berirama (langkah kaki dan ayunan lengan)', materiPembelajaran: 'Aktivitas Gerak Berirama', alokasiWaktu: 12, keterangan: 'Bab 5' },
    { id: '6', no: 6, semester: '2', tujuanPembelajaran: 'Mempraktikkan aktivitas kebugaran jasmani untuk daya tahan dan kekuatan otot', materiPembelajaran: 'Aktivitas Kebugaran Jasmani', alokasiWaktu: 14, keterangan: 'Bab 6' },
    { id: '7', no: 7, semester: '2', tujuanPembelajaran: 'Menganalisis pola perilaku hidup sehat, kebersihan diri, dan makanan bergizi', materiPembelajaran: 'Pola Hidup Sehat', alokasiWaktu: 10, keterangan: 'Bab 7' },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Auto calculate total JP
  const totalJP = rows.reduce((acc, r) => acc + (Number(r.alokasiWaktu) || 0), 0);

  const handleAddRow = () => {
    const newNo = rows.length + 1;
    const newRow: PROTARow = {
      id: `row-${Date.now()}`,
      no: newNo,
      semester: newNo > 5 ? '2' : '1',
      tujuanPembelajaran: '',
      materiPembelajaran: '',
      alokasiWaktu: 12,
      keterangan: `Bab ${newNo}`,
    };
    setRows([...rows, newRow]);
  };

  const handleUpdateRow = (id: string, field: keyof PROTARow, val: any) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id).map((r, i) => ({ ...r, no: i + 1 })));
  };

  const createDocObject = (): CurriculumDoc => ({
    id: `doc-prota-${Date.now()}`,
    title: `Program Tahunan (PROTA) ${mataPelajaran} ${kelas} — TP ${school.tahunPelajaran}`,
    type: 'PROTA',
    kelas,
    fase,
    mataPelajaran,
    tahunPelajaran: school.tahunPelajaran,
    semester: '1 & 2',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      rows,
      totalJP,
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
    } catch (err) {
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
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Program Tahunan (PROTA) Kurikulum Merdeka</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rencana penetapan alokasi waktu satu tahun ajaran untuk mencapai seluruh Tujuan Pembelajaran (TP) yang telah ditetapkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent "Susun dengan AI" button */}
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
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan PROTA'}</span>
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
          <label className="block font-semibold text-slate-700 mb-1">Satuan Pendidikan</label>
          <input
            type="text"
            value={school.namaSekolah}
            disabled
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
          />
        </div>
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
            <option value="Seni Rupa">Seni Rupa</option>
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
          <label className="block font-semibold text-slate-700 mb-1">Total Alokasi Setahun</label>
          <div className="p-2 bg-teal-50 border border-teal-200 rounded-lg font-bold text-teal-800 text-center">
            {totalJP} Jam Pelajaran (JP)
          </div>
        </div>
      </div>

      {/* Editable PROTA Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Distribusi Matriks Program Tahunan (PROTA)</h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Baris TP
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-2 text-center w-12">No</th>
                <th className="py-2.5 px-2 text-center w-24">Semester</th>
                <th className="py-2.5 px-3">Tujuan Pembelajaran (TP)</th>
                <th className="py-2.5 px-3 w-56">Materi Pembelajaran</th>
                <th className="py-2.5 px-2 text-center w-28">Alokasi (JP)</th>
                <th className="py-2.5 px-2 w-28">Keterangan</th>
                <th className="py-2.5 px-2 text-center w-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2 text-center font-bold text-slate-500">{index + 1}</td>
                  <td className="py-2 px-2 text-center">
                    <select
                      value={row.semester}
                      onChange={(e) => handleUpdateRow(row.id, 'semester', e.target.value)}
                      className="p-1 border border-slate-300 rounded text-xs bg-white"
                    >
                      <option value="1">Sem. 1 (Ganjil)</option>
                      <option value="2">Sem. 2 (Genap)</option>
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <textarea
                      rows={2}
                      value={row.tujuanPembelajaran}
                      onChange={(e) => handleUpdateRow(row.id, 'tujuanPembelajaran', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={row.materiPembelajaran}
                      onChange={(e) => handleUpdateRow(row.id, 'materiPembelajaran', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min={1}
                      value={row.alokasiWaktu}
                      onChange={(e) => handleUpdateRow(row.id, 'alokasiWaktu', Number(e.target.value))}
                      className="w-16 p-1.5 border border-slate-300 rounded text-xs text-center font-bold focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={row.keterangan}
                      onChange={(e) => handleUpdateRow(row.id, 'keterangan', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={4} className="py-3 px-4 text-right">
                  TOTAL ALOKASI WAKTU SATU TAHUN PELAJARAN:
                </td>
                <td className="py-3 px-2 text-center text-teal-700 font-extrabold text-sm">
                  {totalJP} JP
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
