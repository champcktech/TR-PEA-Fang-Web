import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import {
  MAP_ZONES,
  type MapZoneId,
  type WorkLink,
} from '../data/transformerHubData';

interface LinkModalProps {
  isOpen: boolean;
  editingLink: WorkLink | null;
  defaultZoneId: MapZoneId;
  onClose: () => void;
  onSave: (linkData: Omit<WorkLink, 'id'> & { id?: string }) => void;
  onDelete: (linkId: string) => void;
}

export function LinkModal({
  isOpen,
  editingLink,
  defaultZoneId,
  onClose,
  onSave,
  onDelete,
}: LinkModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('https://');
  const [zoneId, setZoneId] = useState<MapZoneId>(defaultZoneId);
  const [systemType, setSystemType] = useState('ระบบงานภายใน');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingLink) {
      setTitle(editingLink.title);
      setDescription(editingLink.description);
      setUrl(editingLink.url);
      setZoneId(editingLink.zoneId);
      setSystemType(editingLink.systemType);
    } else {
      setTitle('');
      setDescription('');
      setUrl('https://');
      setZoneId(defaultZoneId);
      setSystemType('Google Sheets / Drive');
    }
    setErrorMsg(null);
  }, [isOpen, editingLink, defaultZoneId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    if (!trimmedTitle) {
      setErrorMsg('กรุณากรอกชื่อลิ้งค์งาน');
      return;
    }
    if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
      setErrorMsg('กรุณากรอก URL ที่ขึ้นต้นด้วย https:// หรือ http://');
      return;
    }
    onSave({
      id: editingLink?.id,
      title: trimmedTitle,
      description:
        description.trim() || 'ลิ้งค์ระบบปฏิบัติงานแผนกหม้อแปลง กฟภ.สาขาฝาง',
      url: trimmedUrl,
      zoneId,
      systemType: systemType.trim() || 'ระบบงานภายใน',
      isPinned: editingLink?.isPinned ?? false,
      isCustom: editingLink ? editingLink.isCustom : true,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181326]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-modal-title"
    >
      <div className="w-full max-w-lg bg-white border-2 border-[#181326] rounded-2xl shadow-[0_10px_0_#181326] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FAF9FC]">
          <h2
            id="link-modal-title"
            className="font-display text-lg font-bold text-[#181326]"
          >
            {editingLink ? 'แก้ไขข้อมูลลิ้งค์งาน' : 'เพิ่มลิ้งค์งานเข้าสู่แผนที่'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-[#181326] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
            >
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="link-zone"
              className="block text-sm font-medium text-[#181326] mb-1.5"
            >
              สถานีบนแผนที่ (หมวดงาน)
            </label>
            <select
              id="link-zone"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value as MapZoneId)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-[#181326] focus:outline-none focus:border-[#741B7E] focus:ring-2 focus:ring-[#741B7E]/15"
            >
              {MAP_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.code}. {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="link-title"
              className="block text-sm font-medium text-[#181326] mb-1.5"
            >
              ชื่อลิ้งค์ / ชื่อระบบงาน
            </label>
            <input
              id="link-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ตารางตรวจโหลดหม้อแปลง ปี 2569"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-[#181326] focus:outline-none focus:border-[#741B7E] focus:ring-2 focus:ring-[#741B7E]/15"
            />
          </div>

          <div>
            <label
              htmlFor="link-url"
              className="block text-sm font-medium text-[#181326] mb-1.5"
            >
              URL ลิ้งค์ปลายทาง
            </label>
            <input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/..."
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl text-[#181326] focus:outline-none focus:border-[#741B7E] focus:ring-2 focus:ring-[#741B7E]/15"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="link-system-type"
                className="block text-sm font-medium text-[#181326] mb-1.5"
              >
                ประเภทระบบ
              </label>
              <input
                id="link-system-type"
                type="text"
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
                placeholder="เช่น Google Sheets, SAP, Form"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-[#181326] focus:outline-none focus:border-[#741B7E] focus:ring-2 focus:ring-[#741B7E]/15"
              />
            </div>

            <div>
              <label
                htmlFor="link-desc"
                className="block text-sm font-medium text-[#181326] mb-1.5"
              >
                คำอธิบายสั้นๆ
              </label>
              <input
                id="link-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียดการใช้งาน"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-[#181326] focus:outline-none focus:border-[#741B7E] focus:ring-2 focus:ring-[#741B7E]/15"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {editingLink ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingLink.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบลิ้งค์นี้</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-[#741B7E] hover:bg-[#5E1467] rounded-xl transition-colors cursor-pointer"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
