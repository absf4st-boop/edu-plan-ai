import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Footer,
  PageNumber,
} from 'docx';
import { saveAs } from 'file-saver';
import { SchoolProfile, CurriculumDoc, ModulAjarData } from '../types';

// Helper to create paragraph with formatted text cleanly
function pText(
  text: string,
  options?: { bold?: boolean; italics?: boolean; size?: number; alignment?: (typeof AlignmentType)[keyof typeof AlignmentType]; spacing?: { before?: number; after?: number } }
): Paragraph {
  return new Paragraph({
    alignment: options?.alignment,
    spacing: options?.spacing,
    children: [
      new TextRun({
        text,
        bold: options?.bold,
        italics: options?.italics,
        size: options?.size || 20, // 10pt default
      }),
    ],
  });
}

export const docxExporter = {
  async exportDocument(doc: CurriculumDoc, school: SchoolProfile, paperSize: 'A4' | 'F4' = 'A4'): Promise<boolean> {
    try {
      let docxObj: Document;

      if (doc.type === 'MODUL_AJAR' || doc.type === 'RPP_RINGKAS') {
        docxObj = this.buildModulAjarDocx(doc, school);
      } else if (doc.type === 'PROTA') {
        docxObj = this.buildProtaDocx(doc, school);
      } else if (doc.type === 'PROMES') {
        docxObj = this.buildPromesDocx(doc, school);
      } else if (doc.type === 'ATP') {
        docxObj = this.buildAtpDocx(doc, school);
      } else if (doc.type === 'JURNAL') {
        docxObj = this.buildJurnalDocx(doc, school);
      } else if (doc.type === 'LKPD') {
        docxObj = this.buildLkpdDocx(doc, school);
      } else {
        docxObj = this.buildGenericDocx(doc, school);
      }

      const blob = await Packer.toBlob(docxObj);
      const safeTitle = (doc.title || 'Dokumen')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 50);
      const filename = `${safeTitle}_${doc.kelas.replace(/\s+/g, '')}_${school.tahunPelajaran.replace(/\//g, '-')}.docx`;

      saveAs(blob, filename);
      return true;
    } catch (err) {
      console.error('Error generating DOCX:', err);
      throw err;
    }
  },

  // Helper for Kop Surat / School Header
  buildKopSurat(school: SchoolProfile): Paragraph[] {
    return [
      pText(`PEMERINTAH KABUPATEN ${school.kabupaten.toUpperCase()}`, { bold: true, size: 24, alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      pText('DINAS PENDIDIKAN DAN KEBUDAYAAN', { bold: true, size: 24, alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      pText(school.namaSekolah.toUpperCase(), { bold: true, size: 28, alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      pText(
        `Alamat: ${school.alamat}, Kec. ${school.kecamatan}, Kab. ${school.kabupaten}, Prov. ${school.provinsi} | NPSN: ${school.npsn || '-'}`,
        { size: 18, italics: true, alignment: AlignmentType.CENTER, spacing: { after: 120 } }
      ),
      // Horizontal separator line
      new Paragraph({
        spacing: { after: 200 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.DOUBLE,
            size: 12,
          },
        },
      }),
    ];
  },

  // Helper for Signature Section (Tanda Tangan Pengesahan)
  buildSignatureTable(school: SchoolProfile): Table {
    const today = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dateStr = `${school.kabupaten || 'Batang'}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                pText('Mengetahui,', { alignment: AlignmentType.CENTER }),
                pText('Kepala Sekolah,', { alignment: AlignmentType.CENTER, spacing: { after: 800 } }),
                pText(school.namaKepalaSekolah, { bold: true, alignment: AlignmentType.CENTER }),
                pText(school.nipKepalaSekolah ? `NIP. ${school.nipKepalaSekolah}` : 'NIP. -', { alignment: AlignmentType.CENTER }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                pText(dateStr, { alignment: AlignmentType.CENTER }),
                pText(school.jabatanGuru || 'Guru Kelas', { alignment: AlignmentType.CENTER, spacing: { after: 800 } }),
                pText(school.namaGuru, { bold: true, alignment: AlignmentType.CENTER }),
                pText(school.nipGuru ? `NIP. ${school.nipGuru}` : 'NIP. -', { alignment: AlignmentType.CENTER }),
              ],
            }),
          ],
        }),
      ],
    });
  },

  // 1. MODUL AJAR BUILDER
  buildModulAjarDocx(doc: CurriculumDoc, school: SchoolProfile): Document {
    const data: ModulAjarData = doc.content;
    const paragraphs: (Paragraph | Table)[] = [];

    // Kop
    paragraphs.push(...this.buildKopSurat(school));

    // Title
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: 'MODUL AJAR KURIKULUM MERDEKA',
            bold: true,
            size: 28,
            color: '1E3A8A',
          }),
        ],
      }),
      pText(`${doc.mataPelajaran.toUpperCase()} — ${doc.kelas.toUpperCase()} (${doc.fase})`, {
        bold: true,
        size: 22,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Section 1: Informasi Umum
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'A. INFORMASI UMUM', bold: true, size: 22, color: '1E3A8A' })],
      })
    );

    // Identitas Table
    const identitas = data?.identitas || {
      namaPenyusun: school.namaGuru,
      institusi: school.namaSekolah,
      tahunPelajaran: school.tahunPelajaran,
      jenjangSekolah: 'Sekolah Dasar (SD)',
      mataPelajaran: doc.mataPelajaran,
      faseKelas: `${doc.fase} / ${doc.kelas}`,
      elemen: 'Pemahaman Konsep',
      alokasiWaktu: '4 x 35 Menit',
      jumlahPertemuan: 2,
    };

    const identitasRows = [
      ['Nama Penyusun', identitas.namaPenyusun || school.namaGuru],
      ['Satuan Pendidikan', identitas.institusi || school.namaSekolah],
      ['Tahun Pelajaran', identitas.tahunPelajaran || school.tahunPelajaran],
      ['Jenjang / Kelas / Fase', `${identitas.jenjangSekolah || 'SD'} / ${identitas.faseKelas || doc.kelas}`],
      ['Mata Pelajaran', identitas.mataPelajaran || doc.mataPelajaran],
      ['Elemen / Topik', identitas.elemen || '-'],
      ['Alokasi Waktu', identitas.alokasiWaktu || '4 x 35 Menit'],
      ['Model Pembelajaran', data?.modelPembelajaran || 'Problem Based Learning (PBL)'],
      ['Target Peserta Didik', data?.targetPesertaDidik || 'Peserta didik reguler / tipikal'],
    ];

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: identitasRows.map(
          ([label, val]) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [pText(label, { bold: true, size: 20 })],
                }),
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  children: [pText(`: ${val}`, { size: 20 })],
                }),
              ],
            })
        ),
      })
    );

    // Kompetensi Awal & Profil Pancasila
    paragraphs.push(pText('1. Kompetensi Awal:', { bold: true, size: 20, spacing: { before: 150, after: 50 } }));
    (data?.kompetensiAwal || []).forEach((item) => {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: item, size: 20 })] }));
    });

    paragraphs.push(pText('2. Profil Pelajar Pancasila:', { bold: true, size: 20, spacing: { before: 100, after: 50 } }));
    (data?.profilPelajarPancasila || []).forEach((item) => {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: item, size: 20 })] }));
    });

    // Section 2: Komponen Inti
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 250, after: 100 },
        children: [new TextRun({ text: 'B. KOMPONEN INTI', bold: true, size: 22, color: '1E3A8A' })],
      })
    );

    paragraphs.push(pText('1. Tujuan Pembelajaran:', { bold: true, size: 20, spacing: { before: 100, after: 50 } }));
    (data?.komponenInti?.tujuanPembelajaran || []).forEach((item) => {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: item, size: 20 })] }));
    });

    paragraphs.push(pText('2. Pemahaman Bermakna:', { bold: true, size: 20, spacing: { before: 100, after: 50 } }));
    (data?.komponenInti?.pemahamanBermakna || []).forEach((item) => {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: item, size: 20 })] }));
    });

    paragraphs.push(pText('3. Pertanyaan Pemantik:', { bold: true, size: 20, spacing: { before: 100, after: 50 } }));
    (data?.komponenInti?.pertanyaanPemantik || []).forEach((item) => {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: item, size: 20 })] }));
    });

    // Langkah Pembelajaran per pertemuan
    paragraphs.push(pText('4. Kegiatan Pembelajaran:', { bold: true, size: 20, spacing: { before: 150, after: 100 } }));

    (data?.komponenInti?.kegiatanPembelajaran || []).forEach((keg) => {
      paragraphs.push(
        pText(`Pertemuan ke-${keg.pertemuanKe}:`, { bold: true, size: 20, spacing: { before: 100, after: 50 } }),
        pText('a. Kegiatan Pendahuluan (10-15 Menit):', { bold: true, size: 19 })
      );
      (keg.pendahuluan || []).forEach((step) => {
        paragraphs.push(new Paragraph({ bullet: { level: 1 }, children: [new TextRun({ text: step, size: 19 })] }));
      });

      paragraphs.push(pText('b. Kegiatan Inti (45-50 Menit):', { bold: true, size: 19, spacing: { before: 50 } }));
      (keg.inti || []).forEach((step) => {
        paragraphs.push(new Paragraph({ bullet: { level: 1 }, children: [new TextRun({ text: step, size: 19 })] }));
      });

      paragraphs.push(pText('c. Kegiatan Penutup (10-15 Menit):', { bold: true, size: 19, spacing: { before: 50 } }));
      (keg.penutup || []).forEach((step) => {
        paragraphs.push(new Paragraph({ bullet: { level: 1 }, children: [new TextRun({ text: step, size: 19 })] }));
      });
    });

    // Asesmen & Diferensiasi
    paragraphs.push(
      pText('5. Asesmen dan Penilaian:', { bold: true, size: 20, spacing: { before: 150, after: 50 } }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: 'Asesmen Diagnostik: ', bold: true, size: 19 }),
          new TextRun({ text: data?.komponenInti?.asesmen?.diagnostik || 'Tanya jawab kesiapan belajar', size: 19 }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: 'Asesmen Formatif: ', bold: true, size: 19 }),
          new TextRun({ text: data?.komponenInti?.asesmen?.formatif || 'Observasi proses, LKPD, unjuk kerja kelompok', size: 19 }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: 'Asesmen Sumatif: ', bold: true, size: 19 }),
          new TextRun({ text: data?.komponenInti?.asesmen?.sumatif || 'Tes tertulis mandiri akhir lingkup materi', size: 19 }),
        ],
      })
    );

    // Section 3: Lampiran
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'C. LAMPIRAN', bold: true, size: 22, color: '1E3A8A' })],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Ringkasan Bahan Bacaan Guru & Siswa:\n', bold: true, size: 20 }),
          new TextRun({ text: data?.lampiran?.ringkasanMateri || 'Terlampir dalam buku ajar.', size: 19 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 100 },
        children: [
          new TextRun({ text: 'Glosarium:\n', bold: true, size: 20 }),
          new TextRun({ text: data?.lampiran?.glosarium || '-', size: 19 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [
          new TextRun({ text: 'Daftar Pustaka:\n', bold: true, size: 20 }),
          new TextRun({ text: data?.lampiran?.daftarPustaka || 'Buku Guru dan Buku Siswa Kemendikbudristek 2024.', size: 19 }),
        ],
      })
    );

    // Tanda Tangan
    paragraphs.push(this.buildSignatureTable(school));

    return new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
            },
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: 'EDU PLAN AI — Halaman ', size: 18 }),
                    new TextRun({ children: [PageNumber.CURRENT] }),
                  ],
                }),
              ],
            }),
          },
          children: paragraphs,
        },
      ],
    });
  },

  // 2. PROTA BUILDER
  buildProtaDocx(doc: CurriculumDoc, school: SchoolProfile): Document {
    const rows = doc.content?.rows || [];
    const paragraphs: (Paragraph | Table)[] = [];

    paragraphs.push(...this.buildKopSurat(school));

    paragraphs.push(
      pText('PROGRAM TAHUNAN (PROTA) KURIKULUM MERDEKA', { bold: true, size: 26, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      pText(`Mata Pelajaran: ${doc.mataPelajaran} | Kelas / Fase: ${doc.kelas} (${doc.fase}) | TP: ${school.tahunPelajaran}`, {
        size: 20,
        bold: true,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Table Header
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [pText('No', { bold: true, alignment: AlignmentType.CENTER })] }),
          new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [pText('Semester', { bold: true, alignment: AlignmentType.CENTER })] }),
          new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, children: [pText('Tujuan Pembelajaran (TP)', { bold: true })] }),
          new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, children: [pText('Materi Pembelajaran', { bold: true })] }),
          new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [pText('Alokasi (JP)', { bold: true, alignment: AlignmentType.CENTER })] }),
        ],
      }),
    ];

    let totalJP = 0;
    rows.forEach((r: any, idx: number) => {
      const jp = Number(r.alokasiWaktu) || 0;
      totalJP += jp;
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [pText(String(idx + 1), { alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [pText(String(r.semester || '1'), { alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [pText(String(r.tujuanPembelajaran || ''))] }),
            new TableCell({ children: [pText(String(r.materiPembelajaran || r.materi || ''))] }),
            new TableCell({ children: [pText(`${jp} JP`, { alignment: AlignmentType.CENTER })] }),
          ],
        })
      );
    });

    // Total Row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ columnSpan: 4, children: [pText('TOTAL ALOKASI WAKTU SATU TAHUN', { bold: true, alignment: AlignmentType.RIGHT })] }),
          new TableCell({ children: [pText(`${totalJP} JP`, { bold: true, alignment: AlignmentType.CENTER })] }),
        ],
      })
    );

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      }),
      new Paragraph({ spacing: { before: 200 } }),
      this.buildSignatureTable(school)
    );

    return new Document({
      sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: paragraphs }],
    });
  },

  // 3. PROMES BUILDER
  buildPromesDocx(doc: CurriculumDoc, school: SchoolProfile): Document {
    const data = doc.content || {};
    const rows = data.rows || [];
    const bulanList: string[] = data.bulanList || ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const paragraphs: (Paragraph | Table)[] = [];
    paragraphs.push(...this.buildKopSurat(school));

    paragraphs.push(
      pText('PROGRAM SEMESTER (PROMES) KURIKULUM MERDEKA', { bold: true, size: 26, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      pText(`Kelas: ${doc.kelas} | Mapel: ${doc.mataPelajaran} | Semester: ${doc.semester} | TP: ${school.tahunPelajaran}`, {
        size: 20,
        bold: true,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    const headerRow = new TableRow({
      children: [
        new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [pText('No', { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [pText('Tujuan Pembelajaran', { bold: true })] }),
        new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [pText('Materi Pokok', { bold: true })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [pText('JP', { bold: true, alignment: AlignmentType.CENTER })] }),
        ...bulanList.map(
          (b) =>
            new TableCell({
              width: { size: 25 / bulanList.length, type: WidthType.PERCENTAGE },
              children: [pText(b.substring(0, 3), { bold: true, alignment: AlignmentType.CENTER })],
            })
        ),
      ],
    });

    const tableRows = [headerRow];

    rows.forEach((r: any, idx: number) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [pText(String(idx + 1), { alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [pText(String(r.tujuanPembelajaran || ''))] }),
            new TableCell({ children: [pText(String(r.materi || ''))] }),
            new TableCell({ children: [pText(`${r.alokasiWaktu || 0}`, { alignment: AlignmentType.CENTER })] }),
            ...bulanList.map((b) => {
              const isMarked = Object.keys(r.distribusiMinggu || {}).some((k) => k.startsWith(b) && r.distribusiMinggu[k]);
              return new TableCell({
                children: [pText(isMarked ? '✓' : '-', { alignment: AlignmentType.CENTER, bold: isMarked })],
              });
            }),
          ],
        })
      );
    });

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      }),
      new Paragraph({ spacing: { before: 200 } }),
      this.buildSignatureTable(school)
    );

    return new Document({
      sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: paragraphs }],
    });
  },

  // 4. ATP BUILDER
  buildAtpDocx(doc: CurriculumDoc, school: SchoolProfile): Document {
    const rows = doc.content?.rows || [];
    const paragraphs: (Paragraph | Table)[] = [];
    paragraphs.push(...this.buildKopSurat(school));

    paragraphs.push(
      pText('ALUR TUJUAN PEMBELAJARAN (ATP)', { bold: true, size: 26, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      pText(`Mata Pelajaran: ${doc.mataPelajaran} | Jenjang: SD ${doc.kelas} (${doc.fase})`, {
        size: 20,
        bold: true,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [pText('No', { bold: true, alignment: AlignmentType.CENTER })] }),
          new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [pText('Kode TP', { bold: true, alignment: AlignmentType.CENTER })] }),
          new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, children: [pText('Tujuan Pembelajaran (TP)', { bold: true })] }),
          new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, children: [pText('Lingkup Materi', { bold: true })] }),
          new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, children: [pText('Alokasi Waktu', { bold: true, alignment: AlignmentType.CENTER })] }),
        ],
      }),
    ];

    rows.forEach((r: any, idx: number) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [pText(String(idx + 1), { alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [pText(String(r.kodeTP || `TP.${idx + 1}`), { alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [pText(String(r.deskripsiTP || r.tujuanPembelajaran || ''))] }),
            new TableCell({ children: [pText(String(r.materi || ''))] }),
            new TableCell({ children: [pText(String(r.alokasiWaktu || '10 JP'), { alignment: AlignmentType.CENTER })] }),
          ],
        })
      );
    });

    paragraphs.push(
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }),
      new Paragraph({ spacing: { before: 200 } }),
      this.buildSignatureTable(school)
    );

    return new Document({
      sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: paragraphs }],
    });
  },

  // 5. JURNAL HARIAN BUILDER
  buildJurnalDocx(doc: CurriculumDoc, school: SchoolProfile): Document {
    const items = doc.content?.items || [];
    const paragraphs: (Paragraph | Table)[] = [];
    paragraphs.push(...this.buildKopSurat(school));

    paragraphs.push(
      pText('JURNAL HARIAN PEMBELAJARAN GURU SD', { bold: true, size: 26, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      pText(`Guru: ${school.namaGuru} | Kelas: ${doc.kelas} | Tahun Pelajaran: ${school.tahunPelajaran}`, {
        size: 20,
        bold: true,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [pText('Hari/Tanggal', { bold: true })] }),
          new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [pText('Mata Pelajaran', { bold: true })] }),
          new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, children: [pText('Materi & TP', { bold: true })] }),
          new TableCell({ width: { size: 26, type: WidthType.PERCENTAGE }, children: [pText('Kegiatan Pembelajaran', { bold: true })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [pText('Hasil & Refleksi', { bold: true })] }),
        ],
      }),
    ];

    items.forEach((j: any) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [pText(String(j.tanggal || '-')), pText(String(j.jamPelajaran || ''), { italics: true, size: 18 })] }),
            new TableCell({ children: [pText(String(j.mataPelajaran || doc.mataPelajaran))] }),
            new TableCell({ children: [pText(String(j.materi || ''), { bold: true }), pText(String(j.tujuanPembelajaran || ''), { size: 18 })] }),
            new TableCell({ children: [pText(String(j.kegiatanPembelajaran || ''))] }),
            new TableCell({ children: [pText(`Hasil: ${j.hasilPembelajaran || '-'}`), pText(`Refleksi: ${j.refleksi || '-'}`, { italics: true, size: 18 })] }),
          ],
        })
      );
    });

    paragraphs.push(
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }),
      new Paragraph({ spacing: { before: 200 } }),
      this.buildSignatureTable(school)
    );

    return new Document({
      sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: paragraphs }],
    });
  },

  // 6. LKPD BUILDER
  buildLkpdDocx(doc: CurriculumDoc, school: SchoolProfile): Document {
    const data = doc.content || {};
    const paragraphs: (Paragraph | Table)[] = [];
    paragraphs.push(...this.buildKopSurat(school));

    paragraphs.push(
      pText(data.judul || 'LEMBAR KERJA PESERTA DIDIK (LKPD)', { bold: true, size: 26, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      pText(`Mata Pelajaran: ${doc.mataPelajaran} | Kelas: ${doc.kelas} | Alokasi Waktu: ${data.alokasiWaktu || '70 Menit'}`, {
        bold: true,
        size: 20,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  pText('Nama Kelompok / Siswa: .....................................................'),
                  pText('Kelas / No. Absen: .....................................................'),
                ],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({ spacing: { before: 150 } }),
      pText('A. Petunjuk Belajar:', { bold: true, size: 22 })
    );

    (data.petunjukBelajar || []).forEach((p: string) => {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: p, size: 20 })] }));
    });

    paragraphs.push(
      pText('B. Ringkasan Materi:', { bold: true, size: 22, spacing: { before: 150 } }),
      pText(data.ringkasanMateri || 'Pelajari materi yang telah disampaikan.', { size: 20 }),
      pText('C. Soal Latihan & Penugasan:', { bold: true, size: 22, spacing: { before: 150 } })
    );

    (data.soalLatihan || []).forEach((q: any, idx: number) => {
      paragraphs.push(pText(`${idx + 1}. ${q.pertanyaan}`, { bold: true, size: 20, spacing: { before: 100, after: 50 } }));
      if (q.opsi && q.opsi.length > 0) {
        q.opsi.forEach((op: string) => {
          paragraphs.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: op, size: 20 })] }));
        });
      } else {
        paragraphs.push(
          new Paragraph({
            indent: { left: 720 },
            children: [new TextRun({ text: 'Jawaban: .....................................................................................................................', italics: true, size: 18 })],
          })
        );
      }
    });

    paragraphs.push(new Paragraph({ spacing: { before: 200 } }), this.buildSignatureTable(school));

    return new Document({
      sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: paragraphs }],
    });
  },

  // Generic fallback builder
  buildGenericDocx(doc: CurriculumDoc, school: SchoolProfile): Document {
    const paragraphs: Paragraph[] = [
      ...this.buildKopSurat(school),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: doc.title, bold: true, size: 26 })],
      }),
      new Paragraph({
        spacing: { before: 200 },
        children: [new TextRun({ text: JSON.stringify(doc.content, null, 2), size: 20 })],
      }),
    ];
    return new Document({ sections: [{ children: paragraphs }] });
  },
};
