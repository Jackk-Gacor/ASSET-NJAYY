import React, { useState } from 'react';
import {
  X,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  FileText,
  Sliders,
  Sparkles,
  Maximize2,
  RefreshCw,
  Monitor,
  Printer,
} from 'lucide-react';

export interface NetworkExportOptions {
  scope: 'current' | 'full';
  resolutionScale: 2 | 4 | 6;
  includeHeader: boolean;
  includeLegend: boolean;
  includeMetrics: boolean;
}

interface NetworkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: NetworkExportOptions) => Promise<void>;
  currentZoom: number;
  regionName: string;
  nodesCount: number;
  linksCount: number;
}

export const NetworkExportModal: React.FC<NetworkExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  currentZoom,
  regionName,
  nodesCount,
  linksCount,
}) => {
  const [scope, setScope] = useState<'current' | 'full'>('full');
  const [resolutionScale, setResolutionScale] = useState<2 | 4 | 6>(4);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeLegend, setIncludeLegend] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const baseWidth = 700;
  const baseHeight = 620;
  const headerHeight = includeHeader ? 120 : 0;
  const footerHeight = includeLegend ? 100 : 0;
  const totalHeight = baseHeight + headerHeight + footerHeight;

  const finalWidth = baseWidth * resolutionScale;
  const finalHeight = totalHeight * resolutionScale;

  const handleStartExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        scope,
        resolutionScale,
        includeHeader,
        includeLegend,
        includeMetrics,
      });
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-50/90 border-b border-slate-200/80 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                Ekspor Gambar Peta Resolusi Tinggi (PNG)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dokumentasi teknis lapangan, lampiran rapat, dan bahan presentasi profesional.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              1. Cakupan Area Peta
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setScope('full')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  scope === 'full'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                  scope === 'full' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {scope === 'full' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Seluruh Topologi Jaringan</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mencakup 100% koridor Malang Raya (Surabaya Gateway, Singosari, Batu, Sukun, hingga Kepanjen &amp; Dampit).
                  </p>
                </div>
              </div>

              <div
                onClick={() => setScope('current')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  scope === 'current'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                  scope === 'current' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {scope === 'current' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Tampilan Saat Ini ({Math.round(currentZoom * 100)}% Zoom)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mempertahankan posisi pergeseran (pan) dan pembesaran (zoom) aktif pada layar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              2. Ketajaman &amp; Resolusi Output
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setResolutionScale(2)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                  resolutionScale === 2
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <Monitor className="w-4 h-4 mx-auto text-slate-500" />
                <h4 className="font-bold text-slate-900 text-xs">2x HD</h4>
                <p className="font-mono text-[10px] text-slate-500">1400 × {(totalHeight * 2)} px</p>
                <span className="text-[10px] text-slate-400 block">Web &amp; Email</span>
              </div>

              <div
                onClick={() => setResolutionScale(4)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 relative ${
                  resolutionScale === 4
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono text-[9px] font-bold px-2 py-0.2 rounded-full uppercase shadow-xs">
                  Rekomendasi
                </span>
                <Sparkles className="w-4 h-4 mx-auto text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs">4x Ultra HD 4K</h4>
                <p className="font-mono text-[10px] text-blue-700 font-bold">2800 × {(totalHeight * 4)} px</p>
                <span className="text-[10px] text-slate-500 block">Presentasi &amp; Cetak A4/A3</span>
              </div>

              <div
                onClick={() => setResolutionScale(6)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                  resolutionScale === 6
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <Printer className="w-4 h-4 mx-auto text-slate-500" />
                <h4 className="font-bold text-slate-900 text-xs">6x Poster Master</h4>
                <p className="font-mono text-[10px] text-slate-500">4200 × {(totalHeight * 6)} px</p>
                <span className="text-[10px] text-slate-400 block">Cetak Besar Dinding NOC</span>
              </div>
            </div>
          </div>

          {/* Document Framing Options */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              3. Kelengkapan Elemen Dokumen Teknis
            </label>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHeader}
                  onChange={e => setIncludeHeader(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-slate-800 text-xs">Kop Header Resmi &amp; Judul Dokumen</span>
                  <p className="text-[11px] text-slate-500">
                    Menambahkan banner kop resmi, tanggal generasi, dan identifikasi divisi jaringan.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-slate-200/60">
                <input
                  type="checkbox"
                  checked={includeLegend}
                  onChange={e => setIncludeLegend(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-slate-800 text-xs">Footer Legenda Simpul &amp; Kabel</span>
                  <p className="text-[11px] text-slate-500">
                    Menampilkan penjelasan warna simpul (Super Backbone, POP Sentral, Akses) dan tipe kabel.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-slate-200/60">
                <input
                  type="checkbox"
                  checked={includeMetrics}
                  onChange={e => setIncludeMetrics(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-slate-800 text-xs">Ringkasan Metrik Topologi</span>
                  <p className="text-[11px] text-slate-500">
                    Menampilkan kotak statistik: {nodesCount} Simpul Aktif, {linksCount} Trunk/Feeder, wilayah {regionName}.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Export File Summary Box */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider block">
                Format Output Gambar:
              </span>
              <p className="text-xs text-slate-800 font-semibold">
                Portable Network Graphics (PNG) · 32-bit Alpha Channel
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">Dimensi Kanvas</span>
              <span className="font-mono font-bold text-xs text-blue-700">
                {finalWidth} × {finalHeight} px
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleStartExport}
            disabled={isExporting}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl flex items-center gap-2 transition-all shadow-xs"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Merender Gambar Beresolusi Tinggi...' : 'Unduh Gambar PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
