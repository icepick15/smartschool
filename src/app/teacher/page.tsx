"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, BookOpen, AlertTriangle, X, Check } from "lucide-react";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { STUDENTS, SCORES, FEE_RECORDS, DIARIES, SUBJECTS, TODAY_TIMETABLE, FIX_PACKS } from "@/lib/mock-data";
import { seedStore, getScores, addDiary, seedFixPacks, getFixPacks, addFixPack } from "@/lib/store";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { Score, FixPack } from "@/lib/types";

type ClassState = "idle" | "active" | "diary" | "done";
type ActiveTab  = "attendance" | "topic" | "hw" | "behavior";

const TAB_LABELS: Record<ActiveTab, string> = {
  attendance: "Attendance",
  topic:      "Topic",
  hw:         "HW",
  behavior:   "Behavior",
};

const BEHAVIOR_RATINGS = [
  { score: 1, emoji: "😟", label: "Disruptive" },
  { score: 2, emoji: "😐", label: "Unfocused"  },
  { score: 3, emoji: "😊", label: "Good"       },
  { score: 4, emoji: "⭐", label: "Excellent"  },
] as const;

const QUICK_ACTIONS = [
  { emoji: "📝", label: "Upload Marks",   sub: "Score entry",  href: "/teacher/scores",     bg: "var(--color-primary-badge)" },
  { emoji: "🏆", label: "Class Ranking",  sub: "Broadsheet",   href: "/teacher/broadsheet", bg: "#6366F118" },
  { emoji: "⭐", label: "Weekly Check-In", sub: "Behaviour",   href: "/teacher/pulse",      bg: "#F59E0B18" },
  { emoji: "📊", label: "Analytics",      sub: "Trendlines",   href: "/teacher/analytics",  bg: "#10B98118" },
];

const CURRENT_SLOT = TODAY_TIMETABLE[0];
const CURRENT_SUBJ = SUBJECTS.find(s => s.id === CURRENT_SLOT.subjectId);
const TODAY        = new Date().toISOString().split("T")[0];

function pad2(n: number) { return String(n).padStart(2, "0"); }
function nowTime() {
  const d = new Date();
  const h = d.getHours(), m = d.getMinutes();
  return `${h % 12 || 12}:${pad2(m)}${h >= 12 ? "pm" : "am"}`;
}

function getDefaultItems(subjectName: string): string[] {
  return [
    `Complete all missed ${subjectName} assignments this week`,
    `Daily 20-min revision on ${subjectName} weak topics`,
    `One-on-one teacher session before end of week`,
    `Parent to review notes with child each evening`,
    `Mini re-test target: score 50+/100`,
  ];
}

