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
    const map = new Map<string, { lat: number; lng: number }>();
    nodes.forEach(n => map.set(n.id, { lat: n.lat, lng: n.lng }));
    return map;
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

          {/* Render Real GPS Fiber Optic Polylines */}
          {visibleLinks.map(link => {
            const fromCoord = nodeCoordsMap.get(link.fromNodeId);
            const toCoord = nodeCoordsMap.get(link.toNodeId);
            if (!fromCoord || !toCoord) return null;

            const isCut = cutLinks.includes(link.id);
            const isSelected = selectedLink?.id === link.id;
            const isTraced =
              traceResultPath.length > 1 &&
              traceResultPath.includes(link.fromNodeId) &&
              traceResultPath.includes(link.toNodeId);

            let strokeColor = '#38bdf8';
            if (link.type === 'BACKBONE') strokeColor = '#4f46e5';
            else if (link.type === 'FEEDER') strokeColor = '#0284c7';
            else if (link.type === 'RING') strokeColor = '#10b981';
            else if (link.type === 'UPLINK') strokeColor = '#06b6d4';

            return (
              <GoogleMapPolyline
                key={`gmap-link-${link.id}`}
                path={[fromCoord, toCoord]}
                strokeColor={strokeColor}
                strokeWeight={link.type === 'BACKBONE' ? 4 : 3}
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

            return (
              <AdvancedMarker
                key={`gmap-node-${node.id}`}
                position={{ lat: node.lat, lng: node.lng }}
                onClick={() => onSelectNode(node)}
                title={`${node.name} (${node.code})`}
                zIndex={isSelected ? 50 : isSuper ? 30 : 20}
              >
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Ping Animation for Selected Node */}
                  {(isSelected || isTraceStart || isTraceEnd) && (
                    <span className="absolute -inset-2 rounded-full bg-blue-500/40 animate-ping" />
                  )}

                  {/* Marker Pin Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-lg border text-white transition-all transform hover:scale-110 ${
                      isTraceStart
                        ? 'bg-emerald-600 border-emerald-400 ring-2 ring-emerald-300'
                        : isTraceEnd
                        ? 'bg-amber-600 border-amber-400 ring-2 ring-amber-300'
                        : isSelected
                        ? 'bg-blue-600 border-white ring-2 ring-blue-400 scale-105'
                        : isSuper
                        ? 'bg-indigo-700 border-indigo-300'
                        : isBackbone
                        ? 'bg-sky-600 border-sky-300'
                        : 'bg-emerald-600 border-emerald-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isWarning
                          ? 'bg-amber-300 animate-pulse'
                          : 'bg-white'
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono font-bold leading-tight uppercase whitespace-nowrap">
                        {node.code}
                      </span>
                    </div>
                  </div>

                  {/* Pin Point Arrow */}
                  <div
                    className={`w-0 h-0 border-x-4 border-x-transparent border-t-5 ${
                      isTraceStart
                        ? 'border-t-emerald-600'
                        : isTraceEnd
                        ? 'border-t-amber-600'
                        : isSelected
                        ? 'border-t-blue-600'
                        : isSuper
                        ? 'border-t-indigo-700'
                        : isBackbone
                        ? 'border-t-sky-600'
                        : 'border-t-emerald-600'
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
          Google Maps · Lapisan GIS Fiber Optik
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <span>Super Backbone Gateway (100G)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
          <span>POP Sentral Backbone Telko</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>POP Distribusi Akses / Ring Loop</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="w-3 h-0.5 bg-blue-500 rounded" />
          <span className="text-slate-500">Klik pin POP atau jalur untuk rincian teknis</span>
        </div>
      </div>
    </div>
  );
};
