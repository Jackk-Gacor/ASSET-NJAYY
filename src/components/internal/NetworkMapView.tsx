import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_NETWORK_NODES, INITIAL_RINGS } from '../../data/initialData';
import { NetworkNode, MalangRegion } from '../../types';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { NetworkMiniMap } from './NetworkMiniMap';
import { NetworkExportModal, NetworkExportOptions } from './NetworkExportModal';
import { GoogleNetworkMapView } from './GoogleNetworkMapView';
import { NetworkLegendPanel } from './NetworkLegendPanel';
import { DataRingView } from './DataRingView';
import { GisReferenceModal } from './GisReferenceModal';
import { PopCrmCatalogView } from './PopCrmCatalogView';
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
  // ================= 1. SUPER BACKBONE TRUNK =================
  {
    id: 'LINK-GI-LWG-KBG',
    fromNodeId: 'NODE-GI-LWG',
    toNodeId: 'NODE-GI-KBG',
    name: 'Super Backbone: GI Lawang_AREA45 ⇄ GI Kebon Agung_AREA45 (Titik 0)',
    code: 'BONE-LWG-KBG-288C',
    type: 'BACKBONE',
    coreCapacity: 288,
    coreUsed: 216,
    lengthKm: 24.5,
    attenuationDbm: -13.8,
    status: 'Optimal',
    x1: 650,
    y1: 75,
    x2: 450,
    y2: 440,
    isCurved: true,
    curvePath: 'M 650 75 Q 600 240 450 440',
  },

  // ================= 2. GAMBAR 1: POROS SELATAN (KEPANJEN - GONDANGLEGI - SUMBERPUCUNG) =================
  {
    id: 'LINK-SBP-KPJ',
    fromNodeId: 'NODE-ULP-SBP',
    toNodeId: 'NODE-ULP-KPJ',
    name: 'Jalur Transmisi ODC Sumberpucung ⇄ ODC Kepanjen_AREA45',
    code: 'BONE-SBP-KPJ-72C',
    type: 'BACKBONE',
    coreCapacity: 72,
    coreUsed: 48,
    lengthKm: 14.6,
    attenuationDbm: -16.5,
    status: 'Optimal',
    x1: 180,
    y1: 580,
    x2: 360,
    y2: 560,
  },
  {
    id: 'LINK-KPJ-GDL',
    fromNodeId: 'NODE-ULP-KPJ',
    toNodeId: 'NODE-ULP-GDL',
    name: 'Jalur Transmisi ODC Kepanjen ⇄ ODC Gondanglegi_AREA45',
    code: 'BONE-KPJ-GDL-96C',
    type: 'BACKBONE',
    coreCapacity: 96,
    coreUsed: 64,
    lengthKm: 11.2,
    attenuationDbm: -16.4,
    status: 'Optimal',
    x1: 360,
    y1: 560,
    x2: 540,
    y2: 580,
  },
  {
    id: 'LINK-GDL-DMP',
    fromNodeId: 'NODE-ULP-GDL',
    toNodeId: 'NODE-ULP-DMP',
    name: 'Jalur Distribusi ODC Gondanglegi ⇄ ULP Dampit_AREA45',
    code: 'FDR-GDL-DMP-48C',
    type: 'FEEDER',
    coreCapacity: 48,
    coreUsed: 24,
    lengthKm: 16.5,
    attenuationDbm: -17.8,
    status: 'Optimal',
    x1: 540,
    y1: 580,
    x2: 720,
    y2: 600,
  },
  {
    id: 'LINK-KBG-KPJ',
    fromNodeId: 'NODE-GI-KBG',
    toNodeId: 'NODE-ULP-KPJ',
    name: 'Backbone Titik 0 GI Kebon Agung ⇄ ODC Kepanjen_AREA45',
    code: 'BONE-KBG-KPJ-96C',
    type: 'BACKBONE',
    coreCapacity: 96,
    coreUsed: 64,
    lengthKm: 18.4,
    attenuationDbm: -17.2,
    status: 'Optimal',
    x1: 450,
    y1: 440,
    x2: 360,
    y2: 560,
  },
  {
    id: 'LINK-KBG-GDL',
    fromNodeId: 'NODE-GI-KBG',
    toNodeId: 'NODE-ULP-GDL',
    name: 'Backbone Koridor Bululawang: GI Kebon Agung ⇄ ODC Gondanglegi_AREA45',
    code: 'BONE-KBG-GDL-72C',
    type: 'BACKBONE',
    coreCapacity: 72,
    coreUsed: 48,
    lengthKm: 22.1,
    attenuationDbm: -18.0,
    status: 'Optimal',
    x1: 450,
    y1: 440,
    x2: 540,
    y2: 580,
  },
  {
    id: 'LINK-KBG-SBP',
    fromNodeId: 'NODE-GI-KBG',
    toNodeId: 'NODE-ULP-SBP',
    name: 'Ring Proteksi Barat: GI Kebon Agung ⇄ ODC Sumberpucung_AREA45',
    code: 'RING-KBG-SBP-48C',
    type: 'RING',
    coreCapacity: 48,
    coreUsed: 24,
    lengthKm: 24.2,
    attenuationDbm: -18.5,
    status: 'Optimal',
    x1: 450,
    y1: 440,
    x2: 180,
    y2: 580,
  },
  {
    id: 'LINK-KBG-ULP-KBG',
    fromNodeId: 'NODE-GI-KBG',
    toNodeId: 'NODE-ULP-KBG',
    name: 'Distribusi GI Kebon Agung ⇄ ODC ULP Kebong Agung_AREA45',
    code: 'FDR-KBG-KBG-96C',
    type: 'FEEDER',
    coreCapacity: 96,
    coreUsed: 72,
    lengthKm: 2.4,
    attenuationDbm: -15.1,
    status: 'Optimal',
    x1: 450,
    y1: 440,
    x2: 370,
    y2: 440,
  },

  // ================= 3. GAMBAR 2: POROS TENGAH & UTARA (MALANG KOTA - BATU - SINGOSARI) =================
  {
    id: 'LINK-BTU-SKL',
    fromNodeId: 'NODE-ULP-BATU',
    toNodeId: 'NODE-ODC-SKL',
    name: 'Backbone ODC ULP Batu ⇄ ODC GI Sengkaling_AREA45',
    code: 'BONE-BTU-SKL-96C',
    type: 'BACKBONE',
    coreCapacity: 96,
    coreUsed: 68,
    lengthKm: 8.5,
    attenuationDbm: -16.0,
    status: 'Optimal',
    x1: 140,
    y1: 130,
    x2: 230,
    y2: 200,
  },
  {
    id: 'LINK-SKL-MLY',
    fromNodeId: 'NODE-ODC-SKL',
    toNodeId: 'NODE-TK4-MLY',
    name: 'Jalur Transmisi ODC GI Sengkaling ⇄ TK4 Desa Mulyoagung_AREA45',
    code: 'FDR-SKL-MLY-48C',
    type: 'FEEDER',
    coreCapacity: 48,
    coreUsed: 28,
    lengthKm: 2.2,
    attenuationDbm: -15.2,
    status: 'Optimal',
    x1: 230,
    y1: 200,
    x2: 300,
    y2: 220,
  },
  {
    id: 'LINK-MLY-BGW',
    fromNodeId: 'NODE-TK4-MLY',
    toNodeId: 'NODE-ODC-BGW',
    name: 'Jalur Distribusi TK4 Mulyoagung ⇄ ODC Apart Begawan_AREA45',
    code: 'FDR-MLY-BGW-48C',
    type: 'FEEDER',
    coreCapacity: 48,
    coreUsed: 34,
    lengthKm: 3.1,
    attenuationDbm: -15.5,
    status: 'Optimal',
    x1: 300,
    y1: 220,
    x2: 360,
    y2: 250,
  },
  {
    id: 'LINK-BGW-DNY',
    fromNodeId: 'NODE-ODC-BGW',
    toNodeId: 'NODE-ULP-DNY',
    name: 'Backbone Tlogomas: ODC Apart Begawan ⇄ ODC ULP Dinoyo_AREA45',
    code: 'BONE-BGW-DNY-48C',
    type: 'BACKBONE',
    coreCapacity: 48,
    coreUsed: 36,
    lengthKm: 2.8,
    attenuationDbm: -15.6,
    status: 'Optimal',
    x1: 360,
    y1: 250,
    x2: 420,
    y2: 280,
  },
  {
    id: 'LINK-DNY-UP3',
    fromNodeId: 'NODE-ULP-DNY',
    toNodeId: 'NODE-UP3-MLG',
    name: 'Backbone Dinoyo ⇄ UP3 Malang_AREA45',
    code: 'BONE-DNY-UP3-96C',
    type: 'BACKBONE',
    coreCapacity: 96,
    coreUsed: 74,
    lengthKm: 4.5,
    attenuationDbm: -15.9,
    status: 'Optimal',
    x1: 420,
    y1: 280,
    x2: 480,
    y2: 340,
  },
  {
    id: 'LINK-UP3-BLM',
    fromNodeId: 'NODE-UP3-MLG',
    toNodeId: 'NODE-ULP-BLM',
    name: 'Backbone Metro Kota: UP3 Malang ⇄ PLN ODC ULP Blimbing_AREA45',
    code: 'BONE-UP3-BLM-144C',
    type: 'BACKBONE',
    coreCapacity: 144,
    coreUsed: 92,
    lengthKm: 4.8,
    attenuationDbm: -15.7,
    status: 'Optimal',
    x1: 480,
    y1: 340,
    x2: 550,
    y2: 250,
  },
  {
    id: 'LINK-BLM-SGS',
    fromNodeId: 'NODE-ULP-BLM',
    toNodeId: 'NODE-ULP-SGS',
    name: 'Backbone Industri: PLN ODC ULP Blimbing ⇄ ODC ULP Singosari_AREA45',
    code: 'BONE-BLM-SGS-96C',
    type: 'BACKBONE',
    coreCapacity: 96,
    coreUsed: 58,
    lengthKm: 6.8,
    attenuationDbm: -16.2,
    status: 'Optimal',
    x1: 550,
    y1: 250,
    x2: 580,
    y2: 140,
  },
  {
    id: 'LINK-SGS-LWG',
    fromNodeId: 'NODE-ULP-SGS',
    toNodeId: 'NODE-GI-LWG',
    name: 'Super Trunk: ODC ULP Singosari ⇄ GI Lawang_AREA45',
    code: 'BONE-SGS-LWG-144C',
    type: 'BACKBONE',
    coreCapacity: 144,
    coreUsed: 98,
    lengthKm: 8.2,
    attenuationDbm: -15.3,
    status: 'Optimal',
    x1: 580,
    y1: 140,
    x2: 650,
    y2: 75,
  },
  {
    id: 'LINK-BLM-SDR',
    fromNodeId: 'NODE-ULP-BLM',
    toNodeId: 'NODE-TK4-SDR',
    name: 'Feeder Timur: PLN ODC Blimbing ⇄ TK4 Desa Sidorejo_AREA45',
    code: 'FDR-BLM-SDR-48C',
    type: 'FEEDER',
    coreCapacity: 48,
    coreUsed: 22,
    lengthKm: 6.4,
    attenuationDbm: -16.8,
    status: 'Optimal',
    x1: 550,
    y1: 250,
    x2: 720,
    y2: 150,
  },
  {
    id: 'LINK-SDR-KBG',
    fromNodeId: 'NODE-TK4-SDR',
    toNodeId: 'NODE-GI-KBG',
    name: 'Ring Redundansi Timur: TK4 Sidorejo ⇄ GI Kebon Agung_AREA45',
    code: 'RING-SDR-KBG-48C',
    type: 'RING',
    coreCapacity: 48,
    coreUsed: 24,
    lengthKm: 14.5,
    attenuationDbm: -17.4,
    status: 'Optimal',
    x1: 720,
    y1: 150,
    x2: 450,
    y2: 440,
    isCurved: true,
    curvePath: 'M 720 150 Q 640 310 450 440',
  },
  {
    id: 'LINK-UP3-KBG',
    fromNodeId: 'NODE-UP3-MLG',
    toNodeId: 'NODE-GI-KBG',
    name: 'Sub-Transmission Sentral: UP3 Malang ⇄ GI Kebon Agung (Titik 0)',
    code: 'BONE-UP3-KBG-144C',
    type: 'BACKBONE',
    coreCapacity: 144,
    coreUsed: 118,
    lengthKm: 6.8,
    attenuationDbm: -15.8,
    status: 'Optimal',
    x1: 480,
    y1: 340,
    x2: 450,
    y2: 440,
  },
  {
    id: 'LINK-SKL-KBG',
    fromNodeId: 'NODE-ODC-SKL',
    toNodeId: 'NODE-GI-KBG',
    name: 'Ring Koridor Barat: ODC GI Sengkaling ⇄ GI Kebon Agung_AREA45',
    code: 'RING-SKL-KBG-72C',
    type: 'RING',
    coreCapacity: 72,
    coreUsed: 46,
    lengthKm: 12.3,
    attenuationDbm: -17.5,
    status: 'Optimal',
    x1: 230,
    y1: 200,
    x2: 450,
    y2: 440,
    isCurved: true,
    curvePath: 'M 230 200 Q 330 310 450 440',
  },
  {
    id: 'LINK-SKL-SBP',
    fromNodeId: 'NODE-ODC-SKL',
    toNodeId: 'NODE-ULP-SBP',
    name: 'Ring Proteksi Sengkaling - Sumberpucung_AREA45',
    code: 'RING-SKL-SBP-48C',
    type: 'RING',
    coreCapacity: 48,
    coreUsed: 28,
    lengthKm: 21.0,
    attenuationDbm: -18.2,
    status: 'Optimal',
    x1: 230,
    y1: 200,
    x2: 180,
    y2: 580,
    isCurved: true,
    curvePath: 'M 230 200 Q 150 380 180 580',
  },
];

