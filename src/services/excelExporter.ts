import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CurriculumDoc, SchoolProfile } from '../types';

export const excelExporter = {
  exportToExcel(doc: CurriculumDoc, school: SchoolProfile) {
    const wb = XLSX.utils.book_new();

    if (doc.type === 'PROTA') {
      const rows = doc.content?.rows || [];
      const sheetData = [
        ['PROGRAM TAHUNAN (PROTA) KURIKULUM MERDEKA'],
        [`Satuan Pendidikan: ${school.namaSekolah}`],
        [`Mata Pelajaran: ${doc.mataPelajaran}`],
        [`Kelas / Fase: ${doc.kelas} (${doc.fase})`],
        [`Tahun Pelajaran: ${school.tahunPelajaran}`],
        [`Guru Kelas: ${school.namaGuru}`],
        [],
        ['No', 'Semester', 'Tujuan Pembelajaran', 'Materi Pembelajaran', 'Alokasi Waktu (JP)', 'Keterangan'],
        ...rows.map((r: any, idx: number) => [
          idx + 1,
          r.semester,
          r.tujuanPembelajaran,
          r.materiPembelajaran || r.materi,
          r.alokasiWaktu,
          r.keterangan || '',
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, 'PROTA');
    } else if (doc.type === 'PROMES') {
      const data = doc.content || {};
      const rows = data.rows || [];
      const bulanList: string[] = data.bulanList || ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

      const header = ['No', 'Tujuan Pembelajaran', 'Materi Pokok', 'Alokasi (JP)', ...bulanList];
      const sheetData = [
        ['PROGRAM SEMESTER (PROMES) KURIKULUM MERDEKA'],
        [`Sekolah: ${school.namaSekolah} | Kelas: ${doc.kelas} | Mapel: ${doc.mataPelajaran}`],
        [],
        header,
        ...rows.map((r: any, idx: number) => {
          const distribution = bulanList.map((b) => {
            const marked = Object.keys(r.distribusiMinggu || {}).some((k) => k.startsWith(b) && r.distribusiMinggu[k]);
            return marked ? 'V' : '';
          });
          return [idx + 1, r.tujuanPembelajaran, r.materi, r.alokasiWaktu, ...distribution];
        }),
      ];
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, 'PROMES');
    } else if (doc.type === 'ATP') {
      const rows = doc.content?.rows || [];
      const sheetData = [
        ['ALUR TUJUAN PEMBELAJARAN (ATP)'],
        [`Sekolah: ${school.namaSekolah} | Mapel: ${doc.mataPelajaran} | Kelas: ${doc.kelas}`],
        [],
        ['No', 'Kode TP', 'Capaian Terkait', 'Tujuan Pembelajaran', 'Materi', 'Alokasi Waktu', 'Catatan'],
        ...rows.map((r: any, idx: number) => [
          idx + 1,
          r.kodeTP,
          r.cpTerkait,
          r.deskripsiTP || r.tujuanPembelajaran,
          r.materi,
          r.alokasiWaktu,
          r.catatan || '',
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, 'ATP');
    } else if (doc.type === 'JURNAL') {
      const items = doc.content?.items || [];
      const sheetData = [
        ['JURNAL HARIAN PEMBELAJARAN GURU SD'],
        [`Sekolah: ${school.namaSekolah} | Guru: ${school.namaGuru} | Kelas: ${doc.kelas}`],
        [],
        ['No', 'Tanggal', 'Jam Pelajaran', 'Mata Pelajaran', 'Materi', 'Tujuan Pembelajaran', 'Kegiatan', 'Kehadiran Hadir', 'Tidak Hadir', 'Hasil', 'Refleksi'],
        ...items.map((j: any, idx: number) => [
          idx + 1,
          j.tanggal,
          j.jamPelajaran,
          j.mataPelajaran || doc.mataPelajaran,
          j.materi,
          j.tujuanPembelajaran,
          j.kegiatanPembelajaran,
          j.jumlahHadir,
          j.jumlahTidakHadir,
          j.hasilPembelajaran,
          j.refleksi,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, 'JURNAL_HARIAN');
    } else {
      // Default table
      const ws = XLSX.utils.json_to_sheet([doc.content]);
      XLSX.utils.book_append_sheet(wb, ws, 'DOKUMEN');
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const filename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`;
    saveAs(blob, filename);
  },
};
