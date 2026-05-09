"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Users,
  Phone,
  MessageCircle,
  Printer,
  FileText,
  Lock,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ScoreCell } from "@/components/ui/ScoreCell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import {
  STUDENTS, SUBJECTS, SCORES, FEE_RECORDS, DIARIES,
  TEACHER_COMPLIANCE, FIX_PACKS,
} from "@/lib/mock-data";
import {
  seedStore, getFees, getScores, getDiaries,
  seedTeacherCompliance, getTeacherCompliance,
  seedFixPacks, getFixPacks,
} from "@/lib/store";
import { CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { Score, FeeRecord, TeacherCompliance } from "@/lib/types";

function getScore(scores: Score[], studentId: string, subjectId: string) {
  return scores.find(s => s.studentId === studentId && s.subjectId === subjectId) ?? null;
}

/* ─── Key Metric tile ─────────────────────────────────── */
function MetricTile({
  label, value, sub, bad,
}: { label: string; value: string; sub: string; bad?: boolean }) {
  return (
    <Card variant="surface" padding="md" className="flex flex-col gap-1.5">
      <span
        className="text-[10px] tracking-widest text-ink-4 uppercase"
        style={{ fontFamily: "var(--font-dm-mono)" }}
      >
        {label}
      </span>
      <p
        className={["text-[22px] font-bold leading-none", bad ? "text-danger" : "text-ink"].join(" ")}
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {value}
      </p>
      <span className="text-ink-5 text-[11px]">{sub}</span>
    </Card>
  );
}

export default function CommandCenterPage() {
  const [mounted,    setMounted]    = useState(false);
  const [fees,       setFees]       = useState<FeeRecord[]>([]);
  const [scores,     setScores]     = useState<Score[]>([]);
  const [diaryCount, setDiaryCount] = useState(0);
  const [teachers,   setTeachers]   = useState<TeacherCompliance[]>([]);
  const [fpCount,    setFpCount]    = useState({ total: 0, purchased: 0 });

  const loadState = useCallback(() => {
    setFees(getFees());
    setScores(getScores());
    setDiaryCount(getDiaries().length);
    setTeachers(getTeacherCompliance());
    const fps = getFixPacks();
    setFpCount({ total: fps.length, purchased: fps.filter(f => f.purchased).length });
  }, []);

  useEffect(() => {
    seedStore(FEE_RECORDS, SCORES, DIARIES);
    seedTeacherCompliance(TEACHER_COMPLIANCE);
    seedFixPacks(FIX_PACKS);
    loadState();
    setMounted(true);
  }, [loadState]);

  /* ─── Derived values ──────────────────────────────── */
  const totalBalance = fees.reduce((a, f) => a + f.balance, 0);
  const totalPaid    = fees.reduce((a, f) => a + f.paid,    0);
  const totalAmount  = fees.reduce((a, f) => a + f.amount,  0);
  const owingCount   = fees.filter(f => f.balance > 0).length;
  const atRiskCount  = scores.filter(s => s.total !== null && s.total < 40).length;

  const unlockRate  = fees.length > 0
    ? Math.round(fees.filter(f => f.balance === 0).length / fees.length * 100)
    : 0;
  const fixPackRate = fpCount.total > 0
    ? Math.round(fpCount.purchased / fpCount.total * 100)
    : 0;
  const streakRate  = teachers.length > 0
    ? Math.round(teachers.filter(t => t.streakDays >= 7).length / teachers.length * 100)
    : 0;
  const diariesPerDay = (diaryCount / 7).toFixed(1);

  /* Bottom 10% teacher = lowest on-time %, only show if below 60% */
  const worstTeacher = teachers.length > 0
    ? [...teachers].sort((a, b) => a.onTimePercent - b.onTimePercent)[0]
    : null;
  const showTeacherAlert = worstTeacher !== null && worstTeacher.onTimePercent < 70;

  /* WhatsApp blast URL */
  const debtorMessage = `Dear Parent, this is a reminder from SmartSchool. Your child's outstanding fees of ₦${totalBalance.toLocaleString()} are now due. Please clear payment to unlock their academic report. Thank you.`;
  const whatsappBlastUrl = `https://wa.me/?text=${encodeURIComponent(debtorMessage)}`;

  /* Locked student = highest outstanding balance */
  const lockedFee = fees.reduce<FeeRecord | null>((best, f) => {
    if (f.balance <= 0) return best;
    if (!best || f.balance > best.balance) return f;
    return best;
  }, null);
  const lockedStudent = lockedFee ? STUDENTS.find(s => s.id === lockedFee.studentId) ?? null : null;

  const recoveryRate = totalAmount > 0 ? Math.round(totalPaid / totalAmount * 100) : 0;

  if (!mounted) {
    return (
      <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={4} />
      </div>
    );
  }

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
          <p className="text-ink-4 text-[13px]">Real-time overview — {CURRENT_TERM} · {CURRENT_SESSION}</p>
        </div>
        <Badge variant="default" size="md">TERM {CURRENT_TERM} · {CURRENT_SESSION}</Badge>
      </div>

      <OfflineBanner />

      {/* ─── Action Cards ────────────────────────────── */}
      {(owingCount > 0 || atRiskCount > 0 || showTeacherAlert) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Card 1: Cashflow */}
          {owingCount > 0 && (
            <div
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ borderColor: "#EF444433", background: "#EF444408" }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3
                      className="text-ink text-[15px] font-bold"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      ₦{totalBalance.toLocaleString()} Behind
                    </h3>
                    <span
                      className="text-[10px] font-bold text-white px-2 py-0.5 rounded shrink-0"
                      style={{ background: "#EF4444" }}
                    >
                      URGENT
                    </span>
                  </div>
                  <p className="text-ink-4 text-[12px] leading-relaxed">
                    Greenville recovered ₦12M last month using 1 button.
                  </p>
                </div>
              </div>
              <a
                href={whatsappBlastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#EF4444", fontFamily: "var(--font-dm-sans)" }}
              >
                <MessageCircle size={14} />
                WhatsApp All Debtors
              </a>
              <p className="text-center text-ink-5 text-[11px]">31 of 32 schools do this weekly.</p>
            </div>
          )}

          {/* Card 2: At-Risk Students */}
          {atRiskCount > 0 && (
            <div
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ borderColor: "#F59E0B33", background: "#F59E0B08" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3
                    className="text-ink text-[15px] font-bold"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {atRiskCount} At-Risk Student{atRiskCount > 1 ? "s" : ""}
                  </h3>
                  <span
                    className="text-[10px] font-bold text-white px-2 py-0.5 rounded shrink-0"
                    style={{ background: "#F59E0B" }}
                  >
                    FIX NOW
                  </span>
                </div>
                <p className="text-ink-4 text-[12px] leading-relaxed">
                  90% who don't fix Week 3 fail WAEC.
                </p>
              </div>
              <button
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#F59E0B", fontFamily: "var(--font-dm-sans)" }}
              >
                <Users size={14} />
                Blast Parents Now
              </button>
              <p className="text-center text-ink-5 text-[11px]">TTI avg: 62 days. Target: 2 days.</p>
            </div>
          )}

          {/* Card 3: Teacher Compliance */}
          {showTeacherAlert && worstTeacher && (
            <div
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ borderColor: "#EF444433", background: "var(--color-surface)" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3
                    className="text-ink text-[15px] font-bold"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {worstTeacher.name} — {worstTeacher.onTimePercent}%
                  </h3>
                  {worstTeacher.onTimePercent < 60 && (
                    <span
                      className="text-[10px] font-bold text-white px-2 py-0.5 rounded shrink-0"
                      style={{ background: "#EF4444" }}
                    >
                      BOTTOM 10%
                    </span>
                  )}
                </div>
                <p className="text-ink-4 text-[12px] leading-relaxed">
                  Period lost = ₦4,000 waste. Top schools fire bottom 10%.
                </p>
              </div>
              <a
                href={`tel:${worstTeacher.phone}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-[13px] font-bold transition-opacity hover:opacity-90 border"
                style={{
                  color: "#EF4444",
                  borderColor: "#EF4444",
                  background: "transparent",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <Phone size={14} />
                Call Teacher
              </a>
              <div className="flex flex-col gap-1 pt-1">
                {teachers.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center justify-between">
                    <span className="text-ink-4 text-[11px]">{t.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 rounded-full bg-elevated overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${t.onTimePercent}%`,
                            background: t.onTimePercent < 60 ? "#EF4444" : t.onTimePercent < 80 ? "#F59E0B" : "#10B981",
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] w-7 text-right"
                        style={{
                          fontFamily: "var(--font-dm-mono)",
                          color: t.onTimePercent < 60 ? "#EF4444" : "var(--color-ink-4)",
                        }}
                      >
                        {t.onTimePercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Key Metrics Strip ───────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricTile label="TTI"          value="62d"              sub="Target: 2 days"    bad />
        <MetricTile label="Diaries/day"  value={diariesPerDay}    sub="This week"         bad={parseFloat(diariesPerDay) < 1} />
        <MetricTile label="Unlock rate"  value={`${unlockRate}%`} sub="Fees cleared"      bad={unlockRate < 80} />
        <MetricTile label="Fix Pack %"   value={`${fixPackRate}%`} sub="Purchased"        bad={fixPackRate < 50} />
        <MetricTile label="Streak %"     value={`${streakRate}%`} sub="7-day streak"      bad={streakRate < 60} />
      </div>

      {/* ─── Fee Recovery Bar ────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-ink-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Fee recovery — Term {CURRENT_TERM}
          </span>
          <span className="text-ink font-semibold" style={{ fontFamily: "var(--font-dm-mono)" }}>
            {recoveryRate}% · {owingCount} outstanding
          </span>
        </div>
        <ProgressBar
          value={totalPaid}
          max={totalAmount}
          variant={recoveryRate >= 80 ? "success" : recoveryRate >= 60 ? "warning" : "danger"}
          size="sm"
        />
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
                  <th
                    className="pb-2 text-[10px] tracking-widest text-ink-4 uppercase font-medium w-36"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    Student
                  </th>
                  {SUBJECTS.map(sub => (
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
                {STUDENTS.map(student => {
                  const studentScores = SUBJECTS.map(sub => getScore(scores, student.id, sub.id));
                  const totals = studentScores.map(s => s?.total).filter((t): t is number => t !== null);
                  const avg    = totals.length > 0
                    ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
                    : null;
                  const fee      = fees.find(f => f.studentId === student.id);
                  const isLocked = fee?.balance !== undefined && fee.balance > 0;
                  const hasRisk  = totals.some(t => t < 40);

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-border-subtle last:border-0"
                      style={
                        hasRisk  ? { borderLeft: "2px solid var(--color-danger)" } :
                        isLocked ? { borderLeft: "2px solid var(--color-warning)" } : {}
                      }
                    >
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{
                              background: hasRisk ? "#EF444420" : "var(--color-primary-badge)",
                              color:      hasRisk ? "var(--color-danger)" : "var(--color-primary-light)",
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
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-warning shrink-0" />
                <div>
                  <p className="text-ink text-[13px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                    Results Locked
                  </p>
                  <p className="text-ink-5 text-[11px]">Highest outstanding balance</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: "#F59E0B20", color: "var(--color-warning)", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {lockedStudent.avatarInitials}
                  </div>
                  <span className="text-ink text-[13px] font-semibold">{lockedStudent.name}</span>
                </div>
                {[
                  { label: "Term Fees", value: `₦${lockedFee.amount.toLocaleString()}` },
                  { label: "Paid",      value: `₦${lockedFee.paid.toLocaleString()}`,    color: "text-success" },
                  { label: "Balance",   value: `₦${lockedFee.balance.toLocaleString()}`, color: "text-danger"  },
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

              <ProgressBar value={lockedFee.paid} max={lockedFee.amount} variant="danger" size="xs" />

              <div className="flex flex-col gap-2">
                <a
                  href={`https://wa.me/234${lockedStudent && fees.find(f => f.studentId === lockedStudent.id) ? "08000000000" : ""}?text=${encodeURIComponent(`Hi, this is SmartSchool. ${lockedStudent.name}'s fees of ₦${lockedFee.balance.toLocaleString()} are outstanding. Please pay to unlock their report card.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#EF4444", fontFamily: "var(--font-dm-sans)" }}
                >
                  <MessageCircle size={14} />
                  WhatsApp Nudge
                </a>
                <Link href="/admin/revenue">
                  <Button variant="ghost" size="sm" fullWidth>View Revenue Gate →</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Teacher Leaderboard */}
          <Card variant="surface" padding="md">
            <CardHeader title="Teacher Compliance" subtitle="On-time class logging" />
            <div className="flex flex-col gap-3 mt-2">
              {teachers.length === 0 && (
                <p className="text-ink-4 text-xs text-center py-4">No compliance data yet</p>
              )}
              {teachers.sort((a, b) => b.onTimePercent - a.onTimePercent).map(t => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-ink text-[12px] font-medium truncate">{t.name}</span>
                      <span
                        className="text-[11px] ml-2 shrink-0"
                        style={{
                          fontFamily: "var(--font-dm-mono)",
                          color: t.onTimePercent < 60 ? "#EF4444" : t.onTimePercent < 80 ? "#F59E0B" : "#10B981",
                        }}
                      >
                        {t.onTimePercent}%
                      </span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-elevated overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${t.onTimePercent}%`,
                          background: t.onTimePercent < 60 ? "#EF4444" : t.onTimePercent < 80 ? "#F59E0B" : "#10B981",
                        }}
                      />
                    </div>
                  </div>
                  {t.streakDays >= 7 && (
                    <span className="text-[11px] shrink-0" title={`${t.streakDays}-day streak`}>🔥</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
