import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Database,
  MapPin,
  Share2,
  FileText,
  Download,
  CheckCircle,
  Clock,
  Layers,
  Compass,
  RefreshCw,
  HardHat,
  Shield,
  Activity,
  User,
  Calendar,
} from 'lucide-react';

export const DataCoreDetailModal: React.FC = () => {
  const {
    isDetailModalOpen,
    closeCoreDetail,
    selectedCore,
    approveDataCore,
    currentUser,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'relations'>('info');

  if (!isDetailModalOpen || !selectedCore) return null;

  const handleDownloadDoc = (docType: string, filename?: string) => {
    showToast(
      `Memulai pengunduhan simulasi: ${filename || `${selectedCore.hostname}_${docType}.dat`}`,
      'info'
    );
  };

  const handleApprove = () => {
    approveDataCore(selectedCore.id);
  };

  const handleViewMap = () => {
    closeCoreDetail();
    setCurrentView('network-map');
  };

  const handleViewTopology = () => {
    closeCoreDetail();
    setCurrentView('topology');
  };

  const isEligibleToApprove =
    (currentUser.role === 'Admin' || currentUser.role === 'Supervisor') &&
    selectedCore.status !== 'Approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400">
                {selectedCore.id}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedCore.type}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  selectedCore.status === 'Approved'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : selectedCore.status === 'WIG'
                    ? 'bg-blue-950 text-blue-300 border-blue-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}
              >
                {selectedCore.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {selectedCore.hostname}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{selectedCore.coordinates.address}</span>
            </p>
          </div>

          <button
            onClick={closeCoreDetail}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Detail Parameter & Core
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'docs'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Dokumen Teknis (KMZ, Visio, GDB)
          </button>
          <button
            onClick={() => setActiveTab('relations')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'relations'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Relasi Feeder, Uplink & Ring
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">OLT Name</span>
                  <p className="text-xs font-bold text-white mt-0.5">{selectedCore.oltName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">POP Central</span>
                  <p className="text-xs font-bold text-white mt-0.5">{selectedCore.popName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Wilayah Kerja</span>
                  <p className="text-xs font-bold text-white mt-0.5">{selectedCore.region}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">PIC Penanggungjawab</span>
                  <p className="text-xs font-bold text-sky-300 mt-0.5 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{selectedCore.pic}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Tanggal Registrasi</span>
                  <p className="text-xs font-bold text-white mt-0.5 font-mono">{selectedCore.date}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Last Update Sinkron</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5 font-mono">{selectedCore.lastUpdate}</p>
                </div>
              </div>

              {/* Optical Parameters Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Alokasi Core & Kualitas Redaman Optik
                  </h4>
                  <span className="text-[10px] font-mono text-sky-400">
                    Rasio Utilisasi: {Math.round((selectedCore.coreUsed / selectedCore.coreCapacity) * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400">Core Terpakai / Total Kapasitas</span>
                    <p className="text-lg font-mono font-bold text-white tabular-nums mt-0.5">
                      {selectedCore.coreUsed} / {selectedCore.coreCapacity} Core
                    </p>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-1.5">
                      <div
                        style={{
                          width: `${(selectedCore.coreUsed / selectedCore.coreCapacity) * 100}%`,
                        }}
                        className="h-full bg-sky-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400">Rata-Rata Redaman (Loss dBm)</span>
                    <p className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
                      {selectedCore.attenuationDbm} dBm
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Kondisi: {selectedCore.attenuationDbm > -22 ? 'Optimal (SOP PLN)' : 'Warning Perlu Splice'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedCore.notes && (
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-white block mb-0.5">Catatan Teknis Khusus:</span>
                  {selectedCore.notes}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Dokumen resmi yang dilampirkan oleh Tim Engineering GIS & Tim Data:
              </p>

              <div className="space-y-2.5">
                {/* KMZ */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                      KMZ
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Geospatial Google Earth (KMZ)</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {selectedCore.documents.kmzFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.kmz ? (
                    <button
                      onClick={() => handleDownloadDoc('KMZ', selectedCore.documents.kmzFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Tidak ada</span>
                  )}
                </div>

                {/* Visio */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold text-xs font-mono">
                      VSD
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Single Line Diagram Visio (.vsdx)</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {selectedCore.documents.visioFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.visio ? (
                    <button
                      onClick={() => handleDownloadDoc('VISIO', selectedCore.documents.visioFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Tidak ada</span>
                  )}
                </div>

                {/* GDB */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                      GDB
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Esri Geodatabase (GDB Spasial)</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {selectedCore.documents.gdbFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.gdb ? (
                    <button
                      onClick={() => handleDownloadDoc('GDB', selectedCore.documents.gdbFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Tidak ada</span>
                  )}
                </div>

                {/* Spreadsheet */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                      XLS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Core Assignment Matrix (.xlsx)</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {selectedCore.documents.sheetFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.spreadsheet ? (
                    <button
                      onClick={() => handleDownloadDoc('XLSX', selectedCore.documents.sheetFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Tidak ada</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RELATIONS */}
          {activeTab === 'relations' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Keterkaitan 3 pilar engineering antara Core, Feeder, Uplink, dan Ring proteksi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
                    <Compass className="w-4 h-4" />
                    <span>Feeder Terkait</span>
                  </div>
                  <p className="text-xs font-mono text-white font-semibold">
                    {selectedCore.relatedFeeder}
                  </p>
                  <p className="text-[10px] text-slate-500">Distribusi ke pelanggan</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                    <Layers className="w-4 h-4" />
                    <span>Uplink Terkait</span>
                  </div>
                  <p className="text-xs font-mono text-white font-semibold">
                    {selectedCore.relatedUplink}
                  </p>
                  <p className="text-[10px] text-slate-500">Transmisi backbone 10G/40G</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                    <RefreshCw className="w-4 h-4" />
                    <span>Ring Proteksi</span>
                  </div>
                  <p className="text-xs font-mono text-white font-semibold">
                    {selectedCore.relatedRing}
                  </p>
                  <p className="text-[10px] text-slate-500">Loop redundansi aktif</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">Visualisasi Rantai Jalur:</span>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 overflow-x-auto pb-1">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">
                    {selectedCore.popName}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300 font-bold">
                    {selectedCore.hostname}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">
                    {selectedCore.relatedFeeder}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">
                    {selectedCore.relatedRing}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewMap}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Lihat di Peta</span>
            </button>

            <button
              onClick={handleViewTopology}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Lihat Topologi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isEligibleToApprove && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Setujui (Approved/WIG)</span>
              </button>
            )}

            <button
              onClick={closeCoreDetail}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
