import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MalangRegion, FieldReportItem } from '../../types';
import {
  HardHat,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  FileCheck,
  List,
  Filter,
  Layers,
} from 'lucide-react';

export const FieldReportingView: React.FC = () => {
  const { fieldReportList, addFieldReport, currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'form' | 'table' | 'recap'>('form');

  // Form State
  const [formData, setFormData] = useState({
    pic: currentUser.name,
    tanggal: new Date().toISOString().split('T')[0],
    wilayah: 'Malang Kota' as MalangRegion,
    lokasi: 'Jl. Ijen No. 25, Gading Kasri, Klojen, Malang Kota',
    koordinat: '-7.9734, 112.6241',
    jenisPekerjaan: 'Pengecekan Core' as FieldReportItem['jenisPekerjaan'],
    kondisi: 'Normal / Aman' as FieldReportItem['kondisi'],
    status: 'Verified' as FieldReportItem['status'],
    redamanDbm: -18.4,
    coreChecked: 24,
    keterangan: 'Hasil ukur OTDR stabil, sambungan splice dalam closure ODC bersih dan tidak terdapat tekukan kabel.',
    fotoType: 'ODC Closure Tag',
  });

  const regions: MalangRegion[] = [
    'Malang Kota',
    'Kota Batu',
    'Kepanjen (Malang Selatan)',
    'Singosari (Malang Utara)',
    'Lawang',
    'Turen & Dampit',
  ];

  const presetSpots = [
    { label: 'Klojen Alun-Alun', coords: '-7.9826, 112.6308', loc: 'Simpang Alun-Alun Klojen, Malang', reg: 'Malang Kota' as MalangRegion },
    { label: 'Suhat UB Campus', coords: '-7.9472, 112.6186', loc: 'Jl. Soekarno Hatta (Gerbang UB)', reg: 'Malang Kota' as MalangRegion },
    { label: 'Alun-Alun Batu', coords: '-7.8712, 112.5271', loc: 'Jl. Agus Salim, Sisir, Batu', reg: 'Kota Batu' as MalangRegion },
    { label: 'KEK Singhasari', coords: '-7.8924, 112.6657', loc: 'Kawasan Ekonomi Khusus Singosari', reg: 'Singosari (Malang Utara)' as MalangRegion },
    { label: 'Pemkab Kepanjen', coords: '-8.1308, 112.5714', loc: 'Jl. Panji Kompleks Pemkab Kepanjen', reg: 'Kepanjen (Malang Selatan)' as MalangRegion },
    { label: 'Jalur Gardu Turen', coords: '-8.1693, 112.7214', loc: 'Depan Gardu Induk PLN Turen', reg: 'Turen & Dampit' as MalangRegion },
  ];

  const handlePickSpot = (spot: typeof presetSpots[0]) => {
    setFormData(prev => ({
      ...prev,
      koordinat: spot.coords,
      lokasi: spot.loc,
      wilayah: spot.reg,
    }));
    showToast(`Koordinat GPS terisi: ${spot.label}`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFieldReport({
      pic: formData.pic,
      tanggal: formData.tanggal,
      wilayah: formData.wilayah,
      lokasi: formData.lokasi,
      koordinat: formData.koordinat,
      jenisPekerjaan: formData.jenisPekerjaan,
      kondisi: formData.kondisi,
      status: formData.status,
      keterangan: formData.keterangan,
      redamanDbm: Number(formData.redamanDbm),
      coreChecked: Number(formData.coreChecked),
      fotoType: formData.fotoType,
    });

    setActiveTab('table');
  };

  // Recap statistics
  const totalVerified = fieldReportList.filter(r => r.status === 'Verified').length;
  const totalNeedAction = fieldReportList.filter(r => r.status === 'Need Action').length;
  const avgLoss = (
    fieldReportList.reduce((acc, r) => acc + r.redamanDbm, 0) / (fieldReportList.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
            <HardHat className="w-4 h-4" />
            <span>MODUL FIELD OPERATIONS &amp; SITE AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Field Reporting Form &amp; Recap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Form pelaporan hasil inspeksi fisik, pengukuran redaman OTDR, dan bukti lapangan tersimpan di browser
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'form' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Form Input
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Data Field ({fieldReportList.length})
          </button>
          <button
            onClick={() => setActiveTab('recap')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'recap' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Statistik Rekap
          </button>
        </div>
      </div>

      {/* TAB 1: FORM INPUT */}
      {activeTab === 'form' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            
            {/* Top decorative stripe */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Formulir Laporan Lapangan (Field Inspection)
                </h2>
                <p className="text-xs text-slate-500">
                  Isikan data inspeksi fisik kabel, pembacaan OTDR, dan kondisi jalur tiang PLN Malang Raya.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Field 1: PIC & Tanggal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama PIC Teknisi Lapangan *
                    </label>
                    <input
                      type="text"
                      value={formData.pic}
                      onChange={e => setFormData({ ...formData, pic: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Pelaksanaan *
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Wilayah & Lokasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Wilayah Kerja Malang *
                    </label>
                    <select
                      value={formData.wilayah}
                      onChange={e =>
                        setFormData({ ...formData, wilayah: e.target.value as MalangRegion })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
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
                      Titik Lokasi / Alamat Rute *
                    </label>
                    <input
                      type="text"
                      value={formData.lokasi}
                      onChange={e => setFormData({ ...formData, lokasi: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Preset Spot Quick Selector */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Pintasan Koordinat Wilayah Malang:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetSpots.map(s => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => handlePickSpot(s)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field 3: Jenis Pekerjaan & Kondisi Fisik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenis Pekerjaan / Aktivitas *
                    </label>
                    <select
                      value={formData.jenisPekerjaan}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          jenisPekerjaan: e.target.value as FieldReportItem['jenisPekerjaan'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Pengecekan Core">Pengecekan Core &amp; OTB</option>
                      <option value="Sambung Splice">Sambung Splice Closure</option>
                      <option value="Patroli Jalur">Patroli Jalur Tiang PLN</option>
                      <option value="Roll Out">Roll Out Kabel Baru</option>
                      <option value="Perapihan OTB">Perapihan Rack OTB</option>
                      <option value="Ukur Redaman OTDR">Ukur Redaman OTDR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kondisi Fisik Lapangan *
                    </label>
                    <select
                      value={formData.kondisi}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          kondisi: e.target.value as FieldReportItem['kondisi'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Normal / Aman">Normal / Aman (Optimal)</option>
                      <option value="Redaman Tinggi">Redaman Tinggi (&gt; -23 dBm)</option>
                      <option value="Kritis">Kritis (Kendur / Dekat Pohon Rimbun)</option>
                      <option value="Kabel Putus / Cut">Kabel Putus / Fiber Cut</option>
                    </select>
                  </div>
                </div>

                {/* Field 4: Redaman & Core Checked */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nilai Redaman (dBm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.redamanDbm}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          redamanDbm: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jumlah Core Diperiksa *
                    </label>
                    <input
                      type="number"
                      value={formData.coreChecked}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          coreChecked: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bukti Foto Lampiran *
                    </label>
                    <select
                      value={formData.fotoType}
                      onChange={e => setFormData({ ...formData, fotoType: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500"
                    >
                      <option value="ODC Closure Tag">ODC Closure Tag</option>
                      <option value="OTDR Graph Trace">OTDR Graph Trace</option>
                      <option value="Fusion Splicer Result">Fusion Splicer Result</option>
                      <option value="Aerial ADSS Route">Aerial ADSS Route Tiang</option>
                      <option value="Pole Bracket Installation">Pole Bracket Installation</option>
                    </select>
                  </div>
                </div>

                {/* Field 5: Keterangan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Deskripsi &amp; Rekomendasi Lapangan *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.keterangan}
                    onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Submit action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Form → Tersimpan di Browser (LocalStorage)
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Laporan Lapangan</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA FIELD TABLE */}
      {activeTab === 'table' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Log Hasil Pelaporan Field Terkini</h3>
              <p className="text-xs text-slate-500">Menampilkan seluruh data masuk dari teknisi</p>
            </div>
            <button
              onClick={() => setActiveTab('form')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              + Input Form Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">ID Laporan &amp; Tgl</th>
                  <th className="py-3.5 px-4">PIC Teknisi</th>
                  <th className="py-3.5 px-4">Wilayah &amp; Lokasi</th>
                  <th className="py-3.5 px-4">Jenis Pekerjaan</th>
                  <th className="py-3.5 px-4">Redaman OTDR</th>
                  <th className="py-3.5 px-4">Kondisi Fisik</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {fieldReportList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-blue-600 font-bold block">
                        {item.id}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.tanggal}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.pic}</td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-800 font-medium">{item.wilayah}</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-xs">{item.lokasi}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                        {item.jenisPekerjaan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                      <span
                        className={
                          item.redamanDbm > -20
                            ? 'text-emerald-600'
                            : item.redamanDbm > -23
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {item.redamanDbm} dBm
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border inline-block ${
                          item.kondisi === 'Normal / Aman'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.kondisi === 'Redaman Tinggi'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border inline-block ${
                          item.status === 'Verified'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REKAP STATISTIK */}
      {activeTab === 'recap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500">Total Laporan Verified</span>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums mt-1">
                {totalVerified}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Telah diverifikasi supervisor</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500">Memerlukan Tindak Lanjut</span>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 tabular-nums mt-1">
                {totalNeedAction}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Redaman tinggi / perlu re-splice</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500">Rata-Rata Redaman Malang</span>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-600 tabular-nums mt-1">
                {avgLoss} dBm
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Kategori optimal sesuai SLA</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900">Ringkasan Wilayah Patroli Lapangan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jalur patroli preventif kabel udara ADSS terfokus pada titik rawan proyek pelebaran jalan flyover Gadang, simpang Karanglo, dan jalur perbukitan Batu Bumiaji.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
