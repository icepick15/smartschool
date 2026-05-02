import Link from "next/link";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const QUICK_ACTIONS = [
  { emoji: "📝", label: "Enter Scores",  sub: "Broadsheet",  href: "/teacher/broadsheet", bg: "#7C3AED18" },
  { emoji: "⭐", label: "Friday Pulse",  sub: "Behaviour",   href: "/teacher/pulse",      bg: "#F59E0B18" },
  { emoji: "📋", label: "View Results",  sub: "Result Gate", href: "/teacher/results",    bg: "#6366F118" },
  { emoji: "📊", label: "Analytics",     sub: "Trendlines",  href: "/teacher/analytics",  bg: "#10B98118" },
];

const GLANCE_ROWS = [
  { label: "Students Present",     value: "142 / 158", color: "#10B981" },
  { label: "Scores Pending",       value: "3 subjects", color: "#F59E0B" },
  { label: "Fees Collected Today", value: "₦156,000",  color: "#A78BFA" },
];

export default function TeacherHomePage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-ink-4 text-[13px]">Good morning ☀️</p>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Mr. Adeleke
          </h1>
          <p className="text-ink-4 text-[13px]">JSS 3 Alpha · {SCHOOL_NAME}</p>
        </div>
        <Badge variant="default" size="md">
          Term {CURRENT_TERM} · {CURRENT_SESSION}
        </Badge>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Left column */}
        <div className="flex flex-col gap-6">

          {/* Hero recovery card */}
          <div
            className="rounded-2xl p-6 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}
          >
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                Fee Recovery · This Term
              </p>
              <p
                className="text-white text-[42px] font-extrabold leading-none"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                78%
              </p>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                ↑ +12% vs last term
              </p>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white w-fit"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                🏆 ₦420k recovered via Result Gate
              </div>
            </div>
            <CircularProgress
              value={78}
              size={100}
              strokeWidth={8}
              variant="primary"
              label="78%"
            />
          </div>

          {/* Quick actions */}
          <div>
            <h2
              className="text-ink text-[14px] font-bold mb-3"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {QUICK_ACTIONS.map(({ emoji, label, sub, href, bg }) => (
                <Link key={href} href={href}>
                  <Card variant="surface" padding="md" hover className="flex flex-col gap-3 h-full">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]"
                      style={{ background: bg }}
                    >
                      {emoji}
                    </div>
                    <div>
                      <p className="text-ink text-[13px] font-bold leading-tight">
                        {label}
                      </p>
                      <p className="text-ink-4 text-[11px] mt-0.5">{sub}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <Card variant="surface" padding="md" className="self-start">
          <CardHeader title="Today at a Glance" subtitle={`JSS 3 Alpha · ${SCHOOL_NAME}`} />
          <div className="flex flex-col divide-y divide-border">
            {GLANCE_ROWS.map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-ink-3 text-[13px]">{label}</span>
                <span
                  className="text-[14px] font-semibold"
                  style={{ color, fontFamily: "var(--font-dm-mono)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
