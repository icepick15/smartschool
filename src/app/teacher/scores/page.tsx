"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, WifiOff, AlertTriangle } from "lucide-react";
import { ScoreCell } from "@/components/ui/ScoreCell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { STUDENTS, SCORES, SUBJECTS, FEE_RECORDS, DIARIES, TEACHER_PROFILE } from "@/lib/mock-data";
import { seedStore, getScores, upsertScore } from "@/lib/store";
import { getGrade } from "@/lib/constants";
import type { Score } from "@/lib/types";

type ScoreMap = Record<string, { ca1: number | null; ca2: number | null; exam: number | null }>;

function computeTotal(ca1: number | null, ca2: number | null, exam: number | null) {
  if (ca1 === null || ca2 === null || exam === null) return null;
  return ca1 + ca2 + exam;
}

function computePositions(map: ScoreMap): Record<string, number> {
  const ranked = Object.entries(map)
    .map(([id, s]) => ({ id, total: computeTotal(s.ca1, s.ca2, s.exam) }))
    .filter(r => r.total !== null)
    .sort((a, b) => (b.total as number) - (a.total as number));
  return Object.fromEntries(ranked.map((r, i) => [r.id, i + 1]));
}

const COLS = [
  { key: "STUDENT", width: "1fr"  },
  { key: "CA1",     width: "80px" },
  { key: "CA2",     width: "80px" },
  { key: "EXAM",    width: "90px" },
  { key: "TOTAL",   width: "80px" },
  { key: "POS",     width: "60px" },
];
const GRID = `1fr 80px 80px 90px 80px 60px`;

function initFromMock(subjectId: string): ScoreMap {
  const initial: ScoreMap = {};
  STUDENTS.forEach(st => {
    const s = SCORES.find(r => r.studentId === st.id && r.subjectId === subjectId);
    initial[st.id] = { ca1: s?.ca1 ?? null, ca2: s?.ca2 ?? null, exam: s?.exam ?? null };
  });
  return initial;
}

const MY_SUBJECTS = SUBJECTS.filter(s => TEACHER_PROFILE.mySubjectIds.includes(s.id));

