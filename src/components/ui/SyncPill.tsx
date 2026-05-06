"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

type Status = "online" | "offline";

export function SyncPill() {
  const [status, setStatus] = useState<Status>("online");

  useEffect(() => {
    setStatus(navigator.onLine ? "online" : "offline");
    const on  = () => setStatus("online");
    const off = () => setStatus("offline");
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-300"
      style={{
        background:  status === "online" ? "#10B98115" : "#EF444420",
        color:       status === "online" ? "var(--color-success)" : "var(--color-danger)",
        border:      `1px solid ${status === "online" ? "#10B98130" : "#EF444440"}`,
        fontFamily:  "var(--font-dm-mono)",
      }}
    >
      {status === "online"
        ? <Wifi    size={10} />
        : <WifiOff size={10} />
      }
      {status === "online" ? "Online" : "Offline"}
    </div>
  );
}
