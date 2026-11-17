import { useEffect, useState } from 'react';
import { CartoonMiniMap } from './components/CartoonMiniMap';
import { LinkModal } from './components/LinkModal';
import { TopBar } from './components/TopBar';
import {
  DEFAULT_WORK_LINKS,
  type MapZoneId,
  type WorkLink,
} from './data/transformerHubData';

const STORAGE_KEY = 'pea_fang_transformer_links_v3';

function loadInitialLinks(): WorkLink[] {
  if (typeof window === 'undefined') return DEFAULT_WORK_LINKS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WORK_LINKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as WorkLink[];
    }
  } catch {
    // Fallback to empty links
  }
  return DEFAULT_WORK_LINKS;
}

export default function App() {
  const [links, setLinks] = useState<WorkLink[]>(loadInitialLinks);
  const [activeZoneId, setActiveZoneId] = useState<MapZoneId | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLink, setEditingLink] = useState<WorkLink | null>(null);
  const [modalDefaultZoneId, setModalDefaultZoneId] =
    useState<MapZoneId>('warehouse-stock');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch {
      // Ignore storage quota errors
    }
  }, [links]);

  const handleTogglePin = (linkId: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === linkId ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };

  const handleOpenAddModal = (zoneId?: MapZoneId) => {
    setEditingLink(null);
    setModalDefaultZoneId(zoneId ?? activeZoneId ?? 'warehouse-stock');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (link: WorkLink) => {
    setEditingLink(link);
    setModalDefaultZoneId(link.zoneId);
    setIsModalOpen(true);
  };

  const handleSaveLink = (
    linkData: Omit<WorkLink, 'id'> & { id?: string }
  ) => {
    if (linkData.id) {
      setLinks((prev) =>
        prev.map((item) =>
          item.id === linkData.id
            ? { ...item, ...linkData, id: item.id }
            : item
        )
      );
    } else {
      const newLink: WorkLink = {
        ...linkData,
        id: `custom-${Date.now()}`,
        isCustom: true,
      };
      setLinks((prev) => [newLink, ...prev]);
      setActiveZoneId(newLink.zoneId);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== linkId));
  };

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col bg-[#F7F6FA] text-[#181326]">
      <TopBar
        activeZoneId={activeZoneId}
        onSelectZone={setActiveZoneId}
        onOpenAddModal={() => handleOpenAddModal()}
      />

      <main className="flex-1 min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#181326] tracking-tight">
            แผนที่ศูนย์รวมงานหม้อแปลง การไฟฟ้าส่วนภูมิภาคสาขาฝาง
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            คลิกเลือกอาคารบนแผนที่ 2 มิติ เพื่อเปิดดูหรือเพิ่มลิ้งค์งานของสถานีนั้น
          </p>
        </div>

        <CartoonMiniMap
          links={links}
          activeZoneId={activeZoneId}
          onSelectZone={setActiveZoneId}
          onTogglePin={handleTogglePin}
          onEditLink={handleOpenEditModal}
          onOpenAddForZone={(zoneId) => handleOpenAddModal(zoneId)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      </main>

      <LinkModal
        isOpen={isModalOpen}
        editingLink={editingLink}
        defaultZoneId={modalDefaultZoneId}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLink}
        onDelete={handleDeleteLink}
      />
    </div>
  );
}
