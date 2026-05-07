"use client";

import { useState } from "react";
import { CheckCircle, Lock } from "lucide-react";
import { STUDENTS, SCORES, FEE_RECORDS, SUBJECTS, TEACHER_PROFILE } from "@/lib/mock-data";
import { getGrade, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const MY_SUBJECTS = SUBJECTS.filter(s => TEACHER_PROFILE.mySubjectIds.includes(s.id));

const GRID = "1fr 64px 64px 80px 72px 64px 108px";

export default function ResultsPage() {
  const [subjectId, setSubjectId] = useState(MY_SUBJECTS[0]?.id ?? SUBJECTS[0].id);
  const subject = MY_SUBJECTS.find(s => s.id === subjectId) ?? MY_SUBJECTS[0];

  const studentData = STUDENTS.map(student => {
    const score      = SCORES.find(s => s.studentId === student.id && s.subjectId === subjectId);
    const fee        = FEE_RECORDS.find(f => f.studentId === student.id)!;
    const isReleased = fee.status === "paid";
    return { student, score, isReleased, grade: getGrade(score?.total ?? null) };
  });

  const totalAvailable = studentData.filter(d =>  d.isReleased).length;
  const totalLocked    = studentData.filter(d => !d.isReleased).length;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Result Gate
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            JSS 3 Alpha · Term {CURRENT_TERM} {CURRENT_SESSION}
          </p>
        </div>
        {totalLocked > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-warning text-[12px] font-semibold"
            style={{ background: "#F59E0B20", fontFamily: "var(--font-dm-mono)" }}
          >
            <Lock size={13} />
            {totalLocked} RESULTS LOCKED
          </div>
        )}
      </div>

      {/* Subject selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-ink-5 text-[11px]"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Subject:
        </span>
        {MY_SUBJECTS.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSubjectId(sub.id)}
            className="px-3 py-1 rounded-lg text-[11px] border transition-colors"
            style={{
              background:  sub.id === subjectId ? "var(--color-primary-subtle)" : "transparent",
              borderColor: sub.id === subjectId ? "var(--color-primary)" : "var(--color-border)",
              color:       sub.id === subjectId ? "var(--color-primary-light)" : "var(--color-ink-4)",
              fontFamily:  "var(--font-dm-mono)",
            }}
          >
            {sub.shortCode}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Students",    value: STUDENTS.length, icon: null,                             color: "var(--color-secondary)" },
          { label: "Results Available", value: totalAvailable,  icon: <CheckCircle size={16} />,        color: "var(--color-success)"   },
          { label: "Awaiting Payment",  value: totalLocked,     icon: <Lock size={16} />,               color: "var(--color-warning)"   },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border p-4 flex flex-col gap-3"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-widest text-ink-4 uppercase"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {label}
              </span>
              {icon && <span style={{ color }}>{icon}</span>}
            </div>
            <p
              className="text-ink text-[22px] font-bold leading-none"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Score spreadsheet */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Subject label */}
        <div
          className="px-5 py-2.5 border-b border-border flex items-center gap-2"
          style={{ background: "var(--color-sidebar)" }}
        >
          <span
            className="text-ink-3 text-[12px] font-semibold"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {subject?.name}
          </span>
          <span
            className="text-ink-5 text-[11px]"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            · CA1 /20 · CA2 /20 · Exam /60 · Total /100
          </span>
        </div>

        {/* Column headers */}
        <div
          className="grid px-5 py-2.5 border-b border-border"
          style={{ gridTemplateColumns: GRID, background: "var(--color-sidebar)" }}
        >
          {["STUDENT", "CA1", "CA2", "EXAM", "TOTAL", "GRADE", "STATUS"].map(col => (
            <span
              key={col}
              className="text-[10px] tracking-widest text-ink-4 uppercase text-center first:text-left"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-border">
          {studentData.map(({ student, score, isReleased, grade }) => {
            const isLow = score?.total !== null && (score?.total ?? 101) < 40;
            return (
              <div
                key={student.id}
                className="grid items-center px-5"
                style={{
                  gridTemplateColumns: GRID,
                  minHeight:  50,
                  borderLeft: isLow ? "3px solid var(--color-danger)" : "3px solid transparent",
                  background: isLow ? "var(--color-danger-muted)" : "transparent",
                }}
              >
                {/* Student */}
                <div className="flex items-center gap-3 py-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: "var(--color-primary-badge)",
                      color:      "var(--color-primary-light)",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {student.avatarInitials}
                  </div>
                  <span className="text-ink text-[13px] font-semibold">{student.name}</span>
                </div>

                {/* CA1 */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "var(--color-ink-3)" }}
                  >
                    {score?.ca1 ?? "—"}
                  </span>
                </div>

                {/* CA2 */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "var(--color-ink-3)" }}
                  >
                    {score?.ca2 ?? "—"}
                  </span>
                </div>

                {/* Exam */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "var(--color-ink-3)" }}
                  >
                    {score?.exam ?? "—"}
                  </span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <span
                    className="text-[14px] font-bold"
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      color: isLow ? "var(--color-danger)" : "var(--color-ink)",
                    }}
                  >
                    {score?.total ?? "—"}
                  </span>
                </div>

                {/* Grade */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  <span
                    className="text-[13px] font-bold"
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      color: isLow ? "var(--color-danger)" : "var(--color-primary)",
                    }}
                  >
                    {grade}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center border-l border-border h-full">
                  {isReleased ? (
                    <div
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{
                        background: "var(--color-success-subtle)",
                        color:      "var(--color-success)",
                        fontFamily: "var(--font-dm-mono)",
                      }}
                    >
                      <CheckCircle size={10} /> Available
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{
                        background: "#F59E0B20",
                        color:      "var(--color-warning)",
                        fontFamily: "var(--font-dm-mono)",
                      }}
                    >
                      <Lock size={10} /> Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalLocked > 0 && (
        <p
          className="text-ink-5 text-[12px] text-center"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Results are released automatically once payment is confirmed by admin.
        </p>
      )}
    </div>
  );
}
