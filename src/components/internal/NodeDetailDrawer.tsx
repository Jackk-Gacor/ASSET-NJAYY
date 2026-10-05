import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NetworkNode } from '../../types';
import { INITIAL_NETWORK_NODES } from '../../data/initialData';
import {
  getNodeTechnicalProfile,
  NodeTechnicalProfile,
  FiberPortSpec,
  NodeMaintenanceRecord,
} from '../../data/nodeTechnicalDetails';
import {
  X,
  Maximize2,
  Minimize2,
  Server,
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  Thermometer,
  Layers,
  ArrowRight,
  Database,
  Route,
  Download,
  Plus,
  Search,
  Sliders,
  Copy,
  Check,
  Radio,
  FileText,
  RefreshCw,
  HardDrive,
  Cpu,
  Info,
} from 'lucide-react';

interface NodeDetailDrawerProps {
  node: NetworkNode | null;
  onClose: () => void;
  onSelectNode: (node: NetworkNode) => void;
  onStartTrace?: (node: NetworkNode) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onSelectNode,
  onStartTrace,
}) => {
  const { openCoreDetail, dataCoreList, showToast } = useApp();

  // Mode: drawer (sidebar) or modal (centered expanded)
  const [isModalMode, setIsModalMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'attributes' | 'ports' | 'maintenance'>('attributes');

  // Copied coordinate feedback
  const [copiedGps, setCopiedGps] = useState(false);

  // OTDR Signal Test state
  const [isTestingSignal, setIsTestingSignal] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Port filters
  const [portStatusFilter, setPortStatusFilter] = useState<'ALL' | 'Active' | 'Spare' | 'Reserved' | 'Warning'>('ALL');
  const [portSearch, setPortSearch] = useState('');
  const [testedPortId, setTestedPortId] = useState<string | null>(null);

  // Maintenance state (dynamic addition)
  const [maintenanceFilter, setMaintenanceFilter] = useState<string>('ALL');
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [customLogs, setCustomLogs] = useState<Record<string, NodeMaintenanceRecord[]>>({});

  // New maintenance form state
  const [newLogCategory, setNewLogCategory] = useState<NodeMaintenanceRecord['category']>('Preventive');
  const [newLogTech, setNewLogTech] = useState('');
  const [newLogSummary, setNewLogSummary] = useState('');
  const [newLogDetails, setNewLogDetails] = useState('');
  const [newLogImpact, setNewLogImpact] = useState('Zero Downtime');

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddLogOpen) {
          setIsAddLogOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isAddLogOpen]);

  if (!node) return null;

  const profile: NodeTechnicalProfile = useMemo(() => {
    return getNodeTechnicalProfile(node);
  }, [node]);

  // Combine static and custom added logs
  const combinedLogs = useMemo(() => {
    const custom = customLogs[node.id] || [];
    return [...custom, ...profile.maintenanceLogs];
  }, [node.id, profile.maintenanceLogs, customLogs]);

  // Filtered Ports
  const filteredPorts = useMemo(() => {
    return profile.ports.filter(port => {
      const matchStatus = portStatusFilter === 'ALL' || port.status === portStatusFilter;
      const matchSearch =
        !portSearch ||
        port.portLabel.toLowerCase().includes(portSearch.toLowerCase()) ||
        port.assignedCircuit.toLowerCase().includes(portSearch.toLowerCase()) ||
        port.customerOrUplink.toLowerCase().includes(portSearch.toLowerCase()) ||
        port.connectorType.toLowerCase().includes(portSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [profile.ports, portStatusFilter, portSearch]);

  // Filtered Maintenance Logs
  const filteredLogs = useMemo(() => {
    if (maintenanceFilter === 'ALL') return combinedLogs;
    return combinedLogs.filter(log => log.category === maintenanceFilter);
  }, [combinedLogs, maintenanceFilter]);

  const handleCopyGps = () => {
    const coords = `${node.lat.toFixed(6)}, ${node.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coords);
    setCopiedGps(true);
    showToast(`Koordinat GPS disalin: ${coords}`, 'info');
    setTimeout(() => setCopiedGps(false), 2000);
  };

  const handleRunOtdrTest = () => {
    setIsTestingSignal(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingSignal(false);
      const isWarn = node.status === 'Warning';
      const loss = isWarn ? '-22.8 dBm (Tinggi)' : '-16.4 dBm (Normal)';
      const delay = isWarn ? '3.8 ms' : '1.4 ms';
      setTestResult(
        `Hasil Kalibrasi OTDR [1550nm]: Daya Terima ${loss} · RTT Latency: ${delay} · Margin Cadangan: 6.2 dB (SLA Terpenuhi)`
      );
      showToast(`Pengujian sinyal OTDR pada [${node.code}] berhasil selesai.`, 'success');
    }, 1400);
  };

  const handleTestSpecificPort = (port: FiberPortSpec) => {
    setTestedPortId(port.id);
    setTimeout(() => {
      setTestedPortId(null);
      showToast(
        `Port ${port.portLabel}: Tx ${port.txPowerDbm} dBm, Rx ${port.rxPowerDbm} dBm, Insertion Loss ${port.insertionLossDb} dB (Lolos Kalibrasi)`,
        'success'
      );
    }, 1000);
  };

  const handleAddMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogSummary.trim()) {
      showToast('Harap masukkan ringkasan pemeliharaan', 'warning');
      return;
    }

    const newRecord: NodeMaintenanceRecord = {
      id: `MNT-${node.code}-${Date.now().toString().slice(-4)}`,
      ticketNumber: `REQ-${node.code}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      category: newLogCategory,
      technicians: newLogTech.trim() || 'NOC Field Technician Team',
      status: 'Verified',
      impact: newLogImpact,
      summary: newLogSummary.trim(),
      details: newLogDetails.trim() || 'Pemeliharaan berhasil diverifikasi oleh sistem NOC regional.',
    };

    setCustomLogs(prev => ({
      ...prev,
      [node.id]: [newRecord, ...(prev[node.id] || [])],
    }));

    setIsAddLogOpen(false);
    setNewLogSummary('');
    setNewLogDetails('');
    setNewLogTech('');
    showToast(`Log pemeliharaan ${newRecord.ticketNumber} berhasil dicatat.`, 'success');
  };

  const handleExportMaintenanceCsv = () => {
    const headers = ['Ticket Number', 'Tanggal', 'Kategori', 'Teknisi', 'Status', 'Dampak', 'Ringkasan', 'Detail'];
    const rows = combinedLogs.map(l => [
      `"${l.ticketNumber}"`,
      `"${l.date} ${l.timestamp}"`,
      `"${l.category}"`,
      `"${l.technicians}"`,
      `"${l.status}"`,
      `"${l.impact}"`,
      `"${l.summary.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Maintenance_Log_${node.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Riwayat pemeliharaan [${node.code}] berhasil diekspor ke CSV`, 'success');
  };

  // Node status badge styles
  const isOperational = node.status === 'Optimal';
  const isWarning = node.status === 'Warning';

  return (
    <>
      {/* Semi-transparent Backdrop (Click to dismiss) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
          isModalMode ? 'opacity-100' : 'opacity-60 lg:opacity-20'
        }`}
      />

      {/* Main Container: Slides from right in drawer mode, Centered in modal mode */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transition-all duration-300 flex flex-col text-slate-800 border border-slate-200 ${
          isModalMode
            ? 'inset-4 md:inset-8 lg:inset-12 max-w-5xl mx-auto rounded-3xl overflow-hidden'
            : 'top-0 right-0 bottom-0 w-full sm:w-[540px] md:w-[620px] lg:w-[660px] h-full rounded-l-3xl border-r-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="p-5 md:p-6 bg-slate-50/90 border-b border-slate-200/80 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {node.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {node.type}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1.5 border ${
                    isOperational
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isWarning
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOperational ? 'bg-emerald-500 animate-pulse' : isWarning ? 'bg-amber-500 animate-ping' : 'bg-slate-400'
                    }`}
                  />
                  <span>{node.status}</span>
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                {node.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.siteName} · {node.region}</span>
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsModalMode(!isModalMode)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-xl transition-colors"
                title={isModalMode ? 'Kembalikan ke Mode Sidebar' : 'Perbesar ke Mode Modal'}
              >
                {isModalMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors"
                title="Tutup Panel (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-200/60">
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Core
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-slate-900">
                  {node.usedCores}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / {node.capacityCores}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Utilisasi Core
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-bold font-mono text-blue-600">
                  {Math.round((node.usedCores / node.capacityCores) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  ({node.capacityCores - node.usedCores} Spare)
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Redaman Rata-rata
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-base font-bold font-mono ${isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {profile.opticalTransmission.averageAttenuationDbm}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">dBm</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 border-b border-slate-200 -mb-5 md:-mb-6">
            <button
              onClick={() => setActiveTab('attributes')}
              className={`pb-3.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                activeTab === 'attributes'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Atribut Teknis Lengkap</span>
            </button>

            <button
              onClick={() => setActiveTab('ports')}
              className={`pb-3.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                activeTab === 'ports'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Port Fiber Optik</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-100 text-blue-700">
                {profile.ports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`pb-3.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                activeTab === 'maintenance'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Riwayat Pemeliharaan</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-200 text-slate-700">
                {combinedLogs.length}
              </span>
            </button>
          </div>
        </div>

        {/* ================= BODY CONTENT (SCROLLABLE) ================= */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {/* TAB 1: DETAILED TECHNICAL ATTRIBUTES */}
          {activeTab === 'attributes' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Core Breakdown Visualizer */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Distribusi &amp; Alokasi Kapasitas Core
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Total: {profile.coreBreakdown.total} Core
                  </span>
                </div>

                {/* Multi-segment progress bar */}
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(profile.coreBreakdown.active / profile.coreBreakdown.total) * 100}%` }}
                    className="h-full bg-blue-600"
                    title={`Aktif: ${profile.coreBreakdown.active} Core`}
                  />
                  <div
                    style={{ width: `${(profile.coreBreakdown.reservedProtection / profile.coreBreakdown.total) * 100}%` }}
                    className="h-full bg-indigo-500"
                    title={`Terproteksi (Failover): ${profile.coreBreakdown.reservedProtection} Core`}
                  />
                  <div
                    style={{ width: `${(profile.coreBreakdown.spareDark / profile.coreBreakdown.total) * 100}%` }}
                    className="h-full bg-emerald-400"
                    title={`Dark Spare (Tersedia): ${profile.coreBreakdown.spareDark} Core`}
                  />
                  <div
                    style={{ width: `${(profile.coreBreakdown.degradedWarning / profile.coreBreakdown.total) * 100}%` }}
                    className="h-full bg-amber-400"
                    title={`Degraded / High Loss: ${profile.coreBreakdown.degradedWarning} Core`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-slate-600">Aktif:</span>
                    <span className="font-mono font-bold text-slate-800">{profile.coreBreakdown.active}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-slate-600">Proteksi Ring:</span>
                    <span className="font-mono font-bold text-slate-800">{profile.coreBreakdown.reservedProtection}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-slate-600">Spare Dark:</span>
                    <span className="font-mono font-bold text-slate-800">{profile.coreBreakdown.spareDark}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-slate-600">Degraded:</span>
                    <span className="font-mono font-bold text-slate-800">{profile.coreBreakdown.degradedWarning}</span>
                  </div>
                </div>
              </div>

              {/* Hardware & Shelter Rack Specifications */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-600" />
                    Spesifikasi Hardware &amp; ODF Rack
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {node.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Klasifikasi Tingkat Simpul</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{profile.tierClassification}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Model Rangka ODF</span>
                    <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{profile.odfRackModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Posisi Kabinet / Rak</span>
                    <span className="font-mono text-slate-800 mt-0.5 block">{profile.cabinetSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kapasitas Throughput Backhaul</span>
                    <span className="font-bold text-blue-700 mt-0.5 block">{profile.opticalTransmission.backhaulBandwidth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Perangkat Transmisi Optical</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{profile.opticalTransmission.dwdmModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Grid Kanal WDM / DWDM</span>
                    <span className="font-mono text-slate-700 mt-0.5 block">{profile.opticalTransmission.channelGrid}</span>
                  </div>
                </div>
              </div>

              {/* Power Redundancy & Climate Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Power System Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Catu Daya &amp; Redundansi UPS
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold">
                      {profile.powerSystem.batteryHealthPercent}% Health
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sumber Utama (Grid)</span>
                      <span className="font-medium text-slate-800">{profile.powerSystem.mainSupply}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Model UPS Online</span>
                      <span className="font-medium text-slate-800">{profile.powerSystem.upsModel}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Backup Baterai:</span>
                      <span className="font-mono font-bold text-slate-900">{profile.powerSystem.batteryBackupHours} Jam</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Backup Genset:</span>
                      <span className="font-medium text-slate-700 text-[11px] truncate max-w-[180px]">
                        {profile.powerSystem.atsGenerator}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Climate & Environmental Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-sky-500" />
                      Kondisi Lingkungan Shelter
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        profile.climateControl.status === 'Optimal'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      ● {profile.climateControl.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Suhu Ruang</span>
                        <span className="text-base font-bold font-mono text-slate-900">
                          {profile.climateControl.roomTempC}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Kelembaban</span>
                        <span className="text-base font-bold font-mono text-slate-900">
                          {profile.climateControl.humidityPercent}% RH
                        </span>
                      </div>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Sistem Pendingin</span>
                      <span className="font-medium text-slate-800 text-[11px]">{profile.climateControl.coolingSystem}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Proteksi Kebakaran</span>
                      <span className="font-medium text-slate-700 text-[10px]">{profile.climateControl.fireProtection}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Coordinates & Facility Site */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Lokasi Fisik &amp; Informasi Kontak PIC
                  </span>
                  <button
                    onClick={handleCopyGps}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg transition-colors shadow-2xs"
                  >
                    {copiedGps ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedGps ? 'Tersalin' : 'Salin GPS'}</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Alamat Bangunan / Shelter</span>
                    <span className="font-medium text-slate-800">{profile.address}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Koordinat Latitude</span>
                      <span className="font-mono font-bold text-slate-800">{node.lat.toFixed(6)}° S</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Koordinat Longitude</span>
                      <span className="font-mono font-bold text-slate-800">{node.lng.toFixed(6)}° E</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Elevasi Topografi</span>
                      <span className="font-mono font-bold text-slate-800">{profile.elevationMasl} mdpl</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{profile.picName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.picPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interconnected Network Links & Neighbors */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-indigo-600" />
                  Jalur Interkoneksi Simpul Terhubung ({node.connections.length})
                </span>
                <p className="text-xs text-slate-500">
                  Klik simpul tetangga di bawah untuk berpindah inspeksi langsung ke titik tersebut:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {node.connections.map(connId => {
                    const neighbor = INITIAL_NETWORK_NODES.find(n => n.id === connId);
                    if (!neighbor) return null;
                    return (
                      <div
                        key={connId}
                        onClick={() => onSelectNode(neighbor)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block">
                            {neighbor.code}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 line-clamp-1">
                            {neighbor.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {neighbor.region} · {neighbor.capacityCores} Cores
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OTDR Ping Calibration Action */}
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Uji Kalibrasi Sinyal OTDR Real-Time
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-600 font-semibold">
                    1550nm Wavelength
                  </span>
                </div>

                <p className="text-xs text-blue-800/80 leading-relaxed">
                  Lakukan simulasi pengujian pantulan optik (OTDR trace) dari POP ini menuju gateway untuk mengukur return loss dan stabilitas link.
                </p>

                <button
                  onClick={handleRunOtdrTest}
                  disabled={isTestingSignal}
                  className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingSignal ? 'animate-spin' : ''}`} />
                  <span>{isTestingSignal ? 'Melakukan Injeksi Laser & Mengukur OTDR...' : 'Jalankan Kalibrasi OTDR Simpul'}</span>
                </button>

                {testResult && (
                  <div className="p-3 bg-white border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1 animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Hasil Pengukuran Valid</span>
                    </div>
                    <p className="font-mono text-[11px] leading-relaxed text-slate-700">{testResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FIBER OPTIC PORT SPECIFICATIONS */}
          {activeTab === 'ports' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Filter and Search Controls */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={portSearch}
                    onChange={e => setPortSearch(e.target.value)}
                    placeholder="Cari port, ID sirkuit, jenis konektor, atau pelanggan..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                  {portSearch && (
                    <button
                      onClick={() => setPortSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                  {(['ALL', 'Active', 'Spare', 'Reserved', 'Warning'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setPortStatusFilter(status)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors shrink-0 ${
                        portStatusFilter === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {status === 'ALL' ? 'Semua Port' : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual ODF Patch Panel Rack Matrix */}
              <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 space-y-3 text-white">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-mono font-bold tracking-wider uppercase text-cyan-400">
                      ODF Tray Optical Patch Matrix
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Standard ITU-T G.652.D / LC-APC
                  </span>
                </div>

                {/* Port Pins Grid */}
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2">
                  {profile.ports.map(port => {
                    const isPortActive = port.status === 'Active';
                    const isPortSpare = port.status === 'Spare';
                    const isPortWarn = port.status === 'Warning';
                    const isPortResv = port.status === 'Reserved';

                    let pinColor = 'bg-emerald-500 shadow-emerald-500/50';
                    if (isPortWarn) pinColor = 'bg-amber-400 shadow-amber-400/50 animate-pulse';
                    else if (isPortSpare) pinColor = 'bg-slate-600 shadow-slate-600/30';
                    else if (isPortResv) pinColor = 'bg-indigo-400 shadow-indigo-400/50';

                    return (
                      <div
                        key={port.id}
                        onClick={() => handleTestSpecificPort(port)}
                        className="group/pin relative bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 rounded-lg p-1.5 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105"
                        title={`${port.portLabel}: ${port.assignedCircuit} (${port.status})`}
                      >
                        <span className="text-[9px] font-mono text-slate-400 group-hover/pin:text-cyan-300">
                          {String(port.portNumber).padStart(2, '0')}
                        </span>
                        <div className={`w-3 h-3 rounded-full mt-1 ${pinColor} shadow-xs`} />
                        <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">
                          {port.connectorType.split('/')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live Tx/Rx
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" /> Ring Failover
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-600" /> Dark Spare
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Loss Warning
                    </span>
                  </div>
                  <span className="font-mono text-slate-500">Klik port untuk uji loop</span>
                </div>
              </div>

              {/* Port Detail Cards List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Menampilkan {filteredPorts.length} dari {profile.ports.length} port</span>
                  <span className="font-mono text-[11px]">Konektor Dominan: LC/APC &amp; SC/UPC</span>
                </div>

                {filteredPorts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Tidak ada port yang cocok dengan kriteria filter.</p>
                  </div>
                ) : (
                  filteredPorts.map(port => {
                    const isTestingThis = testedPortId === port.id;
                    const isPortWarn = port.status === 'Warning';
                    const isPortActive = port.status === 'Active';

                    return (
                      <div
                        key={port.id}
                        className={`bg-white border rounded-2xl p-4 transition-all shadow-2xs space-y-3 ${
                          isPortWarn
                            ? 'border-amber-300 bg-amber-50/20'
                            : 'border-slate-200/90 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                                {port.portLabel} (Port #{port.portNumber})
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                                {port.connectorType}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                Tray {port.trayNumber} · {port.fiberStandard}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mt-1">
                              {port.assignedCircuit}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {port.serviceType} · <span className="text-slate-700 font-medium">{port.customerOrUplink}</span>
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                                isPortActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isPortWarn
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : port.status === 'Reserved'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              ● {port.status}
                            </span>
                            <button
                              onClick={() => handleTestSpecificPort(port)}
                              disabled={isTestingThis}
                              className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50/70 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                            >
                              <Activity className={`w-3 h-3 ${isTestingThis ? 'animate-spin' : ''}`} />
                              <span>{isTestingThis ? 'Menguji...' : 'Uji Loop OTDR'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Port Optical Attributes Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-sans">Panjang Gelombang</span>
                            <span className="font-bold text-slate-800">{port.wavelength}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-sans">Tx Power Output</span>
                            <span className="font-bold text-slate-800">{port.txPowerDbm} dBm</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-sans">Rx Sensitivity</span>
                            <span className={`font-bold ${isPortWarn ? 'text-amber-700' : 'text-slate-800'}`}>
                              {port.rxPowerDbm} dBm
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-sans">Insertion Loss</span>
                            <span className={`font-bold ${port.insertionLossDb > 0.4 ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {port.insertionLossDb} dB
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MAINTENANCE HISTORY */}
          {activeTab === 'maintenance' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Maintenance Actions & Header */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {(['ALL', 'Preventive', 'OTDR Calibration', 'Splicing & Patching', 'Hardware & Power'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMaintenanceFilter(cat)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors shrink-0 ${
                        maintenanceFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat === 'ALL' ? 'Semua Kategori' : cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportMaintenanceCsv}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Unduh riwayat maintenance dalam format CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ekspor CSV</span>
                  </button>
                  <button
                    onClick={() => setIsAddLogOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Catat Log Baru</span>
                  </button>
                </div>
              </div>

              {/* Maintenance Log Timeline */}
              <div className="space-y-3.5">
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Tidak ada riwayat pemeliharaan pada kategori ini.</p>
                  </div>
                ) : (
                  filteredLogs.map(log => {
                    return (
                      <div
                        key={log.id}
                        className="bg-white border border-slate-200/90 rounded-2xl p-4.5 space-y-3 shadow-2xs hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                {log.ticketNumber}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                {log.category}
                              </span>
                              <span className="text-xs text-slate-400">·</span>
                              <span className="text-xs text-slate-500 font-medium">
                                {log.date} ({log.timestamp})
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">
                              {log.summary}
                            </h4>
                          </div>

                          <span
                            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                              log.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : log.status === 'Verified'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            ● {log.status}
                          </span>
                        </div>

                        {/* Details content */}
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {log.details}
                        </p>

                        {/* Footer info: Technicians & Impact */}
                        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 gap-2">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium text-slate-700">{log.technicians}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {log.measuredLossAfter !== undefined && (
                              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                                Loss Akhir: {log.measuredLossAfter} dB
                              </span>
                            )}
                            <span className="text-slate-400 font-medium">
                              SLA: <span className="text-slate-700">{log.impact}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= FOOTER ACTIONS ================= */}
        <div className="p-4 md:p-5 bg-slate-50/90 border-t border-slate-200/80 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const match = dataCoreList.find(c => c.popName === node.code);
                if (match) {
                  openCoreDetail(match);
                } else {
                  openCoreDetail(dataCoreList[0]);
                }
              }}
              className="py-2 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Buka Data Core</span>
            </button>

            {onStartTrace && (
              <button
                onClick={() => {
                  onStartTrace(node);
                  onClose();
                }}
                className="py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors"
                title="Mulai rute optical trace dari simpul ini"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Mulai Trace</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* ================= INLINE MODAL: ADD MAINTENANCE LOG ================= */}
        {isAddLogOpen && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-fadeIn text-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Catat Log Pemeliharaan Baru</h3>
                    <p className="text-xs text-slate-500 font-mono">Simpul: {node.code} ({node.name})</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddLogOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMaintenanceSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Pemeliharaan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newLogCategory}
                    onChange={e => setNewLogCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-medium"
                  >
                    <option value="Preventive">Preventive Inspection &amp; Cleaning</option>
                    <option value="OTDR Calibration">OTDR Optical Loss Calibration</option>
                    <option value="Splicing & Patching">Fusion Splicing &amp; Patchcord Re-routing</option>
                    <option value="Hardware & Power">Hardware, UPS &amp; Power Backup</option>
                    <option value="Emergency Restoration">Emergency Restoration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Tim Teknisi / PIC NOC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newLogTech}
                    onChange={e => setNewLogTech(e.target.value)}
                    placeholder="Contoh: Budi Santoso &amp; Tim Fiber Optik Regional"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dampak Layanan / Maintenance Window
                  </label>
                  <input
                    type="text"
                    value={newLogImpact}
                    onChange={e => setNewLogImpact(e.target.value)}
                    placeholder="Contoh: Zero Downtime (Hot Standby) / Jendela 01:00 - 03:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ringkasan Tindakan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newLogSummary}
                    onChange={e => setNewLogSummary(e.target.value)}
                    placeholder="Contoh: Kalibrasi ulang redaman port ODF Tray 1 pasca patroli"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rincian Hasil &amp; Temuan Lapangan
                  </label>
                  <textarea
                    rows={3}
                    value={newLogDetails}
                    onChange={e => setNewLogDetails(e.target.value)}
                    placeholder="Tuliskan temuan redaman, kondisi visual konektor, atau catatan evaluasi teknis..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddLogOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                  >
                    Simpan Log Pemeliharaan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
