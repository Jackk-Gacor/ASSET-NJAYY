import { NetworkNode } from '../types';

export interface FiberPortSpec {
  id: string;
  portNumber: number;
  trayNumber: number;
  portLabel: string;
  connectorType: 'LC/APC' | 'SC/UPC' | 'LC/UPC' | 'MPO-12' | 'SC/APC';
  fiberStandard: 'G.652.D' | 'G.657.A1' | 'G.655 (NZDSF)';
  coreDiameter: '9/125 µm';
  wavelength: string;
  assignedCircuit: string;
  serviceType: string;
  customerOrUplink: string;
  txPowerDbm: number;
  rxPowerDbm: number;
  insertionLossDb: number;
  status: 'Active' | 'Spare' | 'Reserved' | 'Warning';
}

export interface NodeMaintenanceRecord {
  id: string;
  ticketNumber: string;
  date: string;
  timestamp: string;
  category: 'Preventive' | 'OTDR Calibration' | 'Splicing & Patching' | 'Hardware & Power' | 'Emergency Restoration';
  technicians: string;
  status: 'Completed' | 'Verified' | 'Scheduled';
  impact: string;
  summary: string;
  details: string;
  measuredLossBefore?: number;
  measuredLossAfter?: number;
}

export interface NodeTechnicalProfile {
  nodeId: string;
  nodeCode: string;
  tierClassification: string;
  siteName: string;
  address: string;
  elevationMasl: number;
  picName: string;
  picPhone: string;
  odfRackModel: string;
  cabinetSlot: string;
  powerSystem: {
    mainSupply: string;
    upsModel: string;
    batteryBackupHours: number;
    batteryHealthPercent: number;
    atsGenerator: string;
  };
  climateControl: {
    roomTempC: number;
    humidityPercent: number;
    coolingSystem: string;
    fireProtection: string;
    status: 'Optimal' | 'Warning';
  };
  opticalTransmission: {
    backhaulBandwidth: string;
    dwdmModel: string;
    channelGrid: string;
    averageAttenuationDbm: number;
    averageLatencyMs: number;
    protectionSwitchTimeMs: number;
  };
  coreBreakdown: {
    total: number;
    active: number;
    spareDark: number;
    reservedProtection: number;
    degradedWarning: number;
  };
  ports: FiberPortSpec[];
  maintenanceLogs: NodeMaintenanceRecord[];
}

