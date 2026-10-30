import {
  SchoolProfile,
  UserAccount,
  CurriculumDoc,
  CPItem,
  TPItem,
  ATPRow,
  PROTARow,
  PROMESRow,
  JurnalItem,
  LKPDData,
  ModulAjarData,
  DocumentTemplate,
} from '../types';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  namaSekolah: '',
  npsn: '',
  alamat: '',
  desaKelurahan: '',
  kecamatan: '',
  kabupaten: '',
  provinsi: '',
  tahunPelajaran: '2026/2027',
  semester: 'Ganjil',
  namaGuru: '',
  nipGuru: '',
  jabatanGuru: 'Guru Kelas / Mapel',
  mataPelajaran: '',
  kelasDiampu: 'Kelas 4',
  fase: 'Fase B',
  namaKepalaSekolah: '',
  nipKepalaSekolah: '',
};

// Default Curricular Database (Kurikulum Merdeka SD)
export const DEFAULT_CP_LIST: CPItem[] = [
  {
    id: 'cp-ipas-4-1',
    fase: 'Fase B',
    kelas: 'Kelas 4',
    mataPelajaran: 'IPAS',
    elemen: 'Pemahaman IPAS (Sains dan Sosial)',
    deskripsiCP: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia dan tumbuhan; mendeskripsikan siklus hidup tumbuhan dan hewan; mengidentifikasi masalah lingkungan dan upaya pelestariannya; serta menyelidiki ragam sumber energi dan pemanfaatannya.',
    sumber: 'BSKAP Kemendikbudristek No. 032/H/KR/2024',
  },
  {
    id: 'cp-bindo-4-1',
    fase: 'Fase B',
    kelas: 'Kelas 4',
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Membaca dan Memirsa',
    deskripsiCP: 'Peserta didik mampu memahami pesan dan informasi tentang kehidupan sehari-hari, teks narasi, dan puisi anak dalam bentuk cetak atau elektronik. Mampu membaca kata-kata baru dengan pola kombinasi huruf yang telah dikenali dengan fasih.',
    sumber: 'BSKAP Kemendikbudristek No. 032/H/KR/2024',
  },
  {
    id: 'cp-mat-4-1',
    fase: 'Fase B',
    kelas: 'Kelas 4',
    mataPelajaran: 'Matematika',
    elemen: 'Bilangan',
    deskripsiCP: 'Peserta didik menunjukkan pemahaman dan intuisi bilangan pada bilangan cacah sampai 10.000. Mereka dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan operasi penjumlahan dan pengurangan sampai 1.000.',
    sumber: 'BSKAP Kemendikbudristek No. 032/H/KR/2024',
  },
  {
    id: 'cp-pancasila-4-1',
    fase: 'Fase B',
    kelas: 'Kelas 4',
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Pancasila',
    deskripsiCP: 'Peserta didik mampu memahami dan menyajikan hubungan antarsila Pancasila dalam kehidupan sehari-hari; meneladani karakter para perumus Pancasila; serta membiasakan perilaku sesuai dengan nilai-nilai Pancasila.',
    sumber: 'BSKAP Kemendikbudristek No. 032/H/KR/2024',
  },
  {
    id: 'cp-pjok-4-1',
    fase: 'Fase B',
    kelas: 'Kelas 4',
    mataPelajaran: 'PJOK',
    elemen: 'Keterampilan Gerak',
    deskripsiCP: 'Peserta didik mempraktikkan variasi dan kombinasi pola gerak dasar lokomotor, non-lokomotor, dan manipulatif dalam berbagai olahraga permainan bola besar/kecil tradisional atau modern sesuai potensi peserta didik.',
    sumber: 'BSKAP Kemendikbudristek No. 032/H/KR/2024',
  },
];

