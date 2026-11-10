import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import { RingNetworkItem } from '../../types';
import { INITIAL_NETWORK_NODES } from '../../data/initialData';
import {
  Compass,
  Layers,
  Activity,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface GoogleRingMapViewProps {
  ring: RingNetworkItem;
  onSelectNode?: (nodeId: string) => void;
}

// Helper Polyline component
const RingPolyline: React.FC<{
  path: google.maps.LatLngLiteral[];
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity?: number;
}> = ({ path, strokeColor, strokeWeight, strokeOpacity = 0.9 }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || path.length < 2) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      map,
      zIndex: 10,
    });

    polylineRef.current = polyline;
    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity]);

  return null;
};

// Map auto-fitter for ring bounds
const RingBoundsController: React.FC<{
  coords: google.maps.LatLngLiteral[];
  triggerFit: number;
}> = ({ coords, triggerFit }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || coords.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    coords.forEach(c => bounds.extend(c));
    map.fitBounds(bounds, 60);
  }, [map, coords, triggerFit]);

  return null;
};

export const GoogleRingMapView: React.FC<GoogleRingMapViewProps> = ({ ring, onSelectNode }) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [triggerFit, setTriggerFit] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Map ring nodes to coordinates
  const ringNodesWithCoords = useMemo(() => {
    return ring.nodes.map((rn, idx) => {
      const fullNode = INITIAL_NETWORK_NODES.find(n => n.id === rn.id);
      return {
        ...rn,
        index: idx + 1,
        lat: fullNode?.lat ?? -7.9785,
        lng: fullNode?.lng ?? 112.6318,
        code: fullNode?.code ?? rn.name,
        capacityCores: fullNode?.capacityCores ?? 96,
        usedCores: fullNode?.usedCores ?? 64,
        status: fullNode?.status ?? 'Optimal',
      };
    });
  }, [ring]);

  // Form closed-loop coordinates for the polyline: node1 -> node2 -> ... -> nodeN -> node1
  const closedLoopPath = useMemo(() => {
    if (ringNodesWithCoords.length === 0) return [];
    const pts = ringNodesWithCoords.map(n => ({ lat: n.lat, lng: n.lng }));
    // Append first point to close loop
    pts.push({ lat: ringNodesWithCoords[0].lat, lng: ringNodesWithCoords[0].lng });
    return pts;
  }, [ringNodesWithCoords]);

  // Default center
  const defaultCenter = useMemo(() => {
    if (ringNodesWithCoords.length === 0) return { lat: -7.9785, lng: 112.6318 };
    const avgLat = ringNodesWithCoords.reduce((acc, n) => acc + n.lat, 0) / ringNodesWithCoords.length;
    const avgLng = ringNodesWithCoords.reduce((acc, n) => acc + n.lng, 0) / ringNodesWithCoords.length;
    return { lat: avgLat, lng: avgLng };
  }, [ringNodesWithCoords]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAb3UFkQhSE3-X5U9SA2f3l59PKduZevxI';

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 select-none">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={defaultCenter}
          defaultZoom={12}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <RingBoundsController
            coords={ringNodesWithCoords.map(n => ({ lat: n.lat, lng: n.lng }))}
            triggerFit={triggerFit}
          />

          {/* Render Ring Closed Loop Polyline */}
          <RingPolyline
            path={closedLoopPath}
            strokeColor="#10b981"
            strokeWeight={4}
            strokeOpacity={0.9}
          />

          {/* Render Markers for Ring POP Nodes */}
          {ringNodesWithCoords.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isHub = node.type === 'Hub';

            return (
              <AdvancedMarker
                key={`ring-marker-${node.id}`}
                position={{ lat: node.lat, lng: node.lng }}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  if (onSelectNode) onSelectNode(node.id);
                }}
                zIndex={isSelected ? 60 : isHub ? 40 : 25}
              >
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Outer Pulsing Beacon for Hub / Selected */}
                  {(isHub || isSelected) && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-500/35 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-lg border text-white transition-all transform hover:scale-110 ${
                      isSelected
                        ? 'bg-blue-600 border-white ring-2 ring-blue-300 scale-105'
                        : isHub
                        ? 'bg-emerald-600 border-emerald-300 ring-2 ring-emerald-400/40'
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                      {node.index}
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-bold font-mono leading-tight whitespace-nowrap">
                        {node.name}
                      </span>
                      <span className="text-[9px] text-emerald-200 font-mono">
                        [{node.type}]
                      </span>
                    </div>
                  </div>

                  {/* Marker Arrow Point */}
                  <div
                    className={`w-0 h-0 border-x-4 border-x-transparent border-t-5 ${
                      isSelected
                        ? 'border-t-blue-600'
                        : isHub
                        ? 'border-t-emerald-600'
                        : 'border-t-slate-800'
                    }`}
                  />
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      {/* Floating Controls at Top Left */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-200 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          {(
            [
              { id: 'roadmap', label: 'Jalan' },
              { id: 'satellite', label: 'Satelit' },
              { id: 'terrain', label: 'Topografi' },
            ] as const
          ).map(t => (
            <button
              key={t.id}
              onClick={() => setMapType(t.id)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
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
          onClick={() => setTriggerFit(prev => prev + 1)}
          className="px-2 py-1 text-slate-700 hover:bg-slate-100 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
          title="Fokuskan tampilan ke seluruh rute ring loop"
        >
          <Compass className="w-3 h-3 text-emerald-600" />
          <span>Fokus Ring</span>
        </button>
      </div>

      {/* Floating Info Pill at Bottom Right */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-[11px] flex items-center gap-2 text-slate-800 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="font-semibold text-slate-900">Loop Tertutup 360°</span>
        <span className="text-slate-400">·</span>
        <span className="text-emerald-700 font-bold">{ring.totalFiber} Core</span>
      </div>
    </div>
  );
};
