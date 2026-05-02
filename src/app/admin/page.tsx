import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  BarChart2,
  Printer,
  FileText,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ScoreCell } from "@/components/ui/ScoreCell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ADMIN_KPIS, STUDENTS, SUBJECTS, SCORES, FEE_RECORDS } from "@/lib/mock-data";
import { CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { Score } from "@/lib/types";

/* ─── Helpers ───────────────────────────────────────── */
function getScore(scores: Score[], studentId: string, subjectId: string) {
  return scores.find((s) => s.studentId === studentId && s.subjectId === subjectId) ?? null;
}

function kpiIcon(label: string) {
  if (label.includes("Cash"))       return <span className="text-xl">💳</span>;
  if (label.includes("Outstanding")) return <AlertTriangle size={18} className="text-warning" />;
  if (label.includes("Students"))   return <Users size={18} className="text-info" />;
  return <BarChart2 size={18} className="text-success" />;
}

/* ─── KPI Card ──────────────────────────────────────── */
function KPICard({ label, value, subValue, trend }: typeof ADMIN_KPIS[0]) {
  const trendUp = trend === "up";
  const TrendIcon = trendUp ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <Card variant="surface" padding="md" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] tracking-widest text-ink-4 uppercase"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {label}
        </span>
        {kpiIcon(label)}
      </div>

      <p
        className="text-ink text-3xl font-bold leading-none"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {value}
      </p>

      {subValue && (
        <div className="flex items-center gap-1.5">
          {TrendIcon && (
            <TrendIcon
              size={12}
              className={trendUp ? "text-success" : "text-danger"}
            />
          )}
          <span
            className={[
              "text-[11px]",
              trend === "up"   ? "text-success" :
              trend === "down" ? "text-danger"  : "text-ink-4",
            ].join(" ")}
          >
            {subValue}
          </span>
        </div>
      )}
    </Card>
  );
}

/* ─── Page ──────────────────────────────────────────── */
export default function CommandCenterPage() {
  /* locked student for results panel */
  const lockedStudent = STUDENTS[3];
  const lockedFee     = FEE_RECORDS.find((f) => f.studentId === lockedStudent.id)!;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-7">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Command Center
          </h1>
          <p className="text-ink-4 text-[13px]">Real-time overview of your school</p>
        </div>
        <Badge variant="default" size="md">
          TERM {CURRENT_TERM} · {CURRENT_SESSION}
        </Badge>
      </div>

      {/* ─── KPI Grid ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_KPIS.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ─── Revenue Gate Banner ─────────────────────── */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border"
        style={{ background: "#10B98112", borderColor: "#10B98133" }}
      >
        <div className="flex flex-col gap-0.5">
          <p
            className="text-success text-sm font-bold"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Revenue Gate Active
          </p>
          <p className="text-ink-5 text-xs">
            78 students with outstanding balances are flagged. Results withheld pending payment.
          </p>
        </div>
        <Link href="/admin/revenue">
          <Button variant="secondary" size="sm">
            View Recovery List →
          </Button>
        </Link>
      </div>

      {/* ─── Main Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

        {/* ─── Broadsheet ───────────────────────────── */}
        <Card variant="surface" padding="md">
          <CardHeader
            title="JSS 3 Alpha — Digital Broadsheet"
            subtitle="Continuous assessment · live preview"
            action={
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={<Printer size={13} />}>
                  Print
                </Button>
                <Button variant="secondary" size="sm" icon={<FileText size={13} />}>
                  Generate Reports
                </Button>
              </div>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="pb-2 text-[10px] tracking-widest text-ink-4 uppercase font-medium w-36"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    Student
                  </th>
                  {SUBJECTS.map((sub) => (
                    <th
                      key={sub.id}
                      className="pb-2 text-[10px] tracking-widest text-ink-4 uppercase font-medium text-center"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {sub.shortCode}
                    </th>
                  ))}
                  <th
                    className="pb-2 text-[10px] tracking-widest text-ink-4 uppercase font-medium text-center"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    AVG
                  </th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((student) => {
                  const studentScores = SUBJECTS.map((sub) =>
                    getScore(SCORES, student.id, sub.id)
                  );
                  const totals = studentScores
                    .map((s) => s?.total)
                    .filter((t): t is number => t !== null);
                  const avg =
                    totals.length > 0
                      ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
                      : null;

                  const fee = FEE_RECORDS.find((f) => f.studentId === student.id);
                  const isLocked = fee?.status === "owing";

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-border-subtle last:border-0"
                      style={isLocked ? { borderLeft: "2px solid #F59E0B" } : {}}
                    >
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{
                              background: "#7C3AED22",
                              color: "#A78BFA",
                              fontFamily: "var(--font-dm-mono)",
                            }}
                          >
                            {student.avatarInitials}
                          </div>
                          <span
                            className={[
                              "text-xs font-medium",
                              isLocked ? "text-ink-3" : "text-ink",
                            ].join(" ")}
                          >
                            {student.name.split(" ")[0]}
                          </span>
                        </div>
                      </td>

                      {studentScores.map((score, i) => (
                        <td key={i} className="py-2.5 text-center w-12 h-9">
                          <ScoreCell value={score?.total ?? null} type="total" />
                        </td>
                      ))}

                      <td className="py-2.5 text-center w-12">
                        <ScoreCell value={avg} type="total" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ─── Right Column ─────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Results Locked Panel */}
          <div
            className="rounded-xl border p-5 flex flex-col gap-4"
            style={{ background: "#111118", borderColor: "#F59E0B33" }}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <Lock size={36} className="text-warning" />
              <h3
                className="text-ink text-base font-bold"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Results Locked
              </h3>
              <p className="text-ink-4 text-xs leading-relaxed">
                <span className="text-danger font-medium">{lockedStudent.name}</span>
                {" "}has an outstanding balance preventing result release.
              </p>
            </div>

            {/* Fee breakdown */}
            <div className="flex flex-col gap-2">
              {[
                { label: "Term Fees",  value: `₦${lockedFee.amount.toLocaleString()}` },
                { label: "Paid",       value: `₦${lockedFee.paid.toLocaleString()}`, color: "text-success" },
                { label: "Balance",    value: `₦${lockedFee.balance.toLocaleString()}`, color: "text-danger" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-ink-4 text-xs">{label}</span>
                  <span
                    className={["text-xs font-semibold", color ?? "text-ink"].join(" ")}
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <ProgressBar
              value={lockedFee.paid}
              max={lockedFee.amount}
              variant="danger"
              size="xs"
            />

            <Button variant="primary" size="md" fullWidth>
              PAY &amp; UNLOCK NOW
            </Button>
          </div>

          {/* Reconciliation History */}
          <Card variant="surface" padding="md">
            <CardHeader title="Reconciliation" subtitle="Payment history" />
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <span className="text-3xl">💳</span>
              <p className="text-ink-4 text-xs text-center">No payments yet this session</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
