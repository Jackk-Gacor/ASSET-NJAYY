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
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { dataCoreList, fieldReportList, showToast, openCoreDetail } = useApp();

  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const regions: MalangRegion[] = [
    'Malang Kota',
    'Kota Batu',
    'Kepanjen (Malang Selatan)',
    'Singosari (Malang Utara)',
    'Lawang',
    'Turen & Dampit',
  ];

  // Filtered dataset
  const filteredCores = useMemo(() => {
    return dataCoreList.filter(c => {
      const matchR = filterRegion === 'ALL' || c.region === filterRegion;
      const matchS = filterStatus === 'ALL' || c.status === filterStatus;
      return matchR && matchS;
    });
  }, [dataCoreList, filterRegion, filterStatus]);

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

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,Hostname,OLT,POP,Wilayah,Jenis,Status,Kapasitas_Total,Kapasitas_Used,Loss_dBm,KMZ,VISIO,GDB,XLSX',
        ...filteredCores.map(
          c =>
            `${c.id},${c.hostname},${c.oltName},${c.popName},"${c.region}",${c.type},${c.status},${c.coreCapacity},${c.coreUsed},${c.attenuationDbm},${c.documents.kmz},${c.documents.visio},${c.documents.gdb},${c.documents.spreadsheet}`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `REPORT_ASSET_MALANG_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan CSV berhasil diunduh ke perangkat Anda', 'success');
  };

  const handleExportPDF = () => {
    showToast('Membuat ringkasan evaluasi eksekutif format PDF...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <FileBarChart className="w-4 h-4" />
            <span>MODUL MONITORING & EVALUASI AUDIT ASSET</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Laporan Kinerja & Kelengkapan Aset
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Audit kepatuhan dokumentasi (KMZ, Visio, GDB), status sertifikasi WIG, dan evaluasi berkala
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Rekap CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Intelligent AI Audit Insight Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-amber-950/40 border border-slate-800 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">Insight Monitoring & Evaluasi Tim</h4>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300">
              Perhatian Khusus
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ditemukan <strong>{incompleteCores.length} Data Core</strong> yang belum melengkapi 4 berkas wajib (KMZ, Visio, GDB, Sheet). Terutama pada koridor wilayah <strong>Turen & Dampit</strong> (proyek ekspansi rute) serta <strong>Kepanjen</strong> (menunggu hasil verifikasi revisi Visio SLD dari Tim Engineering).
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Tingkat Sertifikasi WIG/Approved</span>
          <p className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
            {complianceRate}%
          </p>
          <p className="text-[11px] text-slate-500">{totalApproved + totalWig} dari {totalCore} data tervalidasi</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Data Dalam Proses Review</span>
          <p className="text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
            {totalInReview}
          </p>
          <p className="text-[11px] text-slate-500">Menunggu verifikasi supervisor</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Menunggu Tindakan Field</span>
          <p className="text-3xl font-extrabold font-mono text-rose-400 tabular-nums">
            {totalPendingField}
          </p>
          <p className="text-[11px] text-slate-500">Perlu uji redaman ulang OTDR</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Laporan Lapangan Masuk</span>
          <p className="text-3xl font-extrabold font-mono text-sky-400 tabular-nums">
            {fieldReportList.length}
          </p>
          <p className="text-[11px] text-slate-500">Tersinkronisasi dari tim lapangan</p>
        </div>

      </div>

      {/* Incomplete Documents Audit Table */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Data yang Belum Lengkap ({incompleteCores.length} Node Memerlukan Tindakan)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">Audit Checklist</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Hostname & ID</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">PIC</th>
                <th className="py-3 px-4">KMZ GIS</th>
                <th className="py-3 px-4">Visio SLD</th>
                <th className="py-3 px-4">GDB Spatial</th>
                <th className="py-3 px-4">Sheet Matrix</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {incompleteCores.map(core => (
                <tr key={core.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] text-sky-400 font-bold block">{core.id}</span>
                    <span className="font-bold text-white">{core.hostname}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{core.region}</td>
                  <td className="py-3 px-4 text-slate-300">{core.pic}</td>
                  <td className="py-3 px-4 font-mono">
                    <span className={core.documents.kmz ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {core.documents.kmz ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={core.documents.visio ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {core.documents.visio ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={core.documents.gdb ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {core.documents.gdb ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={core.documents.spreadsheet ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {core.documents.spreadsheet ? '✓ OK' : '✗ Kurang'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {core.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openCoreDetail(core)}
                      className="px-2.5 py-1 text-xs text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900 rounded border border-sky-800"
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
