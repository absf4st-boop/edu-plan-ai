import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, Sparkles, Download, Save, FileSpreadsheet, Search, CheckCircle2 } from 'lucide-react';
import { SchoolProfile, JurnalItem, CurriculumDoc } from '../../types';
import { storageService } from '../../services/storage';
import { docxExporter } from '../../services/docxExporter';
import { excelExporter } from '../../services/excelExporter';

interface JurnalViewProps {
  school: SchoolProfile;
  onOpenAISummon: () => void;
  onOpenEditor: (doc: CurriculumDoc) => void;
}

export const JurnalView: React.FC<JurnalViewProps> = ({ school, onOpenAISummon, onOpenEditor }) => {
  const [items, setItems] = useState<JurnalItem[]>([
    {
      id: 'jrn-1',
      tanggal: new Date().toISOString().split('T')[0],
      namaGuru: school.namaGuru,
      kelas: school.kelasDiampu || 'Kelas 4',
      mataPelajaran: 'PJOK',
      jamPelajaran: 'Jam 1-4 (07.00 - 09.20)',
      materi: 'Variasi Pola Gerak Dasar Menendang dan Menghentikan Bola',
      tujuanPembelajaran: 'Peserta didik mempraktikkan teknik dasar menendang bola dengan kaki bagian dalam dan menghentikan bola secara berpasangan.',
      kegiatanPembelajaran: 'Pemanasan dinamis dan permainan estafet bola di lapangan SDN Kasepuhan 04, drill teknik berpasangan, game 5 lawan 5, pendinginan dan evaluasi.',
      jumlahHadir: 28,
      jumlahTidakHadir: 0,
      daftarSiswaAbsen: '',
      hasilPembelajaran: 'Seluruh peserta didik antusias dan mampu mempraktikkan gerak dasar menendang bola dengan koordinasi yang baik.',
      refleksi: 'Aktivitas permainan bola besar sangat diminati siswa; perlu penambahan bola agar waktu sentuh bola tiap anak lebih optimal.',
      tindakLanjut: 'Melanjutkan ke variasi menggiring bola (dribbling) pada pertemuan minggu berikutnya.',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [search, setSearch] = useState('');

  // New item form
  const [newItem, setNewItem] = useState<JurnalItem>({
    id: '',
    tanggal: new Date().toISOString().split('T')[0],
    namaGuru: school.namaGuru,
    kelas: school.kelasDiampu || 'Kelas 4',
    mataPelajaran: school.mataPelajaran || 'PJOK',
    jamPelajaran: 'Jam 1-3 (07.00 - 08.45)',
    materi: '',
    tujuanPembelajaran: '',
    kegiatanPembelajaran: '',
    jumlahHadir: 28,
    jumlahTidakHadir: 0,
    daftarSiswaAbsen: '',
    hasilPembelajaran: '',
    refleksi: '',
    tindakLanjut: '',
  });

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.materi.trim()) return;

    setItems([{ ...newItem, id: `jrn-${Date.now()}` }, ...items]);
    setIsAdding(false);
    setNewItem({
      ...newItem,
      materi: '',
      tujuanPembelajaran: '',
      kegiatanPembelajaran: '',
      hasilPembelajaran: '',
      refleksi: '',
      tindakLanjut: '',
    });
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Hapus entri jurnal harian ini?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const createDocObject = (): CurriculumDoc => ({
    id: `doc-jurnal-${Date.now()}`,
    title: `Jurnal Harian KBM Guru SD Kelas ${school.kelasDiampu || '4'} — ${school.namaSekolah}`,
    type: 'JURNAL',
    kelas: school.kelasDiampu || 'Kelas 4',
    fase: school.fase || 'Fase B',
    mataPelajaran: 'Semua Mapel',
    tahunPelajaran: school.tahunPelajaran,
    semester: school.semester || 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: { items },
  });

  const handleSaveAll = () => {
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

  const filteredItems = items.filter(
    (i) =>
      i.materi.toLowerCase().includes(search.toLowerCase()) ||
      i.mataPelajaran.toLowerCase().includes(search.toLowerCase()) ||
      i.tanggal.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ClipboardList className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Jurnal Harian Mengajar Guru SD</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan riil pelaksanaan kegiatan belajar mengajar harian, kehadiran peserta didik, dan refleksi pedagogik.
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
            onClick={() => setIsAdding(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Hari Ini</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan'}</span>
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

      {/* Form Tambah Jurnal */}
      {isAdding && (
        <form onSubmit={handleSaveNewItem} className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h3 className="text-sm font-bold text-amber-900">Entri Baru Jurnal Harian Mengajar</h3>
            <span className="text-xs text-amber-700 font-semibold">{school.namaGuru}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal KBM</label>
              <input
                type="date"
                value={newItem.tanggal}
                onChange={(e) => setNewItem({ ...newItem, tanggal: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Pelajaran</label>
              <input
                type="text"
                value={newItem.jamPelajaran}
                onChange={(e) => setNewItem({ ...newItem, jamPelajaran: e.target.value })}
                placeholder="Jam ke-1 s.d 3"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={newItem.mataPelajaran}
                onChange={(e) => setNewItem({ ...newItem, mataPelajaran: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="IPAS">IPAS</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                <option value="PJOK">PJOK</option>
                <option value="Seni Rupa">Seni Rupa</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kehadiran (Hadir / Tidak)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={newItem.jumlahHadir}
                  onChange={(e) => setNewItem({ ...newItem, jumlahHadir: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-center"
                  title="Hadir"
                />
                <input
                  type="number"
                  min={0}
                  value={newItem.jumlahTidakHadir}
                  onChange={(e) => setNewItem({ ...newItem, jumlahTidakHadir: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-center"
                  title="Tidak Hadir"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Materi Pokok Hari Ini</label>
              <input
                type="text"
                value={newItem.materi}
                onChange={(e) => setNewItem({ ...newItem, materi: e.target.value })}
                placeholder="Contoh: Eksperimen Fotosintesis Daun Tumbuhan"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tujuan Pembelajaran</label>
              <input
                type="text"
                value={newItem.tujuanPembelajaran}
                onChange={(e) => setNewItem({ ...newItem, tujuanPembelajaran: e.target.value })}
                placeholder="Tujuan yang ingin dicapai siswa"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Kegiatan KBM Terlaksana</label>
            <textarea
              rows={2}
              value={newItem.kegiatanPembelajaran}
              onChange={(e) => setNewItem({ ...newItem, kegiatanPembelajaran: e.target.value })}
              placeholder="Uraikan jalannya pembelajaran pembuka, inti, dan penutup..."
              className="w-full p-2 bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hasil Pembelajaran / Ketercapaian</label>
              <input
                type="text"
                value={newItem.hasilPembelajaran}
                onChange={(e) => setNewItem({ ...newItem, hasilPembelajaran: e.target.value })}
                placeholder="Contoh: 90% siswa tuntas..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Refleksi Guru</label>
              <input
                type="text"
                value={newItem.refleksi}
                onChange={(e) => setNewItem({ ...newItem, refleksi: e.target.value })}
                placeholder="Catatan kelebihan & kendala..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut</label>
              <input
                type="text"
                value={newItem.tindakLanjut}
                onChange={(e) => setNewItem({ ...newItem, tindakLanjut: e.target.value })}
                placeholder="Remedial atau pengayaan..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
            >
              Simpan Jurnal Hari Ini
            </button>
          </div>
        </form>
      )}

      {/* Jurnal List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Rekap Riwayat Jurnal Harian</h3>
            <span className="text-xs text-slate-400">({filteredItems.length} entri)</span>
          </div>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari materi / tanggal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Tanggal & Jam</th>
                <th className="py-2.5 px-3">Mata Pelajaran</th>
                <th className="py-2.5 px-3 min-w-[200px]">Materi & TP</th>
                <th className="py-2.5 px-3 min-w-[220px]">Uraian KBM</th>
                <th className="py-2.5 px-2 text-center">Kehadiran</th>
                <th className="py-2.5 px-3 min-w-[180px]">Refleksi & Hasil</th>
                <th className="py-2.5 px-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">{j.tanggal}</span>
                    <span className="text-[11px] text-slate-500">{j.jamPelajaran}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-blue-700">{j.mataPelajaran}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">{j.materi}</span>
                    <span className="text-slate-600 text-[11px]">{j.tujuanPembelajaran}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 leading-relaxed">{j.kegiatanPembelajaran}</td>
                  <td className="py-3 px-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      {j.jumlahHadir} / {j.jumlahHadir + j.jumlahTidakHadir}
                    </span>
                    {j.daftarSiswaAbsen && (
                      <span className="block text-[10px] text-red-600 mt-0.5">{j.daftarSiswaAbsen}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-slate-700 font-medium">{j.hasilPembelajaran}</p>
                    <p className="text-slate-500 text-[11px] italic mt-0.5">Refleksi: {j.refleksi}</p>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(j.id)}
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
