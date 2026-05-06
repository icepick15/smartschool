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
  LogOut,
} from "lucide-react";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const NAV_SECTIONS = [
  {
    label: "CORE",
    items: [
      { label: "Dashboard",  href: "/admin",          icon: LayoutDashboard },
      { label: "Academic",   href: "/admin/academic", icon: BookOpen },
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
      className={`fixed inset-y-0 left-0 w-[216px] flex flex-col z-40 border-r border-border transition-transform duration-200 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ background: "var(--color-sidebar)" }}
    >
      {/* ─── Logo ─────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 border-b border-border flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <SmartSchoolWordmark size={15} />
          <span
            className="text-[9px] font-medium tracking-widest text-success uppercase px-1.5 py-0.5 rounded"
            style={{ background: "var(--color-success-subtle)", color: "var(--color-success)", fontFamily: "var(--font-dm-mono)" }}
          >
            ONLINE
          </span>
        </div>
        <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
          {SCHOOL_NAME}
        </p>
      </div>

      {/* ─── Nav ──────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p
              className="px-5 mb-1 text-[10px] tracking-widest text-ink-5 uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
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
                  className="flex items-center gap-3 px-5 py-2 text-[13px] transition-colors duration-100"
                  style={{
                    borderLeft: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
                    background: isActive ? "var(--color-primary-subtle)" : "transparent",
                    color: isActive ? "var(--color-nav-active)" : "var(--color-nav-inactive)",
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

      {/* ─── Footer ───────────────────────────── */}
      <div className="px-5 py-4 border-t border-border flex flex-col gap-3">
        <div
          className="text-[10px] text-ink-5 tracking-widest uppercase"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Term {CURRENT_TERM} · {CURRENT_SESSION}
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[12px] text-ink-4 hover:text-danger transition-colors"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
