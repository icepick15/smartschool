"use client";

import { useEffect, useState, useCallback } from "react";
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
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ScoreCell } from "@/components/ui/ScoreCell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STUDENTS, SUBJECTS, SCORES, FEE_RECORDS, DIARIES } from "@/lib/mock-data";
import { seedStore, getFees, getScores } from "@/lib/store";
import { CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { Score, FeeRecord } from "@/lib/types";

function getScore(scores: Score[], studentId: string, subjectId: string) {
  return scores.find(s => s.studentId === studentId && s.subjectId === subjectId) ?? null;
}

interface KPIData {
  label: string;
  value: string;
  subValue: string;
  trend: "up" | "down" | "flat";
}

function kpiIcon(label: string) {
  if (label.includes("Cash"))        return <span className="text-xl">💳</span>;
  if (label.includes("Outstanding")) return <AlertTriangle size={18} className="text-warning" />;
  if (label.includes("Students"))    return <Users size={18} className="text-info" />;
  return <BarChart2 size={18} className="text-success" />;
}

function KPICard({ label, value, subValue, trend }: KPIData) {
  const trendUp = trend === "up";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  return (
    <Card variant="surface" padding="md" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-ink-4 uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
          {label}
        </span>
        {kpiIcon(label)}
      </div>
      <p className="text-ink text-3xl font-bold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
        {value}
      </p>
      {subValue && (
        <div className="flex items-center gap-1.5">
          {TrendIcon && <TrendIcon size={12} className={trendUp ? "text-success" : "text-danger"} />}
          <span className={["text-[11px]", trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-ink-4"].join(" ")}>
            {subValue}
          </span>
        </div>
      )}
    </Card>
  );
}

function formatNairaM(n: number) {
  return `₦${(n / 1_000_000).toFixed(2)}M`;
}

export default function CommandCenterPage() {
  const [fees,        setFees]        = useState<FeeRecord[]>([]);
  const [scores,      setScores]      = useState<Score[]>([]);
  const [blasting,    setBlasting]    = useState(false);
  const [blastResult, setBlastResult] = useState("");

  const loadState = useCallback(() => {
    setFees(getFees());
    setScores(getScores());
  }, []);

  useEffect(() => {
    seedStore(FEE_RECORDS, SCORES, DIARIES);
    loadState();
  }, [loadState]);

  /* Derived KPIs */
  const totalAmount    = fees.reduce((a, f) => a + f.amount, 0);
  const totalPaid      = fees.reduce((a, f) => a + f.paid,   0);
  const totalBalance   = fees.reduce((a, f) => a + f.balance, 0);
  const recoveryRate   = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
  const owingCount     = fees.filter(f => f.balance > 0).length;
  const atRiskCount    = scores.filter(s => s.total !== null && s.total < 40).length;

  async function handleWhatsAppBlast() {
    setBlasting(true);
    setBlastResult("");
    await new Promise(r => setTimeout(r, 1400));
    setBlasting(false);
    setBlastResult(`✓ ${owingCount} parents notified on WhatsApp`);
    setTimeout(() => setBlastResult(""), 4000);
  }

  const kpis: KPIData[] = [
    { label: "Cash at Bank",      value: "₦24.3M",            subValue: "+₦1.2M this week",        trend: "up"   },
    { label: "Outstanding Fees",  value: formatNairaM(totalBalance), subValue: `${owingCount} students`, trend: "down" },
    { label: "Total Students",    value: "1,248",              subValue: "Enrolled term 2",          trend: "flat" },
    { label: "Fee Recovery Rate", value: `${recoveryRate}%`,  subValue: "Target: 90%",              trend: recoveryRate >= 80 ? "up" : "flat" },
  ];

  /* Locked student = highest outstanding balance */
  const lockedFee = fees.reduce<FeeRecord | null>((best, f) => {
    if (f.balance <= 0) return best;
    if (!best || f.balance > best.balance) return f;
    return best;
  }, null);
  const lockedStudent = lockedFee ? STUDENTS.find(s => s.id === lockedFee.studentId) ?? null : null;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-7">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
            Command Center
          </h1>
          <p className="text-ink-4 text-[13px]">Real-time overview of your school</p>
        </div>
        <Badge variant="default" size="md">TERM {CURRENT_TERM} · {CURRENT_SESSION}</Badge>
      </div>

      {/* ─── KPI Grid ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => <KPICard key={kpi.label} {...kpi} />)}
      </div>

      {/* ─── At-risk callout ────────────────────────── */}
      {atRiskCount > 0 && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border"
          style={{ background: "var(--color-danger-muted)", borderColor: "var(--color-danger)" }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={15} className="text-danger shrink-0" />
            <div>
              <p className="text-ink text-sm font-bold">{atRiskCount} student{atRiskCount > 1 ? "s" : ""} at risk</p>
              <p className="text-ink-4 text-xs">Scored below 40/100 — parent alerts sent automatically</p>
            </div>
          </div>
          <Badge variant="danger" dot>{atRiskCount} flagged</Badge>
        </div>
      )}

      {/* ─── Revenue Gate Banner ─────────────────────── */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border"
        style={{ background: "#10B98112", borderColor: "#10B98133" }}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-success text-sm font-bold" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Revenue Gate Active
          </p>
          <p className="text-ink-5 text-xs">
            {owingCount} parent{owingCount !== 1 ? "s" : ""} with outstanding fees — results withheld until cleared.
          </p>
          {blastResult && (
            <p className="text-success text-[12px] font-medium mt-1">{blastResult}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/revenue">
            <Button variant="ghost" size="sm">View List</Button>
          </Link>
          <button
            onClick={handleWhatsAppBlast}
            disabled={blasting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "#25D366", fontFamily: "var(--font-dm-sans)" }}
          >
            <MessageCircle size={14} />
            {blasting ? "Sending…" : "WhatsApp All Debtors"}
          </button>
        </div>
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
                <Button variant="ghost" size="sm" icon={<Printer size={13} />}>Print</Button>
                <Button variant="secondary" size="sm" icon={<FileText size={13} />}>Generate Reports</Button>
              </div>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-[10px] tracking-widest text-ink-4 uppercase font-medium w-36" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    Student
                  </th>
                  {SUBJECTS.map(sub => (
                    <th key={sub.id} className="pb-2 text-[10px] tracking-widest text-ink-4 uppercase font-medium text-center" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      {sub.shortCode}
                    </th>
                  ))}
                  <th className="pb-2 text-[10px] tracking-widest text-ink-4 uppercase font-medium text-center" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    AVG
                  </th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map(student => {
                  const studentScores = SUBJECTS.map(sub => getScore(scores, student.id, sub.id));
                  const totals = studentScores.map(s => s?.total).filter((t): t is number => t !== null);
                  const avg    = totals.length > 0 ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : null;
                  const fee    = fees.find(f => f.studentId === student.id);
                  const isLocked = fee?.balance !== undefined && fee.balance > 0;
                  const hasRisk  = totals.some(t => t < 40);

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-border-subtle last:border-0"
                      style={hasRisk ? { borderLeft: "2px solid var(--color-danger)" } : isLocked ? { borderLeft: "2px solid var(--color-warning)" } : {}}
                    >
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{
                              background: hasRisk ? "#EF444420" : "var(--color-primary-badge)",
                              color:      hasRisk ? "var(--color-danger)"       : "var(--color-primary-light)",
                              fontFamily: "var(--font-dm-mono)",
                            }}
                          >
                            {student.avatarInitials}
                          </div>
                          <span className={["text-xs font-medium", isLocked ? "text-ink-3" : "text-ink"].join(" ")}>
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
          {lockedStudent && lockedFee && (
            <div
              className="rounded-xl border p-5 flex flex-col gap-4"
              style={{ background: "var(--color-surface)", borderColor: "#F59E0B33" }}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <Lock size={36} className="text-warning" />
                <h3 className="text-ink text-base font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                  Results Locked
                </h3>
                <p className="text-ink-4 text-xs leading-relaxed">
                  <span className="text-danger font-medium">{lockedStudent.name}</span>
                  {" "}has an outstanding balance preventing result release.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { label: "Term Fees", value: `₦${lockedFee.amount.toLocaleString()}` },
                  { label: "Paid",      value: `₦${lockedFee.paid.toLocaleString()}`,    color: "text-success" },
                  { label: "Balance",   value: `₦${lockedFee.balance.toLocaleString()}`, color: "text-danger"  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-ink-4 text-xs">{label}</span>
                    <span className={["text-xs font-semibold", color ?? "text-ink"].join(" ")} style={{ fontFamily: "var(--font-dm-mono)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <ProgressBar value={lockedFee.paid} max={lockedFee.amount} variant="danger" size="xs" />

              <Button variant="primary" size="md" fullWidth>
                PAY &amp; UNLOCK NOW
              </Button>
            </div>
          )}

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
