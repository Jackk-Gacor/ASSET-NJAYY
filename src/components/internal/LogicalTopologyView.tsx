import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  Layers,
  Compass,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowDown,
  ArrowRight,
  Server,
  Zap,
} from 'lucide-react';

interface LogicalNode {
  id: string;
  name: string;
  level: 'Tier 1 - Super Backbone' | 'Tier 2 - POP Backbone' | 'Tier 3 - Distribution' | 'Tier 4 - Access / FDT';
  capacity: string;
  redundancy: string;
  activeLoss: string;
  connectedTo: string[];
}

export const LogicalTopologyView: React.FC = () => {
  const { dataCoreList, openCoreDetail } = useApp();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('BONE-SBY');

  const logicalNodes: LogicalNode[] = [
    {
      id: 'BONE-SBY',
      name: 'Super Backbone Gateway (Surabaya Main)',
      level: 'Tier 1 - Super Backbone',
      capacity: 'DWDM 100 Gbps Core',
      redundancy: 'Dual Homing Ring Protection (Jawa Timur)',
      activeLoss: '-14.2 dBm',
      connectedTo: ['POP-KLJ', 'POP-LWG'],
    },
    {
      id: 'POP-KLJ',
      name: 'POP Sentral Klojen Malang (Hub Utama)',
      level: 'Tier 2 - POP Backbone',
      capacity: '40 Gbps Aggregation',
      redundancy: 'Protected by Inner Malang Ring',
      activeLoss: '-16.5 dBm',
      connectedTo: ['POP-BLM', 'POP-SHT', 'POP-SKN', 'POP-KPJ'],
    },
    {
      id: 'POP-LWG',
      name: 'POP Lawang Transit',
      level: 'Tier 2 - POP Backbone',
      capacity: '10 Gbps Uplink',
      redundancy: 'Border Transit Line Pasuruan',
      activeLoss: '-18.1 dBm',
      connectedTo: ['POP-SGS'],
    },
    {
      id: 'POP-BLM',
      name: 'POP Blimbing Industrial',
      level: 'Tier 3 - Distribution',
      capacity: '10 Gbps Aggregation',
      redundancy: 'Connected to Singosari & Klojen',
      activeLoss: '-18.7 dBm',
      connectedTo: ['FDT-BLM-01', 'FDT-BLM-02'],
    },
    {
      id: 'POP-SHT',
      name: 'POP Soekarno Hatta (Suhat)',
      level: 'Tier 3 - Distribution',
      capacity: '20 Gbps Aggregation',
      redundancy: 'Metro Education Loop (UB, UM, Polinema)',
      activeLoss: '-17.5 dBm',
      connectedTo: ['FDT-SHT-01', 'POP-BTU'],
    },
    {
      id: 'POP-BTU',
      name: 'POP Alun-Alun Kota Batu',
      level: 'Tier 3 - Distribution',
      capacity: '20 Gbps Aggregation',
      redundancy: 'Ring Malang-Batu Protected',
      activeLoss: '-17.8 dBm',
      connectedTo: ['FDT-BTU-01'],
    },
    {
      id: 'POP-KPJ',
      name: 'POP Sentral Kepanjen Pemkab',
      level: 'Tier 3 - Distribution',
      capacity: '10 Gbps Aggregation',
      redundancy: 'South Corridor Ring Link',
      activeLoss: '-16.9 dBm',
      connectedTo: ['FDT-KPJ-01', 'POP-TRN'],
    },
    {
      id: 'FDT-BLM-01',
      name: 'FDT Industri Karanglo Blimbing',
      level: 'Tier 4 - Access / FDT',
      capacity: '48 Core FDT Splitter 1:8',
      redundancy: 'Direct Feeder to Corporate Customers',
      activeLoss: '-19.2 dBm',
      connectedTo: [],
    },
    {
      id: 'FDT-SHT-01',
      name: 'FDT Kampus Dinoyo Suhat',
      level: 'Tier 4 - Access / FDT',
      capacity: '96 Core FDT Metro Splitter 1:16',
      redundancy: 'Dual Feed Campus Dedicated',
      activeLoss: '-18.3 dBm',
      connectedTo: [],
    },
    {
      id: 'FDT-BTU-01',
      name: 'FDT Perhotelan Wisata Batu',
      level: 'Tier 4 - Access / FDT',
      capacity: '48 Core FDT ODC-BTU-02',
      redundancy: 'Direct Feeder to Hotels & City Hall',
      activeLoss: '-18.9 dBm',
      connectedTo: [],
    },
    {
      id: 'FDT-KPJ-01',
      name: 'FDT Perkantoran Pemkab Kepanjen',
      level: 'Tier 4 - Access / FDT',
      capacity: '72 Core FDT Pemkab Hub',
      redundancy: 'Protected Link to Gardu Induk',
      activeLoss: '-17.2 dBm',
      connectedTo: [],
    },
  ];

  const selectedNode = logicalNodes.find(n => n.id === selectedNodeId) || logicalNodes[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Share2 className="w-4 h-4" />
            <span>DIAGRAM ARSITEKTUR LOGIS TRANSMISI</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Logical Network Topology
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Hubungan transmisi terstruktur: Super Backbone → POP Backbone → Distribusi OLT → FDT / ODC Akses
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Mode: Hierarki Bertingkat (Tier 1-4)</span>
        </div>
      </div>

      {/* Main Grid: Interactive Tree Diagram + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Logical Topology Tree */}
        <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          
          {/* TIER 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>TIER 1 · SUPER BACKBONE GATEWAY</span>
            </div>
            <div className="flex justify-center">
              <div
                onClick={() => setSelectedNodeId('BONE-SBY')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition-all max-w-sm w-full ${
                  selectedNodeId === 'BONE-SBY'
                    ? 'border-indigo-500 bg-indigo-950/50 ring-2 ring-indigo-500 text-white'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}
              >
                <Server className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
                <h4 className="text-sm font-bold">Surabaya Main Gateway</h4>
                <p className="text-[10px] font-mono text-indigo-300 mt-0.5">DWDM 100 Gbps</p>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600 animate-pulse" />
          </div>

          {/* TIER 2: POP BACKBONE */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>TIER 2 · POP BACKBONE SENTRAL MALANG</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedNodeId('POP-KLJ')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedNodeId === 'POP-KLJ'
                    ? 'border-sky-500 bg-sky-950/50 ring-2 ring-sky-500 text-white'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold">POP Klojen Sentral (Hub)</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">40G</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Aggregator Jaringan Kota</p>
              </div>

              <div
                onClick={() => setSelectedNodeId('POP-LWG')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedNodeId === 'POP-LWG'
                    ? 'border-sky-500 bg-sky-950/50 ring-2 ring-sky-500 text-white'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold">POP Lawang Transit</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">10G</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Perbatasan Pasuruan</p>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* TIER 3: DISTRIBUTION POP / OLT */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>TIER 3 · DISTRIBUSI KAWASAN (BLIMBING, SUHAT, BATU, KEPANJEN)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'POP-BLM', name: 'POP Blimbing', tag: 'Industri' },
                { id: 'POP-SHT', name: 'POP Suhat', tag: 'Kampus' },
                { id: 'POP-BTU', name: 'POP Batu', tag: 'Wisata' },
                { id: 'POP-KPJ', name: 'POP Kepanjen', tag: 'Pemkab' },
              ].map(sub => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedNodeId(sub.id)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedNodeId === sub.id
                      ? 'border-cyan-500 bg-cyan-950/50 ring-2 ring-cyan-500 text-white'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <h5 className="text-xs font-bold">{sub.name}</h5>
                  <span className="text-[9px] text-cyan-300 block font-mono mt-0.5">{sub.tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* TIER 4: ACCESS FDT / ODC */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>TIER 4 · TITIK DISTRIBUSI FISIK FDT / ODC LAPANGAN</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'FDT-BLM-01', name: 'FDT Karanglo', code: 'ODC-48' },
                { id: 'FDT-SHT-01', name: 'FDT Dinoyo', code: 'ODC-96' },
                { id: 'FDT-BTU-01', name: 'FDT Wisata Batu', code: 'ODC-48' },
                { id: 'FDT-KPJ-01', name: 'FDT Pemkab', code: 'ODC-72' },
              ].map(fdt => (
                <div
                  key={fdt.id}
                  onClick={() => setSelectedNodeId(fdt.id)}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedNodeId === fdt.id
                      ? 'border-emerald-500 bg-emerald-950/50 ring-2 ring-emerald-500 text-white'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <h6 className="text-[11px] font-bold text-slate-200">{fdt.name}</h6>
                  <span className="text-[9px] font-mono text-emerald-400">{fdt.code}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Node Inspector Details Card */}
        <div className="lg:col-span-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-4 sticky top-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
              INSPEKTUR SIMPUL LOGIS
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              {selectedNode.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedNode.level}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase">Kapasitas Transmisi</span>
              <p className="text-sm font-bold text-white font-mono">{selectedNode.capacity}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase">Skema Proteksi & Redundansi</span>
              <p className="text-xs text-sky-300 font-semibold">{selectedNode.redundancy}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase">Loss / Redaman Rata-Rata</span>
              <p className="text-sm font-bold font-mono text-emerald-400">{selectedNode.activeLoss}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 mb-2">Simpul Terhubung:</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.connectedTo.length > 0 ? (
                selectedNode.connectedTo.map(cId => (
                  <button
                    key={cId}
                    onClick={() => setSelectedNodeId(cId)}
                    className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700"
                  >
                    → {cId}
                  </button>
                ))
              ) : (
                <span className="text-xs text-slate-500 font-mono">End-point terminal</span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => openCoreDetail(dataCoreList[0])}
              className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Buka Data Core Terkait</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
