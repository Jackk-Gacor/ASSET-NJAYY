import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeederItem, UplinkItem, SidItem } from '../../types';
import {
  Compass,
  Layers,
  FolderGit2,
  Search,
  Plus,
  ArrowRight,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Workflow,
  X,
} from 'lucide-react';

export const EngineeringView: React.FC = () => {
  const {
    feederList,
    uplinkList,
    sidList,
    dataCoreList,
    addFeeder,
    addUplink,
    addSid,
    openCoreDetail,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feeder' | 'uplink' | 'sid' | 'chain'>('feeder');
  const [search, setSearch] = useState('');

  // Modals
  const [isAddFeederOpen, setIsAddFeederOpen] = useState(false);
  const [isAddUplinkOpen, setIsAddUplinkOpen] = useState(false);
  const [isAddSidOpen, setIsAddSidOpen] = useState(false);

  // Forms
  const [feederForm, setFeederForm] = useState({
    feederCode: `FDR-MLG-NEW-${Math.floor(10 + Math.random() * 90)}`,
    name: 'Feeder Baru Distribusi',
    popOrigin: 'POP-MALANG-KLOJEN',
    oltOrigin: 'OLT-MALANG-KLOJEN-01',
    totalCores: 48,
    usedCores: 16,
    lengthKm: 4.5,
    status: 'Active' as const,
    targetSid: 'SID-MLG-8801',
    relatedCoreId: 'CORE-MLG-001',
  });

  const [uplinkForm, setUplinkForm] = useState({
    uplinkCode: `UPL-MLG-NEW-${Math.floor(10 + Math.random() * 90)}`,
    oltHostname: 'OLT-MALANG-KLOJEN-01',
    popDestination: 'POP-BACKBONE-SURABAYA-SBY01',
    bandwidthGbps: 10,
    status: 'Operational' as const,
    fiberType: 'G.652.D Single Mode',
    gponPort: '10GE Uplink SFP+ 1/1',
    relatedCoreId: 'CORE-MLG-001',
    documentsCount: 4,
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
    addFeeder(feederForm);
    setIsAddFeederOpen(false);
  };

  const handleCreateUplink = (e: React.FormEvent) => {
    e.preventDefault();
    addUplink(uplinkForm);
    setIsAddUplinkOpen(false);
  };

  const handleCreateSid = (e: React.FormEvent) => {
    e.preventDefault();
    addSid(sidForm);
    setIsAddSidOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Workflow className="w-4 h-4" />
            <span>MODUL ENGINEERING & PENGGAMBARAN GIS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Feeder, Uplink & SID Integration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tiga pilar pekerjaan yang saling berkaitan: Layanan Pelanggan (SID) → Kabel Distribusi (Feeder) → Pipa Transmisi (Uplink)
          </p>
        </div>

        {/* 3-Pillar Relationship Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chain')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 ${
              activeTab === 'chain'
                ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                : 'bg-slate-800 text-sky-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Diagram Hubungan 3 Pilar</span>
          </button>
        </div>
      </div>

      {/* Visual Relationship Chain Callout Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-sky-300">
              ⚡
            </span>
            <div>
              <p className="font-semibold text-white">Alur Keterkaitan Pekerjaan Engineering:</p>
              <p className="text-slate-400 text-[11px]">
                SID Pesanan Pelanggan dialokasikan ke core <strong>Feeder</strong>, lalu diagregasikan ke <strong>Uplink OLT</strong> menuju Backbone.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">SID</span>
            <span>⇄</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">FEEDER</span>
            <span>⇄</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">UPLINK</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 p-2 rounded-xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('feeder')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'feeder'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Feeder ({feederList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('uplink')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'uplink'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Uplink ({uplinkList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sid')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'sid'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>SID Layanan ({sidList.length})</span>
          </button>
        </div>

        {/* Tab-specific action button */}
        <div>
          {activeTab === 'feeder' && (
            <button
              onClick={() => setIsAddFeederOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Feeder</span>
            </button>
          )}
          {activeTab === 'uplink' && (
            <button
              onClick={() => setIsAddUplinkOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Uplink</span>
            </button>
          )}
          {activeTab === 'sid' && (
            <button
              onClick={() => setIsAddSidOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah SID</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB CONTENT: FEEDER */}
      {activeTab === 'feeder' && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Kode Feeder</th>
                  <th className="py-3 px-4">Nama Jalur</th>
                  <th className="py-3 px-4">POP / OLT Asal</th>
                  <th className="py-3 px-4">Panjang (Km)</th>
                  <th className="py-3 px-4">Kapasitas Core</th>
                  <th className="py-3 px-4">Target SID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Data Core</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {feederList.map(item => {
                  const linkedCore = dataCoreList.find(c => c.id === item.relatedCoreId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">
                        {item.feederCode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{item.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-slate-200 block">{item.popOrigin}</span>
                        <span className="text-slate-500 text-[11px]">{item.oltOrigin}</span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums">{item.lengthKm} Km</td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        {item.usedCores} / {item.totalCores} Core
                      </td>
                      <td className="py-3 px-4 font-mono text-purple-400">{item.targetSid}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {linkedCore ? (
                          <button
                            onClick={() => openCoreDetail(linkedCore)}
                            className="px-2.5 py-1 text-xs text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900 rounded border border-sky-800"
                          >
                            Lihat Core
                          </button>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: UPLINK */}
      {activeTab === 'uplink' && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Kode Uplink</th>
                  <th className="py-3 px-4">Hostname OLT</th>
                  <th className="py-3 px-4">POP Tujuan Transmisi</th>
                  <th className="py-3 px-4">Bandwidth</th>
                  <th className="py-3 px-4">Tipe Fiber & Port</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Core</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {uplinkList.map(item => {
                  const linkedCore = dataCoreList.find(c => c.id === item.relatedCoreId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                        {item.uplinkCode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{item.oltHostname}</td>
                      <td className="py-3 px-4 text-slate-300">{item.popDestination}</td>
                      <td className="py-3 px-4 font-mono font-bold text-sky-300 tabular-nums">
                        {item.bandwidthGbps} Gbps
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <span className="text-slate-200 block">{item.fiberType}</span>
                        <span className="text-slate-500 font-mono">{item.gponPort}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            item.status === 'Operational'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {linkedCore && (
                          <button
                            onClick={() => openCoreDetail(linkedCore)}
                            className="px-2.5 py-1 text-xs text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900 rounded border border-sky-800"
                          >
                            Detail Core
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SID */}
      {activeTab === 'sid' && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nomor SID</th>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Tipe Layanan</th>
                  <th className="py-3 px-4">Bandwidth</th>
                  <th className="py-3 px-4">Relasi Feeder & Uplink</th>
                  <th className="py-3 px-4">PIC Drafter</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {sidList.map(item => {
                  const feeder = feederList.find(f => f.id === item.relatedFeederId);
                  const uplink = uplinkList.find(u => u.id === item.relatedUplinkId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">
                        {item.sidNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{item.customerName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">
                          {item.serviceType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-sky-400 font-bold">
                        {item.bandwidthMbps} Mbps
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="text-slate-300 block">
                          Feeder: {feeder?.feederCode || item.relatedFeederId}
                        </span>
                        <span className="text-slate-500">
                          Uplink: {uplink?.uplinkCode || item.relatedUplinkId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{item.pic}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3-PILLAR RELATIONSHIP DIAGRAM */}
      {activeTab === 'chain' && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              ARSITEKTUR KETERKAITAN 3 PILAR
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Siklus Hubungan SID ↔ Feeder ↔ Uplink
            </h3>
            <p className="text-xs text-slate-400">
              Pelanggan memesan bandwidth (SID) → Tim Engineering mengalokasikan core fisik (Feeder) → Dihubungkan ke port transmisi (Uplink) → Dilindungi oleh konfigurasi Ring Proteksi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Box 1: SID */}
            <div className="p-6 rounded-xl bg-slate-900 border border-purple-500/40 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                  PILAR 1 · ORDER & SID
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">Surat Izin Disain (SID)</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Identitas kontrak layanan pelanggan institusi/korporat (misal Pemkot Malang, Rumah Sakit, Kampus). Menentukan kebutuhan bandwidth dan SLA.
                </p>
              </div>
              <div className="p-2.5 rounded bg-slate-950 text-[11px] font-mono text-purple-300">
                Sample: SID-MLG-8801 (Bank Jatim 500M)
              </div>
            </div>

            {/* Box 2: Feeder */}
            <div className="p-6 rounded-xl bg-slate-900 border border-sky-500/40 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                  PILAR 2 · KABEL DISTRIBUSI
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">Feeder Cable Routing</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Bentangan fisik kabel fiber optic (24 / 48 / 96 core) dari ODC/FDT ke lokasi gedung pelanggan dengan penomoran core spesifik.
                </p>
              </div>
              <div className="p-2.5 rounded bg-slate-950 text-[11px] font-mono text-sky-300">
                Sample: FDR-MLG-KLJ-01 (Klojen 48 Core)
              </div>
            </div>

            {/* Box 3: Uplink */}
            <div className="p-6 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  PILAR 3 · TRANSMISI BACKBONE
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">Uplink High-Capacity</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Menyalurkan agregasi seluruh port OLT menuju titik interkoneksi Super Backbone Jatim dengan kapasitas pipa 10G hingga 40G.
                </p>
              </div>
              <div className="p-2.5 rounded bg-slate-950 text-[11px] font-mono text-cyan-300">
                Sample: UPL-MLG-KLJ-10G (Klojen - SBY)
              </div>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            Korelasi data ketiga pilar diverifikasi otomatis dalam modul <strong>Data Core Search Engine</strong> dan <strong>Reports & Evaluasi</strong>.
          </div>
        </div>
      )}

      {/* Add Feeder Modal */}
      {isAddFeederOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Tambah Data Feeder Baru</h3>
              <button onClick={() => setIsAddFeederOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateFeeder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Kode Feeder</label>
                <input
                  type="text"
                  value={feederForm.feederCode}
                  onChange={e => setFeederForm({ ...feederForm, feederCode: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Nama Feeder</label>
                <input
                  type="text"
                  value={feederForm.name}
                  onChange={e => setFeederForm({ ...feederForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Total Core</label>
                  <input
                    type="number"
                    value={feederForm.totalCores}
                    onChange={e =>
                      setFeederForm({ ...feederForm, totalCores: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Panjang (Km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={feederForm.lengthKm}
                    onChange={e =>
                      setFeederForm({ ...feederForm, lengthKm: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Target SID Terkait</label>
                <input
                  type="text"
                  value={feederForm.targetSid}
                  onChange={e => setFeederForm({ ...feederForm, targetSid: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFeederOpen(false)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg"
                >
                  Simpan Feeder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Uplink Modal */}
      {isAddUplinkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Tambah Data Uplink Baru</h3>
              <button onClick={() => setIsAddUplinkOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateUplink} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Kode Uplink</label>
                <input
                  type="text"
                  value={uplinkForm.uplinkCode}
                  onChange={e => setUplinkForm({ ...uplinkForm, uplinkCode: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Hostname OLT</label>
                <input
                  type="text"
                  value={uplinkForm.oltHostname}
                  onChange={e => setUplinkForm({ ...uplinkForm, oltHostname: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Bandwidth (Gbps)</label>
                <input
                  type="number"
                  value={uplinkForm.bandwidthGbps}
                  onChange={e =>
                    setUplinkForm({ ...uplinkForm, bandwidthGbps: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">POP Tujuan Transmisi</label>
                <input
                  type="text"
                  value={uplinkForm.popDestination}
                  onChange={e => setUplinkForm({ ...uplinkForm, popDestination: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUplinkOpen(false)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg"
                >
                  Simpan Uplink
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add SID Modal */}
      {isAddSidOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Tambah Registrasi SID Layanan</h3>
              <button onClick={() => setIsAddSidOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateSid} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nomor SID</label>
                <input
                  type="text"
                  value={sidForm.sidNumber}
                  onChange={e => setSidForm({ ...sidForm, sidNumber: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Nama Pelanggan Korporat</label>
                <input
                  type="text"
                  value={sidForm.customerName}
                  onChange={e => setSidForm({ ...sidForm, customerName: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Bandwidth (Mbps)</label>
                <input
                  type="number"
                  value={sidForm.bandwidthMbps}
                  onChange={e =>
                    setSidForm({ ...sidForm, bandwidthMbps: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSidOpen(false)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg"
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