export const NODE_TECHNICAL_PROFILES: Record<string, NodeTechnicalProfile> = {
  'NODE-MLG-KLJ': {
    nodeId: 'NODE-MLG-KLJ',
    nodeCode: 'POP-KLOJEN',
    tierClassification: 'Tier 1 - Master Core Backbone & Central Hub',
    siteName: 'Shelter Sentral Fiber Telko Klojen',
    address: 'Jl. Merdeka Barat No. 12, Kauman, Kec. Klojen, Kota Malang, Jawa Timur 65119',
    elevationMasl: 442,
    picName: 'Bambang Kusuma, S.T. (Senior Lead NOC)',
    picPhone: '+62 812-3456-7890',
    odfRackModel: 'Schneider Actassi ODF-288 19" 42U Modular Rack',
    cabinetSlot: 'Cabinet A-02, Unit U18-U26',
    powerSystem: {
      mainSupply: 'PLN 3-Phase 33 kVA (Dual Feed Transformer A/B)',
      upsModel: 'Vertiv Liebert eXM 20 kVA Online Double Conversion',
      batteryBackupHours: 6.5,
      batteryHealthPercent: 98,
      atsGenerator: 'Automatic Transfer Switch (ATS) 45 kVA Cummins Silent Genset',
    },
    climateControl: {
      roomTempC: 20.4,
      humidityPercent: 48,
      coolingSystem: 'Dual Precision Air Conditioner (In-Row PAC N+1)',
      fireProtection: 'FM-200 Clean Agent Fire Extinguishing System + VESDA Smoke Detector',
      status: 'Optimal',
    },
    opticalTransmission: {
      backhaulBandwidth: '100 Gbps OTN DWDM Super Trunk',
      dwdmModel: 'Huawei OptiX OSN 9800 M24 Multi-Service OTN',
      channelGrid: '50 GHz ITU-T C-Band 80 Channels',
      averageAttenuationDbm: -15.4,
      averageLatencyMs: 1.2,
      protectionSwitchTimeMs: 24,
    },
    coreBreakdown: {
      total: 288,
      active: 184,
      spareDark: 56,
      reservedProtection: 42,
      degradedWarning: 6,
    },
    ports: [
      {
        id: 'PORT-KLJ-01',
        portNumber: 1,
        trayNumber: 1,
        portLabel: 'T1-P01',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1550 nm (DWDM C21)',
        assignedCircuit: 'BONE-SBY-KLJ-100G-A',
        serviceType: 'Super Backbone Primary',
        customerOrUplink: 'Surabaya Gateway Gateway Interconnect',
        txPowerDbm: 2.4,
        rxPowerDbm: -16.8,
        insertionLossDb: 0.18,
        status: 'Active',
      },
      {
        id: 'PORT-KLJ-02',
        portNumber: 2,
        trayNumber: 1,
        portLabel: 'T1-P02',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1550 nm (DWDM C22)',
        assignedCircuit: 'BONE-SBY-KLJ-100G-B',
        serviceType: 'Super Backbone Secondary (Protection)',
        customerOrUplink: 'Surabaya Gateway Gateway Interconnect Backup',
        txPowerDbm: 2.2,
        rxPowerDbm: -17.1,
        insertionLossDb: 0.21,
        status: 'Reserved',
      },
      {
        id: 'PORT-KLJ-03',
        portNumber: 3,
        trayNumber: 1,
        portLabel: 'T1-P03',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'FDR-MLG-KLJ-SHT-01',
        serviceType: 'Metro-E Trunk 10G',
        customerOrUplink: 'POP Suhat Metro Campus Hub',
        txPowerDbm: 1.8,
        rxPowerDbm: -18.2,
        insertionLossDb: 0.24,
        status: 'Active',
      },
      {
        id: 'PORT-KLJ-04',
        portNumber: 4,
        trayNumber: 1,
        portLabel: 'T1-P04',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'FDR-MLG-KLJ-BLM-01',
        serviceType: 'Metro-E Trunk 10G',
        customerOrUplink: 'POP Blimbing Industrial Hub',
        txPowerDbm: 1.9,
        rxPowerDbm: -17.9,
        insertionLossDb: 0.22,
        status: 'Active',
      },
      {
        id: 'PORT-KLJ-05',
        portNumber: 5,
        trayNumber: 1,
        portLabel: 'T1-P05',
        connectorType: 'SC/UPC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'SID-2024-MLG-0104',
        serviceType: 'Dedicated Internet 1 Gbps',
        customerOrUplink: 'Bank Mandiri KC Malang Wahid Hasyim',
        txPowerDbm: 0.5,
        rxPowerDbm: -19.4,
        insertionLossDb: 0.32,
        status: 'Active',
      },
      {
        id: 'PORT-KLJ-06',
        portNumber: 6,
        trayNumber: 1,
        portLabel: 'T1-P06',
        connectorType: 'SC/UPC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'SID-2024-MLG-0108',
        serviceType: 'IP-VPN Dedicated 500 Mbps',
        customerOrUplink: 'Kantor Pelayanan Pajak Pratama Malang',
        txPowerDbm: 0.6,
        rxPowerDbm: -18.8,
        insertionLossDb: 0.28,
        status: 'Active',
      },
      {
        id: 'PORT-KLJ-07',
        portNumber: 7,
        trayNumber: 1,
        portLabel: 'T1-P07',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1550 nm',
        assignedCircuit: 'RING-01-PROT-A',
        serviceType: 'Ring Protected Loop Feeder',
        customerOrUplink: 'Ring Metro Malang Barat Failover',
        txPowerDbm: 1.5,
        rxPowerDbm: -19.1,
        insertionLossDb: 0.26,
        status: 'Active',
      },
      {
        id: 'PORT-KLJ-08',
        portNumber: 8,
        trayNumber: 1,
        portLabel: 'T1-P08',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'FDR-MLG-KLJ-SKN-01',
        serviceType: 'Distribution Feeder 10G',
        customerOrUplink: 'POP Sukun Distribution Access',
        txPowerDbm: -1.2,
        rxPowerDbm: -23.8,
        insertionLossDb: 0.52,
        status: 'Warning',
      },
      {
        id: 'PORT-KLJ-09',
        portNumber: 9,
        trayNumber: 2,
        portLabel: 'T2-P01',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 / 1550 nm',
        assignedCircuit: 'SPARE-DARK-01',
        serviceType: 'Dark Fiber Cadangan',
        customerOrUplink: 'Tersedia / Siap Digunakan (Hot Standby)',
        txPowerDbm: 0.0,
        rxPowerDbm: 0.0,
        insertionLossDb: 0.15,
        status: 'Spare',
      },
      {
        id: 'PORT-KLJ-10',
        portNumber: 10,
        trayNumber: 2,
        portLabel: 'T2-P02',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 / 1550 nm',
        assignedCircuit: 'SPARE-DARK-02',
        serviceType: 'Dark Fiber Cadangan',
        customerOrUplink: 'Tersedia / Siap Digunakan',
        txPowerDbm: 0.0,
        rxPowerDbm: 0.0,
        insertionLossDb: 0.17,
        status: 'Spare',
      },
      {
        id: 'PORT-KLJ-11',
        portNumber: 11,
        trayNumber: 2,
        portLabel: 'T2-P03',
        connectorType: 'MPO-12',
        fiberStandard: 'G.657.A1',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm High Density',
        assignedCircuit: 'MPO-TRUNK-CORRIDOR-SOUTH',
        serviceType: 'Multi-Fiber Push-On 12-Core Trunk',
        customerOrUplink: 'Trunk Feeder Kepanjen Gateway',
        txPowerDbm: 3.1,
        rxPowerDbm: -16.4,
        insertionLossDb: 0.25,
        status: 'Active',
      },
      {
        id: 'PORT-KLJ-12',
        portNumber: 12,
        trayNumber: 2,
        portLabel: 'T2-P04',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1550 nm',
        assignedCircuit: 'RESV-CORP-TELKO-09',
        serviceType: 'Reserved for Bank Mandiri Core Expansion',
        customerOrUplink: 'Alokasi Q4 2026',
        txPowerDbm: 0.0,
        rxPowerDbm: 0.0,
        insertionLossDb: 0.19,
        status: 'Reserved',
      },
    ],
    maintenanceLogs: [
      {
        id: 'MNT-KLJ-2026-088',
        ticketNumber: 'INC-MNT-2026-0941',
        date: '28 Sep 2026',
        timestamp: '14:20 WIB',
        category: 'OTDR Calibration',
        technicians: 'Bambang Kusuma & Tim NOC Jatim',
        status: 'Completed',
        impact: 'Zero Downtime (Live OTDR 1625nm Out-of-band)',
        summary: 'Kalibrasi redaman port ODF Tray 1 dan evaluasi konektor optik LC/APC',
        details: 'Dilakukan pengetesan OTDR pada port 01 s/d 08. Redaman port 08 terindikasi tinggi (-23.8 dBm) akibat tekukan kabel patchcord di tray bawah. Direncanakan re-routing pada jadwal maintenance berikutnya.',
        measuredLossBefore: 0.58,
        measuredLossAfter: 0.52,
      },
      {
        id: 'MNT-KLJ-2026-074',
        ticketNumber: 'PRV-MNT-2026-0612',
        date: '15 Agu 2026',
        timestamp: '01:30 WIB',
        category: 'Hardware & Power',
        technicians: 'Farhan Maulana (Power & Facilities)',
        status: 'Verified',
        impact: 'Maintenance Window (Bypass to Genset 01:30 - 03:00)',
        summary: 'Preventive maintenance baterai UPS Liebert 20kVA dan uji beban otomatis ATS Genset',
        details: 'Pengujian kapasitas baterai 32 blok VRLA 12V 100Ah. Hasil battery load test 98% kapasitas nominal. Pengujian transfer ATS ke genset Cummins berdurasi 18 detik berjalan mulus tanpa drop tegangan DC ODF.',
      },
      {
        id: 'MNT-KLJ-2026-059',
        ticketNumber: 'SPL-MNT-2026-0428',
        date: '02 Jul 2026',
        timestamp: '10:00 WIB',
        category: 'Splicing & Patching',
        technicians: 'Hendra Saputra & Dimas Eko (Splicing Unit 1)',
        status: 'Completed',
        impact: 'Zero Downtime',
        summary: 'Penyambungan core baru (Fusion Splicing) untuk pelanggan SID-2024-MLG-0108',
        details: 'Core #6 pada tray 1 berhasil disambung ke OTB pigtail LC/APC menggunakan Fujikura 90S+. Estimasi redaman sambungan 0.02 dB per titik splice. Bersih dari kotoran konektor dengan One-Click Cleaner.',
        measuredLossBefore: 0.85,
        measuredLossAfter: 0.28,
      },
      {
        id: 'MNT-KLJ-2026-031',
        ticketNumber: 'PRV-MNT-2026-0210',
        date: '14 Mei 2026',
        timestamp: '09:00 WIB',
        category: 'Preventive',
        technicians: 'Tim Pemeliharaan Regional Malang',
        status: 'Completed',
        impact: 'Zero Downtime',
        summary: 'Pembersihan ferrule konektor, inspeksi kebersihan ruang shelter, filter PAC AC',
        details: 'Pembersihan debu pada seluruh tray ODF 1-4. Filter udara unit pendingin ruangan diganti. Suhu ruangan terpantau stabil pada 20.4°C.',
      },
    ],
  },
  'NODE-SGS-01': {
    nodeId: 'NODE-SGS-01',
    nodeCode: 'POP-SINGOSARI',
    tierClassification: 'Tier 2 - Central Backbone POP & KEK Gateway',
    siteName: 'Shelter Hub KEK Singosari Gateway',
    address: 'Jl. Raya Singosari KM 14, Pagentan, Kec. Singosari, Kab. Malang, Jawa Timur 65153',
    elevationMasl: 485,
    picName: 'Rahmat Hidayat (NOC Singosari)',
    picPhone: '+62 813-9876-5432',
    odfRackModel: 'Corning Centrix 96-Port High-Density Optical Frame',
    cabinetSlot: 'Rack B-01, Unit U12-U20',
    powerSystem: {
      mainSupply: 'PLN 16.5 kVA Dedicated KEK Substation',
      upsModel: 'APC Smart-UPS RT 10 kVA On-Line',
      batteryBackupHours: 5.2,
      batteryHealthPercent: 96,
      atsGenerator: 'Automatic ATS Perkins 30 kVA Genset',
    },
    climateControl: {
      roomTempC: 21.0,
      humidityPercent: 52,
      coolingSystem: 'Dual Split Inverter 2 PK + Automatic Alternator',
      fireProtection: 'Aerosol Fire Suppression + Optical Smoke Sensor',
      status: 'Optimal',
    },
    opticalTransmission: {
      backhaulBandwidth: '40 Gbps Direct Trunk Surabaya - Singosari Gateway',
      dwdmModel: 'ZTE ZXONE 9700 Metro DWDM',
      channelGrid: '100 GHz ITU-T C-Band 40 Channels',
      averageAttenuationDbm: -15.1,
      averageLatencyMs: 1.4,
      protectionSwitchTimeMs: 28,
    },
    coreBreakdown: {
      total: 96,
      active: 58,
      spareDark: 22,
      reservedProtection: 14,
      degradedWarning: 2,
    },
    ports: [
      {
        id: 'PORT-SGS-01',
        portNumber: 1,
        trayNumber: 1,
        portLabel: 'T1-P01',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1550 nm (DWDM C31)',
        assignedCircuit: 'BONE-SBY-SGS-40G',
        serviceType: 'Direct Backbone Surabaya Gateway',
        customerOrUplink: 'Surabaya Trunk Core Primary',
        txPowerDbm: 2.1,
        rxPowerDbm: -15.8,
        insertionLossDb: 0.19,
        status: 'Active',
      },
      {
        id: 'PORT-SGS-02',
        portNumber: 2,
        trayNumber: 1,
        portLabel: 'T1-P02',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1550 nm (DWDM C32)',
        assignedCircuit: 'BONE-LWG-SGS-10G',
        serviceType: 'Interkoneksi Lawang - Singosari',
        customerOrUplink: 'POP Lawang Transit Hub',
        txPowerDbm: 1.6,
        rxPowerDbm: -16.8,
        insertionLossDb: 0.22,
        status: 'Active',
      },
      {
        id: 'PORT-SGS-03',
        portNumber: 3,
        trayNumber: 1,
        portLabel: 'T1-P03',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'FDR-SGS-BLM-01',
        serviceType: 'Distribution Feeder 10G',
        customerOrUplink: 'POP Blimbing Central Industrial',
        txPowerDbm: 1.7,
        rxPowerDbm: -18.2,
        insertionLossDb: 0.25,
        status: 'Active',
      },
      {
        id: 'PORT-SGS-04',
        portNumber: 4,
        trayNumber: 1,
        portLabel: 'T1-P04',
        connectorType: 'SC/UPC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'SID-2024-KEK-001',
        serviceType: 'Dedicated Internet 2 Gbps',
        customerOrUplink: 'KEK Singhasari Data Center & IT Park',
        txPowerDbm: 1.2,
        rxPowerDbm: -17.5,
        insertionLossDb: 0.23,
        status: 'Active',
      },
      {
        id: 'PORT-SGS-05',
        portNumber: 5,
        trayNumber: 1,
        portLabel: 'T1-P05',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'RING-SGS-BTU-PROT',
        serviceType: 'Ring Loop Protection Batu North',
        customerOrUplink: 'POP Batu Interconnect Failover',
        txPowerDbm: 1.4,
        rxPowerDbm: -18.0,
        insertionLossDb: 0.24,
        status: 'Reserved',
      },
      {
        id: 'PORT-SGS-06',
        portNumber: 6,
        trayNumber: 2,
        portLabel: 'T2-P01',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 / 1550 nm',
        assignedCircuit: 'SPARE-SGS-DARK-01',
        serviceType: 'Dark Fiber Cadangan',
        customerOrUplink: 'Tersedia / Siap Digunakan',
        txPowerDbm: 0.0,
        rxPowerDbm: 0.0,
        insertionLossDb: 0.16,
        status: 'Spare',
      },
    ],
    maintenanceLogs: [
      {
        id: 'MNT-SGS-2026-042',
        ticketNumber: 'PRV-MNT-2026-0811',
        date: '22 Sep 2026',
        timestamp: '11:15 WIB',
        category: 'Preventive',
        technicians: 'Rahmat Hidayat & Deni Kurniawan',
        status: 'Completed',
        impact: 'Zero Downtime',
        summary: 'Pemeriksaan rutin ODF Singosari & uji fungsi pendingin ruangan',
        details: 'Pengecekan temperatur ruang (21°C), pengukuran tegangan catu daya DC ODF 48.2V, pengecekan visual kabel jumper patchcord.',
      },
      {
        id: 'MNT-SGS-2026-027',
        ticketNumber: 'OTD-MNT-2026-0518',
        date: '10 Jul 2026',
        timestamp: '14:40 WIB',
        category: 'OTDR Calibration',
        technicians: 'Tim Fiber Optik Singosari',
        status: 'Completed',
        impact: 'Zero Downtime',
        summary: 'Uji redaman end-to-end jalur kabel Singosari - Blimbing',
        details: 'Hasil pengukuran OTDR 6.8 km menunjukkan redaman rata-rata 0.24 dB/km, total redaman -18.2 dBm memenuhi standar SLA.',
        measuredLossBefore: 0.31,
        measuredLossAfter: 0.24,
      },
    ],
  },
  'NODE-BTU-01': {
    nodeId: 'NODE-BTU-01',
    nodeCode: 'POP-BATU',
    tierClassification: 'Tier 2 - Central Backbone POP Kota Wisata',
    siteName: 'Shelter POP Batu Alun-Alun',
    address: 'Jl. Panglima Sudirman No. 45, Pesanggrahan, Kec. Batu, Kota Batu 65313',
    elevationMasl: 875,
    picName: 'Gilang Ramadhan (NOC Kota Batu)',
    picPhone: '+62 821-4567-8901',
    odfRackModel: 'Rittal TS8 IT Network Rack with 96-Port ODF',
    cabinetSlot: 'Cabinet C-01, Unit U10-U18',
    powerSystem: {
      mainSupply: 'PLN 13.2 kVA Batu Tourist Area Grid',
      upsModel: 'Eaton 9PX 8000i On-Line 8 kVA',
      batteryBackupHours: 4.8,
      batteryHealthPercent: 95,
      atsGenerator: 'ATS Yanmar 20 kVA Diesel Generator',
    },
    climateControl: {
      roomTempC: 19.8,
      humidityPercent: 55,
      coolingSystem: 'Daikin Dual Inverter 1.5 PK',
      fireProtection: 'Optical Smoke Detector + CO2 Portable System',
      status: 'Optimal',
    },
    opticalTransmission: {
      backhaulBandwidth: '20 Gbps Backbone Ring Loop Barat',
      dwdmModel: 'Huawei OptiX OSN 1800 V Metro Optical',
      channelGrid: '100 GHz C-Band',
      averageAttenuationDbm: -16.4,
      averageLatencyMs: 1.8,
      protectionSwitchTimeMs: 32,
    },
    coreBreakdown: {
      total: 96,
      active: 64,
      spareDark: 16,
      reservedProtection: 12,
      degradedWarning: 4,
    },
    ports: [
      {
        id: 'PORT-BTU-01',
        portNumber: 1,
        trayNumber: 1,
        portLabel: 'T1-P01',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1550 nm',
        assignedCircuit: 'BONE-SGS-BTU-10G',
        serviceType: 'Backbone Link Singosari - Batu',
        customerOrUplink: 'POP Singosari Gateway',
        txPowerDbm: 2.0,
        rxPowerDbm: -16.4,
        insertionLossDb: 0.20,
        status: 'Active',
      },
      {
        id: 'PORT-BTU-02',
        portNumber: 2,
        trayNumber: 1,
        portLabel: 'T1-P02',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'FDR-BTU-BMJ-01',
        serviceType: 'Sub Feeder Bumiaji Wisata',
        customerOrUplink: 'POP Sub Bumiaji Wisata',
        txPowerDbm: 1.5,
        rxPowerDbm: -17.2,
        insertionLossDb: 0.22,
        status: 'Active',
      },
      {
        id: 'PORT-BTU-03',
        portNumber: 3,
        trayNumber: 1,
        portLabel: 'T1-P03',
        connectorType: 'SC/UPC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'SID-2024-BTU-089',
        serviceType: 'Metro-E Dedicated 1 Gbps',
        customerOrUplink: 'Jatim Park Group Central Office',
        txPowerDbm: 0.8,
        rxPowerDbm: -18.4,
        insertionLossDb: 0.26,
        status: 'Active',
      },
    ],
    maintenanceLogs: [
      {
        id: 'MNT-BTU-2026-039',
        ticketNumber: 'PRV-MNT-2026-0740',
        date: '18 Sep 2026',
        timestamp: '13:00 WIB',
        category: 'Preventive',
        technicians: 'Gilang Ramadhan',
        status: 'Completed',
        impact: 'Zero Downtime',
        summary: 'Pemeriksaan rutin perlindungan kelembaban dan ODF shelter Batu',
        details: 'Kondisi shelter dataran tinggi (kelembaban 55%) terkontrol baik oleh dehumidifier. Suhu 19.8°C normal.',
      },
    ],
  },
  'NODE-MLG-SKN': {
    nodeId: 'NODE-MLG-SKN',
    nodeCode: 'POP-SUKUN',
    tierClassification: 'Tier 3 - Access Distribution POP Metro Selatan',
    siteName: 'Shelter Sukun Flyover Hub',
    address: 'Jl. S. Supriadi No. 88, Kec. Sukun, Kota Malang, Jawa Timur 65147',
    elevationMasl: 430,
    picName: 'Dwi Prasetyo (Field Engineer Sukun)',
    picPhone: '+62 857-1234-5678',
    odfRackModel: 'Outdoor Weatherproof IP65 96-Core ODF Cabinet',
    cabinetSlot: 'Cabinet SKN-ODF-01',
    powerSystem: {
      mainSupply: 'PLN 11 kVA Tarip Industri',
      upsModel: 'Socomec Masterys 6 kVA',
      batteryBackupHours: 3.5,
      batteryHealthPercent: 88,
      atsGenerator: 'Mobile Genset 15 kVA Ready-to-Deploy',
    },
    climateControl: {
      roomTempC: 24.2,
      humidityPercent: 62,
      coolingSystem: 'Heavy-Duty Industrial Cabinet Cooler',
      fireProtection: 'Dry Powder Automated Extinguisher',
      status: 'Warning',
    },
    opticalTransmission: {
      backhaulBandwidth: '10 Gbps Feeder Uplink to Klojen',
      dwdmModel: 'Metro CWDM 8-Channel Passive Mux',
      channelGrid: '20 nm CWDM Band',
      averageAttenuationDbm: -21.4,
      averageLatencyMs: 2.1,
      protectionSwitchTimeMs: 45,
    },
    coreBreakdown: {
      total: 96,
      active: 48,
      spareDark: 24,
      reservedProtection: 12,
      degradedWarning: 12,
    },
    ports: [
      {
        id: 'PORT-SKN-01',
        portNumber: 1,
        trayNumber: 1,
        portLabel: 'T1-P01',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'FDR-MLG-KLJ-SKN-01',
        serviceType: 'Feeder Trunk from Master Hub Klojen',
        customerOrUplink: 'POP Klojen Sentral',
        txPowerDbm: -0.8,
        rxPowerDbm: -22.4,
        insertionLossDb: 0.48,
        status: 'Warning',
      },
      {
        id: 'PORT-SKN-02',
        portNumber: 2,
        trayNumber: 1,
        portLabel: 'T1-P02',
        connectorType: 'SC/UPC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'UPLINK-OLT-SKN-01',
        serviceType: 'FTTH OLT Uplink 10G',
        customerOrUplink: 'Cluster Residensial Sukun Permai',
        txPowerDbm: 1.1,
        rxPowerDbm: -19.5,
        insertionLossDb: 0.28,
        status: 'Active',
      },
      {
        id: 'PORT-SKN-03',
        portNumber: 3,
        trayNumber: 1,
        portLabel: 'T1-P03',
        connectorType: 'LC/APC',
        fiberStandard: 'G.652.D',
        coreDiameter: '9/125 µm',
        wavelength: '1310 nm',
        assignedCircuit: 'FDR-SKN-KPJ-01',
        serviceType: 'Feeder Trunk to Kepanjen',
        customerOrUplink: 'POP Kepanjen Gateway',
        txPowerDbm: 0.9,
        rxPowerDbm: -19.8,
        insertionLossDb: 0.31,
        status: 'Active',
      },
    ],
    maintenanceLogs: [
      {
        id: 'MNT-SKN-2026-015',
        ticketNumber: 'WRN-MNT-2026-0312',
        date: '25 Sep 2026',
        timestamp: '16:00 WIB',
        category: 'OTDR Calibration',
        technicians: 'Dwi Prasetyo & Tim Patroli',
        status: 'Scheduled',
        impact: 'Scheduled Maintenance (29 Sep 2026)',
        summary: 'Pengecekan redaman tinggi (-22.4 dBm) pada konektor ODF Tray 1',
        details: 'Ditemukan tekukan kabel serat optik di dekat jembatan flyover akibat vibrasi kendaraan berat. Dijadwalkan perbaikan slack kabel dan re-splicing.',
        measuredLossBefore: 0.65,
        measuredLossAfter: 0.48,
      },
    ],
  },
};

