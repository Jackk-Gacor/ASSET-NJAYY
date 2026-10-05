import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_RINGS } from '../../data/initialData';
import { RingNetworkItem } from '../../types';
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
} from 'lucide-react';

export const DataRingView: React.FC = () => {
  const { dataCoreList, openCoreDetail } = useApp();

  const [selectedRingId, setSelectedRingId] = useState<string>('RING-01');

  const selectedRing = INITIAL_RINGS.find(r => r.id === selectedRingId) || INITIAL_RINGS[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <RefreshCw className="w-4 h-4" />
            <span>SISTEM REDUNDANSI & PROTEKSI RING LOOP</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Data Ring Network Malang
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Topologi loop tertutup untuk menjamin ketahanan transmisi (auto protection switching jika terjadi fiber cut)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Resilience Target: 99.98%</span>
        </div>
      </div>

      {/* Ring Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {INITIAL_RINGS.map(ring => {
          const isSelected = selectedRingId === ring.id;
          return (
            <div
              key={ring.id}
              onClick={() => setSelectedRingId(ring.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500 shadow-md'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-400">
                  {ring.id}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                    ring.status === 'Protected'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-blue-950 text-blue-300 border-blue-800'
                  }`}
                >
                  {ring.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1.5">{ring.ringName}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{ring.region}</p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{ring.nodes.length} Simpul POP</span>
                <span>{ring.totalFiber} Core</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Circular Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Circular Path Graphic */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400">
                VISUALISASI SIKLUS LOOP
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedRing.ringName}</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Proteksi Aktif (Self-Healing)</span>
            </span>
          </div>

          {/* Circular SVG Loop representation */}
          <div className="py-8 flex items-center justify-center">
            <svg viewBox="0 0 400 340" className="w-full max-w-sm">
              {/* Center Ring Circle */}
              <circle
                cx="200"
                cy="170"
                r="110"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="opacity-60"
              />
              <circle
                cx="200"
                cy="170"
                r="110"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.3"
              />

              {/* Center Title */}
              <text
                x="200"
                y="165"
                textAnchor="middle"
                fill="#ffffff"
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
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
              >
                Loop Tertutup (360°)
              </text>

              {/* Dynamic 4 Nodes around the circle */}
              {selectedRing.nodes.map((node, index) => {
                const angle = (index / selectedRing.nodes.length) * 2 * Math.PI - Math.PI / 2;
                const nx = 200 + 110 * Math.cos(angle);
                const ny = 170 + 110 * Math.sin(angle);

                return (
                  <g key={node.id} transform={`translate(${nx}, ${ny})`}>
                    <circle r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle r="6" fill="#38bdf8" />
                    <text
                      x="0"
                      y={index === 0 ? -22 : index === 2 ? 30 : 5}
                      textAnchor={index === 1 ? 'start' : index === 3 ? 'end' : 'middle'}
                      dx={index === 1 ? 22 : index === 3 ? -22 : 0}
                      fill="#f8fafc"
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
                      fill="#94a3b8"
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

          {/* Sequence Flow Footnote */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-center gap-2 overflow-x-auto">
            {selectedRing.nodes.map((n, i) => (
              <React.Fragment key={n.id}>
                <span className="font-semibold text-white">{n.name}</span>
                <span>→</span>
              </React.Fragment>
            ))}
            <span className="font-semibold text-sky-400">{selectedRing.nodes[0]?.name}</span>
          </div>

        </div>

        {/* Right: Technical Specs & Redundancy Info */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                PARAMETER TEKNIS RING
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Karakteristik & Rute Proteksi
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedRing.description}
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">
                  Rute Cadangan (Backup Path)
                </span>
                <p className="text-xs font-semibold text-sky-300">
                  {selectedRing.backupRoute}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">
                  Total Helai Serat Optik Loop
                </span>
                <p className="text-base font-bold font-mono text-white tabular-nums">
                  {selectedRing.totalFiber} Core Single Mode
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">
                  Waktu Pemulihan Otomatis (Failover SLA)
                </span>
                <p className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                  &lt; 50 ms (Sub-second switching)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                const match = dataCoreList.find(c => c.relatedRing === selectedRing.ringName);
                if (match) openCoreDetail(match);
                else openCoreDetail(dataCoreList[0]);
              }}
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-2 transition-colors"
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
