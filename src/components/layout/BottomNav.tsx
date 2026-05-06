"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, BarChart2, MessageSquare } from "lucide-react";

const ITEMS = [
  { label: "Home",       href: "/teacher",            icon: Home          },
  { label: "Broadsheet", href: "/teacher/broadsheet", icon: BookOpen      },
  { label: "Results",    href: "/teacher/results",    icon: FileText      },
  { label: "Analytics",  href: "/teacher/analytics",  icon: BarChart2     },
  { label: "Messages",   href: "/teacher/messages",   icon: MessageSquare },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center border-t border-border"
      style={{ background: "var(--color-sidebar)" }}
    >
      {ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/teacher" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
          >
            <Icon
              size={20}
              style={{ color: isActive ? "var(--color-primary)" : "#5A5A7A" }}
            />
            <span
              className="text-[10px] leading-none"
              style={{
                color: isActive ? "var(--color-primary-light)" : "#5A5A7A",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