function ScoreGridInner() {
  const searchParams   = useSearchParams();
  const rawSubjectId   = searchParams.get("subject") ?? MY_SUBJECTS[0].id;
  // Enforce teacher can only view their assigned subjects
  const subjectId      = MY_SUBJECTS.some(s => s.id === rawSubjectId) ? rawSubjectId : MY_SUBJECTS[0].id;
  const subject        = MY_SUBJECTS.find(s => s.id === subjectId) ?? MY_SUBJECTS[0];

  const [scores,     setScores]     = useState<ScoreMap>(() => initFromMock(subjectId));
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isOffline,  setIsOffline]  = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  /* Seed the shared store once and load scores from it */
  useEffect(() => {
    seedStore(FEE_RECORDS, SCORES, DIARIES);
    const stored = getScores().filter(s => s.subjectId === subjectId);
    if (stored.length > 0) {
      const map: ScoreMap = {};
      STUDENTS.forEach(st => {
        const s = stored.find(r => r.studentId === st.id);
        map[st.id] = { ca1: s?.ca1 ?? null, ca2: s?.ca2 ?? null, exam: s?.exam ?? null };
      });
      setScores(map);
    }
  }, [subjectId]);

  const triggerSave = useCallback(() => {
    setSaveStatus("saving");
    const t = setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1800);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  function handleCellEdit(studentId: string, field: "ca1" | "ca2" | "exam", raw: string) {
    const max = field === "exam" ? 60 : 20;
    const val = raw === "" ? null : Math.min(Math.max(0, Number(raw)), max);

    setScores(prev => {
      const entry   = { ...prev[studentId], [field]: val };
      const next    = { ...prev, [studentId]: entry };
      const total   = computeTotal(entry.ca1, entry.ca2, entry.exam);

      /* Write to the shared store so the parent dashboard reacts */
      upsertScore({
        studentId,
        subjectId,
        ca1:   entry.ca1,
        ca2:   entry.ca2,
        exam:  entry.exam,
        total,
        grade: getGrade(total),
      } as Score);

      return next;
    });
    triggerSave();
  }

  const positions  = computePositions(scores);
  const noScoresYet = STUDENTS.every(st => {
    const s = scores[st.id];
    return s?.ca1 === null && s?.ca2 === null && s?.exam === null;
  });
  const atRiskIds  = STUDENTS
    .filter(st => {
      const s = scores[st.id];
      const t = computeTotal(s?.ca1, s?.ca2, s?.exam);
      return t !== null && t < 40;
    })
    .map(st => st.id);

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* ── Page header ───────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher/broadsheet" className="text-ink-3 hover:text-ink transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-ink text-[26px] font-extrabold leading-none"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {subject.name}
              </h1>
              {atRiskIds.length > 0 && (
                <Badge variant="danger" dot>
                  {atRiskIds.length} at risk
                </Badge>
              )}
            </div>
            <p className="text-ink-4 text-[13px] mt-1">
              Decide Tolu&apos;s Week · JSS 3 Alpha
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-[11px] transition-opacity duration-300"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color:   saveStatus === "saving" ? "var(--color-warning)" : "var(--color-success)",
              opacity: saveStatus === "idle" ? 0 : 1,
            }}
          >
            {saveStatus === "saving" ? "Saving…" : "✓ Auto-saved"}
          </span>
          <button
            className="px-5 py-2.5 rounded-xl text-white text-[13px] font-bold"
            style={{
              background: "var(--color-success)",
              fontFamily: "var(--font-dm-sans)",
              boxShadow:  "0 0 16px #10B98130",
            }}
          >
            🎓 Generate Report Cards
          </button>
        </div>
      </div>

      {/* ── Offline banner ────────────────────────────── */}
      {isOffline && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-warning text-[13px]"
          style={{ background: "#F59E0B18" }}
        >
          <WifiOff size={15} />
          Offline – All changes saving locally
        </div>
      )}

      {/* ── At-risk callout ───────────────────────────── */}
      {atRiskIds.length > 0 && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl border text-[13px]"
          style={{ background: "var(--color-danger-muted)", borderColor: "var(--color-danger)" }}
        >
          <AlertTriangle size={15} className="text-danger shrink-0 mt-0.5" />
          <div>
            <span className="text-ink font-semibold">
              {atRiskIds.length} student{atRiskIds.length > 1 ? "s" : ""} below pass mark —
            </span>
            <span className="text-ink-3 ml-1">
              {STUDENTS.filter(s => atRiskIds.includes(s.id)).map(s => s.name.split(" ")[0]).join(", ")}.
              Parent alert sent automatically.
            </span>
          </div>
        </div>
      )}

      {/* ── Empty-state nudge ────────────────────────── */}
      {noScoresYet && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px]"
          style={{ background: "var(--color-primary-badge)", borderLeft: "3px solid var(--color-primary)" }}
        >
          <span className="text-[16px]">⏳</span>
          <div>
            <p className="text-ink font-semibold">Tolu&apos;s first score appears here.</p>
            <p className="text-ink-4 text-[12px]">32 parents waiting. Tap any cell to start.</p>
          </div>
        </div>
      )}

      {/* ── Score table ───────────────────────────────── */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Column headers */}
        <div
          className="grid border-b border-border px-4 py-3"
          style={{ gridTemplateColumns: GRID, background: "var(--color-sidebar)" }}
        >
          {COLS.map(({ key }) => (
            <span
              key={key}
              className="text-[10px] tracking-widest text-ink-4 uppercase text-center first:text-left"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {key}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-border">
          {STUDENTS.map(student => {
            const s      = scores[student.id] ?? { ca1: null, ca2: null, exam: null };
            const total  = computeTotal(s.ca1, s.ca2, s.exam);
            const pos    = positions[student.id];
            const isRisk = total !== null && total < 40;

            return (
              <div
                key={student.id}
                className="grid items-center px-4 transition-colors"
                style={{
                  gridTemplateColumns: GRID,
                  minHeight:   52,
                  borderLeft:  isRisk ? "3px solid var(--color-danger)" : "3px solid transparent",
                  background:  isRisk ? "var(--color-danger-muted)" : "transparent",
                }}
              >
                {/* Student */}
                <div className="flex items-center gap-3 py-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{
                      background: isRisk ? "#EF444420" : "var(--color-primary-badge)",
                      color:      isRisk ? "var(--color-danger)" : "var(--color-primary-light)",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {student.avatarInitials}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-ink text-[13px] font-semibold">{student.name}</span>
                    {isRisk && (
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--color-danger)", fontFamily: "var(--font-dm-mono)" }}
                      >
                        ⚠ at risk
                      </span>
                    )}
                  </div>
                </div>

                {/* CA1 */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <ScoreCell value={s.ca1} type="ca" editable
                    onEdit={v => handleCellEdit(student.id, "ca1", v)} />
                </div>

                {/* CA2 */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <ScoreCell value={s.ca2} type="ca" editable
                    onEdit={v => handleCellEdit(student.id, "ca2", v)} />
                </div>

                {/* Exam */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <ScoreCell value={s.exam} type="exam" editable
                    onEdit={v => handleCellEdit(student.id, "exam", v)} />
                </div>

                {/* Total */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <ScoreCell value={total} type="total" />
                </div>

                {/* Position */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <span
                    className="text-ink-4 text-[12px]"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {pos ? `#${pos}` : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Subject switcher (assigned subjects only) ────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
          My subjects:
        </span>
        {MY_SUBJECTS.map(sub => (
          <Link
            key={sub.id}
            href={`/teacher/scores?subject=${sub.id}`}
            className="px-3 py-1 rounded-lg text-[11px] border transition-colors"
            style={{
              background:   sub.id === subjectId ? "var(--color-primary-subtle)" : "transparent",
              borderColor:  sub.id === subjectId ? "var(--color-primary)" : "var(--color-border)",
              color:        sub.id === subjectId ? "var(--color-primary-light)" : "var(--color-ink-4)",
              fontFamily:   "var(--font-dm-mono)",
            }}
          >
            {sub.shortCode}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ScoreGridPage() {
  return (
    <Suspense>
      <ScoreGridInner />
    </Suspense>
  );
}
