"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, BrainCircuit, Minus, TrendingUp, Zap } from "lucide-react";
import { getCBTResults, getCBTSessions } from "@/lib/store";
import { CBT_QUESTIONS, CBT_TOPICS } from "@/lib/mock-data";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import type { CBTResult, CBTSession } from "@/lib/types";

/* ─── Helpers ────────────────────────────────────────── */

function DiffRow({ label, color, correct, total }: { label: string; color: string; correct: number; total: number }) {
  if (total === 0) return null;
  const pct = Math.round((correct / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 w-[64px] shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-ink-3 text-[12px]">{label}</span>
      </div>
      <div className="flex-1 h-2 rounded-full" style={{ background: `${color}20` }}>
        <div className="h-full rounded-full transition-all" style={{ background: color, width: `${pct}%` }} />
      </div>
      <span className="text-[12px] font-semibold w-[52px] text-right shrink-0" style={{ color, fontFamily: "var(--font-dm-mono)" }}>
        {correct}/{total}
      </span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function CBTResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router        = useRouter();

  const [result,  setResult]  = useState<CBTResult | null>(null);
  const [session, setSession] = useState<CBTSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [waecDelta, setWaecDelta] = useState<{ waecBefore: number | null; waecAfter: number; fixPacksGenerated: number } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("cbt_student");
    if (!raw) { router.push("/cbt/join"); return; }
    const { id } = JSON.parse(raw) as { id: string; name: string };
    const r = getCBTResults().find(x => x.sessionId === sessionId && x.studentId === id);
    const s = getCBTSessions().find(x => x.id === sessionId);
    setResult(r ?? null);
    setSession(s ?? null);

    const deltaRaw = sessionStorage.getItem("cbt_cognitive_delta");
    if (deltaRaw) {
      setWaecDelta(JSON.parse(deltaRaw));
      sessionStorage.removeItem("cbt_cognitive_delta");
    }

    setMounted(true);
  }, [sessionId, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-base)" }}>
        <p className="text-ink-4 text-[13px]">Loading result…</p>
      </div>
    );
  }

  /* ── Pending release ── */
  if (result && !result.released) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6" style={{ background: "var(--color-base)" }}>
        <SmartSchoolMark size={40} />
        <div className="text-center flex flex-col gap-2">
          <Clock size={40} style={{ color: "var(--color-ink-5)", margin: "0 auto" }} />
          <h1 className="text-ink text-[22px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
            Results Pending
          </h1>
          <p className="text-ink-4 text-[14px] max-w-[320px]">
            Your teacher is reviewing results. You&apos;ll be notified once scores are released.
          </p>
        </div>
        <p className="text-ink-5 text-[12px]">You may close this tab.</p>
      </div>
    );
  }

  /* ── No result ── */
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4" style={{ background: "var(--color-base)" }}>
        <BrainCircuit size={32} style={{ color: "var(--color-ink-5)" }} />
        <p className="text-ink-4 text-[14px]">No result found for this test.</p>
        <button
          onClick={() => router.push("/cbt/join")}
          className="px-4 py-2 rounded-xl text-[13px] font-medium border"
          style={{ background: "var(--color-surface)", color: "var(--color-ink-3)", borderColor: "var(--color-border)" }}
        >
          Back to Join
        </button>
      </div>
    );
  }

  /* ── Derived breakdown data ── */
  const passed   = result.percentage >= 40;
  const scoreCol = passed ? "#10B981" : "#EF4444";
  const grade    = result.percentage >= 75 ? "A" : result.percentage >= 60 ? "B" : result.percentage >= 50 ? "C" : result.percentage >= 40 ? "D" : "F";

  // By difficulty
  const byDiff = (d: string) => {
    const rows = result.breakdown.filter(b => b.difficulty === d);
    return { total: rows.length, correct: rows.filter(b => b.isCorrect).length };
  };
  const easy   = byDiff("easy");
  const medium = byDiff("medium");
  const hard   = byDiff("hard");

  // By topic
  const topicMap = new Map<string, { name: string; correct: number; total: number }>();
  result.breakdown.forEach(b => {
    const topic = CBT_TOPICS.find(t => t.id === b.topicId);
    if (!topic) return;
    const entry = topicMap.get(b.topicId) ?? { name: topic.name, correct: 0, total: 0 };
    entry.total++;
    if (b.isCorrect) entry.correct++;
    topicMap.set(b.topicId, entry);
  });
  const topicRows = [...topicMap.values()].sort((a, b) => (a.correct / a.total) - (b.correct / b.total));

  // Per question
  const questionRows = result.breakdown.map(b => {
    const q     = CBT_QUESTIONS.find(x => x.id === b.questionId);
    const topic = CBT_TOPICS.find(t => t.id === b.topicId);
    return { ...b, questionText: q?.text ?? "—", topicName: topic?.name ?? "—", options: q?.options ?? [] };
  });

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--color-base)" }}>
      <div className="w-full max-w-[640px] mx-auto flex flex-col gap-5">

        {/* Logo */}
        <div className="flex justify-center">
          <SmartSchoolMark size={32} />
        </div>

        {/* Score hero */}
        <div
          className="rounded-2xl border p-8 flex flex-col items-center gap-4 text-center"
          style={{ background: passed ? "#10B98108" : "#EF444408", borderColor: passed ? "#10B981" : "#EF4444" }}
        >
          {passed ? <CheckCircle size={40} style={{ color: "#10B981" }} /> : <XCircle size={40} style={{ color: "#EF4444" }} />}
          <div className="flex flex-col gap-1">
            <p className="text-ink-4 text-[13px]">{result.subjectName} · {result.studentName}</p>
            <div className="text-[64px] font-extrabold leading-none" style={{ color: scoreCol, fontFamily: "var(--font-syne)" }}>
              {result.percentage}%
            </div>
            <p className="text-ink-4 text-[14px]">{result.correct} correct out of {result.total} questions</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ background: passed ? "#10B98118" : "#EF444418" }}>
            <span className="text-[28px] font-extrabold" style={{ color: scoreCol, fontFamily: "var(--font-dm-mono)" }}>{grade}</span>
            <div className="text-left">
              <p className="text-ink text-[13px] font-semibold">{passed ? "Well done!" : "Keep practising"}</p>
              <p className="text-ink-4 text-[11px]">CA score recorded: {result.caScore}/20</p>
            </div>
          </div>
        </div>

        {/* WAEC Readiness Delta */}
        {waecDelta && (
          <div
            className="rounded-2xl border p-5 flex flex-col gap-4"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "#10B981" }} />
              <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                WAEC Readiness Updated
              </h2>
            </div>

            {/* Score change */}
            <div className="flex items-center gap-3">
              {waecDelta.waecBefore !== null ? (
                <>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[28px] font-extrabold" style={{ color: "var(--color-ink-4)", fontFamily: "var(--font-syne)" }}>
                      {waecDelta.waecBefore}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>BEFORE</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                  <div
                    className="text-[13px] font-bold px-2 py-0.5 rounded"
                    style={{ background: "#10B98118", color: "#10B981", fontFamily: "var(--font-dm-mono)" }}
                  >
                    +{Math.max(0, waecDelta.waecAfter - waecDelta.waecBefore)} pts
                  </div>
                  <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[28px] font-extrabold" style={{ color: "#10B981", fontFamily: "var(--font-syne)" }}>
                      {waecDelta.waecAfter}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>NOW</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[28px] font-extrabold" style={{ color: "#10B981", fontFamily: "var(--font-syne)" }}>
                    {waecDelta.waecAfter}
                  </span>
                  <span className="text-ink-4 text-[13px]">WAEC readiness baseline set</span>
                </div>
              )}
            </div>

            {/* Fix packs generated */}
            {waecDelta.fixPacksGenerated > 0 && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "var(--color-elevated)" }}
              >
                <Zap size={16} style={{ color: "var(--color-primary-light)" }} />
                <div className="flex-1">
                  <p className="text-ink text-[13px] font-semibold">
                    {waecDelta.fixPacksGenerated} Fix Pack{waecDelta.fixPacksGenerated > 1 ? "s" : ""} generated
                  </p>
                  <p className="text-ink-4 text-[11px]">Personalized to your learning style • Ready at your peak time</p>
                </div>
                <button
                  onClick={() => router.push("/student")}
                  className="text-[12px] font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--color-primary)", color: "white" }}
                >
                  View
                </button>
              </div>
            )}
          </div>
        )}

        {/* Difficulty breakdown */}
        <div
          className="rounded-2xl border p-5 flex flex-col gap-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div>
            <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              Performance by Difficulty
            </h2>
            <p className="text-ink-5 text-[11px] mt-0.5">Where you're strong vs. where to focus</p>
          </div>
          <div className="flex flex-col gap-3">
            <DiffRow label="Easy"   color="#10B981" correct={easy.correct}   total={easy.total}   />
            <DiffRow label="Medium" color="#F59E0B" correct={medium.correct} total={medium.total} />
            <DiffRow label="Hard"   color="#EF4444" correct={hard.correct}   total={hard.total}   />
          </div>
        </div>

        {/* Topic breakdown */}
        {topicRows.length > 0 && (
          <div
            className="rounded-2xl border p-5 flex flex-col gap-4"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div>
              <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Performance by Topic
              </h2>
              <p className="text-ink-5 text-[11px] mt-0.5">Weakest topics shown first — these are your focus areas</p>
            </div>
            <div className="flex flex-col gap-3">
              {topicRows.map(({ name, correct, total }) => {
                const pct   = Math.round((correct / total) * 100);
                const color = pct >= 70 ? "#10B981" : pct >= 40 ? "#F59E0B" : "#EF4444";
                const tag   = pct >= 70 ? "Strong" : pct >= 40 ? "Needs work" : "Weak area";
                return (
                  <div key={name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-3 text-[12px]">{name}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: `${color}18`, color, fontFamily: "var(--font-dm-mono)" }}
                        >
                          {tag}
                        </span>
                        <span className="text-[12px] font-semibold" style={{ color, fontFamily: "var(--font-dm-mono)" }}>
                          {correct}/{total}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: `${color}20` }}>
                      <div className="h-full rounded-full transition-all" style={{ background: color, width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question-by-question */}
        <div
          className="rounded-2xl border p-5 flex flex-col gap-3"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div>
            <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              Question Breakdown
            </h2>
            <p className="text-ink-5 text-[11px] mt-0.5">Every question with your answer vs. the correct one</p>
          </div>

          <div className="flex flex-col gap-2">
            {questionRows.map((row, i) => {
              const studentOptText  = row.studentAnswer === -1 ? "— Skipped" : row.options[row.studentAnswer] ?? "—";
              const correctOptText  = row.options[row.correctAnswer] ?? "—";
              const diffColor = row.difficulty === "easy" ? "#10B981" : row.difficulty === "medium" ? "#F59E0B" : "#EF4444";

              return (
                <div
                  key={row.questionId}
                  className="flex flex-col gap-2 px-4 py-3 rounded-xl border"
                  style={{
                    background:  row.isCorrect ? "#10B98108" : row.studentAnswer === -1 ? "var(--color-elevated)" : "#EF444408",
                    borderColor: row.isCorrect ? "#10B98130" : row.studentAnswer === -1 ? "var(--color-border)"   : "#EF444430",
                  }}
                >
                  {/* Question header */}
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 mt-0.5">
                      {row.isCorrect
                        ? <CheckCircle size={14} style={{ color: "#10B981" }} />
                        : row.studentAnswer === -1
                        ? <Minus       size={14} style={{ color: "var(--color-ink-5)" }} />
                        : <XCircle     size={14} style={{ color: "#EF4444" }} />}
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>Q{i + 1}</span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded capitalize"
                          style={{ background: `${diffColor}18`, color: diffColor, fontFamily: "var(--font-dm-mono)" }}
                        >
                          {row.difficulty}
                        </span>
                        <span className="text-ink-5 text-[10px]">{row.topicName}</span>
                      </div>
                      <p className="text-ink text-[12px] leading-snug">{row.questionText}</p>
                    </div>
                  </div>

                  {/* Answer comparison — only show if wrong or skipped */}
                  {!row.isCorrect && (
                    <div className="flex flex-col gap-1 ml-5 pl-1 border-l-2" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] w-[56px] shrink-0" style={{ color: "#EF4444", fontFamily: "var(--font-dm-mono)" }}>
                          {row.studentAnswer === -1 ? "Skipped" : "Your ans"}
                        </span>
                        <span className="text-[12px]" style={{ color: row.studentAnswer === -1 ? "var(--color-ink-5)" : "#EF4444" }}>
                          {studentOptText}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] w-[56px] shrink-0" style={{ color: "#10B981", fontFamily: "var(--font-dm-mono)" }}>
                          Correct
                        </span>
                        <span className="text-[12px]" style={{ color: "#10B981" }}>{correctOptText}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {session?.scoreRelease === "admin_release" && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px]"
            style={{ background: "var(--color-surface)", color: "var(--color-ink-4)", border: "1px solid var(--color-border)" }}
          >
            <Clock size={13} />
            Score reflects on your report after Admin releases it.
          </div>
        )}

        <p className="text-ink-5 text-[11px] text-center pb-4">
          Your result has been recorded. You may close this tab.
        </p>
      </div>
    </div>
  );
}
