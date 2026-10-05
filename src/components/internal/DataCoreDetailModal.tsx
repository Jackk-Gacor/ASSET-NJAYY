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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-600">
                {selectedCore.id}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                {selectedCore.type}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  selectedCore.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : selectedCore.status === 'WIG'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {selectedCore.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {selectedCore.hostname}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{selectedCore.coordinates.address}</span>
            </p>
          </div>

          <button
            onClick={closeCoreDetail}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Detail Parameter &amp; Core
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'docs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Dokumen Teknis (KMZ, Visio, GDB)
          </button>
          <button
            onClick={() => setActiveTab('relations')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'relations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Relasi Feeder, Uplink &amp; Ring
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-500">OLT Name</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedCore.oltName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-500">POP Central</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedCore.popName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Wilayah Kerja</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedCore.region}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-500">PIC Penanggungjawab</span>
                  <p className="text-xs font-bold text-blue-600 mt-0.5 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{selectedCore.pic}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Tanggal Registrasi</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 font-mono">{selectedCore.date}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Last Update Sinkron</span>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5 font-mono">{selectedCore.lastUpdate}</p>
                </div>
              </div>

              {/* Optical Parameters Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Parameter Kapasitas Core &amp; Redaman OTDR</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {Math.round((selectedCore.coreUsed / selectedCore.coreCapacity) * 100)}% Terpakai
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Okupansi Helai Core</span>
                    <span className="font-mono">
                      <strong>{selectedCore.coreUsed}</strong> dari {selectedCore.coreCapacity} Core
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      style={{ width: `${(selectedCore.coreUsed / selectedCore.coreCapacity) * 100}%` }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500">Hasil Ukur Redaman:</span>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                      {selectedCore.attenuationDbm} dBm
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Ambang Batas Maksimal:</span>
                    <p className="font-mono font-bold text-slate-600 text-sm mt-0.5">
                      -24.0 dBm (Standard)
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedCore.notes && (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-blue-900 block">Catatan Lapangan &amp; Verifikasi:</span>
                  <p>{selectedCore.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCS */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Status kelengkapan 4 berkas dokumen validasi standar PLN Icon Plus Malang:
              </p>

              <div className="space-y-3">
                {/* KMZ */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs font-mono">
                      KMZ
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Google Earth Route (.kmz)</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {selectedCore.documents.kmzFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.kmz ? (
                    <button
                      onClick={() => handleDownloadDoc('KMZ', selectedCore.documents.kmzFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Tidak ada</span>
                  )}
                </div>

                {/* Visio */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs font-mono">
                      VSD
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Single Line Diagram Visio (.vsdx)</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {selectedCore.documents.visioFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.visio ? (
                    <button
                      onClick={() => handleDownloadDoc('VISIO', selectedCore.documents.visioFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Tidak ada</span>
                  )}
                </div>

                {/* GDB */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs font-mono">
                      GDB
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Esri Geodatabase (GDB Spasial)</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {selectedCore.documents.gdbFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.gdb ? (
                    <button
                      onClick={() => handleDownloadDoc('GDB', selectedCore.documents.gdbFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Tidak ada</span>
                  )}
                </div>

                {/* Spreadsheet */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs font-mono">
                      XLS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Core Assignment Matrix (.xlsx)</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {selectedCore.documents.sheetFilename || 'Belum diunggah'}
                      </p>
                    </div>
                  </div>
                  {selectedCore.documents.spreadsheet ? (
                    <button
                      onClick={() => handleDownloadDoc('XLSX', selectedCore.documents.sheetFilename)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Tidak ada</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RELATIONS */}
          {activeTab === 'relations' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Keterkaitan 3 pilar engineering antara Core, Feeder, Uplink, dan Ring proteksi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                    <Compass className="w-4 h-4" />
                    <span>Feeder Terkait</span>
                  </div>
                  <p className="text-xs font-mono text-slate-900 font-semibold">
                    {selectedCore.relatedFeeder}
                  </p>
                  <p className="text-[10px] text-slate-500">Distribusi ke pelanggan</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-sky-600 text-xs font-bold">
                    <Layers className="w-4 h-4" />
                    <span>Uplink Terkait</span>
                  </div>
                  <p className="text-xs font-mono text-slate-900 font-semibold">
                    {selectedCore.relatedUplink}
                  </p>
                  <p className="text-[10px] text-slate-500">Transmisi backbone 10G/40G</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
                    <RefreshCw className="w-4 h-4" />
                    <span>Ring Proteksi</span>
                  </div>
                  <p className="text-xs font-mono text-slate-900 font-semibold">
                    {selectedCore.relatedRing}
                  </p>
                  <p className="text-[10px] text-slate-500">Loop redundansi aktif</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Visualisasi Rantai Jalur:</span>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-700 overflow-x-auto pb-1">
                  <span className="px-2 py-1 rounded bg-white border border-slate-200">
                    {selectedCore.popName}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                    {selectedCore.hostname}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-white border border-slate-200">
                    {selectedCore.relatedFeeder}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-white border border-slate-200">
                    {selectedCore.relatedRing}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewMap}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Lihat di Peta</span>
            </button>

            <button
              onClick={handleViewTopology}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Lihat Topologi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isEligibleToApprove && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Setujui (Approved/WIG)</span>
              </button>
            )}

            <button
              onClick={closeCoreDetail}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
