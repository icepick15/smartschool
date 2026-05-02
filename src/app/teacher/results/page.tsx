"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STUDENTS, SCORES, FEE_RECORDS } from "@/lib/mock-data";
import { getGrade, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const STORAGE_KEY = "smartschool_results_released";

export default function ResultsPage() {
  const [released, setReleased] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { setReleased(new Set(JSON.parse(saved))); } catch {}
  }, []);

  function releaseResult(studentId: string) {
    setReleased((prev) => {
      const next = new Set(prev).add(studentId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  const studentData = STUDENTS.map((student) => {
    const scores  = SCORES.filter((s) => s.studentId === student.id && s.total !== null);
    const avg     = scores.length
      ? Math.round(scores.reduce((s, r) => s + (r.total ?? 0), 0) / scores.length)
      : null;
    const fee     = FEE_RECORDS.find((f) => f.studentId === student.id)!;
    const locked  = fee.status === "owing" || fee.status === "partial";
    const isReleased = released.has(student.id);

    return { student, avg, fee, locked, isReleased, grade: getGrade(avg) };
  });

  const totalReady    = studentData.filter((d) => !d.locked).length;
  const totalLocked   = studentData.filter((d) => d.locked).length;
  const totalReleased = studentData.filter((d) => d.isReleased).length;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: STUDENTS.length,  icon: null,                             color: "#6366F1" },
          { label: "Fee Cleared",    value: totalReady,        icon: <CheckCircle size={16} />,        color: "#10B981" },
          { label: "Fee Locked",     value: totalLocked,       icon: <Lock size={16} />,               color: "#EF4444" },
          { label: "Released",       value: totalReleased,     icon: <Unlock size={16} />,             color: "#7C3AED" },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border p-4 flex flex-col gap-3"
            style={{ background: "#111118" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest text-ink-4 uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {label}
              </span>
              {icon && <span style={{ color }}>{icon}</span>}
            </div>
            <p className="text-ink text-[22px] font-bold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Student list */}
      <div className="flex flex-col gap-3">
        {studentData.map(({ student, avg, fee, locked, isReleased, grade }) => (
          <div
            key={student.id}
            className="rounded-xl border p-5 flex flex-col gap-4"
            style={{
              background: "#111118",
              borderColor: locked ? "#F59E0B33" : isReleased ? "#10B98133" : "var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{ background: "#7C3AED22", color: "#A78BFA", fontFamily: "var(--font-dm-mono)" }}
                >
                  {student.avatarInitials}
                </div>
                <div>
                  <p className="text-ink text-[14px] font-semibold">{student.name}</p>
                  <p className="text-ink-5 text-[12px]">{student.class}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Score */}
                <div className="text-right">
                  <p className="text-ink text-[20px] font-bold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
                    {avg ?? "—"}
                  </p>
                  <p className="text-ink-5 text-[10px] mt-0.5" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    avg · Grade {grade}
                  </p>
                </div>

                {/* Status / Action */}
                {locked ? (
                  <div
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: "#F59E0B20", color: "#F59E0B", fontFamily: "var(--font-dm-mono)" }}
                  >
                    <Lock size={11} /> Fee Locked
                  </div>
                ) : isReleased ? (
                  <div
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: "#10B98120", color: "#10B981", fontFamily: "var(--font-dm-mono)" }}
                  >
                    <CheckCircle size={11} /> Released
                  </div>
                ) : (
                  <Button variant="primary" size="sm" icon={<Unlock size={13} />} onClick={() => releaseResult(student.id)}>
                    Release Result
                  </Button>
                )}
              </div>
            </div>

            {/* Fee progress */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                <span className="text-ink-5">
                  Fees: <span className="text-success">₦{fee.paid.toLocaleString()}</span> paid
                </span>
                <span className="text-ink-5">
                  {fee.balance > 0 ? <span className="text-danger">₦{fee.balance.toLocaleString()} outstanding</span> : "Cleared"}
                </span>
              </div>
              <ProgressBar
                value={fee.paid}
                max={fee.amount}
                variant={fee.status === "paid" ? "success" : fee.status === "partial" ? "warning" : "danger"}
                size="xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