/**
 * Helper to get or generate full technical data profile for any node
 */
export function getNodeTechnicalProfile(node: NetworkNode): NodeTechnicalProfile {
  if (NODE_TECHNICAL_PROFILES[node.id]) {
    return NODE_TECHNICAL_PROFILES[node.id];
  }

  // Deterministic fallback based on node attributes
  const isBackbone = node.type === 'SUPER_BACKBONE' || node.type === 'POP_BACKBONE';
  const tier = node.type === 'SUPER_BACKBONE'
    ? 'Tier 1 - Super Core Gateway'
    : node.type === 'POP_BACKBONE'
    ? 'Tier 2 - Central Backbone POP'
    : 'Tier 3 - Access Distribution Node';

  const used = node.usedCores;
  const capacity = node.capacityCores;
  const spare = Math.max(0, capacity - used);
  const active = Math.round(used * 0.75);
  const reserved = Math.round(used * 0.20);
  const degraded = Math.max(0, used - active - reserved);

  const generatedPorts: FiberPortSpec[] = Array.from({ length: 12 }, (_, i) => {
    const portNum = i + 1;
    const trayNum = portNum <= 6 ? 1 : 2;
    const isSpare = portNum > 8;
    const isWarn = node.status === 'Warning' && portNum === 7;
    const isResv = portNum === 6;

    let portStatus: 'Active' | 'Spare' | 'Reserved' | 'Warning' = 'Active';
    if (isWarn) portStatus = 'Warning';
    else if (isResv) portStatus = 'Reserved';
    else if (isSpare) portStatus = 'Spare';

    return {
      id: `PORT-${node.code}-${String(portNum).padStart(2, '0')}`,
      portNumber: portNum,
      trayNumber: trayNum,
      portLabel: `T${trayNum}-P${String(portNum).padStart(2, '0')}`,
      connectorType: (portNum % 3 === 0 ? 'SC/UPC' : 'LC/APC') as 'LC/APC' | 'SC/UPC',
      fiberStandard: 'G.652.D',
      coreDiameter: '9/125 µm',
      wavelength: portNum <= 4 ? '1550 nm (DWDM/CWDM)' : '1310 nm Single Mode',
      assignedCircuit: isSpare ? `SPARE-DARK-${portNum}` : `TRK-${node.code}-PORT-${portNum}`,
      serviceType: isSpare ? 'Dark Fiber Spare' : isBackbone ? 'Trunk Transmission 10G/40G' : 'FTTH Metro Distribution',
      customerOrUplink: isSpare ? 'Tersedia untuk ekspansi' : `Koneksi Uplink ${node.connections[i % node.connections.length] || 'Gateway'}`,
      txPowerDbm: Number((1.5 + (i * 0.2) % 1.5).toFixed(1)),
      rxPowerDbm: Number((-17.0 - (i * 0.7) % 5).toFixed(1)),
      insertionLossDb: isWarn ? 0.48 : Number((0.18 + (i * 0.02)).toFixed(2)),
      status: portStatus,
    };
  });

  const generatedMaintenance: NodeMaintenanceRecord[] = [
    {
      id: `MNT-${node.code}-001`,
      ticketNumber: `PRV-${node.code}-2026-09`,
      date: '24 Sep 2026',
      timestamp: '10:30 WIB',
      category: 'Preventive',
      technicians: 'Tim Patroli Pemeliharaan Regional',
      status: 'Completed',
      impact: 'Zero Downtime',
      summary: `Inspeksi visual ODF dan pembersihan konektor optik ${node.code}`,
      details: 'Pemeriksaan rutin kelayakan patchcord dan grounding petir shelter. Seluruh indikator optik dalam parameter normal.',
    },
    {
      id: `MNT-${node.code}-002`,
      ticketNumber: `OTD-${node.code}-2026-07`,
      date: '12 Jul 2026',
      timestamp: '14:00 WIB',
      category: 'OTDR Calibration',
      technicians: 'NOC Malang Lead Technician',
      status: 'Completed',
      impact: 'Zero Downtime',
      summary: `Pengukuran redaman refleksi OTDR pada jalur feeder ${node.name}`,
      details: 'Evaluasi event redaman dan splice loss sepanjang kabel optik. Nilai loss rata-rata 0.22 dB/km memenuhi standar Telko.',
      measuredLossBefore: 0.35,
      measuredLossAfter: 0.22,
    },
  ];

  return {
    nodeId: node.id,
    nodeCode: node.code,
    tierClassification: tier,
    siteName: `Shelter Distribusi ${node.name}`,
    address: `Kawasan ${node.region}, Jawa Timur (Koordinat ${node.lat.toFixed(4)}, ${node.lng.toFixed(4)})`,
    elevationMasl: Math.round(420 + Math.abs(node.lat) * 20),
    picName: 'Agus Setiawan, S.Kom. (Field PIC)',
    picPhone: '+62 812-7890-1234',
    odfRackModel: `Modular Fiber ODF-${node.capacityCores} Rack 19"`,
    cabinetSlot: `Cabinet R-${node.code.replace('POP-', '')}, U14-U22`,
    powerSystem: {
      mainSupply: 'PLN Dedicated 13.2 kVA Redundant Feeder',
      upsModel: 'Liebert GXT5 6 kVA Online UPS',
      batteryBackupHours: 4.5,
      batteryHealthPercent: 96,
      atsGenerator: 'Automatic ATS Genset 20 kVA Backup',
    },
    climateControl: {
      roomTempC: 21.5,
      humidityPercent: 50,
      coolingSystem: 'Split Precision Inverter AC N+1',
      fireProtection: 'Smoke Optical Detector + FM200 Clean Gas',
      status: node.status === 'Warning' ? 'Warning' : 'Optimal',
    },
    opticalTransmission: {
      backhaulBandwidth: isBackbone ? '40 Gbps - 100 Gbps Backbone' : '10 Gbps Metro Feeder',
      dwdmModel: isBackbone ? 'OTN DWDM 100G Multi-Channel' : 'CWDM Multi-Service Platform',
      channelGrid: '50 GHz / 100 GHz ITU-T',
      averageAttenuationDbm: node.status === 'Warning' ? -21.4 : -16.2,
      averageLatencyMs: 1.6,
      protectionSwitchTimeMs: 30,
    },
    coreBreakdown: {
      total: capacity,
      active,
      spareDark: spare,
      reservedProtection: reserved,
      degradedWarning: degraded,
    },
    ports: generatedPorts,
    maintenanceLogs: generatedMaintenance,
  };
}
