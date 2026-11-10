import React, { useState } from 'react';
import {
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  CheckCircle2,
  Info,
  ExternalLink,
  SplitSquareVertical,
  Compass,
} from 'lucide-react';
import { INITIAL_NETWORK_NODES } from '../../data/initialData';

interface GisReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNodeInApp?: (nodeId: string) => void;
}

export const GisReferenceModal: React.FC<GisReferenceModalProps> = ({
  isOpen,
  onClose,
  onSelectNodeInApp,
}) => {
  const [activeTab, setActiveTab] = useState<'south' | 'north' | 'both'>('south');
  const [zoomScale, setZoomScale] = useState(1);
  const [activeHighlightNode, setActiveHighlightNode] = useState<string | null>(null);

  if (!isOpen) return null;

  const southNodes = [
    {
      id: 'NODE-ULP-SBP',
      code: 'POP ODC ULP SUMBERPUCUNG_AREA45',
      area: 'Kec. Sumberpucung (dekat Bendungan Lahor & S. Brantas)',
      role: 'POP ODC Distribusi Barat',
    },
    {
      id: 'NODE-ULP-KPJ',
      code: 'POP ODC ULP KEPANJEN_AREA45',
      area: 'Kec. Kepanjen (Sentral Selatan, dekat Jl. Trunojoyo & Moloso)',
      role: 'POP ODC Sentral Gudang Kepanjen',
    },
    {
      id: 'NODE-ULP-GDL',
      code: 'POP ODC ULP GONDANGLEGI_AREA45',
      area: 'Kec. Gondanglegi (dekat Pagelaran & Bantur)',
      role: 'POP ODC Distribusi Tenggara',
    },
    {
      id: 'NODE-GI-KBG',
      code: 'POP SHELTER GI KEBON AGUNG_AREA45',
      area: 'Kec. Pakisaji (Titik 0 Sentral Agregasi)',
      role: 'Sub-Transmission Titik 0 Hub',
    },
  ];

  const northNodes = [
    {
      id: 'NODE-ULP-BATU',
      code: 'POP ODC ULP BATU_AREA45',
      area: 'Kota Batu (Kec. Batu / Sisir / Pattimura)',
      role: 'POP ODC Ring Barat Wisata',
    },
    {
      id: 'NODE-ODC-SKL',
      code: 'POP ODC GI SENGKALING_AREA45',
      area: 'Kec. Dau (Sengkaling / Mulyoagung)',
      role: 'POP ODC Antar-Kota Dau',
    },
    {
      id: 'NODE-TK4-MLY',
      code: 'POP TK4 DESA MULYOAGUNG_ARE',
      area: 'Desa Mulyoagung, Kec. Dau',
      role: 'POP TK4 Distribusi Desa',
    },
    {
      id: 'NODE-ODC-BGW',
      code: 'POP ODC APART BEGAWAN_AREA45',
      area: 'Tlogomas / Lowokwaru (Apartemen Begawan)',
      role: 'POP ODC Kawasan Hunian Vertikal',
    },
    {
      id: 'NODE-ULP-DNY',
      code: 'POP ODC ULP DINOYO_AREA45',
      area: 'Kec. Lowokwaru (Dinoyo / Suhat)',
      role: 'POP ODC Distribusi Pendidikan & Bisnis',
    },
    {
      id: 'NODE-ULP-BLM',
      code: 'PLN ODC ULP BLIMBING_AREA45',
      area: 'Kec. Blimbing (Jl. Raden Panji Suroso)',
      role: 'POP Backbone Metro Blimbing',
    },
    {
      id: 'NODE-ULP-SGS',
      code: 'POP ODC ULP SINGOSARI_AREA45',
      area: 'Kec. Singosari (Koridor KEK & Industri)',
      role: 'POP ODC Industri Singosari',
    },
    {
      id: 'NODE-UP3-MLG',
      code: 'POP UP3 MALANG_AREA45',
      area: 'Kec. Klojen (Kantor UP3 Malang Kota)',
      role: 'Sentral Distribusi Kota UP3',
    },
    {
      id: 'NODE-TK4-SDR',
      code: 'POP TK4 DESA SIDOREJO_AREA45',
      area: 'Kec. Jabung / Pakis (Desa Sidorejo)',
      role: 'POP TK4 Distribusi Timur',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#091226] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/40 text-fuchsia-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Referensi Peta Topologi GIS Asli · PLN Icon Plus Area 45
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-fuchsia-900/60 border border-fuchsia-500/50 text-fuchsia-300 font-mono text-[10px] font-semibold">
                  AREA 45 STANDARD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dokumentasi visual GIS resmi dari sistem lapangan dengan penamaan simpul <code className="text-fuchsia-400 font-mono">_AREA45</code> dan jalur kabel serat optik (garis magenta).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls / Tabs */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('south');
                setZoomScale(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'south'
                  ? 'bg-fuchsia-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Gambar 1: Poros Selatan</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">Kepanjen - Gondanglegi - S.Pucung</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('north');
                setZoomScale(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'north'
                  ? 'bg-fuchsia-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Gambar 2: Poros Tengah & Utara</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">Batu - Sengkaling - Kota - Singosari</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('both');
                setZoomScale(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'both'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Bandingkan Dua Gambar</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setZoomScale(prev => Math.max(0.7, prev - 0.2))}
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-slate-200 font-semibold tabular-nums">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(prev => Math.min(2.5, prev + 0.2))}
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Active Image View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: Image Container (8 cols) */}
            <div className={`${activeTab === 'both' ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-4`}>
              
              {activeTab === 'south' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner p-2">
                  <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-slate-800/80 mb-2">
                    <span className="font-mono text-fuchsia-400 font-bold">
                      GAMBAR 1 · KORIDOR SELATAN (KEPANJEN - GONDANGLEGI - SUMBERPUCUNG)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Format Asli GIS Screenshot
                    </span>
                  </div>
                  <div className="overflow-auto max-h-[520px] rounded-xl flex items-center justify-center bg-black/40 p-2">
                    <img
                      src="/assets/aistudio/image_e5ba9576.png"
                      alt="PLN Icon Plus GIS Poros Selatan"
                      className="rounded-lg object-contain transition-transform duration-150"
                      style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'north' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner p-2">
                  <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-slate-800/80 mb-2">
                    <span className="font-mono text-cyan-400 font-bold">
                      GAMBAR 2 · KORIDOR KOTA, BATU & SINGOSARI (AREA 45)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Format Asli GIS Screenshot
                    </span>
                  </div>
                  <div className="overflow-auto max-h-[520px] rounded-xl flex items-center justify-center bg-black/40 p-2">
                    <img
                      src="/assets/aistudio/Screenshot_2026-10-26_190829_38301da1.png"
                      alt="PLN Icon Plus GIS Poros Tengah dan Utara"
                      className="rounded-lg object-contain transition-transform duration-150"
                      style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'both' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2">
                    <div className="px-3 py-2 text-xs font-mono text-fuchsia-400 font-bold border-b border-slate-800 mb-2">
                      Gambar 1: Poros Selatan (Kepanjen - Gondanglegi - Sumberpucung)
                    </div>
                    <img
                      src="/assets/aistudio/image_e5ba9576.png"
                      alt="Gambar 1 Poros Selatan"
                      className="rounded-lg w-full object-contain max-h-[460px]"
                    />
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2">
                    <div className="px-3 py-2 text-xs font-mono text-cyan-400 font-bold border-b border-slate-800 mb-2">
                      Gambar 2: Poros Tengah & Utara (Batu - Sengkaling - Dinoyo - Singosari)
                    </div>
                    <img
                      src="/assets/aistudio/Screenshot_2026-10-26_190829_38301da1.png"
                      alt="Gambar 2 Poros Tengah dan Utara"
                      className="rounded-lg w-full object-contain max-h-[460px]"
                    />
                  </div>
                </div>
              )}

              {/* Informative Note */}
              <div className="p-3.5 bg-fuchsia-950/40 border border-fuchsia-800/40 rounded-2xl text-xs text-fuchsia-200 flex items-start gap-3">
                <Info className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-fuchsia-100">
                    Kesesuaian Desain 1:1 dengan Screenshot GIS Anda
                  </p>
                  <p className="text-[11px] text-fuchsia-300 leading-relaxed">
                    Setiap simpul yang tertera di screenshot telah diintegrasikan langsung ke dalam peta interaktif aplikasi dengan penamaan standar PLN Icon Plus <code className="bg-black/40 px-1 py-0.5 rounded text-fuchsia-200 font-mono">_AREA45</code>. Garis transmisi tebal berwarna merah muda (magenta) menghubungkan seluruh loop backbone dan feeder antar simpul.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Node List & Direct Focus (4 cols) */}
            {activeTab !== 'both' && (
              <div className="lg:col-span-4 space-y-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Daftar Simpul Teridentifikasi di Gambar</span>
                  </h4>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {(activeTab === 'south' ? southNodes : northNodes).map(node => (
                      <div
                        key={node.id}
                        onMouseEnter={() => setActiveHighlightNode(node.id)}
                        onMouseLeave={() => setActiveHighlightNode(null)}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          activeHighlightNode === node.id
                            ? 'bg-fuchsia-950/60 border-fuchsia-500 shadow-sm'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono font-bold text-white text-[11px]">
                            {node.code}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-400">{node.area}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-fuchsia-400 font-semibold uppercase">
                            {node.role}
                          </span>
                          {onSelectNodeInApp && (
                            <button
                              onClick={() => {
                                onSelectNodeInApp(node.id);
                                onClose();
                              }}
                              className="px-2 py-0.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                            >
                              <span>Sorot di Peta</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#091226] flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Referensi Topologi Koordinat WGS84 Malang Raya · PLN Icon Plus</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
