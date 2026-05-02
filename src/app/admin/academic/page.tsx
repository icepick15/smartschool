import Link from "next/link";
import { BookOpen, Users, BarChart2, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STUDENTS, SUBJECTS, SCORES } from "@/lib/mock-data";
import { getGrade, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const CLASSES = [
  { name: "JSS 1 Alpha",  level: "JSS",  students: 42, avgScore: 64, completion: 88 },
  { name: "JSS 1 Beta",   level: "JSS",  students: 40, avgScore: 61, completion: 92 },
  { name: "JSS 2 Alpha",  level: "JSS",  students: 38, avgScore: 68, completion: 78 },
  { name: "JSS 3 Alpha",  level: "JSS",  students:  6, avgScore: 0,  completion: 100, live: true },
  { name: "Primary 5",    level: "PRI",  students: 45, avgScore: 72, completion: 95 },
  { name: "Primary 6",    level: "PRI",  students: 41, avgScore: 69, completion: 80 },
];

export default function AcademicPage() {
  /* compute live stats for JSS 3 Alpha */
  const liveScores = SCORES.filter((s) => s.total !== null);
  const liveAvg    = liveScores.length
    ? Math.round(liveScores.reduce((a, s) => a + (s.total ?? 0), 0) / liveScores.length)
    : 0;
  CLASSES.find((c) => c.live)!.avgScore = liveAvg;

  const totalStudents  = CLASSES.reduce((s, c) => s + c.students, 0);
  const avgCompletion  = Math.round(CLASSES.reduce((s, c) => s + c.completion, 0) / CLASSES.length);

  /* subject completion for JSS 3 Alpha */
  const subjectStats = SUBJECTS.map((sub) => {
    const entries     = SCORES.filter((s) => s.subjectId === sub.id);
    const complete    = entries.filter((s) => s.total !== null).length;
    const subAvg      = complete
      ? Math.round(entries.filter((s) => s.total !== null).reduce((a, s) => a + (s.total ?? 0), 0) / complete)
      : 0;
    return { sub, complete, total: STUDENTS.length, avg: subAvg };
  });

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Academic Overview
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            Term {CURRENT_TERM} · {CURRENT_SESSION}
          </p>
        </div>
        <Badge variant="primary" size="md">LIVE DATA</Badge>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled",    value: totalStudents,        icon: <Users size={16} />,      color: "#6366F1" },
          { label: "Classes",     value: CLASSES.length,       icon: <BookOpen size={16} />,   color: "#7C3AED" },
          { label: "Subjects",    value: SUBJECTS.length,      icon: <BarChart2 size={16} />,  color: "#F59E0B" },
          { label: "Completion",  value: `${avgCompletion}%`,  icon: <CheckSquare size={16} />, color: "#10B981" },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border p-4 flex flex-col gap-3"
            style={{ background: "#111118" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-widest text-ink-4 uppercase"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {label}
              </span>
              <span style={{ color }}>{icon}</span>
            </div>
            <p
              className="text-ink text-[22px] font-bold leading-none"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Classes grid */}
      <Card variant="surface" padding="md">
        <CardHeader title="All Classes" subtitle="Score completion & averages this term" />
        <div className="flex flex-col divide-y divide-border">
          {CLASSES.map((cls) => (
            <div key={cls.name} className="py-3 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cls.live ? "#10B981" : "#2E2E3E" }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-ink text-[13px] font-semibold">{cls.name}</span>
                  {cls.live && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                      style={{ background: "#10B98120", color: "#10B981", fontFamily: "var(--font-dm-mono)" }}
                    >
                      LIVE
                    </span>
                  )}
                  <span
                    className="text-[10px] text-ink-5"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {cls.students} students
                  </span>
                </div>
                <ProgressBar value={cls.completion} max={100} variant="primary" size="xs" />
              </div>
              <div className="text-right shrink-0 w-24">
                <p
                  className="text-ink text-[14px] font-bold"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {cls.avgScore > 0 ? cls.avgScore : "—"}
                </p>
                <p className="text-ink-5 text-[10px]">{cls.completion}% done</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Subject breakdown — JSS 3 Alpha */}
      <Card variant="surface" padding="md">
        <CardHeader
          title="JSS 3 Alpha — Subject Breakdown"
          subtitle="Score entry completion per subject"
          action={
            <Link
              href="/teacher/scores"
              className="text-[12px] font-semibold"
              style={{ color: "#A78BFA" }}
            >
              Open Score Grid →
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {subjectStats.map(({ sub, complete, total, avg }) => (
            <div
              key={sub.id}
              className="rounded-lg border border-border p-3 flex flex-col gap-2"
              style={{ background: "#0D0D14" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-ink text-[13px] font-medium">{sub.name}</span>
                <span
                  className="text-[11px] font-bold"
                  style={{ fontFamily: "var(--font-dm-mono)", color: avg >= 75 ? "#10B981" : avg >= 50 ? "#F59E0B" : "#EF4444" }}
                >
                  Avg: {avg > 0 ? avg : "—"}
                </span>
              </div>
              <ProgressBar
                value={complete}
                max={total}
                variant={complete === total ? "success" : "warning"}
                size="xs"
              />
              <p className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {complete}/{total} students · Grade {getGrade(avg)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
