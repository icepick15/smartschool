"use client";

import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, WifiOff } from "lucide-react";
import { ScoreCell } from "@/components/ui/ScoreCell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { STUDENTS, SCORES, SUBJECTS } from "@/lib/mock-data";
import type { Score } from "@/lib/types";

type ScoreMap = Record<string, { ca1: number | null; ca2: number | null; exam: number | null }>;

function computeTotal(ca1: number | null, ca2: number | null, exam: number | null) {
  if (ca1 === null || ca2 === null || exam === null) return null;
  return ca1 + ca2 + exam;
}

function computePositions(map: ScoreMap): Record<string, number> {
  const ranked = Object.entries(map)
    .map(([id, s]) => ({ id, total: computeTotal(s.ca1, s.ca2, s.exam) }))
    .filter((r) => r.total !== null)
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

function ScoreGridInner() {
  const searchParams = useSearchParams();
  const subjectId    = searchParams.get("subject") ?? "sub1";
  const subject      = SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0];

  const [scores, setScores] = useState<ScoreMap>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`smartschool_scores_${subjectId}`);
      if (saved) {
        try { return JSON.parse(saved) as ScoreMap; } catch {}
      }
    }
    const initial: ScoreMap = {};
    STUDENTS.forEach((st) => {
      const s: Score | undefined = SCORES.find(
        (r) => r.studentId === st.id && r.subjectId === subjectId
      );
      initial[st.id] = { ca1: s?.ca1 ?? null, ca2: s?.ca2 ?? null, exam: s?.exam ?? null };
    });
    return initial;
  });

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isOffline] = useState(false);

  const triggerSave = useCallback(() => {
    setSaveStatus("saving");
    const t = setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1800);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  function handleCellEdit(studentId: string, field: "ca1" | "ca2" | "exam", raw: string) {
    const val = raw === "" ? null : Math.min(Number(raw), field === "exam" ? 60 : 20);
    setScores((prev) => {
      const next = { ...prev, [studentId]: { ...prev[studentId], [field]: val } };
      localStorage.setItem(`smartschool_scores_${subjectId}`, JSON.stringify(next));
      return next;
    });
    triggerSave();
  }

  const positions = computePositions(scores);

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher/broadsheet" className="text-ink-3 hover:text-ink transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1
              className="text-ink text-[26px] font-extrabold leading-none"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {subject.name}
            </h1>
            <p className="text-ink-4 text-[13px] mt-1">
              CA1 · JSS 3 Alpha · {STUDENTS.length} students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] transition-opacity duration-300"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: saveStatus === "saving" ? "#F59E0B" : "#10B981",
              opacity: saveStatus === "idle" ? 0 : 1,
            }}
          >
            {saveStatus === "saving" ? "Saving…" : "✓ Auto-saved"}
          </span>
          <button
            className="px-5 py-2.5 rounded-xl text-white text-[13px] font-bold"
            style={{
              background: "#10B981",
              fontFamily: "var(--font-dm-sans)",
              boxShadow: "0 0 16px #10B98130",
            }}
          >
            🎓 Generate Report Cards
          </button>
        </div>
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-warning text-[13px]"
          style={{ background: "#F59E0B18" }}
        >
          <WifiOff size={15} />
          Offline – All changes saving locally
        </div>
      )}

      {/* Score table */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: "#111118" }}
      >
        {/* Column headers */}
        <div
          className="grid border-b border-border px-4 py-3"
          style={{ gridTemplateColumns: GRID, background: "#0D0D14" }}
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
          {STUDENTS.map((student) => {
            const s     = scores[student.id];
            const total = computeTotal(s.ca1, s.ca2, s.exam);
            const pos   = positions[student.id];

            return (
              <div
                key={student.id}
                className="grid items-center px-4"
                style={{ gridTemplateColumns: GRID, minHeight: 52 }}
              >
                {/* Student */}
                <div className="flex items-center gap-3 py-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ background: "#7C3AED22", color: "#A78BFA", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {student.avatarInitials}
                  </div>
                  <span className="text-ink text-[13px] font-semibold">{student.name}</span>
                </div>

                {/* CA1 */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <ScoreCell value={s.ca1} type="ca" editable
                    onEdit={(v) => handleCellEdit(student.id, "ca1", v)} />
                </div>

                {/* CA2 */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <ScoreCell value={s.ca2} type="ca" editable
                    onEdit={(v) => handleCellEdit(student.id, "ca2", v)} />
                </div>

                {/* Exam */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <ScoreCell value={s.exam} type="exam" editable
                    onEdit={(v) => handleCellEdit(student.id, "exam", v)} />
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
