import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DataCoreItem, MalangRegion, CoreType, CoreStatus, NetworkNode } from '../../types';
import { INITIAL_NETWORK_NODES, INITIAL_RINGS } from '../../data/initialData';
import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  MapPin,
  FileText,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  Share2,
  RefreshCw,
  ExternalLink,
  History,
  Trash2,
  X,
  ArrowRight,
  Database,
  SlidersHorizontal,
  Network,
  Route,
  Compass,
  Check,
  Copy,
  Building,
  Server,
  Zap,
  Layers,
  ShieldCheck,
  Map,
  Workflow,
  FileSpreadsheet,
  Link2,
} from 'lucide-react';
import { resolveTopologyForHostname, doesHostnameMatchMapTarget } from '../../utils/topologySync';

const STORAGE_KEYS = [
  'recent_searches',
  'recentSearches',
  'pln_icon_recent_searches_v1',
];

const DEFAULT_RECENT_SEARCHES = [
  'GI-KEBONAGUNG_AREA45',
  'GI-LAWANG_AREA45',
  'POP ODC ULP KEPANJEN_AREA45',
  'POP UP3 MALANG_AREA45',
  'POP ODC GI SENGKALING_AREA45',
];

// BFS Shortest Path finder for Area 45 Topology
function findTopologyPath(startId: string, endId: string, nodes: NetworkNode[]): string[] {
  if (startId === endId) return [startId];
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentNode = nodes.find(n => n.id === current.id);
    if (!currentNode) continue;

    for (const neighborId of currentNode.connections) {
      if (neighborId === endId) {
        return [...current.path, neighborId];
      }
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({ id: neighborId, path: [...current.path, neighborId] });
      }
    }
  }
  return [];
}

