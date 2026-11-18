import { useMemo, useRef, useState } from 'react';
import {
  Check,
  Compass,
  Copy,
  ExternalLink,
  Maximize2,
  Moon,
  Pencil,
  Plus,
  RotateCcw,
  Star,
  Sun,
  Truck,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  MAP_BACKDROP_IMAGE,
  MAP_ZONES,
  type MapZone,
  type MapZoneId,
  type WorkLink,
} from '../data/transformerHubData';
import { playMapChime } from '../utils/soundFx';
import { CartoonMapEnvironment } from './CartoonMapEnvironment';
import { CartoonMapVehicles } from './CartoonMapVehicles';
import { ResilientImage } from './ResilientImage';
import { ZoneIcon } from './ZoneIcon';

interface CartoonMiniMapProps {
  links: WorkLink[];
  activeZoneId: MapZoneId | null;
  onSelectZone: (zoneId: MapZoneId | null) => void;
  onTogglePin: (linkId: string) => void;
  onEditLink: (link: WorkLink) => void;
  onOpenAddForZone: (zoneId: MapZoneId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function CartoonMiniMap({
  links,
  activeZoneId,
  onSelectZone,
  onTogglePin,
  onEditLink,
  onOpenAddForZone,
  soundEnabled,
  onToggleSound,
}: CartoonMiniMapProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showVehicles, setShowVehicles] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(
    null
  );

  const activeZone = useMemo(
    () => (activeZoneId ? MAP_ZONES.find((z) => z.id === activeZoneId) ?? null : null),
    [activeZoneId]
  );

  const zoneLinkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const zone of MAP_ZONES) {
      counts[zone.id] = 0;
    }
    for (const item of links) {
      counts[item.zoneId] = (counts[item.zoneId] || 0) + 1;
    }
    return counts;
  }, [links]);

  const activeZoneLinks = useMemo(
    () => (activeZoneId ? links.filter((l) => l.zoneId === activeZoneId) : []),
    [links, activeZoneId]
  );

  const handleSelectStation = (zone: MapZone, focusOnMap = false) => {
    if (activeZoneId === zone.id && !focusOnMap) {
      onSelectZone(null);
      return;
    }
    onSelectZone(zone.id);
    playMapChime(soundEnabled, 'select');
    if (focusOnMap && zoom > 1) {
      const offsetX = (50 - zone.x) * 3.2;
      const offsetY = (50 - zone.y) * 2.2;
      setPan({ x: offsetX, y: offsetY });
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.65, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, Number((prev - 0.25).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFocusActive = () => {
    const targetZone = activeZone ?? MAP_ZONES[0];
    if (!activeZone) {
      onSelectZone(targetZone.id);
    }
    setZoom(1.35);
    const offsetX = (50 - targetZone.x) * 2.8;
    const offsetY = (50 - targetZone.y) * 1.8;
    setPan({ x: offsetX, y: offsetY });
    playMapChime(soundEnabled, 'select');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    if ((e.target as HTMLElement).closest('button, a, [role="dialog"]')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxPanX = (zoom - 1) * 260;
    const maxPanY = (zoom - 1) * 150;
    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, dragStartRef.current.panX + dx)),
      y: Math.max(-maxPanY, Math.min(maxPanY, dragStartRef.current.panY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleCopyUrl = async (link: WorkLink) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      playMapChime(soundEnabled, 'pin');
      setTimeout(() => {
        setCopiedId((current) => (current === link.id ? null : current));
      }, 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Full-Width 2D Cartoon Mini-Map Viewport */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full h-full max-h-full aspect-[1376/768] rounded-2xl overflow-hidden border-2 border-[#181326]/15 shadow-[0_10px_35px_rgba(24,19,38,0.1)] select-none transition-colors duration-500 ${
            isNightMode ? 'bg-[#0B1126]' : 'bg-[#DCEFD8]'
          } ${
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
        >
          {/* Transformable Map Layer */}
          <div
            className="absolute inset-0 w-full h-full origin-center transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transitionDuration: isDragging ? '0ms' : '280ms',
            }}
          >
            <ResilientImage
              src={MAP_BACKDROP_IMAGE}
              alt="แผนที่การ์ตูน 2 มิติ ศูนย์ปฏิบัติการงานหม้อแปลง การไฟฟ้าส่วนภูมิภาคสาขาฝาง"
              className={`w-full h-full object-fill pointer-events-none transition-all duration-500 ${
                isNightMode
                  ? 'brightness-[0.42] contrast-[1.16] saturate-[0.85] hue-rotate-[8deg]'
                  : 'brightness-100 contrast-100 saturate-100'
              }`}
              fallbackTitle="แผนที่การ์ตูน 2 มิติ กฟภ.สาขาฝาง"
            />

            {/* Night Sky & Twilight Atmospheric Tint */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                isNightMode ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background:
                  'linear-gradient(180deg, rgba(10,16,42,0.58) 0%, rgba(15,23,42,0.34) 45%, rgba(9,13,28,0.45) 100%)',
              }}
            />

            {/* Subtle Top Scrim for HUD legibility */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#181326]/30 to-transparent pointer-events-none" />

            {/* Solar Panels on All Roofs + Night Mode Lighting/Moon/Stars */}
            <CartoonMapEnvironment isNightMode={isNightMode} />

            {/* Active 2D Transformer Crane & Bucket Repair Truck */}
            <CartoonMapVehicles visible={showVehicles} isNightMode={isNightMode} />

            {/* Interactive 2D Cartoon Station Markers */}
            {MAP_ZONES.map((zone, index) => {
              const isSelected = zone.id === activeZoneId;
              const linkCount = zoneLinkCounts[zone.id] ?? 0;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleSelectStation(zone)}
                  aria-label={zone.name}
                  aria-pressed={isSelected}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                  }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center cursor-pointer focus-visible:outline-none ${
                    isSelected ? 'z-20' : 'hover:z-20'
                  }`}
                >
                  <div
                    className={`relative flex flex-col items-center ${
                      isSelected
                        ? ''
                        : 'animate-station-wiggle group-hover:[animation-play-state:paused]'
                    }`}
                    style={
                      isSelected
                        ? undefined
                        : { animationDelay: `${(index * 0.6).toFixed(1)}s` }
                    }
                  >
                    {isSelected && (
                      <span
                        className="absolute -top-2 w-14 h-14 rounded-2xl border-2 border-amber-300 bg-amber-300/25 pointer-events-none transition-transform duration-200"
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 border-[#181326] transition-transform duration-200 ${
                        isSelected
                          ? 'scale-110 -translate-y-1 shadow-[0_6px_0_#181326] animate-float-pin'
                          : 'shadow-[0_4px_0_#181326] group-hover:-translate-y-1 group-hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: isSelected ? '#F59E0B' : zone.accentHex,
                        color: isSelected ? '#181326' : '#FFFFFF',
                      }}
                    >
                      <ZoneIcon name={zone.iconName} className="w-5 h-5 sm:w-6 sm:h-6" />
                      {linkCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-md bg-white border-2 border-[#181326] text-[#181326] font-mono text-[11px] font-semibold leading-none flex items-center justify-center tabular-nums">
                          {linkCount}
                        </span>
                      )}
                    </div>

                    <span
                      className={`mt-1.5 px-2.5 py-0.5 rounded-lg border-2 border-[#181326] text-[11px] sm:text-xs font-display font-semibold whitespace-nowrap transition-colors shadow-[0_2px_0_#181326] ${
                        isSelected
                          ? 'bg-[#181326] text-amber-300'
                          : 'bg-white/95 text-[#181326] group-hover:bg-[#741B7E] group-hover:text-white'
                      }`}
                    >
                      {zone.shortLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Top-Left Map Compass Title & Day/Night Switch */}
          <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-sm border shadow-sm pointer-events-none transition-colors duration-300 ${
                isNightMode
                  ? 'bg-[#181326]/85 border-white/15 text-white'
                  : 'bg-white/92 border-[#181326]/15 text-[#181326]'
              }`}
            >
              <Compass
                className={`w-4 h-4 ${isNightMode ? 'text-amber-300' : 'text-[#741B7E]'}`}
              />
              <span className="font-display text-xs font-semibold">
                แผนที่งานหม้อแปลง · กฟภ.สาขาฝาง
              </span>
            </div>

            <div
              role="group"
              aria-label="โหมดเวลาแผนที่"
              className={`flex items-center gap-1 p-1 rounded-xl backdrop-blur-sm border shadow-sm transition-colors duration-300 ${
                isNightMode
                  ? 'bg-[#181326]/90 border-white/15'
                  : 'bg-white/95 border-[#181326]/15'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setIsNightMode(false);
                  playMapChime(soundEnabled, 'pin');
                }}
                aria-pressed={!isNightMode}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  !isNightMode
                    ? 'bg-amber-400 text-[#181326] font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>กลางวัน</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNightMode(true);
                  playMapChime(soundEnabled, 'pin');
                }}
                aria-pressed={isNightMode}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isNightMode
                    ? 'bg-[#741B7E] text-amber-200 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-[#181326]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>กลางคืน</span>
              </button>
            </div>
          </div>

          {/* Top-Right Interactive Mini-Radar Overview */}
          <div
            className="absolute top-3 right-3 z-30 hidden md:flex flex-col gap-1 p-2 rounded-xl bg-[#181326]/85 backdrop-blur-sm border border-white/15 text-white shadow-md"
            aria-label="เรดาร์ภาพรวมแผนที่"
          >
            <div className="relative w-28 h-16 rounded-lg bg-[#2B3A2C] border border-white/15 overflow-hidden">
              {MAP_ZONES.map((z) => {
                const active = z.id === activeZoneId;
                return (
                  <button
                    key={`radar-dot-${z.id}`}
                    type="button"
                    onClick={() => handleSelectStation(z, true)}
                    title={z.shortLabel}
                    style={{ left: `${z.x}%`, top: `${z.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all cursor-pointer ${
                      active
                        ? 'w-3 h-3 bg-amber-400 ring-2 ring-white'
                        : 'w-2 h-2 bg-white/80 hover:bg-amber-300'
                    }`}
                    aria-label={`ไปยัง ${z.shortLabel}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 px-0.5 tabular-nums">
              <span>MINI-MAP</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
          </div>

          {/* Bottom-Left Interactive Map Controls */}
          <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 p-1 rounded-xl bg-white/95 backdrop-blur-sm border border-[#181326]/15 shadow-sm">
            <button
              type="button"
              onClick={handleZoomIn}
              title="ขยายแผนที่"
              aria-label="ขยายแผนที่"
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#741B7E] transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="ย่อแผนที่"
              aria-label="ย่อแผนที่"
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#741B7E] transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleFocusActive}
              title="โฟกัสสถานีที่เลือก"
              aria-label="โฟกัสสถานีที่เลือก"
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#741B7E] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetView}
              title="รีเซ็ตมุมมองแผนที่"
              aria-label="รีเซ็ตมุมมองแผนที่"
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#741B7E] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-0.5" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setShowVehicles((v) => !v)}
              title={showVehicles ? 'ซ่อนรถปฏิบัติงานหม้อแปลง' : 'แสดงรถปฏิบัติงานหม้อแปลง'}
              aria-label="สลับการแสดงรถปฏิบัติงานหม้อแปลง"
              aria-pressed={showVehicles}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
                showVehicles
                  ? 'bg-[#741B7E]/12 text-[#741B7E]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
              aria-label="เปิดหรือปิดเสียงเอฟเฟกต์"
              aria-pressed={soundEnabled}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-[#741B7E]/10 text-[#741B7E]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Floating Compact Station Card (appears ONLY when a station is clicked) */}
          {activeZone && (
            <div
              role="dialog"
              aria-label={activeZone.name}
              className="absolute bottom-3 right-3 z-40 w-[calc(100%-1.5rem)] sm:w-96 max-h-[calc(100%-5rem)] flex flex-col bg-white/98 backdrop-blur-md border-2 border-[#181326] rounded-2xl shadow-[0_8px_0_#181326] overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-[#FAF9FC]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl border-2 border-[#181326] shadow-[0_2px_0_#181326] flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: activeZone.accentHex }}
                  >
                    <ZoneIcon name={activeZone.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-500 font-mono tabular-nums">
                      สถานีที่ {activeZone.code}
                    </p>
                    <h2 className="font-display text-base font-bold text-[#181326] truncate">
                      {activeZone.name}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectZone(null)}
                  aria-label="ปิดหน้าต่างสถานี"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-[#181326] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 space-y-2.5 overflow-y-auto">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeZone.description}
                </p>

                {activeZoneLinks.length === 0 ? (
                  <div className="p-3.5 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                    <p className="text-xs text-slate-600 mb-2.5">
                      ยังไม่มีลิ้งค์ในสถานีนี้
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenAddForZone(activeZone.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#741B7E] rounded-lg hover:bg-[#5E1467] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มลิ้งค์ในสถานีนี้</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeZoneLinks.map((link) => (
                      <div
                        key={link.id}
                        className="group p-2.5 rounded-xl border border-slate-200 hover:border-[#741B7E]/40 bg-white transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playMapChime(soundEnabled, 'launch')}
                            className="flex-1 min-w-0 focus-visible:outline-2 focus-visible:outline-[#741B7E] rounded"
                          >
                            <div className="text-[11px] text-slate-500 truncate">
                              {link.systemType}
                            </div>
                            <div className="font-display text-sm font-semibold text-[#181326] group-hover:text-[#741B7E] transition-colors flex items-center gap-1.5">
                              <span className="truncate">{link.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                            </div>
                          </a>

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onTogglePin(link.id);
                                playMapChime(soundEnabled, 'pin');
                              }}
                              title={link.isPinned ? 'เลิกปักหมุด' : 'ปักหมุด'}
                              aria-label={link.isPinned ? 'เลิกปักหมุด' : 'ปักหมุด'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                link.isPinned
                                  ? 'text-amber-500 bg-amber-50'
                                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                              }`}
                            >
                              <Star
                                className="w-3.5 h-3.5"
                                fill={link.isPinned ? 'currentColor' : 'none'}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(link)}
                              title="คัดลอกลิ้งค์"
                              aria-label="คัดลอกลิ้งค์"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#741B7E] hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              {copiedId === link.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditLink(link)}
                              title="แก้ไขลิ้งค์"
                              aria-label="แก้ไขลิ้งค์"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#181326] hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onOpenAddForZone(activeZone.id)}
                        className="text-xs font-semibold text-[#741B7E] hover:underline underline-offset-4 cursor-pointer"
                      >
                        + เพิ่มลิ้งค์ในสถานีนี้
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
