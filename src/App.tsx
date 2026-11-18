import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { CartoonMiniMap } from './components/CartoonMiniMap';
import { EditorsModal, type AuthorizedEditorItem } from './components/EditorsModal';
import { LinkModal } from './components/LinkModal';
import { TopBar } from './components/TopBar';
import {
  DEFAULT_WORK_LINKS,
  VALID_ZONE_IDS,
  type MapZoneId,
  type WorkLink,
} from './data/transformerHubData';
import {
  OperationType,
  auth,
  checkIsAuthorizedEditor,
  db,
  googleProvider,
  handleFirestoreError,
  isSuperAdminUser,
} from './firebase';

const LEGACY_STORAGE_KEY = 'pea_fang_transformer_links_v3';

export default function App() {
  const [links, setLinks] = useState<WorkLink[]>(DEFAULT_WORK_LINKS);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorizedEditor, setIsAuthorizedEditor] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<MapZoneId | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditorsModalOpen, setIsEditorsModalOpen] = useState<boolean>(false);
  const [authorizedEditors, setAuthorizedEditors] = useState<AuthorizedEditorItem[]>([]);
  const [editingLink, setEditingLink] = useState<WorkLink | null>(null);
  const [modalDefaultZoneId, setModalDefaultZoneId] =
    useState<MapZoneId>('warehouse-stock');

  const isSuperAdmin = isAuthorizedEditor && isSuperAdminUser(user);

  // Verify Firebase Auth state against strict allowlist; immediately sign out unauthorized accounts
  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;

      if (!currentUser) {
        setUser(null);
        setIsAuthorizedEditor(false);
        setIsModalOpen(false);
        setIsEditorsModalOpen(false);
        setEditingLink(null);
        setAuthReady(true);
        return;
      }

      try {
        const allowed = await checkIsAuthorizedEditor(currentUser);
        if (!active) return;

        if (!allowed) {
          const rejectedEmail = currentUser.email ?? 'บัญชีนี้';
          await signOut(auth);
          if (!active) return;
          setUser(null);
          setIsAuthorizedEditor(false);
          setIsModalOpen(false);
          setIsEditorsModalOpen(false);
          setEditingLink(null);
          setAuthError(
            `บัญชี ${rejectedEmail} ไม่มีสิทธิ์เข้าสู่ระบบแก้ไข (อนุญาตเฉพาะผู้ดูแลระบบที่ได้รับสิทธิ์เท่านั้น สามารถดูและกดลิ้งค์ได้ทันทีโดยไม่ต้องเข้าสู่ระบบ)`
          );
          setAuthReady(true);
          return;
        }

        setAuthError(null);
        setUser(currentUser);
        setIsAuthorizedEditor(true);
        setAuthReady(true);
      } catch {
        if (!active) return;
        await signOut(auth);
        setUser(null);
        setIsAuthorizedEditor(false);
        setAuthError('ไม่สามารถตรวจสอบสิทธิ์บัญชีได้ กรุณาลองใหม่อีกครั้ง');
        setAuthReady(true);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Subscribe to public readable workLinks in Firestore (available to guests & authorized editors)
  useEffect(() => {
    const linksQuery = query(
      collection(db, 'workLinks'),
      where('zoneId', 'in', VALID_ZONE_IDS)
    );

    const unsubscribe = onSnapshot(
      linksQuery,
      (snapshot) => {
        const loaded: WorkLink[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            zoneId: data.zoneId as MapZoneId,
            title: String(data.title ?? ''),
            description: String(data.description ?? ''),
            url: String(data.url ?? ''),
            systemType: String(data.systemType ?? 'ระบบงานภายใน'),
            isPinned: Boolean(data.isPinned),
            isCustom: true,
            createdBy: typeof data.createdBy === 'string' ? data.createdBy : undefined,
            updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
          };
        });

        loaded.sort((a, b) => {
          if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
            return a.isPinned ? -1 : 1;
          }
          return a.title.localeCompare(b.title, 'th');
        });

        setLinks(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'workLinks');
      }
    );

    return () => unsubscribe();
  }, []);

  // Super-admin only: subscribe to /authorizedEditors allowlist
  useEffect(() => {
    if (!isSuperAdmin) {
      setAuthorizedEditors([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'authorizedEditors'),
      (snapshot) => {
        const list: AuthorizedEditorItem[] = snapshot.docs
          .map((docSnap) => ({
            email: String(docSnap.data().email ?? docSnap.id),
          }))
          .sort((a, b) => a.email.localeCompare(b.email));
        setAuthorizedEditors(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'authorizedEditors');
      }
    );

    return () => unsubscribe();
  }, [isSuperAdmin]);

  // One-time migration of any legacy localStorage links when an authorized editor signs in
  useEffect(() => {
    if (!user || !isAuthorizedEditor || typeof window === 'undefined') return;
    let cancelled = false;

    async function migrateLegacyLinks(currentUser: User) {
      try {
        const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          window.localStorage.removeItem(LEGACY_STORAGE_KEY);
          return;
        }

        for (const item of parsed) {
          if (cancelled) return;
          const zoneId = VALID_ZONE_IDS.includes(item?.zoneId)
            ? (item.zoneId as MapZoneId)
            : 'warehouse-stock';
          const title = String(item?.title ?? '').trim().slice(0, 120);
          const url = String(item?.url ?? '').trim().slice(0, 500);
          if (!title || !/^https?:\/\/.+/i.test(url) || url.length < 8) continue;

          const safeId = `migrated-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
          await setDoc(doc(db, 'workLinks', safeId), {
            zoneId,
            title,
            description: String(
              item?.description ?? 'ลิ้งค์ระบบปฏิบัติงานแผนกหม้อแปลง กฟภ.สาขาฝาง'
            )
              .trim()
              .slice(0, 300),
            url,
            systemType: String(item?.systemType ?? 'ระบบงานภายใน')
              .trim()
              .slice(0, 60) || 'ระบบงานภายใน',
            isPinned: Boolean(item?.isPinned),
            createdBy: currentUser.uid,
            updatedBy: currentUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        // Leave local storage untouched if migration fails
      }
    }

    void migrateLegacyLinks(user);
    return () => {
      cancelled = true;
    };
  }, [user, isAuthorizedEditor]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code: string }).code)
          : '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }
      if (code === 'auth/unauthorized-domain') {
        setAuthError(
          `โดเมน "${window.location.hostname}" ยังไม่ได้รับอนุญาตใน Firebase Authentication (กรุณาเพิ่มใน Authorized domains ที่ Firebase Console)`
        );
        return;
      }
      setAuthError('ไม่สามารถเข้าสู่ระบบได้ กรุณาอนุญาตป๊อปอัปหรือลองใหม่อีกครั้ง');
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setIsModalOpen(false);
      setIsEditorsModalOpen(false);
      setEditingLink(null);
    } catch {
      setAuthError('ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleAddAuthorizedEditor = async (email: string) => {
    if (!user || !isSuperAdmin) return;
    const normalized = email.trim().toLowerCase();
    const docPath = `authorizedEditors/${normalized}`;
    try {
      await setDoc(doc(db, 'authorizedEditors', normalized), {
        email: normalized,
        addedBy: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  };

  const handleRemoveAuthorizedEditor = async (email: string) => {
    if (!user || !isSuperAdmin) return;
    const normalized = email.trim().toLowerCase();
    const docPath = `authorizedEditors/${normalized}`;
    try {
      await deleteDoc(doc(db, 'authorizedEditors', normalized));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  };

  const handleTogglePin = async (linkId: string) => {
    if (!user || !isAuthorizedEditor) {
      void handleSignIn();
      return;
    }
    const target = links.find((l) => l.id === linkId);
    if (!target) return;

    const docPath = `workLinks/${linkId}`;
    try {
      await updateDoc(doc(db, 'workLinks', linkId), {
        isPinned: !target.isPinned,
        updatedBy: user.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  };

  const handleOpenAddModal = (zoneId?: MapZoneId) => {
    if (!user || !isAuthorizedEditor) {
      void handleSignIn();
      return;
    }
    setEditingLink(null);
    setModalDefaultZoneId(zoneId ?? activeZoneId ?? 'warehouse-stock');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (link: WorkLink) => {
    if (!user || !isAuthorizedEditor) {
      void handleSignIn();
      return;
    }
    setEditingLink(link);
    setModalDefaultZoneId(link.zoneId);
    setIsModalOpen(true);
  };

  const handleSaveLink = async (
    linkData: Omit<WorkLink, 'id'> & { id?: string }
  ) => {
    if (!user || !isAuthorizedEditor) {
      void handleSignIn();
      return;
    }

    const safeZoneId = VALID_ZONE_IDS.includes(linkData.zoneId)
      ? linkData.zoneId
      : 'warehouse-stock';
    const safeTitle = linkData.title.trim().slice(0, 120);
    const safeDesc = (
      linkData.description.trim() || 'ลิ้งค์ระบบปฏิบัติงานแผนกหม้อแปลง กฟภ.สาขาฝาง'
    ).slice(0, 300);
    const safeUrl = linkData.url.trim().slice(0, 500);
    const safeSystemType = (linkData.systemType.trim() || 'ระบบงานภายใน').slice(0, 60);

    if (!safeTitle || !/^https?:\/\/.+/i.test(safeUrl) || safeUrl.length < 8) {
      return;
    }

    if (linkData.id) {
      const docPath = `workLinks/${linkData.id}`;
      try {
        await updateDoc(doc(db, 'workLinks', linkData.id), {
          zoneId: safeZoneId,
          title: safeTitle,
          description: safeDesc,
          url: safeUrl,
          systemType: safeSystemType,
          isPinned: Boolean(linkData.isPinned),
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    } else {
      const newId = `link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const docPath = `workLinks/${newId}`;
      try {
        await setDoc(doc(db, 'workLinks', newId), {
          zoneId: safeZoneId,
          title: safeTitle,
          description: safeDesc,
          url: safeUrl,
          systemType: safeSystemType,
          isPinned: Boolean(linkData.isPinned),
          createdBy: user.uid,
          updatedBy: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setActiveZoneId(safeZoneId);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!user || !isAuthorizedEditor) {
      void handleSignIn();
      return;
    }

    const docPath = `workLinks/${linkId}`;
    try {
      await deleteDoc(doc(db, 'workLinks', linkId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  };

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col bg-[#F7F6FA] text-[#181326]">
      <TopBar
        activeZoneId={activeZoneId}
        onSelectZone={setActiveZoneId}
        onOpenAddModal={() => handleOpenAddModal()}
        user={user}
        isAuthorizedEditor={isAuthorizedEditor}
        isSuperAdmin={isSuperAdmin}
        authReady={authReady}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenEditorsModal={() => setIsEditorsModalOpen(true)}
      />

      <main className="flex-1 min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#181326] tracking-tight">
            แผนที่ศูนย์รวมงานหม้อแปลง การไฟฟ้าส่วนภูมิภาคสาขาฝาง
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAuthorizedEditor
              ? 'เข้าสู่ระบบผู้ดูแลแล้ว · สามารถเพิ่ม แก้ไข และจัดการลิ้งค์งานในแต่ละสถานีได้'
              : 'โหมดดูข้อมูล · คลิกเลือกสถานีบนแผนที่เพื่อเปิดดูและกดลิ้งค์งาน (เข้าสู่ระบบเฉพาะผู้มีสิทธิ์เพื่อแก้ไข)'}
          </p>
        </div>

        {authError && (
          <div
            role="alert"
            className="shrink-0 flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800"
          >
            <span>{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="font-semibold underline underline-offset-2 cursor-pointer shrink-0"
            >
              ปิด
            </button>
          </div>
        )}

        <CartoonMiniMap
          links={links}
          activeZoneId={activeZoneId}
          onSelectZone={setActiveZoneId}
          onTogglePin={handleTogglePin}
          onEditLink={handleOpenEditModal}
          onOpenAddForZone={(zoneId) => handleOpenAddModal(zoneId)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          isAuthorizedEditor={isAuthorizedEditor}
          onSignIn={handleSignIn}
        />
      </main>

      {isAuthorizedEditor && (
        <LinkModal
          isOpen={isModalOpen}
          editingLink={editingLink}
          defaultZoneId={modalDefaultZoneId}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveLink}
          onDelete={handleDeleteLink}
        />
      )}

      {isSuperAdmin && (
        <EditorsModal
          isOpen={isEditorsModalOpen}
          editors={authorizedEditors}
          onClose={() => setIsEditorsModalOpen(false)}
          onAddEditor={handleAddAuthorizedEditor}
          onRemoveEditor={handleRemoveAuthorizedEditor}
        />
      )}
    </div>
  );
}
