import { INITIAL_NETWORK_NODES, INITIAL_RINGS } from '../data/initialData';
import { MapFilterTarget, NetworkNode, RingNetworkItem } from '../types';

const KEYWORD_NODE_RULES: { keywords: string[]; nodeId: string }[] = [
  { keywords: ['SINGOSARI', 'SGS'], nodeId: 'NODE-ULP-SGS' },
  { keywords: ['LAWANG', 'LWG', 'GRIYA.HUSADA.SENTUL', 'SENTUL'], nodeId: 'NODE-GI-LWG' },
  { keywords: ['SIDOREJO', 'SDR', 'TUMPANG'], nodeId: 'NODE-TK4-SDR' },
  { keywords: ['SENGKALING', 'SKL', 'NGENEP', 'KARANGPLOSO', 'SPRINGHILL'], nodeId: 'NODE-ODC-SKL' },
  { keywords: ['MULYOAGUNG', 'MLY'], nodeId: 'NODE-TK4-MLY' },
  { keywords: ['BEGAWAN', 'BGW'], nodeId: 'NODE-ODC-BGW' },
  { keywords: ['BATU', 'JUNREJO', 'PUJON'], nodeId: 'NODE-ULP-BATU' },
  { keywords: ['DINOYO', 'DNY', 'BENDUNGAN.SUTAMI', 'MERTOJOYO'], nodeId: 'NODE-ULP-DNY' },
  { keywords: ['BLIMBING', 'BLM', 'POLEHAN', 'ARGOSARI', 'KEMANTREN'], nodeId: 'NODE-ULP-BLM' },
  { keywords: ['UP3', 'MALANG.KOTA'], nodeId: 'NODE-UP3-MLG' },
  {
    keywords: ['KEPANJEN', 'KPJ', 'KPN', 'PAKISAJI', 'SUMBERTEMPUR', 'NGAJUM', 'SUKOHARJO'],
    nodeId: 'NODE-ULP-KPJ',
  },
  {
    keywords: ['GONDANGLEGI', 'GDL', 'TALANGSUKO', 'CODO', 'SUWARU', 'SEPANJANG', 'JERU.TIMUR', 'ADIREJO'],
    nodeId: 'NODE-ULP-GDL',
  },
  {
    keywords: ['DAMPIT', 'DMP', 'TANGGUNG.TUREN', 'WANDANPURO', 'GEDOG.WETAN'],
    nodeId: 'NODE-ULP-DMP',
  },
  {
    keywords: ['SUMBERPUCUNG', 'SBP', 'SUMBER.MARON', 'SIDOMULYO', 'SUMBERNGEPOH', 'KAUMREJO'],
    nodeId: 'NODE-ULP-SBP',
  },
  { keywords: ['KEBON', 'KBG', 'KEBONAGUNG'], nodeId: 'NODE-GI-KBG' },
];

export interface TopologyMatch {
  node: NetworkNode;
  rings: RingNetworkItem[];
  primaryRing: RingNetworkItem;
}

export function resolveTopologyForHostname(
  hostnameOlt: string,
  schematicE2E?: string,
  keterangan?: string
): TopologyMatch {
  const haystack = `${hostnameOlt} ${schematicE2E || ''} ${keterangan || ''}`.toUpperCase();

  let matchedNode: NetworkNode | undefined;
  for (const rule of KEYWORD_NODE_RULES) {
    if (rule.keywords.some(kw => haystack.includes(kw))) {
      matchedNode = INITIAL_NETWORK_NODES.find(n => n.id === rule.nodeId);
      if (matchedNode) break;
    }
  }

  // Fallback to Titik 0 GI Kebon Agung
  const node =
    matchedNode ||
    INITIAL_NETWORK_NODES.find(n => n.id === 'NODE-GI-KBG') ||
    INITIAL_NETWORK_NODES[0];

  const rings = INITIAL_RINGS.filter(r => r.nodes.some(rn => rn.id === node.id));
  const primaryRing = rings[0] || INITIAL_RINGS[0];

  return { node, rings, primaryRing };
}

export function doesHostnameMatchMapTarget(
  hostnameOlt: string,
  schematicE2E: string | undefined,
  keterangan: string,
  mapTarget: MapFilterTarget
): boolean {
  const match = resolveTopologyForHostname(hostnameOlt, schematicE2E, keterangan);

  if (mapTarget.type === 'node') {
    if (match.node.id === mapTarget.id || match.node.code === mapTarget.code) {
      return true;
    }
    const cleanCode = mapTarget.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanHost = hostnameOlt.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanHost.includes(cleanCode);
  }

  if (mapTarget.type === 'segment') {
    const nodeIds = mapTarget.nodeIds || [];
    if (nodeIds.includes(match.node.id)) {
      return true;
    }
    const segCode = mapTarget.code.toLowerCase();
    return `${hostnameOlt} ${schematicE2E || ''}`.toLowerCase().includes(segCode);
  }

  return true;
}
