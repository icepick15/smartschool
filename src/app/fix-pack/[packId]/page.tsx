"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Zap, CheckCircle, XCircle, ChevronRight, Clock, BrainCircuit, TrendingUp,
} from "lucide-react";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import {
  getCognitiveFixPack,
  startCognitiveFixPack,
  completeSprintInPack,
  submitChallenge,
} from "@/lib/cognitive-store";
import type { CognitiveFixPack, CognitiveSprint } from "@/lib/types";

/* ─── Confetti ───────────────────────────────────────── */

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx     = canvas.getContext("2d")!;

    const COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#F472B6"];
    const pieces = Array.from({ length: 160 }, () => ({
      x:             Math.random() * canvas.width,
      y:             -Math.random() * canvas.height * 0.5,
      size:          Math.random() * 7 + 4,
      color:         COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:            (Math.random() - 0.5) * 4,
      vy:            Math.random() * 3 + 2,
      rotation:      Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      shape:         Math.random() > 0.5 ? "rect" : "circle",
    }));

    let rafId: number;
    const startTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;
      const fade    = Math.max(0, 1 - (elapsed - 2200) / 800);

      pieces.forEach(p => {
        p.y          += p.vy;
        p.x          += p.vx;
        p.rotation   += p.rotationSpeed;
        p.vy         += 0.06;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      });

      if (elapsed < 3000) rafId = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 60 }}
    />
  );
}

/* ─── Sprint card ────────────────────────────────────── */

const MODALITY_ICON: Record<string, React.ReactNode> = {
  infographic: <span className="text-lg">🗺️</span>,
  interactive: <span className="text-lg">🎮</span>,
  video:       <span className="text-lg">📹</span>,
  text:        <span className="text-lg">📖</span>,
};

const MODALITY_LABEL: Record<string, string> = {
  infographic: "Visual Guide",
  interactive: "Practice Mode",
  video:       "Explanation",
  text:        "Reading",
};

