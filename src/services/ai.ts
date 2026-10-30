export interface AIGenerationRequest {
  type: 'MODUL_AJAR' | 'PROTA' | 'PROMES' | 'ATP' | 'CP_TP' | 'JURNAL' | 'LKPD';
  schoolName?: string;
  teacherName?: string;
  kelas: string;
  fase: string;
  mataPelajaran: string;
  semester?: string;
  materiTopik?: string;
  cpText?: string;
  tpList?: string[];
  alokasiWaktu?: string;
  catatanKhusus?: string;
}

export const aiService = {
  async generateDocument(req: AIGenerationRequest): Promise<any> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: this.buildPrompt(req),
          systemInstruction: 'Anda adalah pakar penyusun perangkat pembelajaran Sekolah Dasar (SD) Kurikulum Merdeka di Indonesia. Format keluaran harus berupa JSON terstruktur yang valid tanpa teks pembuka/penutup markdown lain jika diminta JSON, atau teks terstruktur yang rapi.',
          type: req.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal terhubung ke layanan AI.');
      }

      const data = await response.json();
      if (!data.success || !data.text) {
        throw new Error(data.message || 'Respon AI tidak lengkap.');
      }

      // Try to parse JSON from AI response
      const cleanJson = this.extractJSON(data.text);
      if (cleanJson) {
        return cleanJson;
      }

      // If text response, return as raw or structured
      return { rawText: data.text };
    } catch (err: any) {
      console.warn('AI API fallback engaged:', err);
      // Generate intelligent fallback tailored to the parameters so user is never blocked
      return this.generateSmartFallback(req);
    }
  },

  extractJSON(text: string): any {
    try {
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const jsonStr = text.substring(startIdx, endIdx + 1);
        return JSON.parse(jsonStr);
      }
    } catch {
      // ignore
    }
    return null;
  },

  buildPrompt(req: AIGenerationRequest): string {
    const { type, kelas, fase, mataPelajaran, materiTopik, semester, alokasiWaktu, cpText, catatanKhusus } = req;

    if (type === 'MODUL_AJAR') {
      return `Buatkan Modul Ajar Kurikulum Merdeka Lengkap untuk:
Jenjang: Sekolah Dasar (SD)
Kelas: ${kelas} (${fase})
Mata Pelajaran: ${mataPelajaran}
Topik/Materi: ${materiTopik || 'Materi Inti'}
Semester: ${semester || 'Ganjil'}
Alokasi Waktu: ${alokasiWaktu || '4 x 35 Menit (2 Pertemuan)'}
Capaian Pembelajaran: ${cpText || 'Sesuai BSKAP'}
Catatan Tambahan: ${catatanKhusus || 'Diferensiasi proses dan produk'}

Keluarkan HANYA JSON murni dengan format struktur:
{
  "identitas": {
    "namaPenyusun": "${req.teacherName || 'Husein A. Priyanto'}",
    "institusi": "${req.schoolName || 'SDN Kasepuhan 04 Batang'}",
    "tahunPelajaran": "2026/2027",
    "jenjangSekolah": "Sekolah Dasar (SD)",
    "mataPelajaran": "${mataPelajaran}",
    "faseKelas": "${fase} / ${kelas}",
    "elemen": "${materiTopik || 'Pemahaman Konsep'}",
    "alokasiWaktu": "${alokasiWaktu || '4 x 35 Menit'}",
    "jumlahPertemuan": 2
  },
  "kompetensiAwal": ["poin 1", "poin 2"],
  "profilPelajarPancasila": ["Bernalar Kritis", "Gotong Royong", "Mandiri", "Kreatif"],
  "saranaPrasarana": {
    "media": ["media 1", "media 2"],
    "alatDanBahan": ["alat 1", "alat 2"],
    "sumberBelajar": ["Buku Siswa", "Lingkungan sekitar"]
  },
  "targetPesertaDidik": "Peserta didik reguler/tipikal",
  "modelPembelajaran": "Problem Based Learning (PBL) / Inquiry",
  "metodePembelajaran": ["Diskusi", "Eksperimen", "Tanya Jawab", "Demonstrasi"],
  "komponenInti": {
    "tujuanPembelajaran": ["TP 1 spesifik", "TP 2 spesifik"],
    "pemahamanBermakna": ["makna 1", "makna 2"],
    "pertanyaanPemantik": ["pertanyaan 1?", "pertanyaan 2?"],
    "kegiatanPembelajaran": [
      {
        "pertemuanKe": 1,
        "pendahuluan": ["salam dan doa", "apersepsi", "penyampaian tujuan"],
        "inti": ["kegiatan bermakna 1", "kegiatan kelompok berorientasi masalah", "presentasi hasil"],
        "penutup": ["refleksi bersama", "simpulan", "doa"]
      },
      {
        "pertemuanKe": 2,
        "pendahuluan": ["pembukaan dan review"],
        "inti": ["aktivitas pendalaman", "asesmen formatif"],
        "penutup": ["evaluasi dan penutup"]
      }
    ],
    "asesmen": {
      "diagnostik": "Tanya jawab lisan awal",
      "formatif": "Observasi kinerja dan LKPD",
      "sumatif": "Tes tertulis di akhir materi",
      "rubrik": "Rubrik 4 kriteria penilaian"
    },
    "diferensiasi": {
      "konten": "Materi teks bergambar dan audio visual",
      "proses": "Scaffolding pendampingan kelompok",
      "produk": "Pilihan format penyajian tugas siswa"
    },
    "remedialDanPengayaan": {
      "remedial": "Bimbingan konsep dasar",
      "pengayaan": "Tantangan eksplorasi lanjutan"
    },
    "refleksi": {
      "guru": ["Apakah siswa antusias?", "Apa kendala pembelajaran?"],
      "pesertaDidik": ["Apa hal baru yang kamu pelajari?", "Bagian mana yang paling kamu sukai?"]
    }
  },
  "lampiran": {
    "ringkasanMateri": "Uraian materi lengkap dan ringkas untuk guru dan siswa.",
    "lembarKerja": "Petunjuk aktivitas kerja peserta didik.",
    "glosarium": "Daftar istilah penting.",
    "daftarPustaka": "Referensi buku dan sumber belajar resmi."
  }
}`;
    }

    if (type === 'PROTA') {
      return `Buatkan distribusi Program Tahunan (PROTA) Kurikulum Merdeka untuk:
Kelas: ${kelas} (${fase})
Mata Pelajaran: ${mataPelajaran}
Topik/Cakupan: ${materiTopik || 'Materi 1 Tahun'}
Keluarkan JSON:
{
  "rows": [
    { "id": "1", "no": 1, "semester": "1", "tujuanPembelajaran": "TP 1", "materiPembelajaran": "Materi 1", "alokasiWaktu": 12, "keterangan": "Bab 1" },
    { "id": "2", "no": 2, "semester": "1", "tujuanPembelajaran": "TP 2", "materiPembelajaran": "Materi 2", "alokasiWaktu": 14, "keterangan": "Bab 2" },
    { "id": "3", "no": 3, "semester": "1", "tujuanPembelajaran": "TP 3", "materiPembelajaran": "Materi 3", "alokasiWaktu": 12, "keterangan": "Bab 3" },
    { "id": "4", "no": 4, "semester": "2", "tujuanPembelajaran": "TP 4", "materiPembelajaran": "Materi 4", "alokasiWaktu": 14, "keterangan": "Bab 4" },
    { "id": "5", "no": 5, "semester": "2", "tujuanPembelajaran": "TP 5", "materiPembelajaran": "Materi 5", "alokasiWaktu": 16, "keterangan": "Bab 5" }
  ],
  "totalJP": 68
}`;
    }

    if (type === 'PROMES') {
      return `Buatkan Program Semester (PROMES) Kurikulum Merdeka untuk:
Kelas: ${kelas} (${fase}), Mapel: ${mataPelajaran}, Semester: ${semester || 'Ganjil'}
Keluarkan JSON:
{
  "bulanList": ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  "mingguPerBulan": 4,
  "rows": [
    {
      "id": "1",
      "no": 1,
      "tujuanPembelajaran": "Mendeskripsikan konsep utama",
      "materi": "Materi Bab 1",
      "alokasiWaktu": 12,
      "distribusiMinggu": { "Juli_W3": true, "Juli_W4": true, "Agustus_W1": true },
      "keterangan": "Pertemuan 1-3"
    },
    {
      "id": "2",
      "no": 2,
      "tujuanPembelajaran": "Menerapkan prinsip dalam pemecahan masalah",
      "materi": "Materi Bab 2",
      "alokasiWaktu": 14,
      "distribusiMinggu": { "Agustus_W2": true, "Agustus_W3": true, "Agustus_W4": true, "September_W1": true },
      "keterangan": "Pertemuan 4-7"
    }
  ]
}`;
    }

    if (type === 'ATP') {
      return `Buatkan Alur Tujuan Pembelajaran (ATP) SD Kurikulum Merdeka untuk:
Kelas: ${kelas} (${fase}), Mapel: ${mataPelajaran}, Topik: ${materiTopik || 'Semua Elemen'}
Keluarkan JSON:
{
  "rows": [
    { "id": "1", "no": 1, "kodeTP": "TP 1.1", "cpTerkait": "Elemen Pemahaman", "deskripsiTP": "Tujuan pembelajaran 1", "materi": "Materi pokok 1", "urutan": 1, "alokasiWaktu": "10 JP", "catatan": "Kontekstual" },
    { "id": "2", "no": 2, "kodeTP": "TP 1.2", "cpTerkait": "Elemen Pemahaman", "deskripsiTP": "Tujuan pembelajaran 2", "materi": "Materi pokok 2", "urutan": 2, "alokasiWaktu": "12 JP", "catatan": "Eksperimen" },
    { "id": "3", "no": 3, "kodeTP": "TP 1.3", "cpTerkait": "Elemen Keterampilan", "deskripsiTP": "Tujuan pembelajaran 3", "materi": "Materi pokok 3", "urutan": 3, "alokasiWaktu": "12 JP", "catatan": "Proyek Mini" }
  ]
}`;
    }

    if (type === 'JURNAL') {
      return `Buatkan draf Jurnal Harian Pembelajaran Guru SD untuk:
Kelas: ${kelas}, Mapel: ${mataPelajaran}, Materi: ${materiTopik || 'Materi Harian'}
Keluarkan JSON:
{
  "tanggal": "${new Date().toISOString().split('T')[0]}",
  "jamPelajaran": "Jam ke-1 s.d 3 (07.00 - 08.45)",
  "materi": "${materiTopik || 'Materi Pokok'}",
  "tujuanPembelajaran": "Peserta didik mampu memahami konsep pokok melalui penugasan interaktif.",
  "kegiatanPembelajaran": "Guru membuka dengan apersepsi menyenangkan, mengajak siswa berdiskusi kelompok mengamati contoh nyata, membimbing penyelesaian LKPD, serta menyimpulkan konsep bersama.",
  "jumlahHadir": 28,
  "jumlahTidakHadir": 0,
  "hasilPembelajaran": "Siswa sangat antusias dan mampu mempresentasikan hasil diskusinya dengan percaya diri.",
  "refleksi": "Sebagian besar siswa memahami inti pembelajaran dengan baik, perlu tambahan waktu latihan bagi kelompok 3.",
  "tindakLanjut": "Memberikan penguatan mandiri dan melanjutkan ke aktivitas pendalaman pada pertemuan berikutnya."
}`;
    }

    // Default LKPD
    return `Buatkan Lembar Kerja Peserta Didik (LKPD) dan Asesmen untuk SD:
Kelas: ${kelas} (${fase}), Mapel: ${mataPelajaran}, Topik: ${materiTopik || 'Latihan dan Asesmen'}
Keluarkan JSON:
{
  "judul": "Lembar Kerja Peserta Didik (LKPD): ${materiTopik || 'Latihan Siswa'}",
  "mataPelajaran": "${mataPelajaran}",
  "kelas": "${kelas}",
  "fase": "${fase}",
  "semester": "${semester || 'Ganjil'}",
  "alokasiWaktu": "70 Menit",
  "tujuanPembelajaran": "Peserta didik mampu mengaplikasikan pemahaman konsep pada soal dan aktivitas nyata.",
  "petunjukBelajar": [
    "Tuliskan nama dan nomor absen pada kolom yang tersedia.",
    "Bacalah ringkasan materi dan petunjuk pengerjaan dengan seksama.",
    "Diskusikan bersama rekan sekelompokmu dan tanyakan pada guru jika ada yang belum dipahami."
  ],
  "ringkasanMateri": "Ringkasan konsep pokok materi secara padat dan mudah dipahami siswa SD.",
  "langkahAktivitas": [
    "Lakukan pengamatan terhadap obyek yang telah ditentukan.",
    "Catat hasil temuanmu ke dalam format pengamatan.",
    "Simpulkan jawaban terbaik bersama kelompokmu."
  ],
  "soalLatihan": [
    { "id": "q1", "nomor": 1, "tipe": "Pilihan Ganda", "pertanyaan": "Pertanyaan konsep 1?", "opsi": ["A. Opsi A", "B. Opsi B", "C. Opsi C", "D. Opsi D"], "kunciJawaban": "A. Opsi A" },
    { "id": "q2", "nomor": 2, "tipe": "Pilihan Ganda", "pertanyaan": "Pertanyaan aplikasi 2?", "opsi": ["A. Opsi A", "B. Opsi B", "C. Opsi C", "D. Opsi D"], "kunciJawaban": "B. Opsi B" },
    { "id": "q3", "nomor": 3, "tipe": "Isian Singkat", "pertanyaan": "Jelaskan dengan bahasamu sendiri mengenai hal tersebut!", "kunciJawaban": "Kunci jawaban singkat." }
  ],
  "rubrikPenilaian": [
    { "kriteria": "Pemahaman Konsep", "skor4": "Sangat Tepat", "skor3": "Tepat", "skor2": "Cukup", "skor1": "Perlu Bimbingan" }
  ]
}`;
  },

  generateSmartFallback(req: AIGenerationRequest): any {
    const { type, kelas, fase, mataPelajaran, materiTopik, semester } = req;
    const topik = materiTopik || `Pembelajaran ${mataPelajaran} ${kelas}`;

    if (type === 'MODUL_AJAR') {
      return {
        identitas: {
          namaPenyusun: req.teacherName || 'Husein A. Priyanto',
          institusi: req.schoolName || 'SDN Kasepuhan 04 Batang',
          tahunPelajaran: '2026/2027',
          jenjangSekolah: 'Sekolah Dasar (SD)',
          mataPelajaran,
          faseKelas: `${fase} / ${kelas}`,
          elemen: topik,
          alokasiWaktu: req.alokasiWaktu || '4 x 35 Menit (2 Pertemuan)',
          jumlahPertemuan: 2,
        },
        kompetensiAwal: [
          `Peserta didik telah memiliki pengetahuan dasar terkait topik ${topik}.`,
          'Peserta didik mampu bekerja sama dan mengemukakan pendapat di depan kelas.',
        ],
        profilPelajarPancasila: [
          'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
          'Bernalar Kritis (menganalisis masalah dan informasi)',
          'Gotong Royong (bekerja sama dalam kelompok diskusi)',
          'Kreatif (menghasilkan karya orisinal)',
        ],
        saranaPrasarana: {
          media: ['Papan tulis & spidol', 'Buku Siswa Kemendikbudristek', 'Media visual / benda konkret'],
          alatDanBahan: ['Lembar Kerja Peserta Didik (LKPD)', 'Alat tulis siswa', 'Kartu tugas'],
          sumberBelajar: [`Buku Siswa ${mataPelajaran} ${kelas}`, `Lingkungan belajar ${req.schoolName || 'sekolah'}`],
        },
        targetPesertaDidik: 'Peserta didik reguler/tipikal, dengan diferensiasi untuk siswa yang memerlukan pendampingan.',
        modelPembelajaran: 'Problem Based Learning (PBL) Terpadu',
        metodePembelajaran: ['Tanya Jawab', 'Diskusi Kelompok', 'Penugasan Terbimbing', 'Presentasi Ceria'],
        komponenInti: {
          tujuanPembelajaran: [
            `Peserta didik mampu menjelaskan konsep dasar ${topik} dengan tepat.`,
            `Peserta didik mampu menyajikan hasil telaah dan identifikasi terkait ${topik} secara percaya diri.`,
            `Peserta didik mampu menerapkan nilai-nilai positif dalam kehidupan sehari-hari.`,
          ],
          pemahamanBermakna: [
            `Memahami ${topik} membantu siswa memecahkan masalah nyata di kehidupan sehari-hari.`,
            'Belajar secara kolaboratif menumbuhkan rasa empati dan saling menghargai antar teman.',
          ],
          pertanyaanPemantik: [
            `Pernahkah kalian melihat atau mengalami fenomena terkait ${topik} di rumah atau sekolah?`,
            `Mengapa hal tersebut penting untuk kita pelajari bersama hari ini?`,
          ],
          kegiatanPembelajaran: [
            {
              pertemuanKe: 1,
              pendahuluan: [
                'Guru menyapa hangat peserta didik, berdoa bersama, dan memeriksa presensi.',
                'Apersepsi: Guru mengaitkan materi sebelumnya dengan topik baru secara interaktif.',
                'Menyampaikan tujuan pembelajaran dan memotivasi peserta didik untuk aktif.',
              ],
              inti: [
                'Orientasi siswa pada masalah kontekstual melalui gambar atau cerita singkat.',
                'Mengorganisasikan siswa ke dalam kelompok kecil heterogen (4-5 siswa).',
                'Membimbing penyelidikan kelompok dengan menggunakan LKPD eksplorasi.',
                'Diferensiasi proses: Bimbingan intensif bagi kelompok yang membutuhkan dukungan konseptual.',
                'Siswa mempresentasikan hasil telaah kelompok secara bergiliran.',
              ],
              penutup: [
                'Guru bersama peserta didik membuat rangkuman dan kesimpulan pembelajaran.',
                'Refleksi singkat: Apa yang paling disenangi siswa dari kegiatan hari ini?',
                'Menyampaikan rencana pertemuan selanjutnya dan menutup dengan salam serta doa.',
              ],
            },
            {
              pertemuanKe: 2,
              pendahuluan: [
                'Pembukaan dengan salam, doa bersama, dan penyegaran (ice breaking ceria).',
                'Mengulas kembali poin penting yang telah ditemukan pada pertemuan pertama.',
              ],
              inti: [
                'Aktivitas aplikasi: Menerapkan konsep pada studi kasus dan pembuatan karya/bagan.',
                'Diferensiasi produk: Siswa dapat membuat ringkasan bergambar, catatan poin, atau mind map.',
                'Asesmen formatif singkat untuk mengecek ketercapaian tujuan pembelajaran.',
              ],
              penutup: [
                'Apresiasi kelas atas kerja keras dan kerja sama yang ditunjukkan siswa.',
                'Refleksi diri dan tindak lanjut tugas mandiri.',
                'Doa penutup dipimpin oleh salah satu perwakilan siswa.',
              ],
            },
          ],
          asesmen: {
            diagnostik: 'Pertanyaan lisan pemantik di awal pembelajaran.',
            formatif: 'Observasi keaktifan diskusi, pengisian LKPD kelompok, dan unjuk kerja.',
            sumatif: 'Tes tertulis mandiri di akhir lingkup materi.',
            rubrik: 'Rubrik penilaian bertingkat: Sangat Baik (4), Baik (3), Cukup (2), Perlu Bimbingan (1).',
          },
          diferensiasi: {
            konten: 'Penyediaan teks materi singkat dilengkapi ilustrasi dan contoh konkret.',
            proses: 'Pendampingan berjenjang (scaffolding) bagi peserta didik yang lambat belajar.',
            produk: 'Kebebasan memilih media presentasi hasil kerja kelompok.',
          },
          remedialDanPengayaan: {
            remedial: 'Bimbingan ulang individual pada bagian materi yang belum tuntas.',
            pengayaan: 'Tugas eksplorasi studi kasus nyata tingkat lanjut.',
          },
          refleksi: {
            guru: [
              'Apakah metode pembelajaran yang diterapkan berjalan sesuai dengan alokasi waktu?',
              'Bagian mana dari aktivitas yang paling disukai dan mudah dipahami oleh siswa?',
            ],
            pesertaDidik: [
              'Apa hal paling berkesan yang kamu pelajari hari ini?',
              'Apakah kamu merasa terbantu bekerja sama dengan teman kelompokmu?',
            ],
          },
        },
        lampiran: {
          ringkasanMateri: `Rangkuman materi komprehensif mengenai ${topik} disusun secara sistematis untuk jenjang ${kelas}.`,
          lembarKerja: `Lembar Kerja Peserta Didik (LKPD) berisikan petunjuk kerja kelompok dan pengamatan nyata terkait ${topik}.`,
          glosarium: 'Daftar kosakata kunci dan definisi istilah penting yang digunakan dalam pembelajaran.',
          daftarPustaka: `Buku Panduan Guru & Siswa ${mataPelajaran} ${kelas}, BSKAP Kemendikbudristek 2024.`,
        },
      };
    }

    if (type === 'PROTA') {
      return {
        rows: [
          { id: '1', no: 1, semester: '1', tujuanPembelajaran: `Memahami konsep esensial Bab 1 ${topik}`, materiPembelajaran: `Pengenalan Konsep ${topik}`, alokasiWaktu: 12, keterangan: 'Bab 1' },
          { id: '2', no: 2, semester: '1', tujuanPembelajaran: `Menganalisis hubungan sebab-akibat Bab 2 ${topik}`, materiPembelajaran: `Aplikasi dan Analisis ${topik}`, alokasiWaktu: 14, keterangan: 'Bab 2' },
          { id: '3', no: 3, semester: '1', tujuanPembelajaran: `Menerapkan pemecahan masalah sederhana Bab 3`, materiPembelajaran: `Penyelidikan Lapangan & Praktik`, alokasiWaktu: 14, keterangan: 'Bab 3' },
          { id: '4', no: 4, semester: '2', tujuanPembelajaran: `Mengeksplorasi konsep lanjutan Bab 4`, materiPembelajaran: `Pengembangan Konsep Semester 2`, alokasiWaktu: 16, keterangan: 'Bab 4' },
          { id: '5', no: 5, semester: '2', tujuanPembelajaran: `Menyajikan karya kreatif dan evaluasi Bab 5`, materiPembelajaran: `Proyek Akhir & Refleksi`, alokasiWaktu: 14, keterangan: 'Bab 5' },
        ],
        totalJP: 70,
      };
    }

    if (type === 'PROMES') {
      return {
        bulanList: semester === 'Genap' ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'] : ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        mingguPerBulan: 4,
        rows: [
          { id: '1', no: 1, tujuanPembelajaran: `Tujuan Pembelajaran 1 ${topik}`, materi: `Lingkup Materi 1`, alokasiWaktu: 12, distribusiMinggu: { 'Juli_W3': true, 'Juli_W4': true, 'Agustus_W1': true }, keterangan: 'Pertemuan 1-3' },
          { id: '2', no: 2, tujuanPembelajaran: `Tujuan Pembelajaran 2 ${topik}`, materi: `Lingkup Materi 2`, alokasiWaktu: 14, distribusiMinggu: { 'Agustus_W2': true, 'Agustus_W3': true, 'Agustus_W4': true, 'September_W1': true }, keterangan: 'Pertemuan 4-7' },
          { id: '3', no: 3, tujuanPembelajaran: `Tujuan Pembelajaran 3 ${topik}`, materi: `Lingkup Materi 3`, alokasiWaktu: 14, distribusiMinggu: { 'September_W2': true, 'September_W3': true, 'September_W4': true, 'Oktober_W1': true }, keterangan: 'Pertemuan 8-11' },
          { id: '4', no: 4, tujuanPembelajaran: `Asesmen Sumatif Tengah Semester`, materi: `Evaluasi Belajar`, alokasiWaktu: 4, distribusiMinggu: { 'Oktober_W2': true }, keterangan: 'STS' },
          { id: '5', no: 5, tujuanPembelajaran: `Tujuan Pembelajaran 4 ${topik}`, materi: `Lingkup Materi 4`, alokasiWaktu: 16, distribusiMinggu: { 'Oktober_W3': true, 'Oktober_W4': true, 'November_W1': true, 'November_W2': true }, keterangan: 'Pertemuan 12-15' },
        ],
      };
    }

    if (type === 'ATP') {
      return {
        rows: [
          { id: '1', no: 1, kodeTP: 'TP 1', cpTerkait: 'Elemen Pemahaman', deskripsiTP: `Mengidentifikasi konsep dasar ${topik}.`, materi: `Materi Awal ${topik}`, urutan: 1, alokasiWaktu: '10 JP', catatan: 'Pembelajaran Kontekstual' },
          { id: '2', no: 2, kodeTP: 'TP 2', cpTerkait: 'Elemen Keterampilan Proses', deskripsiTP: `Menyelidiki fenomena terkait ${topik} melalui percobaan sederhana.`, materi: `Penyelidikan Ilmiah`, urutan: 2, alokasiWaktu: '12 JP', catatan: 'Praktik Kelompok' },
          { id: '3', no: 3, kodeTP: 'TP 3', cpTerkait: 'Elemen Aplikasi', deskripsiTP: `Menyajikan gagasan solusi atas masalah kontekstual.`, materi: `Aplikasi dan Proyek`, urutan: 3, alokasiWaktu: '12 JP', catatan: 'Karya Siswa' },
        ],
      };
    }

    if (type === 'JURNAL') {
      return {
        tanggal: new Date().toISOString().split('T')[0],
        jamPelajaran: 'Jam ke-1 s.d 4 (07.00 - 09.20)',
        materi: topik,
        tujuanPembelajaran: `Peserta didik mampu memahami dan mendiskusikan materi ${topik} dengan bimbingan guru.`,
        kegiatanPembelajaran: `Apersepsi tanya jawab ceria, pemutaran media pembelajaran atau contoh benda nyata, pengerjaan LKPD berkelompok, dan presentasi sederhana di depan kelas.`,
        jumlahHadir: 28,
        jumlahTidakHadir: 0,
        hasilPembelajaran: 'Peserta didik aktif berpartisipasi dan mencapai indikator ketuntasan tujuan pembelajaran.',
        refleksi: 'Pembelajaran kontekstual membuat siswa antusias; sebagian kecil masih butuh bimbingan pada langkah menuliskan kesimpulan.',
        tindakLanjut: 'Memberikan bimbingan perorangan (scaffolding) dan penguatan di pertemuan berikutnya.',
      };
    }

    return {
      judul: `Lembar Kerja Peserta Didik (LKPD): ${topik}`,
      mataPelajaran,
      kelas,
      fase,
      semester: semester || 'Ganjil',
      alokasiWaktu: '70 Menit',
      tujuanPembelajaran: `Peserta didik dapat memahami konsep ${topik} dan menyelesaikan soal latihan dengan tepat.`,
      petunjukBelajar: [
        'Berdoalah sebelum memulai kegiatan.',
        'Bacalah pertanyaan dan perintah kerja dengan cermat.',
        'Diskusikan jawaban secara bersama-sama dalam kelompok.',
      ],
      ringkasanMateri: `Materi esensial tentang ${topik} yang disesuaikan dengan taraf berpikir peserta didik ${kelas}.`,
      langkahAktivitas: [
        'Lakukan observasi cermat terhadap bahan ajar atau lingkungan sekitar.',
        'Tuliskan poin penting yang kamu temukan pada lembar jawaban.',
        'Presentasikan satu kesimpulan terbaik kelompokmu.',
      ],
      soalLatihan: [
        { id: 'q1', nomor: 1, tipe: 'Pilihan Ganda', pertanyaan: `Pernyataan berikut yang paling sesuai dengan prinsip ${topik} adalah ...`, opsi: ['A. Pilihan jawaban A yang tepat', 'B. Pilihan jawaban B', 'C. Pilihan jawaban C', 'D. Pilihan jawaban D'], kunciJawaban: 'A' },
        { id: 'q2', nomor: 2, tipe: 'Pilihan Ganda', pertanyaan: `Manfaat utama mempelajari ${topik} dalam kehidupan sehari-hari adalah ...`, opsi: ['A. Meningkatkan pemahaman dan kepedulian', 'B. Membuang waktu senggang', 'C. Menghafal tanpa memahami', 'D. Menghindari kegiatan belajar'], kunciJawaban: 'A' },
        { id: 'q3', nomor: 3, tipe: 'Isian Singkat', pertanyaan: `Sebutkan dua contoh penerapan ${topik} di lingkungan sekolah SDN Kasepuhan 04 Batang!`, kunciJawaban: 'Contoh nyata dan aplikatif.' },
      ],
      rubrikPenilaian: [
        { kriteria: 'Ketuntasan LKPD', skor4: 'Sangat Lengkap & Tepat', skor3: 'Lengkap', skor2: 'Cukup', skor1: 'Perlu Pendampingan' },
      ],
    };
  },
};
