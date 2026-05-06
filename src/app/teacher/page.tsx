"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { STUDENTS, SCORES, FEE_RECORDS, DIARIES } from "@/lib/mock-data";
import { seedStore, getScores, addDiary } from "@/lib/store";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { Score } from "@/lib/types";

type ClassState = "idle" | "active" | "diary" | "done";

const QUICK_ACTIONS = [
  { emoji: "📝", label: "Upload Marks",   sub: "Score entry",   href: "/teacher/scores",     bg: "var(--color-primary-badge)" },
  { emoji: "🏆", label: "Class Ranking",  sub: "Broadsheet",    href: "/teacher/broadsheet", bg: "#6366F118" },
  { emoji: "⭐", label: "Weekly Check-In", sub: "Behaviour",    href: "/teacher/pulse",      bg: "#F59E0B18" },
  { emoji: "📊", label: "Analytics",      sub: "Trendlines",    href: "/teacher/analytics",  bg: "#10B98118" },
];

const GLANCE_ROWS = [
  { label: "Students Present",     value: "—",         color: "var(--color-ink-4)" },
  { label: "Scores Pending",       value: "3 subjects", color: "var(--color-warning)" },
  { label: "Fees Collected Today", value: "₦156,000",  color: "var(--color-primary-light)" },
];

const TODAY = new Date().toISOString().split("T")[0];

