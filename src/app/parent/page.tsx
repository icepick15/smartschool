import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STUDENTS, SUBJECTS, SCORES, FEE_RECORDS } from "@/lib/mock-data";
import { getGrade } from "@/lib/constants";

/* View is locked to student s1 (Amara Okafor) as demo parent */
const STUDENT   = STUDENTS[0];
const FEE       = FEE_RECORDS.find((f) => f.studentId === STUDENT.id)!;
const MY_SCORES = SUBJECTS.map((sub) => {
  const s = SCORES.find((r) => r.studentId === STUDENT.id && r.subjectId === sub.id);
  return { subject: sub, score: s ?? null };
});

const CLASS_AVGS: Record<string, number> = {
  sub1: 68, sub2: 72, sub3: 65, sub4: 71, sub5: 69, sub6: 63,
};

const totals   = MY_SCORES.map((m) => m.score?.total).filter((t): t is number => t !== null);
const overall  = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
const classAvg = Math.round(Object.values(CLASS_AVGS).reduce((a, b) => a + b, 0) / SUBJECTS.length);

const STAT_CARDS = [
  { label: "OVERALL SCORE",     value: `${overall}/100`,       sub: `Grade ${getGrade(overall)}`, color: "#10B981" },
  { label: "CLASS AVERAGE",     value: `${classAvg}/100`,      sub: "JSS 3 Alpha",                color: "#6366F1" },
  { label: "RELATIVE POSITION", value: `+${overall - classAvg} pts`, sub: "above class avg",     color: "#A78BFA" },
  { label: "FEES STATUS",       value: FEE.status === "paid" ? "✅ Cleared" : "⚠️ Owing", sub: FEE.status === "paid" ? "All paid" : `₦${FEE.balance.toLocaleString()} balance`, color: FEE.status === "paid" ? "#10B981" : "#F59E0B" },
];

function gradeVariant(score: number | null) {
  if (!score) return "default" as const;
  if (score >= 75) return "success" as const;
  if (score >= 60) return "info"    as const;
  if (score >= 50) return "warning" as const;
  return "danger" as const;
}

export default function ParentHomePage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Student header */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold shrink-0"
          style={{ background: "#7C3AED22", color: "#A78BFA", fontFamily: "var(--font-dm-mono)" }}
        >
          {STUDENT.avatarInitials}
        </div>
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {STUDENT.name}
          </h1>
          <p className="text-ink-4 text-[13px]">{STUDENT.class} · Term 2, 2025/2026</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, sub, color }) => (
          <Card key={label} variant="surface" padding="sm" className="flex flex-col gap-1">
            <p
              className="text-[9px] tracking-widest uppercase"
              style={{ color: "#5A5A7A", fontFamily: "var(--font-dm-mono)" }}
            >
              {label}
            </p>
            <p
              className="text-[17px] font-bold leading-tight"
              style={{ color, fontFamily: "var(--font-syne)" }}
            >
              {value}
            </p>
            <p className="text-ink-4 text-[11px]">{sub}</p>
          </Card>
        ))}
      </div>

      {/* Subject report table */}
      <Card variant="surface" padding="md" className="max-w-2xl">
        <p
          className="text-ink text-[15px] font-bold mb-4"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Subject Report
        </p>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_44px_44px_44px] gap-1 pb-2 border-b border-border">
          {["SUBJECT", "CA", "EXM", "TOT"].map((h) => (
            <span
              key={h}
              className="text-[9px] tracking-widest text-ink-5 uppercase text-center first:text-left"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {h}
            </span>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-border-subtle">
          {MY_SCORES.map(({ subject, score }) => {
            const caTotal  = score ? (score.ca1 ?? 0) + (score.ca2 ?? 0) : null;
            const classAvgForSub = CLASS_AVGS[subject.id];
            return (
              <div
                key={subject.id}
                className="grid grid-cols-[1fr_44px_44px_44px] gap-1 items-center py-2.5"
              >
                <div>
                  <p className="text-ink text-[12px] font-medium">{subject.name}</p>
                  <p className="text-ink-4 text-[10px]">Avg: {classAvgForSub}</p>
                </div>
                <span
                  className="text-center text-[12px]"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#A0A0B8" }}
                >
                  {caTotal ?? "—"}
                </span>
                <span
                  className="text-center text-[12px]"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#A0A0B8" }}
                >
                  {score?.exam ?? "—"}
                </span>
                <div className="flex justify-center">
                  <Badge variant={gradeVariant(score?.total ?? null)} size="sm">
                    {score?.total ?? "—"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <ProgressBar
            value={overall}
            max={100}
            variant="primary"
            size="sm"
            label="Overall"
            showValue
          />
        </div>
      </Card>
    </div>
  );
}