export const DEFAULT_TP_LIST: TPItem[] = [
  {
    id: 'tp-pjok-4-1',
    cpId: 'cp-pjok-4-1',
    kodeTP: 'TP 4.1',
    deskripsiTP: 'Mempraktikkan variasi dan kombinasi pola gerak dasar lokomotor dan manipulatif dalam menendang serta menghentikan bola besar (sepak bola).',
    materi: 'Pola Gerak Dasar Permainan Sepak Bola',
    alokasiJP: 12,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
  {
    id: 'tp-pjok-4-2',
    cpId: 'cp-pjok-4-1',
    kodeTP: 'TP 4.2',
    deskripsiTP: 'Mempraktikkan variasi pola gerak manipulatif melempar dan menangkap bola kecil dalam permainan kasti beregu dengan sportivitas.',
    materi: 'Kombinasi Gerak Permainan Kasti',
    alokasiJP: 12,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
  {
    id: 'tp-pjok-4-3',
    cpId: 'cp-pjok-4-1',
    kodeTP: 'TP 4.3',
    deskripsiTP: 'Menerapkan pola hidup bersih dan sehat (PHBS) serta membiasakan menjaga kebersihan alat olahraga dan lingkungan sekolah.',
    materi: 'Pola Hidup Bersih dan Sehat (PHBS)',
    alokasiJP: 8,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
  {
    id: 'tp-ipas-4-1',
    cpId: 'cp-ipas-4-1',
    kodeTP: 'TP 4.1',
    deskripsiTP: 'Mengidentifikasi bagian-bagian tubuh tumbuhan (akar, batang, daun, bunga, buah) beserta fungsinya dengan teliti.',
    materi: 'Bagian Tubuh Tumbuhan dan Fungsinya',
    alokasiJP: 10,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
  {
    id: 'tp-ipas-4-2',
    cpId: 'cp-ipas-4-1',
    kodeTP: 'TP 4.2',
    deskripsiTP: 'Mendeskripsikan proses fotosintesis pada tumbuhan dan kaitannya dengan kelangsungan makhluk hidup di bumi.',
    materi: 'Fotosintesis: Proses Terpenting di Bumi',
    alokasiJP: 12,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
  {
    id: 'tp-ipas-4-3',
    cpId: 'cp-ipas-4-1',
    kodeTP: 'TP 4.3',
    deskripsiTP: 'Menganalisis perkembangbiakan tumbuhan secara generatif dan vegetatif melalui pengamatan langsung.',
    materi: 'Perkembangbiakan Tumbuhan',
    alokasiJP: 10,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
  {
    id: 'tp-ipas-4-4',
    cpId: 'cp-ipas-4-1',
    kodeTP: 'TP 4.4',
    deskripsiTP: 'Mengidentifikasi wujud zat (padat, cair, gas) serta perubahan wujud zat dalam kehidupan sehari-hari.',
    materi: 'Wujud Zat dan Perubahannya',
    alokasiJP: 12,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
  {
    id: 'tp-bindo-4-1',
    cpId: 'cp-bindo-4-1',
    kodeTP: 'TP 4.1',
    deskripsiTP: 'Menemukan informasi tersurat dan tersirat dalam teks narasi anak serta menceritakan kembali pokok pikirannya.',
    materi: 'Menjelajah Cerita Narasi',
    alokasiJP: 12,
    semester: 'Ganjil',
    kelas: 'Kelas 4',
  },
];

export const DEFAULT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl-modul-lengkap',
    nama: 'Modul Ajar Kurikulum Merdeka (Lengkap 19 Komponen)',
    tipe: 'MODUL_AJAR',
    deskripsi: 'Template lengkap sesuai standar BSKAP Kemendikbudristek dengan komponen informasi umum, komponen inti, rubrik asesmen, dan lampiran.',
    isDefault: true,
    sections: [
      { id: 'identitas', title: 'I. Informasi Umum (Identitas & Profil)', required: true },
      { id: 'kompetensiAwal', title: 'II. Kompetensi Awal & Profil Pancasila', required: true },
      { id: 'sarana', title: 'III. Sarana Prasarana & Target Peserta Didik', required: true },
      { id: 'komponenInti', title: 'IV. Komponen Inti (TP, Pemahaman, Pemantik)', required: true },
      { id: 'kegiatan', title: 'V. Langkah-langkah Pembelajaran', required: true },
      { id: 'asesmen', title: 'VI. Asesmen & Rubrik Penilaian', required: true },
      { id: 'diferensiasi', title: 'VII. Diferensiasi, Pengayaan & Remedial', required: true },
      { id: 'refleksi', title: 'VIII. Refleksi Guru dan Siswa', required: true },
      { id: 'lampiran', title: 'IX. Lampiran (Materi, LKPD, Glosarium)', required: true },
      { id: 'tandatangan', title: 'X. Lembar Pengesahan', required: true },
    ],
  },
  {
    id: 'tpl-rpp-ringkas',
    nama: 'RPP Ringkas / 1 Halaman Berdiferensiasi',
    tipe: 'RPP_RINGKAS',
    deskripsi: 'Format ringkas yang memuat 3 komponen utama: Tujuan Pembelajaran, Langkah Kegiatan Pembelajaran, dan Asesmen.',
    isDefault: false,
    sections: [
      { id: 'identitas', title: 'Identitas Sekolah & Mata Pelajaran', required: true },
      { id: 'tujuan', title: 'Tujuan Pembelajaran', required: true },
      { id: 'kegiatan', title: 'Langkah Pembelajaran (Pendahuluan, Inti, Penutup)', required: true },
      { id: 'asesmen', title: 'Penilaian / Asesmen Pembelajaran', required: true },
      { id: 'tandatangan', title: 'Tanda Tangan Pengesahan', required: true },
    ],
  },
  {
    id: 'tpl-prota',
    nama: 'Program Tahunan (PROTA) Standar SD',
    tipe: 'PROTA',
    deskripsi: 'Format resmi Program Tahunan pemetaan TP per semester dan jam pelajaran (JP).',
    isDefault: true,
    sections: [
      { id: 'kop', title: 'Kop & Identitas Program Tahunan', required: true },
      { id: 'tabel', title: 'Tabel Distribusi TP & Alokasi Waktu', required: true },
      { id: 'pengesahan', title: 'Tanda Tangan Kepala Sekolah & Guru', required: true },
    ],
  },
  {
    id: 'tpl-promes',
    nama: 'Program Semester (PROMES) Mingguan',
    tipe: 'PROMES',
    deskripsi: 'Format matriks mingguan per bulan dengan alokasi minggu efektif.',
    isDefault: true,
    sections: [
      { id: 'kop', title: 'Identitas Program Semester', required: true },
      { id: 'matriks', title: 'Matriks Distribusi Minggu Efektif', required: true },
      { id: 'pengesahan', title: 'Tanda Tangan', required: true },
    ],
  },
  {
    id: 'tpl-atp',
    nama: 'Alur Tujuan Pembelajaran (ATP)',
    tipe: 'ATP',
    deskripsi: 'Peta urutan pembelajaran tujuan pembelajaran dari awal fase sampai akhir fase.',
    isDefault: true,
    sections: [
      { id: 'rasional', title: 'Rasional & Capaian Fase', required: true },
      { id: 'tabelAtp', title: 'Tabel Alur Pembelajaran', required: true },
      { id: 'pengesahan', title: 'Pengesahan', required: true },
    ],
  },
  {
    id: 'tpl-jurnal',
    nama: 'Jurnal Harian Mengajar Guru Kelas',
    tipe: 'JURNAL',
    deskripsi: 'Format pencatatan pelaksanaan KBM, kehadiran peserta didik, hasil, dan refleksi harian.',
    isDefault: true,
    sections: [
      { id: 'identitas', title: 'Hari, Tanggal & Identitas', required: true },
      { id: 'pelaksanaan', title: 'Uraian KBM & Hasil', required: true },
      { id: 'refleksi', title: 'Refleksi & Rencana Tindak Lanjut', required: true },
    ],
  },
];

// Sample Ready-to-Use Modul Ajar (IPAS Kelas 4 - Tumbuhan)
export const SAMPLE_MODUL_AJAR: ModulAjarData = {
  identitas: {
    namaPenyusun: 'Husein A. Priyanto',
    institusi: 'SDN Kasepuhan 04 Batang',
    tahunPelajaran: '2026/2027',
    jenjangSekolah: 'Sekolah Dasar (SD)',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    faseKelas: 'Fase B / Kelas 4',
    elemen: 'Pemahaman IPAS (Sains)',
    alokasiWaktu: '4 x 35 Menit (2 Pertemuan)',
    jumlahPertemuan: 2,
  },
  kompetensiAwal: [
    'Peserta didik mengenal aneka tumbuhan di lingkungan sekitar sekolah dan rumah.',
    'Peserta didik mengetahui bahwa tumbuhan memerlukan air dan sinar matahari untuk hidup.',
  ],
  profilPelajarPancasila: [
    'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia (menjaga alam)',
    'Bernalar Kritis (menganalisis fungsi organ tanaman)',
    'Gotong Royong (bekerja sama dalam kelompok pengamatan daun dan akar)',
    'Kreatif (membuat bagan bagian tumbuhan dengan media alam)',
  ],
  saranaPrasarana: {
    media: ['Spesimen tumbuhan asli di taman sekolah', 'Video animasi fotosintesis', 'Kartu bagian tumbuhan'],
    alatDanBahan: ['Lup/kaca pembesar', 'Gunting', 'Kertas karton', 'Pewarna/spidol'],
    sumberBelajar: ['Buku Siswa IPAS Kelas 4 Kemendikbudristek', 'Lingkungan sekitar SDN Kasepuhan 04 Batang'],
  },
  targetPesertaDidik: 'Peserta didik reguler/tipikal (28 siswa), inklusif dengan diferensiasi proses bagi siswa kinestetik & visual.',
  modelPembelajaran: 'Problem Based Learning (PBL) dan Inquiry Terbimbing',
  metodePembelajaran: ['Observasi lapangan', 'Diskusi kelompok', 'Eksperimen sederhana kapilaritas', 'Tanya jawab interaktif'],
  komponenInti: {
    tujuanPembelajaran: [
      'Peserta didik mampu mengidentifikasi bagian-bagian tubuh tumbuhan (akar, batang, daun, bunga, biji) dengan tepat melalui pengamatan langsung.',
      'Peserta didik mampu menjelaskan fungsi masing-masing bagian tubuh tumbuhan bagi kelangsungan hidupnya secara runtut.',
      'Peserta didik mampu mengaitkan fungsi daun dengan proses fotosintesis penghasil oksigen dan energi bagi bumi.',
    ],
    pemahamanBermakna: [
      'Tumbuhan memiliki organ tubuh mirip manusia dengan peran khusus untuk bertahan hidup.',
      'Tanpa tumbuhan yang menghasilkan oksigen dan makanan melalui fotosintesis, kehidupan di bumi tidak akan bertahan.',
    ],
    pertanyaanPemantik: [
      'Mengapa daun tumbuhan sebagian besar berwarna hijau?',
      'Bagaimana air dari dalam tanah bisa naik sampai ke pucuk pohon yang tinggi?',
      'Apa yang akan terjadi jika seluruh tumbuhan di lingkungan sekolah kita layu dan mati?',
    ],
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        pendahuluan: [
          'Guru membuka pembelajaran dengan salam hangat, doa bersama, dan mengecek kehadiran siswa.',
          'Apersepsi: Guru membawa tanaman hias kecil pot ke dalam kelas dan mengajak siswa menebak bagian-bagiannya.',
          'Guru menyampaikan tujuan pembelajaran pertemuan pertama dan kesepakatan belajar kelompok.',
        ],
        inti: [
          'Siswa dibagi menjadi 5 kelompok pengamat cilik (masing-masing 5-6 anak).',
          'Siswa bersama guru bergerak ke taman sekolah SDN Kasepuhan 04 untuk mengamati ragam akar, batang, dan daun.',
          'Setiap kelompok mengisi Lembar Kerja Pengamatan (LKPD) mencatat jenis akar (serabut/tunggang) dan bentuk tulang daun (menyirip/menjari/sejajar).',
          'Diferensiasi proses: Kelompok visual menggambar organ tumbuhan, kelompok kinestetik menyentuh tekstur dan mencocokkan kartu klasifikasi.',
          'Perwakilan kelompok mempresentasikan hasil temuannya di depan kelas dengan bimbingan guru.',
        ],
        penutup: [
          'Guru memfasilitasi rangkuman bersama: perbedaan akar tunggang & serabut serta fungsi batang mengalirkan nutrisi.',
          'Siswa menuliskan satu hal baru yang dipelajari pada sticky note.',
          'Guru menyampaikan rencana pertemuan berikutnya tentang keajaiban fotosintesis dan menutup dengan doa.',
        ],
      },
      {
        pertemuanKe: 2,
        pendahuluan: [
          'Guru membuka kelas, presensi, dan memancing ingatan siswa tentang hasil penjelajahan tumbuhan di taman sekolah.',
          'Pertanyaan pemantik: "Dari mana tanaman mendapatkan makanan jika tidak punya mulut seperti kita?"',
          'Penyampaian tujuan kegiatan: memahami resep dapur ajaib tumbuhan (fotosintesis).',
        ],
        inti: [
          'Menonton demonstrasi sederhana: daun yang ditutup plastik di tempat panas menghasilkan titik uap air dan gelembung saat direndam.',
          'Diskusi konsep 4 bahan fotosintesis: air (H2O), karbon dioksida (CO2), klorofil, dan cahaya matahari.',
          'Peserta didik menyusun puzzle "Dapur Daun" secara kooperatif.',
          'Diferensiasi produk: Siswa boleh memilih menyajikan alur fotosintesis berupa bagan infografis, cerita bergambar, atau simulasi gerak.',
        ],
        penutup: [
          'Apresiasi seluruh karya kelompok.',
          'Kuis formatif singkat 5 soal seru berbasis papan kuis kelas.',
          'Refleksi bersama tentang rasa syukur atas ciptaan Tuhan dan komitmen merawat tanaman kelas.',
        ],
      },
    ],
    asesmen: {
      diagnostik: 'Tanya jawab awal kesiapan belajar tentang tanaman di sekitar rumah.',
      formatif: 'Penilaian unjuk kerja saat observasi taman, keaktifan diskusi kelompok, dan pengisian LKPD.',
      sumatif: 'Tes tertulis pilihan ganda & uraian singkat mengenai fungsi organ dan fotosintesis (di akhir bab).',
      rubrik: 'Rubrik penilaian 4 skala (Sangat Mahir, Mahir, Mulai Berkembang, Perlu Bimbingan) meliputi ketepatan identifikasi organ, penalaran fungsi, dan kerja sama.',
    },
    diferensiasi: {
      konten: 'Tersedia gambar berwarna, spesimen tumbuhan asli, dan kartu istilah bergambar.',
      proses: 'Pendampingan berjenjang (scaffolding) untuk siswa yang masih kesulitan membedakan jenis akar.',
      produk: 'Siswa dapat memilih bentuk laporan: mind map bergambar, tabel rangkuman, atau rekaman audio pendek.',
    },
    remedialDanPengayaan: {
      remedial: 'Bimbingan ulang khusus bagi siswa dengan nilai < 70 tentang fungsi utama akar dan daun melalui kartu jodoh.',
      pengayaan: 'Tantangan meneliti fenomena kapilaritas batang seledri yang direndam air pewarna makanan.',
    },
    refleksi: {
      guru: [
        'Apakah seluruh siswa aktif terlibat dalam pengamatan di taman sekolah?',
        'Strategi apa yang paling berhasil membuat siswa memahami alur fotosintesis?',
        'Adakah siswa yang memerlukan pendampingan ekstra pada pertemuan berikutnya?',
      ],
      pesertaDidik: [
        'Bagian materi mana yang paling seru saat kamu pelajari hari ini?',
        'Apakah kamu sudah bisa membedakan akar serabut dan akar tunggang?',
        'Apa yang akan kamu lakukan untuk merawat tanaman di rumah dan sekolahmu?',
      ],
    },
  },
  lampiran: {
    ringkasanMateri: 'Tumbuhan adalah produsen utama di bumi. Bagian utama meliputi: Akar (penyerap air/mineral & penopang), Batang (penyalur makanan & penegak), Daun (tempat fotosintesis dengan zat hijau daun klorofil), Bunga (alat perkembangbiakan generatif), Buah & Biji (penyimpan cadangan makanan dan bakal generasi baru).',
    lembarKerja: 'LKPD Siswa: Ayo Menjadi Detektif Tumbuhan SDN Kasepuhan 04 Batang! Amati 2 tanaman berbeda, gambar bentuk daunnya, dan tentukan jenis akarnya.',
    glosarium: 'Fotosintesis: Proses pembuatan makanan oleh tumbuhan hijau dengan bantuan cahaya matahari. Klorofil: Zat hijau daun penyerap energi cahaya. Stomata: Mulut daun tempat pertukaran gas O2 dan CO2.',
    daftarPustaka: 'Fitri, Amalia, dkk. (2021). Buku Panduan Guru Ilmu Pengetahuan Alam dan Sosial untuk SD Kelas IV. Jakarta: Pusat Perbukuan Balitbang Kemendikbudristek.',
  },
};

export const SAMPLE_PJOK_MODUL_AJAR: ModulAjarData = {
  identitas: {
    namaPenyusun: 'Husein A. Priyanto',
    institusi: 'SDN Kasepuhan 04 Batang',
    tahunPelajaran: '2026/2027',
    jenjangSekolah: 'Sekolah Dasar (SD)',
    mataPelajaran: 'PJOK',
    faseKelas: 'Fase B / Kelas 4',
    elemen: 'Keterampilan Gerak & Pengembangan Karakter',
    alokasiWaktu: '3 x 35 Menit (1 Pertemuan)',
    jumlahPertemuan: 1,
  },
  kompetensiAwal: [
    'Peserta didik telah mampu melakukan gerak dasar berlari dan menendang bola secara bebas.',
    'Peserta didik memahami pentingnya pemanasan sebelum beraktivitas fisik di lapangan terbuka.',
  ],
  profilPelajarPancasila: [
    'Mandiri (bertanggung jawab terhadap keselamatan diri dan peralatan olahraga)',
    'Gotong Royong (bekerja sama dan berbagi peran dalam permainan bola beregu)',
    'Bernalar Kritis (menyesuaikan kekuatan ayunan dan arah tendangan ke sasaran)',
  ],
  saranaPrasarana: {
    media: ['Lapangan olahraga SDN Kasepuhan 04 Batang', 'Gambar panduan perkenaan kaki bagian dalam pada bola'],
    alatDanBahan: ['Bola sepak / bola spons ukuran 4', 'Cone / kerucut pembatas', 'Peluit', 'Stopwatch', 'Rompi tim'],
    sumberBelajar: ['Buku Panduan Guru PJOK Kelas 4 Kemendikbudristek 2024', 'Video variasi gerak manipulatif'],
  },
  targetPesertaDidik: 'Peserta didik reguler Fase B Kelas 4 (28 siswa), adaptif untuk seluruh tingkat kebugaran jasmani.',
  modelPembelajaran: 'Direct Instruction & Cooperative Learning berbasis permainan (Game-based Learning)',
  metodePembelajaran: ['Demonstrasi teknik', 'Latihan berpasangan', 'Game sirkuit keterampilan', 'Refleksi gerak'],
  komponenInti: {
    tujuanPembelajaran: [
      'Peserta didik mampu mempraktikkan variasi pola gerak dasar lokomotor (berlari, melangkah) dan manipulatif (menendang serta menghentikan bola dengan kaki bagian dalam) secara terkoordinasi dan aman.',
      'Peserta didik mampu menunjukkan perilaku sportif, saling menghargai teman, dan mematuhi aturan permainan di lapangan.',
    ],
    pemahamanBermakna: [
      'Kombinasi gerak kaki yang tepat dan koordinasi mata-kaki menghasilkan operan bola yang akurat dan mencegah cidera.',
      'Aktivitas fisik PJOK yang teratur meningkatkan kebugaran jasmani, kesehatan jantung, dan melatih kerja sama tim.',
    ],
    pertanyaanPemantik: [
      'Bagian kaki mana yang paling tepat digunakan untuk mengoper bola agar meluncur lurus ke arah temanmu?',
      'Mengapa sebelum berolahraga sepak bola kita harus melakukan pemanasan dinamis terlebih dahulu?',
    ],
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        pendahuluan: [
          'Guru berbaris rapi di lapangan, memimpin doa, presensi, dan memeriksa kelengkapan seragam olahraga siswa.',
          'Apersepsi: Mengaitkan materi gerak sepak bola dengan kesehatan tubuh dan pertandingan olahraga tim.',
          'Pemanasan dinamis terpimpin berbentuk permainan kelincahan "Kucing dan Bola" (5-7 menit).',
          'Guru menyampaikan tujuan pembelajaran dan aturan keselamatan di lapangan.',
        ],
        inti: [
          'Guru mendemonstrasikan sikap awalan, perkenaan kaki bagian dalam pada titik tengah bola, dan follow-through.',
          'Aktivitas 1: Latihan berpasangan passing-stopping jarak 3 meter (10 kali ulangan bergantian).',
          'Aktivitas 2: Dribbling zig-zag melewati deretan cone dilanjutkan tendangan terarah ke gawang kecil.',
          'Diferensiasi proses: Siswa yang mahir diberi jarak lebih jauh (5-7 meter); siswa pemula menggunakan bola bertekanan rendah.',
          'Permainan mini 5 lawan 5 menekankan sportivitas, operan cepat, dan rotasi peran.',
        ],
        penutup: [
          'Pendinginan (cooling down) relaksasi otot tungkai dan pernapasan.',
          'Refleksi gerak bersama: kendala yang dihadapi saat menghentikan bola yang bergulir kencang.',
          'Pemberian apresiasi atas sportivitas dan pembiasaan minum air putih cukup.',
          'Doa penutup dan pengembalian alat olahraga ke ruang sarana sekolah secara tertib.',
        ],
      },
    ],
    asesmen: {
      diagnostik: 'Observasi kesiapan fisik dan pemanasan mandiri sebelum KBM dimulai.',
      formatif: 'Penilaian unjuk kerja (rubrik lembar observasi) ketepatan passing dan stopping bola kaki bagian dalam.',
      sumatif: 'Uji keterampilan gerak kombinasi dribble-passing dan pemahaman aturan keselamatan bermain bola besar.',
      rubrik: 'Rubrik 4 skala (4: Sangat Terampil - ayunan mulus & tepat sasaran; 3: Terampil; 2: Cukup; 1: Butuh Bimbingan).',
    },
    diferensiasi: {
      konten: 'Tersedia cone warna-warni penanda arah dan bola berbagai ukuran (bola nomor 4 dan bola karet busa).',
      proses: 'Pengelompokan heterogen tutor sebaya agar siswa yang mahir mendampingi teman yang masih canggung.',
      produk: 'Siswa unjuk kemampuan dalam permainan mini atau demonstrasi berpasangan sesuai tingkat kepercayaan diri.',
    },
    remedialDanPengayaan: {
      remedial: 'Latihan mandiri perlahan menendang bola diam ke dinding pembatas dengan pengawasan guru.',
      pengayaan: 'Tantangan passing sambil bergerak menyamping (passing on the run) dan akurasi ke target lingkaran kecil.',
    },
    refleksi: {
      guru: [
        'Apakah seluruh siswa berpartisipasi aktif dan merasa senang saat sesi permainan mini?',
        'Berapa persentase siswa yang telah menguasai follow-through kaki bagian dalam?',
        'Bagaimana efektivitas manajemen waktu pemanasan hingga pendinginan?',
      ],
      pesertaDidik: [
        'Gerakan mana yang menurutmu paling mudah dan mana yang paling menantang hari ini?',
        'Bagaimana perasaanmu saat berhasil mengoper bola tepat ke teman satu tim?',
        'Apakah kamu sudah menerapkan sikap jujur dan sportif selama permainan?',
      ],
    },
  },
  lampiran: {
    ringkasanMateri: 'Pola gerak dasar sepak bola meliputi: 1) Passing (mengoper): menggunakan kaki bagian dalam untuk operan datar akurat; 2) Stopping (menghentikan bola): telapak kaki atau kaki bagian dalam meredam laju bola; 3) Dribbling (menggiring): mendorong bola perlahan sambil berlari.',
    lembarKerja: 'Lembar Observasi PJOK Kelas 4: Ceklis Keterampilan Gerak Menendang & Menghentikan Bola SDN Kasepuhan 04 Batang.',
    glosarium: 'Lokomotor: Gerak berpindah tempat. Manipulatif: Gerak yang melibatkan penguasaan objek/alat (seperti bola). Follow-through: Gerak lanjutan kaki setelah menyentuh bola.',
    daftarPustaka: 'Muhajir. (2021). Buku Panduan Guru Pendidikan Jasmani, Olahraga, dan Kesehatan untuk SD Kelas IV. Jakarta: Puskurbuk Kemendikbudristek.',
  },
};

// Initial Documents
export const INITIAL_DOCUMENTS: CurriculumDoc[] = [
  {
    id: 'doc-modul-pjok-4-1',
    title: 'Modul Ajar PJOK Kelas 4 — Variasi Pola Gerak Dasar Permainan Bola Besar',
    type: 'MODUL_AJAR',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'PJOK',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: SAMPLE_PJOK_MODUL_AJAR,
  },
  {
    id: 'doc-prota-pjok-4',
    title: 'Program Tahunan (PROTA) PJOK Kelas 4',
    type: 'PROTA',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'PJOK',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil & Genap',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      rows: [
        { id: '1', no: 1, semester: '1', tujuanPembelajaran: 'Mempraktikkan variasi pola gerak dasar lokomotor dan manipulatif permainan bola besar (sepak bola)', materiPembelajaran: 'Permainan Bola Besar (Sepak Bola)', alokasiWaktu: 12, keterangan: 'Bab 1' },
        { id: '2', no: 2, semester: '1', tujuanPembelajaran: 'Mempraktikkan variasi pola gerak dasar manipulatif melempar & menangkap bola kecil (kasti)', materiPembelajaran: 'Permainan Bola Kecil (Kasti)', alokasiWaktu: 12, keterangan: 'Bab 2' },
        { id: '3', no: 3, semester: '1', tujuanPembelajaran: 'Mempraktikkan kombinasi gerak dasar atletik: lari cepat, lompat jauh tanpa awalan, dan lempar turbo', materiPembelajaran: 'Dasar-Dasar Atletik Anak', alokasiWaktu: 12, keterangan: 'Bab 3' },
        { id: '4', no: 4, semester: '1', tujuanPembelajaran: 'Mempraktikkan pola gerak langkah dan tangkisan dasar bela diri tradisional pencak silat', materiPembelajaran: 'Seni Bela Diri Pencak Silat', alokasiWaktu: 12, keterangan: 'Bab 4' },
        { id: '5', no: 5, semester: '2', tujuanPembelajaran: 'Mempraktikkan latihan kebugaran jasmani: daya tahan, kelenturan, dan kekuatan otot tungkai', materiPembelajaran: 'Aktivitas Kebugaran Jasmani', alokasiWaktu: 12, keterangan: 'Bab 5' },
        { id: '6', no: 6, semester: '2', tujuanPembelajaran: 'Mempraktikkan pola gerak dominan senam lantai: guling depan dengan awalan jongkok secara aman', materiPembelajaran: 'Senam Lantai Perkakas & Matras', alokasiWaktu: 12, keterangan: 'Bab 6' },
        { id: '7', no: 7, semester: '2', tujuanPembelajaran: 'Mempraktikkan gerak berirama (senam SKJ / senam profil pelajar pancasila) secara kompak', materiPembelajaran: 'Aktivitas Gerak Berirama', alokasiWaktu: 12, keterangan: 'Bab 7' },
        { id: '8', no: 8, semester: '2', tujuanPembelajaran: 'Menerapkan pola hidup bersih dan sehat (PHBS) serta pencegahan cedera ringan dalam berolahraga', materiPembelajaran: 'Kesehatan Pribadi & Lingkungan', alokasiWaktu: 8, keterangan: 'Bab 8' },
      ],
      totalJP: 92,
    },
  },
  {
    id: 'doc-promes-pjok-4-1',
    title: 'Program Semester (PROMES) PJOK Kelas 4 Semester 1',
    type: 'PROMES',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'PJOK',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      bulanList: ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      mingguPerBulan: 4,
      rows: [
        { id: '1', no: 1, tujuanPembelajaran: 'Mempraktikkan variasi gerak manipulatif menendang dan menghentikan bola sepak bola', materi: 'Sepak Bola (Passing & Stopping)', alokasiWaktu: 12, distribusiMinggu: { 'Juli_W3': true, 'Juli_W4': true, 'Agustus_W1': true, 'Agustus_W2': true }, keterangan: 'Pertemuan 1-4' },
        { id: '2', no: 2, tujuanPembelajaran: 'Mempraktikkan variasi lempar tangkap bola kasti beregu', materi: 'Permainan Kasti', alokasiWaktu: 12, distribusiMinggu: { 'Agustus_W3': true, 'Agustus_W4': true, 'September_W1': true, 'September_W2': true }, keterangan: 'Pertemuan 5-8' },
        { id: '3', no: 3, tujuanPembelajaran: 'Mempraktikkan gerak dasar atletik lari cepat dan lompat katak', materi: 'Dasar-Dasar Atletik', alokasiWaktu: 12, distribusiMinggu: { 'September_W3': true, 'September_W4': true, 'Oktober_W1': true, 'Oktober_W2': true }, keterangan: 'Pertemuan 9-12' },
        { id: '4', no: 4, tujuanPembelajaran: 'Mempraktikkan langkah kuda-kuda dan pukulan lurus pencak silat', materi: 'Pencak Silat Tradisional', alokasiWaktu: 12, distribusiMinggu: { 'Oktober_W3': true, 'Oktober_W4': true, 'November_W1': true, 'November_W2': true }, keterangan: 'Pertemuan 13-16' },
      ],
    },
  },
  {
    id: 'doc-atp-pjok-4',
    title: 'Alur Tujuan Pembelajaran (ATP) PJOK Fase B Kelas 4',
    type: 'ATP',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'PJOK',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil & Genap',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      rows: [
        { id: '1', no: 1, kodeTP: 'TP 4.1', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan variasi gerak dasar lokomotor dan manipulatif permainan sepak bola.', materi: 'Pola Gerak Sepak Bola', urutan: 1, alokasiWaktu: '12 JP', catatan: 'Praktik Lapangan Terbuka' },
        { id: '2', no: 2, kodeTP: 'TP 4.2', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan variasi gerak manipulatif melempar dan menangkap bola kasti beregu.', materi: 'Permainan Kasti Beregu', urutan: 2, alokasiWaktu: '12 JP', catatan: 'Penguatan Sportivitas' },
        { id: '3', no: 3, kodeTP: 'TP 4.3', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan kombinasi gerak lari sprint 40 meter dan lompat jauh tanpa awalan.', materi: 'Kids Athletics', urutan: 3, alokasiWaktu: '12 JP', catatan: 'Pengukuran Waktu Stopwatch' },
        { id: '4', no: 4, kodeTP: 'TP 4.4', cpTerkait: 'Keterampilan Gerak', deskripsiTP: 'Mempraktikkan variasi pola gerak dasar langkah kuda-kuda dan tangkisan silat.', materi: 'Kuda-kuda & Tangkisan Silat', urutan: 4, alokasiWaktu: '12 JP', catatan: 'Disiplin & Etika Berlatih' },
      ],
    },
  },
  {
    id: 'doc-jurnal-pjok-4-1',
    title: 'Jurnal Harian Mengajar Guru PJOK Kelas 4 SDN Kasepuhan 04',
    type: 'JURNAL',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'PJOK',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'reviewed',
    content: {
      items: [
        {
          id: 'jrn-pjok-1',
          tanggal: '2026-07-28',
          namaGuru: 'Husein A. Priyanto',
          kelas: 'Kelas 4',
          mataPelajaran: 'PJOK',
          jamPelajaran: 'Jam ke-1 s.d 3 (07.00 - 08.45)',
          materi: 'Variasi Pola Gerak Dasar Menendang dan Menghentikan Bola',
          tujuanPembelajaran: 'Peserta didik mempraktikkan teknik passing dan stopping bola kaki bagian dalam secara berpasangan dengan sportif.',
          kegiatanPembelajaran: 'Baris berbaris dan doa, pemanasan dinamis permainan kucing bola, latihan berpasangan jarak 3m, game mini 5 vs 5, dan pendinginan terarah.',
          jumlahHadir: 28,
          jumlahTidakHadir: 0,
          daftarSiswaAbsen: 'Nihil (Hadir semua)',
          hasilPembelajaran: 'Seluruh 28 siswa antusias mengikuti KBM; 25 siswa menguasai teknik passing kaki bagian dalam dengan mulus.',
          refleksi: 'Antusiasme siswa sangat tinggi saat bermain di lapangan terbuka, persiapan cone dan bola berjalan efektif.',
          tindakLanjut: 'Memberi latihan khusus akurasi tendangan berpasangan pada 3 siswa yang masih ragu mengayunkan kaki.',
        },
      ],
    },
  },
  {
    id: 'doc-lkpd-pjok-4-1',
    title: 'LKPD & Asesmen Keterampilan PJOK Kelas 4 — Keterampilan Bola Besar',
    type: 'LKPD',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'PJOK',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      petunjuk: '1. Berdoalah sebelum beraktivitas di lapangan.\n2. Kenakan seragam olahraga lengkap dan sepatu yang nyaman.\n3. Lakukan pemanasan bersama guru dan teman.\n4. Praktikkan tugas gerak dengan sportif dan saling menjaga keselamatan.',
      soalList: [
        {
          id: 'q1',
          nomor: 1,
          tipe: 'Pilihan Ganda',
          pertanyaan: 'Saat melakukan operan bola datar mendatar kepada teman satu tim, bagian kaki yang paling efektif dan tepat digunakan adalah ...',
          opsi: ['A. Ujung jari kaki', 'B. Kaki bagian dalam', 'C. Tumit kaki', 'D. Punggung telapak kaki luar'],
          kunciJawaban: 'B. Kaki bagian dalam',
        },
        {
          id: 'q2',
          nomor: 2,
          tipe: 'Pilihan Ganda',
          pertanyaan: 'Tujuan utama melakukan pemanasan (warming-up) sebelum berolahraga di lapangan adalah ...',
          opsi: ['A. Menghabiskan waktu jam pelajaran', 'B. Menyiapkan otot & jantung serta mencegah cedera', 'C. Agar tubuh cepat lelah', 'D. Menentukan pemenang pertandingan'],
          kunciJawaban: 'B. Menyiapkan otot & jantung serta mencegah cedera',
        },
        {
          id: 'q3',
          nomor: 3,
          tipe: 'Praktik Lapangan',
          pertanyaan: 'Lakukan passing bola kaki bagian dalam ke arah teman berjarak 3 meter sebanyak 10 kali berturut-turut dengan sikap badan seimbang.',
          kunciJawaban: 'Tercapai jika minimal 8 dari 10 operan tepat sasaran dan diterima baik oleh pasangan.',
        },
      ],
      rubrikPenilaian: [
        {
          kriteria: 'Sikap Kaki Tumpu & Ayunan Menendang',
          skor4: 'Kaki tumpu di samping bola, lutut ditekuk wajar, ayunan kaki dalam presisi.',
          skor3: 'Kaki tumpu tepat namun ayunan kaki terkadang kurang stabil.',
          skor2: 'Posisi kaki tumpu terlalu jauh dari bola sehingga tendangan melenceng.',
          skor1: 'Belum mampu memposisikan kaki tumpu dan sering menendang dengan ujung jari.',
        },
      ],
    },
  },
  {
    id: 'doc-modul-ipas-4-1',
    title: 'Modul Ajar IPAS Kelas 4 — Bagian Tumbuhan & Fotosintesis',
    type: 'MODUL_AJAR',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'IPAS',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: SAMPLE_MODUL_AJAR,
  },
  {
    id: 'doc-prota-ipas-4',
    title: 'Program Tahunan (PROTA) IPAS Kelas 4',
    type: 'PROTA',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'IPAS',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil & Genap',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      rows: [
        { id: '1', no: 1, semester: '1', tujuanPembelajaran: 'Mengidentifikasi bagian tubuh tumbuhan beserta fungsinya', materiPembelajaran: 'Bagian Tubuh Tumbuhan', alokasiWaktu: 10, keterangan: 'Bab 1' },
        { id: '2', no: 2, semester: '1', tujuanPembelajaran: 'Mendeskripsikan proses fotosintesis dan kaitannya dengan makhluk hidup', materiPembelajaran: 'Fotosintesis', alokasiWaktu: 12, keterangan: 'Bab 1' },
        { id: '3', no: 3, semester: '1', tujuanPembelajaran: 'Mengidentifikasi wujud zat (padat, cair, gas) serta perubahannya', materiPembelajaran: 'Wujud Zat dan Perubahannya', alokasiWaktu: 14, keterangan: 'Bab 2' },
        { id: '4', no: 4, semester: '1', tujuanPembelajaran: 'Mengidentifikasi ragam gaya di sekitar (gaya otot, gesek, magnet, gravitasi)', materiPembelajaran: 'Gaya di Sekitar Kita', alokasiWaktu: 14, keterangan: 'Bab 3' },
        { id: '5', no: 5, semester: '1', tujuanPembelajaran: 'Menyelidiki transformasi energi dalam kehidupan sehari-hari', materiPembelajaran: 'Mengubah Bentuk Energi', alokasiWaktu: 14, keterangan: 'Bab 4' },
        { id: '6', no: 6, semester: '2', tujuanPembelajaran: 'Menceritakan sejarah daerah tempat tinggal dan kearifan lokal', materiPembelajaran: 'Cerita Tentang Daerahku', alokasiWaktu: 14, keterangan: 'Bab 5' },
        { id: '7', no: 7, semester: '2', tujuanPembelajaran: 'Mengidentifikasi keragaman budaya, kearifan lokal, dan interaksi sosial', materiPembelajaran: 'Indonesiaku Kaya Budaya', alokasiWaktu: 16, keterangan: 'Bab 6' },
        { id: '8', no: 8, semester: '2', tujuanPembelajaran: 'Mengenal kebutuhan manusia, nilai uang, dan aktivitas jual beli', materiPembelajaran: 'Bagaimana Mendapatkan Kebutuhan?', alokasiWaktu: 14, keterangan: 'Bab 7' },
      ],
      totalJP: 108,
    },
  },
  {
    id: 'doc-promes-ipas-4-1',
    title: 'Program Semester (PROMES) IPAS Kelas 4 Semester 1',
    type: 'PROMES',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'IPAS',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      bulanList: ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      mingguPerBulan: 4,
      rows: [
        { id: '1', no: 1, tujuanPembelajaran: 'Mengidentifikasi bagian tubuh tumbuhan beserta fungsinya', materi: 'Bagian Tubuh Tumbuhan', alokasiWaktu: 10, distribusiMinggu: { 'Juli_W3': true, 'Juli_W4': true, 'Agustus_W1': true }, keterangan: 'TM 1-3' },
        { id: '2', no: 2, tujuanPembelajaran: 'Mendeskripsikan proses fotosintesis pada tumbuhan', materi: 'Fotosintesis Tumbuhan', alokasiWaktu: 12, distribusiMinggu: { 'Agustus_W2': true, 'Agustus_W3': true, 'Agustus_W4': true }, keterangan: 'TM 4-6' },
        { id: '3', no: 3, tujuanPembelajaran: 'Mengidentifikasi wujud zat dan perubahannya', materi: 'Wujud Zat & Sifatnya', alokasiWaktu: 14, distribusiMinggu: { 'September_W1': true, 'September_W2': true, 'September_W3': true, 'September_W4': true }, keterangan: 'TM 7-10' },
        { id: '4', no: 4, tujuanPembelajaran: 'Mengidentifikasi ragam gaya dan pengaruhnya terhadap benda', materi: 'Gaya di Sekitar Kita', alokasiWaktu: 14, distribusiMinggu: { 'Oktober_W1': true, 'Oktober_W2': true, 'Oktober_W3': true, 'Oktober_W4': true }, keterangan: 'TM 11-14' },
        { id: '5', no: 5, tujuanPembelajaran: 'Menyelidiki transformasi energi listrik, gerak, panas', materi: 'Transformasi Energi', alokasiWaktu: 14, distribusiMinggu: { 'November_W1': true, 'November_W2': true, 'November_W3': true, 'November_W4': true }, keterangan: 'TM 15-18' },
      ],
    },
  },
  {
    id: 'doc-atp-ipas-4',
    title: 'Alur Tujuan Pembelajaran (ATP) IPAS Fase B Kelas 4',
    type: 'ATP',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'IPAS',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil & Genap',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      rows: [
        { id: '1', no: 1, kodeTP: 'TP 4.1', cpTerkait: 'Pemahaman IPAS', deskripsiTP: 'Mengidentifikasi bagian-bagian tubuh tumbuhan serta fungsinya.', materi: 'Tumbuhan Sumber Kehidupan', urutan: 1, alokasiWaktu: '10 JP', catatan: 'Pembelajaran Kontekstual di Taman' },
        { id: '2', no: 2, kodeTP: 'TP 4.2', cpTerkait: 'Pemahaman IPAS', deskripsiTP: 'Mendeskripsikan proses fotosintesis dan peran klorofil serta sinar matahari.', materi: 'Fotosintesis Tumbuhan', urutan: 2, alokasiWaktu: '12 JP', catatan: 'Eksperimen Sederhana' },
        { id: '3', no: 3, kodeTP: 'TP 4.3', cpTerkait: 'Pemahaman IPAS', deskripsiTP: 'Menganalisis perkembangbiakan vegetatif dan generatif tumbuhan.', materi: 'Perkembangbiakan Tumbuhan', urutan: 3, alokasiWaktu: '10 JP', catatan: 'Praktik Menanam' },
        { id: '4', no: 4, kodeTP: 'TP 4.4', cpTerkait: 'Pemahaman IPAS', deskripsiTP: 'Mengidentifikasi wujud zat padat, cair, dan gas beserta karakteristiknya.', materi: 'Wujud Zat dan Perubahannya', urutan: 4, alokasiWaktu: '14 JP', catatan: 'Demonstrasi Lilin & Es' },
      ],
    },
  },
  {
    id: 'doc-jurnal-4-1',
    title: 'Jurnal Harian Pembelajaran Kelas 4 SDN Kasepuhan 04',
    type: 'JURNAL',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'IPAS',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'reviewed',
    content: {
      items: [
        {
          id: 'jrn-1',
          tanggal: '2026-07-28',
          namaGuru: 'Husein A. Priyanto',
          kelas: 'Kelas 4',
          mataPelajaran: 'IPAS',
          jamPelajaran: 'Jam ke-1 s.d 4 (07.00 - 09.20)',
          materi: 'Bagian Tubuh Tumbuhan dan Fungsinya',
          tujuanPembelajaran: 'Peserta didik mengamati dan membedakan jenis akar serta tulang daun tumbuhan di taman.',
          kegiatanPembelajaran: 'Observasi lapangan di kebun SDN Kasepuhan 04, identifikasi 5 jenis daun, dan pengerjaan LKPD kelompok.',
          jumlahHadir: 27,
          jumlahTidakHadir: 1,
          daftarSiswaAbsen: 'Dimas (Sakit demam)',
          hasilPembelajaran: '90% siswa tuntas mengidentifikasi jenis akar dan tulang daun dengan tepat.',
          refleksi: 'Pembelajaran di luar kelas sangat memotivasi siswa, namun pengelolaan waktu perlu lebih diperketat.',
          tindakLanjut: 'Memberi penguatan pada siswa yang masih tertukar antara daun sejajar dan menyirip.',
        },
      ],
    },
  },
  {
    id: 'doc-lkpd-ipas-4-1',
    title: 'LKPD & Asesmen IPAS Kelas 4 — Detektif Tumbuhan',
    type: 'LKPD',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'IPAS',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    updatedAt: new Date().toISOString(),
    status: 'final',
    content: {
      judul: 'Lembar Kerja Peserta Didik (LKPD): Menjelajah Bagian Tumbuhan',
      mataPelajaran: 'IPAS',
      kelas: 'Kelas 4',
      fase: 'Fase B',
      semester: 'Ganjil',
      alokasiWaktu: '70 Menit',
      tujuanPembelajaran: 'Siswa dapat mengidentifikasi bagian utama tumbuhan dan fungsinya melalui pengamatan langsung.',
      petunjukBelajar: [
        'Berdoalah sebelum mengerjakan lembar kegiatan.',
        'Bekerjasamalah dengan anggota kelompokmu secara rukun dan tertib.',
        'Gunakan kaca pembesar untuk mengamati urat daun dan bulu akar dengan hati-hati.',
        'Tuliskan hasil pengamatanmu pada tabel yang telah disediakan.',
      ],
      ringkasanMateri: 'Tumbuhan tersusun atas akar, batang, daun, bunga, dan buah. Akar menyerap zat hara dari tanah, batang menyalurkan, dan daun tempat fotosintesis berlangsung.',
      langkahAktivitas: [
        'Ambillah 2 contoh daun yang gugur di taman sekolah.',
        'Amatilah bentuk susunan tulang daunnya dengan kaca pembesar.',
        'Diskusikan nama tanamannya dan apa fungsi bagian daun tersebut.',
      ],
      soalLatihan: [
        {
          id: 'q1',
          nomor: 1,
          tipe: 'Pilihan Ganda',
          pertanyaan: 'Bagian tumbuhan yang berfungsi menyerap air dan mineral dari dalam tanah adalah ...',
          opsi: ['A. Daun', 'B. Batang', 'C. Akar', 'D. Bunga'],
          kunciJawaban: 'C. Akar',
        },
        {
          id: 'q2',
          nomor: 2,
          tipe: 'Pilihan Ganda',
          pertanyaan: 'Zat hijau daun yang berfungsi menangkap energi cahaya matahari untuk fotosintesis dinamakan ...',
          opsi: ['A. Oksigen', 'B. Klorofil', 'C. Karbohidrat', 'D. Stomata'],
          kunciJawaban: 'B. Klorofil',
        },
        {
          id: 'q3',
          nomor: 3,
          tipe: 'Isian Singkat',
          pertanyaan: 'Sebutkan 3 macam bentuk tulang daun yang kamu temukan pada tanaman di sekitar sekolah!',
          kunciJawaban: 'Menyirip, menjari, melengkung/sejajar.',
        },
      ],
      rubrikPenilaian: [
        {
          kriteria: 'Ketelitian Pengamatan Organ',
          skor4: 'Mengamati 5 organ dengan sangat rinci dan deskripsi akurat.',
          skor3: 'Mengamati 4 organ dengan cukup jelas.',
          skor2: 'Mengamati 2-3 organ secara umum.',
          skor1: 'Hanya menyebutkan 1 organ tanpa deskripsi.',
        },
      ],
    },
  },
];

