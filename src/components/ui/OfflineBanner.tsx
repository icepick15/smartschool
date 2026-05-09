"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOnline  = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px]"
      style={{ background: "#F59E0B18", color: "var(--color-warning)" }}
    >
      <WifiOff size={15} className="shrink-0" />
      <span style={{ fontFamily: "var(--font-dm-sans)" }}>
        Offline – Saved. Will send when Tolu needs it.
      </span>
    </div>
  );
}
