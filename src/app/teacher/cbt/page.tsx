"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BrainCircuit,
  Shuffle,
  Eye,
  EyeOff,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Zap,
  BookOpen,
  X,
  Clock,
} from "lucide-react";
import { SUBJECTS, CBT_TOPICS, CBT_QUESTIONS } from "@/lib/mock-data";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import type { CBTSession, CBTScope, CBTScoreRelease } from "@/lib/types";

const LS_KEY = "smartschool_cbt_sessions";

function getSessions(): CBTSession[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function pad2(n: number) { return String(n).padStart(2, "0"); }
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/* ─── Sub-components ─────────────────────────────────── */

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-6 flex flex-col gap-5"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="text-ink-4 text-[11px] tracking-widest uppercase"
      style={{ fontFamily: "var(--font-dm-mono)" }}
    >
      {children}
    </label>
  );
}

function DifficultyInput({
  label, color, value, onChange,
}: {
  label: string; color: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-[96px] shrink-0">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
        <span className="text-ink-3 text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{label}</span>
      </div>
      <div className="flex-1">
        <div className="h-1.5 rounded-full" style={{ background: `${color}25` }}>
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{ background: color, width: `${Math.min(value, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Math.min(100, Math.max(0, Number(e.target.value))))}
          className="w-14 px-2 py-1.5 rounded-lg text-[13px] border outline-none text-center"
          style={{
            background:  "var(--color-elevated)",
            borderColor: "var(--color-border)",
            color:       "var(--color-ink)",
            fontFamily:  "var(--font-dm-mono)",
          }}
        />
        <span className="text-ink-4 text-[12px]">%</span>
      </div>
    </div>
  );
}

function ToggleRow({
  label, sublabel, value, onChange,
}: {
  label: string; sublabel: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-ink text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{label}</span>
        <span className="text-ink-5 text-[11px]">{sublabel}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="flex-shrink-0 w-10 h-5 rounded-full transition-all relative"
        style={{
          background:  value ? "var(--color-primary)" : "var(--color-elevated)",
          border:      "1px solid var(--color-border)",
        }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          style={{
            background: value ? "white" : "var(--color-ink-4)",
            left:       value ? "calc(100% - 18px)" : "2px",
          }}
        />
      </button>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */

export default function CBTPage() {
  const [mounted,        setMounted]        = useState(false);
  const [sessions,       setSessions]       = useState<CBTSession[]>([]);
  const [subjectId,      setSubjectId]      = useState("sub1");
  const [scope,          setScope]          = useState<CBTScope>("general");
  const [topicId,        setTopicId]        = useState("");
  const [easy,           setEasy]           = useState(60);
  const [medium,         setMedium]         = useState(30);
  const [hard,           setHard]           = useState(10);
  const [duration,       setDuration]       = useState(30);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [shuffleQ,       setShuffleQ]       = useState(true);
  const [shuffleO,       setShuffleO]       = useState(true);
  const [scoreRelease,   setScoreRelease]   = useState<CBTScoreRelease>("immediate");
  const [published,      setPublished]      = useState(false);
  const [lastCode,       setLastCode]       = useState("");

  const ratioSum   = easy + medium + hard;
  const ratioValid = ratioSum === 100;

  const availableTopics = useMemo(
    () => CBT_TOPICS.filter(t => t.subjectId === subjectId),
    [subjectId],
  );

  useEffect(() => {
    setTopicId(availableTopics[0]?.id ?? "");
  }, [availableTopics]);

  const poolQuestions = useMemo(() => {
    let pool = CBT_QUESTIONS.filter(q => q.subjectId === subjectId);
    if (scope === "topic" && topicId) pool = pool.filter(q => q.topicId === topicId);
    return pool;
  }, [subjectId, scope, topicId]);

  const poolByDiff = useMemo(() => ({
    easy:   poolQuestions.filter(q => q.difficulty === "easy").length,
    medium: poolQuestions.filter(q => q.difficulty === "medium").length,
    hard:   poolQuestions.filter(q => q.difficulty === "hard").length,
  }), [poolQuestions]);

  const reqByDiff = useMemo(() => ({
    easy:   Math.round((easy   / 100) * totalQuestions),
    medium: Math.round((medium / 100) * totalQuestions),
    hard:   Math.round((hard   / 100) * totalQuestions),
  }), [easy, medium, hard, totalQuestions]);

  const shortEasy   = reqByDiff.easy   > poolByDiff.easy;
  const shortMedium = reqByDiff.medium > poolByDiff.medium;
  const shortHard   = reqByDiff.hard   > poolByDiff.hard;
  const hasShortage = shortEasy || shortMedium || shortHard;

  const canPublish = ratioValid && !hasShortage && totalQuestions > 0 && duration > 0;

  useEffect(() => {
    setSessions(getSessions());
    setMounted(true);
  }, []);

  function handlePublish() {
    if (!canPublish) return;
    const subject = SUBJECTS.find(s => s.id === subjectId)!;
    const topic   = CBT_TOPICS.find(t => t.id === topicId);
    const code    = `${subject.shortCode}-${String(Date.now()).slice(-4)}`;
    const session: CBTSession = {
      id:               `cbt-${Date.now()}`,
      code,
      subjectId,
      subjectName:      subject.name,
      scope,
      topicId:          scope === "topic" ? topicId    : undefined,
      topicName:        scope === "topic" ? topic?.name : undefined,
      difficultyRatio:  { easy, medium, hard },
      totalQuestions,
      shuffleQuestions: shuffleQ,
      shuffleOptions:   shuffleO,
      durationMinutes:  duration,
      scoreRelease,
      status:           "active",
      createdAt:        new Date().toISOString(),
    };
    const next = [session, ...sessions];
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setSessions(next);
    setLastCode(code);
    setPublished(true);
    setTimeout(() => setPublished(false), 60000);
  }

  function closeSession(id: string) {
    const next = sessions.map(s => s.id === id ? { ...s, status: "closed" as const } : s);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setSessions(next);
  }

  function removeSession(id: string) {
    const next = sessions.filter(s => s.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setSessions(next);
  }

  if (!mounted) {
    return (
      <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  const activeSessions = sessions.filter(s => s.status === "active");

  const selectStyle = {
    background:  "var(--color-elevated)",
    borderColor: "var(--color-border)",
    color:       "var(--color-ink)",
    fontFamily:  "var(--font-dm-sans)",
  };

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-7">

      {/* ─── Header ──────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-ink-4 text-[13px]">Computer-Based Testing</p>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            CBT Setup
          </h1>
          <p className="text-ink-4 text-[13px]">Configure and publish assessments for JSS 3 Alpha</p>
        </div>
        {activeSessions.length > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
            style={{ background: "#10B98118", color: "#10B981", fontFamily: "var(--font-dm-mono)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} />
            {activeSessions.length} active test{activeSessions.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ─── Two-column grid ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Left: Config form ──────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Card 1: Assessment Setup */}
          <SectionCard>
            <div>
              <h2 className="text-ink text-[15px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Assessment Setup
              </h2>
              <p className="text-ink-4 text-[12px] mt-0.5">Choose subject and question scope</p>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Subject</FieldLabel>
              <div className="relative">
                <select
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="w-full px-4 py-2.5 pr-9 rounded-xl text-[13px] border outline-none appearance-none"
                  style={selectStyle}
                >
                  {SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--color-ink-4)" }}
                />
              </div>
            </div>

            {/* Scope */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Question Scope</FieldLabel>
              <div className="flex gap-2">
                {(["general", "topic"] as CBTScope[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className="flex-1 py-2 rounded-xl text-[13px] font-medium border transition-all"
                    style={{
                      background:  scope === s ? "var(--color-primary)" : "var(--color-elevated)",
                      borderColor: scope === s ? "var(--color-primary)" : "var(--color-border)",
                      color:       scope === s ? "#fff" : "var(--color-ink-3)",
                      fontFamily:  "var(--font-dm-sans)",
                    }}
                  >
                    {s === "general" ? "Full Term Review" : "Topic Only"}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic (only when scope = topic) */}
            {scope === "topic" && (
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Topic</FieldLabel>
                <div className="relative">
                  <select
                    value={topicId}
                    onChange={e => setTopicId(e.target.value)}
                    className="w-full px-4 py-2.5 pr-9 rounded-xl text-[13px] border outline-none appearance-none"
                    style={selectStyle}
                  >
                    {availableTopics.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--color-ink-4)" }}
                  />
                </div>
              </div>
            )}
          </SectionCard>

          {/* Card 2: Difficulty Ratio */}
          <SectionCard>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-ink text-[15px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                  Difficulty Ratio
                </h2>
                <p className="text-ink-4 text-[12px] mt-0.5">Set percentage per level · must total 100%</p>
              </div>
              <span
                className="text-[12px] font-bold px-2 py-0.5 rounded-lg"
                style={{
                  background: ratioValid ? "#10B98118" : "#EF444418",
                  color:      ratioValid ? "#10B981"   : "#EF4444",
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                {ratioSum}%
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <DifficultyInput label="Easy"   color="#10B981" value={easy}   onChange={setEasy}   />
              <DifficultyInput label="Medium" color="#F59E0B" value={medium} onChange={setMedium} />
              <DifficultyInput label="Hard"   color="#EF4444" value={hard}   onChange={setHard}   />
            </div>

            {/* Visual breakdown bar */}
            {ratioSum > 0 && (
              <div className="flex h-2 rounded-full overflow-hidden">
                {easy   > 0 && <div className="transition-all" style={{ background: "#10B981", flex: easy   }} />}
                {medium > 0 && <div className="transition-all" style={{ background: "#F59E0B", flex: medium }} />}
                {hard   > 0 && <div className="transition-all" style={{ background: "#EF4444", flex: hard   }} />}
              </div>
            )}

            {!ratioValid && (
              <p className="text-[11px]" style={{ color: "#EF4444", fontFamily: "var(--font-dm-mono)" }}>
                {ratioSum < 100
                  ? `${100 - ratioSum}% unallocated — total must be exactly 100%`
                  : `${ratioSum - 100}% over limit — reduce values to reach 100%`}
              </p>
            )}
          </SectionCard>

          {/* Card 3: Test Settings */}
          <SectionCard>
            <div>
              <h2 className="text-ink text-[15px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Test Settings
              </h2>
              <p className="text-ink-4 text-[12px] mt-0.5">Duration, randomisation, and result release</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Duration</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={duration}
                    onChange={e => setDuration(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-3 py-2 rounded-xl text-[13px] border outline-none text-center"
                    style={{
                      background:  "var(--color-elevated)",
                      borderColor: "var(--color-border)",
                      color:       "var(--color-ink)",
                      fontFamily:  "var(--font-dm-mono)",
                    }}
                  />
                  <span className="text-ink-4 text-[12px]">minutes</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel>No. of Questions</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={poolQuestions.length || 99}
                    value={totalQuestions}
                    onChange={e => setTotalQuestions(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-3 py-2 rounded-xl text-[13px] border outline-none text-center"
                    style={{
                      background:  "var(--color-elevated)",
                      borderColor: "var(--color-border)",
                      color:       "var(--color-ink)",
                      fontFamily:  "var(--font-dm-mono)",
                    }}
                  />
                  <span className="text-ink-4 text-[12px]">questions</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <ToggleRow
                label="Shuffle question order"
                sublabel="Each student gets a different question sequence"
                value={shuffleQ}
                onChange={setShuffleQ}
              />
              <ToggleRow
                label="Shuffle answer options"
                sublabel="Prevents copying — option positions differ per student"
                value={shuffleO}
                onChange={setShuffleO}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Score Release</FieldLabel>
              <div className="flex gap-2">
                {([
                  { value: "immediate"     as CBTScoreRelease, label: "Show Immediately", icon: Eye     },
                  { value: "admin_release" as CBTScoreRelease, label: "Hold for Admin",   icon: EyeOff  },
                ]).map(({ value: v, label, icon: Icon }) => (
                  <button
                    key={v}
                    onClick={() => setScoreRelease(v)}
                    className="flex-1 py-2 px-3 rounded-xl text-[12px] font-medium border transition-all flex items-center gap-2 justify-center"
                    style={{
                      background:  scoreRelease === v ? "var(--color-primary)" : "var(--color-elevated)",
                      borderColor: scoreRelease === v ? "var(--color-primary)" : "var(--color-border)",
                      color:       scoreRelease === v ? "#fff" : "var(--color-ink-3)",
                      fontFamily:  "var(--font-dm-sans)",
                    }}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
              {scoreRelease === "admin_release" && (
                <p className="text-ink-5 text-[11px]">
                  Students see &quot;Results are being reviewed&quot; until Admin releases scores.
                </p>
              )}
            </div>
          </SectionCard>

          {/* Publish CTA */}
          {published ? (
            <div
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ background: "#10B98112", borderColor: "#10B981" }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                <p className="text-ink text-[13px] font-semibold">CBT Published!</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-ink-4 text-[11px] uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  Session Code — write this on the board
                </p>
                <p
                  className="text-[28px] font-extrabold tracking-widest"
                  style={{ color: "#10B981", fontFamily: "var(--font-dm-mono)" }}
                >
                  {lastCode}
                </p>
              </div>
              <p className="text-ink-4 text-[11px]">
                Students go to <span style={{ color: "var(--color-primary-light)" }}>/cbt/join</span> and enter this code. Timer starts on first open and persists on refresh.
              </p>
            </div>
          ) : (
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className="w-full py-3.5 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2"
              style={{
                background: canPublish ? "#10B981" : "var(--color-elevated)",
                color:      canPublish ? "white"   : "var(--color-ink-5)",
                opacity:    canPublish ? 1 : 0.6,
                cursor:     canPublish ? "pointer" : "not-allowed",
              }}
            >
              <Zap size={15} />
              Publish CBT — {totalQuestions} Questions · {duration} min
            </button>
          )}
        </div>

        {/* ── Right: Pool preview + Active tests ─────── */}
        <div className="flex flex-col gap-5">

          {/* Question Pool Preview */}
          <div
            className="rounded-2xl border p-5 flex flex-col gap-4"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Question Pool
              </h2>
              <span className="text-ink-4 text-[12px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {poolQuestions.length} available
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {([
                { label: "Easy",   color: "#10B981", pool: poolByDiff.easy,   req: reqByDiff.easy,   short: shortEasy   },
                { label: "Medium", color: "#F59E0B", pool: poolByDiff.medium, req: reqByDiff.medium, short: shortMedium },
                { label: "Hard",   color: "#EF4444", pool: poolByDiff.hard,   req: reqByDiff.hard,   short: shortHard   },
              ]).map(({ label, color, pool, req, short }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-ink-3 text-[12px]">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: short ? "#EF4444" : "var(--color-ink)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {req} needed
                    </span>
                    <span className="text-ink-5 text-[11px]">/ {pool} in pool</span>
                    {short && <AlertTriangle size={11} style={{ color: "#EF4444" }} />}
                  </div>
                </div>
              ))}
            </div>

            {hasShortage && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[11px]"
                style={{ background: "#EF444412", color: "#EF4444" }}
              >
                <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                <span>Not enough questions in pool. Reduce total or adjust the difficulty ratio.</span>
              </div>
            )}

            {!hasShortage && ratioValid && totalQuestions > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px]"
                style={{ background: "#10B98112", color: "#10B981" }}
              >
                <CheckCircle size={12} />
                <span>Pool is sufficient — ready to publish.</span>
              </div>
            )}

            <div className="pt-1 border-t flex flex-col gap-1" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-ink-5 text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-mono)" }}>
                Filtering
              </p>
              <p className="text-ink-3 text-[12px]">
                {scope === "general"
                  ? `All ${SUBJECTS.find(s => s.id === subjectId)?.name} questions`
                  : `${CBT_TOPICS.find(t => t.id === topicId)?.name ?? "—"} only`}
              </p>
            </div>
          </div>

          {/* Active / past tests */}
          {sessions.length > 0 ? (
            <div
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                My CBT Tests
              </h2>
              <div className="flex flex-col gap-2">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className="flex flex-col gap-1.5 px-3 py-3 rounded-xl border transition-opacity"
                    style={{
                      background:  session.status === "active" ? "var(--color-elevated)" : "transparent",
                      borderColor: "var(--color-border)",
                      opacity:     session.status === "closed" ? 0.5 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-ink text-[13px] font-semibold">{session.subjectName}</span>
                        {session.status === "active" && (
                          <span
                            className="text-[11px] font-bold tracking-widest px-1.5 py-0.5 rounded"
                            style={{ background: "var(--color-elevated)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
                          >
                            {session.code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: session.status === "active" ? "#10B98118" : "var(--color-surface)",
                            color:      session.status === "active" ? "#10B981"   : "var(--color-ink-5)",
                            fontFamily: "var(--font-dm-mono)",
                          }}
                        >
                          {session.status.toUpperCase()}
                        </span>
                        {session.status === "active" && (
                          <button
                            onClick={() => closeSession(session.id)}
                            title="Close test"
                            className="p-0.5 rounded transition-colors"
                            style={{ color: "var(--color-ink-5)" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#EF4444")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--color-ink-5)")}
                          >
                            <X size={12} />
                          </button>
                        )}
                        {session.status === "closed" && (
                          <button
                            onClick={() => removeSession(session.id)}
                            title="Remove"
                            className="p-0.5 rounded transition-colors"
                            style={{ color: "var(--color-ink-5)" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#EF4444")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--color-ink-5)")}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-ink-4 text-[11px] flex items-center gap-1">
                        <Clock size={10} /> {session.durationMinutes}min
                      </span>
                      <span className="text-ink-4 text-[11px] flex items-center gap-1">
                        <BookOpen size={10} /> {session.totalQuestions}Q
                      </span>
                      {session.shuffleQuestions && (
                        <span className="text-ink-4 text-[11px] flex items-center gap-1">
                          <Shuffle size={10} /> Shuffled
                        </span>
                      )}
                      <span className="text-ink-5 text-[10px] ml-auto" style={{ fontFamily: "var(--font-dm-mono)" }}>
                        {formatDate(session.createdAt)}
                      </span>
                    </div>

                    {session.topicName && (
                      <span className="text-ink-5 text-[11px]">Topic: {session.topicName}</span>
                    )}

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: "#10B98118", color: "#10B981", fontFamily: "var(--font-dm-mono)" }}
                      >
                        {session.difficultyRatio.easy}% Easy
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: "#F59E0B18", color: "#F59E0B", fontFamily: "var(--font-dm-mono)" }}
                      >
                        {session.difficultyRatio.medium}% Med
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: "#EF444418", color: "#EF4444", fontFamily: "var(--font-dm-mono)" }}
                      >
                        {session.difficultyRatio.hard}% Hard
                      </span>
                    </div>

                    {session.status === "active" && (
                      <p className="text-ink-5 text-[10px]">
                        Timer starts when first student opens · persists on browser refresh
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl border p-5 flex flex-col items-center gap-3 text-center"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <BrainCircuit size={28} style={{ color: "var(--color-ink-5)" }} />
              <p className="text-ink-4 text-[13px] font-medium">No tests yet</p>
              <p className="text-ink-5 text-[12px]">Configure and publish your first CBT above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
