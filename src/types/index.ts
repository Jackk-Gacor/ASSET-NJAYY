export type UserRole = 
  | 'Admin'
  | 'Tim Data'
  | 'Engineering'
  | 'Field'
  | 'Supervisor'
  | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  department: string;
}

export type MalangRegion = 
  | 'Malang Kota'
  | 'Kota Batu'
  | 'Kepanjen (Malang Selatan)'
  | 'Singosari (Malang Utara)'
  | 'Lawang'
  | 'Turen & Dampit';

export type CoreType = 'Uplink' | 'Feeder' | 'Distribution' | 'Backbone';

export type CoreStatus = 'Approved' | 'WIG' | 'In Review' | 'Pending Field' | 'Draft';

export interface CoreDocuments {
  kmz: boolean;
  visio: boolean;
  gdb: boolean;
  spreadsheet: boolean;
  kmzFilename?: string;
  visioFilename?: string;
  gdbFilename?: string;
  sheetFilename?: string;
}

export interface DataCoreItem {
  id: string;
  hostname: string;
  oltName: string;
  popName: string;
  region: MalangRegion;
  type: CoreType;
  status: CoreStatus;
  pic: string;
  date: string;
  lastUpdate: string;
  relatedFeeder: string;
  relatedUplink: string;
  relatedRing: string;
  documents: CoreDocuments;
  coreCapacity: number;
  coreUsed: number;
  attenuationDbm: number;
  coordinates: {
    lat: number;
    lng: number;
    address: string;
  };
  notes?: string;
}

export interface FeederItem {
  id: string;
  feederCode: string;
  name: string;
  popOrigin: string;
  oltOrigin: string;
  totalCores: number;
  usedCores: number;
  lengthKm: number;
  status: 'Active' | 'Maintenance' | 'Planned';
  targetSid: string;
  relatedCoreId: string;
  lastAudit: string;
}

export interface UplinkItem {
  id: string;
  uplinkCode: string;
  oltHostname: string;
  popDestination: string;
  bandwidthGbps: number;
  status: 'Operational' | 'Standby' | 'Degraded';
  fiberType: string;
  gponPort: string;
  relatedCoreId: string;
  documentsCount: number;
}

export interface SidItem {
  id: string;
  sidNumber: string;
  customerName: string;
  serviceType: 'IP-VPN' | 'Metro-E' | 'Internet Dedicated' | 'FTTH Backhaul';
  relatedFeederId: string;
  relatedUplinkId: string;
  status: 'Active' | 'Survey' | 'Commissioning';
  bandwidthMbps: number;
  pic: string;
}

export interface FieldReportItem {
  id: string;
  pic: string;
  tanggal: string;
  wilayah: MalangRegion;
  lokasi: string;
  koordinat: string;
  jenisPekerjaan: 'Pengecekan Core' | 'Sambung Splice' | 'Patroli Jalur' | 'Roll Out' | 'Perapihan OTB' | 'Ukur Redaman OTDR';
  kondisi: 'Normal / Aman' | 'Kritis' | 'Redaman Tinggi' | 'Kabel Putus / Cut';
  status: 'Verified' | 'Need Action' | 'Pending Review';
  keterangan: string;
  redamanDbm: number;
  coreChecked: number;
  fotoType?: string;
}

export interface NetworkNode {
  id: string;
  code: string;
  name: string;
  type: 'SUPER_BACKBONE' | 'POP_BACKBONE' | 'POP_ACCESS' | 'OLT' | 'FDT';
  region: MalangRegion;
  x: number; // For SVG coordinates
  y: number;
  lat: number;
  lng: number;
  capacityCores: number;
  usedCores: number;
  status: 'Optimal' | 'Warning' | 'Standby';
  connections: string[]; // Connected Node IDs
}

export interface RingNetworkItem {
  id: string;
  ringName: string;
  region: string;
  nodes: { id: string; name: string; type: string }[];
  status: 'Protected' | 'Normal' | 'Degraded';
  totalFiber: number;
  backupRoute: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  type: 'create' | 'update' | 'approval' | 'field';
}
