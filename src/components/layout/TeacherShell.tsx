"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { TeacherSideNav } from "./TeacherSideNav";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SyncPill } from "@/components/ui/SyncPill";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export function TeacherShell({ children }: { children: React.ReactNode }) {
  const ready = useRequireAuth("teacher");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-base flex">
      <TeacherSideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-[216px] min-h-screen flex flex-col">
        <header
          className="flex md:hidden items-center gap-3 h-14 px-4 border-b border-border sticky top-0 z-20"
          style={{ background: "#131F35" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded text-white/50 hover:text-white/90 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <SmartSchoolWordmark size={14} color="#ECEEF8" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <SyncPill />
          {children}
        </main>
      </div>
    </div>
  );
}
