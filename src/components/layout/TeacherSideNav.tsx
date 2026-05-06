"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Grid3X3,
  FileText,
  Star,
  BarChart2,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Home",           href: "/teacher",            icon: LayoutDashboard },
  { label: "Class Ranking",  href: "/teacher/broadsheet", icon: BookOpen        },
  { label: "Upload Marks",   href: "/teacher/scores",     icon: Grid3X3         },
  { label: "Results",        href: "/teacher/results",    icon: FileText        },
  { label: "Weekly Check-In", href: "/teacher/pulse",    icon: Star            },
  { label: "Analytics",      href: "/teacher/analytics",  icon: BarChart2       },
  { label: "Messages",       href: "/teacher/messages",   icon: MessageSquare   },
];

interface TeacherSideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherSideNav({ isOpen, onClose }: TeacherSideNavProps) {
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
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-border flex flex-col gap-1">
        <SmartSchoolWordmark size={15} />
        <div className="flex items-center gap-2 mt-1">
          <p className="text-ink-5 text-[11px]">{SCHOOL_NAME}</p>
          <span
            className="text-[9px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: "var(--color-primary-badge)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
          >
            Teacher
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <p
          className="px-5 mb-1 text-[10px] tracking-widest text-ink-5 uppercase"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Classroom
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/teacher" && pathname.startsWith(href));
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
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-ink-3 text-[12px] font-medium">Mr. Adeleke</p>
          <p
            className="text-ink-5 text-[10px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Term {CURRENT_TERM} · {CURRENT_SESSION}
          </p>
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