function pad2(n: number) { return String(n).padStart(2, "0"); }
function nowTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${pad2(m)}${ampm}`;
}

export default function TeacherHomePage() {
  const [classState, setClassState] = useState<ClassState>("idle");
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(STUDENTS.map(s => [s.id, true]))
  );
  const [diaryStudentId, setDiaryStudentId] = useState(STUDENTS[0].id);
  const [diaryMessage,   setDiaryMessage]   = useState("");
  const [sending,        setSending]        = useState(false);
  const [scores,         setScores]         = useState<Score[]>([]);

  const presentCount = Object.values(attendance).filter(Boolean).length;

  const loadState = useCallback(() => {
    setScores(getScores());
  }, []);

  useEffect(() => {
    seedStore(FEE_RECORDS, SCORES, DIARIES);
    loadState();
  }, [loadState]);

  const atRiskCount = scores.filter(s => s.total !== null && s.total < 40).length;
  const totals      = scores.map(s => s.total).filter((t): t is number => t !== null);
  const classAvg    = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;

  function toggleAttendance(studentId: string) {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  }

  function handleStartClass() {
    setAttendance(Object.fromEntries(STUDENTS.map(s => [s.id, true])));
    setClassState("active");
  }

  function handleEndClass() {
    setClassState("diary");
    setDiaryMessage("");
  }

  async function handleSendDiary() {
    if (!diaryMessage.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));

    addDiary({
      id:          `d-${Date.now()}`,
      studentId:   diaryStudentId,
      teacherName: "Mr. Adeleke",
      subject:     "Class Diary",
      message:     diaryMessage.trim(),
      date:        TODAY,
      time:        nowTime(),
    });

    setSending(false);
    setClassState("done");
    setTimeout(() => setClassState("idle"), 2200);
  }

  function handleSkipDiary() {
    setClassState("idle");
  }

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-ink-4 text-[13px]">Good morning ☀️</p>
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
            Mr. Adeleke
          </h1>
          <p className="text-ink-4 text-[13px]">JSS 3 Alpha · {SCHOOL_NAME}</p>
        </div>
        <div className="flex items-center gap-3">
          {atRiskCount > 0 && <Badge variant="danger" dot>{atRiskCount} at risk</Badge>}
          <Badge variant="default" size="md">Term {CURRENT_TERM} · {CURRENT_SESSION}</Badge>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Left column */}
        <div className="flex flex-col gap-6">

          {/* ── IDLE: hero with Start Class ── */}
          {classState === "idle" && (
            <div
              className="rounded-2xl p-6 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}
            >
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Class average · This Term
                </p>
                <p className="text-white text-[42px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
                  {classAvg || "—"}
                  {classAvg > 0 && <span className="text-[18px] ml-1 opacity-60">/100</span>}
                </p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {atRiskCount > 0 ? `⚠ ${atRiskCount} student${atRiskCount > 1 ? "s" : ""} below pass mark` : "✓ All students above pass mark"}
                </p>
                <button
                  onClick={handleStartClass}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white w-fit transition-opacity hover:opacity-90"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                >
                  Start Today&apos;s Class →
                </button>
              </div>
              <CircularProgress value={classAvg || 0} size={100} strokeWidth={8} variant="primary" label={classAvg ? `${classAvg}` : "—"} />
            </div>
          )}

          {/* ── ACTIVE: attendance grid ── */}
          {classState === "active" && (
            <div
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "linear-gradient(135deg, #059669, #065F46)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-[18px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
                    Class in Session
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    JSS 3 Alpha · Mark attendance
                  </p>
                </div>
                <span className="text-white text-[28px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
                  {presentCount}/{STUDENTS.length}
                  <span className="text-[14px] ml-1 opacity-60">present</span>
                </span>
              </div>

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
                        style={{
                          background: present ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)",
                          color:      "white",
                          fontFamily: "var(--font-dm-mono)",
                        }}
                      >
                        {student.avatarInitials}
                      </div>
                      <span className="text-white text-[12px] font-medium flex-1 text-left">
                        {student.name.split(" ")[0]}
                      </span>
                      {present
                        ? <CheckCircle size={14} color="rgba(255,255,255,0.8)" />
                        : <XCircle    size={14} color="rgba(255,255,255,0.35)" />
                      }
                    </button>
                  );
                })}
              </div>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleEndClass}
              >
                End Class →
              </Button>
            </div>
          )}

          {/* ── DIARY: write note to parent ── */}
          {classState === "diary" && (
            <div
              className="rounded-2xl p-6 flex flex-col gap-5 border"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-ink-4" />
                <p className="text-ink text-[16px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                  Send a note to parents
                </p>
              </div>
              <p className="text-ink-4 text-[12px] -mt-2">
                Optional — let a parent know how their child did today.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-ink-4 text-[11px] tracking-widest uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  Student
                </label>
                <select
                  value={diaryStudentId}
                  onChange={e => setDiaryStudentId(e.target.value)}
                  className="px-3 py-2 rounded-xl text-[13px] border outline-none"
                  style={{
                    background:  "var(--color-elevated)",
                    borderColor: "var(--color-border)",
                    color:       "var(--color-ink)",
                    fontFamily:  "var(--font-dm-sans)",
                  }}
                >
                  {STUDENTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-ink-4 text-[11px] tracking-widest uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  value={diaryMessage}
                  onChange={e => setDiaryMessage(e.target.value)}
                  placeholder="e.g. Chidi was focused today — he completed the fractions exercise well..."
                  className="px-3 py-2.5 rounded-xl text-[13px] border outline-none resize-none"
                  style={{
                    background:  "var(--color-elevated)",
                    borderColor: "var(--color-border)",
                    color:       "var(--color-ink)",
                    fontFamily:  "var(--font-dm-sans)",
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="primary" size="md" loading={sending} onClick={handleSendDiary} fullWidth>
                  Send to Parent →
                </Button>
                <Button variant="ghost" size="md" onClick={handleSkipDiary}>
                  Skip
                </Button>
              </div>
            </div>
          )}

          {/* ── DONE: success flash ── */}
          {classState === "done" && (
            <div
              className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center border"
              style={{ background: "var(--color-success-subtle)", borderColor: "var(--color-success)" }}
            >
              <CheckCircle size={28} className="text-success" />
              <p className="text-ink text-[17px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Diary note sent!
              </p>
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
        </div>

        {/* Right column */}
        <Card variant="surface" padding="md" className="self-start">
          <CardHeader title="Today at a Glance" subtitle={`JSS 3 Alpha · ${SCHOOL_NAME}`} />
          <div className="flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <span className="text-ink-3 text-[13px]">Students Present</span>
              <span
                className="text-[14px] font-semibold"
                style={{
                  color:      classState === "active" ? "var(--color-success)" : "var(--color-ink-4)",
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                {classState === "active" || classState === "diary" || classState === "done"
                  ? `${presentCount} / ${STUDENTS.length}`
                  : "—"
                }
              </span>
            </div>
            {GLANCE_ROWS.slice(1).map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-ink-3 text-[13px]">{label}</span>
                <span className="text-[14px] font-semibold" style={{ color, fontFamily: "var(--font-dm-mono)" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
