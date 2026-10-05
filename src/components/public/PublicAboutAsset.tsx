import React, { useState } from 'react';
import { BookOpen, Users, Workflow, FileText, ChevronRight, CheckCircle2, Shield, FolderGit2, Cpu, Wrench } from 'lucide-react';
import engineeringImage from '../../assets/images/engineering_digital_schematic_1791168753551.jpg';
import teamImage from '../../assets/images/hero_fiber_telecom_team_1791168728867.jpg';

export const PublicAboutAsset: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<number>(0);

  const chapters = [
    {
      id: 'intro',
      title: 'Bab 1: Pengenalan & Mandat',
      subtitle: 'Fondasi Divisi Asset Malang',
      icon: BookOpen,
    },
    {
      id: 'structure',
      title: 'Bab 2: Struktur & Peran Tim',
      subtitle: 'Organisasi & Tanggung Jawab',
      icon: Users,
    },
    {
      id: 'activities',
      title: 'Bab 3: Aktivitas & Engineering',
      subtitle: 'Digital CAD, GIS & Alur Kerja',
      icon: Workflow,
    },
    {
      id: 'documentation',
      title: 'Bab 4: Dokumen & Standar Aset',
      subtitle: 'KMZ, Visio, GDB & WIG Matrix',
      icon: FileText,
    },
  ];

  return (
    <div className="bg-slate-100 min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Book Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Corporate Profile · Edisi Wilayah Malang</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Mengenal Divisi Asset Lebih Dekat
          </h1>
          <p className="text-base text-slate-600">
            Sebuah eksplorasi interaktif mengenai orang-orang, teknologi, dan komitmen di balik keterhubungan jaringan telekomunikasi PT PLN Icon Plus Kantor Wilayah Malang.
          </p>
        </div>

        {/* Digital Book Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Chapter Bar (Top Navigation) */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200 bg-slate-50/80">
            {chapters.map((ch, idx) => {
              const IconComp = ch.icon;
              const isActive = activeChapter === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(idx)}
                  className={`p-4 sm:p-5 text-left transition-all border-r last:border-r-0 border-slate-200 flex items-center gap-3 relative ${
                    isActive
                      ? 'bg-white text-blue-700 font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-mono">
                      {ch.title.split(':')[0]}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold truncate text-slate-900">
                      {ch.title.split(':')[1]}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Book Content Pages */}
          <div className="p-6 sm:p-10 lg:p-12">
            
            {/* Chapter 0: Introduction */}
            {activeChapter === 0 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">
                      CHAPTER 01 · FOUNDATION
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      Pengenalan Divisi Asset Malang
                    </h2>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      PT PLN Icon Plus Kantor Perwakilan Malang mengemban misi strategis dalam mengelola infrastruktur transmisi dan distribusi telekomunikasi berbasis kabel optik di koridor Malang Raya—mencakup Kota Malang, Kota Batu, hingga Kabupaten Malang yang membentang dari perbatasan Pasuruan (Lawang) hingga pesisir selatan (Dampit).
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Divisi Asset berfungsi sebagai "jantung inventarisasi", bertugas memastikan bahwa aset fisik bernilai ratusan miliar rupiah tidak hanya terpasang di lapangan, tetapi juga terdata presisi pada sistem digital. Setiap helai serat optik (core) memiliki nomor sertifikasi, alokasi kapasitas, dan keterkaitan dengan layanan pelanggan (SID).
                    </p>
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-900 leading-relaxed">
                        <strong>Mandat Utama:</strong> Mengeliminasi ketidaksesuaian antara data administratif dan kondisi kabel fisik (zero discrepancy), mempercepat waktu respon penanganan gangguan, serta menyajikan basis data siap pakai untuk ekspansi bisnis.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                      <img
                        src={teamImage}
                        alt="Tim Asset PLN Icon Plus Malang"
                        className="w-full h-72 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-3 bg-slate-900 text-white text-xs">
                        <span className="font-semibold">Sinergi Tim Asset Malang</span> · Kolaborasi rutin mingguan evaluasi WIG dan audit core
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 1: Team Structure */}
            {activeChapter === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">
                    CHAPTER 02 · ROLES & COLLABORATION
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Struktur Organisasi & Peran Spesialis
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-3xl">
                    Operasional Divisi Asset dibangun di atas pembagian peran yang saling melengkapi dan terhubung dalam satu rantai akuntabilitas:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tim Data */}
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        D
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Tim Data Management</h3>
                      <p className="text-xs text-slate-500 font-mono">Inventory & Core Registry</p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Mengelola basis data master seluruh core jaringan. Menginput data baru hasil roll-out, memperbarui status utilisasi port OLT, dan memvalidasi integritas file spreadsheet pembagian core.
                      </p>
                    </div>
                    <ul className="mt-4 pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Katalogisasi 48/96/144 Core</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Monitoring Core Idle vs Active</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Verifikasi Alokasi Port OLT</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tim Engineering */}
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                        E
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Tim Engineering GIS</h3>
                      <p className="text-xs text-slate-500 font-mono">Penggambaran & SLD Drafter</p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Bertanggung jawab atas pemodelan arsitektur optik dalam format spasial GIS (KMZ, Shapefile, Geodatabase) dan skema Single Line Diagram (SLD) di Microsoft Visio.
                      </p>
                    </div>
                    <ul className="mt-4 pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Plotting Rute Tiang & Span Kabel</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Desain Skematik SLD Visio</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Pemetaan SID dengan Feeder & Uplink</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tim Field */}
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        F
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Tim Field Operations</h3>
                      <p className="text-xs text-slate-500 font-mono">Inspeksi & Pengukuran OTDR</p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ujung tombak fisik di lapangan. Melakukan uji redaman kabel optik, pengecekan sambungan splice enclosure, verifikasi label tiang PLN, dan penanganan insiden darurat kabel putus.
                      </p>
                    </div>
                    <ul className="mt-4 pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pengukuran OTDR & Power Meter</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pengecekan ODC, FDT & Closure</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pengiriman Bukti Lapangan Ber-geotag</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 2: Activities & Engineering */}
            {activeChapter === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">
                      CHAPTER 03 · TECHNICAL CAPABILITIES
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      Engineering, Penggambaran & Digital GIS
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Engineering bukan sekadar menggambar garis di atas peta, melainkan merancang sistem transmisi optik yang memiliki ketahanan terhadap gangguan. Di wilayah Malang yang dinamis dengan pembangunan infrastruktur jalan tol, flyover, dan pelebaran jalan kota, tim engineering aktif merevisi dan menyesuaikan jalur kabel.
                    </p>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-900">1. Feeder Management</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Kabel distribusi utama dari OLT/POP menuju cluster pelanggan dan ODC/FDT dengan monitoring kapasitas core terpakai vs cadangan.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-900">2. Uplink Transmission</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Jalur pipa data berkecepatan tinggi (10G - 40G) yang menghubungkan POP lokal ke Super Backbone Jawa Timur di Surabaya.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-900">3. SID (Service ID Mapping)</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Integrasi nomor pesanan pelanggan korporat ke dalam alokasi fisik kabel, sehingga jika terjadi redaman tim dapat langsung melacak titik rawan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                      <img
                        src={engineeringImage}
                        alt="Workstation Digital GIS Engineering"
                        className="w-full h-80 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-3 bg-slate-900 text-white text-xs">
                        <span className="font-semibold">Workstation GIS & Topology Drafter</span> · Pemetaan rute optik berbasis geodatabase presisi tinggi
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 3: Documentation & WIG Standards */}
            {activeChapter === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">
                    CHAPTER 04 · ASSET STANDARDIZATION
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Format Dokumen Standar & Verifikasi WIG
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-3xl">
                    Untuk menjamin keandalan data, setiap Data Core di wilayah Malang wajib memiliki 4 pilar dokumen digital sebelum statusnya disetujui (Approved / WIG):
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors shadow-sm">
                    <div className="text-xs font-mono font-bold text-blue-600">FORMAT 01</div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">File KMZ / KML</h3>
                    <p className="text-xs text-slate-500 mt-1">Geospatial Google Earth</p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      Memuat rute koordinat GPS jalur tiang, sambungan splice, dan batas wilayah administrasi yang dapat dibuka langsung di smartphone teknisi lapangan.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-sky-400 transition-colors shadow-sm">
                    <div className="text-xs font-mono font-bold text-sky-600">FORMAT 02</div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Single Line Diagram</h3>
                    <p className="text-xs text-slate-500 mt-1">Microsoft Visio (.vsdx)</p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      Diagram skematik hubungan logis antara port OLT, rak ODF, splitter optik, hingga kabel feeder dan uplink.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 transition-colors shadow-sm">
                    <div className="text-xs font-mono font-bold text-indigo-600">FORMAT 03</div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Geodatabase (GDB)</h3>
                    <p className="text-xs text-slate-500 mt-1">Esri ArcGDB Enterprise</p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      Struktur basis data spasial berlapis yang menyimpan atribut teknis detail: merk kabel, tipe redaman, tahun instalasi, dan kapasitas total.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors shadow-sm">
                    <div className="text-xs font-mono font-bold text-emerald-600">FORMAT 04</div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Core Assignment</h3>
                    <p className="text-xs text-slate-500 mt-1">Spreadsheet Excel (.xlsx)</p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      Matriks warna tabung serat optik (Biru, Oranye, Hijau, Coklat, Abu-abu, Putih, dll) beserta alokasi nomor SID dan pelanggan terkait.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Apa itu Status WIG (Work In Ground)?</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Label sertifikasi resmi yang menyatakan bahwa konstruksi fisik kabel di lapangan telah diverifikasi, redaman memenuhi standar, dan 4 dokumen pendukung telah lengkap 100%.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>WIG APPROVED</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Book Bottom Navigation Footer */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              disabled={activeChapter === 0}
              onClick={() => setActiveChapter(c => Math.max(0, c - 1))}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                activeChapter === 0
                  ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-100'
                  : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
              }`}
            >
              ← Bab Sebelumnya
            </button>

            <span className="text-xs font-medium text-slate-500">
              Bab {activeChapter + 1} dari {chapters.length}
            </span>

            <button
              disabled={activeChapter === chapters.length - 1}
              onClick={() => setActiveChapter(c => Math.min(chapters.length - 1, c + 1))}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                activeChapter === chapters.length - 1
                  ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-100'
                  : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
              }`}
            >
              Bab Selanjutnya →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
