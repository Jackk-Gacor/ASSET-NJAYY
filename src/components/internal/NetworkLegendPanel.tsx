import React, { useState } from 'react';
import {
  Layers,
  X,
  Radio,
  Network,
  Activity,
  AlertTriangle,
  Scissors,
  Route,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  Compass,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { NetworkNode } from '../../types';
import { NetworkLink } from './NetworkMapView';

interface NetworkLegendPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  nodes: NetworkNode[];
  links: NetworkLink[];
  cutLinks: string[];
  activeRegion: string;
  onSelectRegion?: (region: string) => void;
  showBackbone: boolean;
  setShowBackbone: (show: boolean) => void;
  showFeeder: boolean;
  setShowFeeder: (show: boolean) => void;
  showUplink: boolean;
  setShowUplink: (show: boolean) => void;
  showRing: boolean;
  setShowRing: (show: boolean) => void;
}

export const NetworkLegendPanel: React.FC<NetworkLegendPanelProps> = ({
  isOpen,
  onClose,
  onToggle,
  nodes,
  links,
  cutLinks,
  activeRegion,
  onSelectRegion,
  showBackbone,
  setShowBackbone,
  showFeeder,
  setShowFeeder,
  showUplink,
  setShowUplink,
  showRing,
  setShowRing,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'fiber' | 'nodes' | 'zones'>('all');

  // Dynamic calculations
  const totalCores = nodes.reduce((acc, n) => acc + n.capacityCores, 0);
  const usedCores = nodes.reduce((acc, n) => acc + n.usedCores, 0);
  const backboneCount = links.filter(l => l.type === 'BACKBONE').length;
  const feederCount = links.filter(l => l.type === 'FEEDER').length;
  const ringCount = links.filter(l => l.type === 'RING').length;
  const uplinkCount = links.filter(l => l.type === 'UPLINK').length;
  const warningNodesCount = nodes.filter(n => n.status === 'Warning').length;

  return (
    <>
      {/* ================= FLOATING LAUNCHER BUTTON ON MAP ================= */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute bottom-4 left-4 z-20 bg-white/95 hover:bg-white text-slate-800 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200/90 flex items-center gap-2.5 text-xs font-semibold hover:border-blue-400 hover:shadow-xl transition-all group"
          title="Buka Legenda Simbol & Kode Warna Jaringan"
        >
          <div className="w-6 h-6 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-slate-900 group-hover:text-blue-600 leading-none">
              Legenda &amp; Simbol
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">
              Fiber · Node · Zona ({links.length} Link)
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      )}

      {/* ================= SLIDE-OUT PANEL ================= */}
      <div
        className={`absolute top-3 bottom-3 left-3 w-88 max-w-[calc(100%-1.5rem)] z-30 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Legenda &amp; Simbol Jaringan
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Standar Kode Visual PLN Icon Plus Malang
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Tutup Legenda"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Tabs */}
          <div className="p-2 border-b border-slate-100 bg-white grid grid-cols-4 gap-1 text-[11px] font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-1 rounded-lg transition-colors text-center ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('fiber')}
              className={`py-1 rounded-lg transition-colors text-center ${
                activeTab === 'fiber'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Fiber FO
            </button>
            <button
              onClick={() => setActiveTab('nodes')}
              className={`py-1 rounded-lg transition-colors text-center ${
                activeTab === 'nodes'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Simpul
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-1 rounded-lg transition-colors text-center ${
                activeTab === 'zones'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Zona
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            
            {/* ================= 1. FIBER INFRASTRUCTURE ================= */}
            {(activeTab === 'all' || activeTab === 'fiber') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <Radio className="w-3.5 h-3.5 text-blue-600" />
                    <span>Infrastruktur Fiber Optik</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {links.length} Jalur Kabel
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Backbone */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-1.5 bg-indigo-600 rounded-full shadow-xs" />
                        <span className="font-bold text-slate-900">Kabel Backbone Utama</span>
                      </div>
                      <button
                        onClick={() => setShowBackbone(!showBackbone)}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                          showBackbone
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                        title="Tampilkan / Sembunyikan Layer Backbone"
                      >
                        {showBackbone ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        <span>{backboneCount} Jalur</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Trunk kapasitas tinggi (288 Core / 100G). Menghubungkan Super Backbone GI Lawang ⇄ GI Kebon Agung (Titik 0 Sentral Malang).
                    </p>
                  </div>

                  {/* Feeder */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-1 bg-sky-500 rounded-full" />
                        <span className="font-bold text-slate-900">Kabel Feeder Distribusi</span>
                      </div>
                      <button
                        onClick={() => setShowFeeder(!showFeeder)}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                          showFeeder
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                        title="Tampilkan / Sembunyikan Layer Feeder"
                      >
                        {showFeeder ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        <span>{feederCount} Jalur</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Kabel distribusi sentral ke klaster pelanggan &amp; ODC (48–96 Core), redaman standar -17 hingga -19 dBm.
                    </p>
                  </div>

                  {/* Ring Loop */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-1 border-b-2 border-dashed border-emerald-500" />
                        <span className="font-bold text-slate-900">Ring Loop Redundansi</span>
                      </div>
                      <button
                        onClick={() => setShowRing(!showRing)}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                          showRing
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                        title="Tampilkan / Sembunyikan Layer Ring Loop"
                      >
                        {showRing ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        <span>{ringCount} Loop</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Topologi melingkar 360° dengan self-healing switching (&lt; 50 ms) jika salah satu sisi kabel putus.
                    </p>
                  </div>

                  {/* Uplink */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-1 bg-cyan-400 rounded-full" />
                        <span className="font-bold text-slate-900">Uplink Transit Gateway</span>
                      </div>
                      <button
                        onClick={() => setShowUplink(!showUplink)}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                          showUplink
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                        title="Tampilkan / Sembunyikan Layer Uplink"
                      >
                        {showUplink ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        <span>{uplinkCount} Jalur</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Port transmisi 10G/40G langsung ke node backbone transit dan gateway provinsi.
                    </p>
                  </div>

                  {/* Fiber Cut Status */}
                  <div className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/40 space-y-1">
                    <div className="flex items-center justify-between text-rose-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-1 border-b-2 border-dashed border-rose-600" />
                        <span className="font-bold">Kabel Putus (Fiber Cut)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                        {cutLinks.length} Event
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-600 leading-snug">
                      Garis merah putus-putus menandakan kabel mengalami gangguan fisik atau pemutusan simulasi.
                    </p>
                  </div>

                  {/* Traced Route */}
                  <div className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <span className="w-5 h-2 bg-emerald-400 rounded-full ring-2 ring-emerald-300/50 shadow-xs" />
                      <span className="font-bold">Jalur Tracing Aktif (A→B)</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-snug">
                      Garis berpendar hijau menandakan rute optik terpendek yang sedang dianalisis oleh teknisi.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2. NETWORK NODES ================= */}
            {(activeTab === 'all' || activeTab === 'nodes') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <Network className="w-3.5 h-3.5 text-blue-600" />
                    <span>Simpul Sentral &amp; POP</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {nodes.length} Simpul Aktif
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Super Backbone Origin */}
                  <div className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="relative mt-0.5 shrink-0">
                      <span className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white ring-2 ring-indigo-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">Super Backbone Origin</span>
                        <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
                          GI LAWANG · 288 Core
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        GI Lawang, gerbang super backbone transmisi utama dari arah utara.
                      </p>
                    </div>
                  </div>

                  {/* Sentral Titik 0 Malang */}
                  <div className="flex items-start gap-2.5 p-2 rounded-xl border border-purple-200 bg-purple-50/50">
                    <div className="relative mt-0.5 shrink-0">
                      <span className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white ring-2 ring-purple-300 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-purple-950">POP Sentral Titik 0 Malang</span>
                        <span className="text-[9px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                          GI KEBON AGUNG · 288 Core
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-700 mt-0.5">
                        POP Shelter GI Kebon Agung (S7° 57.368&apos; E112° 37.642&apos;), simpul sentral percabangan 7 arah ke POP Distribusi ULP.
                      </p>
                    </div>
                  </div>

                  {/* 7 POP Distribusi */}
                  <div className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="relative mt-0.5 shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-2 ring-emerald-300">
                        <span className="w-1 h-1 rounded-full bg-white" />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">7 POP Distribusi</span>
                        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                          48–144 Core
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Gudang ULP Kepanjen, ULP Gongdanglegi, ULP Dampit, ULP Sumberpucung, ULP Kebong Agung, UP3 Malang, dan ODC Sengkaling.
                      </p>
                    </div>
                  </div>

                  {/* Node Status Markers */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div>
                        <span className="font-bold text-emerald-900 block leading-tight">Optimal</span>
                        <span className="text-[10px] text-emerald-700 font-mono">Redaman normal</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/60 border border-amber-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <div>
                        <span className="font-bold text-amber-900 block leading-tight">Perhatian</span>
                        <span className="text-[10px] text-amber-700 font-mono">{warningNodesCount} Simpul</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 3. MAINTENANCE & REGIONAL ZONES ================= */}
            {(activeTab === 'all' || activeTab === 'zones') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span>Zona Pemeliharaan &amp; Wilayah</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    5 Sektor Patroli
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      name: 'Malang Kota Metro',
                      code: 'ZONA-01',
                      desc: 'Klojen, Blimbing, Suhat, Sukun. Koridor perkantoran & perbankan, jalur duct bawah tanah & tiang.',
                      color: 'border-l-blue-500',
                    },
                    {
                      name: 'Kota Wisata Batu',
                      code: 'ZONA-02',
                      desc: 'Alun-Alun Batu & Bumiaji. Kontur bukit curam, kabel ADSS gawang tiang PLN proteksi petir.',
                      color: 'border-l-teal-500',
                    },
                    {
                      name: 'Koridor Utara (Lawang & Singosari)',
                      code: 'ZONA-03',
                      desc: 'Gerbang perbatasan Pasuruan & KEK Singhasari, jalur industri & transit fiber backbone.',
                      color: 'border-l-indigo-500',
                    },
                    {
                      name: 'Poros Selatan (Kepanjen)',
                      code: 'ZONA-04',
                      desc: 'Sentral administrasi Pemkab Malang, terhubung ke Gardu Induk PLN Kebonagung.',
                      color: 'border-l-amber-500',
                    },
                    {
                      name: 'Sub-Hub Turen & Dampit',
                      code: 'ZONA-05',
                      desc: 'Zona ekspansi fiber ke wilayah selatan/timur, penarikan kabel distribusi 24–48 core.',
                      color: 'border-l-rose-500',
                    },
                  ].map(zone => (
                    <div
                      key={zone.code}
                      onClick={() => onSelectRegion && onSelectRegion(zone.name.includes('Batu') ? 'Kota Batu' : zone.name.includes('Utara') ? 'Singosari (Malang Utara)' : zone.name.includes('Selatan') ? 'Kepanjen (Malang Selatan)' : zone.name.includes('Turen') ? 'Turen & Dampit' : 'Malang Kota')}
                      className={`p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 border-l-4 ${zone.color} cursor-pointer transition-all space-y-1 shadow-2xs`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{zone.name}</span>
                        <span className="text-[9px] font-mono text-slate-400">{zone.code}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {zone.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* SOP Preventif */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>SOP Patroli Preventif Lapangan</span>
                  </div>
                  <p className="text-[11px] text-blue-800/80 leading-relaxed">
                    Pengukuran redaman OTDR berkala tiap 3 bulan pada seluruh joint closure tiang PLN dan verifikasi redaman batas maksimal -22 dBm.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Metrics */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] font-mono text-slate-600 shrink-0">
            <span>Utilisasi Total:</span>
            <span className="font-bold text-slate-900">
              {usedCores} / {totalCores} Core ({Math.round((usedCores / totalCores) * 100)}%)
            </span>
          </div>

        </div>
      </div>
    </>
  );
};
