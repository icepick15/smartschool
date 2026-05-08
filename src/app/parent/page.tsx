"use client";

import { useEffect, useState, useCallback } from "react";
import { Lock, AlertTriangle, BookOpen, CheckCircle, Share2, Trophy, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STUDENTS, SUBJECTS, SCORES, FEE_RECORDS, DIARIES, FIX_PACKS } from "@/lib/mock-data";
import {
  seedStore, resetStore, getFees, getScores, getDiaries, updateFee,
  seedFixPacks, resetFixPacks, getFixPacks, purchaseFixPack, toggleFixPackItem,
} from "@/lib/store";
import { getGrade } from "@/lib/constants";
import type { FeeRecord, Score, Diary, FixPack } from "@/lib/types";

const DEMO_STUDENT_ID = "s2";
const STUDENT         = STUDENTS.find(s => s.id === DEMO_STUDENT_ID)!;
const FIRST_NAME      = STUDENT.name.split(" ")[0];
const CLASS_AVGS: Record<string, number> = { sub1: 68, sub2: 72, sub3: 65, sub4: 71, sub5: 69, sub6: 63 };
const CLASSMATES_PAID = 28;
const CLASS_SIZE      = 34;

async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  confetti({ particleCount: 160, spread: 90, origin: { y: 0.65 }, colors: ["#7C3AED", "#10B981", "#F59E0B", "#6366F1", "#C4B5FD"] });
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, colors: ["#7C3AED", "#10B981"] }), 400);
}

function scoreVariant(total: number | null) {
  if (total === null) return "default" as const;
  if (total >= 75)    return "success"  as const;
  if (total >= 60)    return "info"     as const;
  if (total >= 40)    return "warning"  as const;
  return "danger" as const;
}