export const DataCoreSearch: React.FC = () => {
  const {
    dataCoreList,
    feederList,
    uplinkList,
    openCoreDetail,
    setCurrentView,
    showToast,
    mapFilterTarget,
    clearMapFilter,
    navigateToMapNode,
    navigateToDrawingItem,
  } = useApp();

  // Search Engine Mode: Hostname & Drawing E2E | Data Core & OLT | Topology POP Nodes | Topology Path Tracing
  const [searchMode, setSearchMode] = useState<'drawing' | 'core' | 'pop' | 'trace'>('drawing');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRing, setSelectedRing] = useState<string>('ALL');
  const [selectedDrawingCategory, setSelectedDrawingCategory] = useState<'ALL' | 'E2E FEEDER' | 'E2E UPLINK'>('ALL');
  const [selectedDrawingStatus, setSelectedDrawingStatus] = useState<'ALL' | 'DONE' | 'PROGRESS'>('ALL');
  const [selectedDrawingPic, setSelectedDrawingPic] = useState<string>('ALL');
  const [hasKmzOnly, setHasKmzOnly] = useState(false);
  const [hasVisioOnly, setHasVisioOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Topology Path Tracing state
  const [traceOriginId, setTraceOriginId] = useState<string>('NODE-GI-KBG'); // Default: Titik 0
  const [traceTargetId, setTraceTargetId] = useState<string>('NODE-ULP-DMP'); // Default: ULP Dampit
  const [copiedCoordsId, setCopiedCoordsId] = useState<string | null>(null);

  // Synchronize trace endpoints when mapFilterTarget is active
  useEffect(() => {
    if (mapFilterTarget) {
      if (mapFilterTarget.type === 'node') {
        setTraceOriginId(mapFilterTarget.id);
      } else if (mapFilterTarget.type === 'segment' && mapFilterTarget.nodeIds && mapFilterTarget.nodeIds.length >= 2) {
        setTraceOriginId(mapFilterTarget.nodeIds[0]);
        setTraceTargetId(mapFilterTarget.nodeIds[1]);
      }
      setCurrentPage(1);
    }
  }, [mapFilterTarget]);

  // Recent Searches state persisted in localStorage (last 5 unique queries)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      for (const key of STORAGE_KEYS) {
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, 5);
          }
        }
      }
    } catch (e) {
      console.error('Error reading recent searches from localStorage', e);
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const syncToLocalStorage = (list: string[]) => {
    try {
      const slice = list.slice(0, 5);
      for (const key of STORAGE_KEYS) {
        localStorage.setItem(key, JSON.stringify(slice));
      }
    } catch (e) {
      console.error('Error saving recent searches to localStorage', e);
    }
  };

  const addRecentSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== cleanTerm.toLowerCase());
      const fifoQueue = [cleanTerm, ...filtered];
      while (fifoQueue.length > 5) {
        fifoQueue.pop();
      }
      syncToLocalStorage(fifoQueue);
      return fifoQueue;
    });
  };

  const removeRecentSearch = (termToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== termToRemove);
      syncToLocalStorage(updated);
      return updated;
    });
    showToast(`Dihapus dari pencarian terakhir: "${termToRemove}"`, 'info');
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      for (const key of STORAGE_KEYS) {
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.error('Failed to clear recent searches', err);
    }
    showToast('Seluruh riwayat pencarian terakhir telah dibersihkan', 'info');
  };

  const handleApplyRecentSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
    addRecentSearch(term);
    showToast(`Menjalankan pencarian: "${term}"`, 'info');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  const handleCopyCoords = (node: NetworkNode, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${node.lat.toFixed(6)}, ${node.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoordsId(node.id);
    showToast(`Koordinat ${node.code} disalin: ${text}`, 'info');
    setTimeout(() => setCopiedCoordsId(null), 2000);
  };

  // Filter options strictly aligned with Area 45 Topology
  const regions: MalangRegion[] = [
    'Malang Kota',
    'Kota Batu',
    'Kepanjen (Malang Selatan)',
    'Singosari (Malang Utara)',
    'Lawang',
    'Turen & Dampit',
  ];

  const types: CoreType[] = ['Uplink', 'Feeder', 'Distribution', 'Backbone'];
  const statuses: CoreStatus[] = ['Approved', 'WIG', 'In Review', 'Pending Field', 'Draft'];
  
  // 4 Area 45 Ring Loops matching INITIAL_RINGS
  const rings = [
    'RING-POROS-SELATAN-AREA45',
    'RING-POROS-BARAT-KOTA-AREA45',
    'RING-POROS-UTARA-INDUSTRI-AREA45',
    'RING-TIMUR-AGREGASI-AREA45',
  ];

  // Filter logic for Data Core
  const filteredData = useMemo(() => {
    return dataCoreList.filter(item => {
      // 1. Filter by Map Filter Target (Node ID or Segment ID from NetworkMapView)
      if (mapFilterTarget) {
        if (mapFilterTarget.type === 'node') {
          const targetNode = INITIAL_NETWORK_NODES.find(n => n.id === mapFilterTarget.id);
          const targetCodeClean = mapFilterTarget.code.toLowerCase().replace(/[^a-z0-9]/g, '');
          const popNameClean = item.popName.toLowerCase().replace(/[^a-z0-9]/g, '');
          const matchesPop =
            popNameClean.includes(targetCodeClean) ||
            targetCodeClean.includes(popNameClean) ||
            (targetNode && item.popName.toLowerCase().includes(targetNode.code.toLowerCase())) ||
            (targetNode && item.hostname.toLowerCase().includes(targetNode.code.toLowerCase()));

          if (!matchesPop) {
            return false;
          }
        } else if (mapFilterTarget.type === 'segment') {
          const nodeIds = mapFilterTarget.nodeIds || [];
          const endpointNodes = INITIAL_NETWORK_NODES.filter(n => nodeIds.includes(n.id));
          const matchesEndpoint = endpointNodes.some(n => {
            const nodeClean = n.code.toLowerCase().replace(/[^a-z0-9]/g, '');
            const popClean = item.popName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return popClean.includes(nodeClean) || nodeClean.includes(popClean);
          });
          const segCode = mapFilterTarget.code.toLowerCase();
          const matchesSegmentCode =
            item.relatedFeeder.toLowerCase().includes(segCode) ||
            item.relatedUplink.toLowerCase().includes(segCode) ||
            segCode.includes(item.relatedFeeder.toLowerCase()) ||
            segCode.includes(item.relatedUplink.toLowerCase());

          if (!matchesEndpoint && !matchesSegmentCode) {
            return false;
          }
        }
      }

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.hostname.toLowerCase().includes(q) ||
        item.oltName.toLowerCase().includes(q) ||
        item.popName.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q) ||
        item.relatedFeeder.toLowerCase().includes(q) ||
        item.relatedUplink.toLowerCase().includes(q) ||
        (item.coordinates?.address && item.coordinates.address.toLowerCase().includes(q));

      const matchRegion = selectedRegion === 'ALL' || item.region === selectedRegion;
      const matchType = selectedType === 'ALL' || item.type === selectedType;
      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchRing = selectedRing === 'ALL' || item.relatedRing === selectedRing;

      const matchKmz = !hasKmzOnly || item.documents.kmz;
      const matchVisio = !hasVisioOnly || item.documents.visio;

      return matchQuery && matchRegion && matchType && matchStatus && matchRing && matchKmz && matchVisio;
    });
  }, [
    dataCoreList,
    mapFilterTarget,
    searchQuery,
    selectedRegion,
    selectedType,
    selectedStatus,
    selectedRing,
    hasKmzOnly,
    hasVisioOnly,
  ]);

  // Filter logic for Topology POP Nodes
  const filteredPopNodes = useMemo(() => {
    return INITIAL_NETWORK_NODES.filter(node => {
      // Filter by Map Filter Target
      if (mapFilterTarget) {
        if (mapFilterTarget.type === 'node') {
          if (node.id !== mapFilterTarget.id && node.code !== mapFilterTarget.code) {
            return false;
          }
        } else if (mapFilterTarget.type === 'segment') {
          const nodeIds = mapFilterTarget.nodeIds || [];
          if (!nodeIds.includes(node.id)) {
            return false;
          }
        }
      }

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        node.name.toLowerCase().includes(q) ||
        node.code.toLowerCase().includes(q) ||
        (node.crmAssetCode && node.crmAssetCode.toLowerCase().includes(q)) ||
        (node.address && node.address.toLowerCase().includes(q)) ||
        (node.picName && node.picName.toLowerCase().includes(q)) ||
        node.region.toLowerCase().includes(q);

      const matchRegion = selectedRegion === 'ALL' || node.region === selectedRegion;
      return matchQuery && matchRegion;
    });
  }, [searchQuery, selectedRegion, mapFilterTarget]);

  // Calculate traced topology path between origin and target
  const calculatedPathIds = useMemo(() => {
    if (!traceOriginId || !traceTargetId) return [];
    return findTopologyPath(traceOriginId, traceTargetId, INITIAL_NETWORK_NODES);
  }, [traceOriginId, traceTargetId]);

  const calculatedPathNodes = useMemo(() => {
    return calculatedPathIds
      .map(id => INITIAL_NETWORK_NODES.find(n => n.id === id))
      .filter((n): n is NetworkNode => Boolean(n));
  }, [calculatedPathIds]);

  // Unified Drawing E2E rows (live-synced from feederList & uplinkList + topology)
  const unifiedDrawingRows = useMemo(() => {
    const feeders = feederList.map(f => ({
      id: f.id,
      category: 'E2E FEEDER' as const,
      hostnameOlt: f.hostnameOlt,
      statusReport: f.statusReport,
      actualDone: f.actualDone,
      reportDone: f.reportDone || '',
      pic: f.pic,
      datacoreVisio: f.datacoreVisio || '',
      datacoreVisioUrl: f.datacoreVisioUrl || '',
      mymaps: f.mymaps || '',
      mymapsUrl: f.mymapsUrl || '',
      schematicE2E: '',
      schematicE2EUrl: '',
      keterangan: f.keterangan,
      topo: resolveTopologyForHostname(f.hostnameOlt, undefined, f.keterangan),
    }));

    const uplinks = uplinkList.map(u => ({
      id: u.id,
      category: 'E2E UPLINK' as const,
      hostnameOlt: u.hostnameOlt,
      statusReport: u.statusReport,
      actualDone: u.actualDone,
      reportDone: u.reportDone || '',
      pic: u.pic,
      datacoreVisio: u.datacoreVisio || '',
      datacoreVisioUrl: u.datacoreVisioUrl || '',
      mymaps: u.mymaps || '',
      mymapsUrl: u.mymapsUrl || '',
      schematicE2E: u.schematicE2E || '',
      schematicE2EUrl: u.schematicE2EUrl || '',
      keterangan: u.keterangan,
      topo: resolveTopologyForHostname(u.hostnameOlt, u.schematicE2E, u.keterangan),
    }));

    return [...feeders, ...uplinks];
  }, [feederList, uplinkList]);

  const drawingPics = useMemo(() => {
    const set = new Set<string>();
    unifiedDrawingRows.forEach(r => r.pic && set.add(r.pic));
    return Array.from(set).sort();
  }, [unifiedDrawingRows]);

  const filteredDrawingRows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return unifiedDrawingRows.filter(row => {
      if (mapFilterTarget && !doesHostnameMatchMapTarget(row.hostnameOlt, row.schematicE2E, row.keterangan, mapFilterTarget)) {
        return false;
      }

      const matchQuery =
        !q ||
        row.hostnameOlt.toLowerCase().includes(q) ||
        row.pic.toLowerCase().includes(q) ||
        row.datacoreVisio.toLowerCase().includes(q) ||
        row.mymaps.toLowerCase().includes(q) ||
        row.schematicE2E.toLowerCase().includes(q) ||
        row.keterangan.toLowerCase().includes(q) ||
        row.topo.node.code.toLowerCase().includes(q) ||
        row.topo.node.name.toLowerCase().includes(q) ||
        row.topo.primaryRing.ringName.toLowerCase().includes(q);

      const matchCategory = selectedDrawingCategory === 'ALL' || row.category === selectedDrawingCategory;
      const matchStatus = selectedDrawingStatus === 'ALL' || row.statusReport === selectedDrawingStatus;
      const matchPic = selectedDrawingPic === 'ALL' || row.pic === selectedDrawingPic;
      const matchRing =
        selectedRing === 'ALL' ||
        row.topo.rings.some(r => r.ringName === selectedRing || r.id === selectedRing);
      const matchVisio = !hasVisioOnly || Boolean(row.datacoreVisio || row.datacoreVisioUrl);

      return matchQuery && matchCategory && matchStatus && matchPic && matchRing && matchVisio;
    });
  }, [
    unifiedDrawingRows,
    mapFilterTarget,
    searchQuery,
    selectedDrawingCategory,
    selectedDrawingStatus,
    selectedDrawingPic,
    selectedRing,
    hasVisioOnly,
  ]);

  const drawingTotalPages = Math.ceil(filteredDrawingRows.length / itemsPerPage) || 1;
  const paginatedDrawingRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrawingRows.slice(start, start + itemsPerPage);
  }, [filteredDrawingRows, currentPage]);

  // Pagination for Data Core
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('ALL');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setSelectedRing('ALL');
    setSelectedDrawingCategory('ALL');
    setSelectedDrawingStatus('ALL');
    setSelectedDrawingPic('ALL');
    setHasKmzOnly(false);
    setHasVisioOnly(false);
    clearMapFilter();
    setCurrentPage(1);
  };

  const getDrawingPicBadgeClass = (pic: string) => {
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

  const getStatusBadge = (status: CoreStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WIG':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending Field':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const HighlightedText: React.FC<{ text: string; query: string; className?: string }> = ({
    text,
    query,
    className = '',
  }) => {
    if (!query || !query.trim() || !text) {
      return <span className={className}>{text}</span>;
    }
    const cleanTokens = query
      .trim()
      .split(/\s+/)
      .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter(Boolean);

    if (cleanTokens.length === 0) {
      return <span className={className}>{text}</span>;
    }

    try {
      const regex = new RegExp(`(${cleanTokens.join('|')})`, 'gi');
      const parts = text.split(regex);
      return (
        <span className={className}>
          {parts.map((part, idx) => {
            const isMatch = cleanTokens.some(
              token => token.toLowerCase() === part.toLowerCase()
            );
            return isMatch ? (
              <mark
                key={idx}
                className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-bold border-b border-amber-300 inline-block"
              >
                {part}
              </mark>
            ) : (
              <React.Fragment key={idx}>{part}</React.Fragment>
            );
          })}
        </span>
      );
    } catch {
      return <span className={className}>{text}</span>;
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* ================= 1. SEARCH ENGINE HEADER BANNER ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
              <Network className="w-4 h-4 text-blue-600" />
              <span>SEARCH ENGINE TERPADU · AREA 45 MALANG RAYA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Data Core &amp; Topology Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pencarian presisi data core, OLT, dan 16 simpul POP Area 45 yang terintegrasi 100% dengan topologi GIS &amp; sistem ring loop.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setCurrentView('network-map')}
              className="px-3.5 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Buka Peta Topologi</span>
            </button>
          </div>
        </div>

        {/* Big Search Bar with Form Submit */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                addRecentSearch(searchQuery.trim());
              }
            }}
            placeholder="🔍 Cari Hostname, OLT, POP Area 45 (cth: KEBON AGUNG, LAWANG, KEPANJEN, DAMPIT, CORE-MLG)..."
            className="w-full pl-12 pr-32 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 transition-all font-sans"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-200/60 rounded-md transition-colors"
              >
                Hapus
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <span>Cari</span>
            </button>
          </div>
        </form>

        {/* Search Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setSearchMode('drawing');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              searchMode === 'drawing'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Hostname &amp; Drawing E2E</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${searchMode === 'drawing' ? 'bg-blue-500/50 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {filteredDrawingRows.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchMode('core');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              searchMode === 'core'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Katalog Data Core &amp; OLT</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${searchMode === 'core' ? 'bg-blue-500/50 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {filteredData.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode('pop')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              searchMode === 'pop'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Simpul POP Area 45</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${searchMode === 'pop' ? 'bg-blue-500/50 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {filteredPopNodes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode('trace')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              searchMode === 'trace'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Trace Jalur Antar-POP Topologi</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-100 text-purple-800 font-bold">
              Loss Budget
            </span>
          </button>
        </div>
      </div>

      {/* ================= 1.5 ACTIVE MAP FILTER BANNER ================= */}
      {mapFilterTarget && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 border-2 border-blue-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              {mapFilterTarget.type === 'node' ? <MapPin className="w-5 h-5" /> : <Route className="w-5 h-5" />}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white tracking-wider">
                  FILTER AKTIF DARI PETA: {mapFilterTarget.type === 'node' ? 'SIMPUL POP' : 'SEGMEN KABEL'}
                </span>
                <span className="text-xs font-mono font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300">
                  {mapFilterTarget.code}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  [ID: {mapFilterTarget.id}]
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {mapFilterTarget.name}
              </p>
              <p className="text-[11px] text-slate-600">
                Menampilkan hanya data core, OLT, simpul, dan dokumen teknis yang terikat dengan{' '}
                <strong className="text-blue-800 font-semibold">{mapFilterTarget.code}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-blue-200/60 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setCurrentView('network-map')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Kembali ke tampilan Network Map"
            >
              <Map className="w-3.5 h-3.5 text-blue-600" />
              <span>Kembali ke Peta</span>
            </button>

            <button
              type="button"
              onClick={clearMapFilter}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:text-white bg-white hover:bg-rose-600 border border-rose-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Hapus filter simpul/segmen dan tampilkan semua data kembali"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hapus Filter</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= 2. MAIN TWO-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT SIDEBAR (FILTERS & SUGGESTIONS) ================= */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          
          {/* Card 0: Active Map Filter Indicator in Sidebar */}
          {mapFilterTarget && (
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 text-xs space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  Filter Peta Terpasang
                </span>
                <button
                  type="button"
                  onClick={clearMapFilter}
                  className="text-[10px] text-rose-600 hover:underline font-bold"
                >
                  Hapus
                </button>
              </div>
              <div className="p-2 bg-white rounded-xl border border-blue-100 font-mono text-[11px] text-blue-900 font-semibold truncate">
                {mapFilterTarget.code}
              </div>
              <span className="text-[10px] text-slate-500 block">
                ID: {mapFilterTarget.id} ({mapFilterTarget.type.toUpperCase()})
              </span>
            </div>
          )}

          {/* Card 1: Recent Searches */}
          <div 
            data-testid="recent-searches"
            className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recent Searches
                </h3>
              </div>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  data-testid="clear-history-button"
                  onClick={clearAllRecentSearches}
                  className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  title="Clear Recent Searches History"
                  aria-label="Clear History"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {recentSearches.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                <span>Belum ada riwayat pencarian</span>
              </div>
            ) : (
              <div className="space-y-1.5" role="group" aria-label="Recent Searches">
                {recentSearches.map((term, index) => {
                  const isCurrentActive = searchQuery.toLowerCase().trim() === term.toLowerCase().trim();
                  return (
                    <div
                      key={`${term}-${index}`}
                      className="flex items-center gap-1 group"
                    >
                      <button
                        type="button"
                        data-testid="recent-search-button"
                        onClick={() => handleApplyRecentSearch(term)}
                        className={`flex-1 flex items-center justify-between p-2 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          isCurrentActive
                            ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                        title={`Cari langsung "${term}"`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Search className={`w-3.5 h-3.5 shrink-0 ${isCurrentActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                          <span className="truncate font-mono text-[11px]">
                            {term}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(term, e)}
                        className="p-2 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                        title={`Hapus "${term}" dari riwayat`}
                        aria-label={`Hapus ${term}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 2: Topology Quick Nodes (Matching Area 45 Structure) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Compass className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Simpul Topologi Area 45
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pintasan pencarian cepat untuk simpul strategis topologi Area 45:
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: '★ GI Kebon Agung (Titik 0)', query: 'GI-KEBONAGUNG_AREA45', badge: 'Titik 0' },
                { label: 'GI Lawang (Super Backbone)', query: 'GI-LAWANG_AREA45', badge: 'Origin' },
                { label: 'ODC ULP Kepanjen', query: 'POP ODC ULP KEPANJEN_AREA45', badge: 'Selatan' },
                { label: 'ODC ULP Sumberpucung', query: 'POP ODC ULP SUMBERPUCUNG_AREA45', badge: 'Lahor' },
                { label: 'ODC ULP Gondanglegi', query: 'POP ODC ULP GONDANGLEGI_AREA45', badge: 'Selatan' },
                { label: 'POP ULP Dampit', query: 'POP ULP DAMPIT_AREA45', badge: 'Dampit' },
                { label: 'POP UP3 Malang (Klojen)', query: 'POP UP3 MALANG_AREA45', badge: 'Kota' },
                { label: 'ODC ULP Batu', query: 'POP ODC ULP BATU_AREA45', badge: 'Batu' },
                { label: 'ODC GI Sengkaling', query: 'POP ODC GI SENGKALING_AREA45', badge: 'Dau' },
                { label: 'ODC ULP Blimbing', query: 'PLN ODC ULP BLIMBING_AREA45', badge: 'Blimbing' },
                { label: 'ODC ULP Singosari', query: 'POP ODC ULP SINGOSARI_AREA45', badge: 'KEK' },
              ].map(node => (
                <button
                  key={node.query}
                  type="button"
                  onClick={() => handleApplyRecentSearch(node.query)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs transition-colors group"
                >
                  <span className="font-semibold text-slate-800 group-hover:text-blue-600 truncate text-[11px]">
                    {node.label}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 ml-1 shrink-0">
                    {node.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Ring Loops Filter (Area 45 Standards) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Filter Ring Proteksi
              </h3>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                Jalur Ring Loop Area 45
              </label>
              <select
                value={selectedRing}
                onChange={e => {
                  setSelectedRing(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500"
              >
                <option value="ALL">Semua 4 Ring Loop</option>
                {rings.map(rg => (
                  <option key={rg} value={rg}>
                    {rg}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="block text-[10px] font-mono uppercase text-slate-500">
                Dokumen Drawing Data:
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasKmzOnly}
                  onChange={e => {
                    setHasKmzOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <span>Hanya yang memiliki KMZ Geospasial</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVisioOnly}
                  onChange={e => {
                    setHasVisioOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <span>Hanya yang memiliki Visio SLD</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full mt-2 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>

        </aside>

        {/* ================= RIGHT MAIN RESULTS AREA ================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">

          {/* ================= MODE 0: HOSTNAME & DRAWING E2E (3-WAY SYNC) ================= */}
          {searchMode === 'drawing' && (
            <div className="space-y-4">
              {/* Filter Bar (Kategori E2E, Status Report, PIC) + View Toggle */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="min-w-[140px]">
                    <select
                      value={selectedDrawingCategory}
                      onChange={e => {
                        setSelectedDrawingCategory(e.target.value as 'ALL' | 'E2E FEEDER' | 'E2E UPLINK');
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                    >
                      <option value="ALL">Semua Kategori E2E</option>
                      <option value="E2E FEEDER">E2E FEEDER ({feederList.length})</option>
                      <option value="E2E UPLINK">E2E UPLINK ({uplinkList.length})</option>
                    </select>
                  </div>

                  <div className="min-w-[125px]">
                    <select
                      value={selectedDrawingStatus}
                      onChange={e => {
                        setSelectedDrawingStatus(e.target.value as 'ALL' | 'DONE' | 'PROGRESS');
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="ALL">Semua Status</option>
                      <option value="DONE">DONE</option>
                      <option value="PROGRESS">PROGRESS</option>
                    </select>
                  </div>

                  <div className="min-w-[120px]">
                    <select
                      value={selectedDrawingPic}
                      onChange={e => {
                        setSelectedDrawingPic(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="ALL">Semua PIC</option>
                      {drawingPics.map(pic => (
                        <option key={pic} value={pic}>
                          {pic}
                        </option>
                      ))}
                    </select>
                  </div>

                  {searchQuery && (
                    <span className="text-slate-500 text-xs flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      <span>Kueri:</span>
                      <strong className="text-blue-700 font-mono font-semibold">"{searchQuery}"</strong>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="hover:text-rose-600 ml-1 font-bold"
                        title="Hapus filter kata kunci"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                {/* View Switcher Buttons */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px] hidden sm:inline">
                    Menampilkan {paginatedDrawingRows.length} dari {filteredDrawingRows.length} Hostname OLT
                  </span>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Tampilan Tabel Drawing"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('card')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === 'card' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Tampilan Kartu"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawing E2E Results */}
              {filteredDrawingRows.length === 0 ? (
                <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-xs">
                  <Search className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Tidak ada Hostname Drawing E2E yang cocok</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Coba ubah filter kategori, status DONE/PROGRESS, atau hapus filter peta aktif.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : viewMode === 'table' ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                  <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-blue-600" />
                      <h2 className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-900 uppercase">
                        DATA DRAWING E2E TERINTEGRASI (FEEDER &amp; UPLINK)
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Sinkron real-time · Drawing Data ↔ Search ↔ Ring Map
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-300">
                        <tr>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Hostname OLT</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Kategori</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Status Report</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Actual Done</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">Report Done</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap text-center">PIC</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">DATACORE VISIO</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">MYMAPS</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Schematic E2E</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Ring &amp; POP Topologi</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Keterangan</th>
                          <th className="py-2.5 px-3 whitespace-nowrap text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {paginatedDrawingRows.map(row => (
                          <tr key={`${row.category}-${row.id}`} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] font-medium text-slate-900 whitespace-nowrap">
                              <HighlightedText text={row.hostnameOlt} query={searchQuery} />
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                                  row.category === 'E2E FEEDER'
                                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}
                              >
                                {row.category}
                              </span>
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                  row.statusReport === 'DONE'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-amber-200 text-amber-900'
                                }`}
                              >
                                {row.statusReport}
                              </span>
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px] tabular-nums whitespace-nowrap">
                              {row.actualDone || '-'}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px] tabular-nums whitespace-nowrap text-slate-600">
                              {row.reportDone || '-'}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getDrawingPicBadgeClass(
                                  row.pic
                                )}`}
                              >
                                {row.pic}
                              </span>
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 max-w-[180px] truncate">
                              {row.datacoreVisioUrl ? (
                                <a
                                  href={row.datacoreVisioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[11px] text-blue-700 hover:text-blue-900 font-medium underline truncate max-w-full"
                                  title={row.datacoreVisioUrl}
                                >
                                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate">{row.datacoreVisio || 'Buka Link Visio'}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              ) : row.datacoreVisio ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 font-medium truncate max-w-full">
                                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="truncate">{row.datacoreVisio}</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Belum ada link</span>
                              )}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                              {row.mymapsUrl ? (
                                <a
                                  href={row.mymapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline"
                                  title={row.mymapsUrl}
                                >
                                  <span>{row.mymaps || 'Buka MyMaps'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : row.mymaps ? (
                                <span className="text-[11px] font-semibold text-blue-700">
                                  {row.mymaps}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Belum ada link</span>
                              )}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 max-w-[200px] truncate">
                              {row.schematicE2EUrl ? (
                                <a
                                  href={row.schematicE2EUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[11px] text-rose-700 hover:text-rose-900 font-medium underline truncate max-w-full"
                                  title={row.schematicE2EUrl}
                                >
                                  <span className="px-1 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold shrink-0">
                                    PDF
                                  </span>
                                  <span className="truncate">{row.schematicE2E || 'Buka Schematic'}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              ) : row.schematicE2E ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 font-medium truncate max-w-full">
                                  <span className="px-1 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold shrink-0">
                                    PDF
                                  </span>
                                  <span className="truncate">{row.schematicE2E}</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => navigateToMapNode(row.topo.node.id)}
                                className="inline-flex flex-col text-left px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                                title={`Fokus ke ${row.topo.node.name} di Network & Ring Map`}
                              >
                                <span className="text-[10px] font-mono font-bold text-blue-700 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  {row.topo.node.code.replace('_AREA45', '')}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {row.topo.primaryRing.id}
                                </span>
                              </button>
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-700 max-w-[220px] truncate" title={row.keterangan}>
                              {row.keterangan || '-'}
                            </td>
                            <td className="py-2 px-3 text-center whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => navigateToMapNode(row.topo.node.id)}
                                  className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Lihat POP & Ring di Peta Topologi"
                                >
                                  <MapPin className="w-3 h-3" />
                                  <span>Peta</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigateToDrawingItem(
                                      row.category === 'E2E FEEDER' ? 'feeder' : 'uplink',
                                      row.hostnameOlt
                                    )
                                  }
                                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white border border-slate-200 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Buka & Edit di Drawing Data"
                                >
                                  <Workflow className="w-3 h-3" />
                                  <span>Drawing</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paginatedDrawingRows.map(row => (
                    <div
                      key={`${row.category}-${row.id}`}
                      className="bg-white border border-slate-200/80 hover:border-blue-400/60 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                                  row.category === 'E2E FEEDER'
                                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}
                              >
                                {row.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getDrawingPicBadgeClass(
                                  row.pic
                                )}`}
                              >
                                {row.pic}
                              </span>
                            </div>
                            <h3 className="text-xs sm:text-sm font-mono font-bold text-slate-900 break-all">
                              <HighlightedText text={row.hostnameOlt} query={searchQuery} />
                            </h3>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                              row.statusReport === 'DONE'
                                ? 'bg-emerald-700 text-white'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {row.statusReport}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Actual Done</span>
                            <span className="font-mono font-semibold text-slate-800">{row.actualDone || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Report Done</span>
                            <span className="font-mono font-semibold text-slate-800">{row.reportDone || '-'}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold">
                            <MapPin className="w-3 h-3" />
                            {row.topo.node.code.replace('_AREA45', '')}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-mono font-semibold">
                            {row.topo.primaryRing.ringName}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] pt-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            {row.datacoreVisioUrl ? (
                              <a
                                href={row.datacoreVisioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:underline font-medium truncate"
                              >
                                {row.datacoreVisio || 'Buka Link Visio'}
                              </a>
                            ) : (
                              <span className="text-slate-600 truncate">
                                Visio: {row.datacoreVisio || 'Belum ada link'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Link2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {row.mymapsUrl ? (
                              <a
                                href={row.mymapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:underline font-medium truncate"
                              >
                                {row.mymaps || 'Buka MyMaps'}
                              </a>
                            ) : (
                              <span className="text-slate-600 truncate">
                                MyMaps: {row.mymaps || 'Belum ada link'}
                              </span>
                            )}
                          </div>
                        </div>

                        {row.keterangan && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                            {row.keterangan}
                          </p>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigateToMapNode(row.topo.node.id)}
                          className="flex-1 py-1.5 text-[11px] font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Lihat di Ring Map</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigateToDrawingItem(
                              row.category === 'E2E FEEDER' ? 'feeder' : 'uplink',
                              row.hostnameOlt
                            )
                          }
                          className="flex-1 py-1.5 text-[11px] font-bold text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Workflow className="w-3.5 h-3.5" />
                          <span>Buka di Drawing</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Footer for Drawing E2E */}
              {drawingTotalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-500 shadow-xs">
                  <span>
                    Halaman {currentPage} dari {drawingTotalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 hover:bg-slate-100 text-slate-700"
                    >
                      Sebelumnya
                    </button>
                    {Array.from({ length: drawingTotalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold ${
                          currentPage === p
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage === drawingTotalPages}
                      onClick={() => setCurrentPage(p => Math.min(drawingTotalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 hover:bg-slate-100 text-slate-700"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= MODE 1: DATA CORE & OLT ASSETS ================= */}
          {searchMode === 'core' && (
            <div className="space-y-4">
              {/* Filter Bar (Wilayah, Jenis, Status) + View Toggle */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="min-w-[130px]">
                    <select
                      value={selectedRegion}
                      onChange={e => {
                        setSelectedRegion(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="ALL">Semua Wilayah</option>
                      {regions.map(r => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-[110px]">
                    <select
                      value={selectedType}
                      onChange={e => {
                        setSelectedType(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="ALL">Semua Jenis</option>
                      {types.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-[120px]">
                    <select
                      value={selectedStatus}
                      onChange={e => {
                        setSelectedStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="ALL">Semua Status</option>
                      {statuses.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {searchQuery && (
                    <span className="text-slate-500 text-xs flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      <span>Kueri:</span>
                      <strong className="text-blue-700 font-mono font-semibold">"{searchQuery}"</strong>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="hover:text-rose-600 ml-1 font-bold"
                        title="Hapus filter kata kunci"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                {/* View Switcher Buttons */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px] hidden sm:inline">
                    Menampilkan {paginatedData.length} dari {filteredData.length} data
                  </span>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setViewMode('card')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === 'card' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Tampilan Kartu"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Tampilan Tabel"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              {filteredData.length === 0 ? (
                <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-xs">
                  <Search className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Tidak ada data core yang cocok</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Coba gunakan kata kunci pencarian yang lebih umum atau pilih salah satu kata kunci di panel <strong>Recent Searches</strong> di samping.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : viewMode === 'card' ? (
                /* CARD VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedData.map(core => {
                    const isTitik0 = core.popName === 'GI-KEBONAGUNG_AREA45';

                    return (
                      <div
                        key={core.id}
                        className={`bg-white border rounded-2xl p-4 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md ${
                          isTitik0 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200/80 hover:border-blue-400/60'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Header: Hostname & Status */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  addRecentSearch(core.id);
                                  setSearchQuery(core.id);
                                }}
                                className="text-[10px] font-mono text-blue-600 hover:underline font-bold block text-left"
                                title="Klik untuk memfilter ID ini"
                              >
                                <HighlightedText text={core.id} query={searchQuery} />
                              </button>
                              <h3 
                                onClick={() => {
                                  addRecentSearch(core.hostname);
                                  openCoreDetail(core);
                                }}
                                className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5 leading-snug cursor-pointer"
                              >
                                <HighlightedText text={core.hostname} query={searchQuery} />
                              </h3>
                            </div>
                            <span
                              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${getStatusBadge(
                                core.status
                              )}`}
                            >
                              {core.status}
                            </span>
                          </div>

                          {/* Sub info */}
                          <div className="space-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-700">
                                <HighlightedText text={core.type} query={searchQuery} />
                              </span>
                              <span>·</span>
                              <span className="truncate">
                                <HighlightedText text={core.region} query={searchQuery} />
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-mono font-bold truncate">
                              POP:{' '}
                              <span className={isTitik0 ? 'text-purple-700 font-extrabold' : 'text-slate-800'}>
                                <HighlightedText text={core.popName} query={searchQuery} />
                              </span>
                            </p>
                          </div>

                          {/* Coordinates pill */}
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
                              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                              <span>{core.coordinates.lat.toFixed(6)}, {core.coordinates.lng.toFixed(6)}</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-mono font-bold">
                              {core.attenuationDbm} dBm
                            </span>
                          </div>

                          {/* Core Capacity Gauge */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Kapasitas Core</span>
                              <span className="font-mono text-slate-800 font-bold tabular-nums">
                                {core.coreUsed} / {core.coreCapacity} Core
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${(core.coreUsed / core.coreCapacity) * 100}%` }}
                                className="h-full bg-blue-600 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Documents Checklist Badges */}
                          <div className="pt-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono">
                              <span className={`px-1.5 py-0.5 rounded border ${core.documents.kmz ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                KMZ{core.documents.kmz ? '✓' : '✗'}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded border ${core.documents.visio ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                VSD{core.documents.visio ? '✓' : '✗'}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded border ${core.documents.gdb ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                GDB{core.documents.gdb ? '✓' : '✗'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              addRecentSearch(core.hostname);
                              openCoreDetail(core);
                            }}
                            className="flex-1 py-1.5 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Buka Detail</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TABLE VIEW */
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-4">ID &amp; Hostname</th>
                          <th className="py-3.5 px-4">POP Standar Area 45</th>
                          <th className="py-3.5 px-4">Wilayah &amp; Ring</th>
                          <th className="py-3.5 px-4">Jenis</th>
                          <th className="py-3.5 px-4">Kapasitas Core</th>
                          <th className="py-3.5 px-4">Dokumen</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {paginatedData.map(core => (
                          <tr key={core.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-[10px] text-blue-600 font-bold block">
                                {core.id}
                              </span>
                              <span className="font-bold text-slate-900 block">
                                {core.hostname}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-slate-900 font-bold block">
                                {core.popName}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {core.coordinates.lat.toFixed(6)}, {core.coordinates.lng.toFixed(6)}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-800 block">{core.region}</span>
                              <span className="text-[10px] font-mono text-blue-600 block">{core.relatedRing}</span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800">
                              {core.type}
                            </td>
                            <td className="py-3.5 px-4 font-mono tabular-nums">
                              {core.coreUsed} / {core.coreCapacity} Core
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[10px]">
                              <span className={core.documents.kmz ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                                KMZ{core.documents.kmz ? '✓' : '✗'}
                              </span>{' '}
                              <span className={core.documents.visio ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                                VSD{core.documents.visio ? '✓' : '✗'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border inline-block ${getStatusBadge(core.status)}`}>
                                {core.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => openCoreDetail(core)}
                                className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors shadow-xs"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-500 shadow-xs">
                  <span>
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 hover:bg-slate-100 text-slate-700"
                    >
                      Sebelumnya
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold ${
                          currentPage === p
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 hover:bg-slate-100 text-slate-700"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= MODE 2: TOPOLOGY POP NODES ================= */}
          {searchMode === 'pop' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between text-xs shadow-xs">
                <span className="font-semibold text-slate-700">
                  Ditemukan <strong>{filteredPopNodes.length}</strong> simpul POP Area 45
                </span>
                <button
                  onClick={() => setCurrentView('network-map')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Buka di Network &amp; Ring Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPopNodes.map(node => {
                  const isTitik0 = node.id === 'NODE-GI-KBG';
                  const isCopied = copiedCoordsId === node.id;
                  const utilPercent = Math.round((node.usedCores / node.capacityCores) * 100);

                  return (
                    <div
                      key={node.id}
                      className={`bg-white border rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all space-y-3 ${
                        isTitik0 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {node.crmAssetCode || node.code.split('_')[0]}
                            </span>
                            {isTitik0 && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-mono">
                                ★ TITIK 0
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                            {node.name}
                          </h3>
                          <span className="text-xs text-slate-500">{node.region}</span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          node.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
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
                          onClick={e => handleCopyCoords(node, e)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {node.address}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {node.picAvatar && (
                            <img src={node.picAvatar} alt="PIC" className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0" />
                          )}
                          <span className="font-medium text-slate-700 text-[11px] truncate">{node.picName?.split('(')[0] || 'Tim Asset'}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-blue-600">
                            {node.usedCores} / {node.capacityCores} C ({utilPercent}%)
                          </span>
                          <button
                            type="button"
                            onClick={() => navigateToMapNode(node.id)}
                            className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Peta</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= MODE 3: TRACE JALUR TOPOLOGI & LOSS BUDGET ================= */}
          {searchMode === 'trace' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider block">
                    PENCARIAN JALUR KABEL OPTIK ANTAR-SIMPUL
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Topology Path Tracer &amp; Link Loss Budget
                  </h3>
                </div>

                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl">
                  {calculatedPathNodes.length} Simpul Hop
                </span>
              </div>

              {/* Selector Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Simpul Asal (Origin POP):
                  </label>
                  <select
                    value={traceOriginId}
                    onChange={e => setTraceOriginId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    {INITIAL_NETWORK_NODES.map(n => (
                      <option key={`orig-${n.id}`} value={n.id}>
                        {n.code} ({n.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Simpul Tujuan (Destination POP):
                  </label>
                  <select
                    value={traceTargetId}
                    onChange={e => setTraceTargetId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    {INITIAL_NETWORK_NODES.map(n => (
                      <option key={`dest-${n.id}`} value={n.id}>
                        {n.code} ({n.region})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Traced Route Hop-by-Hop Visualizer */}
              {calculatedPathNodes.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  Tidak ditemukan jalur interkoneksi langsung antara kedua simpul yang dipilih.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                      Rute Transmisi Optik Aktif:
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {calculatedPathNodes.map((n, idx) => (
                        <React.Fragment key={`hop-${n.id}`}>
                          <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <div className="flex flex-col">
                              <span className="text-xs font-mono font-bold text-white">
                                {n.code}
                              </span>
                              <span className="text-[9px] text-slate-400 font-sans">
                                {n.region}
                              </span>
                            </div>
                          </div>
                          {idx < calculatedPathNodes.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-magenta-400 text-[#ff00ea] shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Hop</span>
                        <span className="font-mono font-bold text-cyan-400 text-base">
                          {calculatedPathNodes.length - 1} Link
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Estimasi Redaman</span>
                        <span className="font-mono font-bold text-emerald-400 text-base">
                          -{(14.2 + (calculatedPathNodes.length - 1) * 1.4).toFixed(1)} dBm
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Proteksi Failover</span>
                        <span className="font-mono font-bold text-white text-base">
                          Auto Ring Loop
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Ketersediaan SLA</span>
                        <span className="font-mono font-bold text-emerald-400 text-base">
                          99.98%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Rute ini dapat disimulasikan dan diuji potong kabel (cut simulation) di Network Map.
                    </p>
                    <button
                      onClick={() => setCurrentView('network-map')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Lihat Rute di Peta Topologi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