// Local Storage Keys
const KEY_SCHOOL = 'eduplan_school_profile';
const KEY_DOCS = 'eduplan_documents';
const KEY_CP = 'eduplan_cp_list';
const KEY_TP = 'eduplan_tp_list';
const KEY_TEMPLATES = 'eduplan_templates';
const KEY_USER = 'eduplan_user_account';
const KEY_GATE_UNLOCKED = 'eduplan_gate_unlocked';

export const storageService = {
  // Gate Status
  isGateUnlocked(): boolean {
    return sessionStorage.getItem(KEY_GATE_UNLOCKED) === 'true';
  },
  setGateUnlocked(unlocked: boolean) {
    if (unlocked) {
      sessionStorage.setItem(KEY_GATE_UNLOCKED, 'true');
    } else {
      sessionStorage.removeItem(KEY_GATE_UNLOCKED);
    }
  },

  // User Account
  getUserAccount(): UserAccount | null {
    const raw = localStorage.getItem(KEY_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  saveUserAccount(user: UserAccount) {
    localStorage.setItem(KEY_USER, JSON.stringify(user));
  },
  logoutUser() {
    localStorage.removeItem(KEY_USER);
    sessionStorage.removeItem(KEY_GATE_UNLOCKED);
  },

  // School Profile
  getSchoolProfile(): SchoolProfile {
    const raw = localStorage.getItem(KEY_SCHOOL);
    if (!raw) {
      localStorage.setItem(KEY_SCHOOL, JSON.stringify(DEFAULT_SCHOOL_PROFILE));
      return DEFAULT_SCHOOL_PROFILE;
    }
    try {
      const parsed = JSON.parse(raw);
      // If holding previous hardcoded sample identity, reset to empty default
      if (parsed.namaGuru === 'Husein A. Priyanto' && (parsed.namaSekolah === 'SDN Kasepuhan 04 Batang' || parsed.jabatanGuru === 'Guru PJOK')) {
        localStorage.setItem(KEY_SCHOOL, JSON.stringify(DEFAULT_SCHOOL_PROFILE));
        return DEFAULT_SCHOOL_PROFILE;
      }
      return { ...DEFAULT_SCHOOL_PROFILE, ...parsed };
    } catch {
      return DEFAULT_SCHOOL_PROFILE;
    }
  },
  saveSchoolProfile(profile: SchoolProfile) {
    localStorage.setItem(KEY_SCHOOL, JSON.stringify(profile));
  },

  // Documents
  getDocuments(): CurriculumDoc[] {
    const raw = localStorage.getItem(KEY_DOCS);
    if (!raw) {
      localStorage.setItem(KEY_DOCS, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    try {
      const docs: CurriculumDoc[] = JSON.parse(raw);
      const hasPJOK = docs.some((d) => d.mataPelajaran === 'PJOK');
      if (!hasPJOK) {
        const pjokDocs = INITIAL_DOCUMENTS.filter((d) => d.mataPelajaran === 'PJOK');
        const merged = [...pjokDocs, ...docs];
        localStorage.setItem(KEY_DOCS, JSON.stringify(merged));
        return merged;
      }
      return docs;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },
  saveDocument(doc: CurriculumDoc) {
    const docs = this.getDocuments();
    const existingIndex = docs.findIndex((d) => d.id === doc.id);
    if (existingIndex >= 0) {
      docs[existingIndex] = { ...doc, updatedAt: new Date().toISOString() };
    } else {
      docs.unshift({ ...doc, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(KEY_DOCS, JSON.stringify(docs));
  },
  getDocumentById(id: string): CurriculumDoc | undefined {
    return this.getDocuments().find((d) => d.id === id);
  },
  deleteDocument(id: string) {
    const docs = this.getDocuments().filter((d) => d.id !== id);
    localStorage.setItem(KEY_DOCS, JSON.stringify(docs));
  },

  // CP & TP
  getCPAvailable(): CPItem[] {
    const raw = localStorage.getItem(KEY_CP);
    if (!raw) {
      localStorage.setItem(KEY_CP, JSON.stringify(DEFAULT_CP_LIST));
      return DEFAULT_CP_LIST;
    }
    try {
      const list: CPItem[] = JSON.parse(raw);
      const hasPJOK = list.some((c) => c.mataPelajaran === 'PJOK');
      if (!hasPJOK) {
        const pjokCPs = DEFAULT_CP_LIST.filter((c) => c.mataPelajaran === 'PJOK');
        const merged = [...pjokCPs, ...list];
        localStorage.setItem(KEY_CP, JSON.stringify(merged));
        return merged;
      }
      return list;
    } catch {
      return DEFAULT_CP_LIST;
    }
  },
  saveCP(cp: CPItem) {
    const list = this.getCPAvailable();
    const idx = list.findIndex((c) => c.id === cp.id);
    if (idx >= 0) list[idx] = cp;
    else list.push(cp);
    localStorage.setItem(KEY_CP, JSON.stringify(list));
  },
  deleteCP(id: string) {
    const list = this.getCPAvailable().filter((c) => c.id !== id);
    localStorage.setItem(KEY_CP, JSON.stringify(list));
  },

  getTPAvailable(): TPItem[] {
    const raw = localStorage.getItem(KEY_TP);
    if (!raw) {
      localStorage.setItem(KEY_TP, JSON.stringify(DEFAULT_TP_LIST));
      return DEFAULT_TP_LIST;
    }
    try {
      const list: TPItem[] = JSON.parse(raw);
      const hasPJOK = list.some((t) => t.cpId === 'cp-pjok-4-1');
      if (!hasPJOK) {
        const pjokTPs = DEFAULT_TP_LIST.filter((t) => t.cpId === 'cp-pjok-4-1');
        const merged = [...pjokTPs, ...list];
        localStorage.setItem(KEY_TP, JSON.stringify(merged));
        return merged;
      }
      return list;
    } catch {
      return DEFAULT_TP_LIST;
    }
  },
  saveTP(tp: TPItem) {
    const list = this.getTPAvailable();
    const idx = list.findIndex((t) => t.id === tp.id);
    if (idx >= 0) list[idx] = tp;
    else list.push(tp);
    localStorage.setItem(KEY_TP, JSON.stringify(list));
  },
  deleteTP(id: string) {
    const list = this.getTPAvailable().filter((t) => t.id !== id);
    localStorage.setItem(KEY_TP, JSON.stringify(list));
  },

  // Templates
  getTemplates(): DocumentTemplate[] {
    const raw = localStorage.getItem(KEY_TEMPLATES);
    if (!raw) {
      localStorage.setItem(KEY_TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
      return DEFAULT_TEMPLATES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TEMPLATES;
    }
  },
  saveTemplate(tpl: DocumentTemplate) {
    const tpls = this.getTemplates();
    const idx = tpls.findIndex((t) => t.id === tpl.id);
    if (idx >= 0) tpls[idx] = tpl;
    else tpls.push(tpl);
    localStorage.setItem(KEY_TEMPLATES, JSON.stringify(tpls));
  },

  // Export / Import Backup Data
  exportAllDataAsJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      school: this.getSchoolProfile(),
      user: this.getUserAccount(),
      documents: this.getDocuments(),
      cpList: this.getCPAvailable(),
      tpList: this.getTPAvailable(),
      templates: this.getTemplates(),
    };
    return JSON.stringify(backup, null, 2);
  },
  importBackupData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (data.school) localStorage.setItem(KEY_SCHOOL, JSON.stringify(data.school));
      if (data.documents && Array.isArray(data.documents)) localStorage.setItem(KEY_DOCS, JSON.stringify(data.documents));
      if (data.cpList && Array.isArray(data.cpList)) localStorage.setItem(KEY_CP, JSON.stringify(data.cpList));
      if (data.tpList && Array.isArray(data.tpList)) localStorage.setItem(KEY_TP, JSON.stringify(data.tpList));
      if (data.templates && Array.isArray(data.templates)) localStorage.setItem(KEY_TEMPLATES, JSON.stringify(data.templates));
      return { success: true, message: 'Data cadangan berhasil dipulihkan!' };
    } catch (err: any) {
      return { success: false, message: 'Format file JSON cadangan tidak valid.' };
    }
  },
};
