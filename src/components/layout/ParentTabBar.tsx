"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "📄 Academic Report", href: "/parent"          },
  { label: "🟦 Subject Heatmap",  href: "/parent/subjects" },
  { label: "📈 Performance Trend", href: "/parent/trends"  },
  { label: "⚖️ vs Class Avg",      href: "/parent/compare" },
];

export function ParentTabBar() {
  const pathname = usePathname();

  return (
    <div
      className="sticky top-0 z-30 border-b border-border overflow-x-auto"
      style={{ background: "#0D0D14" }}
    >
      <div className="flex gap-1 px-4 py-2 min-w-max">
        {TABS.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150"
              style={{
                background: isActive ? "#7C3AED" : "transparent",
                color: isActive ? "#fff" : "#5A5A7A",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
