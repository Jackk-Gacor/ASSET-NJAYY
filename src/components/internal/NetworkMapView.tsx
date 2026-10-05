import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_NETWORK_NODES, INITIAL_RINGS } from '../../data/initialData';
import { NetworkNode, MalangRegion } from '../../types';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { NetworkMiniMap } from './NetworkMiniMap';
import { NetworkExportModal, NetworkExportOptions } from './NetworkExportModal';
import { GoogleNetworkMapView } from './GoogleNetworkMapView';
import {
  Network,
  Globe,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Compass,
  X,
  Zap,
  Activity,
  Scissors,
  Route,
  RefreshCw,
  Share2,
  Sliders,
  Maximize2,
  Wifi,
  Radio,
  FileText,
  Eye,
  Info,
  Download,
  Image as ImageIcon,
} from 'lucide-react';

export interface NetworkLink {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  name: string;
  code: string;
  type: 'BACKBONE' | 'FEEDER' | 'UPLINK' | 'RING';
  coreCapacity: number;
  coreUsed: number;
  lengthKm: number;
  attenuationDbm: number;
  status: 'Optimal' | 'Warning' | 'Maintenance';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isCurved?: boolean;
  curvePath?: string;
}

const NETWORK_LINKS: NetworkLink[] = [
  {
    id: 'LINK-SBY-LWG',
    fromNodeId: 'NODE-SBY-01',
    toNodeId: 'NODE-LWG-01',
    name: 'Super Backbone Surabaya - Lawang',
    code: 'BONE-SBY-LWG-100G',
    type: 'BACKBONE',
    coreCapacity: 288,
    coreUsed: 216,
    lengthKm: 62.4,
    attenuationDbm: -14.2,
    status: 'Optimal',
    x1: 400,
    y1: 40,
    x2: 480,
    y2: 110,
  },
  {
    id: 'LINK-SBY-SGS',
    fromNodeId: 'NODE-SBY-01',
    toNodeId: 'NODE-SGS-01',
    name: 'Direct Trunk Surabaya - Singosari Gateway',
    code: 'BONE-SBY-SGS-40G',
    type: 'BACKBONE',
    coreCapacity: 144,
    coreUsed: 98,
    lengthKm: 71.0,
    attenuationDbm: -15.1,
    status: 'Optimal',
    x1: 400,
    y1: 40,
    x2: 420,
    y2: 170,
  },
  {
    id: 'LINK-LWG-SGS',
    fromNodeId: 'NODE-LWG-01',
    toNodeId: 'NODE-SGS-01',
    name: 'Interkoneksi Lawang - Singosari',
    code: 'BONE-LWG-SGS-10G',
    type: 'BACKBONE',
    coreCapacity: 96,
    coreUsed: 64,
    lengthKm: 11.2,
    attenuationDbm: -16.8,
    status: 'Optimal',
    x1: 480,
    y1: 110,
    x2: 420,
    y2: 170,
  },
  {
    id: 'LINK-SGS-BLM',
    fromNodeId: 'NODE-SGS-01',
    toNodeId: 'NODE-MLG-BLM',
    name: 'Feeder Singosari - Blimbing Industri',
    code: 'FDR-SGS-BLM-01',
    type: 'FEEDER',
    coreCapacity: 96,
    coreUsed: 72,
    lengthKm: 6.8,
    attenuationDbm: -18.2,
    status: 'Optimal',
    x1: 420,
    y1: 170,
    x2: 430,
    y2: 250,
  },
  {
    id: 'LINK-BLM-SHT',
    fromNodeId: 'NODE-MLG-BLM',
    toNodeId: 'NODE-MLG-SHT',
    name: 'Feeder Blimbing - Soekarno Hatta Campus',
    code: 'FDR-BLM-SHT-02',
    type: 'FEEDER',
    coreCapacity: 144,
    coreUsed: 118,
    lengthKm: 4.5,
    attenuationDbm: -17.5,
    status: 'Optimal',
    x1: 430,
    y1: 250,
    x2: 340,
    y2: 240,
  },
  {
    id: 'LINK-BLM-KLJ',
    fromNodeId: 'NODE-MLG-BLM',
    toNodeId: 'NODE-MLG-KLJ',
    name: 'Feeder Blimbing - Master Hub Klojen',
    code: 'FDR-MLG-KLJ-01',
    type: 'FEEDER',
    coreCapacity: 144,
    coreUsed: 108,
    lengthKm: 5.2,
    attenuationDbm: -18.0,
    status: 'Optimal',
    x1: 430,
    y1: 250,
    x2: 390,
    y2: 320,
  },
  {
    id: 'LINK-SHT-KLJ',
    fromNodeId: 'NODE-MLG-SHT',
    toNodeId: 'NODE-MLG-KLJ',
    name: 'Uplink Metro Suhat - Klojen',
    code: 'UPL-MLG-SHT-20G',
    type: 'UPLINK',
    coreCapacity: 96,
    coreUsed: 84,
    lengthKm: 4.8,
    attenuationDbm: -17.8,
    status: 'Optimal',
    x1: 340,
    y1: 240,
    x2: 390,
    y2: 320,
  },
  {
    id: 'LINK-SGS-BTU',
    fromNodeId: 'NODE-SGS-01',
    toNodeId: 'NODE-BTU-01',
    name: 'Uplink Singosari - Kota Batu (Karangploso Link)',
    code: 'UPL-SGS-BTU-10G',
    type: 'UPLINK',
    coreCapacity: 72,
    coreUsed: 52,
    lengthKm: 18.4,
    attenuationDbm: -19.4,
    status: 'Optimal',
    x1: 420,
    y1: 170,
    x2: 210,
    y2: 190,
  },
  {
    id: 'LINK-BTU-BMJ',
    fromNodeId: 'NODE-BTU-01',
    toNodeId: 'NODE-BTU-BMJ',
    name: 'Feeder Batu Alun-Alun - Bumiaji Agrowisata',
    code: 'FDR-BTU-BMJ-01',
    type: 'FEEDER',
    coreCapacity: 48,
    coreUsed: 24,
    lengthKm: 6.2,
    attenuationDbm: -18.9,
    status: 'Optimal',
    x1: 210,
    y1: 190,
    x2: 180,
    y2: 140,
  },
  {
    id: 'LINK-BTU-SHT',
    fromNodeId: 'NODE-BTU-01',
    toNodeId: 'NODE-MLG-SHT',
    name: 'Uplink Transmisi Batu - Suhat Poros Barat',
    code: 'UPL-BTU-MAIN-20G',
    type: 'UPLINK',
    coreCapacity: 96,
    coreUsed: 80,
    lengthKm: 15.6,
    attenuationDbm: -18.3,
    status: 'Optimal',
    x1: 210,
    y1: 190,
    x2: 340,
    y2: 240,
  },
  {
    id: 'LINK-KLJ-SKN',
    fromNodeId: 'NODE-MLG-KLJ',
    toNodeId: 'NODE-MLG-SKN',
    name: 'Feeder Klojen - Sukun Flyover',
    code: 'FDR-MLG-SKN-01',
    type: 'FEEDER',
    coreCapacity: 96,
    coreUsed: 56,
    lengthKm: 4.1,
    attenuationDbm: -21.3,
    status: 'Warning',
    x1: 390,
    y1: 320,
    x2: 330,
    y2: 380,
  },
  {
    id: 'LINK-SKN-KPJ',
    fromNodeId: 'NODE-MLG-SKN',
    toNodeId: 'NODE-KPJ-01',
    name: 'Feeder Poros Selatan Sukun - Kepanjen',
    code: 'FDR-SKN-KPJ-01',
    type: 'FEEDER',
    coreCapacity: 144,
    coreUsed: 112,
    lengthKm: 16.8,
    attenuationDbm: -17.9,
    status: 'Optimal',
    x1: 330,
    y1: 380,
    x2: 360,
    y2: 470,
  },
  {
    id: 'LINK-KPJ-TRN',
    fromNodeId: 'NODE-KPJ-01',
    toNodeId: 'NODE-TRN-01',
    name: 'Feeder Kepanjen - Turen Industri',
    code: 'FDR-TRN-IND-01',
    type: 'FEEDER',
    coreCapacity: 72,
    coreUsed: 46,
    lengthKm: 14.5,
    attenuationDbm: -18.7,
    status: 'Optimal',
    x1: 360,
    y1: 470,
    x2: 450,
    y2: 500,
  },
  {
    id: 'LINK-TRN-DMP',
    fromNodeId: 'NODE-TRN-01',
    toNodeId: 'NODE-DMP-01',
    name: 'Distribusi Turen - Dampit Frontier',
    code: 'FDR-DMP-TER-01',
    type: 'FEEDER',
    coreCapacity: 48,
    coreUsed: 18,
    lengthKm: 12.0,
    attenuationDbm: -19.6,
    status: 'Optimal',
    x1: 450,
    y1: 500,
    x2: 520,
    y2: 540,
  },
  {
    id: 'RING-POROS-SELATAN',
    fromNodeId: 'NODE-MLG-KLJ',
    toNodeId: 'NODE-KPJ-01',
    name: 'Ring Loop Proteksi Jalur Malang - Kepanjen',
    code: 'RING-POROS-SELATAN-BACKUP',
    type: 'RING',
    coreCapacity: 96,
    coreUsed: 64,
    lengthKm: 22.0,
    attenuationDbm: -17.2,
    status: 'Optimal',
    x1: 390,
    y1: 320,
    x2: 360,
    y2: 470,
    isCurved: true,
    curvePath: 'M 390 320 Q 260 380 360 470',
  },
  {
    id: 'RING-MALANG-BATU',
    fromNodeId: 'NODE-MLG-KLJ',
    toNodeId: 'NODE-BTU-01',
    name: 'Ring Loop Proteksi Jalur Malang - Batu (Dau Barat)',
    code: 'RING-MALANG-BATU-BACKUP',
    type: 'RING',
    coreCapacity: 72,
    coreUsed: 48,
    lengthKm: 19.5,
    attenuationDbm: -18.1,
    status: 'Optimal',
    x1: 390,
    y1: 320,
    x2: 210,
    y2: 190,
    isCurved: true,
    curvePath: 'M 390 320 Q 270 290 210 190',
  },
];