export default function TeacherHomePage() {
  const [mounted,        setMounted]        = useState(false);
  const [classState,     setClassState]     = useState<ClassState>("idle");
  const [attendance,     setAttendance]     = useState<Record<string, boolean>>(() =>
    Object.fromEntries(STUDENTS.map(s => [s.id, true]))
  );
  const [activeTab,      setActiveTab]      = useState<ActiveTab>("attendance");
  const [classTopic,     setClassTopic]     = useState("");
  const [classHW,        setClassHW]        = useState("");
  const [hwDueDate,      setHwDueDate]      = useState("");
  const [classBehavior,  setClassBehavior]  = useState<Record<string, number | null>>(
    () => Object.fromEntries(STUDENTS.map(s => [s.id, null]))
  );
  const [diaryStudentId, setDiaryStudentId] = useState(STUDENTS[0].id);
  const [diaryMessage,   setDiaryMessage]   = useState("");
  const [sending,        setSending]        = useState(false);
  const [scores,         setScores]         = useState<Score[]>([]);
  const [fixPacks,       setFixPacks]       = useState<FixPack[]>([]);
  const [showFPModal,    setShowFPModal]    = useState(false);
  const [fpItems,        setFpItems]        = useState<string[]>(getDefaultItems(""));
  const [fpSaving,       setFpSaving]       = useState(false);
  const [fpSaved,        setFpSaved]        = useState(false);

  const presentCount = Object.values(attendance).filter(Boolean).length;

  const loadState = useCallback(() => {
    setScores(getScores());
    setFixPacks(getFixPacks());
  }, []);

  useEffect(() => {
    seedStore(FEE_RECORDS, SCORES, DIARIES);
    seedFixPacks(FIX_PACKS);
    loadState();
    setMounted(true);
  }, [loadState]);

  const atRiskScores    = scores.filter(s => s.total !== null && s.total < 40).sort((a, b) => (a.total ?? 0) - (b.total ?? 0));
  const lowestRiskScore = atRiskScores[0] ?? null;
  const lowestRiskStud  = lowestRiskScore ? STUDENTS.find(s => s.id === lowestRiskScore.studentId) ?? null : null;
  const lowestRiskSubj  = lowestRiskScore ? SUBJECTS.find(s => s.id === lowestRiskScore.subjectId)  ?? null : null;
  const riskFirstName   = lowestRiskStud?.name.split(" ")[0] ?? "";
  const atRiskCount     = scores.filter(s => s.total !== null && s.total < 40).length;
  const totals          = scores.map(s => s.total).filter((t): t is number => t !== null);
  const classAvg        = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
  const hasExistingFP   = lowestRiskScore ? fixPacks.some(fp => fp.studentId === lowestRiskScore.studentId) : false;

  function openFixPackModal() {
    setFpItems(getDefaultItems(lowestRiskSubj?.name ?? ""));
    setShowFPModal(true);
  }

  function toggleAttendance(studentId: string) {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  }

  function handleStartClass() {
    setAttendance(Object.fromEntries(STUDENTS.map(s => [s.id, true])));
    setActiveTab("attendance");
    setClassTopic("");
    setClassHW("");
    setHwDueDate("");
    setClassBehavior(Object.fromEntries(STUDENTS.map(s => [s.id, null])));
    setClassState("active");
  }

  function handleEndClass() {
    const parts: string[] = [];
    if (classTopic.trim()) parts.push(`Topic: ${classTopic.trim()}`);
    if (classHW.trim()) {
      const due = hwDueDate ? ` (Due: ${hwDueDate})` : "";
      parts.push(`Homework: ${classHW.trim()}${due}`);
    }
    setDiaryMessage(parts.join("\n\n"));
    setClassState("diary");
  }

  async function handleSendDiary() {
    if (!diaryMessage.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    addDiary({
      id:          `d-${Date.now()}`,
      studentId:   diaryStudentId,
      teacherName: "Mr. Adeleke",
      subject:     CURRENT_SUBJ?.name ?? "Class Diary",
      message:     diaryMessage.trim(),
      date:        TODAY,
      time:        nowTime(),
    });
    setSending(false);
    setClassState("done");
    setTimeout(() => setClassState("idle"), 2200);
  }

  function handleSkipDiary() { setClassState("idle"); }

  async function handleSaveFixPack() {
    if (!lowestRiskScore || !lowestRiskStud || !lowestRiskSubj) return;
    setFpSaving(true);
    await new Promise(r => setTimeout(r, 900));
    addFixPack({
      id:          `fp-${Date.now()}`,
      studentId:   lowestRiskScore.studentId,
      teacherName: "Mr. Adeleke",
      subject:     lowestRiskSubj.name,
      title:       `${riskFirstName} ${lowestRiskSubj.name} Fix Pack`,
      items:       fpItems.map((text, i) => ({ id: `item-${i}`, text: text.trim(), completed: false })),
      createdAt:   TODAY,
      purchased:   false,
      price:       5000,
    });
    loadState();
    setFpSaving(false);
    setShowFPModal(false);
    setFpSaved(true);
    setTimeout(() => setFpSaved(false), 4000);
  }

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

      {/* ─── Header ──────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-ink-4 text-[13px]">Good morning ☀️</p>
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
            Mr. Adeleke
          </h1>
          <p className="text-ink-4 text-[13px]">Class Teacher · JSS 3 Alpha · {SCHOOL_NAME}</p>
        </div>
        <div className="flex items-center gap-3">
          {atRiskCount > 0 && <Badge variant="danger" dot>{atRiskCount} at risk</Badge>}
          <Badge variant="default" size="md">Term {CURRENT_TERM} · {CURRENT_SESSION}</Badge>
        </div>
      </div>

      <OfflineBanner />

      {/* ─── Main grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Left column */}
        <div className="flex flex-col gap-6">

          {/* IDLE: hero */}
          {classState === "idle" && (
            <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}>
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Class average · This Term
                </p>
                <p className="text-white text-[42px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
                  {classAvg || "—"}
                  {classAvg > 0 && <span className="text-[18px] ml-1 opacity-60">/100</span>}
                </p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {atRiskCount > 0
                    ? `⚠ ${atRiskCount} student${atRiskCount > 1 ? "s" : ""} below pass mark`
                    : "✓ All students above pass mark"}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    32 parents waiting. Don&apos;t be last.
                  </p>
                  <button
                    onClick={handleStartClass}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white w-fit transition-opacity hover:opacity-90"
                    style={{ background: "rgba(255,255,255,0.18)" }}
                  >
                    Start {CURRENT_SUBJ?.name ?? "Class"} →
                  </button>
                </div>
              </div>
              <CircularProgress value={classAvg || 0} size={100} strokeWidth={8} variant="primary" label={classAvg ? `${classAvg}` : "—"} />
            </div>
          )}

          {/* ACTIVE: tabbed class card */}
          {classState === "active" && (
            <div
              className="rounded-2xl flex flex-col overflow-hidden"
              style={{ background: "linear-gradient(135deg, #059669, #065F46)" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-3">
                <div>
                  <p className="text-white text-[18px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
                    {CURRENT_SUBJ?.name ?? "Class"} in Session
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {CURRENT_SLOT.class} · Period {CURRENT_SLOT.period}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-white text-[28px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
                    {presentCount}/{STUDENTS.length}
                  </span>
                  <p className="text-[12px] opacity-60">present</p>
                </div>
              </div>

              {/* Tab bar */}
              <div className="px-6 pb-3">
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
                  {(["attendance", "topic", "hw", "behavior"] as ActiveTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                      style={{
                        background: activeTab === tab ? "rgba(255,255,255,0.18)" : "transparent",
                        color:      activeTab === tab ? "white" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {TAB_LABELS[tab]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="px-6 pb-5 flex flex-col gap-4">

                {/* Attendance tab */}
                {activeTab === "attendance" && (
                  <div className="grid grid-cols-2 gap-2">
                    {STUDENTS.map(student => {
                      const present = attendance[student.id];
                      return (
                        <button
                          key={student.id}
                          onClick={() => toggleAttendance(student.id)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                          style={{
                            background: present ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)",
                            border:     present ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: present ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)", color: "white", fontFamily: "var(--font-dm-mono)" }}
                          >
                            {student.avatarInitials}
                          </div>
                          <span className="text-white text-[12px] font-medium flex-1 text-left">
                            {student.name.split(" ")[0]}
                          </span>
                          {present
                            ? <CheckCircle size={14} color="rgba(255,255,255,0.8)" />
                            : <XCircle    size={14} color="rgba(255,255,255,0.35)" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Topic tab */}
                {activeTab === "topic" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      What did you cover today? This goes into the diary sent to parents.
                    </p>
                    <textarea
                      value={classTopic}
                      onChange={e => setClassTopic(e.target.value)}
                      rows={5}
                      placeholder={`e.g. ${CURRENT_SUBJ?.name ?? "Lesson"} — key concepts, page references, how the class performed...`}
                      className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none"
                      style={{
                        background:  "rgba(255,255,255,0.10)",
                        border:      "1px solid rgba(255,255,255,0.18)",
                        color:       "white",
                        fontFamily:  "var(--font-dm-sans)",
                      }}
                    />
                    {classTopic.trim() && (
                      <div className="flex items-center gap-2">
                        <Check size={12} color="rgba(255,255,255,0.6)" />
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                          Saved — will appear in diary
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* HW tab */}
                {activeTab === "hw" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Set homework. Parents are notified when the diary is sent.
                    </p>
                    <textarea
                      value={classHW}
                      onChange={e => setClassHW(e.target.value)}
                      rows={4}
                      placeholder="e.g. Complete exercises 5.1–5.5 on page 87. Show all working."
                      className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none"
                      style={{
                        background: "rgba(255,255,255,0.10)",
                        border:     "1px solid rgba(255,255,255,0.18)",
                        color:      "white",
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <label
                        className="text-[10px] tracking-widest uppercase"
                        style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-mono)" }}
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={hwDueDate}
                        onChange={e => setHwDueDate(e.target.value)}
                        className="px-4 py-2 rounded-xl text-[13px] outline-none"
                        style={{
                          background: "rgba(255,255,255,0.10)",
                          border:     "1px solid rgba(255,255,255,0.18)",
                          color:      "white",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      />
                    </div>
                    {classHW.trim() && (
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Parents see: &quot;Other kids submitted. {riskFirstName || "Tolu"}?&quot;
                      </p>
                    )}
                  </div>
                )}

                {/* Behavior tab */}
                {activeTab === "behavior" && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Tap to rate each student&apos;s conduct this period.
                    </p>
                    {STUDENTS.map(student => {
                      const rating = classBehavior[student.id];
                      return (
                        <div
                          key={student.id}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: "rgba(255,255,255,0.2)", color: "white", fontFamily: "var(--font-dm-mono)" }}
                          >
                            {student.avatarInitials}
                          </div>
                          <span className="text-white text-[12px] font-medium flex-1">
                            {student.name.split(" ")[0]}
                          </span>
                          <div className="flex gap-1">
                            {BEHAVIOR_RATINGS.map(({ score, emoji, label }) => (
                              <button
                                key={score}
                                title={label}
                                onClick={() =>
                                  setClassBehavior(prev => ({
                                    ...prev,
                                    [student.id]: prev[student.id] === score ? null : score,
                                  }))
                                }
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] transition-all"
                                style={{
                                  background: rating === score ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)",
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button variant="secondary" size="md" fullWidth onClick={handleEndClass}>
                  End Class →
                </Button>
              </div>
            </div>
          )}

          {/* DIARY: write note */}
          {classState === "diary" && (
            <div
              className="rounded-2xl p-6 flex flex-col gap-5 border"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-ink-4" />
                <p className="text-ink text-[16px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                  Class Complete
                </p>
              </div>
              <p className="text-ink-4 text-[12px] -mt-2">
                Send diary or parents think you skipped.
              </p>
              <div className="flex flex-col gap-1.5">
                <label className="text-ink-4 text-[11px] tracking-widest uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  Student
                </label>
                <select
                  value={diaryStudentId}
                  onChange={e => setDiaryStudentId(e.target.value)}
                  className="px-3 py-2 rounded-xl text-[13px] border outline-none"
                  style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)", color: "var(--color-ink)", fontFamily: "var(--font-dm-sans)" }}
                >
                  {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-ink-4 text-[11px] tracking-widest uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  Message
                </label>
                <textarea
                  rows={5}
                  value={diaryMessage}
                  onChange={e => setDiaryMessage(e.target.value)}
                  placeholder="e.g. Chidi was focused today — he completed the fractions exercise well..."
                  className="px-3 py-2.5 rounded-xl text-[13px] border outline-none resize-none"
                  style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)", color: "var(--color-ink)", fontFamily: "var(--font-dm-sans)" }}
                />
                {(classTopic || classHW) && (
                  <p className="text-ink-5 text-[11px]">
                    Pre-filled from your Topic / HW notes — edit freely.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="md"
                  loading={sending}
                  onClick={handleSendDiary}
                  fullWidth
                  style={{ background: "#10B981", borderColor: "#10B981" }}
                >
                  SEND DIARY – 10sec
                </Button>
                <Button variant="ghost" size="md" onClick={handleSkipDiary}>Skip</Button>
              </div>
            </div>
          )}

          {/* DONE: success flash */}
          {classState === "done" && (
            <div
              className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center border"
              style={{ background: "var(--color-success-subtle)", borderColor: "var(--color-success)" }}
            >
              <CheckCircle size={28} className="text-success" />
              <p className="text-ink text-[17px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>Diary note sent!</p>
              <p className="text-ink-4 text-[12px]">Parents will see it on their dashboard immediately.</p>
            </div>
          )}

          {/* Quick actions */}
          <div>
            <h2 className="text-ink text-[14px] font-bold mb-3" style={{ fontFamily: "var(--font-syne)" }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {QUICK_ACTIONS.map(({ emoji, label, sub, href, bg }) => (
                <Link key={href} href={href}>
                  <Card variant="surface" padding="md" hover className="flex flex-col gap-3 h-full">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]" style={{ background: bg }}>
                      {emoji}
                    </div>
                    <div>
                      <p className="text-ink text-[13px] font-bold leading-tight">{label}</p>
                      <p className="text-ink-4 text-[11px] mt-0.5">{sub}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Fix Pack saved flash */}
          {fpSaved && (
            <div
              className="rounded-xl border p-4 flex items-center gap-3"
              style={{ background: "#10B98112", borderColor: "#10B981" }}
            >
              <CheckCircle size={16} style={{ color: "#10B981", flexShrink: 0 }} />
              <div>
                <p className="text-ink text-[13px] font-semibold">Fix Pack sent to parent!</p>
                <p className="text-ink-4 text-[12px]">{riskFirstName}&apos;s parent will see the rescue plan on their dashboard.</p>
              </div>
            </div>
          )}

          {/* Fix Pack analytics card */}
          {lowestRiskScore && lowestRiskStud && lowestRiskSubj && classState === "idle" && (
            <div
              className="rounded-xl border p-5 flex flex-col gap-4"
              style={{ background: "#EF444412", borderColor: "#EF4444" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: "#EF4444" }} />
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "#EF4444", fontFamily: "var(--font-dm-mono)" }}
                  >
                    Student Risk
                  </span>
                </div>
                <Badge variant="danger" size="sm">Risk</Badge>
              </div>

              <div>
                <h3 className="text-ink text-[22px] font-extrabold leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
                  {riskFirstName} {lowestRiskScore.total}/100
                </h3>
                <p className="text-ink-4 text-[13px] mt-0.5">{lowestRiskSubj.name} · scored below pass mark</p>
              </div>

              <p className="text-ink-3 text-[13px] leading-relaxed">
                If {riskFirstName} fails WAEC, parents blame YOU at PTA.
              </p>

              {hasExistingFP ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} style={{ color: "#10B981" }} />
                  <span className="text-[13px] font-medium" style={{ color: "#10B981" }}>
                    Fix Pack active · parent has been notified
                  </span>
                </div>
              ) : (
                <button
                  onClick={openFixPackModal}
                  className="w-full py-3 rounded-xl text-white text-[13px] font-bold transition-opacity hover:opacity-90"
                  style={{ background: "#EF4444" }}
                >
                  SAVE {riskFirstName.toUpperCase()} – Create Fix Pack
                </button>
              )}
            </div>
          )}
        </div>

        {/* ─── Right column ────────────────────────────── */}
        <Card variant="surface" padding="md" className="self-start">
          <CardHeader title="Today at a Glance" subtitle={`JSS 3 Alpha · ${SCHOOL_NAME}`} />
          <div className="flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <span className="text-ink-3 text-[13px]">Students Present</span>
              <span
                className="text-[14px] font-semibold"
                style={{
                  color:       classState === "active" ? "var(--color-success)" : "var(--color-ink-4)",
                  fontFamily:  "var(--font-dm-mono)",
                }}
              >
                {classState === "active" || classState === "diary" || classState === "done"
                  ? `${presentCount} / ${STUDENTS.length}` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-ink-3 text-[13px]">Scores Pending</span>
              <span className="text-[14px] font-semibold" style={{ color: "var(--color-warning)", fontFamily: "var(--font-dm-mono)" }}>
                3 subjects
              </span>
            </div>
            {classState === "active" && (
              <div className="flex items-center justify-between py-3">
                <span className="text-ink-3 text-[13px]">Active tab</span>
                <span className="text-[13px] font-semibold text-ink" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {TAB_LABELS[activeTab]}
                </span>
              </div>
            )}
          </div>

          <p className="text-ink-5 text-[10px] uppercase tracking-widest mt-4 mb-2" style={{ fontFamily: "var(--font-dm-mono)" }}>
            Today&apos;s Classes
          </p>
          <div className="flex flex-col gap-1.5">
            {TODAY_TIMETABLE.map(slot => {
              const subj      = SUBJECTS.find(s => s.id === slot.subjectId);
              const isCurrent = slot.period === CURRENT_SLOT.period;
              return (
                <div
                  key={slot.period}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg"
                  style={{ background: isCurrent ? "var(--color-primary-badge)" : "transparent" }}
                >
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-primary-light)" }} />
                    )}
                    <span
                      className="text-[12px]"
                      style={{
                        color:       isCurrent ? "var(--color-primary-light)" : "var(--color-ink-3)",
                        fontFamily:  "var(--font-dm-sans)",
                        fontWeight:  isCurrent ? 600 : 400,
                      }}
                    >
                      P{slot.period} · {subj?.shortCode}
                    </span>
                  </div>
                  <span
                    className="text-[10px]"
                    style={{
                      color:      isCurrent ? "var(--color-primary-light)" : "var(--color-ink-5)",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {slot.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Streak */}
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
            <span className="text-[16px]">🔥</span>
            <div>
              <p className="text-ink text-[13px] font-bold">14-day streak</p>
              <p className="text-ink-4 text-[11px]">Don&apos;t break it.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Fix Pack Creation Modal ──────────────────── */}
      {showFPModal && lowestRiskStud && lowestRiskSubj && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowFPModal(false); }}
        >
          <div
            className="w-full max-w-[480px] rounded-2xl border flex flex-col gap-0 overflow-hidden"
            style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <p className="text-ink text-[16px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                  Create Fix Pack
                </p>
                <p className="text-ink-4 text-[12px] mt-0.5">
                  {lowestRiskStud.name} · {lowestRiskSubj.name} · {lowestRiskScore?.total}/100
                </p>
              </div>
              <button onClick={() => setShowFPModal(false)} className="p-1 rounded text-ink-4 hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-ink-4 text-[12px]">
                5 actions {riskFirstName}&apos;s parent will see and track. Edit them below.
              </p>
              <div className="flex flex-col gap-2">
                {fpItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {i + 1}
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const next = [...fpItems];
                        next[i] = e.target.value;
                        setFpItems(next);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg text-[13px] border outline-none"
                      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink)", fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]"
                style={{ background: "var(--color-surface)" }}
              >
                <span style={{ color: "#F59E0B" }}>₦5,000</span>
                <span className="text-ink-4">charged to parent · via Paystack</span>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button variant="ghost" size="md" onClick={() => setShowFPModal(false)} fullWidth>Cancel</Button>
              <button
                onClick={handleSaveFixPack}
                disabled={fpSaving}
                className="flex-1 py-3 rounded-xl text-white text-[13px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#EF4444" }}
              >
                {fpSaving ? "Sending…" : `SAVE ${riskFirstName.toUpperCase()} – Send to Parent`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
