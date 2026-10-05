import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MalangRegion, CoreStatus } from '../../types';
import {
  FileBarChart,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
  TrendingUp,
  FileCheck,
  Printer,
  Share2,
  FileSpreadsheet,
  ChevronDown,
  RefreshCw,
  Search,
  Eye,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { dataCoreList, fieldReportList, showToast, openCoreDetail } = useApp();

  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

  const regions: MalangRegion[] = [
    'Malang Kota',
    'Kota Batu',
    'Kepanjen (Malang Selatan)',
    'Singosari (Malang Utara)',
    'Lawang',
    'Turen & Dampit',
  ];

  const statuses: CoreStatus[] = ['Approved', 'WIG', 'In Review', 'Pending Field', 'Draft'];

  // Filtered dataset based on current table state filters
  const filteredCores = useMemo(() => {
    return dataCoreList.filter(c => {
      const matchR = filterRegion === 'ALL' || c.region === filterRegion;
      const matchS = filterStatus === 'ALL' || c.status === filterStatus;
      const q = reportSearchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        c.hostname.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.oltName.toLowerCase().includes(q) ||
        c.popName.toLowerCase().includes(q) ||
        c.pic.toLowerCase().includes(q);
      return matchR && matchS && matchQ;
    });
  }, [dataCoreList, filterRegion, filterStatus, reportSearchQuery]);

  // Incomplete documents check
  const incompleteCores = useMemo(() => {
    return dataCoreList.filter(
      c => !c.documents.kmz || !c.documents.visio || !c.documents.gdb || !c.documents.spreadsheet
    );
  }, [dataCoreList]);

  // Statistics
  const totalApproved = dataCoreList.filter(c => c.status === 'Approved').length;
  const totalWig = dataCoreList.filter(c => c.status === 'WIG').length;
  const totalInReview = dataCoreList.filter(c => c.status === 'In Review').length;
  const totalPendingField = dataCoreList.filter(c => c.status === 'Pending Field').length;
  const totalDraft = dataCoreList.filter(c => c.status === 'Draft').length;

  const totalCore = dataCoreList.length || 1;
  const complianceRate = Math.round(((totalApproved + totalWig) / totalCore) * 100);

  // Generate CSV representation of the filtered report data using the current table state
  const handleExportCSV = () => {
    if (filteredCores.length === 0) {
      showToast('Tidak ada data terfilter untuk diunduh', 'warning');
      return;
    }
    const headers = [
      'ID Core',
      'Hostname',
      'OLT',
      'POP',
      'Wilayah',
      'Jenis',
      'Status',
      'Kapasitas_Total',
      'Kapasitas_Used',
      'Loss_dBm',
      'PIC',
      'KMZ',
      'VISIO',
      'GDB',
      'XLSX',
      'Tanggal_Update'
    ];

    const rows = filteredCores.map(c => [
      c.id,
      `"${c.hostname.replace(/"/g, '""')}"`,
      `"${c.oltName.replace(/"/g, '""')}"`,
      `"${c.popName.replace(/"/g, '""')}"`,
      `"${c.region}"`,
      c.type,
      c.status,
      c.coreCapacity,
      c.coreUsed,
      c.attenuationDbm,
      `"${c.pic}"`,
      c.documents.kmz ? 'LENGKAP' : 'BELUM',
      c.documents.visio ? 'LENGKAP' : 'BELUM',
      c.documents.gdb ? 'LENGKAP' : 'BELUM',
      c.documents.spreadsheet ? 'LENGKAP' : 'BELUM',
      c.lastUpdate
    ].join(','));

    const csvString = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `LAPORAN_ASSET_MALANG_${filterRegion.replace(/\s+/g, '_')}_${filterStatus}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsDownloadMenuOpen(false);
    showToast(`Berhasil mengunduh laporan (${filteredCores.length} baris data) dalam format CSV`, 'success');
  };

  // Generate printable PDF representation of the filtered report data using the current table state
  const handleExportPDF = () => {
    setIsDownloadMenuOpen(false);
    showToast(`Mempersiapkan dokumen cetak PDF untuk ${filteredCores.length} data laporan...`, 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Universal Download Report handler (defaults to CSV with option to toggle)
  const handleDownloadReport = (format: 'csv' | 'pdf' = 'csv') => {
    if (format === 'csv') {
      handleExportCSV();
    } else {
      handleExportPDF();
    }
  };

  const getStatusBadge = (status: CoreStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WIG':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending Field':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <FileBarChart className="w-4 h-4" />
            <span>MODUL MONITORING &amp; EVALUASI AUDIT ASSET</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Laporan Kinerja &amp; Kelengkapan Aset
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit kepatuhan dokumentasi (KMZ, Visio, GDB), status sertifikasi WIG, dan evaluasi berkala wilayah Malang Raya
          </p>
        </div>

        {/* Action Buttons with Download Report & Export */}
        <div className="flex flex-wrap items-center gap-2 relative">
          
          {/* Prominent 'Download Report' Button */}
          <div className="relative inline-flex rounded-xl shadow-xs">
            <button
              type="button"
              data-testid="download-report-button"
              onClick={() => handleDownloadReport('csv')}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-l-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download Report (CSV)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
            <button
              type="button"
              data-testid="download-report-dropdown-toggle"
              onClick={() => setIsDownloadMenuOpen(prev => !prev)}
              className="px-2.5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-r-xl border-l border-blue-500 transition-colors cursor-pointer"
              aria-label="Pilih Format Download Report"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown for Download Report Formats */}
            {isDownloadMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-1.5 divide-y divide-slate-100 text-slate-800">
                <button
                  type="button"
                  onClick={() => handleDownloadReport('csv')}
                  className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Download Report (CSV)</span>
                    <span className="text-[10px] text-slate-500">Data tabel terfilter ({filteredCores.length} baris)</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadReport('pdf')}
                  className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Download Report (PDF)</span>
                    <span className="text-[10px] text-slate-500">Format cetak &amp; arsip eksekutif</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Intelligent AI Audit Insight Card */}
      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5 shadow-xs">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900">Insight Monitoring &amp; Evaluasi Tim</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-200">
              Perhatian Khusus
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ditemukan <strong>{incompleteCores.length} Data Core</strong> yang belum melengkapi 4 berkas wajib (KMZ, Visio, GDB, Sheet). Terutama pada koridor wilayah <strong>Turen &amp; Dampit</strong> (proyek ekspansi rute) serta <strong>Kepanjen</strong> (menunggu hasil verifikasi revisi Visio SLD dari Tim Engineering).
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Tingkat Sertifikasi WIG/Approved</span>
          <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums mt-1">
            {complianceRate}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{totalApproved + totalWig} dari {totalCore} data tervalidasi</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Data Dalam Proses Review</span>
          <p className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 tabular-nums mt-1">
            {totalInReview}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Menunggu verifikasi supervisor</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Menunggu Tindakan Field</span>
          <p className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-600 tabular-nums mt-1">
            {totalPendingField}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Perlu uji redaman ulang OTDR</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Total Laporan Lapangan Masuk</span>
          <p className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-600 tabular-nums mt-1">
            {fieldReportList.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tersinkronisasi dari tim lapangan</p>
        </div>

      </div>

      {/* ================= FILTER CONTROLS FOR REPORT DATA ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Filter Data Laporan Terperinci
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Data Terfilter:</span>
            <strong className="text-blue-600 font-bold tabular-nums">{filteredCores.length}</strong>
            <span>dari {dataCoreList.length} data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Region filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Filter Wilayah
            </label>
            <select
              value={filterRegion}
              onChange={e => setFilterRegion(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Wilayah Kerja</option>
              {regions.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Filter Status Sertifikasi
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Status</option>
              {statuses.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Cari Nama / ID / OLT
            </label>
            <div className="relative">
              <input
                type="text"
                value={reportSearchQuery}
                onChange={e => setReportSearchQuery(e.target.value)}
                placeholder="Cari kata kunci..."
                className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Actions: Download Report & Reset */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => handleDownloadReport('csv')}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Unduh data tabel terfilter saat ini"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterRegion('ALL');
                setFilterStatus('ALL');
                setReportSearchQuery('');
              }}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              title="Reset Filter"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= FILTERED REPORT DATA TABLE ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Tabel Rekap Data Laporan Terfilter ({filteredCores.length} Data)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadReport('csv')}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Download CSV</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadReport('pdf')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {filteredCores.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <p>Tidak ada data laporan yang cocok dengan kombinasi filter di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">ID &amp; Hostname</th>
                  <th className="py-3.5 px-4">OLT &amp; POP</th>
                  <th className="py-3.5 px-4">Wilayah</th>
                  <th className="py-3.5 px-4">Jenis</th>
                  <th className="py-3.5 px-4">Kapasitas Core</th>
                  <th className="py-3.5 px-4">Redaman (dBm)</th>
                  <th className="py-3.5 px-4">Kelengkapan Berkas</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCores.map(core => (
                  <tr key={core.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-blue-600 font-bold block">{core.id}</span>
                      <span className="font-bold text-slate-900">{core.hostname}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-medium block">{core.oltName}</span>
                      <span className="text-slate-500 text-[11px]">{core.popName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{core.region}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{core.type}</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      {core.coreUsed} / {core.coreCapacity} Core
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={core.attenuationDbm > -24 ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                        {core.attenuationDbm} dBm
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px]">
                      <div className="flex items-center gap-1 font-semibold">
                        <span className={core.documents.kmz ? 'text-emerald-600' : 'text-slate-400'}>KMZ</span>
                        <span>·</span>
                        <span className={core.documents.visio ? 'text-emerald-600' : 'text-slate-400'}>VSD</span>
                        <span>·</span>
                        <span className={core.documents.gdb ? 'text-emerald-600' : 'text-slate-400'}>GDB</span>
                        <span>·</span>
                        <span className={core.documents.spreadsheet ? 'text-emerald-600' : 'text-slate-400'}>XLS</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border inline-block ${getStatusBadge(core.status)}`}>
                        {core.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openCoreDetail(core)}
                        className="px-2.5 py-1 text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors font-medium"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incomplete Documents Audit Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Data yang Belum Lengkap ({incompleteCores.length} Node Memerlukan Tindakan)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Audit Checklist</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Hostname &amp; ID</th>
                <th className="py-3.5 px-4">Wilayah</th>
                <th className="py-3.5 px-4">PIC</th>
                <th className="py-3.5 px-4">KMZ GIS</th>
                <th className="py-3.5 px-4">Visio SLD</th>
                <th className="py-3.5 px-4">GDB Spatial</th>
                <th className="py-3.5 px-4">Sheet Matrix</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {incompleteCores.map(core => (
                <tr key={core.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] text-blue-600 font-bold block">{core.id}</span>
                    <span className="font-bold text-slate-900">{core.hostname}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{core.region}</td>
                  <td className="py-3.5 px-4 text-slate-600">{core.pic}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={core.documents.kmz ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {core.documents.kmz ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={core.documents.visio ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {core.documents.visio ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={core.documents.gdb ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {core.documents.gdb ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={core.documents.spreadsheet ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {core.documents.spreadsheet ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {core.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openCoreDetail(core)}
                      className="px-2.5 py-1 text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 font-medium transition-colors"
                    >
                      Buka Dokumen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
