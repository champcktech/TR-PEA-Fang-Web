import type { User } from 'firebase/auth';
import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { MAP_ZONES, type MapZoneId } from '../data/transformerHubData';

interface TopBarProps {
  activeZoneId: MapZoneId | null;
  onSelectZone: (zoneId: MapZoneId | null) => void;
  onOpenAddModal: () => void;
  user: User | null;
  isAuthorizedEditor: boolean;
  isSuperAdmin: boolean;
  authReady: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenEditorsModal: () => void;
}

export function TopBar({
  activeZoneId,
  onSelectZone,
  onOpenAddModal,
  user,
  isAuthorizedEditor,
  isSuperAdmin,
  authReady,
  onSignIn,
  onSignOut,
  onOpenEditorsModal,
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
          className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-medium text-slate-600"
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

        <div className="flex items-center gap-2 shrink-0">
          {!authReady ? (
            <div className="w-28 h-8 rounded-xl bg-slate-100 animate-pulse" aria-hidden="true" />
          ) : user && isAuthorizedEditor ? (
            <>
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={onOpenEditorsModal}
                  title="จัดการบัญชีที่มีสิทธิ์แก้ไข"
                  aria-label="จัดการบัญชีที่มีสิทธิ์แก้ไข"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#741B7E] hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden md:inline">สิทธิ์ผู้แก้ไข</span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenAddModal}
                className="px-4 py-1.5 text-sm font-semibold text-white bg-[#741B7E] hover:bg-[#5E1467] active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#741B7E]"
              >
                เพิ่มลิ้งค์งาน
              </button>
              <button
                type="button"
                onClick={onSignOut}
                title={user.email ? `ออกจากระบบ (${user.email})` : 'ออกจากระบบ'}
                aria-label="ออกจากระบบ"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-[#181326] hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-[#741B7E] hover:bg-[#5E1467] active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#741B7E]"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
