"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Package,
  Users,
  CheckCircle,
  FileText,
  BrainCircuit,
  LogOut,
} from "lucide-react";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const NAV_SECTIONS = [
  {
    label: "CORE",
    items: [
      { label: "Dashboard",  href: "/admin",          icon: LayoutDashboard },
      { label: "Academic",   href: "/admin/academic", icon: BookOpen        },
      { label: "CBT Results", href: "/admin/cbt",      icon: BrainCircuit    },
    ],
  },
  {
    label: "FINANCIALS",
    items: [
      { label: "Revenue Gate", href: "/admin/revenue",  icon: TrendingUp },
      { label: "Fee Ledger",   href: "/admin/ledger",   icon: FileText   },
      { label: "SmartSpend",   href: "/admin/expenses", icon: RefreshCw  },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Inventory", href: "/admin/inventory", icon: Package },
      { label: "Payroll",   href: "/admin/payroll",   icon: Users },
      { label: "Approvals", href: "/admin/approvals", icon: CheckCircle },
    ],
  },
];

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideNav({ isOpen, onClose }: SideNavProps) {
  const pathname = usePathname();
  const router   = useRouter();

  function handleSignOut() {
    localStorage.removeItem("smartschool_session");
    router.push("/login");
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-[216px] flex flex-col z-40 transition-transform duration-200 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{
        background: "linear-gradient(180deg, #131F35 0%, #0D1829 100%)",
        boxShadow: "1px 0 0 rgba(15,23,42,0.6), 4px 0 24px rgba(0,0,0,0.35)",
      }}
    >
      {/* ─── Top accent stripe ────────────────────── */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #3B5BDB 0%, #748FFC 60%, transparent 100%)" }} />

      {/* ─── Logo ─────────────────────────────────── */}
      <div className="px-4 pt-4 pb-4 flex flex-col gap-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between">
          <SmartSchoolWordmark size={14} color="#ECEEF8" />
          <span
            className="text-[9px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(16,185,129,0.12)",
              color: "var(--color-success)",
              fontFamily: "var(--font-dm-mono)",
            }}
          >
            ONLINE
          </span>
        </div>
        <p className="text-[11px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>
          {SCHOOL_NAME}
        </p>
      </div>

      {/* ─── Nav ──────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p
              className="px-3 mb-1.5 text-[9px] font-semibold tracking-[0.14em]"
              style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}
            >
              {section.label}
            </p>
            {section.items.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg mb-0.5 transition-all duration-150"
                  style={{
                    background: isActive ? "var(--color-primary)" : "transparent",
                    color: isActive ? "#FFFFFF" : "var(--color-nav-inactive)",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <Icon size={14} className="shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ─── Footer ───────────────────────────────── */}
      <div className="px-4 py-4 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          className="text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}
        >
          Term {CURRENT_TERM} · {CURRENT_SESSION}
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[12px] transition-colors"
          style={{ color: "var(--color-ink-4)", fontFamily: "var(--font-dm-sans)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-danger)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-ink-4)")}
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
