import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  X,
  CheckCircle2,
  Upload,
  User,
  ChevronLeft,
  ChevronRight,
  Compass,
  Database,
  HardHat,
  Cpu,
  MapPin,
  Wrench,
  Award,
  Layers,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface MilestoneContribution {
  title: string;
  desc: string;
  badge?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Engineering' | 'Intern';
  roleTitle: string;
  bgColor: string;
  badgeColor: string;
  focus: string;
  quote: string;
  bio: string;
  expertise: string[];
  tools: string[];
  coverageAreas: string[];
  contributions: MilestoneContribution[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'dimas',
    name: 'Dimas Putra',
    role: 'Engineering',
    roleTitle: 'Lead Drafting & Network GIS Engineer',
    bgColor: 'bg-[#ffdcdc]',
    badgeColor: 'text-rose-500',
    focus: 'Network GIS, SLD Visio & Core Schematics',
    quote: 'Presisi sebuah garis topologi menentukan kecepatan pemulihan saat terjadi gangguan kabel di lapangan.',
    bio: 'Mengawal pemodelan digital topologi fiber optic wilayah Malang Raya, memastikan keakuratan jalur KMZ dan kepatuhan standar WIG Icon Plus.',
    expertise: [
      'Single Line Diagram (SLD)',
      'KMZ Georeferencing',
      'Optical Core Schematics',
      'Visio Automation',
      'WIG Compliance Standard',
      'Backbone Ring Topology',
    ],
    tools: ['MS Visio 2021', 'Google Earth Pro', 'AutoCAD Electrical', 'ArcGIS Pro'],
    coverageAreas: ['Malang Kota (Klojen, Blimbing)', 'Kota Batu', 'Ring Inner Malang', 'Ring Metro Utara'],
    contributions: [
      {
        title: 'Standardisasi Master SLD OLT Klojen & Batu Pusat',
        desc: 'Merancang diagram berstandar ISO untuk 12 FDT dan 48 Feeder dengan penomoran port presisi.',
        badge: 'Engineering SLD',
      },
      {
        title: 'Validasi Geospasial Jalur Backbone Ring Metro Utara',
        desc: 'Pemetaan koordinat presisi sepanjang 42 km koridor Malang-Batu untuk sistem proteksi redundan.',
        badge: 'GIS Mapping',
      },
      {
        title: 'Supervisi Standardisasi Dokumen WIG',
        desc: 'Pencapaian compliance 100% berkas engineering gambar teknik siap uji sertifikasi.',
        badge: 'WIG Audit',
      },
    ],
  },
  {
    id: 'rafly',
    name: 'Rafly Septian',
    role: 'Engineering',
    roleTitle: 'Optical Distribution & Route Design Engineer',
    bgColor: 'bg-[#dbeafe]',
    badgeColor: 'text-rose-500',
    focus: 'Optical Distribution, Ring Routing & Geodatabase',
    quote: 'Arsitektur jaringan yang baik selalu memiliki jalur kedua sebelum rute utama mengalami degradasi.',
    bio: 'Fokus pada arsitektur jalur distribusi kabel optik dan perancangan rute alternatif fiber optic untuk menjamin keandalan layanan PLN Icon Plus.',
    expertise: [
      'Optical Distribution Network (ODN)',
      'Ring Protection Routing',
      'Geodatabase (GDB) Spatial',
      'Link Loss Budgeting',
      'Feeder Capacity Planning',
      'FDT & Closure Dimensioning',
    ],
    tools: ['ArcGIS / QGIS Spatial', 'Google Earth KMZ', 'MS Visio', 'OptiSystem Simulator'],
    coverageAreas: ['Kepanjen (Malang Selatan)', 'Turen & Dampit', 'Ring Poros Selatan', 'Sentral OLT Blimbing'],
    contributions: [
      {
        title: 'Pemetaan Geodatabase (GDB) Feeder & FDT Malang Raya',
        desc: 'Membangun struktur spasial terintegrasi untuk ribuan titik joint closure dan tiang distribusi.',
        badge: 'ArcGDB Database',
      },
      {
        title: 'Desain Redundansi Proteksi Ring Poros Selatan',
        desc: 'Merancang mitigasi downtime kabel poros Kepanjen-Turen dengan jalur loop otomatis.',
        badge: 'Ring Resilience',
      },
      {
        title: 'Analisis Kalkulasi Link Loss Budget',
        desc: 'Memastikan total redaman pada setiap hop berada di bawah batas ambang batas maksimal -24 dBm.',
        badge: 'Optical Budget',
      },
    ],
  },
  {
    id: 'nayo',
    name: 'Nayo',
    role: 'Intern',
    roleTitle: 'Data Core & Asset Registry Specialist (Intern)',
    bgColor: 'bg-[#dcfce7]',
    badgeColor: 'text-rose-500',
    focus: 'Data Core Validation & Asset Digitization',
    quote: 'Data core yang rapi adalah kunci kecepatan tim dalam menyetujui pesanan layanan pelanggan baru.',
    bio: 'Berkontribusi aktif dalam digitalisasi berkas aset core jaringan dan rekonsiliasi data OLT-POP di sistem reporting Malang.',
    expertise: [
      'Data Core Cataloging',
      'Audit 4 Dokumen Wajib (KMZ/Visio/GDB/XLS)',
      'OLT-POP Reconciliation',
      'Preventive Maintenance Logging',
      'Core Utilization Analysis',
    ],
    tools: ['Excel Core Matrix', 'Google Sheets Collaboration', 'Asset Registry Portal', 'GIS Viewer'],
    coverageAreas: ['Malang Kota', 'Singosari (Malang Utara)', 'Sentral POP Suhat', 'OLT Klojen'],
    contributions: [
      {
        title: 'Audit Kepatuhan Berkas 4 Pilar Aset',
        desc: 'Melakukan verifikasi berkas KMZ, Visio, GDB, dan Spreadsheet pada 35+ node aktif Malang Raya.',
        badge: 'Asset Compliance',
      },
      {
        title: 'Digitalisasi Matrix Core Rute Ekspansi Singosari',
        desc: 'Pencatatan alokasi core 96 FO untuk mendukung percepatan integrasi kawasan industri Singosari.',
        badge: 'Core Matrix',
      },
      {
        title: 'Penyusunan Log Riwayat Pemeliharaan Preventif',
        desc: 'Katalogisasi riwayat pemeliharaan berkala dan update status port aktif vs idle.',
        badge: 'Registry Log',
      },
    ],
  },
  {
    id: 'alip',
    name: 'Alip',
    role: 'Intern',
    roleTitle: 'Field Validation & OTDR Operations (Intern)',
    bgColor: 'bg-[#fef3c7]',
    badgeColor: 'text-rose-500',
    focus: 'Field Data Reconciliation & OTDR Verification',
    quote: 'Kondisi riil di atas tiang dan sambungan optik adalah fakta sejati kualitas sebuah infrastruktur.',
    bio: 'Menghubungkan data hasil pengukuran redaman tim teknisi lapangan dengan tabel inventaris core pusat Divisi Asset.',
    expertise: [
      'OTDR Attenuation Testing',
      'Optical Power Metering (OPM)',
      'Geotagging Tiang PLN & ODC',
      'Splice Closure Inspection',
      'Field Safety & K3 Standards',
    ],
    tools: ['OTDR Anritsu/EXFO', 'Optical Power Meter', 'GPS Geotagging Camera', 'Field Mobile Form'],
    coverageAreas: ['Singosari - Lawang', 'Koridor Tol Mapan', 'Kepanjen', 'Batu'],
    contributions: [
      {
        title: 'Sinkronisasi Uji Redaman OTDR Lapangan',
        desc: 'Pemeriksaan kurva trace loss dan identifikasi titik bending kabel optik rute Malang Utara.',
        badge: 'OTDR Measurement',
      },
      {
        title: 'Verifikasi Koordinat Geospasial Tiang & Joint Closure',
        desc: 'Pengecekan span tiang PLN jalur Lawang untuk memastikan akurasi data jarak fisik kabel.',
        badge: 'Field Survey',
      },
      {
        title: 'Dokumentasi Visual Geotagging ODC/FDT',
        desc: 'Pengumpulan bukti fisik foto berkualitas tinggi untuk kelengkapan berkas audit WIG.',
        badge: 'Geotagging Asset',
      },
    ],
  },
  {
    id: 'jek',
    name: 'Jek',
    role: 'Intern',
    roleTitle: 'GIS Geotagging & Route Alignment (Intern)',
    bgColor: 'bg-[#ffdcdc]',
    badgeColor: 'text-rose-500',
    focus: 'GIS Geotagging & Route Alignment',
    quote: 'Menyelaraskan koordinat satelit dengan kabel optik riil di lapangan demi peta kerja tanpa cela.',
    bio: 'Mendukung proses geotagging dan penyesuaian rute kabel fiber optic pada aplikasi peta geospasial Asset Malang.',
    expertise: [
      'GIS Ground-Truthing',
      'Pole Span Verification',
      'KML/KMZ Layering',
      'Aerial vs Underground Cable Audit',
      'Topographic Waypoint Mapping',
    ],
    tools: ['Google Earth Pro', 'QGIS Desktop', 'GPS Handheld Garmin', 'Asset Map Mobile'],
    coverageAreas: ['Kota Batu', 'Klojen & Lowokwaru', 'Ring Inner Malang', 'Batu Tourism Route'],
    contributions: [
      {
        title: 'Plotting Spasial Titik OLT & FDT Baru',
        desc: 'Penempatan presisi titik terminasi baru pada peta kerja interaktif Divisi Asset.',
        badge: 'GIS Layering',
      },
      {
        title: 'Audit Span Kabel Udara vs Kabel Bawah Tanah',
        desc: 'Pencatatan segmen kabel penyeberangan jalan protokol untuk mitigasi kabel tersangkut kendaraan.',
        badge: 'Span Inspection',
      },
      {
        title: 'Penyesuaian Alignment Jalur Ring Inner Malang',
        desc: 'Update rute digital mengikuti perubahan infrastruktur jalan flyover dan perbaikan tiang.',
        badge: 'Route Update',
      },
    ],
  },
  {
    id: 'dinda',
    name: 'Dinda',
    role: 'Intern',
    roleTitle: 'Core Assignment & Service Matrix (Intern)',
    bgColor: 'bg-[#dbeafe]',
    badgeColor: 'text-rose-500',
    focus: 'Core Assignment Matrix & Documentation',
    quote: 'Setiap warna helai optik menyimpan amanah kelancaran komunikasi ribuan pelanggan Icon Plus.',
    bio: 'Mengelola database alokasi core aktif, cadangan (idle), dan pesanan baru SID untuk memastikan ketersediaan kapasitas link.',
    expertise: [
      'Fiber Color Code Standards',
      'Buffer Tube Assignment',
      'Service Identification (SID) Mapping',
      'Idle Core Optimization',
      'Capacity Forecasting',
    ],
    tools: ['Fiber Matrix Excel', 'TIA/EIA-598-A Color Code Engine', 'Database Core Portal', 'Visio Viewer'],
    coverageAreas: ['Malang Kota', 'Kepanjen', 'Sentral POP Sawojajar', 'Batu'],
    contributions: [
      {
        title: 'Tabel Matriks Pewarnaan Tube & Core 24/48/96/144 FO',
        desc: 'Standarisasi warna serat (biru, oranye, hijau, cokelat) agar konsisten antara gambar dan fisik.',
        badge: 'Color Standard',
      },
      {
        title: 'Pemetaan Ketersediaan Core SID Pelanggan Baru',
        desc: 'Pengecekan ketersediaan core bebas (idle) untuk mendukung aktivasi cepat pesanan SID korporasi.',
        badge: 'SID Mapping',
      },
      {
        title: 'Rekapitulasi Evaluasi Utilisasi Core Wilayah Malang',
        desc: 'Penyusunan rasio utilisasi kapasitas jaringan untuk acuan rencana upgrade kabel optik.',
        badge: 'Capacity Report',
      },
    ],
  },
  {
    id: 'novi',
    name: 'Novi',
    role: 'Intern',
    roleTitle: 'Quality Assurance & Standards Review (Intern)',
    bgColor: 'bg-[#dcfce7]',
    badgeColor: 'text-rose-500',
    focus: 'Quality Review & Schematics Verification',
    quote: 'Standar kualitas yang ketat adalah perlindungan terbaik bagi keandalan jangka panjang sistem.',
    bio: 'Melakukan review ketelitian terhadap diagram skematik Visio dan keselarasan nama hostname dengan standar penamaan resmi PLN Icon Plus.',
    expertise: [
      'Hostname Naming Conventions',
      'SLD Drawing Quality Check',
      'Digital Archiving',
      'WIG Compliance Verification',
      'Audit Checklist Management',
    ],
    tools: ['Microsoft Visio', 'Adobe Acrobat Pro', 'Asset Cloud Archive', 'Standard Guidelines Icon Plus'],
    coverageAreas: ['Seluruh Wilayah Kerja Malang Raya (Kota Malang, Batu, Kabupaten)'],
    contributions: [
      {
        title: 'Quality Control Diagram Skematik SLD',
        desc: 'Pemeriksaan kelayakan sebelum diajukan untuk proses approval dan sertifikasi WIG resmi.',
        badge: 'Quality Control',
      },
      {
        title: 'Konsistensi Penamaan Hostname Node Jaringan',
        desc: 'Penyeragaman format kode hostname OLT, POP, FDT, dan Feeder di seluruh database.',
        badge: 'Naming Standard',
      },
      {
        title: 'Pengarsipan Digital Sertifikasi Approval WIG',
        desc: 'Penyusunan berkas bukti audit kelayakan sistem ke dalam repositori digital terpusat.',
        badge: 'Approval Archive',
      },
    ],
  },
  {
    id: 'adam',
    name: 'Adam',
    role: 'Intern',
    roleTitle: 'Digital Systems & Asset Workflow Integration (Intern)',
    bgColor: 'bg-[#fef3c7]',
    badgeColor: 'text-rose-500',
    focus: 'Asset Reporting Systems & Digital Workflow',
    quote: 'Menghubungkan data di belakang layar menjadi pengalaman antarmuka yang cepat, presisi, dan bermakna.',
    bio: 'Mengembangkan inovasi alur digital pelaporan dan integrasi data antara tim Field, Data Core, dan Engineering Divisi Asset Malang.',
    expertise: [
      'Asset Reporting Web Architecture',
      'Data Core Search Algorithms',
      'Interactive Topology Mapping',
      'Recent Searches FIFO Logic',
      'UI/UX for Enterprise Telecom',
      'Report Generation (CSV/PDF)',
    ],
    tools: ['React & TypeScript', 'Tailwind CSS', 'SVG Topology Engine', 'LocalStorage State Engine'],
    coverageAreas: ['Digital Hub Asset Malang (Sistem Terpadu Data, Engineering & Field)'],
    contributions: [
      {
        title: 'Pembangunan Mesin Pencari Data Core Terpadu',
        desc: 'Pengembangan pencarian instan hostname, OLT, POP, status berkas, dan penyorotan kata kunci.',
        badge: 'Search Engine',
      },
      {
        title: 'Visualisasi Peta Geospasial & Logika Topologi Ring',
        desc: 'Pembuatan visualisasi interaktif jalur redundansi 360° dan peta simpul optik Malang Raya.',
        badge: 'Network Topology',
      },
      {
        title: 'Sistem Pelaporan & Evaluasi Digital Terintegrasi',
        desc: 'Implementasi ekspor laporan CSV/PDF, audit checklist kelengkapan berkas, dan sinkronisasi field.',
        badge: 'Reporting Portal',
      },
    ],
  },
];

