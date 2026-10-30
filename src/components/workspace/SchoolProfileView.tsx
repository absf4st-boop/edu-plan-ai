import React, { useState } from 'react';
import { School, Save, Trash2, CheckCircle2, User, Building, MapPin } from 'lucide-react';
import { SchoolProfile } from '../../types';
import { storageService } from '../../services/storage';

interface SchoolProfileViewProps {
  school: SchoolProfile;
  onProfileUpdated: () => void;
}

export const SchoolProfileView: React.FC<SchoolProfileViewProps> = ({
  school: initialSchool,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<SchoolProfile>(initialSchool);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProfile((prev) => ({ ...prev, logoBase64: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSchoolProfile(profile);
    setSavedSuccess(true);
    onProfileUpdated();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <School className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Identitas Satuan Pendidikan & Guru</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data ini akan secara otomatis disematkan pada kop surat, lembar pengesahan, dan isi seluruh dokumen pembelajaran Word (.docx).
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Identitas'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
          <h3 className="text-sm font-bold text-slate-900">Logo Satuan Pendidikan</h3>
          <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mx-auto bg-slate-50 overflow-hidden">
            {profile.logoBase64 ? (
              <img src={profile.logoBase64} alt="Logo Sekolah" className="w-full h-full object-contain p-2" />
            ) : (
              <School className="w-12 h-12 text-slate-400" />
            )}
          </div>
          <div className="space-y-2">
            <label className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors">
              Pilih Logo (PNG/JPG)
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {profile.logoBase64 && (
              <div>
                <button
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, logoBase64: undefined }))}
                  className="text-xs text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus Logo
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Akan muncul pada bagian kop atas dokumen resmi Word & cetakan.
          </p>
        </div>

        {/* School Form Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Building className="w-4 h-4 text-blue-600" /> Informasi Satuan Pendidikan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={profile.namaSekolah}
                onChange={(e) => setProfile({ ...profile, namaSekolah: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN (Nomor Pokok Sekolah Nasional)</label>
              <input
                type="text"
                value={profile.npsn}
                onChange={(e) => setProfile({ ...profile, npsn: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={profile.alamat}
                onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Desa / Kelurahan</label>
              <input
                type="text"
                value={profile.desaKelurahan}
                onChange={(e) => setProfile({ ...profile, desaKelurahan: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={profile.kecamatan}
                onChange={(e) => setProfile({ ...profile, kecamatan: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kabupaten / Kota</label>
              <input
                type="text"
                value={profile.kabupaten}
                onChange={(e) => setProfile({ ...profile, kabupaten: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={profile.provinsi}
                onChange={(e) => setProfile({ ...profile, provinsi: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
              <input
                type="text"
                value={profile.tahunPelajaran}
                onChange={(e) => setProfile({ ...profile, tahunPelajaran: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester Aktif</label>
              <select
                value={profile.semester}
                onChange={(e) => setProfile({ ...profile, semester: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          {/* Teacher and Headmaster Section */}
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pt-4 pb-3">
            <User className="w-4 h-4 text-indigo-600" /> Guru Pengampu & Kepala Sekolah
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Guru</label>
              <input
                type="text"
                value={profile.namaGuru}
                onChange={(e) => setProfile({ ...profile, namaGuru: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Guru (Kosongkan bila tidak ada)</label>
              <input
                type="text"
                value={profile.nipGuru}
                onChange={(e) => setProfile({ ...profile, nipGuru: e.target.value })}
                placeholder="Biarkan kosong jika belum ber-NIP"
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jabatan Guru</label>
              <input
                type="text"
                value={profile.jabatanGuru}
                onChange={(e) => setProfile({ ...profile, jabatanGuru: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas yang Diampu</label>
              <select
                value={profile.kelasDiampu}
                onChange={(e) => {
                  const k = e.target.value;
                  const f = k === 'Kelas 1' || k === 'Kelas 2' ? 'Fase A' : k === 'Kelas 3' || k === 'Kelas 4' ? 'Fase B' : 'Fase C';
                  setProfile({ ...profile, kelasDiampu: k, fase: f });
                }}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-blue-700"
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
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={profile.namaKepalaSekolah}
                onChange={(e) => setProfile({ ...profile, namaKepalaSekolah: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={profile.nipKepalaSekolah}
                onChange={(e) => setProfile({ ...profile, nipKepalaSekolah: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
