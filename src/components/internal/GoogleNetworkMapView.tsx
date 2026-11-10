import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import { NetworkNode } from '../../types';
import { NetworkLink } from './NetworkMapView';
import {
  MapPin,
  Layers,
  Activity,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Maximize2,
  Route,
  Scissors,
  X,
  Database,
  Navigation,
} from 'lucide-react';

interface GoogleNetworkMapViewProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  cutLinks: string[];
  selectedNode: NetworkNode | null;
  selectedLink: NetworkLink | null;
  onSelectNode: (node: NetworkNode) => void;
  onSelectLink: (link: NetworkLink) => void;
  showBackbone: boolean;
  showFeeder: boolean;
  showUplink: boolean;
  showRing: boolean;
  interactiveMode: 'explore' | 'cut_sim' | 'trace';
  traceStartNode: NetworkNode | null;
  traceEndNode: NetworkNode | null;
  traceResultPath: string[];
}

// Polyline component for Google Maps
const GoogleMapPolyline: React.FC<{
  path: google.maps.LatLngLiteral[];
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity?: number;
  isCut?: boolean;
  isSelected?: boolean;
  isTraced?: boolean;
  onClick?: () => void;
}> = ({
  path,
  strokeColor,
  strokeWeight,
  strokeOpacity = 0.85,
  isCut = false,
  isSelected = false,
  isTraced = false,
  onClick,
}) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    const lineSymbol = isCut
      ? {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 3,
        }
      : undefined;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor: isCut ? '#ef4444' : isTraced ? '#10b981' : isSelected ? '#38bdf8' : strokeColor,
      strokeWeight: isSelected || isTraced ? strokeWeight + 3 : strokeWeight,
      strokeOpacity: isCut ? 0 : strokeOpacity,
      icons: isCut
        ? [
            {
              icon: lineSymbol,
              offset: '0',
              repeat: '12px',
            },
          ]
        : undefined,
      map,
      zIndex: isSelected || isTraced ? 20 : isCut ? 15 : 10,
    });

    if (onClick) {
      const listener = polyline.addListener('click', onClick);
      return () => {
        google.maps.event.removeListener(listener);
        polyline.setMap(null);
      };
    }

    polylineRef.current = polyline;
    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity, isCut, isSelected, isTraced, onClick]);

  return null;
};

// Polygon component for Administrative / GIS Area Boundaries
const GoogleMapPolygon: React.FC<{
  paths: google.maps.LatLngLiteral[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
}> = ({
  paths,
  strokeColor = '#ea580c',
  strokeWeight = 1.5,
  strokeOpacity = 0.85,
  fillColor = '#fed7aa',
  fillOpacity = 0.12,
}) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || paths.length < 3) return;

    const polygon = new google.maps.Polygon({
      paths,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      fillColor,
      fillOpacity,
      clickable: false,
      map,
      zIndex: 2,
    });

    polygonRef.current = polygon;
    return () => {
      polygon.setMap(null);
    };
  }, [map, paths, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity]);

  return null;
};