export const NetworkMapView: React.FC = () => {
  const { dataCoreList, openCoreDetail, showToast } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapSvgRef = useRef<SVGSVGElement>(null);

  // High-Resolution PNG Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Map Engine: Google Maps Platform or Schematic Canvas
  const [viewEngine, setViewEngine] = useState<'google' | 'schematic'>('google');

  // Navigation / Pan & Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Selections
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<NetworkLink | null>(null);

  // Dynamic Minimalist Tooltip for Network Nodes
  const [hoveredNodeTooltip, setHoveredNodeTooltip] = useState<{
    node: NetworkNode;
    highLevelStatus: 'Operational' | 'Maintenance Required';
    statusColor: 'emerald' | 'amber';
    x: number;
    y: number;
  } | null>(null);

  // Dynamic Tooltip for Cables / Links
  const [hoveredLinkTooltip, setHoveredLinkTooltip] = useState<{
    link: NetworkLink;
    x: number;
    y: number;
  } | null>(null);

  // Filters & Layers
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [nodeSearch, setNodeSearch] = useState('');
  const [showBackbone, setShowBackbone] = useState(true);
  const [showFeeder, setShowFeeder] = useState(true);
  const [showUplink, setShowUplink] = useState(true);
  const [showRing, setShowRing] = useState(true);
  const [showLivePulses, setShowLivePulses] = useState(true);

  // Interactive Modes
  const [interactiveMode, setInteractiveMode] = useState<'explore' | 'cut_sim' | 'trace'>('explore');
  const [cutLinks, setCutLinks] = useState<string[]>([]);
  const [failoverActive, setFailoverActive] = useState(false);
  const [traceStartNode, setTraceStartNode] = useState<NetworkNode | null>(null);
  const [traceEndNode, setTraceEndNode] = useState<NetworkNode | null>(null);
  const [traceResultPath, setTraceResultPath] = useState<string[]>([]);

  // Simulation test state
  const [isTestingSignal, setIsTestingSignal] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // High-level status calculator for minimalist tooltip
  const getNodeHighLevelStatus = (node: NetworkNode) => {
    const isMaintenance =
      node.status === 'Warning' ||
      (node.usedCores / node.capacityCores > 0.9);
    return {
      label: (isMaintenance ? 'Maintenance Required' : 'Operational') as 'Operational' | 'Maintenance Required',
      statusColor: (isMaintenance ? 'amber' : 'emerald') as 'amber' | 'emerald',
    };
  };

  const handleNodeMouseEnter = (node: NetworkNode, e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { label, statusColor } = getNodeHighLevelStatus(node);
      setHoveredNodeTooltip({
        node,
        highLevelStatus: label,
        statusColor,
        x,
        y,
      });
    }
  };

  const handleNodeMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current && hoveredNodeTooltip) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setHoveredNodeTooltip(prev => (prev ? { ...prev, x, y } : null));
    }
  };

  const handleNodeMouseLeave = () => {
    setHoveredNodeTooltip(null);
  };

  const handleLinkMouseEnter = (link: NetworkLink, e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setHoveredLinkTooltip({ link, x, y });
    }
  };

  const handleLinkMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current && hoveredLinkTooltip) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setHoveredLinkTooltip(prev => (prev ? { ...prev, x, y } : null));
    }
  };

  const handleLinkMouseLeave = () => {
    setHoveredLinkTooltip(null);
  };

  const regions: MalangRegion[] = [
    'Malang Kota',
    'Kota Batu',
    'Kepanjen (Malang Selatan)',
    'Singosari (Malang Utara)',
    'Lawang',
    'Turen & Dampit',
  ];

  // Filter nodes based on search and region
  const filteredNodes = useMemo(() => {
    return INITIAL_NETWORK_NODES.filter(node => {
      const matchRegion = regionFilter === 'ALL' || node.region === regionFilter;
      const matchSearch =
        !nodeSearch ||
        node.name.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        node.code.toLowerCase().includes(nodeSearch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [regionFilter, nodeSearch]);

  // Filter links based on layer visibility
  const visibleLinks = useMemo(() => {
    return NETWORK_LINKS.filter(link => {
      if (link.type === 'BACKBONE' && !showBackbone) return false;
      if (link.type === 'FEEDER' && !showFeeder) return false;
      if (link.type === 'UPLINK' && !showUplink) return false;
      if (link.type === 'RING' && !showRing) return false;
      return true;
    });
  }, [showBackbone, showFeeder, showUplink, showRing]);

  // Pan and drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'svg' || (e.target as HTMLElement).tagName.toLowerCase() === 'path') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.5, Math.max(0.65, Number((prev + delta).toFixed(2)))));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(null);
    setSelectedLink(null);
    setRegionFilter('ALL');
    setTraceStartNode(null);
    setTraceEndNode(null);
    setTraceResultPath([]);
    showToast('Tampilan peta direset ke posisi awal', 'info');
  };

  // Quick region jump
  const handleFocusRegion = (region: string) => {
    setRegionFilter(region);
    setSelectedNode(null);
    setSelectedLink(null);

    switch (region) {
      case 'Kota Batu':
        setZoomLevel(1.5);
        setPanOffset({ x: 180, y: 40 });
        break;
      case 'Malang Kota':
        setZoomLevel(1.4);
        setPanOffset({ x: 0, y: -40 });
        break;
      case 'Singosari (Malang Utara)':
      case 'Lawang':
        setZoomLevel(1.5);
        setPanOffset({ x: -40, y: 140 });
        break;
      case 'Kepanjen (Malang Selatan)':
        setZoomLevel(1.5);
        setPanOffset({ x: 20, y: -160 });
        break;
      case 'Turen & Dampit':
        setZoomLevel(1.5);
        setPanOffset({ x: -120, y: -200 });
        break;
      default:
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
    }
  };

  // Node Click Logic
  const handleNodeClick = (node: NetworkNode) => {
    if (interactiveMode === 'trace') {
      if (!traceStartNode) {
        setTraceStartNode(node);
        showToast(`Titik Asal dipilih: ${node.name}. Sekarang klik Titik Tujuan.`, 'info');
      } else if (!traceEndNode && traceStartNode.id !== node.id) {
        setTraceEndNode(node);
        // Compute path hops
        const hops = [traceStartNode.id, 'NODE-MLG-KLJ', node.id];
        setTraceResultPath(hops);
        showToast(`Jalur optical trace ditemukan: ${traceStartNode.code} ⇄ ${node.code}`, 'success');
      } else {
        setTraceStartNode(node);
        setTraceEndNode(null);
        setTraceResultPath([]);
      }
      return;
    }

    setSelectedNode(node);
    setSelectedLink(null);
    setTestResult(null);
  };

  // Link Click Logic
  const handleLinkClick = (link: NetworkLink) => {
    if (interactiveMode === 'cut_sim') {
      // Toggle cut
      const isAlreadyCut = cutLinks.includes(link.id);
      if (isAlreadyCut) {
        setCutLinks(prev => prev.filter(id => id !== link.id));
        showToast(`Kabel ${link.code} telah dipulihkan (Restored)`, 'success');
      } else {
        setCutLinks(prev => [...prev, link.id]);
        setFailoverActive(true);
        showToast(`⚡ SIMULASI: Serat optik ${link.code} terputus (FIBER CUT)! Self-healing ring diaktifkan (< 50ms).`, 'warning');
      }
      return;
    }

    setSelectedLink(link);
    setSelectedNode(null);
    setTestResult(null);
  };

  // Simulate Signal Ping Test
  const handleRunSignalTest = (targetName: string) => {
    setIsTestingSignal(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingSignal(false);
      const latency = Math.floor(1.8 + Math.random() * 2.5 * 10) / 10;
      const loss = -17.5 - Math.floor(Math.random() * 25) / 10;
      setTestResult(`Hasil Uji: RTT Latency ${latency} ms · Redaman Rata-rata ${loss.toFixed(1)} dBm (SLA Optimal)`);
      showToast(`Pengujian sinyal optik ke ${targetName} selesai: Sukses`, 'success');
    }, 900);
  };

  // High-Resolution PNG Export Handler
  const handleExportHighResPng = async (options: NetworkExportOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!mapSvgRef.current) {
        showToast('Kanvas SVG tidak ditemukan untuk diekspor.', 'warning');
        reject(new Error('SVG ref not found'));
        return;
      }

      try {
        const clonedSvg = mapSvgRef.current.cloneNode(true) as SVGSVGElement;

        // Scope handling: 'full' resets pan/zoom so the entire map is captured; 'current' keeps current view
        if (options.scope === 'full') {
          clonedSvg.style.transform = 'none';
          clonedSvg.style.transformOrigin = 'center center';
        } else {
          clonedSvg.style.transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`;
          clonedSvg.style.transformOrigin = 'center center';
        }

        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSvg.setAttribute('width', '700');
        clonedSvg.setAttribute('height', '620');

        const svgString = new XMLSerializer().serializeToString(clonedSvg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URLObj = window.URL || window.webkitURL || window;
        const blobUrl = URLObj.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          try {
            const scale = options.resolutionScale;
            const baseW = 700;
            const baseH = 620;
            const headerH = options.includeHeader ? 110 : 0;
            const footerH = options.includeLegend ? 90 : 0;
            const totalW = baseW;
            const totalH = baseH + headerH + footerH;

            const canvas = document.createElement('canvas');
            canvas.width = totalW * scale;
            canvas.height = totalH * scale;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Canvas 2D context not available'));
              return;
            }

            // Scale canvas for high-DPI rendering
            ctx.scale(scale, scale);

            // 1. Draw Canvas Dark Base Background (#070D1E)
            ctx.fillStyle = '#070D1E';
            ctx.fillRect(0, 0, totalW, totalH);

            // 2. Draw Subtle Radial Dot Grid
            ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
            for (let x = 0; x < totalW; x += 28) {
              for (let y = headerH; y < baseH + headerH; y += 28) {
                ctx.beginPath();
                ctx.arc(x + 1, y + 1, 1, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // 3. Draw Header if enabled
            if (options.includeHeader) {
              // Header background
              ctx.fillStyle = '#091226';
              ctx.fillRect(0, 0, totalW, headerH);

              // Header bottom line
              ctx.strokeStyle = '#1E293B';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(0, headerH);
              ctx.lineTo(totalW, headerH);
              ctx.stroke();

              // Decorative cyan accent pill
              ctx.fillStyle = '#0284c7';
              ctx.fillRect(24, 22, 4, 40);

              // Header text
              ctx.fillStyle = '#38bdf8';
              ctx.font = 'bold 10px monospace';
              ctx.fillText('DIVISI JARINGAN FIBER OPTIK & TRANSMISI REGIONAL MALANG', 36, 34);

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 16px system-ui, sans-serif';
              ctx.fillText('PETA TOPOLOGI INFRASTRUKTUR & CORE NETWORK', 36, 54);

              ctx.fillStyle = '#94a3b8';
              ctx.font = '10px system-ui, sans-serif';
              const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) + ' WIB';
              ctx.fillText(`Dokumentasi Teknis Lapangan · Waktu Ekspor: ${nowStr}`, 36, 70);

              // Right-side info box
              if (options.includeMetrics) {
                ctx.fillStyle = '#0f172a';
                if (ctx.roundRect) {
                  ctx.beginPath();
                  ctx.roundRect(totalW - 220, 18, 196, 72, 8);
                  ctx.fill();
                  ctx.strokeStyle = '#334155';
                  ctx.stroke();
                } else {
                  ctx.fillRect(totalW - 220, 18, 196, 72);
                }

                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 9px monospace';
                ctx.fillText('METRIK TOPOLOGI AKTIF', totalW - 208, 34);

                ctx.fillStyle = '#e2e8f0';
                ctx.font = '10px system-ui, sans-serif';
                ctx.fillText(`• Simpul Sentral: ${filteredNodes.length} POP Telko`, totalW - 208, 50);
                ctx.fillText(`• Rute Transmisi: ${visibleLinks.length} Trunk & Feeder`, totalW - 208, 64);
                ctx.fillText(`• Wilayah: ${regionFilter === 'ALL' ? 'Malang Raya (Semua)' : regionFilter}`, totalW - 208, 78);
              }
            }

            // 4. Draw SVG Map Canvas
            ctx.drawImage(img, 0, headerH, baseW, baseH);

            // 5. Draw Footer / Legend if enabled
            if (options.includeLegend) {
              const footerY = baseH + headerH;
              ctx.fillStyle = '#091226';
              ctx.fillRect(0, footerY, totalW, footerH);

              ctx.strokeStyle = '#1E293B';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(0, footerY);
              ctx.lineTo(totalW, footerY);
              ctx.stroke();

              ctx.fillStyle = '#94a3b8';
              ctx.font = 'bold 9px monospace';
              ctx.fillText('LEGENDA SIMPUL & KABEL:', 24, footerY + 22);

              // Super Backbone
              ctx.fillStyle = '#6366f1';
              ctx.beginPath();
              ctx.arc(32, footerY + 42, 5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#e2e8f0';
              ctx.font = '10px system-ui, sans-serif';
              ctx.fillText('Super Backbone Gateway', 44, footerY + 46);

              // Backbone POP
              ctx.fillStyle = '#0284c7';
              ctx.beginPath();
              ctx.arc(205, footerY + 42, 5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#e2e8f0';
              ctx.fillText('POP Sentral Backbone', 217, footerY + 46);

              // Access POP
              ctx.fillStyle = '#10b981';
              ctx.beginPath();
              ctx.arc(365, footerY + 42, 4.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#e2e8f0';
              ctx.fillText('POP Distribusi Akses', 377, footerY + 46);

              // Cables
              ctx.strokeStyle = '#6366f1';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(32, footerY + 66);
              ctx.lineTo(56, footerY + 66);
              ctx.stroke();
              ctx.fillStyle = '#94a3b8';
              ctx.fillText('Backbone Trunk 100G', 64, footerY + 70);

              ctx.strokeStyle = '#0284c7';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(205, footerY + 66);
              ctx.lineTo(229, footerY + 66);
              ctx.stroke();
              ctx.fillStyle = '#94a3b8';
              ctx.fillText('Feeder Metro 10G', 237, footerY + 70);

              // Confidentiality
              ctx.fillStyle = '#64748b';
              ctx.font = '9px monospace';
              ctx.fillText('CONFIDENTIAL · FOR INTERNAL TECHNICAL & PRESENTATION USE ONLY', totalW - 350, footerY + 70);
            }

            // 6. Convert canvas to PNG blob and download
            canvas.toBlob(pngBlob => {
              if (!pngBlob) {
                reject(new Error('Failed to create PNG blob'));
                return;
              }
              const pngUrl = URLObj.createObjectURL(pngBlob);
              const downloadLink = document.createElement('a');
              const timestamp = new Date().toISOString().slice(0, 10);
              const scopeTag = options.scope === 'current' ? 'Fokus' : 'Full';
              downloadLink.download = `Dokumentasi_Network_Map_Malang_${scopeTag}_${timestamp}.png`;
              downloadLink.href = pngUrl;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);

              URLObj.revokeObjectURL(pngUrl);
              URLObj.revokeObjectURL(blobUrl);

              showToast(
                `Gambar PNG resolusi tinggi (${canvas.width} × ${canvas.height} px) berhasil diekspor!`,
                'success'
              );
              resolve();
            }, 'image/png');
          } catch (innerErr) {
            URLObj.revokeObjectURL(blobUrl);
            reject(innerErr);
          }
        };

        img.onerror = e => {
          URLObj.revokeObjectURL(blobUrl);
          reject(e);
        };

        img.src = blobUrl;
      } catch (e) {
        reject(e);
      }
    });
  };

  // Helper colors
  const getNodeColor = (type: NetworkNode['type']) => {
    switch (type) {
      case 'SUPER_BACKBONE':
        return '#6366f1'; // Indigo
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

  const getLinkColor = (link: NetworkLink) => {
    if (cutLinks.includes(link.id)) return '#ef4444'; // Red if cut
    if (selectedLink?.id === link.id) return '#38bdf8'; // Highlighted sky
    if (link.type === 'BACKBONE') return '#818cf8';
    if (link.type === 'FEEDER') return '#38bdf8';
    if (link.type === 'UPLINK') return '#06b6d4';
    if (link.type === 'RING') return '#10b981';
    return '#64748b';
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>PETA GEOGRAFIS INFRASTRUKTUR INTERAKTIF</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Network Map Malang Raya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Jelajahi, klik simpul sentral POP, periksa kabel serat optik, uji trace jalur, dan simulasikan proteksi ring loop.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Map Engine Toggle Switch */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setViewEngine('google');
                showToast('Beralih ke Google Maps Platform GIS View', 'info');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                viewEngine === 'google'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Maps GIS</span>
            </button>

            <button
              onClick={() => {
                setViewEngine('schematic');
                showToast('Beralih ke Skematik Topologi Vektor NOC', 'info');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                viewEngine === 'schematic'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Skematik Vektor</span>
            </button>
          </div>

          {/* Interactive Mode Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setInteractiveMode('explore');
                setCutLinks([]);
                setTraceStartNode(null);
                setTraceEndNode(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                interactiveMode === 'explore'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Mode Jelajah</span>
            </button>

            <button
              onClick={() => {
                setInteractiveMode('cut_sim');
                setSelectedNode(null);
                setSelectedLink(null);
                showToast('Mode Simulasi Putus Kabel Aktif: Klik pada garis kabel mana pun di peta untuk memutuskan sambungan.', 'info');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                interactiveMode === 'cut_sim'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Simulasi Fiber Cut</span>
            </button>

            <button
              onClick={() => {
                setInteractiveMode('trace');
                setSelectedNode(null);
                setSelectedLink(null);
                setTraceStartNode(null);
                setTraceEndNode(null);
                showToast('Mode Tracing Optik Aktif: Klik node pertama sebagai Titik Asal, lalu klik node kedua sebagai Tujuan.', 'info');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                interactiveMode === 'trace'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Tracing Jalur A→B</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Region Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold shrink-0">
          Fokus Wilayah:
        </span>
        <button
          onClick={() => handleFocusRegion('ALL')}
          className={`px-3 py-1 rounded-xl border transition-colors shrink-0 font-medium ${
            regionFilter === 'ALL'
              ? 'bg-blue-600 text-white border-blue-600 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          📍 Semua Wilayah ({INITIAL_NETWORK_NODES.length})
        </button>
        {regions.map(r => (
          <button
            key={r}
            onClick={() => handleFocusRegion(r)}
            className={`px-3 py-1 rounded-xl border transition-colors shrink-0 font-medium ${
              regionFilter === r
                ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Control Toolbar: Layers, Search, and Zoom */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase hidden sm:inline">
            Layer:
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={showBackbone}
              onChange={e => setShowBackbone(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-indigo-500 rounded inline-block" />
              <span>Backbone</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={showFeeder}
              onChange={e => setShowFeeder(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-sky-500 rounded inline-block" />
              <span>Feeder</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={showUplink}
              onChange={e => setShowUplink(e.target.checked)}
              className="rounded border-slate-300 text-cyan-600 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-cyan-500 rounded inline-block" />
              <span>Uplink</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={showRing}
              onChange={e => setShowRing(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-emerald-500 rounded inline-block" />
              <span>Ring Loops</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium ml-1">
            <input
              type="checkbox"
              checked={showLivePulses}
              onChange={e => setShowLivePulses(e.target.checked)}
              className="rounded border-slate-300 text-amber-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-500" />
              <span>Trafik Optik</span>
            </span>
          </label>
        </div>

        {/* Search & Zoom Group */}
        <div className="flex items-center gap-3">
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={nodeSearch}
              onChange={e => setNodeSearch(e.target.value)}
              placeholder="Cari POP/Node..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-xs transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-semibold text-slate-700 px-1 tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60"
              title="Reset Tampilan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export High-Resolution PNG Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            title="Ekspor peta jaringan sebagai gambar PNG resolusi tinggi untuk dokumentasi atau presentasi"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor PNG</span>
          </button>
        </div>

      </div>

      {/* Mode Instructions Callout if active */}
      {interactiveMode === 'cut_sim' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Mode Simulasi Fiber Cut Aktif:</strong> Klik pada kabel garis mana saja untuk memutus serat optik dan melihat rerouting proteksi ring secara otomatis.
            </span>
          </div>
          {cutLinks.length > 0 && (
            <button
              onClick={() => {
                setCutLinks([]);
                setFailoverActive(false);
                showToast('Semua kabel yang putus telah disambung kembali (All Restored)', 'success');
              }}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 shrink-0 ml-3"
            >
              Pulihkan Semua ({cutLinks.length})
            </button>
          )}
        </div>
      )}

      {interactiveMode === 'trace' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Mode Tracing Optik A→B:</strong>{' '}
              {!traceStartNode
                ? 'Klik simpul pertama sebagai Titik Asal.'
                : !traceEndNode
                ? `Titik Asal: [${traceStartNode.code}]. Sekarang klik simpul kedua sebagai Titik Tujuan.`
                : `Jalur Aktif: [${traceStartNode.code}] → [Master Hub Klojen] → [${traceEndNode.code}].`}
            </span>
          </div>
          {traceStartNode && (
            <button
              onClick={() => {
                setTraceStartNode(null);
                setTraceEndNode(null);
                setTraceResultPath([]);
              }}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shrink-0 ml-3"
            >
              Reset Tracing
            </button>
          )}
        </div>
      )}

      {/* ================= MAP CANVAS CONTAINER ================= */}
      <div 
        ref={containerRef}
        className="relative bg-[#070D1E] border border-slate-200/80 rounded-2xl overflow-hidden min-h-[580px] h-[640px] flex items-center justify-center select-none shadow-xs cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.45) 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Vector SVG Map Viewport */}
        <svg
          ref={mapSvgRef}
          viewBox="0 0 700 620"
          className="w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Geographical region backdrop contour polygons */}
          <g opacity="0.14" fill="#0284c7">
            {/* North Malang / Singosari / Lawang */}
            <path d="M 320 20 L 520 20 L 580 180 L 400 210 Z" />
            {/* Batu mountainous west */}
            <path d="M 120 120 L 320 120 L 320 280 L 120 240 Z" />
            {/* Malang Kota Central */}
            <path d="M 300 220 L 500 220 L 480 400 L 280 400 Z" />
            {/* Kepanjen / Malang South */}
            <path d="M 280 400 L 520 400 L 580 580 L 260 580 Z" />
          </g>

          {/* Region boundary dividing lines */}
          <g stroke="rgba(100, 116, 139, 0.25)" strokeWidth="1" strokeDasharray="4 4" fill="none">
            <line x1="100" y1="210" x2="600" y2="210" />
            <line x1="100" y1="390" x2="600" y2="390" />
          </g>

          {/* Geographic Region Text Labels */}
          <text x="32" y="160" fill="rgba(148, 163, 184, 0.45)" fontSize="11" fontWeight="bold">
            KOTA BATU
          </text>
          <text x="540" y="90" fill="rgba(148, 163, 184, 0.45)" fontSize="11" fontWeight="bold">
            MALANG UTARA (LAWANG)
          </text>
          <text x="500" y="320" fill="rgba(148, 163, 184, 0.45)" fontSize="11" fontWeight="bold">
            MALANG KOTA (CENTRAL)
          </text>
          <text x="500" y="470" fill="rgba(148, 163, 184, 0.45)" fontSize="11" fontWeight="bold">
            MALANG SELATAN (KEPANJEN)
          </text>

          {/* ================= FIBER CABLES / LINKS ================= */}
          <g strokeLinecap="round">
            {visibleLinks.map(link => {
              const isSelected = selectedLink?.id === link.id;
              const isCut = cutLinks.includes(link.id);
              const isTraced =
                traceResultPath.length > 1 &&
                (traceResultPath.includes(link.fromNodeId) && traceResultPath.includes(link.toNodeId));
              const strokeColor = isCut ? '#ef4444' : isTraced ? '#10b981' : getLinkColor(link);
              const strokeW = isSelected || isTraced ? 5 : link.type === 'BACKBONE' ? 3.5 : 2.5;

              return (
                <g
                  key={link.id}
                  className="cursor-pointer group"
                  onClick={e => {
                    e.stopPropagation();
                    handleLinkClick(link);
                  }}
                  onMouseEnter={e => handleLinkMouseEnter(link, e)}
                  onMouseMove={handleLinkMouseMove}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  {/* Invisible thicker stroke for effortless hit testing / clicking */}
                  {link.isCurved && link.curvePath ? (
                    <path d={link.curvePath} fill="none" stroke="transparent" strokeWidth="18" />
                  ) : (
                    <line x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} stroke="transparent" strokeWidth="18" />
                  )}

                  {/* Outer subtle glow on selected or traced */}
                  {(isSelected || isTraced) && (
                    link.isCurved && link.curvePath ? (
                      <path d={link.curvePath} fill="none" stroke={strokeColor} strokeWidth={strokeW + 6} strokeOpacity="0.4" />
                    ) : (
                      <line x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} stroke={strokeColor} strokeWidth={strokeW + 6} strokeOpacity="0.4" />
                    )
                  )}

                  {/* Main Fiber Cable Line */}
                  {link.isCurved && link.curvePath ? (
                    <path
                      d={link.curvePath}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeW}
                      strokeDasharray={isCut ? '6 6' : link.type === 'RING' ? '6 4' : undefined}
                      className={isCut ? 'animate-pulse' : undefined}
                    />
                  ) : (
                    <line
                      x1={link.x1}
                      y1={link.y1}
                      x2={link.x2}
                      y2={link.y2}
                      stroke={strokeColor}
                      strokeWidth={strokeW}
                      strokeDasharray={isCut ? '6 6' : link.type === 'BACKBONE' ? '8 4' : undefined}
                      className={isCut ? 'animate-pulse' : undefined}
                    />
                  )}

                  {/* Fiber Cut Indicator Icon Marker if cut */}
                  {isCut && (
                    <g transform={`translate(${(link.x1 + link.x2) / 2}, ${(link.y1 + link.y2) / 2})`}>
                      <circle r="10" fill="#ef4444" />
                      <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                        ✕
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* ================= OPTICAL PACKET PULSES ================= */}
          {showLivePulses && (
            <g pointerEvents="none">
              {visibleLinks.slice(0, 7).map((link, idx) => {
                if (cutLinks.includes(link.id)) return null;
                const midX = (link.x1 + link.x2) / 2;
                const midY = (link.y1 + link.y2) / 2;
                return (
                  <circle
                    key={`pulse-${link.id}`}
                    cx={midX}
                    cy={midY}
                    r="2.5"
                    fill="#38bdf8"
                    className="animate-ping"
                    style={{ animationDuration: `${2 + (idx % 3)}s` }}
                  />
                );
              })}
            </g>
          )}

          {/* ================= NETWORK NODES ================= */}
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isTraceStart = traceStartNode?.id === node.id;
            const isTraceEnd = traceEndNode?.id === node.id;
            const isTracedNode = traceResultPath.includes(node.id);
            const nodeColor = isTraceStart ? '#10b981' : isTraceEnd ? '#f59e0b' : getNodeColor(node.type);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform group"
                onClick={e => {
                  e.stopPropagation();
                  handleNodeClick(node);
                }}
                onMouseEnter={e => handleNodeMouseEnter(node, e)}
                onMouseMove={handleNodeMouseMove}
                onMouseLeave={handleNodeMouseLeave}
              >
                {/* Ping circle on selected or trace endpoint */}
                {(isSelected || isTraceStart || isTraceEnd) && (
                  <circle r="20" fill="none" stroke={nodeColor} strokeWidth="2" className="animate-ping" />
                )}

                {/* Outer halo */}
                <circle
                  r={node.type === 'SUPER_BACKBONE' ? 15 : node.type === 'POP_BACKBONE' ? 12 : 9.5}
                  fill={nodeColor}
                  fillOpacity={isSelected || isTracedNode ? 0.45 : 0.22}
                  stroke={nodeColor}
                  strokeWidth={isSelected || isTracedNode ? 3 : 1.5}
                  className="group-hover:stroke-white transition-colors"
                />

                {/* Center dot */}
                <circle
                  r={node.type === 'SUPER_BACKBONE' ? 7 : node.type === 'POP_BACKBONE' ? 5.5 : 4}
                  fill={nodeColor}
                />

                {/* Node Code Label */}
                <text
                  x="0"
                  y={node.type === 'SUPER_BACKBONE' ? -18 : -15}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow-md group-hover:fill-sky-300"
                >
                  {node.code}
                </text>

                {/* Badge if trace start or end */}
                {isTraceStart && (
                  <text x="0" y="24" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    [START]
                  </text>
                )}
                {isTraceEnd && (
                  <text x="0" y="24" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    [DEST]
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Minimalist Node Tooltip on MouseEnter with Subtle Fade-In Animation */}
        {hoveredNodeTooltip && !selectedNode && (
          <div
            className="absolute pointer-events-none z-40 animate-tooltip-fade transition-transform duration-75 ease-out"
            style={{
              left: `${Math.min(
                Math.max(hoveredNodeTooltip.x, 120),
                (containerRef.current?.clientWidth || 700) - 120
              )}px`,
              top: `${Math.max(hoveredNodeTooltip.y - 74, 14)}px`,
              transform: 'translate(-50%, 0)',
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white rounded-xl shadow-2xl px-3 py-2 text-xs space-y-1 min-w-[210px] max-w-[260px]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-[11px] text-white tracking-wide truncate">
                  {hoveredNodeTooltip.node.code}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide border shrink-0 ${
                    hoveredNodeTooltip.statusColor === 'amber'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hoveredNodeTooltip.statusColor === 'amber'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  {hoveredNodeTooltip.highLevelStatus}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 font-medium truncate">
                {hoveredNodeTooltip.node.name}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                <span>{hoveredNodeTooltip.node.region}</span>
                <span className="text-sky-300 font-semibold">
                  {hoveredNodeTooltip.node.usedCores}/{hoveredNodeTooltip.node.capacityCores} Core ({Math.round(
                    (hoveredNodeTooltip.node.usedCores / hoveredNodeTooltip.node.capacityCores) * 100
                  )}%)
                </span>
              </div>
            </div>

            {/* Subtle downward caret pointing directly toward the node */}
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900/95 mx-auto" />
          </div>
        )}

        {/* Dynamic Minimalist Cable Link Tooltip on MouseEnter with Subtle Fade-In Animation */}
        {hoveredLinkTooltip && !hoveredNodeTooltip && !selectedLink && (
          <div
            className="absolute pointer-events-none z-40 animate-tooltip-fade transition-transform duration-75 ease-out"
            style={{
              left: `${Math.min(
                Math.max(hoveredLinkTooltip.x, 110),
                (containerRef.current?.clientWidth || 700) - 110
              )}px`,
              top: `${Math.max(hoveredLinkTooltip.y - 62, 14)}px`,
              transform: 'translate(-50%, 0)',
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white rounded-xl shadow-2xl px-3 py-1.5 text-xs space-y-0.5 min-w-[190px] max-w-[240px]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-[10px] text-cyan-400 uppercase tracking-wide truncate">
                  {hoveredLinkTooltip.link.code}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold shrink-0">
                  {cutLinks.includes(hoveredLinkTooltip.link.id) ? '✕ FIBER CUT' : '● ' + hoveredLinkTooltip.link.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-200 font-medium truncate">
                {hoveredLinkTooltip.link.name}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                <span>{hoveredLinkTooltip.link.lengthKm} km</span>
                <span className="text-sky-300 font-semibold">{hoveredLinkTooltip.link.attenuationDbm} dBm</span>
              </div>
            </div>
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900/95 mx-auto" />
          </div>
        )}

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-xl text-[11px] space-y-1.5 shadow-lg text-slate-800 z-10 hidden sm:block">
          <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px]">
            Legenda Simpul &amp; Kabel
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600 font-medium">Super Backbone Gateway</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-600 font-medium">POP Sentral Backbone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">POP Akses / Ring Loop</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="w-3.5 h-1 bg-sky-400 rounded-full" />
            <span className="text-slate-600">Klik kabel untuk melihat detail teknis</span>
          </div>
        </div>

        {/* ================= DRAGGABLE NETWORK MINI-MAP OVERLAY ================= */}
        <NetworkMiniMap
          nodes={filteredNodes}
          links={visibleLinks}
          cutLinks={cutLinks}
          selectedNode={selectedNode}
          selectedLink={selectedLink}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          onPanChange={setPanOffset}
          onSelectNode={node => handleNodeClick(node)}
          containerRef={containerRef}
        />

        {/* ================= COMPREHENSIVE SIDEBAR / MODAL: SELECTED NODE ================= */}
        <NodeDetailDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSelectNode={newNode => setSelectedNode(newNode)}
          onStartTrace={tracedNode => {
            setInteractiveMode('trace');
            setTraceStartNode(tracedNode);
            setSelectedNode(null);
            showToast(`Titik Asal trace diatur: [${tracedNode.code}]. Klik node tujuan di peta.`, 'info');
          }}
        />

        {/* ================= FLOATING INSPECTOR: SELECTED LINK ================= */}
        {selectedLink && (
          <div className="absolute top-4 right-4 w-84 max-w-[calc(100%-2rem)] bg-white/98 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn text-slate-800 z-20">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase tracking-wider block">
                  {selectedLink.type} · {selectedLink.code}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                  {selectedLink.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedLink(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Panjang Jalur Optik</span>
                <span className="text-slate-800 font-mono font-bold">{selectedLink.lengthKm} Km</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Nilai Redaman (Loss)</span>
                <span className="text-emerald-700 font-mono font-bold">{selectedLink.attenuationDbm} dBm</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Kapasitas Helai Core</span>
                <span className="text-slate-900 font-mono font-bold">
                  {selectedLink.coreUsed} / {selectedLink.coreCapacity} Core
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Status Jalur</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    cutLinks.includes(selectedLink.id)
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  ● {cutLinks.includes(selectedLink.id) ? 'FIBER CUT (Putus)' : selectedLink.status}
                </span>
              </div>
            </div>

            {/* Core utilization bar */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Utilisasi Helai Kabel</span>
                <span className="font-mono font-bold text-slate-800">
                  {Math.round((selectedLink.coreUsed / selectedLink.coreCapacity) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${(selectedLink.coreUsed / selectedLink.coreCapacity) * 100}%`,
                  }}
                  className="h-full bg-cyan-600 rounded-full"
                />
              </div>
            </div>

            {/* Fiber Cut Toggle Button */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  const isCut = cutLinks.includes(selectedLink.id);
                  if (isCut) {
                    setCutLinks(prev => prev.filter(id => id !== selectedLink.id));
                    showToast(`Kabel ${selectedLink.code} disambung kembali`, 'success');
                  } else {
                    setCutLinks(prev => [...prev, selectedLink.id]);
                    setFailoverActive(true);
                    showToast(`Simulasi: Kabel ${selectedLink.code} diputus. Self-healing aktif.`, 'warning');
                  }
                }}
                className={`w-full py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                  cutLinks.includes(selectedLink.id)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>
                  {cutLinks.includes(selectedLink.id) ? 'Pulihkan Sambungan Kabel' : 'Simulasi Putuskan Kabel Ini'}
                </span>
              </button>

              <button
                onClick={() => {
                  openCoreDetail(dataCoreList[0]);
                }}
                className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Lihat SLD &amp; KMZ Feeder</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Network Overview Summary Cards at Bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Simpul Terpetakan</span>
            <Network className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
            {INITIAL_NETWORK_NODES.length} Node
          </p>
          <p className="text-[11px] text-slate-400">1 Super Backbone · 7 POP · 3 Access</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Jalur Kabel Transmisi</span>
            <Radio className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
            {NETWORK_LINKS.length} Segmen
          </p>
          <p className="text-[11px] text-slate-400">Feeder, Uplink &amp; Protected Ring Loops</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Redundansi Ring Loop</span>
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-mono font-extrabold text-emerald-600 tabular-nums">
            &lt; 50 ms
          </p>
          <p className="text-[11px] text-slate-400">Failover self-healing otomatis</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Kondisi Jaringan</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
            {cutLinks.length === 0 ? '99.98% Normal' : `${cutLinks.length} Sim Cut (Rerouted)`}
          </p>
          <p className="text-[11px] text-slate-400">
            {cutLinks.length === 0 ? 'Seluruh link terhubung stabil' : 'Jalur cadangan proteksi aktif'}
          </p>
        </div>

      </div>

      {/* High-Resolution PNG Export Modal */}
      <NetworkExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportHighResPng}
        currentZoom={zoomLevel}
        regionName={regionFilter === 'ALL' ? 'Malang Raya' : regionFilter}
        nodesCount={filteredNodes.length}
        linksCount={visibleLinks.length}
      />

    </div>
  );
};
