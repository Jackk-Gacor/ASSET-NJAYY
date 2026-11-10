import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_NETWORK_NODES, INITIAL_RINGS } from '../../data/initialData';
import {
  Search,
  RotateCcw,
  Database,
  Settings,
  GitFork,
  BarChart2,
  ArrowRight,
  HelpCircle,
  X,
} from 'lucide-react';

const RING_COLORS: Record<string, { stroke: string; badge: string; dot: string; label: string }> = {
  'RING-01': {
    stroke: '#10b981',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Poros Selatan',
  },
  'RING-02': {
    stroke: '#38bdf8',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    label: 'Poros Barat-Kota',
  },
  'RING-03': {
    stroke: '#a855f7',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    label: 'Poros Utara-Industri',
  },
  'RING-04': {
    stroke: '#f59e0b',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Timur Agregasi',
  },
};

const SCHEMATIC_POSITIONS: Record<string, { x: number; y: number; labelPos: 'top' | 'bottom'; short: string }> = {
  'NODE-GI-KBG': { x: 440, y: 210, labelPos: 'bottom', short: '★ GI Kebon Agung' },
  'NODE-ULP-KBG': { x: 565, y: 210, labelPos: 'bottom', short: 'ULP Kebon Agung' },
  'NODE-UP3-MLG': { x: 440, y: 130, labelPos: 'top', short: 'UP3 Malang' },
  // RING-02: Poros Barat-Kota (Top-Left)
  'NODE-ULP-DNY': { x: 330, y: 90, labelPos: 'top', short: 'Dinoyo' },
  'NODE-ODC-BGW': { x: 215, y: 90, labelPos: 'top', short: 'Begawan' },
  'NODE-TK4-MLY': { x: 115, y: 145, labelPos: 'top', short: 'Mulyoagung' },
  'NODE-ODC-SKL': { x: 115, y: 235, labelPos: 'bottom', short: 'Sengkaling' },
  'NODE-ULP-BATU': { x: 240, y: 235, labelPos: 'bottom', short: 'Kota Batu' },
  // RING-03 & RING-04: Utara & Timur (Top-Right)
  'NODE-ULP-BLM': { x: 560, y: 100, labelPos: 'top', short: 'Blimbing' },
  'NODE-ULP-SGS': { x: 680, y: 100, labelPos: 'top', short: 'Singosari' },
  'NODE-GI-LWG': { x: 775, y: 165, labelPos: 'top', short: 'GI Lawang' },
  'NODE-TK4-SDR': { x: 725, y: 245, labelPos: 'bottom', short: 'Sidorejo' },
  // RING-01: Poros Selatan (Bottom)
  'NODE-ULP-KPJ': { x: 325, y: 325, labelPos: 'bottom', short: 'Kepanjen' },
  'NODE-ULP-SBP': { x: 190, y: 355, labelPos: 'bottom', short: 'Sumberpucung' },
  'NODE-ULP-GDL': { x: 555, y: 355, labelPos: 'bottom', short: 'Gondanglegi' },
  'NODE-ULP-DMP': { x: 690, y: 325, labelPos: 'bottom', short: 'Dampit' },
};

