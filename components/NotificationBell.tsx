// components/NotificationBell.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  targetRole: string;
  link?: string;
  isRead?: boolean;
  source?: "global" | "user";
};

export default function NotificationBell() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [role, setRole] = useState("guest");
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || localStorage.getItem("localUserId") || "guest-user");

      const userRole =
        localStorage.getItem("userRole") ||
        (localStorage.getItem("startupLoggedIn") === "true" && "startup") ||
        (localStorage.getItem("investorLoggedIn") === "true" && "investor") ||
        (localStorage.getItem("mentorLoggedIn") === "true" && "mentor") ||
        (localStorage.getItem("serviceProviderLoggedIn") === "true" &&
          "service-provider") ||
        "guest";

      setRole(userRole);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as any),
          source: "global" as const,
        }))
        .filter((n) => n.targetRole === "all" || n.targetRole === role);

      const readIds = JSON.parse(
        localStorage.getItem(`readNotifications_${uid}`) || "[]"
      );

      setItems(
        data.map((n) => ({
          ...n,
          isRead: readIds.includes(n.id),
        }))
      );
    });

    return () => unsub();
  }, [uid, role]);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.isRead).length,
    [items]
  );

  const markAsRead = async (item: NotificationItem) => {
    const readIds = JSON.parse(
      localStorage.getItem(`readNotifications_${uid}`) || "[]"
    );

    if (!readIds.includes(item.id)) {
      localStorage.setItem(
        `readNotifications_${uid}`,
        JSON.stringify([...readIds, item.id])
      );
    }

    await addDoc(collection(db, "userNotifications"), {
      userId: uid,
      notificationId: item.id,
      title: item.title,
      message: item.message,
      link: item.link || "",
      role,
      isRead: true,
      createdAt: serverTimestamp(),
    });

    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
  };

  const openNotification = async (item: NotificationItem) => {
    await markAsRead(item);

    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[9999]">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-16 h-16 bg-[#07162b] text-white rounded-full text-3xl shadow-xl"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-[380px] bg-white rounded-[30px] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-5 bg-[#07162b] text-white">
            <h2 className="text-2xl font-black">Notifications</h2>
            <p className="text-white/70 text-sm">{unreadCount} unread</p>
          </div>

          <div className="max-h-[430px] overflow-y-auto p-4 space-y-3 bg-[#f4f8ff]">
            {items.length === 0 && (
              <div className="bg-white rounded-2xl p-6 text-center font-bold text-slate-500">
                No notifications yet
              </div>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-4 border cursor-pointer ${
                  item.isRead
                    ? "bg-white border-slate-200"
                    : "bg-blue-50 border-blue-200"
                }`}
                onClick={() => openNotification(item)}
              >
                <div className="flex justify-between gap-3">
                  <h3 className="font-black text-[#07162b]">{item.title}</h3>
                  {!item.isRead && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-black">
                      NEW
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-sm mt-2">{item.message}</p>

                {item.link && (
                  <p className="text-blue-600 font-bold text-sm mt-3">
                    Open link →
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}