import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Database,
  Layers,
  Wrench,
  Search,
  Upload,
  Activity,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  FileSpreadsheet,
  Network,
} from 'lucide-react';

export const PublicHero: React.FC = () => {
  const { setIsLoginModalOpen, setCurrentView, dataCoreList, showToast } = useApp();
  const [activeMockupTab, setActiveMockupTab] = useState<'dashboard' | 'asset' | 'operation'>('dashboard');
  const [activeSidebarMenu, setActiveSidebarMenu] = useState<'overview' | 'data-asset' | 'topologi' | 'daily-report'>('overview');

  const scrollToRoles = () => {
    const el = document.getElementById('role-akses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('fitur-dashboard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAFBFD] text-slate-900 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Daily report, lebih cepat. - PLN Icon Plus Blue Palette) */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28">
        
        {/* Subtle background ambient radial lighting in Icon Plus sky/blue */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Subtitle & CTAs */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7">
              
              {/* Badge: Integrated Report System */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-bold text-blue-700 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Integrated Report System</span>
              </div>

              {/* Main Headline: Daily report, lebih cepat. */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Daily report,<br />
                lebih{' '}
                <span className="relative inline-block text-blue-600">
                  cepat.
                  {/* Organic brush underline in cyan/blue */}
                  <svg
                    className="absolute -bottom-2.5 left-0 w-full h-3 text-sky-500/80 pointer-events-none"
                    viewBox="0 0 160 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 8.5C45 2.5 115 3 157 9.5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Satu sistem untuk mengelola drawing jaringan, data asset, dan aktivitas operation secara terpusat (apalagi ini)
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                
                {/* Primary Button: Lihat fitur sistem -> (PLN Icon Plus Blue) */}
                <button
                  type="button"
                  onClick={scrollToFeatures}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-sm flex items-center gap-3 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <span>Lihat fitur sistem</span>
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </button>

                {/* Secondary Button: Kenali role pengguna */}
                <button
                  type="button"
                  onClick={scrollToRoles}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
                >
                  Kenali role pengguna
                </button>
              </div>

              {/* Checked Pills: ✓ Engineering  ✓ Data  ✓ Operation */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                  <span>Engineering</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                  <span>Data</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                  <span>Operation</span>
                </span>
              </div>

            </div>

            {/* Right Column: Interactive DAILY REPORT Dashboard Mockup Card */}
            <div id="fitur-dashboard" className="lg:col-span-6 relative">
              
              {/* Outer decorative card shadow container */}
              <div className="relative mx-auto max-w-lg lg:max-w-none bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-blue-500/10">
                
                {/* Mockup Top Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-xs">
                      <span className="text-xs font-black">+</span>
                    </div>
                    <span className="text-xs font-black tracking-wider text-slate-900">
                      DAILY REPORT
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <button
                      type="button"
                      onClick={() => setActiveMockupTab('dashboard')}
                      className={`hover:text-blue-700 transition-colors cursor-pointer ${
                        activeMockupTab === 'dashboard' ? 'text-blue-700 font-bold' : ''
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMockupTab('asset')}
                      className={`hover:text-blue-700 transition-colors cursor-pointer ${
                        activeMockupTab === 'asset' ? 'text-blue-700 font-bold' : ''
                      }`}
                    >
                      Data Asset
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMockupTab('operation')}
                      className={`hover:text-blue-700 transition-colors cursor-pointer ${
                        activeMockupTab === 'operation' ? 'text-blue-700 font-bold' : ''
                      }`}
                    >
                      Operation
                    </button>
                    <div 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                      title="Profil Pengguna"
                    >
                      AH
                    </div>
                  </div>
                </div>

                {/* Mockup Body: Two Column Mini Workspace + Main Dashboard Content */}
                <div className="grid grid-cols-12 min-h-[380px]">
                  
                  {/* Left Mini Sidebar: WORKSPACE */}
                  <div className="col-span-4 border-r border-slate-100 p-3.5 bg-slate-50/40 space-y-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block px-2">
                      WORKSPACE
                    </span>
                    <nav className="space-y-1 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setActiveSidebarMenu('overview')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                          activeSidebarMenu === 'overview'
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Overview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSidebarMenu('data-asset')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                          activeSidebarMenu === 'data-asset'
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Data Asset</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSidebarMenu('topologi')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                          activeSidebarMenu === 'topologi'
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Topologi</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSidebarMenu('daily-report')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                          activeSidebarMenu === 'daily-report'
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Daily Report</span>
                      </button>
                    </nav>
                  </div>

                  {/* Main Dashboard Canvas */}
                  <div className="col-span-8 p-4 sm:p-5 space-y-4 bg-white flex flex-col justify-between">
                    <div>
                      {/* Dashboard Top Header + Upload Button */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            Dashboard
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Monitoring data jaringan hari ini
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsLoginModalOpen(true);
                            showToast('Silakan login untuk mengunggah berkas data core', 'info');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold tracking-wider transition-all uppercase shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>+ UPLOAD DATA</span>
                        </button>
                      </div>

                      {/* 3 KPI Stats Cards (Total OLT, Drawing, PM Selesai) */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
                        
                        {/* KPI 1: Total OLT */}
                        <div className="p-2 sm:p-2.5 rounded-xl border border-sky-100 bg-sky-50/40 flex flex-col justify-between">
                          <span className="text-[9px] font-bold text-sky-600 uppercase tracking-tight">
                            TERUPDATE
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">Total OLT</span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">
                            128
                          </span>
                        </div>

                        {/* KPI 2: Drawing */}
                        <div className="p-2 sm:p-2.5 rounded-xl border border-blue-100 bg-blue-50/40 flex flex-col justify-between">
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">
                            TERUPDATE
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">Drawing</span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">
                            364
                          </span>
                        </div>

                        {/* KPI 3: PM Selesai */}
                        <div className="p-2 sm:p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex flex-col justify-between">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">
                            TERUPDATE
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">PM selesai</span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">
                            92%
                          </span>
                        </div>

                      </div>

                      {/* Recent OLT Table */}
                      <div className="rounded-xl border border-slate-100 overflow-hidden text-[10px]">
                        <div className="px-3 py-1.5 bg-slate-50/80 flex items-center justify-between border-b border-slate-100">
                          <span className="font-bold text-slate-800">Data OLT terbaru</span>
                          <button
                            type="button"
                            onClick={() => setIsLoginModalOpen(true)}
                            className="text-[9px] text-blue-600 hover:underline font-semibold"
                          >
                            Lihat semua
                          </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                          <div className="px-3 py-1.5 flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800">MLG-KLO-OLT-01</span>
                            <span className="text-slate-500">Klojen</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[9px]">
                              Aktif
                            </span>
                          </div>
                          <div className="px-3 py-1.5 flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800">MLG-BLI-OLT-02</span>
                            <span className="text-slate-500">Blimbing</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[9px]">
                              Aktif
                            </span>
                          </div>
                          <div className="px-3 py-1.5 flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800">MLG-SKU-OLT-01</span>
                            <span className="text-slate-500">Suhat</span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[9px]">
                              Review
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-400 font-mono text-center pt-2">
                      PLN Icon Plus KP Malang · Realtime Sync
                    </div>
                  </div>

                </div>

              </div>

              {/* Floating Pill Badge at Bottom-Left: ✓ Data tersinkronisasi / Baru saja diperbarui */}
              <div className="absolute -bottom-5 left-4 sm:-left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/90 shadow-xl flex items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Data tersinkronisasi
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Baru saja diperbarui
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ROLE & HAK AKSES SECTION (Satu sistem, tiga alur kerja.)               */}
      {/* ========================================================================= */}
      <section id="role-akses" className="py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mb-14">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              ROLE & HAK AKSES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Satu sistem,<br />
              tiga alur kerja.
            </h2>
          </div>

          {/* 3 Interactive Cards (Engineering 01, Data 02, Operation 03) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* CARD 01: Engineering */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
              <div className="space-y-6">
                
                {/* Top: Icon + Number 01 */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    01
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Engineering
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Pengelolaan drawing jaringan yang terstruktur dalam satu akses kerja.
                  </p>
                </div>

                {/* Checklist (Drawing Feeder, Drawing Uplink, Drawing SID) */}
                <ul className="space-y-3 pt-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Drawing Feeder</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Drawing Uplink</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Drawing SID</span>
                  </li>
                </ul>

              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Akses Alur Engineering</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CARD 02: Data */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-sky-300 transition-all duration-300 group">
              <div className="space-y-6">
                
                {/* Top: Icon + Number 02 */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
                    <Database className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    02
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Data
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Upload, validasi, rekapitulasi data core, dan visualisasi topologi.
                  </p>
                </div>

                {/* Checklist (Upload & Data Core, Topologi Area Malang, Rekap Berdasarkan Tanggal) */}
                <ul className="space-y-3 pt-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-600 stroke-[3]" />
                    <span>Upload & Data Core</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-600 stroke-[3]" />
                    <span>Topologi Area Malang</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-600 stroke-[3]" />
                    <span>Rekap Berdasarkan Tanggal</span>
                  </li>
                </ul>

              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Akses Alur Tim Data</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CARD 03: Operation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group">
              <div className="space-y-6">
                
                {/* Top: Icon + Number 03 */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                    <Wrench className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    03
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Operation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Pencatatan Preventive Maintenance yang cepat, konsisten, dan mudah dipantau.
                  </p>
                </div>

                {/* Checklist (Form PM, PIC & Aktivitas, Monitoring Pekerjaan) */}
                <ul className="space-y-3 pt-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Form PM</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>PIC & Aktivitas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Monitoring Pekerjaan</span>
                  </li>
                </ul>

              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Akses Alur Operation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
