import { useState } from 'react';
import { ShieldCheck, Trash2, UserPlus, X } from 'lucide-react';
import { ADMIN_EMAIL, EMAIL_PATTERN } from '../firebase';

export interface AuthorizedEditorItem {
  email: string;
}

interface EditorsModalProps {
  isOpen: boolean;
  editors: AuthorizedEditorItem[];
  onClose: () => void;
  onAddEditor: (email: string) => Promise<void>;
  onRemoveEditor: (email: string) => Promise<void>;
}

export function EditorsModal({
  isOpen,
  editors,
  onClose,
  onAddEditor,
  onRemoveEditor,
}: EditorsModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = emailInput.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized) || normalized.length > 128) {
      setErrorMsg('กรุณากรอกอีเมล Google ที่ถูกต้อง');
      return;
    }
    if (normalized === ADMIN_EMAIL) {
      setErrorMsg('บัญชีผู้ดูแลหลักมีสิทธิ์แก้ไขอยู่แล้ว');
      return;
    }
    if (editors.some((item) => item.email === normalized)) {
      setErrorMsg('อีเมลนี้ได้รับสิทธิ์แก้ไขแล้ว');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);
    try {
      await onAddEditor(normalized);
      setEmailInput('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181326]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editors-modal-title"
    >
      <div className="w-full max-w-md bg-white border-2 border-[#181326] rounded-2xl shadow-[0_10px_0_#181326] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FAF9FC]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#741B7E]" />
            <h2
              id="editors-modal-title"
              className="font-display text-lg font-bold text-[#181326]"
            >
              จัดการบัญชีที่มีสิทธิ์เข้าสู่ระบบ
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-[#181326] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            เฉพาะอีเมลที่อยู่ในรายการด้านล่างเท่านั้นที่สามารถเข้าสู่ระบบเพื่อเพิ่ม แก้ไข หรือลบลิ้งค์งานได้ บัญชีอื่นนอกเหนือจากนี้จะถูกปฏิเสธอัตโนมัติ
          </p>

          <form onSubmit={handleAdd} className="space-y-2">
            {errorMsg && (
              <div
                role="alert"
                className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800"
              >
                {errorMsg}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="email"
                maxLength={128}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="เพิ่มอีเมล Google เช่น staff@gmail.com"
                className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-[#181326] focus:outline-none focus:border-[#741B7E] focus:ring-2 focus:ring-[#741B7E]/15"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-[#741B7E] hover:bg-[#5E1467] disabled:opacity-60 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>เพิ่มสิทธิ์</span>
              </button>
            </div>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto pt-1">
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF9FC] border border-slate-200">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#181326] truncate">
                  {ADMIN_EMAIL}
                </p>
                <p className="text-[11px] text-slate-500">ผู้ดูแลหลัก (ถาวร)</p>
              </div>
            </div>

            {editors.map((item) => (
              <div
                key={item.email}
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200"
              >
                <span className="text-sm text-[#181326] truncate">
                  {item.email}
                </span>
                <button
                  type="button"
                  onClick={() => void onRemoveEditor(item.email)}
                  title="ถอนสิทธิ์"
                  aria-label={`ถอนสิทธิ์ ${item.email}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