// District boundaries approximating Malang Raya administrative areas shown in screenshots
const GIS_DISTRICT_BOUNDARIES: { name: string; paths: google.maps.LatLngLiteral[] }[] = [
  {
    name: 'Sumberpucung & Lahor',
    paths: [
      { lat: -8.135, lng: 112.460 },
      { lat: -8.132, lng: 112.525 },
      { lat: -8.175, lng: 112.528 },
      { lat: -8.182, lng: 112.465 },
    ],
  },
  {
    name: 'Kepanjen Sentral',
    paths: [
      { lat: -8.110, lng: 112.545 },
      { lat: -8.105, lng: 112.605 },
      { lat: -8.158, lng: 112.610 },
      { lat: -8.162, lng: 112.548 },
    ],
  },
  {
    name: 'Gondanglegi & Pagelaran',
    paths: [
      { lat: -8.145, lng: 112.615 },
      { lat: -8.140, lng: 112.675 },
      { lat: -8.200, lng: 112.680 },
      { lat: -8.205, lng: 112.618 },
    ],
  },
  {
    name: 'Dampit & Tirtoyudo',
    paths: [
      { lat: -8.185, lng: 112.725 },
      { lat: -8.180, lng: 112.795 },
      { lat: -8.235, lng: 112.800 },
      { lat: -8.240, lng: 112.730 },
    ],
  },
  {
    name: 'Kota Batu',
    paths: [
      { lat: -7.840, lng: 112.495 },
      { lat: -7.835, lng: 112.565 },
      { lat: -7.895, lng: 112.570 },
      { lat: -7.900, lng: 112.500 },
    ],
  },
  {
    name: 'Dau & Sengkaling',
    paths: [
      { lat: -7.895, lng: 112.565 },
      { lat: -7.890, lng: 112.612 },
      { lat: -7.940, lng: 112.615 },
      { lat: -7.945, lng: 112.568 },
    ],
  },
  {
    name: 'Lowokwaru & Dinoyo',
    paths: [
      { lat: -7.925, lng: 112.600 },
      { lat: -7.920, lng: 112.645 },
      { lat: -7.960, lng: 112.648 },
      { lat: -7.962, lng: 112.602 },
    ],
  },
  {
    name: 'Klojen (Sentral Kota)',
    paths: [
      { lat: -7.960, lng: 112.615 },
      { lat: -7.955, lng: 112.655 },
      { lat: -7.995, lng: 112.658 },
      { lat: -8.000, lng: 112.618 },
    ],
  },
  {
    name: 'Blimbing',
    paths: [
      { lat: -7.915, lng: 112.635 },
      { lat: -7.910, lng: 112.675 },
      { lat: -7.955, lng: 112.680 },
      { lat: -7.958, lng: 112.638 },
    ],
  },
  {
    name: 'Singosari',
    paths: [
      { lat: -7.865, lng: 112.640 },
      { lat: -7.860, lng: 112.695 },
      { lat: -7.915, lng: 112.700 },
      { lat: -7.918, lng: 112.645 },
    ],
  },
  {
    name: 'Sidorejo & Jabung',
    paths: [
      { lat: -7.860, lng: 112.685 },
      { lat: -7.855, lng: 112.730 },
      { lat: -7.905, lng: 112.735 },
      { lat: -7.910, lng: 112.690 },
    ],
  },
  {
    name: 'Lawang',
    paths: [
      { lat: -7.810, lng: 112.670 },
      { lat: -7.805, lng: 112.725 },
      { lat: -7.860, lng: 112.728 },
      { lat: -7.865, lng: 112.675 },
    ],
  },
  {
    name: 'Pakisaji & Kebon Agung',
    paths: [
      { lat: -7.990, lng: 112.585 },
      { lat: -7.985, lng: 112.650 },
      { lat: -8.045, lng: 112.655 },
      { lat: -8.050, lng: 112.590 },
    ],
  },
];

// Traffic Layer component
const GoogleTrafficLayer: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (enabled) {
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);
      trafficLayerRef.current = trafficLayer;
      return () => {
        trafficLayer.setMap(null);
      };
    } else if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
      trafficLayerRef.current = null;
    }
  }, [map, enabled]);

  return null;
};

// Map Controller for Pan & Bounds
const MapBoundsController: React.FC<{
  nodes: NetworkNode[];
  selectedNode: NetworkNode | null;
  triggerFit: number;
}> = ({ nodes, selectedNode, triggerFit }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || nodes.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    nodes.forEach(n => bounds.extend({ lat: n.lat, lng: n.lng }));
    map.fitBounds(bounds, 50);
  }, [map, triggerFit]);

  useEffect(() => {
    if (!map || !selectedNode) return;
    map.panTo({ lat: selectedNode.lat, lng: selectedNode.lng });
    if (map.getZoom() && (map.getZoom() as number) < 13) {
      map.setZoom(13);
    }
  }, [map, selectedNode]);

  return null;
};

