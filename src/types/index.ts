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

export type E2EStatusReport = 'DONE' | 'PROGRESS';

export type E2EPic = 'DIMAS' | 'KANAYA' | 'JACK' | 'ALIFIA' | 'NOVI' | string;

export interface FeederItem {
  id: string;
  feederCode: string;
  hostnameOlt: string;
  statusReport: E2EStatusReport;
  actualDone: string;
  reportDone: string;
  pic: E2EPic;
  datacoreVisio?: string;
  datacoreVisioUrl?: string;
  mymaps?: string;
  mymapsUrl?: string;
  keterangan: string;
  relatedCoreId?: string;
}

export interface UplinkItem {
  id: string;
  uplinkCode: string;
  hostnameOlt: string;
  statusReport: E2EStatusReport;
  actualDone: string;
  reportDone: string;
  pic: E2EPic;
  datacoreVisio?: string;
  datacoreVisioUrl?: string;
  mymaps?: string;
  mymapsUrl?: string;
  schematicE2E?: string;
  schematicE2EUrl?: string;
  keterangan: string;
  relatedCoreId?: string;
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
  crmAssetCode?: string;
  address?: string;
  connectedCustomersCount?: number;
  picName?: string;
  picPhone?: string;
  picAvatar?: string;
  uptimeSla?: string;
}

export interface NetworkLink {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  name: string;
  code: string;
  type: 'BACKBONE' | 'FEEDER' | 'UPLINK' | 'RING';
  coreCapacity: number;
  coreUsed: number;
  lengthKm: number;
  attenuationDbm: number;
  status: 'Optimal' | 'Warning' | 'Maintenance' | 'Normal' | 'Degraded' | 'Down';
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

export interface MapFilterTarget {
  type: 'node' | 'segment';
  id: string;
  code: string;
  name: string;
  nodeIds?: string[]; // for segments: [fromNodeId, toNodeId]
}