function SprintView({ sprint, onComplete }: { sprint: CognitiveSprint; onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(sprint.durationSeconds);
  const [autoReady, setAutoReady] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setAutoReady(true); return; }
    const t = setInterval(() => setTimeLeft(n => n - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const pct  = ((sprint.durationSeconds - timeLeft) / sprint.durationSeconds) * 100;

  const bullets = sprint.type === "refresher"
    ? sprint.content.split("\n").filter(Boolean)
    : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Sprint header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {MODALITY_ICON[sprint.modality]}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>
              {sprint.type === "refresher" ? "Quick Recap" : MODALITY_LABEL[sprint.modality]}
            </p>
            <p className="text-ink text-[15px] font-bold leading-snug" style={{ fontFamily: "var(--font-syne)" }}>{sprint.title}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-bold"
          style={{
            background:  timeLeft < 30 ? "#EF444418" : "var(--color-elevated)",
            color:       timeLeft < 30 ? "#EF4444"   : "var(--color-ink-4)",
            fontFamily:  "var(--font-dm-mono)",
          }}
        >
          <Clock size={11} />
          {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`}
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 rounded-full" style={{ background: "var(--color-elevated)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: "var(--color-primary)" }}
        />
      </div>

      {/* Content */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)" }}
      >
        {bullets ? (
          <ul className="flex flex-col gap-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold"
                  style={{ background: "var(--color-primary-badge)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
                >
                  {i + 1}
                </div>
                <p className="text-ink text-[14px] leading-relaxed">{b}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink text-[14px] leading-relaxed">{sprint.content}</p>
        )}
      </div>

      <button
        onClick={onComplete}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-[14px] font-bold transition-all"
        style={{
          background: autoReady ? "#10B981" : "var(--color-primary)",
        }}
      >
        {autoReady ? <CheckCircle size={16} /> : <ChevronRight size={16} />}
        {autoReady ? "Got it! Continue →" : "I understand — Next Sprint"}
      </button>
    </div>
  );
}

/* ─── Challenge ──────────────────────────────────────── */

function ChallengeView({
  pack,
  onSubmit,
}: {
  pack: CognitiveFixPack;
  onSubmit: (answers: (number | null)[]) => void;
}) {
  const DURATION = 300;
  const [answers,  setAnswers]  = useState<(number | null)[]>(pack.challenge.map(() => null));
  const [current,  setCurrent]  = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);

  useEffect(() => {
    if (timeLeft <= 0) { onSubmit(answers); return; }
    const t = setInterval(() => setTimeLeft(n => n - 1), 1000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const q        = pack.challenge[current];
  const answered = answers.filter(a => a !== null).length;
  const mins     = Math.floor(timeLeft / 60);
  const secs     = timeLeft % 60;
  const timerRed = timeLeft < 60;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>
            Challenge
          </p>
          <p className="text-ink text-[15px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
            {pack.topicName}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[14px]"
          style={{
            background:  timerRed ? "#EF444418" : "var(--color-elevated)",
            color:       timerRed ? "#EF4444"   : "var(--color-ink)",
            fontFamily:  "var(--font-dm-mono)",
          }}
        >
          <Clock size={13} />
          {mins}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      {/* Question */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>
            Q{current + 1} of {pack.challenge.length}
          </span>
          <span className="text-ink-5 text-[11px]">· {answered} answered</span>
        </div>
        <p className="text-ink text-[17px] font-semibold leading-snug" style={{ fontFamily: "var(--font-syne)" }}>
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => {
          const selected = answers[current] === i;
          return (
            <button
              key={i}
              onClick={() => {
                const next = [...answers];
                next[current] = i;
                setAnswers(next);
              }}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border text-left"
              style={{
                background:  selected ? "var(--color-primary)" : "var(--color-surface)",
                borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
                minHeight:   "54px",
              }}
            >
              <div
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-[12px] font-bold"
                style={{
                  borderColor: selected ? "rgba(255,255,255,0.4)" : "var(--color-border)",
                  background:  selected ? "rgba(255,255,255,0.2)" : "var(--color-elevated)",
                  color:       selected ? "white" : "var(--color-ink-4)",
                  fontFamily:  "var(--font-dm-mono)",
                }}
              >
                {String.fromCharCode(65 + i)}
              </div>
              <span
                className="text-[14px] font-medium leading-snug"
                style={{ color: selected ? "white" : "var(--color-ink)" }}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        {current > 0 && (
          <button
            onClick={() => setCurrent(c => c - 1)}
            className="flex-1 py-2.5 rounded-xl border text-[13px] font-medium"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink-3)", background: "var(--color-surface)" }}
          >
            Back
          </button>
        )}
        {current < pack.challenge.length - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-bold"
            style={{ background: "var(--color-primary)" }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={() => onSubmit(answers)}
            className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-bold"
            style={{ background: "#10B981" }}
          >
            Submit Challenge
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

type Phase = "intro" | "sprint" | "challenge" | "result";

export default function FixPackPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = use(params);
  const router     = useRouter();

  const [pack,       setPack]       = useState<CognitiveFixPack | null>(null);
  const [phase,      setPhase]      = useState<Phase>("intro");
  const [sprintIdx,  setSprintIdx]  = useState(0);
  const [result,     setResult]     = useState<{ passed: boolean; score: number; waecBefore: number; waecAfter: number } | null>(null);
  const [confetti,   setConfetti]   = useState(false);
  const [studentId,  setStudentId]  = useState("");
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("cbt_student");
    if (!raw) { router.push("/cbt/join"); return; }
    const { id } = JSON.parse(raw) as { id: string };
    setStudentId(id);

    const p = getCognitiveFixPack(packId);
    if (!p) { router.push("/student"); return; }
    setPack(p);
    setMounted(true);
  }, [packId, router]);

  const handleStart = useCallback(() => {
    if (!pack) return;
    startCognitiveFixPack(pack.id);
    setPack(prev => prev ? { ...prev, status: "in_progress" } : prev);
    setPhase("sprint");
  }, [pack]);

  const handleSprintComplete = useCallback(() => {
    if (!pack) return;
    const sprint = pack.sprints[sprintIdx];
    completeSprintInPack(pack.id, sprint.id);
    setPack(prev => {
      if (!prev) return prev;
      const sprints = prev.sprints.map((s, i) => i === sprintIdx ? { ...s, completed: true } : s);
      return { ...prev, sprints };
    });

    if (sprintIdx < pack.sprints.length - 1) {
      setSprintIdx(i => i + 1);
    } else {
      setPhase("challenge");
    }
  }, [pack, sprintIdx]);

  const handleChallengeSubmit = useCallback((answers: (number | null)[]) => {
    if (!pack) return;
    const res = submitChallenge(pack.id, answers, studentId);
    setResult(res);
    setPack(prev => prev ? {
      ...prev,
      status:         res.passed ? "completed" : "failed",
      challengeScore: res.score,
      masteryAfter:   res.waecAfter,
    } : prev);
    setPhase("result");
    if (res.passed) {
      setTimeout(() => setConfetti(true), 200);
      setTimeout(() => setConfetti(false), 3500);
    }
  }, [pack, studentId]);

  if (!mounted || !pack) return null;

  const completedSprints = pack.sprints.filter(s => s.completed).length;
  const progress = phase === "intro"
    ? 0
    : phase === "sprint"
    ? ((completedSprints + sprintIdx) / (pack.sprints.length + 1)) * 100
    : phase === "challenge" ? (pack.sprints.length / (pack.sprints.length + 1)) * 100
    : 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-base)" }}>
      <Confetti active={confetti} />

      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-5 py-3 border-b"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <SmartSchoolMark size={24} />
        <div className="flex-1 min-w-0">
          <p className="text-ink text-[13px] font-bold truncate" style={{ fontFamily: "var(--font-syne)" }}>{pack.topicName}</p>
          <p className="text-ink-5 text-[10px]">{pack.subjectName} Fix Pack</p>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} style={{ color: "#10B981" }} />
          <span className="text-[11px] font-bold" style={{ color: "#10B981", fontFamily: "var(--font-dm-mono)" }}>+{pack.waecImpact} WAEC pts</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1" style={{ background: "var(--color-elevated)" }}>
        <div className="h-full transition-all duration-500" style={{ background: "var(--color-primary)", width: `${progress}%` }} />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[600px]">

          {/* ── Intro ── */}
          {phase === "intro" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>FIX PACK</p>
                <h1 className="text-ink text-[26px] font-extrabold leading-tight" style={{ fontFamily: "var(--font-syne)" }}>{pack.topicName}</h1>
                <p className="text-ink-4 text-[13px]">{pack.subjectName}</p>
              </div>

              {/* Mastery preview */}
              <div
                className="rounded-2xl border p-4 flex items-center gap-4"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[24px] font-extrabold" style={{ color: "#EF4444", fontFamily: "var(--font-syne)" }}>{pack.masteryBefore}%</span>
                  <span className="text-[9px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>CURRENT</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <ChevronRight size={20} style={{ color: "var(--color-ink-5)" }} />
                  <span className="text-[10px]" style={{ color: "#10B981", fontFamily: "var(--font-dm-mono)" }}>+{pack.waecImpact} WAEC pts</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[24px] font-extrabold" style={{ color: "#10B981", fontFamily: "var(--font-syne)" }}>80%+</span>
                  <span className="text-[9px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>TARGET</span>
                </div>
              </div>

              {/* Sprint list */}
              <div className="flex flex-col gap-2">
                {pack.sprints.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                      style={{ background: "var(--color-elevated)", color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-ink text-[13px] font-medium">{s.title}</p>
                      <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                        {Math.ceil(s.durationSeconds / 60)} min · {MODALITY_LABEL[s.modality]}
                      </p>
                    </div>
                    <BookOpen size={14} style={{ color: "var(--color-ink-5)" }} />
                  </div>
                ))}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#10B98118" }}
                  >
                    <CheckCircle size={14} style={{ color: "#10B981" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-ink text-[13px] font-medium">Challenge</p>
                    <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      {pack.challenge.length} questions · Pass ≥ 67%
                    </p>
                  </div>
                  <Zap size={14} style={{ color: "#10B981" }} />
                </div>
              </div>

              <button
                onClick={handleStart}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-[15px] font-bold"
                style={{ background: "var(--color-primary)" }}
              >
                <Zap size={16} />
                Start Fix Pack
              </button>
            </div>
          )}

          {/* ── Sprint ── */}
          {phase === "sprint" && pack.sprints[sprintIdx] && (
            <SprintView
              key={pack.sprints[sprintIdx].id}
              sprint={pack.sprints[sprintIdx]}
              onComplete={handleSprintComplete}
            />
          )}

          {/* ── Challenge ── */}
          {phase === "challenge" && (
            <ChallengeView pack={pack} onSubmit={handleChallengeSubmit} />
          )}

          {/* ── Result ── */}
          {phase === "result" && result && (
            <div className="flex flex-col gap-5">
              {result.passed ? (
                <>
                  {/* Pass */}
                  <div
                    className="rounded-2xl border p-8 flex flex-col items-center gap-4 text-center"
                    style={{ background: "#10B98108", borderColor: "#10B981" }}
                  >
                    <CheckCircle size={48} style={{ color: "#10B981" }} />
                    <div>
                      <h1 className="text-[28px] font-extrabold" style={{ color: "#10B981", fontFamily: "var(--font-syne)" }}>
                        MASTERED!
                      </h1>
                      <p className="text-ink-4 text-[13px] mt-1">{pack.topicName}</p>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[32px] font-extrabold" style={{ color: "#EF4444", fontFamily: "var(--font-syne)" }}>{pack.masteryBefore}%</span>
                        <span className="text-[9px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>BEFORE</span>
                      </div>
                      <ChevronRight size={20} style={{ color: "#10B981" }} />
                      <div className="flex flex-col items-center">
                        <span className="text-[32px] font-extrabold" style={{ color: "#10B981", fontFamily: "var(--font-syne)" }}>{pack.masteryAfter ?? "—"}%</span>
                        <span className="text-[9px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>NOW</span>
                      </div>
                    </div>
                  </div>

                  {/* WAEC update */}
                  <div
                    className="rounded-2xl border p-4 flex items-center gap-4"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                  >
                    <TrendingUp size={20} style={{ color: "#10B981" }} />
                    <div className="flex-1">
                      <p className="text-ink text-[14px] font-bold">WAEC Readiness</p>
                      <p className="text-ink-4 text-[12px]">
                        {result.waecBefore} → <strong style={{ color: "#10B981" }}>{result.waecAfter}</strong>
                        {result.waecAfter > result.waecBefore && (
                          <span style={{ color: "#10B981" }}> (+{result.waecAfter - result.waecBefore} pts)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* Fail */
                <div
                  className="rounded-2xl border p-8 flex flex-col items-center gap-4 text-center"
                  style={{ background: "#F59E0B08", borderColor: "#F59E0B" }}
                >
                  <BrainCircuit size={48} style={{ color: "#F59E0B" }} />
                  <div>
                    <h1 className="text-[24px] font-extrabold" style={{ color: "#F59E0B", fontFamily: "var(--font-syne)" }}>
                      Keep Going!
                    </h1>
                    <p className="text-ink-4 text-[13px] mt-1">Score: {result.score}% — You need 67% to pass</p>
                    <p className="text-ink-5 text-[12px] mt-1">A new Fix Pack has been queued with a bit more support.</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/student")}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-[14px] font-bold"
                  style={{ background: "var(--color-primary)" }}
                >
                  View My Dashboard
                </button>
                <button
                  onClick={() => router.push("/cbt/join")}
                  className="py-3 rounded-2xl text-[13px] font-medium border"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-ink-4)", background: "var(--color-surface)" }}
                >
                  Join Another Test
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
