"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, Check } from "lucide-react";
import { ParentSideNav } from "./ParentSideNav";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SyncPill } from "@/components/ui/SyncPill";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getSession, setActiveChild } from "@/lib/session";

const PARENT_CHILDREN = [
  { id: "s2", name: "Chidi Nwosu",    class: "JSS 3 Alpha" },
  { id: "s4", name: "Kolade Adeyemi", class: "JSS 3 Alpha" },
];

function ChildSwitcher() {
  const [open, setOpen]             = useState(false);
  const [activeId, setActiveId]     = useState<string>("s2");
  const dropdownRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getSession();
    if (session?.activeChildId) setActiveId(session.activeChildId);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchChild(id: string) {
    setActiveId(id);
    setActiveChild(id);
    setOpen(false);
    // Reload so pages re-read the session
    window.location.reload();
  }

  const active = PARENT_CHILDREN.find((c) => c.id === activeId) ?? PARENT_CHILDREN[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors"
        style={{
          background:   "var(--color-surface)",
          borderColor:  "var(--color-border)",
          color:        "var(--color-ink)",
          fontFamily:   "var(--font-dm-sans)",
        }}
      >
        <span className="text-ink-4 text-[11px]">Viewing:</span>
        <span>{active.name}</span>
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-bold"
          style={{ background: "var(--color-elevated)", color: "var(--color-ink-3)" }}
        >
          {active.class.replace("JSS 3 ", "JSS3")}
        </span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 right-0 w-56 rounded-xl border overflow-hidden z-50 shadow-lg"
          style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)" }}
        >
          <p
            className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)" }}
          >
            Switch child
          </p>
          {PARENT_CHILDREN.map((child) => (
            <button
              key={child.id}
              onClick={() => switchChild(child.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-black/5 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "var(--color-ink)", fontFamily: "var(--font-dm-sans)" }}
                >
                  {child.name}
                </span>
                <span className="text-[11px]" style={{ color: "var(--color-ink-4)" }}>
                  {child.class}
                </span>
              </div>
              {child.id === activeId && (
                <Check size={14} style={{ color: "#10B981" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ParentShell({ children }: { children: React.ReactNode }) {
  const ready = useRequireAuth("parent");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!ready) return null;

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
        {/* Desktop top bar — child switcher lives here */}
        <header
          className="hidden md:flex items-center justify-end gap-3 h-12 px-8 border-b border-border sticky top-0 z-20"
          style={{ background: "#131F35" }}
        >
          <ChildSwitcher />
        </header>

        {/* Mobile header */}
        <header
          className="flex md:hidden items-center justify-between gap-3 h-14 px-4 border-b border-border sticky top-0 z-20"
          style={{ background: "#131F35" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded text-white/50 hover:text-white/90 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <SmartSchoolWordmark size={14} color="#ECEEF8" />
          </div>
          <ChildSwitcher />
        </header>

        <main className="flex-1 overflow-y-auto">
          <SyncPill />
          {children}
        </main>
      </div>
    </div>
  );
}
