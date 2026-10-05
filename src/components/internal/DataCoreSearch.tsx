import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DataCoreItem, MalangRegion, CoreType, CoreStatus } from '../../types';
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
} from 'lucide-react';

const STORAGE_KEYS = [
  'recent_searches',
  'recentSearches',
  'pln_icon_recent_searches_v1',
];

const DEFAULT_RECENT_SEARCHES = [
  'OLT-MALANG-KLOJEN-01',
  'CORE-MLG-002',
  'OLT-BATU-PUSAT-01',
  'CORE-MLG-006',
  'POP-MALANG-SUHAT',
];

export const DataCoreSearch: React.FC = () => {
  const { dataCoreList, openCoreDetail, setCurrentView, showToast } = useApp();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRing, setSelectedRing] = useState<string>('ALL');
  const [hasKmzOnly, setHasKmzOnly] = useState(false);
  const [hasVisioOnly, setHasVisioOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Recent Searches state persisted in localStorage (last 5 unique queries)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      for (const key of STORAGE_KEYS) {
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const unique: string[] = [];
            for (const item of parsed) {
              if (typeof item === 'string' && item.trim() && !unique.some(u => u.toLowerCase() === item.trim().toLowerCase())) {
                unique.push(item.trim());
              }
              if (unique.length >= 5) break;
            }
            if (unique.length > 0) return unique;
          }
        }
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  // Sync to all compatible localStorage keys
  const syncToLocalStorage = (items: string[]) => {
    try {
      const payload = JSON.stringify(items);
      for (const key of STORAGE_KEYS) {
        localStorage.setItem(key, payload);
      }
    } catch (err) {
      console.error('Failed to save recent searches to localStorage', err);
    }
  };

  // Save recent search helper (enforces strict FIFO logic limited to 5 unique search queries)
  const addRecentSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm || cleanTerm.length < 2) return;

    setRecentSearches(prev => {
      // Remove any existing case-insensitive duplicate so it gets refreshed to the front
      const filtered = prev.filter(item => item.toLowerCase() !== cleanTerm.toLowerCase());
      // FIFO eviction: Prepend the newest query; if exceeding 5 items, the oldest element at the end is evicted
      const fifoQueue = [cleanTerm, ...filtered];
      while (fifoQueue.length > 5) {
        fifoQueue.pop(); // Evict oldest entry (FIFO)
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

  // Immediately triggers a search when clicked
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

  // Filter options
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
  const rings = ['RING-INNER-MALANG', 'RING-MALANG-BATU', 'RING-POROS-SELATAN', 'RING-METRO-UTARA'];

  // Filter logic
  const filteredData = useMemo(() => {
    return dataCoreList.filter(item => {
      // Query match
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
        item.relatedUplink.toLowerCase().includes(q);

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
    searchQuery,
    selectedRegion,
    selectedType,
    selectedStatus,
    selectedRing,
    hasKmzOnly,
    hasVisioOnly,
  ]);

  // Pagination
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
    setHasKmzOnly(false);
    setHasVisioOnly(false);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: CoreStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80';
      case 'WIG':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/80';
      case 'In Review':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80';
      case 'Pending Field':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/80';
      case 'Draft':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-widest">
              MESIN PENCARI UTAMA ASSET
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Data Core Search Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Temukan data core, OLT, POP, feeder, dan uplink di seluruh wilayah kerja Malang Raya
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Ditemukan: <strong className="text-sky-300 font-bold tabular-nums">{filteredData.length}</strong> data
            </span>
          </div>
        </div>

        {/* Big Search Bar with Form Submit to Capture Recent Searches */}
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
            placeholder="🔍 Cari Hostname / OLT / POP / Area / ID / PIC (cth: KLOJEN, OLT-BATU, CORE-MLG-001)..."
            className="w-full pl-12 pr-32 py-3.5 bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-sans"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-md"
              >
                Hapus
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Cari</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Two-Column Layout: Search Sidebar (Left) + Search Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= DATA CORE SEARCH SIDEBAR ================= */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          
          {/* Card 1: Recent Searches (Fitur Utama Sidebar) */}
          <div 
            data-testid="recent-searches"
            className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Recent Searches
                </h3>
              </div>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  data-testid="clear-history-button"
                  onClick={clearAllRecentSearches}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  title="Clear Recent Searches History"
                  aria-label="Clear History"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Maksimal 5 kueri terakhir tersimpan (antrean FIFO di localStorage):
            </p>

            {recentSearches.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <Clock className="w-4 h-4 mx-auto mb-1 text-slate-600" />
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
                            ? 'bg-blue-950/70 border-blue-500 text-sky-300 font-semibold shadow-sm ring-1 ring-blue-500/40'
                            : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                        }`}
                        title={`Cari langsung "${term}"`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Search className={`w-3.5 h-3.5 shrink-0 ${isCurrentActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-400'}`} />
                          <span className="truncate font-mono text-[11px]">
                            {term}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 group-hover:text-sky-400 font-sans ml-1 shrink-0 flex items-center gap-0.5">
                          <span>Pilih</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(term, e)}
                        className="p-2 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-900 text-slate-500 hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
                        title={`Hapus "${term}" dari riwayat`}
                        aria-label={`Hapus ${term}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Additional prominent Clear History action button */}
                <button
                  type="button"
                  data-testid="clear-history-action-button"
                  onClick={clearAllRecentSearches}
                  className="w-full mt-2 py-1.5 px-3 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Tersimpan di localStorage</span>
              <span className="font-mono">{recentSearches.length}/5 slot</span>
            </div>
          </div>

          {/* Card 2: Quick Hostname & Core Suggestions */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pintasan Simpul Cepat
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Klik untuk langsung memfilter data node strategis Malang Raya:
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Klojen Hub', query: 'OLT-MALANG-KLOJEN-01', region: 'Malang Kota' },
                { label: 'Blimbing Ind.', query: 'OLT-MALANG-BLIMBING-01', region: 'Malang Kota' },
                { label: 'Batu Pusat', query: 'OLT-BATU-PUSAT-01', region: 'Kota Batu' },
                { label: 'Kepanjen Pemkab', query: 'OLT-KEPANJEN-PUSAT-01', region: 'Kepanjen' },
                { label: 'Singosari KEK', query: 'OLT-SINGOSARI-IND-01', region: 'Singosari' },
              ].map(node => (
                <button
                  key={node.query}
                  type="button"
                  onClick={() => handleApplyRecentSearch(node.query)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left text-xs transition-colors group"
                >
                  <span className="font-mono text-slate-300 group-hover:text-white truncate">
                    {node.query}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans ml-2 shrink-0">
                    {node.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Ring & Document Filters in Sidebar */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Filter Tambahan
              </h3>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                Jalur Proteksi Ring
              </label>
              <select
                value={selectedRing}
                onChange={e => {
                  setSelectedRing(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="ALL">Semua Jalur Ring</option>
                {rings.map(rg => (
                  <option key={rg} value={rg}>
                    {rg}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-800">
              <span className="block text-[10px] font-mono uppercase text-slate-400">
                Filter Dokumen Wajib:
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasKmzOnly}
                  onChange={e => {
                    setHasKmzOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                />
                <span>Hanya yang memiliki KMZ GIS</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVisioOnly}
                  onChange={e => {
                    setHasVisioOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                />
                <span>Hanya yang memiliki Visio SLD</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full mt-2 py-1.5 px-3 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>

        </aside>

        {/* ================= MAIN SEARCH & RESULTS CONTENT ================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          
          {/* Filter Bar (Wilayah, Jenis, Status) + View Toggle */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Wilayah */}
              <div className="min-w-[130px]">
                <select
                  value={selectedRegion}
                  onChange={e => {
                    setSelectedRegion(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                >
                  <option value="ALL">Semua Wilayah</option>
                  {regions.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jenis Data */}
              <div className="min-w-[110px]">
                <select
                  value={selectedType}
                  onChange={e => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                >
                  <option value="ALL">Semua Jenis</option>
                  {types.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="min-w-[120px]">
                <select
                  value={selectedStatus}
                  onChange={e => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
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
                <span className="text-slate-400 text-xs flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  <span>Kata kunci:</span>
                  <strong className="text-sky-300 font-mono font-semibold">"{searchQuery}"</strong>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-rose-400 ml-1"
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

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'card' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tampilan Kartu"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
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
            <div className="p-12 text-center bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Tidak ada data core yang cocok</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian yang lebih umum atau pilih salah satu kata kunci di panel <strong>Recent Searches</strong> di samping.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-sky-400 bg-sky-950/50 border border-sky-800 rounded-lg hover:bg-sky-900/60 transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : viewMode === 'card' ? (
            /* CARD VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedData.map(core => (
                <div
                  key={core.id}
                  className="bg-slate-950/90 border border-slate-800 hover:border-sky-500/60 rounded-xl p-4 transition-all flex flex-col justify-between group shadow-sm"
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
                          className="text-[10px] font-mono text-sky-400 hover:underline font-bold block text-left"
                          title="Klik untuk memfilter ID ini"
                        >
                          {core.id}
                        </button>
                        <h3 
                          onClick={() => {
                            addRecentSearch(core.hostname);
                            openCoreDetail(core);
                          }}
                          className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors mt-0.5 leading-snug cursor-pointer"
                        >
                          {core.hostname}
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
                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-300">{core.type}</span>
                        <span>·</span>
                        <span className="truncate">{core.region}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        POP: <span className="text-slate-300">{core.popName}</span>
                      </p>
                    </div>

                    {/* Core Capacity Gauge */}
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Kapasitas Core</span>
                        <span className="font-mono text-slate-200 font-bold tabular-nums">
                          {core.coreUsed} / {core.coreCapacity} Core
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(core.coreUsed / core.coreCapacity) * 100}%` }}
                          className="h-full bg-sky-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Documents Checklist Badges */}
                    <div className="pt-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                        Dokumen Pendukung:
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            core.documents.kmz
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-900 text-slate-600 border border-slate-800'
                          }`}
                        >
                          KMZ {core.documents.kmz ? '✓' : '✗'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            core.documents.visio
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-900 text-slate-600 border border-slate-800'
                          }`}
                        >
                          VISIO {core.documents.visio ? '✓' : '✗'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            core.documents.gdb
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-900 text-slate-600 border border-slate-800'
                          }`}
                        >
                          GDB {core.documents.gdb ? '✓' : '✗'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            core.documents.spreadsheet
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-900 text-slate-600 border border-slate-800'
                          }`}
                        >
                          XLSX {core.documents.spreadsheet ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        addRecentSearch(core.hostname);
                        openCoreDetail(core);
                      }}
                      className="flex-1 py-1.5 px-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addRecentSearch(core.hostname);
                        openCoreDetail(core);
                      }}
                      className="py-1.5 px-2.5 text-xs text-sky-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                      title="Lihat Peta Geospasial"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addRecentSearch(core.hostname);
                        openCoreDetail(core);
                      }}
                      className="py-1.5 px-2.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                      title="Dokumen Teknis"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">ID & Hostname</th>
                      <th className="py-3 px-4">OLT & POP</th>
                      <th className="py-3 px-4">Wilayah</th>
                      <th className="py-3 px-4">Jenis</th>
                      <th className="py-3 px-4">Kapasitas Core</th>
                      <th className="py-3 px-4">Dokumen</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {paginatedData.map(core => (
                      <tr key={core.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              addRecentSearch(core.id);
                              setSearchQuery(core.id);
                            }}
                            className="font-mono text-[10px] text-sky-400 hover:underline font-bold block text-left"
                            title="Filter dengan ID ini"
                          >
                            {core.id}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              addRecentSearch(core.hostname);
                              openCoreDetail(core);
                            }}
                            className="font-bold text-white hover:text-sky-300 text-left"
                          >
                            {core.hostname}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-200 block">{core.oltName}</span>
                          <span className="text-slate-500 text-[11px]">{core.popName}</span>
                        </td>
                        <td className="py-3 px-4">{core.region}</td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{core.type}</td>
                        <td className="py-3 px-4 font-mono tabular-nums">
                          {core.coreUsed} / {core.coreCapacity} Core
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px]">
                          <span className={core.documents.kmz ? 'text-emerald-400' : 'text-slate-600'}>
                            KMZ{core.documents.kmz ? '✓' : '✗'}
                          </span>{' '}
                          <span className={core.documents.visio ? 'text-emerald-400' : 'text-slate-600'}>
                            VSD{core.documents.visio ? '✓' : '✗'}
                          </span>{' '}
                          <span className={core.documents.gdb ? 'text-emerald-400' : 'text-slate-600'}>
                            GDB{core.documents.gdb ? '✓' : '✗'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border inline-block ${getStatusBadge(
                              core.status
                            )}`}
                          >
                            {core.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              addRecentSearch(core.hostname);
                              openCoreDetail(core);
                            }}
                            className="px-2.5 py-1 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded font-semibold transition-colors"
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
            <div className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400">
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 disabled:opacity-40 hover:text-white"
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
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 disabled:opacity-40 hover:text-white"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

