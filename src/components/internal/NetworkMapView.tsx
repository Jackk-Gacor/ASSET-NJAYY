import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_NETWORK_NODES } from '../../data/initialData';
import { NetworkNode, MalangRegion } from '../../types';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  Layers,
  MapPin,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Compass,
  X,
} from 'lucide-react';

export const NetworkMapView: React.FC = () => {
  const { dataCoreList, openCoreDetail } = useApp();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [nodeSearch, setNodeSearch] = useState('');

  // Layer toggles
  const [showBackbone, setShowBackbone] = useState(true);
  const [showFeeder, setShowFeeder] = useState(true);
  const [showUplink, setShowUplink] = useState(true);
  const [showRing, setShowRing] = useState(true);

  const regions: MalangRegion[] = [
    'Malang Kota',
    'Kota Batu',
    'Kepanjen (Malang Selatan)',
    'Singosari (Malang Utara)',
    'Lawang',
    'Turen & Dampit',
  ];

  // Filter nodes
  const nodes = useMemo(() => {
    return INITIAL_NETWORK_NODES.filter(node => {
      const matchRegion = regionFilter === 'ALL' || node.region === regionFilter;
      const matchSearch =
        !nodeSearch ||
        node.name.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        node.code.toLowerCase().includes(nodeSearch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [regionFilter, nodeSearch]);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.2, Math.max(0.7, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setSelectedNode(null);
  };

  // Node color helper
  const getNodeColor = (type: NetworkNode['type']) => {
    switch (type) {
      case 'SUPER_BACKBONE':
        return '#818cf8'; // Indigo
      case 'POP_BACKBONE':
        return '#0284c7'; // Sky
      case 'POP_ACCESS':
        return '#10b981'; // Emerald
      case 'OLT':
        return '#f59e0b'; // Amber
      default:
        return '#38bdf8';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Network className="w-4 h-4" />
            <span>PETA GEOGRAFIS INFRASTRUKTUR MALANG RAYA</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Network Map Malang
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Visualisasi hierarki: Malang → Wilayah → POP Sentral → Topologi Jalur → Feeder / Uplink
          </p>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showBackbone}
              onChange={e => setShowBackbone(e.target.checked)}
              className="rounded text-sky-500"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-indigo-400 inline-block" />
              <span>Backbone</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showFeeder}
              onChange={e => setShowFeeder(e.target.checked)}
              className="rounded text-sky-500"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-sky-400 inline-block" />
              <span>Feeder</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showUplink}
              onChange={e => setShowUplink(e.target.checked)}
              className="rounded text-sky-500"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
              <span>Uplink</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showRing}
              onChange={e => setShowRing(e.target.checked)}
              className="rounded text-sky-500"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" />
              <span>Ring Loops</span>
            </span>
          </label>
        </div>
      </div>

      {/* Map Control Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={nodeSearch}
              onChange={e => setNodeSearch(e.target.value)}
              placeholder="Cari Node / POP (cth: KLOJEN, BATU, KEPANJEN)..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 shrink-0"
          >
            <option value="ALL">Semua Wilayah</option>
            {regions.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Perkecil (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-400 px-1 text-[11px] tabular-nums">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Perbesar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Reset Posisi & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Vector Map Canvas & Detail Flyout */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden min-h-[560px] flex items-center justify-center select-none shadow-2xl">
        
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Malang Geographic Contour SVG Background representation */}
        <svg
          viewBox="0 0 700 620"
          className="w-full h-full max-h-[640px] transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Geographical region backdrop contour polygons */}
          <g opacity="0.12" fill="#0284c7">
            {/* North Malang / Singosari / Lawang */}
            <path d="M 320 20 L 520 20 L 580 180 L 400 210 Z" />
            {/* Batu mountainous west */}
            <path d="M 120 120 L 320 120 L 320 280 L 120 240 Z" />
            {/* Malang Kota Central */}
            <path d="M 300 220 L 500 220 L 480 400 L 280 400 Z" />
            {/* Kepanjen / Malang South */}
            <path d="M 280 400 L 520 400 L 580 580 L 260 580 Z" />
          </g>

          {/* Region boundary lines */}
          <g stroke="rgba(100, 116, 139, 0.3)" strokeWidth="1" strokeDasharray="4 4" fill="none">
            <line x1="100" y1="210" x2="600" y2="210" />
            <line x1="100" y1="390" x2="600" y2="390" />
          </g>

          {/* Geographic Region Text Labels */}
          <text x="32" y="160" fill="rgba(148, 163, 184, 0.4)" fontSize="12" fontWeight="bold">
            KOTA BATU
          </text>
          <text x="560" y="90" fill="rgba(148, 163, 184, 0.4)" fontSize="12" fontWeight="bold">
            MALANG UTARA (LAWANG)
          </text>
          <text x="520" y="320" fill="rgba(148, 163, 184, 0.4)" fontSize="12" fontWeight="bold">
            MALANG KOTA (CENTRAL)
          </text>
          <text x="520" y="470" fill="rgba(148, 163, 184, 0.4)" fontSize="12" fontWeight="bold">
            MALANG SELATAN (KEPANJEN)
          </text>

          {/* Fiber Optic Cables / Network Path Links */}
          <g strokeLinecap="round">
            {/* Super Backbone connection to SBY */}
            {showBackbone && (
              <>
                <line
                  x1="400"
                  y1="40"
                  x2="480"
                  y2="110"
                  stroke="#818cf8"
                  strokeWidth="3.5"
                  strokeDasharray="6 3"
                />
                <line
                  x1="400"
                  y1="40"
                  x2="420"
                  y2="170"
                  stroke="#818cf8"
                  strokeWidth="3.5"
                />
                <line
                  x1="480"
                  y1="110"
                  x2="420"
                  y2="170"
                  stroke="#818cf8"
                  strokeWidth="3"
                />
              </>
            )}

            {/* Feeder Links */}
            {showFeeder && (
              <>
                <line x1="420" y1="170" x2="430" y2="250" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="430" y1="250" x2="340" y2="240" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="430" y1="250" x2="390" y2="320" stroke="#38bdf8" strokeWidth="3" />
                <line x1="390" y1="320" x2="330" y2="380" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="330" y1="380" x2="360" y2="470" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="360" y1="470" x2="450" y2="500" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="450" y1="500" x2="520" y2="540" stroke="#38bdf8" strokeWidth="2" />
              </>
            )}

            {/* Uplink Links */}
            {showUplink && (
              <>
                <line x1="210" y1="190" x2="340" y2="240" stroke="#06b6d4" strokeWidth="3" />
                <line x1="210" y1="190" x2="180" y2="140" stroke="#06b6d4" strokeWidth="2" />
                <line x1="420" y1="170" x2="210" y2="190" stroke="#06b6d4" strokeWidth="2.5" />
                <line x1="340" y1="240" x2="390" y2="320" stroke="#06b6d4" strokeWidth="3" />
              </>
            )}

            {/* Ring Loops (Alternative redundant path) */}
            {showRing && (
              <path
                d="M 390 320 Q 280 340 360 470"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            )}
          </g>

          {/* Node Elements */}
          {nodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const nodeColor = getNodeColor(node.type);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform group"
                onClick={() => setSelectedNode(node)}
              >
                {/* Glow ring on hover/select */}
                {isSelected && (
                  <circle r="18" fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-ping" />
                )}

                {/* Outer halo */}
                <circle
                  r={node.type === 'SUPER_BACKBONE' ? 14 : node.type === 'POP_BACKBONE' ? 11 : 9}
                  fill={nodeColor}
                  fillOpacity={isSelected ? 0.4 : 0.2}
                  stroke={nodeColor}
                  strokeWidth={isSelected ? 3 : 1.5}
                />

                {/* Center Core dot */}
                <circle
                  r={node.type === 'SUPER_BACKBONE' ? 7 : node.type === 'POP_BACKBONE' ? 5 : 4}
                  fill={nodeColor}
                />

                {/* Node Code Label */}
                <text
                  x="0"
                  y={node.type === 'SUPER_BACKBONE' ? -18 : -14}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow-md"
                >
                  {node.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-[11px] space-y-1.5 shadow-lg">
          <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">
            Legenda Peta Jaringan
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-slate-300">Super Backbone Gateway</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-300">POP Sentral Backbone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">POP Akses / Ring Loop</span>
          </div>
        </div>

        {/* Selected Node Details Floating Card */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-400 block">
                  {selectedNode.code}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                  {selectedNode.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Wilayah Kerja</span>
                <span className="text-slate-200 font-semibold">{selectedNode.region}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Tipe Simpul</span>
                <span className="text-sky-300 font-mono">{selectedNode.type}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Kapasitas Core</span>
                <span className="text-white font-mono font-bold">
                  {selectedNode.usedCores} / {selectedNode.capacityCores} Core
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Status Operasi</span>
                <span className="text-emerald-400 font-semibold">● {selectedNode.status}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Koordinat GPS</span>
                <span className="text-slate-300 font-mono text-[10px]">
                  {selectedNode.lat.toFixed(4)}, {selectedNode.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Core utilization bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Rasio Keterisian Core</span>
                <span className="font-mono">
                  {Math.round((selectedNode.usedCores / selectedNode.capacityCores) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${(selectedNode.usedCores / selectedNode.capacityCores) * 100}%`,
                  }}
                  className="h-full bg-sky-500 rounded-full"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const match = dataCoreList.find(c => c.popName === selectedNode.code);
                  if (match) {
                    openCoreDetail(match);
                  } else {
                    // Open first available
                    openCoreDetail(dataCoreList[0]);
                  }
                }}
                className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Lihat Data Core Terkait</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
