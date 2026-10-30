export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  tahunPelajaran: string;
  semester: 'Ganjil' | 'Genap';
  namaGuru: string;
  nipGuru: string;
  jabatanGuru: string;
  mataPelajaran: string;
  kelasDiampu: string;
  fase: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  logoBase64?: string;
}

export interface UserAccount {
  email: string;
  nama: string;
  isVerified: boolean;
  createdAt: string;
}

export type DocumentType = 
  | 'MODUL_AJAR'
  | 'RPP_RINGKAS'
  | 'PROTA'
  | 'PROMES'
  | 'ATP'
  | 'CP_TP'
  | 'JURNAL'
  | 'LKPD';

export interface CurriculumDoc {
  id: string;
  title: string;
  type: DocumentType;
  kelas: string;
  fase: string;
  mataPelajaran: string;
  tahunPelajaran: string;
  semester: string;
  updatedAt: string;
  status: 'draft' | 'reviewed' | 'final';
  content: any; // Type-specific payload
  rawNotes?: string;
}

export interface CPItem {
  id: string;
  fase: string;
  kelas: string;
  mataPelajaran: string;
  elemen: string;
  deskripsiCP: string;
  sumber: string;
}

export interface TPItem {
  id: string;
  cpId?: string;
  kodeTP: string;
  deskripsiTP: string;
  materi: string;
  alokasiJP: number;
  semester: 'Ganjil' | 'Genap';
  kelas: string;
  isAIGenerated?: boolean;
}

export interface ATPRow {
  id: string;
  no: number;
  kodeTP: string;
  cpTerkait: string;
  deskripsiTP: string;
  materi: string;
  urutan: number;
  alokasiWaktu: string;
  catatan: string;
}

export interface PROTARow {
  id: string;
  no: number;
  semester: '1' | '2' | 'Ganjil' | 'Genap';
  tujuanPembelajaran: string;
  materiPembelajaran: string;
  alokasiWaktu: number; // In Jam Pelajaran (JP)
  keterangan: string;
}

export interface PROMESRow {
  id: string;
  no: number;
  tujuanPembelajaran: string;
  materi: string;
  alokasiWaktu: number;
  // Distribution across 6 months of a semester, 4-5 weeks each
  distribusiMinggu: Record<string, boolean>; // key like "Juli_W1": true
  keterangan: string;
}

export interface JurnalItem {
  id: string;
  tanggal: string;
  namaGuru: string;
  kelas: string;
  mataPelajaran: string;
  jamPelajaran: string;
  materi: string;
  tujuanPembelajaran: string;
  kegiatanPembelajaran: string;
  jumlahHadir: number;
  jumlahTidakHadir: number;
  daftarSiswaAbsen?: string;
  hasilPembelajaran: string;
  refleksi: string;
  tindakLanjut: string;
  catatan?: string;
}

export interface LKPDQuestion {
  id: string;
  nomor: number;
  tipe: 'Pilihan Ganda' | 'Isian Singkat' | 'Uraian' | 'Praktik/Proyek';
  pertanyaan: string;
  opsi?: string[];
  kunciJawaban?: string;
  rubrik?: string;
}

export interface LKPDData {
  judul: string;
  mataPelajaran: string;
  kelas: string;
  fase: string;
  semester: string;
  alokasiWaktu: string;
  tujuanPembelajaran: string;
  petunjukBelajar: string[];
  ringkasanMateri: string;
  langkahAktivitas: string[];
  soalLatihan: LKPDQuestion[];
  rubrikPenilaian: {
    kriteria: string;
    skor4: string;
    skor3: string;
    skor2: string;
    skor1: string;
  }[];
}

export interface ModulAjarData {
  identitas: {
    namaPenyusun: string;
    institusi: string;
    tahunPelajaran: string;
    jenjangSekolah: string;
    mataPelajaran: string;
    faseKelas: string;
    elemen: string;
    alokasiWaktu: string;
    jumlahPertemuan: number;
  };
  kompetensiAwal: string[];
  profilPelajarPancasila: string[];
  saranaPrasarana: {
    media: string[];
    alatDanBahan: string[];
    sumberBelajar: string[];
  };
  targetPesertaDidik: string;
  modelPembelajaran: string;
  metodePembelajaran: string[];
  komponenInti: {
    tujuanPembelajaran: string[];
    pemahamanBermakna: string[];
    pertanyaanPemantik: string[];
    kegiatanPembelajaran: {
      pertemuanKe: number;
      pendahuluan: string[];
      inti: string[];
      penutup: string[];
    }[];
    asesmen: {
      diagnostik: string;
      formatif: string;
      sumatif: string;
      rubrik: string;
    };
    diferensiasi: {
      konten: string;
      proses: string;
      produk: string;
    };
    remedialDanPengayaan: {
      remedial: string;
      pengayaan: string;
    };
    refleksi: {
      guru: string[];
      pesertaDidik: string[];
    };
  };
  lampiran: {
    ringkasanMateri: string;
    lembarKerja: string;
    glosarium: string;
    daftarPustaka: string;
  };
}

export interface DocumentTemplate {
  id: string;
  nama: string;
  tipe: DocumentType;
  deskripsi: string;
  isDefault: boolean;
  sections: {
    id: string;
    title: string;
    required: boolean;
  }[];
}
