/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolProfile, CurriculumDoc, CPItem, TPItem } from '../types';

export interface CreatedSpreadsheet {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export const googleSheetsService = {
  // Create complete Master Curriculum Spreadsheet in Google Sheets
  async createCurriculumSpreadsheet(
    token: string,
    title: string,
    school: SchoolProfile,
    documents: CurriculumDoc[],
    cpList: CPItem[],
    tpList: TPItem[]
  ): Promise<CreatedSpreadsheet> {
    // 1. Create Spreadsheet with predefined sheets
    const createPayload = {
      properties: {
        title: title || `EDU PLAN AI - Data Master Kurikulum (${new Date().toLocaleDateString('id-ID')})`,
      },
      sheets: [
        {
          properties: {
            title: 'Profil & Identitas Sekolah',
            gridProperties: { rowCount: 50, columnCount: 10 },
          },
        },
        {
          properties: {
            title: 'Daftar Dokumen Kurikulum',
            gridProperties: { rowCount: 100, columnCount: 10 },
          },
        },
        {
          properties: {
            title: 'Database CP & TP',
            gridProperties: { rowCount: 100, columnCount: 10 },
          },
        },
        {
          properties: {
            title: 'Jurnal Harian Mengajar',
            gridProperties: { rowCount: 100, columnCount: 12 },
          },
        },
      ],
    };

    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPayload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet baru.');
    }

    const createdSheet = await res.json();
    const spreadsheetId = createdSheet.spreadsheetId;
    const spreadsheetUrl = createdSheet.spreadsheetUrl;

    // 2. Prepare value data for all sheets
    const dataValues: Array<{ range: string; values: (string | number)[][] }> = [];

    // Sheet 1: Profil Sekolah
    dataValues.push({
      range: "'Profil & Identitas Sekolah'!A1:B15",
      values: [
        ['DATA PUSAT ADMINISTRASI SEKOLAH — EDU PLAN AI', ''],
        ['Tanggal Sinkronisasi:', new Date().toLocaleString('id-ID')],
        ['', ''],
        ['Parameter', 'Nilai Identitas'],
        ['Nama Sekolah', school.namaSekolah || '-'],
        ['NPSN', school.npsn || '-'],
        ['Alamat', school.alamat || '-'],
        ['Desa / Kelurahan', school.desaKelurahan || '-'],
        ['Kecamatan', school.kecamatan || '-'],
        ['Kabupaten / Kota', school.kabupaten || '-'],
        ['Provinsi', school.provinsi || '-'],
        ['Tahun Pelajaran', school.tahunPelajaran || '2026/2027'],
        ['Semester', school.semester || 'Ganjil'],
        ['Nama Guru Pengampu', school.namaGuru || '-'],
        ['NIP Guru', school.nipGuru || '-'],
        ['Jabatan Guru', school.jabatanGuru || 'Guru Kelas / Mapel'],
        ['Mata Pelajaran', school.mataPelajaran || '-'],
        ['Kelas & Fase', `${school.kelasDiampu || 'Kelas 4'} (${school.fase || 'Fase B'})`],
        ['Kepala Sekolah', school.namaKepalaSekolah || '-'],
        ['NIP Kepala Sekolah', school.nipKepalaSekolah || '-'],
      ],
    });

    // Sheet 2: Daftar Dokumen
    const docRows: (string | number)[][] = [
      ['NO', 'ID DOKUMEN', 'JUDUL PERANGKAT PEMBELAJARAN', 'TIPE DOKUMEN', 'KELAS / FASE', 'MAPEL', 'TAHUN PELAJARAN', 'STATUS', 'TERAKHIR DIPERBARUI'],
    ];

    documents.forEach((d, idx) => {
      docRows.push([
        idx + 1,
        d.id,
        d.title,
        d.type,
        `${d.kelas} (${d.fase})`,
        d.mataPelajaran,
        d.tahunPelajaran,
        d.status,
        new Date(d.updatedAt).toLocaleString('id-ID'),
      ]);
    });

    dataValues.push({
      range: `'Daftar Dokumen Kurikulum'!A1:I${docRows.length}`,
      values: docRows,
    });

    // Sheet 3: Database CP & TP
    const cptpRows: (string | number)[][] = [
      ['NO', 'KODE TP', 'MATA PELAJARAN', 'FASE / KELAS', 'DESKRIPSI TUJUAN PEMBELAJARAN (TP)', 'MATERI POKOK', 'ALOKASI WAKTU (JP)', 'SEMESTER'],
    ];

    tpList.forEach((t, idx) => {
      const relatedCP = cpList.find((c) => c.id === t.cpId);
      cptpRows.push([
        idx + 1,
        t.kodeTP,
        relatedCP?.mataPelajaran || 'PJOK / Umum',
        `${relatedCP?.fase || 'Fase B'} / ${t.kelas}`,
        t.deskripsiTP,
        t.materi,
        t.alokasiJP,
        t.semester,
      ]);
    });

    dataValues.push({
      range: `'Database CP & TP'!A1:H${cptpRows.length}`,
      values: cptpRows,
    });

    // Sheet 4: Jurnal Harian
    const jurnalDocs = documents.filter((d) => d.type === 'JURNAL');
    const jurnalRows: (string | number)[][] = [
      ['NO', 'TANGGAL', 'GURU', 'KELAS', 'MAPEL', 'JAM KE-', 'MATERI', 'TUJUAN PEMBELAJARAN', 'KEGIATAN KBM', 'HADIR / TIDAK', 'HASIL & REFLEKSI'],
    ];

    let jIndex = 1;
    jurnalDocs.forEach((jd) => {
      if (jd.content?.items && Array.isArray(jd.content.items)) {
        jd.content.items.forEach((item: any) => {
          jurnalRows.push([
            jIndex++,
            item.tanggal || '-',
            item.namaGuru || school.namaGuru || '-',
            item.kelas || school.kelasDiampu || '-',
            item.mataPelajaran || school.mataPelajaran || '-',
            item.jamPelajaran || '-',
            item.materi || '-',
            item.tujuanPembelajaran || '-',
            item.kegiatanPembelajaran || '-',
            `${item.jumlahHadir || 0} hadir / ${item.jumlahTidakHadir || 0} absen`,
            `${item.hasilPembelajaran || '-'} | Refleksi: ${item.refleksi || '-'}`,
          ]);
        });
      }
    });

    dataValues.push({
      range: `'Jurnal Harian Mengajar'!A1:K${jurnalRows.length}`,
      values: jurnalRows,
    });

    // 3. Populate all values via batchUpdate
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: dataValues,
        }),
      }
    );

    if (!updateRes.ok) {
      console.warn('Batch update values partially failed, spreadsheet was created.');
    }

    return {
      spreadsheetId,
      spreadsheetUrl,
      title,
    };
  },
};
