import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { NetworkNode } from '../../types';
import { NetworkLink } from './NetworkMapView';
import {
  GripVertical,
  Minus,
  Maximize2,
  Compass,
  RotateCcw,
  Navigation,
  MapPin,
  Eye,
  Sliders,
} from 'lucide-react';

interface NetworkMiniMapProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  cutLinks: string[];
  selectedNode: NetworkNode | null;
  selectedLink: NetworkLink | null;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  onPanChange: (newPan: { x: number; y: number }) => void;
  onSelectNode: (node: NetworkNode) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const NetworkMiniMap: React.FC<NetworkMiniMapProps> = ({
  nodes,
  links,
  cutLinks,
  selectedNode,
  selectedLink,
  zoomLevel,
  panOffset,
  onPanChange,
  onSelectNode,
  containerRef,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [isDraggingViewport, setIsDraggingViewport] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; cardX: number; cardY: number }>({
    mouseX: 0,
    mouseY: 0,
    cardX: 0,
    cardY: 0,
  });

  // Calculate Viewport box dimensions in SVG space (700 x 620)
  const SVG_WIDTH = 700;
  const SVG_HEIGHT = 620;

  const viewportRect = useMemo(() => {
    const w = Math.min(SVG_WIDTH, SVG_WIDTH / zoomLevel);
    const h = Math.min(SVG_HEIGHT, SVG_HEIGHT / zoomLevel);
    const x = SVG_WIDTH / 2 - w / 2 - panOffset.x / zoomLevel;
    const y = SVG_HEIGHT / 2 - h / 2 - panOffset.y / zoomLevel;
    return { x, y, w, h };
  }, [zoomLevel, panOffset, SVG_WIDTH, SVG_HEIGHT]);

  // Center pan on given SVG coordinates
  const centerOnSvgPoint = useCallback(
    (svgX: number, svgY: number) => {
      const newPanX = (SVG_WIDTH / 2 - svgX) * zoomLevel;
      const newPanY = (SVG_HEIGHT / 2 - svgY) * zoomLevel;
      onPanChange({
        x: Math.round(newPanX),
        y: Math.round(newPanY),
      });
    },
    [SVG_WIDTH, SVG_HEIGHT, zoomLevel, onPanChange]
  );

  // Convert mini-map SVG click event to SVG coordinate space
  const handleMiniMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDraggingViewport) return;
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const svgX = (clickX / rect.width) * SVG_WIDTH;
    const svgY = (clickY / rect.height) * SVG_HEIGHT;

    centerOnSvgPoint(svgX, svgY);
  };

  // Dragging the viewport rectangle
  const handleViewportMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingViewport(true);
  };

  useEffect(() => {
    if (!isDraggingViewport) return;

    const handlePointerMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const svgX = (mouseX / rect.width) * SVG_WIDTH;
      const svgY = (mouseY / rect.height) * SVG_HEIGHT;

      centerOnSvgPoint(svgX, svgY);
    };

    const handlePointerUp = () => {
      setIsDraggingViewport(false);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isDraggingViewport, SVG_WIDTH, SVG_HEIGHT, centerOnSvgPoint]);

  // Dragging the mini-map card overlay inside container
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    const currentX = pos ? pos.x : cardRect.left - containerRect.left;
    const currentY = pos ? pos.y : cardRect.top - containerRect.top;

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cardX: currentX,
      cardY: currentY,
    };
    setIsDraggingCard(true);
  };

  useEffect(() => {
    if (!isDraggingCard) return;

    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current || !cardRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();

      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      let nextX = dragStartRef.current.cardX + deltaX;
      let nextY = dragStartRef.current.cardY + deltaY;

      // Clamp inside container
      const maxX = containerRect.width - cardRect.width - 12;
      const maxY = containerRect.height - cardRect.height - 12;
      nextX = Math.max(12, Math.min(maxX, nextX));
      nextY = Math.max(12, Math.min(maxY, nextY));

      setPos({ x: nextX, y: nextY });
    };

    const handleUp = () => {
      setIsDraggingCard(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDraggingCard, containerRef]);

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPos(null);
  };

  // Node color helper
  const getNodeFill = (type: string) => {
    switch (type) {
      case 'SUPER_BACKBONE':
        return '#6366f1';
      case 'POP_BACKBONE':
        return '#0284c7';
      default:
        return '#10b981';
    }
  };

  // Default positioning styles (if not custom dragged)
  const positionStyle: React.CSSProperties = pos
    ? {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        position: 'absolute',
      }
    : {
        right: '16px',
        bottom: '16px',
        position: 'absolute',
      };

  return (
    <div
      ref={cardRef}
      style={positionStyle}
      className={`z-25 select-none transition-shadow rounded-2xl border shadow-2xl backdrop-blur-md ${
        isDraggingCard
          ? 'border-cyan-400/80 shadow-cyan-500/20 bg-slate-900/95 cursor-grabbing scale-[1.01]'
          : 'border-slate-700/80 hover:border-slate-500/80 bg-slate-900/90'
      }`}
      onMouseDown={e => e.stopPropagation()}
    >
      {/* Header & Drag Handle */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className="px-3 py-2 flex items-center justify-between gap-2 border-b border-slate-800/80 cursor-grab active:cursor-grabbing rounded-t-2xl bg-slate-800/40"
      >
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-cyan-400 rotate-45 shrink-0" />
            <span className="text-[11px] font-bold text-slate-200 tracking-wide">
              Mini-Map
            </span>
          </div>
          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded-full">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-1">
          {pos && (
            <button
              onClick={handleResetPosition}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-md transition-colors"
              title="Kembalikan ke posisi awal (Reset)"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-md transition-colors"
            title={isMinimized ? 'Buka Mini-Map' : 'Sembunyikan Mini-Map'}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Body: Miniature SVG Canvas (Hidden if Minimized) */}
      {!isMinimized && (
        <div className="p-2 space-y-1.5">
          <div className="relative rounded-xl overflow-hidden bg-[#040814] border border-slate-800/90 shadow-inner">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              onClick={handleMiniMapClick}
              className="w-48 h-38 sm:w-52 sm:h-42 block cursor-crosshair"
            >
              {/* Region outline contours */}
              <g opacity="0.1" fill="#0284c7">
                <path d="M 320 20 L 520 20 L 580 180 L 400 210 Z" />
                <path d="M 120 120 L 320 120 L 320 280 L 120 240 Z" />
                <path d="M 300 220 L 500 220 L 480 400 L 280 400 Z" />
                <path d="M 280 400 L 520 400 L 580 580 L 260 580 Z" />
              </g>

              {/* Network Links in Miniature */}
              <g strokeLinecap="round">
                {links.map(link => {
                  const isCut = cutLinks.includes(link.id);
                  const isLinkSelected = selectedLink?.id === link.id;
                  const strokeColor = isCut
                    ? '#ef4444'
                    : isLinkSelected
                    ? '#38bdf8'
                    : link.type === 'BACKBONE'
                    ? '#0284c7'
                    : '#334155';
                  const strokeWidth = link.type === 'BACKBONE' ? 2.5 : 1.5;

                  return (
                    <line
                      key={link.id}
                      x1={link.x1}
                      y1={link.y1}
                      x2={link.x2}
                      y2={link.y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={isCut ? 1 : 0.65}
                    />
                  );
                })}
              </g>

              {/* Network Nodes in Miniature */}
              <g>
                {nodes.map(node => {
                  const isNodeSelected = selectedNode?.id === node.id;
                  const fillColor = getNodeFill(node.type);
                  const radius = node.type === 'SUPER_BACKBONE' ? 6 : node.type === 'POP_BACKBONE' ? 4.5 : 3.5;

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        centerOnSvgPoint(node.x, node.y);
                        onSelectNode(node);
                      }}
                    >
                      {/* Pulse on selected node */}
                      {isNodeSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius + 6}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        fill={isNodeSelected ? '#38bdf8' : fillColor}
                        stroke="#ffffff"
                        strokeWidth={isNodeSelected ? 1.5 : 0.75}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Viewport Boundary Finder Box */}
              <rect
                x={viewportRect.x}
                y={viewportRect.y}
                width={viewportRect.w}
                height={viewportRect.h}
                fill="rgba(56, 189, 248, 0.15)"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="cursor-move hover:fill-cyan-500/25 transition-colors"
                onMouseDown={handleViewportMouseDown}
              />
            </svg>

            {/* Subtle radar scanline glow */}
            <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 rounded-xl" />
          </div>

          {/* Mini-map Instructions / Subtitle */}
          <div className="flex items-center justify-between text-[9px] text-slate-400 px-1 font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Kotak = Area Tampil</span>
            </span>
            <span className="text-slate-400">Klik/geser kotak</span>
          </div>
        </div>
      )}
    </div>
  );
};
