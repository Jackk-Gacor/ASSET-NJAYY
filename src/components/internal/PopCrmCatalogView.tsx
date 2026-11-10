import React, { useState, useMemo } from 'react';
import { NetworkNode, MalangRegion } from '../../types';
import { INITIAL_NETWORK_NODES, INITIAL_SIDS } from '../../data/initialData';
import {
  Search,
  Filter,
  Download,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Server,
  Layers,
  ShieldCheck,
  Activity,
  ArrowRight,
  Database,
  Building,
  User,
  Phone,
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Grid,
  List,
} from 'lucide-react';

interface PopCrmCatalogViewProps {
  onSelectNode: (node: NetworkNode) => void;
  onNavigateToMap?: (node: NetworkNode) => void;
  showToast: (message: string, type: 'success' | 'warning' | 'info') => void;
}

export const PopCrmCatalogView: React.FC<PopCrmCatalogViewProps> = ({
  onSelectNode,
  onNavigateToMap,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [viewLayout, setViewLayout] = useState<'table' | 'cards'>('table');
  const [copiedNodeId, setCopiedNodeId] = useState<string | null>(null);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return INITIAL_NETWORK_NODES.filter(node => {
      const matchSearch =
        !searchTerm ||
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.crmAssetCode && node.crmAssetCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (node.address && node.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (node.picName && node.picName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        node.region.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRegion = selectedRegion === 'ALL' || node.region === selectedRegion;
      const matchType = selectedType === 'ALL' || node.type === selectedType;

      return matchSearch && matchRegion && matchType;
    });
  }, [searchTerm, selectedRegion, selectedType]);

  // Aggregate stats
  const totalNodes = INITIAL_NETWORK_NODES.length;
  const totalCapacity = INITIAL_NETWORK_NODES.reduce((acc, n) => acc + n.capacityCores, 0);
  const totalUsed = INITIAL_NETWORK_NODES.reduce((acc, n) => acc + n.usedCores, 0);
  const totalCustomers = INITIAL_NETWORK_NODES.reduce((acc, n) => acc + (n.connectedCustomersCount || 15), 0);
  const avgUtilization = Math.round((totalUsed / totalCapacity) * 100);

  const handleCopyCoordinates = (node: NetworkNode, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${node.lat.toFixed(6)}, ${node.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedNodeId(node.id);
    showToast(`Koordinat ${node.code} disalin: ${text}`, 'info');
    setTimeout(() => setCopiedNodeId(null), 2000);
  };

  const handleCopyGeoJson = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: INITIAL_NETWORK_NODES.map(node => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [node.lng, node.lat],
        },
        properties: {
          id: node.id,
          code: node.code,
          name: node.name,
          crmAssetCode: node.crmAssetCode,
          type: node.type,
          region: node.region,
          capacityCores: node.capacityCores,
          usedCores: node.usedCores,
          address: node.address,
          picName: node.picName,
          status: node.status,
          uptimeSla: node.uptimeSla,
        },
      })),
    };

    navigator.clipboard.writeText(JSON.stringify(geojson, null, 2));
    showToast('Data GeoJSON 16 POP Area 45 berhasil disalin ke clipboard!', 'success');
  };

  const handleExportCsv = () => {
    const headers = [
      'ID Node',
      'Kode CRM Asset',
      'Kode Standar Area 45',
      'Nama POP / ODC',
      'Klasifikasi Tier',
      'Wilayah Kerja',
      'Latitude',
      'Longitude',
      'Alamat Geotagged Lapangan',
      'Total Kapasitas Core',
      'Core Terpakai',
      'Utilisasi (%)',
      'Pelanggan Enterprise (SID)',
      'PIC Teknisi Asset',
      'SLA Uptime',
      'Status',
    ];

    const rows = INITIAL_NETWORK_NODES.map(n => [
      `"${n.id}"`,
      `"${n.crmAssetCode || '-'}"`,
      `"${n.code}"`,
      `"${n.name}"`,
      `"${n.type}"`,
      `"${n.region}"`,
      `"${n.lat.toFixed(6)}"`,
      `"${n.lng.toFixed(6)}"`,
      `"${(n.address || '').replace(/"/g, '""')}"`,
      n.capacityCores,
      n.usedCores,
      `"${Math.round((n.usedCores / n.capacityCores) * 100)}%"`,
      n.connectedCustomersCount || 15,
      `"${n.picName || '-'}"`,
      `"${n.uptimeSla || '99.98%'}"`,
      `"${n.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Katalog_CRM_Asset_POP_Area45_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Katalog CRM Aset POP Area 45 berhasil diekspor ke format CSV!', 'success');
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Server className="w-4 h-4 text-blue-600" />
            <span>CRM &amp; ASSET MANAGEMENT · SBU REGIONAL MALANG AREA 45</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Katalog Asset POP &amp; ODC
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Inventaris data CRM simpul fiber optik terintegrasi dengan koordinat GPS presisi, geotagging alamat, port capacity, dan penanggung jawab teknisi Divisi Asset.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyGeoJson}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
            title="Salin data spasial 16 POP ke format GeoJSON standard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin GeoJSON</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            title="Unduh seluruh data CRM simpul POP ke format spreadsheet CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS (CLEAN & METRIC-DRIVEN) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total POP &amp; ODC
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-900">{totalNodes}</span>
            <span className="text-xs text-slate-500">Titik Asset</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            100% Geotagged
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Sentral Titik 0
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-extrabold font-mono text-purple-700 truncate">GI Kebon Agung</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Origin: GI Lawang
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Kapasitas Core Optik
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-extrabold font-mono text-blue-600">{totalUsed}</span>
            <span className="text-xs text-slate-400 font-mono">/ {totalCapacity} C</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${avgUtilization}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pelanggan Terhubung
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-900">{totalCustomers}</span>
            <span className="text-xs text-slate-500">Enterprise SID</span>
          </div>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block">
            Perbankan &amp; Instansi
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Tim Asset &amp; GIS
          </span>
          <div className="flex items-center gap-2 mt-1.5">
            <img
              src="/assets/aistudio/image_53ba5752.png"
              alt="Dimas Putra"
              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
              title="Dimas Putra (Lead Drafting & GIS Asset)"
            />
            <img
              src="/assets/aistudio/image_c3e39bbf.png"
              alt="Rafly Septian"
              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
              title="Rafly Septian (Optical Route Design Engineer)"
            />
            <span className="text-xs font-bold text-slate-800">Dimas &amp; Rafly</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Divisi Asset Icon Plus</span>
        </div>
      </div>

      {/* ================= CONTROLS & FILTER BAR ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama POP, kode CRM, kecamatan, atau PIC..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Region & Classification Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Semua Wilayah Kerja</option>
            <option value="Kepanjen (Malang Selatan)">Malang Selatan (Kepanjen)</option>
            <option value="Malang Kota">Malang Kota</option>
            <option value="Kota Batu">Kota Batu</option>
            <option value="Singosari (Malang Utara)">Singosari (Malang Utara)</option>
            <option value="Lawang">Lawang</option>
            <option value="Turen & Dampit">Turen &amp; Dampit</option>
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Semua Klasifikasi</option>
            <option value="SUPER_BACKBONE">Super Backbone (Sentral)</option>
            <option value="POP_BACKBONE">POP Backbone (Kota)</option>
            <option value="POP_ACCESS">POP Access (Distribusi ULP)</option>
          </select>

          {/* Layout Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewLayout('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel CRM"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'cards' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu Asset"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= DATA GRID (TABLE VIEW) ================= */}
      {viewLayout === 'table' ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Asset ID &amp; Kode</th>
                  <th className="py-3 px-4">Nama POP / ODC Standar Area 45</th>
                  <th className="py-3 px-4">Klasifikasi &amp; Wilayah</th>
                  <th className="py-3 px-4">Koordinat GPS Presisi (WGS84)</th>
                  <th className="py-3 px-4">Alamat Lapangan Geotagged</th>
                  <th className="py-3 px-4">Kapasitas Core</th>
                  <th className="py-3 px-4">PIC Divisi Asset</th>
                  <th className="py-3 px-4 text-center">Status / SLA</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredNodes.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Tidak ada simpul POP yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredNodes.map(node => {
                    const isTitik0 = node.id === 'NODE-GI-KBG';
                    const isCopied = copiedNodeId === node.id;
                    const utilPercent = Math.round((node.usedCores / node.capacityCores) * 100);

                    return (
                      <tr
                        key={node.id}
                        onClick={() => onSelectNode(node)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isTitik0 ? 'bg-purple-50/30' : ''
                        }`}
                      >
                        {/* 1. Asset ID & Code */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-blue-600">
                              {node.crmAssetCode || node.code.split('_')[0]}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {node.id}
                            </span>
                          </div>
                        </td>

                        {/* 2. Full Standard Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                isTitik0
                                  ? 'bg-purple-600 ring-2 ring-purple-200 animate-pulse'
                                  : node.status === 'Warning'
                                  ? 'bg-amber-500'
                                  : 'bg-cyan-500 ring-2 ring-cyan-100'
                              }`}
                            />
                            <div>
                              <span className="font-bold text-slate-900 block leading-snug">
                                {node.name}
                              </span>
                              {isTitik0 && (
                                <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-mono">
                                  ★ TITIK 0 SENTRAL MALANG
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 3. Tier & Region */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">
                              {node.region}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {node.type.replace('_', ' ')}
                            </span>
                          </div>
                        </td>

                        {/* 4. Exact Coordinates (Lat, Lng) */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="font-mono text-[11px] text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                              <span>{node.lat.toFixed(6)}</span>, <span>{node.lng.toFixed(6)}</span>
                            </div>
                            <button
                              onClick={e => handleCopyCoordinates(node, e)}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                              title="Salin Latitude & Longitude"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* 5. Address */}
                        <td className="py-3 px-4 max-w-[220px]">
                          <span className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed" title={node.address}>
                            {node.address || '-'}
                          </span>
                        </td>

                        {/* 6. Capacity & Utilization */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between text-[11px] font-mono">
                              <span className="font-bold text-slate-800">{node.usedCores} C</span>
                              <span className="text-slate-400">/ {node.capacityCores} C</span>
                            </div>
                            <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  utilPercent > 80 ? 'bg-amber-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${utilPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 7. PIC Asset */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {node.picAvatar && (
                              <img
                                src={node.picAvatar}
                                alt={node.picName || 'PIC'}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[120px]">
                                {node.picName?.split('(')[0] || 'Tim Asset'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {node.picPhone || '+62 812-xxxx'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 8. Status & SLA */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                node.status === 'Optimal'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {node.status}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {node.uptimeSla || '99.98%'} SLA
                            </span>
                          </div>
                        </td>

                        {/* 9. Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => onSelectNode(node)}
                              className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors"
                              title="Buka lembar atribut teknis lengkap & ODF"
                            >
                              Detail
                            </button>
                            {onNavigateToMap && (
                              <button
                                onClick={() => onNavigateToMap(node)}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Fokuskan simpul ini pada Peta GIS"
                              >
                                <Compass className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= CARDS VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map(node => {
            const isTitik0 = node.id === 'NODE-GI-KBG';
            const isCopied = copiedNodeId === node.id;
            const utilPercent = Math.round((node.usedCores / node.capacityCores) * 100);

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between ${
                  isTitik0 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {node.crmAssetCode || node.code.split('_')[0]}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {node.name}
                      </h3>
                      <span className="text-[11px] text-slate-500">{node.region}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        node.status === 'Optimal'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  {/* Coordinates pill */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{node.lat.toFixed(6)}, {node.lng.toFixed(6)}</span>
                    </div>
                    <button
                      onClick={e => handleCopyCoordinates(node, e)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {node.address}
                  </p>

                  {/* Core Capacity Bar */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Kapasitas Core:</span>
                      <span className="font-bold text-slate-900">
                        {node.usedCores} / {node.capacityCores} ({utilPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${utilPercent > 80 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${utilPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {node.picAvatar && (
                      <img
                        src={node.picAvatar}
                        alt="PIC"
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                    )}
                    <span className="font-medium text-slate-700 text-[11px]">
                      {node.picName?.split('(')[0] || 'Tim Asset'}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 group">
                    <span>Detail CRM</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
