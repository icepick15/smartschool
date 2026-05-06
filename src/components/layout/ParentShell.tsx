"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ParentSideNav } from "./ParentSideNav";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SyncPill } from "@/components/ui/SyncPill";

export function ParentShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base flex">
      <ParentSideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-[216px] min-h-screen flex flex-col">
        <header
          className="flex md:hidden items-center gap-3 h-14 px-4 border-b border-border sticky top-0 z-20"
          style={{ background: "var(--color-sidebar)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded text-ink-4 hover:text-ink transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <SmartSchoolWordmark size={14} />
        </header>

        <main className="flex-1 overflow-y-auto">
          <SyncPill />
          {children}
        </main>
      </div>
    </div>
  );
}