export const DashboardView: React.FC = () => {
  const { setCurrentView, navigateToMapNode } = useApp();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedRingId, setSelectedRingId] = useState<string>('ALL');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Formatted date string (e.g., "20 MEI 2025" or dynamic current date)
  const currentDateStr = new Date()
    .toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();

  return (
    <div className="space-y-8 pb-12 text-slate-800">

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
        
        {/* Left: Overview kicker, headline, and subtitle */}
        <div className="max-w-2xl space-y-2.5">
          <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">
            OVERVIEW • {currentDateStr || '20 MEI 2025'}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Selamat datang di Network Command.
          </h1>

          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
            Pantau integritas data dan aktivitas aset wilayah Malang dalam satu ruang.
          </p>
        </div>

        {/* Right: Big CTA Button "Cari Data Core" */}
        <div className="shrink-0">
          <button
            onClick={() => setCurrentView('search')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-3.5 group"
          >
            <Search className="w-5 h-5 text-blue-100 group-hover:scale-110 transition-transform" />
            <span>Cari Data Core</span>
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. NETWORK SNAPSHOT NOTICE CARD                           */}
      {/* ========================================================= */}
      <div className="bg-[#EBF3FF] border border-[#D5E5FE] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              Network snapshot stabil
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh visualisasi menggunakan data simulasi, bukan jaringan aktual.
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-blue-600 bg-white/90 border border-blue-100 uppercase shadow-xs">
            CONTOH DATA
          </span>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. 4 KPI CARDS (CLEAN & GENEROUS WHITESPACE)              */}
      {/* ========================================================= */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* KPI 1: Total Data Core */}
          <div
            onClick={() => setCurrentView('search')}
            className="bg-white border border-slate-200/80 hover:border-blue-400/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Total Data Core
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  8
                </div>
                <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* KPI 2: Total Feeder */}
          <div
            onClick={() => setCurrentView('engineering-feeder')}
            className="bg-white border border-slate-200/80 hover:border-blue-400/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Total Feeder
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  36
                </div>
                <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>+4 baru</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* KPI 3: Total Uplink */}
          <div
            onClick={() => setCurrentView('engineering-uplink')}
            className="bg-white border border-slate-200/80 hover:border-blue-400/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Total Uplink
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  24
                </div>
                <div className="text-xs font-semibold text-teal-600 mt-1 flex items-center gap-1">
                  <span>98% lengkap</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GitFork className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* KPI 4: Approved / WIG */}
          <div
            onClick={() => setCurrentView('reports')}
            className="bg-white border border-slate-200/80 hover:border-blue-400/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Approved / WIG
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  45
                </div>
                <div className="text-xs font-semibold text-teal-600 mt-1 flex items-center gap-1">
                  <span>92.4%</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. NETWORK OVERVIEW (SIMPLE & SYNCHRONIZED WITH RING MAP) */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header of Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Network &amp; Ring Overview
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Skema topologi valid Area 45: {INITIAL_NETWORK_NODES.length} Simpul POP · {INITIAL_RINGS.length} Ring Proteksi berpusat di GI Kebon Agung (Titik 0).
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>4 Ring Protected (Optimal)</span>
          </div>
        </div>

        {/* Simple Ring Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedRingId('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedRingId === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Ring ({INITIAL_NETWORK_NODES.length} POP)
          </button>
          {INITIAL_RINGS.map(ring => {
            const theme = RING_COLORS[ring.id] || RING_COLORS['RING-01'];
            const isActive = selectedRingId === ring.id;
            return (
              <button
                key={ring.id}
                type="button"
                onClick={() => setSelectedRingId(isActive ? 'ALL' : ring.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                <span>{ring.id} · {theme.label}</span>
              </button>
            );
          })}
        </div>

        {/* Clean Light-Mode Synchronized Ring Schematic */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <svg
              viewBox="20 45 840 355"
              className="w-full h-auto max-h-80 overflow-visible select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Spur link GI Kebon Agung -> ULP Kebon Agung */}
              <line
                x1={SCHEMATIC_POSITIONS['NODE-GI-KBG'].x}
                y1={SCHEMATIC_POSITIONS['NODE-GI-KBG'].y}
                x2={SCHEMATIC_POSITIONS['NODE-ULP-KBG'].x}
                y2={SCHEMATIC_POSITIONS['NODE-ULP-KBG'].y}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                opacity={selectedRingId === 'ALL' ? 0.7 : 0.2}
              />

              {/* 4 Real Ring Loops */}
              {INITIAL_RINGS.map(ring => {
                const theme = RING_COLORS[ring.id] || RING_COLORS['RING-01'];
                const isHighlighted = selectedRingId === 'ALL' || selectedRingId === ring.id;
                const ringCoords = ring.nodes
                  .map(rn => SCHEMATIC_POSITIONS[rn.id])
                  .filter(Boolean);

                if (ringCoords.length < 2) return null;
                const pointsStr = [...ringCoords, ringCoords[0]]
                  .map(p => `${p.x},${p.y}`)
                  .join(' ');

                return (
                  <g key={ring.id} opacity={isHighlighted ? 1 : 0.14} className="transition-opacity duration-200">
                    <polyline
                      points={pointsStr}
                      stroke={theme.stroke}
                      strokeWidth={selectedRingId === ring.id ? 4 : 2.5}
                      strokeOpacity={0.22}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    <polyline
                      points={pointsStr}
                      stroke={theme.stroke}
                      strokeWidth={selectedRingId === ring.id ? 2.5 : 1.75}
                      strokeDasharray="8 6"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* 16 Real POP Nodes */}
              {INITIAL_NETWORK_NODES.map(node => {
                const pos = SCHEMATIC_POSITIONS[node.id] || {
                  x: node.x,
                  y: node.y,
                  labelPos: 'bottom' as const,
                  short: node.code,
                };
                const nodeRings = INITIAL_RINGS.filter(r => r.nodes.some(rn => rn.id === node.id));
                const inSelectedRing =
                  selectedRingId === 'ALL' || nodeRings.some(r => r.id === selectedRingId);
                const isTitik0 = node.id === 'NODE-GI-KBG';
                const isSuperBackbone = node.type === 'SUPER_BACKBONE';
                const isHovered = hoveredNodeId === node.id;

                const primaryRingId =
                  selectedRingId !== 'ALL' && nodeRings.some(r => r.id === selectedRingId)
                    ? selectedRingId
                    : nodeRings[0]?.id || 'RING-01';
                const nodeColor = isTitik0
                  ? '#7c3aed'
                  : (RING_COLORS[primaryRingId]?.stroke || '#64748b');

                return (
                  <g
                    key={node.id}
                    onClick={() => navigateToMapNode(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    opacity={inSelectedRing ? 1 : 0.2}
                    className="cursor-pointer transition-opacity duration-200"
                  >
                    {(isTitik0 || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isTitik0 ? 20 : 15}
                        fill={nodeColor}
                        fillOpacity={0.16}
                      />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isTitik0 ? 10 : isSuperBackbone ? 8.5 : 6.5}
                      fill={nodeColor}
                      stroke="#ffffff"
                      strokeWidth={2.5}
                    />
                    <text
                      x={pos.x}
                      y={pos.labelPos === 'top' ? pos.y - 14 : pos.y + 21}
                      textAnchor="middle"
                      fill={isHovered || isTitik0 ? '#0f172a' : '#475569'}
                      fontSize={isTitik0 ? 11.5 : 10.5}
                      fontWeight={isTitik0 || isHovered ? 700 : 600}
                      fontFamily="sans-serif"
                    >
                      {pos.short}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 text-[11px] font-medium text-slate-500 text-center">
            {hoveredNodeId
              ? (() => {
                  const n = INITIAL_NETWORK_NODES.find(item => item.id === hoveredNodeId);
                  return n
                    ? `${n.code} · ${n.usedCores}/${n.capacityCores} Core · Klik untuk buka di Ring Map`
                    : 'Klik simpul POP mana saja untuk langsung membuka detailnya di Network & Ring Map';
                })()
              : 'Klik simpul POP mana saja untuk langsung membuka detailnya di Network & Ring Map'}
          </div>
        </div>

        {/* CTA to Network Map */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Ingin mengeksplorasi koordinat geografis OLT, POP, dan simulasi ring secara interaktif?
          </p>
          <button
            onClick={() => setCurrentView('network-map')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0 group cursor-pointer"
          >
            <span>Lihat Network Map</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. FLOATING HELP BUTTON "?" (AS SHOWN IN SCREENSHOT)     */}
      {/* ========================================================= */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 font-bold text-base flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:shadow-xl transition-all duration-200 z-40"
        title="Bantuan Navigasi Network Command"
      >
        ?
      </button>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Bantuan Network Command</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Dashboard ini dirancang untuk memberikan monitoring ringkas dan cepat tanpa membebani Anda dengan informasi berlebih:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block font-semibold">Cari Data Core</strong>
                <span className="text-slate-500">Pencarian cepat untuk mengecek OLT, POP, redaman, dan dokumen SID/Visio.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block font-semibold">4 KPI Utama</strong>
                <span className="text-slate-500">Ringkasan titik core, jalur feeder aktif, pipa uplink, dan status WIG.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block font-semibold">Network Overview</strong>
                <span className="text-slate-500">Visualisasi topologi ring Malang. Klik 'Lihat Network Map' untuk peta GIS lengkap.</span>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Mengerti, Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
