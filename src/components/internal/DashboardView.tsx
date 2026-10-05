import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Compass,
  Layers,
  HardHat,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  PlusCircle,
  Search,
  Activity,
  FileCheck,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    dataCoreList,
    feederList,
    uplinkList,
    fieldReportList,
    activityLogs,
    setCurrentView,
    openCoreDetail,
  } = useApp();

  // KPI Calculations
  const totalCore = dataCoreList.length;
  const totalFeeder = feederList.length;
  const totalUplink = uplinkList.length;
  const totalField = fieldReportList.length;
  const totalApprovedWig = dataCoreList.filter(
    c => c.status === 'Approved' || c.status === 'WIG'
  ).length;

  const totalPending = dataCoreList.filter(
    c => c.status === 'In Review' || c.status === 'Pending Field' || c.status === 'Draft'
  ).length;

  // Breakdown by Wilayah
  const regionCounts: Record<string, number> = {};
  dataCoreList.forEach(c => {
    regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
  });

  // Breakdown by Status
  const statusCounts = {
    Approved: dataCoreList.filter(c => c.status === 'Approved').length,
    WIG: dataCoreList.filter(c => c.status === 'WIG').length,
    InReview: dataCoreList.filter(c => c.status === 'In Review').length,
    PendingField: dataCoreList.filter(c => c.status === 'Pending Field').length,
    Draft: dataCoreList.filter(c => c.status === 'Draft').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Top Greeting & Operational State */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>SISTEM MONITORING ASSET MALANG RAYA · ONLINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Role Akses: <strong className="text-sky-300 font-semibold">{currentUser.role}</strong> · {currentUser.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentView('search')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Cari Data Core Cepat</span>
          </button>
          <button
            onClick={() => setCurrentView('field')}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <HardHat className="w-4 h-4 text-amber-400" />
            <span>Input Field Report</span>
          </button>
        </div>
      </div>

      {/* 5 Enterprise KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* KPI 1: Data Core */}
        <div 
          onClick={() => setCurrentView('search')}
          className="bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 sm:p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-400">Total Data Core</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalCore}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Titik OLT / POP Terdata</p>
          </div>
        </div>

        {/* KPI 2: Feeder */}
        <div 
          onClick={() => setCurrentView('engineering-feeder')}
          className="bg-slate-950/80 border border-slate-800 hover:border-sky-500/50 rounded-xl p-4 sm:p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-400">Total Feeder</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalFeeder}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Jalur Distribusi Aktif</p>
          </div>
        </div>

        {/* KPI 3: Uplink */}
        <div 
          onClick={() => setCurrentView('engineering-uplink')}
          className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 sm:p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-400">Total Uplink</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalUplink}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Pipa Data 10G - 40G</p>
          </div>
        </div>

        {/* KPI 4: Field Report */}
        <div 
          onClick={() => setCurrentView('field')}
          className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 sm:p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-400">Laporan Field</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalField}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Log Inspeksi Lapangan</p>
          </div>
        </div>

        {/* KPI 5: Approved/WIG */}
        <div 
          onClick={() => setCurrentView('data-core')}
          className="col-span-2 lg:col-span-1 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 sm:p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-400">Approved / WIG</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {totalApprovedWig}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {Math.round((totalApprovedWig / totalCore) * 100)}% Tersertifikasi
            </p>
          </div>
        </div>

      </div>

      {/* Visualizations Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Data Distribution by Wilayah & Status Bar */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Status Breakdown Bar & Cards */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Status Kelengkapan Data Core</h3>
                <p className="text-xs text-slate-400">Perbandingan Approved, WIG, dan status verifikasi</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Total: {totalCore} Node</span>
            </div>

            {/* Segmented bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-800 my-4">
              <div 
                style={{ width: `${(statusCounts.Approved / totalCore) * 100}%` }}
                className="bg-emerald-500" 
                title={`Approved: ${statusCounts.Approved}`}
              />
              <div 
                style={{ width: `${(statusCounts.WIG / totalCore) * 100}%` }}
                className="bg-blue-500" 
                title={`WIG: ${statusCounts.WIG}`}
              />
              <div 
                style={{ width: `${(statusCounts.InReview / totalCore) * 100}%` }}
                className="bg-amber-500" 
                title={`In Review: ${statusCounts.InReview}`}
              />
              <div 
                style={{ width: `${(statusCounts.PendingField / totalCore) * 100}%` }}
                className="bg-rose-500" 
                title={`Pending Field: ${statusCounts.PendingField}`}
              />
              <div 
                style={{ width: `${(statusCounts.Draft / totalCore) * 100}%` }}
                className="bg-slate-600" 
                title={`Draft: ${statusCounts.Draft}`}
              />
            </div>

            {/* Legend with tabular numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Approved</span>
                </div>
                <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                  {statusCounts.Approved}
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>WIG</span>
                </div>
                <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                  {statusCounts.WIG}
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>In Review</span>
                </div>
                <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                  {statusCounts.InReview}
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Pending Field</span>
                </div>
                <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                  {statusCounts.PendingField}
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>Draft</span>
                </div>
                <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                  {statusCounts.Draft}
                </p>
              </div>
            </div>
          </div>

          {/* Regional Distribution Chart */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Distribusi Data Core per Wilayah</h3>
              <button
                onClick={() => setCurrentView('network-map')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                <span>Buka Network Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(regionCounts).map(([region, count]) => {
                const percentage = Math.round((count / totalCore) * 100);
                return (
                  <div key={region} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{region}</span>
                      <span className="font-mono text-slate-400">
                        <strong className="text-white font-bold tabular-nums">{count}</strong> data ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activity Logs & Quick List */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <h3 className="text-base font-bold text-white">Aktivitas Terkini (Recent Activity)</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Live Log</span>
              </div>

              <div className="divide-y divide-slate-800/80 mt-2 space-y-2">
                {activityLogs.slice(0, 6).map(log => (
                  <div key={log.id} className="pt-2.5 first:pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-200">
                        {log.action}
                      </p>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {log.timestamp.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-sky-400 font-medium">{log.user}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">{log.entity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick jump to Search Engine */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xs font-bold text-white">Butuh menemukan Data Core dengan cepat?</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cari berdasarkan OLT, POP, Hostname, atau nama rute di search engine interaktif.
              </p>
              <button
                onClick={() => setCurrentView('search')}
                className="mt-3 w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buka Search Engine Data Core</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
