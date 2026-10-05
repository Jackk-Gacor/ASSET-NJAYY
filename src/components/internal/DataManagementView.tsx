import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataCoreItem, MalangRegion, CoreType, CoreStatus } from '../../types';
import {
  Database,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Layers,
  History,
  ShieldCheck,
  X,
} from 'lucide-react';

export const DataManagementView: React.FC = () => {
  const {
    dataCoreList,
    addDataCore,
    updateDataCore,
    deleteDataCore,
    approveDataCore,
    currentUser,
    openCoreDetail,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCore, setEditingCore] = useState<DataCoreItem | null>(null);

  // Form states for new / edit
  const [formData, setFormData] = useState({
    hostname: '',
    oltName: '',
    popName: '',
    region: 'Malang Kota' as MalangRegion,
    type: 'Uplink' as CoreType,
    status: 'In Review' as CoreStatus,
    pic: currentUser.name,
    coreCapacity: 48,
    coreUsed: 24,
    attenuationDbm: -18.5,
    relatedFeeder: 'FDR-MLG-KLJ-01',
    relatedUplink: 'UPL-MLG-KLJ-10G',
    relatedRing: 'RING-INNER-MALANG',
    address: 'Klojen, Malang Kota',
    kmz: true,
    visio: true,
    gdb: false,
    spreadsheet: true,
    kmzFilename: 'ROUTE_NEW_ASSET.kmz',
    visioFilename: 'SLD_NEW_CORE.vsdx',
    sheetFilename: 'CORE_MATRIX.xlsx',
    notes: '',
  });

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

  // Filtered List
  const filteredData = dataCoreList.filter(item => {
    const matchSearch =
      !search ||
      item.hostname.toLowerCase().includes(search.toLowerCase()) ||
      item.oltName.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchRegion = selectedRegion === 'ALL' || item.region === selectedRegion;
    const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchSearch && matchRegion && matchStatus;
  });

  const handleOpenAdd = () => {
    setEditingCore(null);
    setFormData({
      hostname: `OLT-MLG-NEW-${Math.floor(100 + Math.random() * 900)}`,
      oltName: 'ZTE C300 GPON OLT',
      popName: 'POP-MALANG-KLOJEN',
      region: 'Malang Kota',
      type: 'Uplink',
      status: 'In Review',
      pic: currentUser.name,
      coreCapacity: 48,
      coreUsed: 24,
      attenuationDbm: -18.5,
      relatedFeeder: 'FDR-MLG-KLJ-01',
      relatedUplink: 'UPL-MLG-KLJ-10G',
      relatedRing: 'RING-INNER-MALANG',
      address: 'Jl. Merdeka Barat, Klojen, Malang',
      kmz: true,
      visio: true,
      gdb: false,
      spreadsheet: true,
      kmzFilename: 'ROUTE_NEW_ASSET.kmz',
      visioFilename: 'SLD_NEW_CORE.vsdx',
      sheetFilename: 'CORE_MATRIX.xlsx',
      notes: 'Registrasi data core baru untuk sertifikasi WIG.',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (core: DataCoreItem) => {
    setEditingCore(core);
    setFormData({
      hostname: core.hostname,
      oltName: core.oltName,
      popName: core.popName,
      region: core.region,
      type: core.type,
      status: core.status,
      pic: core.pic,
      coreCapacity: core.coreCapacity,
      coreUsed: core.coreUsed,
      attenuationDbm: core.attenuationDbm,
      relatedFeeder: core.relatedFeeder,
      relatedUplink: core.relatedUplink,
      relatedRing: core.relatedRing,
      address: core.coordinates.address,
      kmz: core.documents.kmz,
      visio: core.documents.visio,
      gdb: core.documents.gdb,
      spreadsheet: core.documents.spreadsheet,
      kmzFilename: core.documents.kmzFilename || '',
      visioFilename: core.documents.visioFilename || '',
      sheetFilename: core.documents.sheetFilename || '',
      notes: core.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    if (editingCore) {
      updateDataCore(editingCore.id, {
        hostname: formData.hostname,
        oltName: formData.oltName,
        popName: formData.popName,
        region: formData.region,
        type: formData.type,
        status: formData.status,
        pic: formData.pic,
        coreCapacity: Number(formData.coreCapacity),
        coreUsed: Number(formData.coreUsed),
        attenuationDbm: Number(formData.attenuationDbm),
        relatedFeeder: formData.relatedFeeder,
        relatedUplink: formData.relatedUplink,
        relatedRing: formData.relatedRing,
        notes: formData.notes,
        documents: {
          kmz: formData.kmz,
          visio: formData.visio,
          gdb: formData.gdb,
          spreadsheet: formData.spreadsheet,
          kmzFilename: formData.kmzFilename,
          visioFilename: formData.visioFilename,
          sheetFilename: formData.sheetFilename,
        },
        coordinates: {
          ...editingCore.coordinates,
          address: formData.address,
        },
      });
    } else {
      addDataCore({
        hostname: formData.hostname,
        oltName: formData.oltName,
        popName: formData.popName,
        region: formData.region,
        type: formData.type,
        status: formData.status,
        pic: formData.pic,
        date: today,
        coreCapacity: Number(formData.coreCapacity),
        coreUsed: Number(formData.coreUsed),
        attenuationDbm: Number(formData.attenuationDbm),
        relatedFeeder: formData.relatedFeeder,
        relatedUplink: formData.relatedUplink,
        relatedRing: formData.relatedRing,
        notes: formData.notes,
        documents: {
          kmz: formData.kmz,
          visio: formData.visio,
          gdb: formData.gdb,
          spreadsheet: formData.spreadsheet,
          kmzFilename: formData.kmzFilename,
          visioFilename: formData.visioFilename,
          sheetFilename: formData.sheetFilename,
        },
        coordinates: {
          lat: -7.9785,
          lng: 112.6318,
          address: formData.address,
        },
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, hostname: string) => {
    if (confirm(`Yakin ingin menghapus ${hostname} (${id})?`)) {
      deleteDataCore(id);
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>MODUL TIM DATA MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Data Core Registry &amp; Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola katalog helai core, unggah berkas GIS KMZ/Visio, dan perbarui status utilisasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Core Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter Hostname, OLT, ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Wilayah</option>
            {regions.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Status</option>
            {statuses.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Data Core */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ID Core</th>
                <th className="py-3.5 px-4">Hostname &amp; Lokasi</th>
                <th className="py-3.5 px-4">Kapasitas (Used/Cap)</th>
                <th className="py-3.5 px-4">Redaman (dBm)</th>
                <th className="py-3.5 px-4">PIC &amp; Last Update</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.map(core => (
                <tr key={core.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{core.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{core.hostname}</p>
                    <p className="text-[11px] text-slate-500">
                      {core.region} · {core.oltName}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{core.coreUsed} / {core.coreCapacity}</span>
                      <span className="text-[10px] text-slate-500">
                        ({Math.round((core.coreUsed / core.coreCapacity) * 100)}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <span
                      className={
                        core.attenuationDbm > -20
                          ? 'text-emerald-600 font-bold'
                          : 'text-amber-600 font-semibold'
                      }
                    >
                      {core.attenuationDbm} dBm
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-medium block">{core.pic}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{core.lastUpdate}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border inline-block ${
                        core.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : core.status === 'WIG'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {core.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => openCoreDetail(core)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      title="Lihat Detail"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleOpenEdit(core)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors inline-block"
                      title="Edit Data"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(core.id, core.hostname)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors inline-block"
                      title="Hapus Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>{editingCore ? 'Edit Data Core' : 'Tambah Data Core Baru'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hostname OLT / Core
                  </label>
                  <input
                    type="text"
                    value={formData.hostname}
                    onChange={e => setFormData({ ...formData, hostname: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Merk / Tipe OLT
                  </label>
                  <input
                    type="text"
                    value={formData.oltName}
                    onChange={e => setFormData({ ...formData, oltName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    POP Central
                  </label>
                  <input
                    type="text"
                    value={formData.popName}
                    onChange={e => setFormData({ ...formData, popName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wilayah Kerja
                  </label>
                  <select
                    value={formData.region}
                    onChange={e =>
                      setFormData({ ...formData, region: e.target.value as MalangRegion })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {regions.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Data Core
                  </label>
                  <select
                    value={formData.type}
                    onChange={e =>
                      setFormData({ ...formData, type: e.target.value as CoreType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {types.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Verifikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as CoreStatus })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Kapasitas Core
                  </label>
                  <input
                    type="number"
                    value={formData.coreCapacity}
                    onChange={e =>
                      setFormData({ ...formData, coreCapacity: parseInt(e.target.value) || 0 })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Core Terpakai
                  </label>
                  <input
                    type="number"
                    value={formData.coreUsed}
                    onChange={e =>
                      setFormData({ ...formData, coreUsed: parseInt(e.target.value) || 0 })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Redaman (Loss dBm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.attenuationDbm}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        attenuationDbm: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIC Pengelola
                  </label>
                  <input
                    type="text"
                    value={formData.pic}
                    onChange={e => setFormData({ ...formData, pic: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Fisik / Lokasi
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Checklist berkas */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  Lampiran Berkas Teknis (KMZ, Visio, GDB, XLSX)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.kmz}
                      onChange={e => setFormData({ ...formData, kmz: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>KMZ GIS</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visio}
                      onChange={e => setFormData({ ...formData, visio: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>Visio SLD</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.gdb}
                      onChange={e => setFormData({ ...formData, gdb: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>GDB Spatial</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.spreadsheet}
                      onChange={e => setFormData({ ...formData, spreadsheet: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>Excel Sheet</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  {editingCore ? 'Simpan Perubahan' : 'Tambah ke Basis Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
