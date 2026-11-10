import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_RINGS } from '../../data/initialData';
import { RingNetworkItem } from '../../types';
import { GoogleRingMapView } from './GoogleRingMapView';
import {
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Layers,
  Activity,
  Cpu,
  Globe,
  MapPin,
} from 'lucide-react';

export const DataRingView: React.FC = () => {
  const { dataCoreList, openCoreDetail } = useApp();

  const [selectedRingId, setSelectedRingId] = useState<string>('RING-01');
  const [displayMode, setDisplayMode] = useState<'map' | 'schematic'>('map');

  const selectedRing = INITIAL_RINGS.find(r => r.id === selectedRingId) || INITIAL_RINGS[0];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <RefreshCw className="w-4 h-4" />
            <span>SISTEM REDUNDANSI &amp; PROTEKSI RING LOOP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Data Ring Network Malang
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Topologi loop tertutup untuk menjamin ketahanan transmisi (auto protection switching jika terjadi fiber cut)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-800 font-semibold font-mono">Resilience Target: 99.98%</span>
        </div>
      </div>

      {/* Ring Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {INITIAL_RINGS.map(ring => {
          const isSelected = selectedRingId === ring.id;
          return (
            <div
              key={ring.id}
              onClick={() => setSelectedRingId(ring.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                  {ring.id}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    ring.status === 'Protected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {ring.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{ring.ringName}</h4>
              <p className="text-[11px] text-slate-500 mt-1">{ring.region}</p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{ring.nodes.length} Simpul POP</span>
                <span className="font-semibold text-slate-800">{ring.totalFiber} Core</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Circular Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Interactive Map or Circular Path Graphic */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                  VISUALISASI RUTE RING
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Proteksi Aktif (Self-Healing)</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedRing.ringName}</h3>
            </div>

            {/* View Switcher: Google Map vs Schematic */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setDisplayMode('map')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  displayMode === 'map'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Peta Google Maps</span>
              </button>
              <button
                onClick={() => setDisplayMode('schematic')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  displayMode === 'schematic'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Diagram Siklus</span>
              </button>
            </div>
          </div>

          {/* Conditional Display: Google Map vs Circular Diagram */}
          {displayMode === 'map' ? (
            <div className="py-3 space-y-3">
              <GoogleRingMapView ring={selectedRing} />

              {/* Segment summary pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {selectedRing.nodes.map((n, i) => {
                  const nextNode = selectedRing.nodes[(i + 1) % selectedRing.nodes.length];
                  return (
                    <div
                      key={`seg-${n.id}-${nextNode.id}`}
                      className="p-2 bg-slate-50 border border-slate-200/90 rounded-xl text-left"
                    >
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">
                        SEGMEN {i + 1}
                      </span>
                      <p className="text-[11px] font-bold text-slate-800 truncate">
                        {n.name} → {nextNode.name}
                      </p>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                        {selectedRing.totalFiber} Core Aktif
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-8 flex items-center justify-center">
              <svg viewBox="0 0 400 340" className="w-full max-w-sm">
                {/* Center Ring Circle */}
                <circle
                  cx="200"
                  cy="170"
                  r="110"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="opacity-70"
                />
                <circle
                  cx="200"
                  cy="170"
                  r="110"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  opacity="0.4"
                />

                {/* Center Title */}
                <text
                  x="200"
                  y="165"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {selectedRing.ringName}
                </text>
                <text
                  x="200"
                  y="185"
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  Loop Tertutup (360°)
                </text>

                {/* Dynamic Nodes around the circle */}
                {selectedRing.nodes.map((node, index) => {
                  const angle = (index / selectedRing.nodes.length) * 2 * Math.PI - Math.PI / 2;
                  const nx = 200 + 110 * Math.cos(angle);
                  const ny = 170 + 110 * Math.sin(angle);

                  return (
                    <g key={node.id} transform={`translate(${nx}, ${ny})`}>
                      <circle r="16" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                      <circle r="6" fill="#2563eb" />
                      <text
                        x="0"
                        y={index === 0 ? -22 : index === 2 ? 30 : 5}
                        textAnchor={index === 1 ? 'start' : index === 3 ? 'end' : 'middle'}
                        dx={index === 1 ? 22 : index === 3 ? -22 : 0}
                        fill="#0f172a"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {node.name}
                      </text>
                      <text
                        x="0"
                        y={index === 0 ? -10 : index === 2 ? 42 : 18}
                        textAnchor={index === 1 ? 'start' : index === 3 ? 'end' : 'middle'}
                        dx={index === 1 ? 22 : index === 3 ? -22 : 0}
                        fill="#64748b"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        [{node.type}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Sequence Flow Footnote */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-sans text-[11px] font-semibold">Alur Loop:</span>
              {selectedRing.nodes.map((n) => (
                <React.Fragment key={n.id}>
                  <span className="font-semibold text-slate-900">{n.name}</span>
                  <span className="text-emerald-500 font-bold">→</span>
                </React.Fragment>
              ))}
              <span className="font-bold text-emerald-600">{selectedRing.nodes[0]?.name}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-sans shrink-0 hidden md:inline">
              Toleransi Failover: &lt; 50 ms
            </span>
          </div>

        </div>

        {/* Right: Technical Specs & Redundancy Info */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-xs flex flex-col justify-between text-slate-800">
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                PARAMETER TEKNIS RING
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Karakteristik &amp; Rute Proteksi
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {selectedRing.description}
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">
                  Rute Cadangan (Backup Path)
                </span>
                <p className="text-xs font-semibold text-blue-700">
                  {selectedRing.backupRoute}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">
                  Total Helai Serat Optik Loop
                </span>
                <p className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {selectedRing.totalFiber} Core Single Mode
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">
                  Waktu Pemulihan Otomatis (Failover SLA)
                </span>
                <p className="text-base font-bold font-mono text-emerald-600 tabular-nums">
                  &lt; 50 ms (Sub-second switching)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                const match = dataCoreList.find(c => c.relatedRing === selectedRing.ringName);
                if (match) openCoreDetail(match);
                else openCoreDetail(dataCoreList[0]);
              }}
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Buka Data Core di Jalur Ring Ini</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
