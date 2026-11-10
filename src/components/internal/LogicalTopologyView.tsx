import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  Layers,
  Compass,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowDown,
  ArrowRight,
  Server,
  Zap,
  MapPin,
  Radio,
  Network,
  ShieldCheck,
  Activity,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface LogicalNode {
  id: string;
  name: string;
  level: string;
  role: string;
  capacity: string;
  redundancy: string;
  activeLoss: string;
  distanceToCenter?: string;
  coordinates?: string;
  connectedTo: string[];
  description?: string;
}

export const LogicalTopologyView: React.FC = () => {
  const { dataCoreList, openCoreDetail, setCurrentView, showToast } = useApp();

  const [activeScheme, setActiveScheme] = useState<'plan_pertama' | 'tier_standard'>('plan_pertama');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('NODE-GI-KBG');

  // ================= DATA TOPOLOGI AREA 45 (SESUAI GAMBAR 1 & GAMBAR 2) =================
  const planPertamaNodes: LogicalNode[] = [
    {
      id: 'NODE-GI-LWG',
      name: 'GI LAWANG_AREA45',
      level: 'Super Backbone Origin',
      role: 'Gardu Induk Lawang - Gerbang Transmisi Malang Utara',
      capacity: '288 Core Single Mode (DWDM 100 Gbps Trunk)',
      redundancy: 'Dual Homing Pasuruan - Surabaya Super Backbone',
      activeLoss: '-13.8 dBm',
      distanceToCenter: '24.5 km ke Titik 0',
      coordinates: 'Lat -7.8341, Lng 112.6982',
      connectedTo: ['NODE-GI-KBG', 'NODE-ULP-SGS'],
      description: 'Pintu masuk transmisi fiber optik backbone utama dari arah utara (Surabaya & Pasuruan) menuju GI Kebonagung.',
    },
    {
      id: 'NODE-GI-KBG',
      name: 'POP SHELTER GI KEBON AGUNG_AREA45',
      level: 'Titik 0 Sentral Malang',
      role: 'Sub-Transmission Master Hub & Ruang Shelter Transmisi',
      capacity: '288 Core ODF Master Hub (240 Core Terutilisasi)',
      redundancy: 'Super Backbone GI Lawang + Ring Proteksi Selatan',
      activeLoss: '-14.0 dBm',
      distanceToCenter: '0.0 km (Titik 0 Sentral)',
      coordinates: 'S 7° 57.368\', E 112° 37.642\' (Pakisaji - Malang)',
      connectedTo: [
        'NODE-GI-LWG',
        'NODE-ULP-KPJ',
        'NODE-ULP-GDL',
        'NODE-ULP-DMP',
        'NODE-ULP-SBP',
        'NODE-ULP-KBG',
        'NODE-UP3-MLG',
        'NODE-ODC-SKL',
        'NODE-TK4-SDR',
      ],
      description: 'Titik 0 dan pusat agregasi transmisi fiber optik seluruh Malang Selatan & Kota. Mendistribusikan sinyal optik ke seluruh POP/ODC ULP strategis.',
    },
    {
      id: 'NODE-ULP-KPJ',
      name: 'POP ODC ULP KEPANJEN_AREA45',
      level: 'Cabang Distribusi 1 (Selatan - Gambar 1)',
      role: 'Sentral Logistik & ODC Kantor Jaringan ULP Kepanjen',
      capacity: '96 Core Single Mode G.652.D (64 Terpakai)',
      redundancy: 'Jalur Proteksi Poros Malang - Kepanjen',
      activeLoss: '-17.2 dBm',
      distanceToCenter: '18.4 km dari Kebon Agung',
      coordinates: 'Lat -8.1308, Lng 112.5714',
      connectedTo: ['NODE-GI-KBG', 'NODE-ULP-SBP', 'NODE-ULP-GDL'],
      description: 'Melayani perkantoran Pemkab Malang, Gudang ULP Kepanjen, serta sentral distribusi kawasan perumahan dan komersial selatan (Gambar 1).',
    },
    {
      id: 'NODE-ULP-GDL',
      name: 'POP ODC ULP GONDANGLEGI_AREA45',
      level: 'Cabang Distribusi 2 (Tenggara - Gambar 1)',
      role: 'Sentral Distribusi ULP Gondanglegi & Industri',
      capacity: '72 Core Single Mode G.652.D (48 Terpakai)',
      redundancy: 'Trunk Koridor Gondanglegi - Pagelaran',
      activeLoss: '-18.0 dBm',
      distanceToCenter: '22.1 km dari Kebon Agung',
      coordinates: 'Lat -8.1755, Lng 112.6345',
      connectedTo: ['NODE-GI-KBG', 'NODE-ULP-KPJ', 'NODE-ULP-DMP'],
      description: 'Menyuplai konektivitas fiber optik ke Pabrik Gula Krebet, ULP Gondanglegi, dan kawasan sentra industri tebu (Gambar 1).',
    },
    {
      id: 'NODE-ULP-DMP',
      name: 'POP ULP DAMPIT_AREA45',
      level: 'Cabang Distribusi 3 (Frontier Timur - Gambar 1)',
      role: 'Sentral Pelayanan Pelanggan & Ekspansi ULP Dampit',
      capacity: '48 Core Single Mode (24 Terpakai / 24 Cadangan)',
      redundancy: 'Kabel Aerial ADSS Tiang PLN Koridor Timur',
      activeLoss: '-19.4 dBm',
      distanceToCenter: '31.8 km dari Kebon Agung',
      coordinates: 'Lat -8.2125, Lng 112.7915',
      connectedTo: ['NODE-GI-KBG', 'NODE-ULP-GDL'],
      description: 'Jalur terjauh poros timur menuju perbatasan Lumajang dan perkebunan kopi Dampit dengan redaman terukur stabil -19.4 dBm.',
    },
    {
      id: 'NODE-ULP-SBP',
      name: 'POP ODC ULP SUMBERPUCUNG_AREA45',
      level: 'Cabang Distribusi 4 (Barat Selatan - Gambar 1)',
      role: 'Sentral Distribusi ULP Sumberpucung & Bendungan Lahor',
      capacity: '72 Core Single Mode (38 Terpakai / 34 Cadangan)',
      redundancy: 'Koridor Karangkates Boundary Blitar',
      activeLoss: '-18.5 dBm',
      distanceToCenter: '24.2 km dari Kebon Agung',
      coordinates: 'Lat -8.1562, Lng 112.5123',
      connectedTo: ['NODE-GI-KBG', 'NODE-ULP-KPJ', 'NODE-ODC-SKL'],
      description: 'Menghubungkan instalasi PLTA Sutami/Karangkates, Bendungan Lahor, dan kantor ULP Sumberpucung (Gambar 1).',
    },
    {
      id: 'NODE-ULP-KBG',
      name: 'POP ODC ULP KEBONG AGUNG_AREA45',
      level: 'Cabang Distribusi 5 (Lokal Ring)',
      role: 'Kantor ULP Kebong Agung & Klaster Industri Gula',
      capacity: '96 Core Single Mode (72 Terpakai / 24 Cadangan)',
      redundancy: 'Direct Interconnect Jalur Ring Dalam',
      activeLoss: '-15.1 dBm',
      distanceToCenter: '2.4 km dari Titik 0',
      coordinates: 'Lat -7.9620, Lng 112.6230',
      connectedTo: ['NODE-GI-KBG', 'NODE-UP3-MLG'],
      description: 'Distribusi fiber optik lokal berjarak sangat dekat ke PG Kebonagung dan jaringan distribusi perkantoran PLN setempat.',
    },
    {
      id: 'NODE-UP3-MLG',
      name: 'POP UP3 MALANG_AREA45',
      level: 'Cabang Distribusi 6 (Backbone Kota - Gambar 2)',
      role: 'Kantor Induk PLN UP3 Malang (Jl. Basuki Rahmat)',
      capacity: '144 Core Single Mode (118 Terpakai / 26 Cadangan)',
      redundancy: 'Inner Malang Ring Dual-Path Protection',
      activeLoss: '-15.8 dBm',
      distanceToCenter: '6.8 km dari Kebon Agung',
      coordinates: 'Lat -7.9785, Lng 112.6318',
      connectedTo: ['NODE-GI-KBG', 'NODE-ULP-DNY', 'NODE-ULP-BLM', 'NODE-ULP-KBG'],
      description: 'Koneksi vital ke kantor induk PLN UP3 Malang, melayani kebutuhan server korporat, NOC manajemen jaringan, dan SCADA (Gambar 2).',
    },
    {
      id: 'NODE-ODC-SKL',
      name: 'POP ODC GI SENGKALING_AREA45',
      level: 'Cabang Distribusi 7 (Barat / Dau - Gambar 2)',
      role: 'Klaster Distribusi Dau, Sengkaling, Kampus & Batu',
      capacity: '72 Core Single Mode (46 Terpakai / 26 Cadangan)',
      redundancy: 'Radial Feeder Jalur Sengkaling - Dau',
      activeLoss: '-17.5 dBm',
      distanceToCenter: '12.3 km dari Kebon Agung',
      coordinates: 'Lat -7.9250, Lng 112.5850',
      connectedTo: ['NODE-GI-KBG', 'NODE-ULP-BATU', 'NODE-TK4-MLY', 'NODE-ULP-SBP'],
      description: 'Menyuplai pelanggan area barat, perumahan Dau, destinasi wisata Taman Rekreasi Sengkaling, dan koridor kampus UMM (Gambar 2).',
    },
    {
      id: 'NODE-ULP-BATU',
      name: 'POP ODC ULP BATU_AREA45',
      level: 'Cabang Distribusi 8 (Kota Batu - Gambar 2)',
      role: 'Sentral Pelayanan Pelanggan & ODC Kota Batu',
      capacity: '96 Core Single Mode (68 Terpakai / 28 Cadangan)',
      redundancy: 'Ring Redundansi Wisata Batu - Dau',
      activeLoss: '-16.0 dBm',
      distanceToCenter: '18.2 km dari Kebon Agung',
      coordinates: 'Lat -7.8712, Lng 112.5271',
      connectedTo: ['NODE-ODC-SKL'],
      description: 'Hub utama ring barat melayani kawasan perhotelan, wisata Selecta/Jatim Park, dan Pemkot Batu (Gambar 2).',
    },
    {
      id: 'NODE-TK4-MLY',
      name: 'POP TK4 DESA MULYOAGUNG_ARE',
      level: 'Cabang Distribusi 9 (Dau - Gambar 2)',
      role: 'Distribusi Akses Pedesaan TK4 Mulyoagung',
      capacity: '48 Core Single Mode (28 Terpakai / 20 Cadangan)',
      redundancy: 'Loop Dau Sengkaling - Begawan',
      activeLoss: '-15.2 dBm',
      distanceToCenter: '10.5 km dari Kebon Agung',
      coordinates: 'Lat -7.9238, Lng 112.5980',
      connectedTo: ['NODE-ODC-SKL', 'NODE-ODC-BGW'],
      description: 'Simpul distribusi optik tingkat 4 melayani kawasan desa Mulyoagung dan perbatasan kampus UMM (Gambar 2).',
    },
    {
      id: 'NODE-ODC-BGW',
      name: 'POP ODC APART BEGAWAN_AREA45',
      level: 'Cabang Distribusi 10 (Tlogomas - Gambar 2)',
      role: 'ODC Kawasan Hunian Vertikal Begawan Apartemen',
      capacity: '48 Core Single Mode (34 Terpakai / 14 Cadangan)',
      redundancy: 'Feeder Tlogomas Metro-E',
      activeLoss: '-15.5 dBm',
      distanceToCenter: '8.4 km dari Kebon Agung',
      coordinates: 'Lat -7.9365, Lng 112.6075',
      connectedTo: ['NODE-TK4-MLY', 'NODE-ULP-DNY'],
      description: 'Melayani apartemen bertingkat tinggi Begawan, ruko bisnis, dan sentra komersial Tlogomas (Gambar 2).',
    },
    {
      id: 'NODE-ULP-DNY',
      name: 'POP ODC ULP DINOYO_AREA45',
      level: 'Cabang Distribusi 11 (Lowokwaru - Gambar 2)',
      role: 'Sentral Distribusi Dinoyo & Koridor Pendidikan',
      capacity: '96 Core Single Mode (74 Terpakai / 22 Cadangan)',
      redundancy: 'Backbone Dinoyo - Klojen Ring',
      activeLoss: '-15.9 dBm',
      distanceToCenter: '7.2 km dari Kebon Agung',
      coordinates: 'Lat -7.9425, Lng 112.6148',
      connectedTo: ['NODE-ODC-BGW', 'NODE-UP3-MLG'],
      description: 'Jalur sangat padat melayani kawasan kampus UB, ITN, UIN, dan koridor komersial Dinoyo (Gambar 2).',
    },
    {
      id: 'NODE-ULP-BLM',
      name: 'PLN ODC ULP BLIMBING_AREA45',
      level: 'Cabang Distribusi 12 (Metro Timur - Gambar 2)',
      role: 'POP Backbone Metro Blimbing & Kawasan Industri',
      capacity: '144 Core Single Mode (92 Terpakai / 52 Cadangan)',
      redundancy: 'Trunk Poros Utara Blimbing - Singosari',
      activeLoss: '-15.7 dBm',
      distanceToCenter: '9.1 km dari Kebon Agung',
      coordinates: 'Lat -7.9428, Lng 112.6455',
      connectedTo: ['NODE-UP3-MLG', 'NODE-ULP-SGS', 'NODE-TK4-SDR'],
      description: 'Sentral backbone kawasan industri Karanglo, Jl. Raden Panji Suroso, dan Blimbing (Gambar 2).',
    },
    {
      id: 'NODE-ULP-SGS',
      name: 'POP ODC ULP SINGOSARI_AREA45',
      level: 'Cabang Distribusi 13 (Singosari - Gambar 2)',
      role: 'Sentral Industri KEK Singhasari & Tol Malang',
      capacity: '96 Core Single Mode (58 Terpakai / 38 Cadangan)',
      redundancy: 'Trunk Singosari - Lawang Gateway',
      activeLoss: '-16.2 dBm',
      distanceToCenter: '15.6 km dari Kebon Agung',
      coordinates: 'Lat -7.8920, Lng 112.6660',
      connectedTo: ['NODE-ULP-BLM', 'NODE-GI-LWG'],
      description: 'Melayani kawasan ekonomi khusus (KEK) Singhasari, industri manufaktur, dan koridor tol (Gambar 2).',
    },
    {
      id: 'NODE-TK4-SDR',
      name: 'POP TK4 DESA SIDOREJO_AREA45',
      level: 'Cabang Distribusi 14 (Jabung - Gambar 2)',
      role: 'Distribusi Akses Pedesaan Sidorejo Jabung',
      capacity: '48 Core Single Mode (22 Terpakai / 26 Cadangan)',
      redundancy: 'Ring Timur Jabung - Pakis',
      activeLoss: '-17.4 dBm',
      distanceToCenter: '14.5 km dari Kebon Agung',
      coordinates: 'Lat -7.9610, Lng 112.6950',
      connectedTo: ['NODE-ULP-BLM', 'NODE-GI-KBG'],
      description: 'Simpul distribusi tingkat 4 melayani perbatasan timur kecamatan Jabung dan sentra agrikultur (Gambar 2).',
    },
  ];

  // ================= DATA STANDAR TIER MALANG RAYA =================
  const standardNodes: LogicalNode[] = [
    {
      id: 'BONE-SBY',
      name: 'Super Backbone Gateway (Surabaya Main)',
      level: 'Tier 1 - Super Backbone',
      role: 'Gateway Induk Regional Jawa Timur',
      capacity: 'DWDM 100 Gbps Core (288 Core)',
      redundancy: 'Dual Homing Ring Protection (Jawa Timur)',
      activeLoss: '-14.2 dBm',
      connectedTo: ['POP-KLJ', 'POP-LWG'],
      description: 'Gerbang transmisi backbone provinsi Jawa Timur.',
    },
    {
      id: 'POP-KLJ',
      name: 'POP Sentral Klojen Malang (Hub Utama)',
      level: 'Tier 2 - POP Backbone',
      role: 'ODF Master Aggregator Malang Kota',
      capacity: '40 Gbps Aggregation (288 Core)',
      redundancy: 'Protected by Inner Malang Ring',
      activeLoss: '-16.5 dBm',
      connectedTo: ['POP-BLM', 'POP-SHT', 'POP-SKN', 'POP-KPJ'],
      description: 'Pusat transmisi ODF Klojen yang melayani ring metro kota.',
    },
    {
      id: 'POP-LWG',
      name: 'POP Lawang Transit',
      level: 'Tier 2 - POP Backbone',
      role: 'Hub Transit Koridor Utara',
      capacity: '10 Gbps Uplink (96 Core)',
      redundancy: 'Border Transit Line Pasuruan',
      activeLoss: '-18.1 dBm',
      connectedTo: ['POP-SGS'],
      description: 'Sentral transit perbatasan Pasuruan-Malang.',
    },
    {
      id: 'POP-BLM',
      name: 'POP Blimbing Industrial',
      level: 'Tier 3 - Distribution',
      role: 'Sentral Distribusi Kawasan Industri',
      capacity: '10 Gbps Aggregation (144 Core)',
      redundancy: 'Connected to Singosari & Klojen',
      activeLoss: '-18.7 dBm',
      connectedTo: ['FDT-BLM-01'],
      description: 'Melayani kawasan industri Karanglo dan Blimbing.',
    },
    {
      id: 'POP-SHT',
      name: 'POP Soekarno Hatta (Suhat)',
      level: 'Tier 3 - Distribution',
      role: 'Sentral Distribusi Pendidikan & Metro',
      capacity: '20 Gbps Aggregation (144 Core)',
      redundancy: 'Metro Education Loop (UB, UM, Polinema)',
      activeLoss: '-17.5 dBm',
      connectedTo: ['POP-BTU'],
      description: 'Melayani area kampus besar dan komersial Suhat.',
    },
    {
      id: 'POP-BTU',
      name: 'POP Alun-Alun Kota Batu',
      level: 'Tier 3 - Distribution',
      role: 'Sentral Distribusi Kota Wisata',
      capacity: '20 Gbps Aggregation (96 Core)',
      redundancy: 'Ring Malang-Batu Protected',
      activeLoss: '-17.8 dBm',
      connectedTo: [],
      description: 'Pusat transmisi destinasi wisata Kota Batu.',
    },
    {
      id: 'POP-KPJ',
      name: 'POP Sentral Kepanjen Pemkab',
      level: 'Tier 3 - Distribution',
      role: 'Sentral Pemerintahan Kabupaten',
      capacity: '10 Gbps Aggregation (144 Core)',
      redundancy: 'South Corridor Ring Link',
      activeLoss: '-16.9 dBm',
      connectedTo: [],
      description: 'Melayani perkantoran dinas Pemkab Malang di Kepanjen.',
    },
  ];

  const currentNodes = activeScheme === 'plan_pertama' ? planPertamaNodes : standardNodes;
  const selectedNode = currentNodes.find(n => n.id === selectedNodeId) || currentNodes[0];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Share2 className="w-4 h-4" />
            <span>DIAGRAM ARSITEKTUR LOGIS TRANSMISI FIBER OPTIK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Logical Network Topology
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Struktur hierarki transmisi kabel serat optik: Super Backbone, Pusat Agregasi Titik 0, dan Jalur Distribusi ULP.
          </p>
        </div>

        {/* Scheme Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveScheme('plan_pertama');
              setSelectedNodeId('NODE-GI-KBG');
              showToast('Beralih ke Skema Plan Pertama (Titik 0 GI Kebon Agung)', 'info');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeScheme === 'plan_pertama'
                ? 'bg-purple-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Plan Pertama (Titik 0 GI Kebon Agung)</span>
          </button>

          <button
            onClick={() => {
              setActiveScheme('tier_standard');
              setSelectedNodeId('BONE-SBY');
              showToast('Beralih ke Hierarki Standar Multi-Tier', 'info');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeScheme === 'tier_standard'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Tier Malang Raya</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Schematic + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Diagram Area */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs relative">
          
          {/* ================= VIEW 1: PLAN PERTAMA TOPOLOGY ================= */}
          {activeScheme === 'plan_pertama' && (
            <div className="space-y-6">
              
              {/* Context Banner */}
              <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                    0
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-purple-950">
                      PLAN PERTAMA: SUPER BACKBONE GI LAWANG ➔ GI KEBON AGUNG (TITIK 0)
                    </h4>
                    <p className="text-[11px] text-purple-700 font-mono mt-0.5">
                      Titik 0 GPS: S 7° 57.368' E 112° 37.642' (Area 45 Malang) · 7 Cabang Distribusi ULP
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('network-map');
                    showToast('Membuka rute Plan Pertama di peta interaktif Google Maps', 'info');
                  }}
                  className="px-3 py-1.5 bg-white border border-purple-300 text-purple-800 rounded-xl hover:bg-purple-100 font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                  <span>Lihat di Map</span>
                </button>
              </div>

              {/* LEVEL 1: SUPER BACKBONE ORIGIN (GI LAWANG) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span>ORIGIN BACKBONE UTARA</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">288 Core · 100G DWDM Trunk</span>
                </div>

                <div className="flex justify-center">
                  <div
                    onClick={() => setSelectedNodeId('NODE-GI-LWG')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all w-full max-w-md ${
                      selectedNodeId === 'NODE-GI-LWG'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/30 shadow-sm'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">GI LAWANG</h4>
                          <span className="text-[10px] font-mono text-indigo-700 font-semibold">
                            Super Backbone Origin (Malang Utara)
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                        288 Core
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUPER BACKBONE CONNECTOR BADGE */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="h-6 w-0.5 bg-indigo-300" />
                <div className="px-3.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold shadow-xs flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>SUPER BACKBONE TRUNK: 24.5 KM (DWDM 100G)</span>
                </div>
                <div className="h-6 w-0.5 bg-purple-300" />
                <ArrowDown className="w-4 h-4 text-purple-600 -mt-1" />
              </div>

              {/* LEVEL 2: TITIK 0 SENTRAL (GI KEBON AGUNG) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
                    <span>PUSAT AGREGASI TRANSMISI · TITIK 0</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    S 7° 57.368', E 112° 37.642'
                  </span>
                </div>

                <div className="flex justify-center">
                  <div
                    onClick={() => setSelectedNodeId('NODE-GI-KBG')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all w-full max-w-lg ${
                      selectedNodeId === 'NODE-GI-KBG'
                        ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-500/20 shadow-md'
                        : 'border-purple-300 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                          0
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900">
                              POP SHELTER GI KEBON AGUNG
                            </h3>
                            <span className="px-2 py-0.5 bg-purple-700 text-white text-[9px] font-mono font-bold rounded-md">
                              TITIK 0
                            </span>
                          </div>
                          <p className="text-xs text-purple-800 font-semibold mt-0.5">
                            Sub-Transmission Master Hub &amp; Ruang Shelter ODF
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-1">
                            Kapasitas: 288 Core · Utilisasi: 240 Core (83%) · Loss: -14.0 dBm
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        ● Optimal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RADIATING CONNECTOR */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="h-6 w-0.5 bg-purple-400" />
                <div className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold shadow-xs flex items-center gap-2">
                  <Compass className="w-3 h-3 text-purple-400" />
                  <span>KEBON AGUNG KE MANA AJA? (7 RUTE AREA MALANG)</span>
                </div>
                <div className="h-6 w-0.5 bg-slate-300" />
                <ArrowDown className="w-4 h-4 text-slate-500 -mt-1" />
              </div>

              {/* LEVEL 3: 7 RADIATING BRANCHES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                    7 POP DISTRIBUSI ULP &amp; ODC TERDISTRIBUSI
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Klik kartu untuk melihat port core &amp; redaman
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'NODE-ULP-KPJ',
                      name: 'POP ODC GUDANG ULP KEPANJEN',
                      tag: 'Selatan · Pemkab',
                      cores: '96 Core',
                      dist: '18.4 km',
                      loss: '-17.2 dBm',
                      color: 'border-l-blue-600',
                    },
                    {
                      id: 'NODE-ULP-GDL',
                      name: 'POP ODC ULP GONDANGLEGI',
                      tag: 'Tenggara · Pabrik Gula',
                      cores: '72 Core',
                      dist: '22.1 km',
                      loss: '-18.0 dBm',
                      color: 'border-l-teal-600',
                    },
                    {
                      id: 'NODE-ULP-DMP',
                      name: 'POP ULP DAMPIT',
                      tag: 'Frontier Timur',
                      cores: '48 Core',
                      dist: '31.8 km',
                      loss: '-19.4 dBm',
                      color: 'border-l-rose-600',
                    },
                    {
                      id: 'NODE-ULP-SBP',
                      name: 'POP ODC ULP SUMBERPUCUNG',
                      tag: 'Barat-Selatan · PLTA',
                      cores: '48 Core',
                      dist: '24.2 km',
                      loss: '-18.5 dBm',
                      color: 'border-l-amber-600',
                    },
                    {
                      id: 'NODE-ULP-KBG',
                      name: 'POP ODC ULP KEBON AGUNG',
                      tag: 'Ring Lokal · PG Kebonagung',
                      cores: '96 Core',
                      dist: '2.4 km',
                      loss: '-15.1 dBm',
                      color: 'border-l-purple-600',
                    },
                    {
                      id: 'NODE-UP3-MLG',
                      name: 'POP UP3 MALANG',
                      tag: 'Kantor Induk · Jl. Basuki Rahmat',
                      cores: '144 Core',
                      dist: '6.8 km',
                      loss: '-15.8 dBm',
                      color: 'border-l-indigo-600',
                    },
                    {
                      id: 'NODE-ODC-SKL',
                      name: 'POP ODC SENGKALING',
                      tag: 'Barat · Dau & Wisata',
                      cores: '48 Core',
                      dist: '12.3 km',
                      loss: '-17.5 dBm',
                      color: 'border-l-emerald-600',
                    },
                  ].map(branch => {
                    const isSelected = selectedNodeId === branch.id;
                    return (
                      <div
                        key={branch.id}
                        onClick={() => setSelectedNodeId(branch.id)}
                        className={`p-3.5 rounded-xl border border-l-4 ${branch.color} cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {branch.name}
                            </h5>
                            <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">
                              {branch.tag}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded">
                            {branch.cores}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-600">
                          <span>Jarak: <strong className="text-slate-900">{branch.dist}</strong></span>
                          <span>Redaman: <strong className="text-emerald-700">{branch.loss}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================= VIEW 2: MULTI-TIER STANDAR MALANG RAYA ================= */}
          {activeScheme === 'tier_standard' && (
            <div className="space-y-8">
              {/* TIER 1 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>TIER 1 · SUPER BACKBONE GATEWAY</span>
                </div>
                <div className="flex justify-center">
                  <div
                    onClick={() => setSelectedNodeId('BONE-SBY')}
                    className={`p-4 rounded-xl border text-center cursor-pointer transition-all max-w-sm w-full ${
                      selectedNodeId === 'BONE-SBY'
                        ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Server className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
                    <h4 className="text-sm font-bold text-slate-900">Surabaya Main Gateway</h4>
                    <p className="text-[11px] font-mono text-indigo-600 font-semibold mt-0.5">DWDM 100 Gbps Core</p>
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              <div className="flex justify-center">
                <ArrowDown className="w-5 h-5 text-slate-400 animate-pulse" />
              </div>

              {/* TIER 2 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>TIER 2 · POP BACKBONE SENTRAL MALANG</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedNodeId('POP-KLJ')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedNodeId === 'POP-KLJ'
                        ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">POP Klojen Sentral (Hub)</h4>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">40G</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Aggregator Jaringan Kota</p>
                  </div>

                  <div
                    onClick={() => setSelectedNodeId('POP-LWG')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedNodeId === 'POP-LWG'
                        ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">POP Lawang Transit</h4>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">10G</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Perbatasan Pasuruan</p>
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              <div className="flex justify-center">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>

              {/* TIER 3 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-sky-600 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>TIER 3 · DISTRIBUSI KAWASAN</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'POP-BLM', name: 'POP Blimbing', tag: 'Industri' },
                    { id: 'POP-SHT', name: 'POP Suhat', tag: 'Kampus' },
                    { id: 'POP-BTU', name: 'POP Batu', tag: 'Wisata' },
                    { id: 'POP-KPJ', name: 'POP Kepanjen', tag: 'Pemkab' },
                  ].map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedNodeId(sub.id)}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedNodeId === sub.id
                          ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 text-slate-900 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <h5 className="text-xs font-bold text-slate-900">{sub.name}</h5>
                      <span className="text-[10px] text-sky-700 font-semibold block font-mono mt-0.5">{sub.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right: Technical Inspector Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 sticky top-6 shadow-xs text-slate-800">
          
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-bold text-purple-600 uppercase tracking-wider">
              INSPEKTUR SIMPUL TOPOLOGI
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
              {selectedNode.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedNode.level}</p>
          </div>

          <div className="space-y-3 text-xs">
            
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase">Peran &amp; Deskripsi</span>
              <p className="text-xs text-slate-800 leading-snug font-medium">
                {selectedNode.role}
              </p>
              {selectedNode.description && (
                <p className="text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60">
                  {selectedNode.description}
                </p>
              )}
            </div>

            {selectedNode.coordinates && (
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-0.5">
                <span className="text-purple-700 text-[10px] font-mono uppercase font-semibold">
                  Koordinat Lokasi GPS
                </span>
                <p className="text-xs font-mono font-bold text-purple-950">
                  {selectedNode.coordinates}
                </p>
              </div>
            )}

            {selectedNode.distanceToCenter && (
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-0.5">
                <span className="text-blue-700 text-[10px] font-mono uppercase font-semibold">
                  Jarak ke Titik 0 Sentral
                </span>
                <p className="text-xs font-mono font-bold text-blue-950">
                  {selectedNode.distanceToCenter}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase">Kapasitas Transmisi Core</span>
              <p className="text-sm font-bold text-slate-900 font-mono">{selectedNode.capacity}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase">Skema Proteksi Redundansi</span>
              <p className="text-xs text-blue-700 font-semibold">{selectedNode.redundancy}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase">Redaman Optik (Loss)</span>
              <p className="text-sm font-bold font-mono text-emerald-600">{selectedNode.activeLoss}</p>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-medium text-slate-600 mb-2">Simpul Terhubung:</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.connectedTo.length > 0 ? (
                selectedNode.connectedTo.map(cId => {
                  const target = currentNodes.find(n => n.id === cId);
                  return (
                    <button
                      key={cId}
                      onClick={() => setSelectedNodeId(cId)}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200 font-semibold transition-colors"
                      title={target?.name || cId}
                    >
                      → {target ? target.name.split(' ')[0] : cId}
                    </button>
                  );
                })
              ) : (
                <span className="text-xs text-slate-400 font-mono">End-point terminal</span>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setCurrentView('network-map');
                showToast(`Membuka simpul [${selectedNode.name}] di Network Map`, 'info');
              }}
              className="w-full py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Buka Lokasi di Peta Map</span>
            </button>

            <button
              onClick={() => openCoreDetail(dataCoreList[0])}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Buka SLD &amp; Data Core Terkait</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
