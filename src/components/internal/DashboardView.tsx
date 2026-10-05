import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  RotateCcw,
  Database,
  Settings,
  GitFork,
  MapPin,
  BarChart2,
  ArrowRight,
  HelpCircle,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [showHelpModal, setShowHelpModal] = useState(false);

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
      {/* 3. 5 KPI CARDS (CLEAN & GENEROUS WHITESPACE)              */}
      {/* ========================================================= */}
      <div className="space-y-5">
        
        {/* Row 1: 3 Equal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
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

        </div>

        {/* Row 2: 2 Cards (same column width, leaving spacious whitespace on the 3rd spot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* KPI 4: Field Report */}
          <div
            onClick={() => setCurrentView('field')}
            className="bg-white border border-slate-200/80 hover:border-blue-400/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Field Report
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  18
                </div>
                <div className="text-xs font-semibold text-teal-600 mt-1 flex items-center gap-1">
                  <span>3 hari ini</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* KPI 5: Approved / WIG */}
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

          {/* Empty 3rd column to maintain generous whitespace exactly like reference */}
          <div className="hidden lg:block pointer-events-none" />

        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. NETWORK OVERVIEW (CLEAN TOPOLOGY SUMMARY)             */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header of Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Network Overview
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Status konektivitas cincin backbone & distribusi optik Malang Raya.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kondisi Jaringan: Optimal (Latensi &lt; 2ms)</span>
          </div>
        </div>

        {/* Minimal Schematic Ring Diagram (as requested in spec) */}
        <div 
          onClick={() => setCurrentView('network-map')}
          className="py-6 px-4 flex flex-col items-center justify-center cursor-pointer group/diag rounded-xl hover:bg-slate-50/60 transition-colors"
          title="Klik untuk membuka Network Map interaktif"
        >
          
          <div className="w-full max-w-lg relative flex items-center justify-center py-4">
            <svg
              viewBox="0 0 460 170"
              className="w-full h-auto max-h-44 text-blue-500 overflow-visible group-hover/diag:scale-[1.02] transition-transform"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ring Connections Lines */}
              <path
                d="M 100 85 L 175 35 L 285 35 L 360 85 L 285 135 L 175 135 Z"
                stroke="#CBD5E1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Optical Pulse Path */}
              <path
                d="M 100 85 L 175 35 L 285 35 L 360 85 L 285 135 L 175 135 Z"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeDasharray="10 8"
                className="animate-[dash_20s_linear_infinite]"
              />

              {/* Spur Line to Backbone (as indicated in ASCII diagram) */}
              <line
                x1="360"
                y1="85"
                x2="430"
                y2="85"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Node 1: Malang Kota (West) */}
              <circle cx="100" cy="85" r="9" fill="#1D4ED8" />
              <circle cx="100" cy="85" r="15" fill="#3B82F6" fillOpacity="0.2" />
              <text x="100" y="112" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                Malang Kota
              </text>

              {/* Node 2: Singosari (North-West) */}
              <circle cx="175" cy="35" r="7.5" fill="#2563EB" />
              <text x="175" y="23" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                Singosari
              </text>

              {/* Node 3: Lawang (North-East) */}
              <circle cx="285" cy="35" r="7.5" fill="#2563EB" />
              <text x="285" y="23" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                Lawang
              </text>

              {/* Node 4: Kepanjen (East Hub) */}
              <circle cx="360" cy="85" r="9" fill="#1D4ED8" />
              <circle cx="360" cy="85" r="15" fill="#3B82F6" fillOpacity="0.2" />
              <text x="360" y="112" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                Kepanjen
              </text>

              {/* Node 5: Turen & Dampit (Spur Extension) */}
              <circle cx="430" cy="85" r="6.5" fill="#0284C7" />
              <text x="430" y="105" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                Turen / Dampit
              </text>

              {/* Node 6: Batu (South-West) */}
              <circle cx="175" cy="135" r="7.5" fill="#2563EB" />
              <text x="175" y="153" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                Kota Batu
              </text>

              {/* Node 7: Malang Selatan (South-East) */}
              <circle cx="285" cy="135" r="7.5" fill="#2563EB" />
              <text x="285" y="153" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                Malang Selatan
              </text>
            </svg>
          </div>

          <div className="mt-3 text-xs font-mono font-bold tracking-widest text-slate-600 uppercase">
            Malang Network
          </div>

        </div>

        {/* CTA to Network Map */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Ingin mengeksplorasi koordinat geografis OLT, POP, dan redaman rute secara interaktif?
          </p>
          <button
            onClick={() => setCurrentView('network-map')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0 group"
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
                <strong className="text-slate-900 block font-semibold">5 KPI Utama</strong>
                <span className="text-slate-500">Ringkasan titik core, jalur feeder aktif, pipa uplink, field report, dan status WIG.</span>
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
