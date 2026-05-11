"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, BrainCircuit, Eye } from "lucide-react";
import { getCBTResults, getCBTSessions, releaseCBTResult } from "@/lib/store";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Badge } from "@/components/ui/Badge";
import type { CBTResult, CBTSession } from "@/lib/types";

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export default function AdminCBTPage() {
  const [mounted,  setMounted]  = useState(false);
  const [results,  setResults]  = useState<CBTResult[]>([]);
  const [sessions, setSessions] = useState<CBTSession[]>([]);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [released, setReleased] = useState<string[]>([]);

  useEffect(() => {
    setResults(getCBTResults());
    setSessions(getCBTSessions());
    setMounted(true);
  }, []);

  async function handleRelease(resultId: string) {
    setReleasing(resultId);
    await new Promise(r => setTimeout(r, 600));
    releaseCBTResult(resultId);
    setResults(getCBTResults());
    setReleasing(null);
    setReleased(prev => [...prev, resultId]);
    setTimeout(() => setReleased(prev => prev.filter(id => id !== resultId)), 3000);
  }

  async function handleReleaseAll(sessionId: string) {
    const pending = results.filter(r => r.sessionId === sessionId && !r.released);
    for (const r of pending) {
      releaseCBTResult(r.id);
      await new Promise(res => setTimeout(res, 80));
    }
    setResults(getCBTResults());
  }

  if (!mounted) {
    return (
      <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={5} />
      </div>
    );
  }

  // Group results by session
  const sessionIds = [...new Set(results.map(r => r.sessionId))];
  const pendingTotal = results.filter(r => !r.released).length;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-ink-4 text-[13px]">Computer-Based Testing</p>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            CBT Results
          </h1>
          <p className="text-ink-4 text-[13px]">Review and release student scores to gradebook</p>
        </div>
        {pendingTotal > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
            style={{ background: "#F59E0B18", color: "#F59E0B", fontFamily: "var(--font-dm-mono)" }}
          >
            <Clock size={12} />
            {pendingTotal} pending release
          </div>
        )}
      </div>

      {/* Empty state */}
      {results.length === 0 && (
        <div
          className="rounded-2xl border p-10 flex flex-col items-center gap-4 text-center"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <BrainCircuit size={32} style={{ color: "var(--color-ink-5)" }} />
          <p className="text-ink-4 text-[14px] font-medium">No CBT results yet</p>
          <p className="text-ink-5 text-[12px]">
            Results appear here once students complete a test.
          </p>
        </div>
      )}

      {/* Sessions */}
      {sessionIds.map(sid => {
        const sess         = sessions.find(s => s.id === sid);
        const sessionResults = results.filter(r => r.sessionId === sid);
        const pendingCount = sessionResults.filter(r => !r.released).length;
        const allReleased  = pendingCount === 0;

        return (
          <div
            key={sid}
            className="rounded-2xl border flex flex-col overflow-hidden"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            {/* Session header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--color-border)", background: "var(--color-elevated)" }}
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-ink text-[15px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                    {sess?.subjectName ?? sid}
                  </p>
                  {sess && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest"
                      style={{
                        background: "var(--color-primary-badge)",
                        color:      "var(--color-primary-light)",
                        fontFamily: "var(--font-dm-mono)",
                      }}
                    >
                      {sess.code}
                    </span>
                  )}
                </div>
                <p className="text-ink-5 text-[11px]">
                  {sess?.topicName ? `Topic: ${sess.topicName}` : "Full Term Review"} ·{" "}
                  {sess?.durationMinutes}min · {sess?.totalQuestions} questions ·{" "}
                  {sessionResults.length} student{sessionResults.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {allReleased ? (
                  <Badge variant="success" size="sm">All Released</Badge>
                ) : (
                  <>
                    <span className="text-ink-4 text-[12px]">
                      {pendingCount} pending
                    </span>
                    {sess?.scoreRelease === "admin_release" && (
                      <button
                        onClick={() => handleReleaseAll(sid)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-opacity hover:opacity-80"
                        style={{ background: "#7C3AED", color: "white" }}
                      >
                        <Eye size={12} />
                        Release All
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Results table */}
            <div className="flex flex-col divide-y" style={{ borderColor: "var(--color-border)" }}>
              {/* Column headers */}
              <div
                className="grid px-6 py-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  gridTemplateColumns: "1fr 80px 80px 80px 80px 120px",
                  color: "var(--color-ink-5)",
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                <span>Student</span>
                <span className="text-center">Score</span>
                <span className="text-center">%</span>
                <span className="text-center">CA /20</span>
                <span className="text-center">Completed</span>
                <span className="text-right">Action</span>
              </div>

              {sessionResults.map(result => {
                const isReleasing = releasing === result.id;
                const justReleased = released.includes(result.id);
                const scoreCol = result.percentage >= 40 ? "#10B981" : "#EF4444";

                return (
                  <div
                    key={result.id}
                    className="grid items-center px-6 py-3.5 transition-all"
                    style={{
                      gridTemplateColumns: "1fr 80px 80px 80px 80px 120px",
                      opacity: result.released && !justReleased ? 0.6 : 1,
                    }}
                  >
                    {/* Student */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ background: "var(--color-elevated)", color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)" }}
                      >
                        {result.studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-ink text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {result.studentName}
                      </span>
                    </div>

                    {/* Correct/total */}
                    <span
                      className="text-center text-[13px] font-semibold"
                      style={{ color: scoreCol, fontFamily: "var(--font-dm-mono)" }}
                    >
                      {result.correct}/{result.total}
                    </span>

                    {/* Percentage */}
                    <span
                      className="text-center text-[13px] font-bold"
                      style={{ color: scoreCol, fontFamily: "var(--font-dm-mono)" }}
                    >
                      {result.percentage}%
                    </span>

                    {/* CA score */}
                    <span
                      className="text-center text-[13px] font-semibold"
                      style={{ color: "var(--color-ink)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {result.caScore}
                    </span>

                    {/* Completed */}
                    <span
                      className="text-center text-[11px]"
                      style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {fmtDate(result.completedAt)}
                    </span>

                    {/* Action */}
                    <div className="flex justify-end">
                      {justReleased ? (
                        <div className="flex items-center gap-1 text-[11px]" style={{ color: "#10B981" }}>
                          <CheckCircle size={12} />
                          Released
                        </div>
                      ) : result.released ? (
                        <span className="text-ink-5 text-[11px]">In gradebook</span>
                      ) : sess?.scoreRelease === "admin_release" ? (
                        <button
                          onClick={() => handleRelease(result.id)}
                          disabled={!!isReleasing}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
                          style={{ background: "var(--color-primary)", color: "white" }}
                        >
                          <Eye size={11} />
                          {isReleasing ? "…" : "Release"}
                        </button>
                      ) : (
                        <span
                          className="flex items-center gap-1 text-[11px]"
                          style={{ color: "#10B981" }}
                        >
                          <CheckCircle size={11} />
                          Auto-released
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
