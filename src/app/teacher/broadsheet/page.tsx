import Link from "next/link";
import { STUDENTS, SCORES, SUBJECTS } from "@/lib/mock-data";
import { getGrade, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

const NUM_SUBJECTS = SUBJECTS.length;

function getRowColor(avg: number): string {
  if (avg < 40) return "var(--color-danger)";
  if (avg < 60) return "#F97316";
  return "var(--color-ink)";
}

export default function BroadsheetPage() {
  const ranked = STUDENTS.map(student => {
    const scores   = SCORES.filter(s => s.studentId === student.id && s.total !== null);
    const sumTotal = scores.reduce((s, r) => s + (r.total ?? 0), 0);
    const avg      = scores.length ? Math.round(sumTotal / scores.length) : 0;
    const cumPct   = Math.round((sumTotal / (NUM_SUBJECTS * 100)) * 100);
    return { student, sumTotal, avg, cumPct, grade: getGrade(avg) };
  }).sort((a, b) => b.sumTotal - a.sumTotal);

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Class Ranking
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            JSS 3 Alpha · Term {CURRENT_TERM} {CURRENT_SESSION} · {NUM_SUBJECTS} subjects
          </p>
        </div>
        <Badge variant="primary" size="md">Term {CURRENT_TERM}</Badge>
      </div>

      {/* Empty state */}
      {ranked.every(r => r.sumTotal === 0) && (
        <div
          className="rounded-xl border border-border p-12 flex flex-col items-center gap-4 text-center"
          style={{ background: "var(--color-surface)" }}
        >
          <span className="text-[40px]">📊</span>
          <div className="flex flex-col gap-1.5">
            <p className="text-ink text-[16px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              No scores entered yet
            </p>
            <p className="text-ink-3 text-[13px]">32 parents are waiting on Tolu&apos;s rank.</p>
            <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
              Top teachers post scores within 24h of class. Don&apos;t be last.
            </p>
          </div>
          <Link
            href="/teacher/scores"
            className="px-5 py-2.5 rounded-xl text-white text-[13px] font-bold transition-opacity hover:opacity-90"
            style={{ background: "var(--color-primary)", fontFamily: "var(--font-dm-sans)" }}
          >
            Enter Scores Now →
          </Link>
        </div>
      )}

      {/* Ranking table */}
      {ranked.some(r => r.sumTotal > 0) && (
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Column headers */}
        <div
          className="grid px-5 py-3 border-b border-border"
          style={{
            gridTemplateColumns: "48px 1fr 110px 100px 80px",
            background: "var(--color-sidebar)",
          }}
        >
          {["POS", "STUDENT", "TOTAL SCORE", "CUMULATIVE %", "GRADE"].map(col => (
            <span
              key={col}
              className="text-[10px] tracking-widest text-ink-4 uppercase text-center first:text-left last:text-center"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-border">
          {ranked.map(({ student, sumTotal, avg, cumPct, grade }, idx) => {
            const pos      = idx + 1;
            const rowColor = getRowColor(avg);
            const isLow    = avg < 40;
            const isTop3   = pos <= 3;

            return (
              <div
                key={student.id}
                className="grid items-center px-5"
                style={{
                  gridTemplateColumns: "48px 1fr 110px 100px 80px",
                  minHeight: 52,
                  borderLeft: isLow ? "3px solid var(--color-danger)" : "3px solid transparent",
                  background: isLow ? "var(--color-danger-muted)" : "transparent",
                }}
              >
                {/* Position */}
                <span
                  className="text-[14px] font-bold"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    color: isTop3 ? "var(--color-primary)" : "var(--color-ink-4)",
                  }}
                >
                  #{pos}
                </span>

                {/* Student */}
                <div className="flex items-center gap-3 py-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{
                      background: isLow ? "#EF444420" : "var(--color-primary-badge)",
                      color:      isLow ? "var(--color-danger)" : "var(--color-primary-light)",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {student.avatarInitials}
                  </div>
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: rowColor }}
                  >
                    {student.name}
                  </span>
                </div>

                {/* Total score */}
                <div className="flex items-center justify-center">
                  <span
                    className="text-[15px] font-bold"
                    style={{ fontFamily: "var(--font-dm-mono)", color: rowColor }}
                  >
                    {sumTotal}
                    <span className="text-[11px] font-normal text-ink-5 ml-0.5">
                      /{NUM_SUBJECTS * 100}
                    </span>
                  </span>
                </div>

                {/* Cumulative % */}
                <div className="flex items-center justify-center">
                  <span
                    className="text-[14px] font-semibold"
                    style={{ fontFamily: "var(--font-dm-mono)", color: rowColor }}
                  >
                    {cumPct}%
                  </span>
                </div>

                {/* Grade */}
                <div className="flex items-center justify-center">
                  <span
                    className="text-[13px] font-bold px-2 py-0.5 rounded"
                    style={{
                      fontFamily:  "var(--font-dm-mono)",
                      color:       rowColor,
                      background:  isLow ? "#EF444420" : avg < 60 ? "#F9731620" : "var(--color-primary-badge)",
                    }}
                  >
                    {grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {ranked.some(r => r.sumTotal > 0) && (
        <p
          className="text-ink-5 text-[11px] text-center"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Subject-level scores are visible to each subject teacher · Class Teacher view
        </p>
      )}
    </div>
  );
}
