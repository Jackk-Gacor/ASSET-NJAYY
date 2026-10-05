import React from 'react';
import { Target, Compass, Award, ShieldCheck, HeartHandshake, Zap, CheckCircle2, TrendingUp } from 'lucide-react';

export const PublicVisiMisi: React.FC = () => {
  const akhlakValues = [
    {
      code: 'A',
      title: 'Amanah',
      desc: 'Memegang teguh kepercayaan dalam mengelola aset strategis telekomunikasi milik negara dan PLN Icon Plus.',
    },
    {
      code: 'K',
      title: 'Kompeten',
      desc: 'Terus meningkatkan kapabilitas teknis pengujian OTDR, penggambaran GIS canggih, dan analisis redaman optik.',
    },
    {
      code: 'H',
      title: 'Harmonis',
      desc: 'Saling peduli dan menghargai sinergi antartim Data, Engineering, dan Field lintas wilayah kerja Malang.',
    },
    {
      code: 'L',
      title: 'Loyal',
      desc: 'Berdedikasi tinggi mengutamakan kepentingan keandalan transmisi optik demi kepuasan pelanggan korporat & ritel.',
    },
    {
      code: 'A',
      title: 'Adaptif',
      desc: 'Cepat menyesuaikan diri terhadap perkembangan teknologi digitalisasi aset seperti ArcGDB, WebGIS, dan otomasi.',
    },
    {
      code: 'K',
      title: 'Kolaboratif',
      desc: 'Membangun kerjasama strategis dengan unit PLN UID Jatim, vendor kontraktor, dan pemerintah daerah Malang Raya.',
    },
  ];

  const smartAsset = [
    { label: 'S', title: 'Standardized', desc: 'Penamaan OLT, POP, Feeder, dan Core seragam sesuai standar korporasi.' },
    { label: 'M', title: 'Measurable', desc: 'Parameter redaman (dBm), kapasitas terpakai, dan SLA audit terukur presisi.' },
    { label: 'A', title: 'Accurate', desc: 'Data digital GIS identik 100% dengan kondisi rute kabel fisik di lapangan.' },
    { label: 'R', title: 'Resilient', desc: 'Topologi didukung konfigurasi ring proteksi untuk memitigasi single point of failure.' },
    { label: 'T', title: 'Traceable', desc: 'Setiap core dari sentral OLT hingga pelanggan SID dapat dilacak riwayatnya.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
            Arah & Landasan Kerja
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Visi, Misi & Budaya Kerja Divisi Asset
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Menegakkan tata kelola infrastruktur jaringan fiber optic yang kokoh, transparan, dan terstandarisasi demi menjamin keandalan layanan telekomunikasi di wilayah Malang Raya.
          </p>
        </div>

        {/* Visi & Misi Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card Visi */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white rounded-2xl p-8 lg:p-10 shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Compass className="w-48 h-48 text-sky-400" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-sky-400">
                <Target className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Visi Divisi Asset Malang
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-snug">
                  "Menjadi Pusat Keunggulan Tata Kelola Aset Fiber Optic yang Presisi, Terdigitalisasi Penuh, dan Berketahanan Tinggi."
                </h2>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Mewujudkan transparansi menyeluruh dari lapisan fisik (kabel tiang, ODC, splice closure) hingga lapisan data logis (Data Core, Single Line Diagram, WebGIS) untuk mendukung reputasi PLN Icon Plus sebagai penyedia jaringan terdepan.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400 relative z-10">
              <Award className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Berorientasi pada Zero Data Discrepancy & 99.98% Network Resilience</span>
            </div>
          </div>

          {/* Card Misi */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Misi Strategis
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">4 Pilar Misi Divisi Asset</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-mono font-bold text-blue-600">01. DATA INTEGRITY</span>
                  <h4 className="text-sm font-bold text-slate-900">Inventarisasi Core Presisi</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Memastikan 100% data core OLT, POP, Feeder, dan Uplink terdata rapi beserta catatan port, redaman, dan dokumen pendukung.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-mono font-bold text-sky-600">02. GIS ENGINEERING</span>
                  <h4 className="text-sm font-bold text-slate-900">Digital Mapping Geospasial</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menyediakan visualisasi KMZ/KML, ArcGDB, dan Single Line Diagram (SLD) yang mutakhir untuk memudahkan perancangan rute baru.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-600">03. FIELD READINESS</span>
                  <h4 className="text-sm font-bold text-slate-900">Responsivitas Tim Lapangan</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Melakukan audit berkala, pengukuran OTDR, dan verifikasi fisik tiang PLN agar potensi kendala terdeteksi sebelum timbul gangguan.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-600">04. QUALITY & WIG</span>
                  <h4 className="text-sm font-bold text-slate-900">Standardisasi Work in Ground</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menegakkan standar kualitas konstruksi jaringan optik darat (WIG) demi memperpanjang umur aset dan meminimalkan biaya perbaikan.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
              *Setiap pilar misi diaudit secara berkala melalui sistem reporting terintegrasi wilayah Malang.
            </div>
          </div>

        </div>

        {/* Budaya Kerja AKHLAK BUMN */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900">Nilai Budaya AKHLAK</h3>
            <p className="text-sm text-slate-600 mt-1">
              Sebagai bagian dari PT PLN (Persero) Group, insan Divisi Asset Malang berpegang teguh pada nilai inti BUMN:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {akhlakValues.map(val => (
              <div
                key={val.title}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
                    {val.code}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{val.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prinsip S.M.A.R.T Asset */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white p-8 lg:p-10 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                Prinsip Operasional Divisi
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">S.M.A.R.T Asset Management</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Standar Mutu ISO Jaringan Optik</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {smartAsset.map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <span className="text-2xl font-black text-sky-400 font-mono">{item.label}</span>
                <h5 className="text-sm font-bold text-white mt-1">{item.title}</h5>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
