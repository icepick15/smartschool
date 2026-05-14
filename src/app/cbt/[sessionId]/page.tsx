"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";
import { CBT_QUESTIONS, SUBJECTS } from "@/lib/mock-data";
import {
  getCBTSessions,
  saveCBTResult,
  upsertScore,
  getTimerStart,
  setTimerStart,
  getScores,
} from "@/lib/store";
import {
  updateHeatmapFromCBT,
  recalculateWAEC,
  generateCognitiveFixPacks,
  getWAECReadiness,
} from "@/lib/cognitive-store";
import { getGrade } from "@/lib/constants";
import type { CBTQuestion, CBTSession } from "@/lib/types";

/* ─── Helpers ────────────────────────────────────────── */

function pickQuestions(session: CBTSession): CBTQuestion[] {
  let pool = CBT_QUESTIONS.filter(q => q.subjectId === session.subjectId);
  if (session.scope === "topic" && session.topicId) {
    pool = pool.filter(q => q.topicId === session.topicId);
  }
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  const pick    = (arr: CBTQuestion[], n: number) => shuffle(arr).slice(0, n);
  const { easy, medium, hard } = session.difficultyRatio;
  const total = session.totalQuestions;
  const questions = [
    ...pick(pool.filter(q => q.difficulty === "easy"),   Math.round((easy   / 100) * total)),
    ...pick(pool.filter(q => q.difficulty === "medium"), Math.round((medium / 100) * total)),
    ...pick(pool.filter(q => q.difficulty === "hard"),   Math.round((hard   / 100) * total)),
  ];
  return session.shuffleQuestions ? shuffle(questions) : questions;
}

interface DisplayQuestion extends CBTQuestion {
  displayOptions: string[];
  correctDisplay: number;
}

function prepareDisplay(q: CBTQuestion, shuffleOpts: boolean): DisplayQuestion {
  if (!shuffleOpts) {
    return { ...q, displayOptions: q.options, correctDisplay: q.correctIndex };
  }
  const indexed = q.options.map((opt, i) => ({ opt, correct: i === q.correctIndex }));
  indexed.sort(() => Math.random() - 0.5);
  return {
    ...q,
    displayOptions: indexed.map(i => i.opt),
    correctDisplay: indexed.findIndex(i => i.correct),
  };
}

function pad2(n: number) { return String(n).padStart(2, "0"); }

/* ─── Page ───────────────────────────────────────────── */

