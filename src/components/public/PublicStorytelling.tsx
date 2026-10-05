import React, { useState } from 'react';
import { Database, Compass, HardHat, CheckCircle2, ArrowRight, ShieldAlert, Layers, MapPin, Zap } from 'lucide-react';
import fieldTechnicianImage from '../../assets/images/field_asset_technician_1791168741053.jpg';

export const PublicStorytelling: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const workflowSteps = [
    {
      id: 'field',
      stepNum: '01',
      title: 'Field Operations & Site Verification',
      subtitle: 'Validasi Fisik Lapangan',
      icon: HardHat,
      color: 'border-amber-500 text-amber-600 bg-amber-50',
      description:
        'Tim Field bergerak langsung menyusuri jalur tiang PLN, saluran bawah tanah, ODC, dan FDT di area Malang Raya. Melakukan pengukuran redaman OTDR, pengecekan sambungan splice, dan memastikan kondisi fisik kabel sesuai standar keselamatan operasional.',
      details: [
        'Uji Redaman dengan Optical Time Domain Reflectometer (OTDR)',
        'Inspeksi kelayakan tiang, span kabel udara & ODC lapangan',
        'Pelaporan langsung koordinat geospasial real-time via Field Module',
      ],
      deliverable: 'Form Laporan Lapangan & Foto Bukti Geotagging',
    },
    {
      id: 'data',
      stepNum: '02',
      title: 'Data Core Management & Inventarisasi',
      subtitle: 'Katalogisasi & Alokasi Kapasitas Core',
      icon: Database,
      color: 'border-blue-600 text-blue-600 bg-blue-50',
      description:
        'Tim Data mengelola inventarisasi digital seluruh helai fiber optic (core management). Setiap OLT, POP, Feeder, dan Uplink memiliki kode identitas unik, status utilisasi core aktif/idle, serta catatan riwayat pemeliharaan.',
      details: [
        'Pencatatan alokasi core 24 / 48 / 96 / 144 core per rute',
        'Validasi kecocokan data fisik lapangan dengan database core',
        'Audit kapasitas idle core untuk kesiapan pesanan baru (SID)',
      ],
      deliverable: 'Data Core Registry & Excel Core Assignment Matrix',
    },
    {
      id: 'engineering',
      stepNum: '03',
      title: 'Engineering, GIS & Single Line Diagram',
      subtitle: 'Pemetaan Spasial & Topologi Desain',
      icon: Compass,
      color: 'border-sky-500 text-sky-600 bg-sky-50',
      description:
        'Tim Engineering menerjemahkan data lapangan dan alokasi core ke dalam format spasial GIS (KMZ/KML, Geodatabase GDB) serta diagram skematik Single Line Diagram (SLD Visio) untuk menjamin arsitektur jaringan terlindungi sistem redundansi ring.',
      details: [
        'Pembuatan peta jalur kabel optik berbasis KMZ & ArcGDB',
        'Skema Single Line Diagram (SLD) OLT hingga FDT',
        'Perhitungan toleransi loss link dan mitigasi rute putus (Ring Protection)',
      ],
      deliverable: 'Dokumen KMZ GIS, Schematics Visio & GDB File',
    },
    {
      id: 'wig',
      stepNum: '04',
      title: 'WIG & Quality Approval',
      subtitle: 'Standardisasi Work in Ground & Sertifikasi Aset',
      icon: CheckCircle2,
      color: 'border-emerald-600 text-emerald-600 bg-emerald-50',
      description:
        'Tahap akhir verifikasi kualitatif oleh Supervisor dan Tim Manajemen Asset Malang. Ketika data fisik, core mapping, dan berkas GIS telah lengkap dan sinkron 100%, data memperoleh sertifikasi status Approved/WIG dan siap dimonitor secara real-time.',
      details: [
        'Checklist kelengkapan 4 dokumen utama (KMZ, Visio, GDB, Sheet)',
        'Verifikasi nilai redaman standar PLN Icon Plus (< -24 dBm)',
        'Penerbitan status WIG (Work in Ground) tersertifikasi',
      ],
      deliverable: 'Status Approved / WIG Verified & Laporan Audit Aset',
    },
  ];

  return (
    <section id="storytelling-section" className="py-20 lg:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
            Sinergi Tiga Pilar Divisi Asset
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bagaimana Data, Engineering, dan Field Saling Terkoneksi
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Keandalan jaringan fiber optic tidak terjadi secara kebetulan. Di balik setiap megabit data internet yang mengalir, ada kerja teliti tim aset yang memetakan, mendokumentasikan, dan memvalidasi setiap jengkal kabel di wilayah Malang Raya.
          </p>
        </div>

        {/* Storytelling Grid: Visual Story + Interactive Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Documentary Narrative & Photo */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
              <img
                src={fieldTechnicianImage}
                alt="Teknisi Field Asset PLN Icon Plus Malang memeriksa ODC"
                className="w-full h-72 sm:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 bg-slate-900 text-white">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                  Dedikasi di Lapangan
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Verifikasi Fisik Hingga Titik Terujung
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Dari kepadatan jalan protokol Kota Malang, kawasan kampus Dinoyo-Suhat, kontur perbukitan Kota Batu, hingga bentang kabel pedalaman Sumberpucung dan Dampit, tim lapangan memastikan integritas infrastruktur optik tetap terjaga tanpa kompromi.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Filosofi Zero-Blindspot Asset</h4>
                  <p className="text-xs text-slate-500">Prinsip akurasi data aset infrastruktur optik</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap perubahan rute tiang, penambahan pelanggan korporat (SID), maupun splicing darurat wajib dicatat dan dipetakan dalam waktu kurang dari 24 jam untuk menjaga akurasi peta jaringan.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive 4-Phase Pipeline */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Siklus Alur Kerja Asset (Pilih Tahap untuk Melihat Detail)
            </h3>

            <div className="space-y-3">
              {workflowSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isSelected = activeStep === idx;

                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer rounded-xl border transition-all p-5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${step.color}`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-600">
                              FASE {step.stepNum}
                            </span>
                            <span className="text-xs text-slate-600">·</span>
                            <span className="text-xs font-medium text-slate-600">{step.subtitle}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">
                            {step.title}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isSelected ? 'Aktif' : 'Lihat'}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 text-slate-700 animate-fadeIn">
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                          {step.description}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <p className="text-xs font-semibold text-slate-900">Aktivitas Utama:</p>
                          {step.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center gap-2 text-xs font-medium text-blue-900 bg-white p-2.5 rounded-lg border border-blue-100">
                          <span className="font-semibold text-blue-700">Output Berkas:</span>
                          <span className="text-slate-700">{step.deliverable}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