export interface NetworkMapViewProps {
  defaultTab?: 'map' | 'ring' | 'crm';
}

export const NetworkMapView: React.FC<NetworkMapViewProps> = ({ defaultTab = 'map' }) => {
  const [activeMainTab, setActiveMainTab] = useState<'map' | 'ring' | 'crm'>(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveMainTab(defaultTab);
    }
  }, [defaultTab]);
  const { dataCoreList, openCoreDetail, showToast, navigateToSearchWithFilter } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapSvgRef = useRef<SVGSVGElement>(null);

  // High-Resolution PNG Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  // GIS Screenshot Reference Modal
  const [isGisReferenceOpen, setIsGisReferenceOpen] = useState(false);

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
  const [isLegendOpen, setIsLegendOpen] = useState(false);

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

  // Gambar 1: Poros Selatan (Kepanjen - Gondanglegi - Sumberpucung)
  const POROS_SELATAN_NODE_IDS = useMemo(
    () => [
      'NODE-GI-KBG',
      'NODE-ULP-KPJ',
      'NODE-ULP-SBP',
      'NODE-ULP-GDL',
      'NODE-ULP-DMP',
      'NODE-ULP-KBG',
    ],
    []
  );

  // Gambar 2: Poros Tengah & Utara (Malang Kota - Batu - Singosari)
  const POROS_UTARA_NODE_IDS = useMemo(
    () => [
      'NODE-GI-KBG',
      'NODE-UP3-MLG',
      'NODE-ULP-DNY',
      'NODE-ODC-BGW',
      'NODE-TK4-MLY',
      'NODE-ODC-SKL',
      'NODE-ULP-BATU',
      'NODE-ULP-BLM',
      'NODE-ULP-SGS',
      'NODE-GI-LWG',
      'NODE-TK4-SDR',
    ],
    []
  );

  const PLAN_PERTAMA_NODE_IDS = useMemo(
    () => [
      'NODE-GI-LWG',
      'NODE-GI-KBG',
      'NODE-ULP-KPJ',
      'NODE-ULP-GDL',
      'NODE-ULP-DMP',
      'NODE-ULP-SBP',
      'NODE-ULP-KBG',
      'NODE-UP3-MLG',
      'NODE-ODC-SKL',
    ],
    []
  );

  const PLAN_PERTAMA_LINK_IDS = useMemo(
    () => [
      'LINK-GI-LWG-KBG',
      'LINK-KBG-KPJ',
      'LINK-KBG-GDL',
      'LINK-KBG-SBP',
      'LINK-KBG-ULP-KBG',
      'LINK-UP3-KBG',
      'LINK-SKL-KBG',
      'LINK-GDL-DMP',
      'LINK-SBP-KPJ',
      'LINK-KPJ-GDL',
    ],
    []
  );

  // Filter nodes based on search and region
  const filteredNodes = useMemo(() => {
    return INITIAL_NETWORK_NODES.filter(node => {
      if (regionFilter === 'POROS_SELATAN') {
        return POROS_SELATAN_NODE_IDS.includes(node.id);
      }
      if (regionFilter === 'POROS_UTARA') {
        return POROS_UTARA_NODE_IDS.includes(node.id);
      }
      if (regionFilter === 'PLAN_PERTAMA') {
        return PLAN_PERTAMA_NODE_IDS.includes(node.id);
      }
      const matchRegion = regionFilter === 'ALL' || node.region === regionFilter;
      const matchSearch =
        !nodeSearch ||
        node.name.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        node.code.toLowerCase().includes(nodeSearch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [regionFilter, nodeSearch, POROS_SELATAN_NODE_IDS, POROS_UTARA_NODE_IDS, PLAN_PERTAMA_NODE_IDS]);

  // Filter links based on layer visibility
  const visibleLinks = useMemo(() => {
    return NETWORK_LINKS.filter(link => {
      if (regionFilter === 'POROS_SELATAN') {
        return POROS_SELATAN_NODE_IDS.includes(link.fromNodeId) && POROS_SELATAN_NODE_IDS.includes(link.toNodeId);
      }
      if (regionFilter === 'POROS_UTARA') {
        return POROS_UTARA_NODE_IDS.includes(link.fromNodeId) && POROS_UTARA_NODE_IDS.includes(link.toNodeId);
      }
      if (regionFilter === 'PLAN_PERTAMA') {
        return PLAN_PERTAMA_LINK_IDS.includes(link.id) ||
          (PLAN_PERTAMA_NODE_IDS.includes(link.fromNodeId) && PLAN_PERTAMA_NODE_IDS.includes(link.toNodeId));
      }
      if (link.type === 'BACKBONE' && !showBackbone) return false;
      if (link.type === 'FEEDER' && !showFeeder) return false;
      if (link.type === 'UPLINK' && !showUplink) return false;
      if (link.type === 'RING' && !showRing) return false;
      return true;
    });
  }, [regionFilter, showBackbone, showFeeder, showUplink, showRing, POROS_SELATAN_NODE_IDS, POROS_UTARA_NODE_IDS, PLAN_PERTAMA_LINK_IDS, PLAN_PERTAMA_NODE_IDS]);

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
      case 'PLAN_PERTAMA':
        setZoomLevel(1.35);
        setPanOffset({ x: -20, y: -80 });
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
        const hops = [traceStartNode.id, 'NODE-GI-KBG', node.id];
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
    if (selectedLink?.id === link.id) return '#06b6d4'; // Highlighted cyan
    if (link.id === 'LINK-GI-LWG-KBG') return '#d946ef'; // Magenta Super Backbone
    if (link.type === 'RING') return '#ec4899'; // Pink ring loop
    return '#ff00ea'; // Vibrant PLN Icon Plus GIS Magenta matching screenshot
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Level Unified Tab Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveMainTab('map')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeMainTab === 'map'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Peta Jaringan &amp; Distribusi GIS</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              activeMainTab === 'map' ? 'bg-blue-500/50 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              16 Simpul Area 45
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('ring')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeMainTab === 'ring'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sistem Redundansi Ring Loop</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              activeMainTab === 'ring' ? 'bg-emerald-500/40 text-white' : 'bg-emerald-100 text-emerald-800 font-semibold'
            }`}>
              4 Ring Proteksi
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('crm')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeMainTab === 'crm'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Katalog Asset &amp; CRM POP</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              activeMainTab === 'crm' ? 'bg-purple-500/40 text-white' : 'bg-purple-100 text-purple-800 font-semibold'
            }`}>
              CRM Lapangan
            </span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden xl:flex items-center gap-2 pr-3">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span>Sentral Titik 0: <strong>GI Kebon Agung</strong> ⇄ Super Backbone: <strong>GI Lawang</strong></span>
        </div>
      </div>

      {activeMainTab === 'ring' ? (
        <DataRingView />
      ) : activeMainTab === 'crm' ? (
        <PopCrmCatalogView
          onSelectNode={node => {
            setSelectedNode(node);
          }}
          onNavigateToMap={node => {
            setSelectedNode(node);
            setActiveMainTab('map');
          }}
          showToast={showToast}
        />
      ) : (
        <>
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

            <button
              onClick={() => setIsLegendOpen(prev => !prev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                isLegendOpen
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'
              }`}
              title="Buka / Tutup Panel Legenda Simbol & Kode Warna"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Legenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Region Selector Bar matching user screenshots */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold shrink-0">
          Fokus Topologi:
        </span>
        <button
          onClick={() => handleFocusRegion('ALL')}
          className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 font-bold flex items-center gap-1.5 ${
            regionFilter === 'ALL'
              ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>📍 Seluruh Area 45 (16 Simpul)</span>
        </button>

        <button
          onClick={() => {
            handleFocusRegion('POROS_SELATAN');
            const kpjNode = INITIAL_NETWORK_NODES.find(n => n.id === 'NODE-ULP-KPJ');
            if (kpjNode) setSelectedNode(kpjNode);
            showToast('Fokus: Poros Selatan Area 45 (Kepanjen - Gondanglegi - Sumberpucung)', 'info');
          }}
          className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 font-bold flex items-center gap-1.5 ${
            regionFilter === 'POROS_SELATAN'
              ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-xs'
              : 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-100'
          }`}
        >
          <span>⭐ Gambar 1: Poros Selatan</span>
          <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">Kepanjen · Gondanglegi · S.Pucung</span>
        </button>

        <button
          onClick={() => {
            handleFocusRegion('POROS_UTARA');
            const up3Node = INITIAL_NETWORK_NODES.find(n => n.id === 'NODE-UP3-MLG');
            if (up3Node) setSelectedNode(up3Node);
            showToast('Fokus: Poros Tengah & Utara Area 45 (Batu - Sengkaling - Dinoyo - Singosari)', 'info');
          }}
          className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 font-bold flex items-center gap-1.5 ${
            regionFilter === 'POROS_UTARA'
              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
              : 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
          }`}
        >
          <span>⭐ Gambar 2: Poros Tengah & Utara</span>
          <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">Batu · Sengkaling · Kota · Singosari</span>
        </button>

        <button
          onClick={() => {
            handleFocusRegion('PLAN_PERTAMA');
            const kbgNode = INITIAL_NETWORK_NODES.find(n => n.id === 'NODE-GI-KBG');
            if (kbgNode) {
              setSelectedNode(kbgNode);
              showToast('Fokus: PLAN PERTAMA TOPOLOGY (Titik 0 GI Kebon Agung)', 'info');
            }
          }}
          className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 font-bold flex items-center gap-1.5 ${
            regionFilter === 'PLAN_PERTAMA'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
          }`}
        >
          <span>⚡ Titik 0 GI Kebon Agung & Distribusi</span>
        </button>
      </div>

      {/* Poros Selatan Context Banner (Gambar 1) */}
      {regionFilter === 'POROS_SELATAN' && (
        <div className="bg-fuchsia-950/20 border border-fuchsia-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-fuchsia-950 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              G1
            </span>
            <div>
              <h4 className="font-bold text-sm text-fuchsia-950 flex items-center gap-2">
                <span>SESUAI GAMBAR 1 · KORIDOR POROS SELATAN (AREA 45)</span>
                <span className="px-2 py-0.5 rounded-md bg-fuchsia-100 text-fuchsia-800 font-mono text-[10px]">GIS MAPSOURCE</span>
              </h4>
              <p className="text-fuchsia-900 text-[11px] mt-0.5">
                Menampilkan <strong>POP ODC ULP SUMBERPUCUNG_AREA45</strong>, <strong>POP ODC ULP KEPANJEN_AREA45</strong>, <strong>POP ODC ULP GONDANGLEGI_AREA45</strong>, <strong>POP ULP DAMPIT_AREA45</strong>, dan hub sentral <strong>POP SHELTER GI KEBON AGUNG_AREA45</strong> dengan jalur backbone tebal (garis magenta).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsGisReferenceOpen(true)}
              className="px-3 py-1.5 bg-fuchsia-600 text-white font-bold rounded-xl hover:bg-fuchsia-700 transition-colors shadow-2xs flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Buka Gambar Asli</span>
            </button>
            <button
              onClick={() => handleFocusRegion('ALL')}
              className="px-3 py-1.5 bg-white border border-fuchsia-200 text-fuchsia-800 font-semibold rounded-xl hover:bg-fuchsia-50 transition-colors"
            >
              Semua Simpul
            </button>
          </div>
        </div>
      )}

      {/* Poros Tengah & Utara Context Banner (Gambar 2) */}
      {regionFilter === 'POROS_UTARA' && (
        <div className="bg-cyan-950/20 border border-cyan-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cyan-950 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              G2
            </span>
            <div>
              <h4 className="font-bold text-sm text-cyan-950 flex items-center gap-2">
                <span>SESUAI GAMBAR 2 · KORIDOR KOTA, BATU & SINGOSARI (AREA 45)</span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 font-mono text-[10px]">GIS MAPSOURCE</span>
              </h4>
              <p className="text-cyan-900 text-[11px] mt-0.5">
                Menampilkan <strong>BATU_AREA45</strong>, <strong>GI SENGKALING_AREA45</strong>, <strong>MULYOAGUNG_ARE</strong>, <strong>APART BEGAWAN_AREA45</strong>, <strong>DINOYO_AREA45</strong>, <strong>BLIMBING_AREA45</strong>, <strong>SINGOSARI_AREA45</strong>, <strong>UP3 MALANG_AREA45</strong>, <strong>SIDOREJO_AREA45</strong>, dan <strong>GI LAWANG_AREA45</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsGisReferenceOpen(true)}
              className="px-3 py-1.5 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors shadow-2xs flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Buka Gambar Asli</span>
            </button>
            <button
              onClick={() => handleFocusRegion('ALL')}
              className="px-3 py-1.5 bg-white border border-cyan-200 text-cyan-800 font-semibold rounded-xl hover:bg-cyan-50 transition-colors"
            >
              Semua Simpul
            </button>
          </div>
        </div>
      )}

      {/* Plan Pertama Context Banner */}
      {regionFilter === 'PLAN_PERTAMA' && (
        <div className="bg-purple-50/95 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-900 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
              0
            </span>
            <div>
              <h4 className="font-bold text-sm text-purple-950">
                PLAN PERTAMA TOPOLOGY · TITIK 0 GI KEBON AGUNG
              </h4>
              <p className="text-purple-700 text-[11px] mt-0.5">
                Super Backbone dari <strong>GI LAWANG_AREA45</strong> ke <strong>GI KEBON AGUNG_AREA45</strong> (Titik 0), mendistribusikan optik ke <strong>7 POP / ODC ULP</strong> (Kepanjen, Gondanglegi, Dampit, Sumberpucung, Kebon Agung, UP3 Malang, Sengkaling).
              </p>
            </div>
          </div>
          <button
            onClick={() => handleFocusRegion('ALL')}
            className="px-3 py-1.5 bg-white border border-purple-300 text-purple-800 font-semibold rounded-xl hover:bg-purple-100 self-start sm:self-auto shrink-0 transition-colors"
          >
            Tampilkan Semua Simpul
          </button>
        </div>
      )}

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

          {/* Referensi GIS Asli Button */}
          <button
            onClick={() => setIsGisReferenceOpen(true)}
            className="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            title="Buka Referensi Peta Asli GIS Lapangan (Screenshot PLN Icon Plus Area 45)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Referensi GIS Lapangan</span>
            <span className="sm:hidden">GIS Asli</span>
          </button>

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
                : `Jalur Aktif: [${traceStartNode.code}] → [Titik 0 GI Kebon Agung] → [${traceEndNode.code}].`}
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
      <div className="relative rounded-2xl overflow-hidden shadow-xs">
      {viewEngine === 'google' ? (
        <GoogleNetworkMapView
          nodes={filteredNodes}
          links={visibleLinks}
          cutLinks={cutLinks}
          selectedNode={selectedNode}
          selectedLink={selectedLink}
          onSelectNode={node => handleNodeClick(node)}
          onSelectLink={link => handleLinkClick(link)}
          showBackbone={showBackbone}
          showFeeder={showFeeder}
          showUplink={showUplink}
          showRing={showRing}
          interactiveMode={interactiveMode}
          traceStartNode={traceStartNode}
          traceEndNode={traceEndNode}
          traceResultPath={traceResultPath}
        />
      ) : (
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
          {/* GIS Administrative District Boundary Polygons (Orange Contours matching screenshots) */}
          <g opacity="0.85">
            {/* Sumberpucung & Lahor */}
            <polygon
              points="140,490 280,490 280,600 140,600"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Kepanjen Sentral */}
            <polygon
              points="290,470 440,470 440,600 290,600"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Gondanglegi & Pagelaran */}
            <polygon
              points="450,480 580,480 580,610 450,610"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Dampit & Tirtoyudo */}
            <polygon
              points="590,500 690,500 690,610 590,610"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Kota Batu */}
            <polygon
              points="120,70 230,70 230,190 120,190"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Dau & Sengkaling */}
            <polygon
              points="240,170 350,170 350,280 240,280"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Lowokwaru & Dinoyo */}
            <polygon
              points="360,210 490,210 490,300 360,300"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Blimbing & Pakis */}
            <polygon
              points="500,190 640,190 640,290 500,290"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Singosari Industrial */}
            <polygon
              points="510,110 650,110 650,185 510,185"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Lawang Gateway */}
            <polygon
              points="550,20 680,20 680,105 550,105"
              fill="rgba(251, 146, 60, 0.08)"
              stroke="#ea580c"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Pakisaji / GI Kebon Agung Titik 0 */}
            <polygon
              points="370,330 510,330 510,460 370,460"
              fill="rgba(192, 38, 211, 0.06)"
              stroke="#c026d3"
              strokeWidth="1.4"
            />
          </g>

          {/* Waterway (Bendungan Lahor & S. Brantas as seen in Gambar 1) */}
          <g fill="none" stroke="#0ea5e9" opacity="0.35" strokeWidth="2">
            <path d="M 130 570 Q 180 540 230 555 T 330 580" />
            <text x="140" y="585" fill="#38bdf8" fontSize="8" fontFamily="sans-serif">Bendungan Lahor</text>
            <text x="250" y="590" fill="#38bdf8" fontSize="8" fontFamily="sans-serif">S. Brantas</text>
          </g>

          {/* Geographic Region Text Labels */}
          <text x="32" y="160" fill="rgba(251, 146, 60, 0.6)" fontSize="10" fontWeight="bold">
            KOTA BATU
          </text>
          <text x="560" y="50" fill="rgba(251, 146, 60, 0.6)" fontSize="10" fontWeight="bold">
            LAWANG (SUPER BACKBONE)
          </text>
          <text x="470" y="235" fill="rgba(251, 146, 60, 0.6)" fontSize="10" fontWeight="bold">
            MALANG KOTA (CENTRAL)
          </text>
          <text x="310" y="605" fill="rgba(251, 146, 60, 0.6)" fontSize="10" fontWeight="bold">
            MALANG SELATAN (KEPANJEN &amp; GONDANGLEGI)
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
                  r={node.type === 'SUPER_BACKBONE' ? 14 : 9}
                  fill={node.id === 'NODE-GI-KBG' ? '#a855f7' : '#06b6d4'}
                  fillOpacity={isSelected || isTracedNode ? 0.6 : 0.25}
                  stroke={node.id === 'NODE-GI-KBG' ? '#c026d3' : '#0891b2'}
                  strokeWidth={isSelected || isTracedNode ? 2.5 : 1.2}
                  className="group-hover:stroke-white transition-colors"
                />

                {/* Cyan center dot matching GIS point marker */}
                <circle
                  r={node.type === 'SUPER_BACKBONE' ? 6 : 4.5}
                  fill={node.id === 'NODE-GI-KBG' ? '#7e22ce' : '#06b6d4'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* White Tag Pill with exact GIS Screenshot text label */}
                <g transform="translate(0, -22)">
                  <rect
                    x={-Math.max(48, node.code.length * 3.4)}
                    y="-9"
                    width={Math.max(96, node.code.length * 6.8)}
                    height="18"
                    rx="3"
                    fill={node.id === 'NODE-GI-KBG' ? '#581c87' : 'rgba(255, 255, 255, 0.96)'}
                    stroke={node.id === 'NODE-GI-KBG' ? '#d8b4fe' : '#94a3b8'}
                    strokeWidth="0.8"
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={node.id === 'NODE-GI-KBG' ? '#ffffff' : '#0f172a'}
                    fontSize="7.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="pointer-events-none tracking-tight select-none"
                  >
                    {node.id === 'NODE-GI-KBG' ? '★ GI-KEBONAGUNG_AREA45 (0)' : node.code}
                  </text>
                </g>

                {/* Badge if trace start or end */}
                {isTraceStart && (
                  <text x="0" y="20" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    [START]
                  </text>
                )}
                {isTraceEnd && (
                  <text x="0" y="20" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="monospace">
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
                type="button"
                onClick={() => {
                  navigateToSearchWithFilter({
                    type: 'segment',
                    id: selectedLink.id,
                    code: selectedLink.code,
                    name: selectedLink.name,
                    nodeIds: [selectedLink.fromNodeId, selectedLink.toNodeId],
                  });
                }}
                className="w-full py-2 text-xs font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                title="Filter hasil di Data Core Search berdasarkan segmen kabel ini"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Filter di Data Core Search</span>
              </button>

              <button
                type="button"
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
      )}

        {/* ================= DYNAMIC SLIDE-OUT LEGEND PANEL ================= */}
        <NetworkLegendPanel
          isOpen={isLegendOpen}
          onClose={() => setIsLegendOpen(false)}
          onToggle={() => setIsLegendOpen(prev => !prev)}
          nodes={filteredNodes}
          links={visibleLinks}
          cutLinks={cutLinks}
          activeRegion={regionFilter}
          onSelectRegion={handleFocusRegion}
          showBackbone={showBackbone}
          setShowBackbone={setShowBackbone}
          showFeeder={showFeeder}
          setShowFeeder={setShowFeeder}
          showUplink={showUplink}
          setShowUplink={setShowUplink}
          showRing={showRing}
          setShowRing={setShowRing}
        />
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
          <p className="text-[11px] text-slate-400">1 Super Backbone (Lawang) · 1 Titik 0 (Kebon Agung) · 7 POP Distribusi</p>
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

      {/* GIS Field Screenshots Reference Modal (Gambar 1 & Gambar 2) */}
      <GisReferenceModal
        isOpen={isGisReferenceOpen}
        onClose={() => setIsGisReferenceOpen(false)}
        onSelectNodeInApp={nodeId => {
          const targetNode = INITIAL_NETWORK_NODES.find(n => n.id === nodeId);
          if (targetNode) {
            setSelectedNode(targetNode);
            showToast(`Simpul terpilih: [${targetNode.code}]`, 'info');
          }
        }}
      />
        </>
      )}

    </div>
  );
};