export default function ParentHomePage() {
  const [fee,           setFee]          = useState<FeeRecord | null>(null);
  const [scores,        setScores]       = useState<Score[]>([]);
  const [diaries,       setDiaries]      = useState<Diary[]>([]);
  const [fixPack,       setFixPack]      = useState<FixPack | null>(null);
  const [paying,        setPaying]       = useState(false);
  const [justPaid,      setJustPaid]     = useState(false);
  const [shared,        setShared]       = useState(false);
  const [purchasingFP,  setPurchasingFP] = useState(false);
  const [fpPurchased,   setFpPurchased]  = useState(false);

  const loadState = useCallback(() => {
    setFee(getFees().find(f => f.studentId === DEMO_STUDENT_ID) ?? null);
    setScores(getScores().filter(s => s.studentId === DEMO_STUDENT_ID));
    setDiaries(
      getDiaries()
        .filter(d => d.studentId === DEMO_STUDENT_ID)
        .sort((a, b) => b.date.localeCompare(a.date)),
    );
    const packs    = getFixPacks().filter(fp => fp.studentId === DEMO_STUDENT_ID);
    const latest   = packs[0] ?? null;
    setFixPack(latest);
    if (latest?.purchased) setFpPurchased(true);
  }, []);

  useEffect(() => {
    seedStore(FEE_RECORDS, SCORES, DIARIES);
    seedFixPacks(FIX_PACKS);
    loadState();
  }, [loadState]);

  async function handleSimulatePay() {
    setPaying(true);
    await new Promise(r => setTimeout(r, 1400));
    updateFee(DEMO_STUDENT_ID, { paid: fee!.amount, balance: 0, status: "paid", lastPaymentDate: new Date().toISOString().split("T")[0] });
    loadState();
    setPaying(false);
    setJustPaid(true);
    fireConfetti();
  }

  async function handlePurchaseFixPack() {
    if (!fixPack) return;
    setPurchasingFP(true);
    await new Promise(r => setTimeout(r, 1400));
    purchaseFixPack(fixPack.id);
    loadState();
    setPurchasingFP(false);
    setFpPurchased(true);
    fireConfetti();
  }

  function handleToggleFPItem(itemId: string) {
    if (!fixPack) return;
    toggleFixPackItem(fixPack.id, itemId);
    loadState();
  }

  function handleShare() {
    const text = `🏆 I just unlocked ${FIRST_NAME}'s school report on SmartSchool! Top 10% of parents act this fast. #SmartSchool`;
    if (navigator.share) { navigator.share({ text }).catch(() => null); }
    else {
      navigator.clipboard.writeText(text).catch(() => null);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  }

  function handleReset() {
    resetStore(FEE_RECORDS, SCORES, DIARIES);
    resetFixPacks(FIX_PACKS);
    setJustPaid(false);
    setShared(false);
    setFpPurchased(false);
    loadState();
  }

  if (!fee) return null;

  const isLocked   = fee.balance > 0;
  const subjectMap = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));
  const atRisk     = scores.filter(s => s.total !== null && s.total < 40).sort((a, b) => (a.total ?? 0) - (b.total ?? 0));
  const lowestRisk = atRisk[0] ?? null;
  const totals     = scores.map(s => s.total).filter((t): t is number => t !== null);
  const overall    = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;

  const showFixPackPurchase = fixPack && !fpPurchased;
  const completedCount      = fixPack?.items.filter(i => i.completed).length ?? 0;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-bold shrink-0"
            style={{ background: "var(--color-primary-badge)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}>
            {STUDENT.avatarInitials}
          </div>
          <div>
            <h1 className="text-ink text-[24px] font-extrabold leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
              {STUDENT.name}
            </h1>
            <p className="text-ink-4 text-[13px]">{STUDENT.class} · Term 2, 2025/2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isLocked && <Badge variant="success" dot>Fees Cleared</Badge>}
          <button onClick={handleReset} className="text-[11px] transition-colors"
            style={{ color: "var(--color-nav-inactive)", fontFamily: "var(--font-dm-mono)" }}>
            Reset demo
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-6 items-start">

        {/* Left — card stack */}
        <div className="flex flex-col gap-4 w-[380px] shrink-0">

          {/* TOP 10% SUCCESS (fee payment) */}
          {justPaid && (
            <div className="rounded-xl border p-5 flex flex-col gap-4"
              style={{ background: "linear-gradient(135deg, #7C3AED18, #10B98118)", borderColor: "var(--color-success)" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F59E0B20" }}>
                  <Trophy size={22} style={{ color: "#F59E0B" }} />
                </div>
                <div>
                  <p className="text-ink text-[17px] font-extrabold leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
                    You Unlocked {FIRST_NAME}&apos;s Future!
                  </p>
                  <p className="text-ink-4 text-[12px]">You&apos;re now a Top 10% Parent.</p>
                </div>
              </div>
              <p className="text-ink-3 text-[13px] leading-relaxed">
                Only 1 in 10 parents act this fast. {FIRST_NAME} will feel the difference.
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "var(--color-primary)", color: "#fff", fontFamily: "var(--font-dm-sans)" }}>
                  <Share2 size={14} />
                  {shared ? "Copied to clipboard!" : "Share Badge"}
                </button>
                <button className="text-center text-[12px] font-medium hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-primary-light)", fontFamily: "var(--font-dm-sans)" }}>
                  View Report
                </button>
              </div>
            </div>
          )}

          {/* FEES DUE */}
          {isLocked && (
            <div className="rounded-xl border p-5 flex flex-col gap-4"
              style={{ background: "var(--color-danger-muted)", borderColor: "var(--color-danger)" }}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Lock size={13} className="text-danger" />
                  <span className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "var(--color-danger)", fontFamily: "var(--font-dm-mono)" }}>
                    Report Locked
                  </span>
                </div>
                <p className="text-ink text-[28px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
                  FEES DUE ₦{fee.balance.toLocaleString()}
                </p>
                <p className="text-ink-3 text-[13px]">
                  {CLASSMATES_PAID} classmates unlocked. {FIRST_NAME}&apos;s waiting.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button variant="primary" size="lg" fullWidth loading={paying} onClick={handleSimulatePay}
                  style={{ background: "#10B981", borderColor: "#10B981" }}>
                  UNLOCK {FIRST_NAME.toUpperCase()}&apos;S FUTURE
                </Button>
                <p className="text-center text-[11px]" style={{ color: "var(--color-nav-inactive)", fontFamily: "var(--font-dm-mono)" }}>
                  Avoid the talk at pickup.
                </p>
              </div>
            </div>
          )}

          {/* RISK CARD */}
          {lowestRisk && (
            <div className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ background: "var(--color-warning-muted)", borderColor: "var(--color-warning)" }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-warning" />
                <span className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: "var(--color-warning)", fontFamily: "var(--font-dm-mono)" }}>
                  At Risk
                </span>
                <Badge variant="danger" size="sm">Urgent</Badge>
              </div>
              <div>
                <p className="text-ink text-[22px] font-extrabold leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
                  {subjectMap[lowestRisk.subjectId]?.name.toUpperCase()} RISK {lowestRisk.total}/20
                </p>
                <p className="text-ink-3 text-[13px]">scored below pass mark</p>
              </div>
              <p className="text-ink-4 text-[12px] leading-relaxed">
                WAEC Data: 90% who ignore this fail SS3.
              </p>

              {showFixPackPurchase && (
                <>
                  <p className="text-[12px] font-semibold" style={{ color: "#EF4444" }}>
                    Only 2 Fix Pack slots left today.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={handlePurchaseFixPack}
                      disabled={purchasingFP}
                      className="w-full py-3 rounded-xl text-white text-[13px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: "#EF4444" }}
                    >
                      {purchasingFP ? "Processing…" : `RESCUE ${FIRST_NAME.toUpperCase()} ₦5,000`}
                    </button>
                    <p className="text-center text-[11px]" style={{ color: "var(--color-nav-inactive)", fontFamily: "var(--font-dm-mono)" }}>
                      You promised to help him.
                    </p>
                  </div>
                </>
              )}

              {!showFixPackPurchase && !fpPurchased && (
                <Button variant="secondary" size="md" fullWidth>
                  Book Parent-Teacher Meeting
                </Button>
              )}
            </div>
          )}

          {/* PURCHASED FIX PACK — items with checkmarks */}
          {fpPurchased && fixPack && (
            <div className="rounded-xl border p-5 flex flex-col gap-4"
              style={{ background: "#10B98110", borderColor: "#10B981" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold" style={{ color: "#10B981" }}>
                    🎯 Fix Pack Active
                  </span>
                </div>
                <span className="text-[12px] font-bold" style={{ color: "#10B981", fontFamily: "var(--font-dm-mono)" }}>
                  {completedCount}/{fixPack.items.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full rounded-full h-1.5" style={{ background: "var(--color-border)" }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ background: "#10B981", width: `${(completedCount / fixPack.items.length) * 100}%` }}
                />
              </div>

              <div className="flex flex-col gap-2">
                {fixPack.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleToggleFPItem(item.id)}
                    className="flex items-center gap-3 text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{
                        borderColor: item.completed ? "#10B981" : "var(--color-border)",
                        background:  item.completed ? "#10B981" : "transparent",
                      }}
                    >
                      {item.completed && <Check size={10} color="white" strokeWidth={3} />}
                    </div>
                    <span
                      className="text-[12px] leading-tight"
                      style={{
                        color:           item.completed ? "var(--color-ink-4)" : "var(--color-ink-3)",
                        textDecoration:  item.completed ? "line-through" : "none",
                        fontFamily:      "var(--font-dm-sans)",
                      }}
                    >
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>
                Tap to mark complete · Mr Adeleke can see progress
              </p>
            </div>
          )}

          {/* DIARY */}
          {diaries[0] && (
            <div className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-ink-4" />
                  <span className="text-ink-3 text-[12px] font-medium">{diaries[0].teacherName}</span>
                  <span className="text-ink-5 text-[11px]">· {diaries[0].time}</span>
                </div>
                <Badge variant="info" size="sm">New</Badge>
              </div>
              <p className="text-ink-3 text-[13px] leading-relaxed italic">
                &ldquo;{diaries[0].message}&rdquo;
              </p>
              <div className="flex flex-col gap-1">
                <button className="text-left text-[12px] font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-primary-light)", fontFamily: "var(--font-dm-sans)" }}>
                  Thank {diaries[0].teacherName.split(" ").pop()} →
                </button>
                <p className="text-[11px]" style={{ color: "var(--color-ink-5)" }}>
                  {diaries[0].message.includes("Homework:")
                    ? `Other kids submitted. ${FIRST_NAME}?`
                    : "Other mums got this. You're caught up."}
                </p>
              </div>
            </div>
          )}

          {/* All-clear */}
          {!isLocked && !lowestRisk && diaries.length === 0 && !justPaid && (
            <div className="rounded-xl border p-5 flex flex-col items-center gap-3 text-center"
              style={{ background: "var(--color-success-subtle)", borderColor: "var(--color-success)" }}>
              <CheckCircle size={24} className="text-success" />
              <div>
                <p className="text-ink text-[15px] font-semibold">All clear, {FIRST_NAME}!</p>
                <p className="text-ink-4 text-[12px] mt-0.5">Fees cleared · No at-risk subjects</p>
              </div>
            </div>
          )}
        </div>

        {/* Right — Subject Report */}
        <div className="relative flex-1 min-w-0">
          <Card variant="surface" padding="md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-ink text-[15px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>Term 2 Report Card</p>
              {!isLocked && (
                <Badge variant={overall >= 75 ? "success" : overall >= 60 ? "info" : "warning"}>Avg {overall}/100</Badge>
              )}
            </div>

            <div style={{ filter: isLocked ? "blur(5px)" : "none", transition: "filter 0.5s ease", pointerEvents: isLocked ? "none" : "auto" }}>
              <div className="grid grid-cols-[1fr_40px_40px_50px_56px] gap-1 pb-2 border-b border-border">
                {["SUBJECT", "CA1", "CA2", "EXAM", "TOTAL"].map(h => (
                  <span key={h} className="text-[9px] tracking-widest text-ink-5 uppercase text-center first:text-left"
                    style={{ fontFamily: "var(--font-dm-mono)" }}>{h}</span>
                ))}
              </div>
              <div className="flex flex-col divide-y divide-border-subtle">
                {SUBJECTS.map(sub => {
                  const sc     = scores.find(s => s.subjectId === sub.id);
                  const isRisk = sc?.total !== null && (sc?.total ?? 100) < 40;
                  return (
                    <div key={sub.id} className="grid grid-cols-[1fr_40px_40px_50px_56px] gap-1 items-center py-2.5">
                      <div>
                        <p className="text-ink text-[12px] font-medium">{sub.name}</p>
                        <p className="text-ink-5 text-[10px]">Class avg {CLASS_AVGS[sub.id]}</p>
                      </div>
                      {[sc?.ca1, sc?.ca2, sc?.exam].map((val, i) => (
                        <span key={i} className="text-center text-[12px]"
                          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--color-ink-3)" }}>
                          {val ?? "—"}
                        </span>
                      ))}
                      <div className="flex justify-center">
                        <Badge variant={isRisk ? "danger" : scoreVariant(sc?.total ?? null)} size="sm">
                          {sc?.total ?? "—"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!isLocked && totals.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border flex flex-col gap-2">
                  <ProgressBar value={overall} max={100} variant="primary" size="sm" label="Overall Average" showValue />
                  <p className="text-ink-5 text-[11px]">
                    Grade {getGrade(overall)} · {FIRST_NAME} is performing {overall >= 68 ? "above" : "below"} the class average
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Lock overlay */}
          {isLocked && (
            <div className="absolute inset-0 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(10, 10, 15, 0.6)" }}>
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <Lock size={20} className="text-danger" />
                <p className="text-ink text-[14px] font-semibold">Unlock Report Before Pickup</p>
                <p className="text-ink-4 text-[12px]">Scores are ready — waiting on payment</p>
                <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  Unlocks immediately after payment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
