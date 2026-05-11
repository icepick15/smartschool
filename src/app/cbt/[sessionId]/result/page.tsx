"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, BrainCircuit } from "lucide-react";
import { getCBTResults, getCBTSessions } from "@/lib/store";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import type { CBTResult, CBTSession } from "@/lib/types";

export default function CBTResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router        = useRouter();

  const [result,  setResult]  = useState<CBTResult | null>(null);
  const [session, setSession] = useState<CBTSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("cbt_student");
    if (!raw) { router.push("/cbt/join"); return; }
    const { id } = JSON.parse(raw) as { id: string; name: string };
    const results  = getCBTResults();
    const sessions = getCBTSessions();
    const r = results.find(x => x.sessionId === sessionId && x.studentId === id);
    const s = sessions.find(x => x.id === sessionId);
    setResult(r ?? null);
    setSession(s ?? null);
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
          <div className="flex justify-center">
            <Clock size={40} style={{ color: "var(--color-ink-5)" }} />
          </div>
          <h1 className="text-ink text-[22px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
            Results Pending
          </h1>
          <p className="text-ink-4 text-[14px] max-w-[320px]">
            Your teacher is reviewing the results. You&apos;ll be notified once scores are released.
          </p>
        </div>
        <p className="text-ink-5 text-[12px]">You may close this tab.</p>
      </div>
    );
  }

  /* ── No result found ── */
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4" style={{ background: "var(--color-base)" }}>
        <BrainCircuit size={32} style={{ color: "var(--color-ink-5)" }} />
        <p className="text-ink-4 text-[14px]">No result found for this test.</p>
        <button
          onClick={() => router.push("/cbt/join")}
          className="px-4 py-2 rounded-xl text-[13px] font-medium"
          style={{ background: "var(--color-surface)", color: "var(--color-ink-3)", border: "1px solid var(--color-border)" }}
        >
          Back to Join
        </button>
      </div>
    );
  }

  const passed   = result.percentage >= 40;
  const grade    = result.percentage >= 75 ? "A" : result.percentage >= 60 ? "B" : result.percentage >= 50 ? "C" : result.percentage >= 40 ? "D" : "F";
  const scoreCol = passed ? "#10B981" : "#EF4444";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-0" style={{ background: "var(--color-base)" }}>
      <div className="w-full max-w-[480px] flex flex-col gap-5">

        {/* Logo */}
        <div className="flex justify-center">
          <SmartSchoolMark size={32} />
        </div>

        {/* Score card */}
        <div
          className="rounded-2xl border p-8 flex flex-col items-center gap-4 text-center"
          style={{
            background:  passed ? "#10B98108" : "#EF444408",
            borderColor: passed ? "#10B981"   : "#EF4444",
          }}
        >
          {passed
            ? <CheckCircle size={40} style={{ color: "#10B981" }} />
            : <XCircle     size={40} style={{ color: "#EF4444" }} />}

          <div className="flex flex-col gap-1">
            <p className="text-ink-4 text-[13px]">{result.subjectName} · {result.studentName}</p>
            <div
              className="text-[64px] font-extrabold leading-none"
              style={{ color: scoreCol, fontFamily: "var(--font-syne)" }}
            >
              {result.percentage}%
            </div>
            <p className="text-ink-4 text-[14px]">
              {result.correct} correct out of {result.total} questions
            </p>
          </div>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-xl"
            style={{ background: passed ? "#10B98118" : "#EF444418" }}
          >
            <span
              className="text-[28px] font-extrabold"
              style={{ color: scoreCol, fontFamily: "var(--font-dm-mono)" }}
            >
              {grade}
            </span>
            <div className="text-left">
              <p className="text-ink text-[13px] font-semibold">
                {passed ? "Well done!" : "Keep practising"}
              </p>
              <p className="text-ink-4 text-[11px]">
                CA score recorded: {result.caScore}/20
              </p>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div
          className="rounded-2xl border p-5 flex flex-col gap-3"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <p className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
            Summary
          </p>
          {[
            { label: "Questions answered", value: `${result.answers.filter(a => a !== -1).length} / ${result.total}` },
            { label: "Correct answers",    value: `${result.correct}`,                                                color: "#10B981" },
            { label: "Wrong answers",      value: `${result.total - result.correct}`,                                color: "#EF4444" },
            { label: "Score",              value: `${result.percentage}%` },
            { label: "CA score (out of 20)", value: `${result.caScore}`,                                             color: scoreCol  },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-ink-3 text-[13px]">{label}</span>
              <span
                className="text-[13px] font-semibold"
                style={{ color: color ?? "var(--color-ink)", fontFamily: "var(--font-dm-mono)" }}
              >
                {value}
              </span>
            </div>
          ))}

          {session?.scoreRelease === "admin_release" && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] mt-1"
              style={{ background: "var(--color-elevated)", color: "var(--color-ink-4)" }}
            >
              <Clock size={11} />
              Score will reflect on your report after Admin releases it.
            </div>
          )}
        </div>

        <p className="text-ink-5 text-[11px] text-center">
          Your score has been recorded. You may close this tab.
        </p>
      </div>
    </div>
  );
}
