import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { E2EStatusReport, FeederItem, UplinkItem } from '../../types';
import {
  Compass,
  Layers,
  FolderGit2,
  Search,
  Plus,
  Share2,
  AlertCircle,
  FileText,
  Workflow,
  X,
  Download,
  ChevronDown,
  FileSpreadsheet,
  Printer,
  ExternalLink,
  CheckCircle2,
  Clock,
  Pencil,
  Link2,
  MapPin,
} from 'lucide-react';
import { resolveTopologyForHostname } from '../../utils/topologySync';

export const EngineeringView: React.FC = () => {
  const {
    currentView,
    feederList,
    uplinkList,
    sidList,
    addFeeder,
    updateFeeder,
    updateFeederStatus,
    addUplink,
    updateUplink,
    updateUplinkStatus,
    addSid,
    showToast,
    drawingSearchPrefill,
    clearDrawingSearchPrefill,
    navigateToMapNode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feeder' | 'uplink' | 'sid' | 'chain'>(() => {
    if (currentView === 'engineering-uplink') return 'uplink';
    if (currentView === 'engineering-sid') return 'sid';
    return 'feeder';
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [picFilter, setPicFilter] = useState<string>('ALL');
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

  React.useEffect(() => {
    if (currentView === 'engineering-feeder') setActiveTab('feeder');
    else if (currentView === 'engineering-uplink') setActiveTab('uplink');
    else if (currentView === 'engineering-sid') setActiveTab('sid');
  }, [currentView]);

  React.useEffect(() => {
    if (drawingSearchPrefill) {
      setSearch(drawingSearchPrefill);
      clearDrawingSearchPrefill();
    }
  }, [drawingSearchPrefill, clearDrawingSearchPrefill]);

  const allPics = useMemo(() => {
    const set = new Set<string>();
    feederList.forEach(f => f.pic && set.add(f.pic));
    uplinkList.forEach(u => u.pic && set.add(u.pic));
    return Array.from(set).sort();
  }, [feederList, uplinkList]);

  const filteredFeeders = useMemo(() => {
    const q = search.toLowerCase().trim();
    return feederList.filter(item => {
      const matchSearch =
        !q ||
        item.hostnameOlt.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q) ||
        (item.datacoreVisio || '').toLowerCase().includes(q) ||
        (item.mymaps || '').toLowerCase().includes(q) ||
        item.keterangan.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || item.statusReport === statusFilter;
      const matchPic = picFilter === 'ALL' || item.pic === picFilter;
      return matchSearch && matchStatus && matchPic;
    });
  }, [feederList, search, statusFilter, picFilter]);

  const filteredUplinks = useMemo(() => {
    const q = search.toLowerCase().trim();
    return uplinkList.filter(item => {
      const matchSearch =
        !q ||
        item.hostnameOlt.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q) ||
        (item.datacoreVisio || '').toLowerCase().includes(q) ||
        (item.mymaps || '').toLowerCase().includes(q) ||
        (item.schematicE2E || '').toLowerCase().includes(q) ||
        item.keterangan.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || item.statusReport === statusFilter;
      const matchPic = picFilter === 'ALL' || item.pic === picFilter;
      return matchSearch && matchStatus && matchPic;
    });
  }, [uplinkList, search, statusFilter, picFilter]);

  const filteredSids = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sidList.filter(item => {
      const matchSearch =
        !q ||
        item.sidNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.serviceType.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [sidList, search, statusFilter]);

  // E2E KPI Stats (syncs with active tab or overall E2E)
  const feederDoneCount = feederList.filter(f => f.statusReport === 'DONE').length;
  const feederProgressCount = feederList.filter(f => f.statusReport === 'PROGRESS').length;
  const uplinkDoneCount = uplinkList.filter(u => u.statusReport === 'DONE').length;
  const uplinkProgressCount = uplinkList.filter(u => u.statusReport === 'PROGRESS').length;

  const activeTotal = activeTab === 'uplink' ? uplinkList.length : feederList.length;
  const activeDone = activeTab === 'uplink' ? uplinkDoneCount : feederDoneCount;
  const activeProgress = activeTab === 'uplink' ? uplinkProgressCount : feederProgressCount;
  const activeRate = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;

  // Modals
  const [isAddFeederOpen, setIsAddFeederOpen] = useState(false);
  const [isAddUplinkOpen, setIsAddUplinkOpen] = useState(false);
  const [isAddSidOpen, setIsAddSidOpen] = useState(false);
  const [editingFeeder, setEditingFeeder] = useState<FeederItem | null>(null);
  const [editingUplink, setEditingUplink] = useState<UplinkItem | null>(null);

  const todayDisplay = new Date().toLocaleDateString('en-GB');

  // Forms matching exact spreadsheet schema
  const [feederForm, setFeederForm] = useState({
    feederCode: `FDR-MLG-${Math.floor(100 + Math.random() * 900)}`,
    hostnameOlt: 'JATIM-MLG.ODC.BARU-HW.MA5801-OLT-01',
    statusReport: 'DONE' as E2EStatusReport,
    actualDone: todayDisplay,
    reportDone: todayDisplay,
    pic: 'DIMAS',
    datacoreVisio: '',
    datacoreVisioUrl: '',
    mymaps: '',
    mymapsUrl: '',
    keterangan: '',
  });

  const [uplinkForm, setUplinkForm] = useState({
    uplinkCode: `UPL-MLG-${Math.floor(100 + Math.random() * 900)}`,
    hostnameOlt: 'JATIM-MLG.ODC.BARU-HW.MA5801-OLT-01',
    statusReport: 'DONE' as E2EStatusReport,
    actualDone: todayDisplay,
    reportDone: todayDisplay,
    pic: 'KANAYA',
    datacoreVisio: '',
    datacoreVisioUrl: '',
    mymaps: '',
    mymapsUrl: '',
    schematicE2E: '',
    schematicE2EUrl: '',
    keterangan: '',
  });

  const [sidForm, setSidForm] = useState({
    sidNumber: `SID-MLG-${Math.floor(8810 + Math.random() * 90)}`,
    customerName: 'PT Baru Mitra Malang',
    serviceType: 'IP-VPN' as const,
    relatedFeederId: 'FDR-01',
    relatedUplinkId: 'UPL-01',
    status: 'Active' as const,
    bandwidthMbps: 500,
    pic: 'Dwi Santoso',
  });

  const handleCreateFeeder = (e: React.FormEvent) => {
    e.preventDefault();
    addFeeder({
      ...feederForm,
      reportDone: feederForm.statusReport === 'DONE' ? feederForm.reportDone : '',
    });
    setIsAddFeederOpen(false);
  };

  const handleSaveEditFeeder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeeder) return;
    updateFeeder(editingFeeder.id, {
      ...editingFeeder,
      reportDone: editingFeeder.statusReport === 'DONE' ? editingFeeder.reportDone : '',
    });
    setEditingFeeder(null);
  };

  const handleCreateUplink = (e: React.FormEvent) => {
    e.preventDefault();
    addUplink({
      ...uplinkForm,
      reportDone: uplinkForm.statusReport === 'DONE' ? uplinkForm.reportDone : '',
    });
    setIsAddUplinkOpen(false);
  };

  const handleSaveEditUplink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUplink) return;
    updateUplink(editingUplink.id, {
      ...editingUplink,
      reportDone: editingUplink.statusReport === 'DONE' ? editingUplink.reportDone : '',
    });
    setEditingUplink(null);
  };

  const handleCreateSid = (e: React.FormEvent) => {
    e.preventDefault();
    addSid(sidForm);
    setIsAddSidOpen(false);
  };

  const getPicBadgeClass = (pic: string) => {
    switch (pic.toUpperCase()) {
      case 'KANAYA':
        return 'bg-blue-700 text-white';
      case 'JACK':
        return 'bg-slate-800 text-white';
      case 'DIMAS':
        return 'bg-teal-800 text-white';
      case 'ALIFIA':
        return 'bg-rose-200 text-rose-900';
      case 'NOVI':
        return 'bg-amber-800 text-white';
      default:
        return 'bg-indigo-700 text-white';
    }
  };

  const handleExportCSV = () => {
    setIsDownloadMenuOpen(false);
    if (activeTab === 'uplink') {
      if (filteredUplinks.length === 0) {
        showToast('Tidak ada data E2E Uplink untuk diunduh', 'warning');
        return;
      }
      const headers = [
        'Hostname OLT',
        'Status Report',
        'Actual Done',
        'Report Done',
        'PIC',
        'DATACORE VISIO',
        'MYMAPS',
        'Schematic E2E',
        'Keterangan',
      ];
      const rows = filteredUplinks.map(u =>
        [
          `"${u.hostnameOlt.replace(/"/g, '""')}"`,
          u.statusReport,
          u.actualDone,
          u.reportDone || '-',
          u.pic,
          `"${(u.datacoreVisio || '').replace(/"/g, '""')}"`,
          `"${(u.mymaps || '').replace(/"/g, '""')}"`,
          `"${(u.schematicE2E || '').replace(/"/g, '""')}"`,
          `"${(u.keterangan || '').replace(/"/g, '""')}"`,
        ].join(',')
      );
      const csvString = [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DRAWING_DATA_E2E_UPLINK_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Berhasil mengunduh ${filteredUplinks.length} baris E2E Uplink (CSV)`, 'success');
    } else {
      if (filteredFeeders.length === 0) {
        showToast('Tidak ada data E2E Feeder untuk diunduh', 'warning');
        return;
      }
      const headers = [
        'Hostname OLT',
        'Status Report',
        'Actual Done',
        'Report Done',
        'PIC',
        'DATACORE VISIO',
        'MYMAPS',
        'Keterangan',
      ];
      const rows = filteredFeeders.map(f =>
        [
          `"${f.hostnameOlt.replace(/"/g, '""')}"`,
          f.statusReport,
          f.actualDone,
          f.reportDone || '-',
          f.pic,
          `"${(f.datacoreVisio || '').replace(/"/g, '""')}"`,
          `"${(f.mymaps || '').replace(/"/g, '""')}"`,
          `"${(f.keterangan || '').replace(/"/g, '""')}"`,
        ].join(',')
      );
      const csvString = [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DRAWING_DATA_E2E_FEEDER_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Berhasil mengunduh ${filteredFeeders.length} baris E2E Feeder (CSV)`, 'success');
    }
  };

  const handleExportPDF = () => {
    setIsDownloadMenuOpen(false);
    showToast('Mempersiapkan cetak laporan Drawing Data...', 'info');
    setTimeout(() => {
      window.print();
    }, 350);
  };

  return (
    <div className="space-y-5 text-slate-800">
      {/* Header Banner (ReportsView style) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Workflow className="w-4 h-4" />
            <span>MODUL DRAWING DATA · E2E ASSET FEEDER &amp; UPLINK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Drawing Data: E2E Feeder, Uplink &amp; SID
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoring status report Drawing Data (DONE / PROGRESS), PIC drafter, berkas Visio, MyMaps &amp; Schematic E2E
          </p>
        </div>

        {/* Actions: Download Report + Diagram 3 Pilar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative inline-flex rounded-xl shadow-xs">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-l-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDownloadMenuOpen(prev => !prev)}
              className="px-2.5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-r-xl border-l border-blue-500 transition-colors cursor-pointer"
              aria-label="Pilih Format Export"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {isDownloadMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-1.5 divide-y divide-slate-100">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Export CSV</span>
                    <span className="text-[10px] text-slate-500">Format tabel terfilter</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Cetak PDF</span>
                    <span className="text-[10px] text-slate-500">Arsip laporan E2E</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('chain')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
              activeTab === 'chain'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>3 Pilar</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards (ReportsView style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">
            Penyelesaian {activeTab === 'uplink' ? 'E2E Uplink' : 'E2E Feeder'}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 tabular-nums">
            {activeRate}%
          </p>
          <p className="text-[11px] text-slate-400">
            {activeDone} dari {activeTotal} OLT selesai
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Status Report: DONE</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 tabular-nums flex items-center gap-2">
            <span>{activeDone}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </p>
          <p className="text-[11px] text-slate-400">Terverifikasi Report Done</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Status Report: PROGRESS</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 tabular-nums flex items-center gap-2">
            <span>{activeProgress}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </p>
          <p className="text-[11px] text-slate-400">Sedang proses penggambaran</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Total Asset Terdaftar</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 tabular-nums">
            {feederList.length + uplinkList.length}
          </p>
          <p className="text-[11px] text-slate-400">
            {feederList.length} Feeder · {uplinkList.length} Uplink
          </p>
        </div>
      </div>

      {/* Tabs + Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200/80 bg-white p-2 rounded-2xl shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setActiveTab('feeder');
                setStatusFilter('ALL');
                setPicFilter('ALL');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'feeder'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>E2E Feeder ({feederList.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('uplink');
                setStatusFilter('ALL');
                setPicFilter('ALL');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'uplink'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>E2E Uplink ({uplinkList.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('sid');
                setStatusFilter('ALL');
                setPicFilter('ALL');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'sid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>SID Layanan ({sidList.length})</span>
            </button>
          </div>

          <div>
            {activeTab === 'feeder' && (
              <button
                onClick={() => setIsAddFeederOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah E2E Feeder</span>
              </button>
            )}
            {activeTab === 'uplink' && (
              <button
                onClick={() => setIsAddUplinkOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah E2E Uplink</span>
              </button>
            )}
            {activeTab === 'sid' && (
              <button
                onClick={() => setIsAddSidOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah SID Layanan</span>
              </button>
            )}
          </div>
        </div>

        {/* Search, Status Report Filter & PIC Filter */}
        {activeTab !== 'chain' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={
                  activeTab === 'feeder'
                    ? 'Cari Hostname OLT, PIC, Datacore Visio, MyMaps, atau Keterangan...'
                    : activeTab === 'uplink'
                    ? 'Cari Hostname OLT, PIC, Schematic E2E, MyMaps, atau Keterangan...'
                    : 'Cari Nomor SID, Pelanggan, Layanan, atau PIC...'
                }
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  title="Hapus pencarian Drawing Data"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                Filter Drawing Data:
              </span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              >
                <option value="ALL">Semua Status</option>
                {(activeTab === 'feeder' || activeTab === 'uplink') && (
                  <>
                    <option value="DONE">DONE</option>
                    <option value="PROGRESS">PROGRESS</option>
                  </>
                )}
                {activeTab === 'sid' && (
                  <>
                    <option value="Active">Active</option>
                    <option value="Survey">Survey</option>
                    <option value="Commissioning">Commissioning</option>
                  </>
                )}
              </select>

              {(activeTab === 'feeder' || activeTab === 'uplink') && (
                <select
                  value={picFilter}
                  onChange={e => setPicFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="ALL">Semua PIC</option>
                  {allPics.map(pic => (
                    <option key={pic} value={pic}>
                      {pic}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TAB CONTENT: E2E ASSET FEEDER */}
      {activeTab === 'feeder' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-wide text-slate-900 uppercase">
              E2E ASSET FEEDER
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Menampilkan {filteredFeeders.length} dari {feederList.length} data
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Hostname OLT</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Status Report</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Actual Done</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Report Done</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">PIC</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">DATACORE VISIO</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">MYMAPS</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Ring &amp; Topologi</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Keterangan</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredFeeders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 px-4 text-center">
                      <div className="space-y-2 max-w-sm mx-auto">
                        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-sm font-bold text-slate-800">
                          Tidak ada Drawing Data E2E Feeder yang cocok
                        </p>
                        <p className="text-xs text-slate-500">
                          Ubah kata kunci pencarian atau reset filter status &amp; PIC Drawing Data.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('');
                            setStatusFilter('ALL');
                            setPicFilter('ALL');
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                        >
                          Reset Filter Drawing Data
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredFeeders.map(item => {
                    const topo = resolveTopologyForHostname(item.hostnameOlt, undefined, item.keterangan);
                    return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] font-medium text-slate-900 whitespace-nowrap">
                        {item.hostnameOlt}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                        <select
                          value={item.statusReport}
                          onChange={e => updateFeederStatus(item.id, e.target.value as E2EStatusReport)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide cursor-pointer focus:outline-hidden ${
                            item.statusReport === 'DONE'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          <option value="DONE" className="bg-white text-slate-900">DONE</option>
                          <option value="PROGRESS" className="bg-white text-slate-900">PROGRESS</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px] tabular-nums whitespace-nowrap">
                        {item.actualDone || '-'}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px] tabular-nums whitespace-nowrap text-slate-600">
                        {item.reportDone || ''}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getPicBadgeClass(
                            item.pic
                          )}`}
                        >
                          {item.pic}
                        </span>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 max-w-[200px] truncate">
                        {item.datacoreVisioUrl ? (
                          <a
                            href={item.datacoreVisioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-blue-700 hover:text-blue-900 font-medium underline truncate max-w-full"
                            title={item.datacoreVisioUrl}
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{item.datacoreVisio || 'Buka Link Visio'}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : item.datacoreVisio ? (
                          <button
                            type="button"
                            onClick={() => setEditingFeeder(item)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 hover:text-blue-700 font-medium truncate max-w-full cursor-pointer"
                            title="Klik untuk menambahkan URL link Visio"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate">{item.datacoreVisio}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingFeeder(item)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>+ Link Visio</span>
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                        {item.mymapsUrl ? (
                          <a
                            href={item.mymapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline"
                            title={item.mymapsUrl}
                          >
                            <span>{item.mymaps || 'Buka MyMaps'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : item.mymaps ? (
                          <button
                            type="button"
                            onClick={() => setEditingFeeder(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                            title="Klik untuk melengkapi URL MyMaps"
                          >
                            <span>{item.mymaps}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingFeeder(item)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>+ Link MyMaps</span>
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => navigateToMapNode(topo.node.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                          title={`Buka ${topo.node.name} di Network & Ring Map`}
                        >
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{topo.node.code.replace('_AREA45', '')}</span>
                        </button>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-700 whitespace-nowrap">
                        {item.keterangan}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingFeeder(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Edit Data & Link Visio / MyMaps"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: E2E UPLINK */}
      {activeTab === 'uplink' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-wide text-slate-900 uppercase">
              E2E UPLINK
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Menampilkan {filteredUplinks.length} dari {uplinkList.length} data
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Hostname OLT</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Status Report</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Actual Done</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Report Done</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">PIC</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">DATACORE VISIO</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">MYMAPS</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Schematic E2E</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Ring &amp; Topologi</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Keterangan</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredUplinks.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 px-4 text-center">
                      <div className="space-y-2 max-w-sm mx-auto">
                        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-sm font-bold text-slate-800">
                          Tidak ada Drawing Data E2E Uplink yang cocok
                        </p>
                        <p className="text-xs text-slate-500">
                          Ubah kata kunci pencarian atau reset filter status &amp; PIC Drawing Data.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('');
                            setStatusFilter('ALL');
                            setPicFilter('ALL');
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                        >
                          Reset Filter Drawing Data
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUplinks.map(item => {
                    const topo = resolveTopologyForHostname(item.hostnameOlt, item.schematicE2E, item.keterangan);
                    return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] font-medium text-slate-900 whitespace-nowrap">
                        {item.hostnameOlt}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                        <select
                          value={item.statusReport}
                          onChange={e => updateUplinkStatus(item.id, e.target.value as E2EStatusReport)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide cursor-pointer focus:outline-hidden ${
                            item.statusReport === 'DONE'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          <option value="DONE" className="bg-white text-slate-900">DONE</option>
                          <option value="PROGRESS" className="bg-white text-slate-900">PROGRESS</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px] tabular-nums whitespace-nowrap">
                        {item.actualDone || '-'}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px] tabular-nums whitespace-nowrap text-slate-600">
                        {item.reportDone || ''}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getPicBadgeClass(
                            item.pic
                          )}`}
                        >
                          {item.pic}
                        </span>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 max-w-[180px] truncate">
                        {item.datacoreVisioUrl ? (
                          <a
                            href={item.datacoreVisioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-blue-700 hover:text-blue-900 font-medium underline truncate max-w-full"
                            title={item.datacoreVisioUrl}
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{item.datacoreVisio || 'Buka Link Visio'}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : item.datacoreVisio ? (
                          <button
                            type="button"
                            onClick={() => setEditingUplink(item)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 hover:text-blue-700 font-medium truncate max-w-full cursor-pointer"
                            title="Klik untuk menambahkan URL link Visio"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate">{item.datacoreVisio}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingUplink(item)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>+ Link Visio</span>
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                        {item.mymapsUrl ? (
                          <a
                            href={item.mymapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline"
                            title={item.mymapsUrl}
                          >
                            <span>{item.mymaps || 'Buka MyMaps'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : item.mymaps ? (
                          <button
                            type="button"
                            onClick={() => setEditingUplink(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                            title="Klik untuk melengkapi URL MyMaps"
                          >
                            <span>{item.mymaps}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingUplink(item)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>+ Link MyMaps</span>
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 max-w-[240px] truncate">
                        {item.schematicE2EUrl ? (
                          <a
                            href={item.schematicE2EUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-rose-700 hover:text-rose-900 font-medium underline truncate max-w-full"
                            title={item.schematicE2EUrl}
                          >
                            <span className="px-1 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold shrink-0">
                              PDF
                            </span>
                            <span className="truncate">{item.schematicE2E || 'Buka Schematic'}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : item.schematicE2E ? (
                          <button
                            type="button"
                            onClick={() => setEditingUplink(item)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 hover:text-rose-700 font-medium truncate max-w-full cursor-pointer"
                            title="Klik untuk menambahkan URL Schematic E2E"
                          >
                            <span className="px-1 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold shrink-0">
                              PDF
                            </span>
                            <span className="truncate">{item.schematicE2E}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingUplink(item)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>+ Schematic</span>
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => navigateToMapNode(topo.node.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                          title={`Buka ${topo.node.name} di Network & Ring Map`}
                        >
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{topo.node.code.replace('_AREA45', '')}</span>
                        </button>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-700 whitespace-nowrap">
                        {item.keterangan}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingUplink(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Edit Data & Link Visio / MyMaps"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SID */}
      {activeTab === 'sid' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Nomor SID</th>
                  <th className="py-3.5 px-4">Nama Pelanggan</th>
                  <th className="py-3.5 px-4">Tipe Layanan</th>
                  <th className="py-3.5 px-4">Bandwidth</th>
                  <th className="py-3.5 px-4">Relasi Feeder &amp; Uplink</th>
                  <th className="py-3.5 px-4">PIC Drafter</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSids.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center">
                      <div className="space-y-2 max-w-sm mx-auto">
                        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-sm font-bold text-slate-800">
                          Tidak ada Drawing Data SID yang cocok
                        </p>
                        <p className="text-xs text-slate-500">
                          Ubah kata kunci pencarian atau reset filter status Drawing Data.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('');
                            setStatusFilter('ALL');
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                        >
                          Reset Filter Drawing Data
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSids.map(item => {
                    const feeder = feederList.find(f => f.id === item.relatedFeederId);
                    const uplink = uplinkList.find(u => u.id === item.relatedUplinkId);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-600">
                          {item.sidNumber}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.customerName}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                            {item.serviceType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-blue-600 font-bold">
                          {item.bandwidthMbps} Mbps
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className="text-slate-800 block">
                            Feeder: {feeder?.hostnameOlt || feeder?.feederCode || item.relatedFeederId}
                          </span>
                          <span className="text-slate-500">
                            Uplink: {uplink?.hostnameOlt || uplink?.uplinkCode || item.relatedUplinkId}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{item.pic}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3-PILLAR RELATIONSHIP DIAGRAM */}
      {activeTab === 'chain' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
              ARSITEKTUR KETERKAITAN 3 PILAR DRAWING DATA
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Siklus Hubungan SID ↔ E2E Feeder ↔ E2E Uplink
            </h3>
            <p className="text-xs text-slate-500">
              Pelanggan memesan bandwidth (SID) → Tim Drawing Data mengalokasikan jalur E2E Feeder → Dihubungkan ke E2E Uplink → Tervalidasi pada Report Done &amp; Schematic E2E.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-purple-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-700 uppercase">
                  PILAR 1 · ORDER &amp; SID
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">Surat Izin Disain (SID)</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Identitas unik pesanan pelanggan korporat / FTTH yang diikat pada Hostname OLT dan nomor WO/M-ticket.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-sky-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-700 uppercase">
                  PILAR 2 · E2E ASSET FEEDER
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">Kabel Distribusi ODC/OLT</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Pemetaan jalur distribusi dari OLT ke titik ODC/FDT lengkap dengan DATACORE VISIO &amp; MYMAPS FEEDER.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-blue-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
                  PILAR 3 · E2E UPLINK
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">Transmisi &amp; Schematic E2E</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Jalur uplink OLT ke POP induk dengan dokumen Schematic E2E PDF, panjang rute, alokasi core, dan ID ODF.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add E2E Feeder Modal */}
      {isAddFeederOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Data E2E Feeder</h3>
              <button onClick={() => setIsAddFeederOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFeeder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hostname OLT</label>
                <input
                  type="text"
                  value={feederForm.hostnameOlt}
                  onChange={e => setFeederForm({ ...feederForm, hostnameOlt: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Report</label>
                  <select
                    value={feederForm.statusReport}
                    onChange={e => setFeederForm({ ...feederForm, statusReport: e.target.value as E2EStatusReport })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="DONE">DONE</option>
                    <option value="PROGRESS">PROGRESS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">PIC</label>
                  <select
                    value={feederForm.pic}
                    onChange={e => setFeederForm({ ...feederForm, pic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="DIMAS">DIMAS</option>
                    <option value="KANAYA">KANAYA</option>
                    <option value="JACK">JACK</option>
                    <option value="ALIFIA">ALIFIA</option>
                    <option value="NOVI">NOVI</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Actual Done</label>
                  <input
                    type="text"
                    value={feederForm.actualDone}
                    onChange={e => setFeederForm({ ...feederForm, actualDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Report Done</label>
                  <input
                    type="text"
                    value={feederForm.reportDone}
                    onChange={e => setFeederForm({ ...feederForm, reportDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">DATACORE VISIO (Nama File)</label>
                  <input
                    type="text"
                    value={feederForm.datacoreVisio}
                    onChange={e => setFeederForm({ ...feederForm, datacoreVisio: e.target.value })}
                    placeholder="Nama file .vsdx (opsional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Link Visio (URL)</label>
                  <input
                    type="url"
                    value={feederForm.datacoreVisioUrl}
                    onChange={e => setFeederForm({ ...feederForm, datacoreVisioUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">MYMAPS (Label)</label>
                  <input
                    type="text"
                    value={feederForm.mymaps}
                    onChange={e => setFeederForm({ ...feederForm, mymaps: e.target.value })}
                    placeholder="MYMAPS FEEDER ..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Link MyMaps (URL)</label>
                  <input
                    type="url"
                    value={feederForm.mymapsUrl}
                    onChange={e => setFeederForm({ ...feederForm, mymapsUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/d/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan</label>
                <input
                  type="text"
                  value={feederForm.keterangan}
                  onChange={e => setFeederForm({ ...feederForm, keterangan: e.target.value })}
                  placeholder="Catatan / Kode WO M26..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFeederOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan E2E Feeder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit E2E Feeder Modal */}
      {editingFeeder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Data &amp; Link E2E Feeder</h3>
                <p className="text-[11px] text-slate-500">Perbarui Hostname OLT, Status, atau lengkapi link Visio &amp; MyMaps</p>
              </div>
              <button onClick={() => setEditingFeeder(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEditFeeder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hostname OLT</label>
                <input
                  type="text"
                  value={editingFeeder.hostnameOlt}
                  onChange={e => setEditingFeeder({ ...editingFeeder, hostnameOlt: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Report</label>
                  <select
                    value={editingFeeder.statusReport}
                    onChange={e => setEditingFeeder({ ...editingFeeder, statusReport: e.target.value as E2EStatusReport })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="DONE">DONE</option>
                    <option value="PROGRESS">PROGRESS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">PIC</label>
                  <select
                    value={editingFeeder.pic}
                    onChange={e => setEditingFeeder({ ...editingFeeder, pic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="DIMAS">DIMAS</option>
                    <option value="KANAYA">KANAYA</option>
                    <option value="JACK">JACK</option>
                    <option value="ALIFIA">ALIFIA</option>
                    <option value="NOVI">NOVI</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Actual Done</label>
                  <input
                    type="text"
                    value={editingFeeder.actualDone}
                    onChange={e => setEditingFeeder({ ...editingFeeder, actualDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Report Done</label>
                  <input
                    type="text"
                    value={editingFeeder.reportDone}
                    onChange={e => setEditingFeeder({ ...editingFeeder, reportDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Link Berkas Visio &amp; MyMaps
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">DATACORE VISIO (Nama)</label>
                    <input
                      type="text"
                      value={editingFeeder.datacoreVisio || ''}
                      onChange={e => setEditingFeeder({ ...editingFeeder, datacoreVisio: e.target.value })}
                      placeholder="Nama file .vsdx"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Link Visio (URL)</label>
                    <input
                      type="url"
                      value={editingFeeder.datacoreVisioUrl || ''}
                      onChange={e => setEditingFeeder({ ...editingFeeder, datacoreVisioUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">MYMAPS (Label)</label>
                    <input
                      type="text"
                      value={editingFeeder.mymaps || ''}
                      onChange={e => setEditingFeeder({ ...editingFeeder, mymaps: e.target.value })}
                      placeholder="MYMAPS FEEDER ..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Link MyMaps (URL)</label>
                    <input
                      type="url"
                      value={editingFeeder.mymapsUrl || ''}
                      onChange={e => setEditingFeeder({ ...editingFeeder, mymapsUrl: e.target.value })}
                      placeholder="https://www.google.com/maps/d/..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan</label>
                <input
                  type="text"
                  value={editingFeeder.keterangan}
                  onChange={e => setEditingFeeder({ ...editingFeeder, keterangan: e.target.value })}
                  placeholder="Catatan / Kode WO M26..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFeeder(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add E2E Uplink Modal */}
      {isAddUplinkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Data E2E Uplink</h3>
              <button onClick={() => setIsAddUplinkOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateUplink} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hostname OLT</label>
                <input
                  type="text"
                  value={uplinkForm.hostnameOlt}
                  onChange={e => setUplinkForm({ ...uplinkForm, hostnameOlt: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Report</label>
                  <select
                    value={uplinkForm.statusReport}
                    onChange={e => setUplinkForm({ ...uplinkForm, statusReport: e.target.value as E2EStatusReport })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="DONE">DONE</option>
                    <option value="PROGRESS">PROGRESS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">PIC</label>
                  <select
                    value={uplinkForm.pic}
                    onChange={e => setUplinkForm({ ...uplinkForm, pic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="KANAYA">KANAYA</option>
                    <option value="JACK">JACK</option>
                    <option value="DIMAS">DIMAS</option>
                    <option value="ALIFIA">ALIFIA</option>
                    <option value="NOVI">NOVI</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Actual Done</label>
                  <input
                    type="text"
                    value={uplinkForm.actualDone}
                    onChange={e => setUplinkForm({ ...uplinkForm, actualDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Report Done</label>
                  <input
                    type="text"
                    value={uplinkForm.reportDone}
                    onChange={e => setUplinkForm({ ...uplinkForm, reportDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">DATACORE VISIO (Nama File)</label>
                  <input
                    type="text"
                    value={uplinkForm.datacoreVisio}
                    onChange={e => setUplinkForm({ ...uplinkForm, datacoreVisio: e.target.value })}
                    placeholder="Nama file .vsdx (opsional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Link Visio (URL)</label>
                  <input
                    type="url"
                    value={uplinkForm.datacoreVisioUrl}
                    onChange={e => setUplinkForm({ ...uplinkForm, datacoreVisioUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">MYMAPS (Label)</label>
                  <input
                    type="text"
                    value={uplinkForm.mymaps}
                    onChange={e => setUplinkForm({ ...uplinkForm, mymaps: e.target.value })}
                    placeholder="MYMAPS UPLINK ..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Link MyMaps (URL)</label>
                  <input
                    type="url"
                    value={uplinkForm.mymapsUrl}
                    onChange={e => setUplinkForm({ ...uplinkForm, mymapsUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/d/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Schematic E2E (PDF)</label>
                  <input
                    type="text"
                    value={uplinkForm.schematicE2E}
                    onChange={e => setUplinkForm({ ...uplinkForm, schematicE2E: e.target.value })}
                    placeholder="POP_1KPN..._TO-POP_..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Link Schematic (URL)</label>
                  <input
                    type="url"
                    value={uplinkForm.schematicE2EUrl}
                    onChange={e => setUplinkForm({ ...uplinkForm, schematicE2EUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan</label>
                <input
                  type="text"
                  value={uplinkForm.keterangan}
                  onChange={e => setUplinkForm({ ...uplinkForm, keterangan: e.target.value })}
                  placeholder="Panjang, Core, ID ODF..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUplinkOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan E2E Uplink
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit E2E Uplink Modal */}
      {editingUplink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Data &amp; Link E2E Uplink</h3>
                <p className="text-[11px] text-slate-500">Perbarui Hostname OLT, Status, atau lengkapi link Visio, MyMaps &amp; Schematic E2E</p>
              </div>
              <button onClick={() => setEditingUplink(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEditUplink} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hostname OLT</label>
                <input
                  type="text"
                  value={editingUplink.hostnameOlt}
                  onChange={e => setEditingUplink({ ...editingUplink, hostnameOlt: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Report</label>
                  <select
                    value={editingUplink.statusReport}
                    onChange={e => setEditingUplink({ ...editingUplink, statusReport: e.target.value as E2EStatusReport })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="DONE">DONE</option>
                    <option value="PROGRESS">PROGRESS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">PIC</label>
                  <select
                    value={editingUplink.pic}
                    onChange={e => setEditingUplink({ ...editingUplink, pic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="KANAYA">KANAYA</option>
                    <option value="JACK">JACK</option>
                    <option value="DIMAS">DIMAS</option>
                    <option value="ALIFIA">ALIFIA</option>
                    <option value="NOVI">NOVI</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Actual Done</label>
                  <input
                    type="text"
                    value={editingUplink.actualDone}
                    onChange={e => setEditingUplink({ ...editingUplink, actualDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Report Done</label>
                  <input
                    type="text"
                    value={editingUplink.reportDone}
                    onChange={e => setEditingUplink({ ...editingUplink, reportDone: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Link Berkas Visio, MyMaps &amp; Schematic E2E
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">DATACORE VISIO (Nama)</label>
                    <input
                      type="text"
                      value={editingUplink.datacoreVisio || ''}
                      onChange={e => setEditingUplink({ ...editingUplink, datacoreVisio: e.target.value })}
                      placeholder="Nama file .vsdx"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Link Visio (URL)</label>
                    <input
                      type="url"
                      value={editingUplink.datacoreVisioUrl || ''}
                      onChange={e => setEditingUplink({ ...editingUplink, datacoreVisioUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">MYMAPS (Label)</label>
                    <input
                      type="text"
                      value={editingUplink.mymaps || ''}
                      onChange={e => setEditingUplink({ ...editingUplink, mymaps: e.target.value })}
                      placeholder="MYMAPS UPLINK ..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Link MyMaps (URL)</label>
                    <input
                      type="url"
                      value={editingUplink.mymapsUrl || ''}
                      onChange={e => setEditingUplink({ ...editingUplink, mymapsUrl: e.target.value })}
                      placeholder="https://www.google.com/maps/d/..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Schematic E2E (PDF)</label>
                    <input
                      type="text"
                      value={editingUplink.schematicE2E || ''}
                      onChange={e => setEditingUplink({ ...editingUplink, schematicE2E: e.target.value })}
                      placeholder="POP_1KPN..._TO-POP_..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Link Schematic (URL)</label>
                    <input
                      type="url"
                      value={editingUplink.schematicE2EUrl || ''}
                      onChange={e => setEditingUplink({ ...editingUplink, schematicE2EUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan</label>
                <input
                  type="text"
                  value={editingUplink.keterangan}
                  onChange={e => setEditingUplink({ ...editingUplink, keterangan: e.target.value })}
                  placeholder="Panjang, Core, ID ODF..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUplink(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add SID Modal */}
      {isAddSidOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Data SID Pelanggan</h3>
              <button onClick={() => setIsAddSidOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSid} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nomor SID</label>
                <input
                  type="text"
                  value={sidForm.sidNumber}
                  onChange={e => setSidForm({ ...sidForm, sidNumber: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  value={sidForm.customerName}
                  onChange={e => setSidForm({ ...sidForm, customerName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipe Layanan</label>
                  <select
                    value={sidForm.serviceType}
                    onChange={e => setSidForm({ ...sidForm, serviceType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500"
                  >
                    <option value="IP-VPN">IP-VPN</option>
                    <option value="Metro-E">Metro-E</option>
                    <option value="Internet Dedicated">Internet Dedicated</option>
                    <option value="FTTH Backhaul">FTTH Backhaul</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bandwidth (Mbps)</label>
                  <input
                    type="number"
                    value={sidForm.bandwidthMbps}
                    onChange={e => setSidForm({ ...sidForm, bandwidthMbps: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">PIC Drafter</label>
                <input
                  type="text"
                  value={sidForm.pic}
                  onChange={e => setSidForm({ ...sidForm, pic: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSidOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan SID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