export const GoogleNetworkMapView: React.FC<GoogleNetworkMapViewProps> = ({
  nodes,
  links,
  cutLinks,
  selectedNode,
  selectedLink,
  onSelectNode,
  onSelectLink,
  showBackbone,
  showFeeder,
  showUplink,
  showRing,
  interactiveMode,
  traceStartNode,
  traceEndNode,
  traceResultPath,
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showDistrictPolygons, setShowDistrictPolygons] = useState(true);
  const [triggerFit, setTriggerFit] = useState(0);

  // Center of Malang Raya
  const defaultCenter = useMemo(() => ({ lat: -7.9785, lng: 112.6318 }), []);

  // Filter visible links based on layers
  const visibleLinks = useMemo(() => {
    return links.filter(link => {
      if (link.type === 'BACKBONE' && !showBackbone) return false;
      if (link.type === 'FEEDER' && !showFeeder) return false;
      if (link.type === 'UPLINK' && !showUplink) return false;
      if (link.type === 'RING' && !showRing) return false;
      return true;
    });
  }, [links, showBackbone, showFeeder, showUplink, showRing]);

  // Map nodes to dictionary for quick coordinate lookup
  const nodeCoordsMap = useMemo(() => {
    const record: Record<string, { lat: number; lng: number }> = {};
    nodes.forEach(n => {
      record[n.id] = { lat: n.lat, lng: n.lng };
    });
    return record;
  }, [nodes]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAb3UFkQhSE3-X5U9SA2f3l59PKduZevxI';

  return (
    <div className="relative w-full h-[640px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 select-none">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={defaultCenter}
          defaultZoom={11}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <GoogleTrafficLayer enabled={showTraffic} />
          <MapBoundsController nodes={nodes} selectedNode={selectedNode} triggerFit={triggerFit} />

          {/* Render GIS Administrative District Polygons (Orange Contours matching screenshots) */}
          {showDistrictPolygons &&
            GIS_DISTRICT_BOUNDARIES.map(district => (
              <GoogleMapPolygon
                key={`gis-district-${district.name}`}
                paths={district.paths}
                strokeColor="#ea580c"
                strokeWeight={1.5}
                strokeOpacity={0.8}
                fillColor="#fed7aa"
                fillOpacity={0.12}
              />
            ))}

          {/* Render Real GPS Fiber Optic Polylines in Fluorescent Magenta (#ff00ea / PLN Icon Plus GIS) */}
          {visibleLinks.map(link => {
            const fromCoord = nodeCoordsMap[link.fromNodeId];
            const toCoord = nodeCoordsMap[link.toNodeId];
            if (!fromCoord || !toCoord) return null;

            const isCut = cutLinks.includes(link.id);
            const isSelected = selectedLink?.id === link.id;
            const isTraced =
              traceResultPath.length > 1 &&
              traceResultPath.includes(link.fromNodeId) &&
              traceResultPath.includes(link.toNodeId);

            // Vibrant fluorescent magenta matching the user's GIS screenshot
            let strokeColor = '#ff00ea';
            let strokeW = link.type === 'BACKBONE' ? 4.5 : 3.5;

            if (isCut) {
              strokeColor = '#ef4444';
            } else if (isTraced) {
              strokeColor = '#10b981';
            } else if (isSelected) {
              strokeColor = '#06b6d4';
            } else if (link.id === 'LINK-GI-LWG-KBG') {
              strokeColor = '#d946ef'; // Magenta Super Backbone
              strokeW = 5.5;
            } else if (link.type === 'RING') {
              strokeColor = '#ec4899'; // Pink ring loop
            } else if (link.type === 'FEEDER') {
              strokeColor = '#e11499';
            }

            return (
              <GoogleMapPolyline
                key={`gmap-link-${link.id}`}
                path={[fromCoord, toCoord]}
                strokeColor={strokeColor}
                strokeWeight={strokeW}
                isCut={isCut}
                isSelected={isSelected}
                isTraced={isTraced}
                onClick={() => onSelectLink(link)}
              />
            );
          })}

          {/* Render POP Node Advanced Markers */}
          {nodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isTraceStart = traceStartNode?.id === node.id;
            const isTraceEnd = traceEndNode?.id === node.id;
            const isTraced = traceResultPath.includes(node.id);

            const isWarning = node.status === 'Warning';
            const isSuper = node.type === 'SUPER_BACKBONE';
            const isBackbone = node.type === 'POP_BACKBONE';
            const isTitikNol = node.id === 'NODE-GI-KBG';

            return (
              <AdvancedMarker
                key={`gmap-node-${node.id}`}
                position={{ lat: node.lat, lng: node.lng }}
                onClick={() => onSelectNode(node)}
                title={`${node.name} (${node.code})`}
                zIndex={isTitikNol ? 70 : isSelected ? 50 : isSuper ? 30 : 20}
              >
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Ping Animation for Titik Nol or Selected Node */}
                  {(isTitikNol || isSelected || isTraceStart || isTraceEnd) && (
                    <span
                      className={`absolute -inset-2.5 rounded-full animate-ping pointer-events-none ${
                        isTitikNol ? 'bg-purple-500/50' : 'bg-blue-500/40'
                      }`}
                    />
                  )}

                  {/* Marker Pin Badge with Authentic GIS Screenshot Aesthetic */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md shadow-md border transition-all transform hover:scale-110 ${
                      isTitikNol
                        ? 'bg-purple-900/90 border-purple-400 text-white ring-2 ring-purple-300'
                        : isSelected
                        ? 'bg-blue-600 border-white text-white ring-2 ring-blue-400 scale-105'
                        : isTraceStart
                        ? 'bg-emerald-600 border-emerald-300 text-white'
                        : isTraceEnd
                        ? 'bg-amber-600 border-amber-300 text-white'
                        : 'bg-white/95 border-slate-300 text-slate-900'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isTitikNol
                          ? 'bg-amber-300 ring-2 ring-purple-300 animate-pulse'
                          : isWarning
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-cyan-500 ring-2 ring-cyan-200'
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-bold leading-tight uppercase whitespace-nowrap tracking-tight">
                        {isTitikNol ? '★ GI-KEBONAGUNG_AREA45 (TITIK 0)' : node.code}
                      </span>
                    </div>
                  </div>

                  {/* Pin Point Arrow */}
                  <div
                    className={`w-0 h-0 border-x-3 border-x-transparent border-t-4 ${
                      isTitikNol
                        ? 'border-t-purple-800'
                        : isSelected
                        ? 'border-t-blue-600'
                        : 'border-t-slate-400'
                    }`}
                  />
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      {/* Floating Map Controls at Top Left */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(
            [
              { id: 'roadmap', label: 'Jalan' },
              { id: 'satellite', label: 'Satelit' },
              { id: 'hybrid', label: 'Hibrida' },
              { id: 'terrain', label: 'Topografi' },
            ] as const
          ).map(t => (
            <button
              key={t.id}
              onClick={() => setMapType(t.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapType === t.id
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowDistrictPolygons(!showDistrictPolygons)}
          className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors ${
            showDistrictPolygons
              ? 'bg-amber-50 text-amber-800 border border-amber-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Tampilkan / Sembunyikan Batas Wilayah Kecamatan (GIS Poligon Oranye)"
        >
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Zona Poligon GIS</span>
        </button>

        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors ${
            showTraffic
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Tampilkan / Sembunyikan Lapisan Lalu Lintas Real-time Google"
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Trafik Jalan</span>
        </button>

        <button
          onClick={() => setTriggerFit(prev => prev + 1)}
          className="px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
          title="Pusatkan peta ke seluruh wilayah Malang Raya"
        >
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Pusatkan Peta</span>
        </button>
      </div>

      {/* Map Legend Overlay at Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-200 text-[11px] space-y-1.5 text-slate-800 hidden sm:block">
        <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px]">
          PLN Icon Plus GIS · Standar Area 45
        </span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-[#ff00ea] rounded" />
          <span className="font-medium text-slate-700">Jalur Transmisi Optik (Magenta)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 border border-slate-400" />
          <span className="font-medium text-slate-700">POP ODC & Titik Distribusi (_AREA45)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-700 border border-purple-300" />
          <span className="font-medium text-slate-700">Titik 0 Sentral (GI Kebon Agung)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[10px] text-slate-500">Sesuai Dokumen GIS Gambar 1 & Gambar 2</span>
        </div>
      </div>
    </div>
  );
};
