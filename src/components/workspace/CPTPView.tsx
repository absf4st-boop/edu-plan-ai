import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit, Sparkles, Filter, CheckCircle, Save, BookOpen } from 'lucide-react';
import { CPItem, TPItem, SchoolProfile } from '../../types';
import { storageService } from '../../services/storage';

interface CPTPViewProps {
  school: SchoolProfile;
  onOpenAISummon: () => void;
}

export const CPTPView: React.FC<CPTPViewProps> = ({ school, onOpenAISummon }) => {
  const [cpList, setCpList] = useState<CPItem[]>(() => storageService.getCPAvailable());
  const [tpList, setTpList] = useState<TPItem[]>(() => storageService.getTPAvailable());

  const [selectedMapel, setSelectedMapel] = useState<string>(school.mataPelajaran || 'PJOK');
  const [selectedKelas, setSelectedKelas] = useState<string>(school.kelasDiampu || 'Kelas 4');

  // New TP form modal/inline
  const [isAddingTP, setIsAddingTP] = useState(false);
  const [newKodeTP, setNewKodeTP] = useState('TP 4.5');
  const [newDeskripsiTP, setNewDeskripsiTP] = useState('');
  const [newMateri, setNewMateri] = useState('');
  const [newAlokasiJP, setNewAlokasiJP] = useState(10);
  const [newSemester, setNewSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  const filteredCP = cpList.filter(
    (c) => (selectedMapel === 'ALL' || c.mataPelajaran === selectedMapel) && (selectedKelas === 'ALL' || c.kelas === selectedKelas)
  );

  const filteredTP = tpList.filter(
    (t) => selectedKelas === 'ALL' || t.kelas === selectedKelas
  );

  const handleSaveNewTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeskripsiTP.trim()) return;

    const item: TPItem = {
      id: `tp-${Date.now()}`,
      kodeTP: newKodeTP,
      deskripsiTP: newDeskripsiTP.trim(),
      materi: newMateri.trim() || 'Materi Pokok',
      alokasiJP: Number(newAlokasiJP) || 8,
      semester: newSemester,
      kelas: selectedKelas === 'ALL' ? 'Kelas 4' : selectedKelas,
    };

    storageService.saveTP(item);
    setTpList(storageService.getTPAvailable());
    setIsAddingTP(false);
    setNewDeskripsiTP('');
    setNewMateri('');
  };

  const handleDeleteTP = (id: string) => {
    if (window.confirm('Hapus Tujuan Pembelajaran ini?')) {
      storageService.deleteTP(id);
      setTpList(storageService.getTPAvailable());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Capaian & Tujuan Pembelajaran (CP & TP)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola rumusan CP resmi BSKAP dan kembangkan alternatif Tujuan Pembelajaran (TP) terukur untuk SD Kurikulum Merdeka.
          </p>
        </div>

        {/* Action Button: Prominent "Susun dengan AI" */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAISummon}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Susun dengan AI</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddingTP(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah TP Manual</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Pembelajaran:</span>
        </div>
        <div>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">Semua Kelas</option>
            <option value="Kelas 1">Kelas 1 (Fase A)</option>
            <option value="Kelas 2">Kelas 2 (Fase A)</option>
            <option value="Kelas 3">Kelas 3 (Fase B)</option>
            <option value="Kelas 4">Kelas 4 (Fase B)</option>
            <option value="Kelas 5">Kelas 5 (Fase C)</option>
            <option value="Kelas 6">Kelas 6 (Fase C)</option>
          </select>
        </div>
        <div>
          <select
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">Semua Mapel</option>
            <option value="IPAS">IPAS</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Matematika">Matematika</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
            <option value="PJOK">PJOK</option>
          </select>
        </div>
      </div>

      {/* Form Add TP Modal/Card */}
      {isAddingTP && (
        <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" /> Tambah Tujuan Pembelajaran (TP) Baru
          </h3>
          <form onSubmit={handleSaveNewTP} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode TP</label>
                <input
                  type="text"
                  value={newKodeTP}
                  onChange={(e) => setNewKodeTP(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lingkup Materi</label>
                <input
                  type="text"
                  value={newMateri}
                  onChange={(e) => setNewMateri(e.target.value)}
                  placeholder="Contoh: Bagian Tubuh Tumbuhan"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alokasi (JP)</label>
                <input
                  type="number"
                  value={newAlokasiJP}
                  onChange={(e) => setNewAlokasiJP(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                  min={1}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Redaksi Rumusan Tujuan Pembelajaran (TP)</label>
              <textarea
                rows={2}
                value={newDeskripsiTP}
                onChange={(e) => setNewDeskripsiTP(e.target.value)}
                placeholder="Contoh: Peserta didik mampu mengidentifikasi organ utama tumbuhan beserta fungsinya melalui penyelidikan nyata..."
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTP(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Simpan TP
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Capaian Pembelajaran (CP) Source Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" /> Rujukan Capaian Pembelajaran (CP) Resmi
        </h3>
        {filteredCP.length === 0 ? (
          <p className="text-xs text-slate-400">Tidak ada data CP untuk pilihan filter saat ini.</p>
        ) : (
          <div className="space-y-3">
            {filteredCP.map((cp) => (
              <div key={cp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{cp.mataPelajaran} • {cp.elemen}</span>
                  <span className="text-[11px] text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full">
                    {cp.kelas} ({cp.fase})
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed pt-1">{cp.deskripsiCP}</p>
                <span className="text-[10px] text-slate-400 block pt-1">Sumber: {cp.sumber}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tujuan Pembelajaran (TP) List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Daftar Tujuan Pembelajaran (TP) Terdaftar
          </h3>
          <span className="text-xs text-slate-500 font-medium">Total: {filteredTP.length} TP</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Kode</th>
                <th className="py-2.5 px-3">Tujuan Pembelajaran</th>
                <th className="py-2.5 px-3">Lingkup Materi</th>
                <th className="py-2.5 px-3 text-center">Semester</th>
                <th className="py-2.5 px-3 text-center">Alokasi (JP)</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTP.map((tp) => (
                <tr key={tp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-blue-700 whitespace-nowrap">{tp.kodeTP}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{tp.deskripsiTP}</td>
                  <td className="py-3 px-3 text-slate-600">{tp.materi}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {tp.semester}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">{tp.alokasiJP} JP</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteTP(tp.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Hapus TP"
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