export default function TakeTestPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router        = useRouter();

  const [session,   setSession]   = useState<CBTSession | null>(null);
  const [questions, setQuestions] = useState<DisplayQuestion[]>([]);
  const [answers,   setAnswers]   = useState<(number | null)[]>([]);
  const [current,   setCurrent]   = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(0);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted,   setMounted]   = useState(false);

  const handleSubmit = useCallback((qs: DisplayQuestion[], ans: (number | null)[], sess: CBTSession, sid: string, sname: string) => {
    const breakdown = qs.map((q, i) => ({
      questionId:    q.id,
      topicId:       q.topicId,
      difficulty:    q.difficulty,
      studentAnswer: ans[i] ?? -1,
      correctAnswer: q.correctDisplay,
      isCorrect:     ans[i] === q.correctDisplay,
    }));
    const correct  = breakdown.filter(b => b.isCorrect).length;
    const total    = qs.length;
    const pct      = Math.round((correct / total) * 100);
    const caScore  = Math.round((correct / total) * 20);
    const existing = getScores().find(s => s.studentId === sid && s.subjectId === sess.subjectId);
    const result = {
      id:          `res-${Date.now()}`,
      sessionId:   sess.id,
      subjectId:   sess.subjectId,
      subjectName: sess.subjectName,
      studentId:   sid,
      studentName: sname,
      questionIds: qs.map(q => q.id),
      answers:     ans.map(a => a ?? -1),
      breakdown,
      correct,
      total,
      percentage:  pct,
      caScore,
      completedAt: new Date().toISOString(),
      released:    sess.scoreRelease === "immediate",
    };
    saveCBTResult(result);
    if (sess.scoreRelease === "immediate") {
      upsertScore({
        studentId: sid,
        subjectId: sess.subjectId,
        ca1:       existing?.ca1 === null || existing?.ca1 === undefined ? caScore : (existing.ca1 ?? caScore),
        ca2:       existing?.ca1 !== null && existing?.ca1 !== undefined ? caScore : (existing?.ca2 ?? null),
        exam:      existing?.exam ?? null,
        total:     null,
        grade:     null,
      });
    }

    // ── Cognitive pipeline ────────────────────────────
    const waecBefore = getWAECReadiness(sid)?.overallScore ?? null;
    updateHeatmapFromCBT(sid, breakdown);
    const newWAEC    = recalculateWAEC(sid);
    const fixPacks   = generateCognitiveFixPacks(sid);
    sessionStorage.setItem("cbt_cognitive_delta", JSON.stringify({
      waecBefore,
      waecAfter:  newWAEC.overallScore,
      fixPacksGenerated: fixPacks.length,
    }));
    // ─────────────────────────────────────────────────

    setSubmitted(true);
    router.push(`/cbt/${sess.id}/result`);
  }, [router]);

  useEffect(() => {
    const raw = sessionStorage.getItem("cbt_student");
    if (!raw) { router.push("/cbt/join"); return; }
    const { id, name } = JSON.parse(raw) as { id: string; name: string };
    setStudentId(id);
    setStudentName(name);

    const sessions = getCBTSessions();
    const sess = sessions.find(s => s.id === sessionId);
    if (!sess || sess.status !== "active") { router.push("/cbt/join"); return; }
    setSession(sess);

    const qs  = pickQuestions(sess).map(q => prepareDisplay(q, sess.shuffleOptions));
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setTimeLeft(sess.durationMinutes * 60);
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Timer with localStorage persistence
  useEffect(() => {
    if (!mounted || !session || submitted || !studentId) return;
    const startedAt = setTimerStart(session.id, studentId);
    const totalSec  = session.durationMinutes * 60;

    const tick = () => {
      const elapsed   = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalSec - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        handleSubmit(questions, answers, session, studentId, studentName);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [mounted, session, submitted, studentId, studentName, questions, answers, handleSubmit]);

  if (!mounted || !session || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-base)" }}>
        <p className="text-ink-4 text-[13px]">Loading test…</p>
      </div>
    );
  }

  const q         = questions[current];
  const answered  = answers.filter(a => a !== null).length;
  const timerRed  = timeLeft < 300;
  const mins      = Math.floor(timeLeft / 60);
  const secs      = timeLeft % 60;
  const progress  = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-base)" }}>

      {/* ─── Header bar ──────────────────────────────── */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-ink text-[13px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
            {session.subjectName}
          </p>
          <p className="text-ink-4 text-[11px]">{studentName}</p>
        </div>

        {/* Timer */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[16px]"
          style={{
            background: timerRed ? "#EF444418" : "var(--color-elevated)",
            color:      timerRed ? "#EF4444"   : "var(--color-ink)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          <Clock size={14} style={{ color: timerRed ? "#EF4444" : "var(--color-ink-4)" }} />
          {pad2(mins)}:{pad2(secs)}
        </div>

        <div className="text-ink-4 text-[12px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
          {answered}/{questions.length} answered
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background: "var(--color-elevated)" }}>
        <div
          className="h-full transition-all duration-300"
          style={{ background: "var(--color-primary)", width: `${progress}%` }}
        />
      </div>

      {/* ─── Question ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[640px] flex flex-col gap-6">

          {/* Question number + text */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded"
                style={{
                  background: q.difficulty === "easy" ? "#10B98118" : q.difficulty === "medium" ? "#F59E0B18" : "#EF444418",
                  color:      q.difficulty === "easy" ? "#10B981"   : q.difficulty === "medium" ? "#F59E0B"   : "#EF4444",
                  fontFamily: "var(--font-dm-mono)",
                  textTransform: "capitalize",
                }}
              >
                {q.difficulty}
              </span>
              <span className="text-ink-4 text-[12px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                Question {current + 1} of {questions.length}
              </span>
            </div>
            <p
              className="text-ink text-[18px] font-semibold leading-snug"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {q.text}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {q.displayOptions.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => {
                    const next = [...answers];
                    next[current] = i;
                    setAnswers(next);
                  }}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all"
                  style={{
                    background:  selected ? "var(--color-primary)" : "var(--color-surface)",
                    borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
                    minHeight:   "56px",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-[12px] font-bold"
                    style={{
                      borderColor: selected ? "rgba(255,255,255,0.5)" : "var(--color-border)",
                      background:  selected ? "rgba(255,255,255,0.2)" : "var(--color-elevated)",
                      color:       selected ? "white"                 : "var(--color-ink-4)",
                      fontFamily:  "var(--font-dm-mono)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span
                    className="text-[14px] font-medium leading-snug"
                    style={{
                      color:      selected ? "white" : "var(--color-ink)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all"
              style={{
                background:  "var(--color-surface)",
                borderColor: "var(--color-border)",
                color:       current === 0 ? "var(--color-ink-5)" : "var(--color-ink)",
                opacity:     current === 0 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all"
                style={{ background: "var(--color-primary)", borderColor: "var(--color-primary)", color: "white" }}
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                style={{ background: "#10B981", color: "white" }}
              >
                <CheckCircle size={15} /> Submit Test
              </button>
            )}
          </div>

          {/* Question dot navigator */}
          <div className="flex flex-wrap gap-1.5 justify-center pt-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-7 h-7 rounded-full text-[10px] font-bold transition-all"
                style={{
                  background: i === current
                    ? "var(--color-primary)"
                    : answers[i] !== null
                    ? "#10B98130"
                    : "var(--color-elevated)",
                  color: i === current ? "white" : answers[i] !== null ? "#10B981" : "var(--color-ink-4)",
                  fontFamily: "var(--font-dm-mono)",
                  border: `1px solid ${i === current ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Submit confirmation modal ────────────────── */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="w-full max-w-[380px] rounded-2xl border p-6 flex flex-col gap-5"
            style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)" }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-ink text-[16px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Submit Test?
              </p>
              <p className="text-ink-4 text-[13px]">
                You&apos;ve answered {answered} of {questions.length} questions.
                {answered < questions.length && (
                  <span style={{ color: "#F59E0B" }}> {questions.length - answered} unanswered.</span>
                )}
              </p>
            </div>
            {answered < questions.length && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[12px]"
                style={{ background: "#F59E0B12", color: "#F59E0B" }}
              >
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                Unanswered questions count as wrong. Go back to answer them.
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border text-[13px] font-medium"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink-3)", background: "var(--color-surface)" }}
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleSubmit(questions, answers, session, studentId, studentName);
                }}
                className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-bold"
                style={{ background: "#10B981" }}
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