export const PublicTeamSection: React.FC = () => {
  const { showToast } = useApp();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [viewDisplayMode, setViewDisplayMode] = useState<'minimal' | 'expanded'>('minimal');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  // Local storage for custom uploaded profile photos
  const [memberPhotos, setMemberPhotos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('pln_team_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handlePhotoUpload = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const updated = { ...memberPhotos, [memberId]: result };
          setMemberPhotos(updated);
          try {
            localStorage.setItem('pln_team_photos', JSON.stringify(updated));
            showToast('Foto profil anggota berhasil diperbarui!', 'success');
          } catch (err) {
            console.error('Failed to save photo to localStorage', err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...memberPhotos };
    delete updated[memberId];
    setMemberPhotos(updated);
    try {
      localStorage.setItem('pln_team_photos', JSON.stringify(updated));
      showToast('Foto profil dikembalikan ke placeholder default', 'info');
    } catch (err) {
      console.error('Failed to update photo storage', err);
    }
  };

  const toggleCardExpansion = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCardIds(prev => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMember) return;
      if (e.key === 'Escape') {
        setSelectedMember(null);
      } else if (e.key === 'ArrowRight') {
        navigateMember('next');
      } else if (e.key === 'ArrowLeft') {
        navigateMember('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember]);

  const navigateMember = (direction: 'next' | 'prev') => {
    if (!selectedMember) return;
    const currentIndex = TEAM_MEMBERS.findIndex(m => m.id === selectedMember.id);
    if (currentIndex === -1) return;
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = TEAM_MEMBERS.length - 1;
    if (nextIndex >= TEAM_MEMBERS.length) nextIndex = 0;
    setSelectedMember(TEAM_MEMBERS[nextIndex]);
  };

  const copyMemberSummary = (member: TeamMember) => {
    const text = `${member.name} (${member.role} - ${member.roleTitle})\nDivisi Asset PT PLN Icon Plus KP Malang\nFokus: ${member.focus}\nKeahlian: ${member.expertise.join(', ')}`;
    navigator.clipboard.writeText(text);
    showToast(`Ringkasan profil ${member.name} disalin ke clipboard!`, 'success');
  };

  return (
    <section id="tim-kami" className="py-20 lg:py-28 bg-[#fafafa] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header with exact wording from image + interactive display mode toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Keluarga Divisi Asset · Kantor Perwakilan Malang</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Dibuat bersama,<br />
              untuk bekerja bersama.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Sinergi antara praktisi Engineering dan talenta muda generasi penerus dalam mengelola, memvalidasi, serta menjaga keandalan aset fiber optic PT PLN Icon Plus wilayah Malang Raya.
            </p>
          </div>

          {/* Toggle between Minimalist Card Grid (mockup style) and Expanded Card View */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setViewDisplayMode('minimal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewDisplayMode === 'minimal'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tampilan Ringkas
            </button>
            <button
              type="button"
              onClick={() => setViewDisplayMode('expanded')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewDisplayMode === 'expanded'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Kartu Detail Lengkap
            </button>
          </div>
        </div>

        {/* 8 Team Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
          {TEAM_MEMBERS.map((member) => {
            const hasCustomPhoto = !!memberPhotos[member.id];
            const isCardExpanded = viewDisplayMode === 'expanded' || !!expandedCardIds[member.id];

            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer ${
                  isCardExpanded ? 'ring-1 ring-blue-500/30' : ''
                }`}
              >
                {/* Upper Pastel Canvas / Avatar Area */}
                <div
                  className={`relative w-full aspect-[4/5] ${member.bgColor} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]`}
                >
                  {hasCustomPhoto ? (
                    <img
                      src={memberPhotos[member.id]}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    /* Subtle artistic initials & soft typography for modern corporate look */
                    <div className="flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
                      <span className="text-5xl sm:text-6xl font-black text-slate-900/40 select-none tracking-tighter">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}

                  {/* Bottom-left Photo Placeholder Badge (Exact detail from mockup) */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs border border-white/80 cursor-pointer hover:scale-110 hover:bg-white transition-transform"
                      title="Klik untuk upload foto profil"
                    >
                      <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(member.id, e)}
                      />
                    </label>
                  </div>

                  {/* Quick Expand Toggle button at top-left */}
                  <button
                    type="button"
                    onClick={(e) => toggleCardExpansion(member.id, e)}
                    className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/80 hover:bg-white text-[10px] font-semibold text-slate-700 backdrop-blur-xs border border-white/80 flex items-center gap-1 shadow-xs transition-transform hover:scale-105 z-10"
                    title={isCardExpanded ? 'Ringkas kartu' : 'Buka sekilas'}
                  >
                    {isCardExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    <span>{isCardExpanded ? 'Ringkas' : 'Sekilas'}</span>
                  </button>

                  {/* If custom photo exists, option to remove */}
                  {hasCustomPhoto && (
                    <button
                      type="button"
                      onClick={(e) => removePhoto(member.id, e)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-xs transition-colors z-10 cursor-pointer"
                      title="Hapus foto custom"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Bottom Info Box */}
                <div className="p-5 sm:p-6 bg-white flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                        {member.name}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                        KP Malang
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm font-semibold ${member.badgeColor} mt-1`}>
                      {member.role}
                    </p>

                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {member.roleTitle}
                    </p>
                  </div>

                  {/* In-Card Expanded Content (Active in 'expanded' mode or via toggle) */}
                  {isCardExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in-50 duration-200">
                      {/* Top 3 Expertise chips */}
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                          Keahlian Utama:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.slice(0, 3).map((exp, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contribution highlight */}
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800 block text-[10px] uppercase font-mono text-blue-700">
                          Highlight Kontribusi:
                        </span>
                        <p className="line-clamp-2 mt-0.5">
                          {member.contributions[0]?.title}
                        </p>
                      </div>

                      {/* Coverage areas tags */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{member.coverageAreas.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Card Footer Action */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[140px]">
                      {member.focus.split(',')[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0"
                    >
                      <span>Detail Profil</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* DETAILED MODAL POPUP FOR INDIVIDUAL ROLES, EXPERTISE & CONTRIBUTIONS     */}
      {/* ========================================================================= */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner with Member's Pastel Accent */}
            <div className={`p-6 sm:p-7 ${selectedMember.bgColor} border-b border-slate-200/60 relative shrink-0`}>
              
              {/* Header Navigation & Close Buttons */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigateMember('prev')}
                    className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    title="Anggota Sebelumnya (Panah Kiri)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/70 text-slate-700 font-semibold">
                    {TEAM_MEMBERS.findIndex(m => m.id === selectedMember.id) + 1} / {TEAM_MEMBERS.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigateMember('next')}
                    className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    title="Anggota Berikutnya (Panah Kanan)"
                  >
                    <span className="hidden sm:inline">Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyMemberSummary(selectedMember)}
                    className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-xs transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Salin ringkasan info personil"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px] font-semibold">Salin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    title="Tutup Modal (Escape)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Profile Card Header Info */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-white">
                    {memberPhotos[selectedMember.id] ? (
                      <img
                        src={memberPhotos[selectedMember.id]}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl font-black text-slate-800">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>

                  {/* Upload Avatar Overlay Button */}
                  <label
                    className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-semibold cursor-pointer backdrop-blur-xs"
                    title="Ganti Foto Profil"
                  >
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(selectedMember.id, e)}
                    />
                  </label>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white text-rose-500 shadow-xs">
                      {selectedMember.role}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      Divisi Asset · PT PLN Icon Plus KP Malang
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 leading-snug truncate">
                    {selectedMember.name}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
                    {selectedMember.roleTitle}
                  </p>

                  <p className="text-xs text-slate-600 italic mt-1.5 hidden sm:block">
                    "{selectedMember.quote}"
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body with Scrollable Tabbed / Structured Content */}
            <div className="p-6 sm:p-7 space-y-6 overflow-y-auto text-sm text-slate-600">
              
              {/* 1. Individual Roles & Responsibility */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Peran & Tanggung Jawab Operasional</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {selectedMember.bio}
                </p>
              </div>

              {/* 2. Technical Expertise & Tools */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>Keahlian Teknis & Perangkat Kerja (Expertise & Tools)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Expertise list */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-purple-900 uppercase block">
                      Spesialisasi Teknis:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMember.expertise.map((exp, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-white text-purple-800 text-xs font-semibold border border-purple-200 shadow-xs"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Software & Hardware tools */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-blue-900 uppercase block">
                      Perangkat Lunak & Instrumen:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMember.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-white text-blue-800 text-xs font-semibold border border-blue-200 shadow-xs flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3 text-blue-500" />
                          <span>{tool}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Coverage Areas in Malang Raya */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Wilayah & Koridor Kerja di Malang</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.coverageAreas.map((area, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{area}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Contribution Areas & Key Deliverables */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Area Kontribusi Nyata di Divisi Asset Malang</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {selectedMember.contributions.length} Program
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedMember.contributions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors flex items-start gap-3 shadow-xs"
                    >
                      <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{memberPhotos[selectedMember.id] ? 'Ganti Foto Profil' : 'Unggah Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(selectedMember.id, e)}
                  />
                </label>

                {memberPhotos[selectedMember.id] && (
                  <button
                    type="button"
                    onClick={(e) => removePhoto(selectedMember.id, e)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                  >
                    Reset Foto
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => copyMemberSummary(selectedMember)}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Salin Info
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="flex-1 sm:flex-initial px-5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
