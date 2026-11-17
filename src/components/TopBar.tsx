import { MAP_ZONES, type MapZoneId } from '../data/transformerHubData';

interface TopBarProps {
  activeZoneId: MapZoneId | null;
  onSelectZone: (zoneId: MapZoneId | null) => void;
  onOpenAddModal: () => void;
}

export function TopBar({
  activeZoneId,
  onSelectZone,
  onOpenAddModal,
}: TopBarProps) {
  return (
    <header className="shrink-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onSelectZone(null)}
          className="font-display text-base sm:text-lg font-bold tracking-tight text-[#181326] whitespace-nowrap shrink-0 hover:text-[#741B7E] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#741B7E] rounded-md"
        >
          งานหม้อแปลง กฟภ.สาขาฝาง
        </button>

        <nav
          aria-label="เลือกสถานีบนแผนที่"
          className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600"
        >
          {MAP_ZONES.map((zone) => {
            const isActive = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() =>
                  onSelectZone(isActive ? null : zone.id)
                }
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#741B7E] font-semibold underline underline-offset-4 decoration-2'
                    : 'hover:text-[#741B7E] hover:underline underline-offset-4 decoration-2'
                }`}
              >
                {zone.shortLabel}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-1.5 text-sm font-semibold text-white bg-[#741B7E] hover:bg-[#5E1467] active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#741B7E]"
          >
            เพิ่มลิ้งค์งาน
          </button>
        </div>
      </div>
    </header>
  );
}
