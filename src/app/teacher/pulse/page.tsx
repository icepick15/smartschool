"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { STUDENTS } from "@/lib/mock-data";
import { CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { BehaviorRating } from "@/lib/types";

const STORAGE_KEY = "smartschool_pulse_2026-05-01";

const RATINGS: { value: BehaviorRating; label: string; color: string; bg: string }[] = [
  { value: 1, label: "Needs Attention", color: "var(--color-danger)", bg: "#EF444412" },
  { value: 2, label: "Below Average",   color: "#F97316", bg: "#F9731612" },
  { value: 3, label: "Average",         color: "var(--color-warning)", bg: "#F59E0B12" },
  { value: 4, label: "Good",            color: "var(--color-success)", bg: "#10B98112" },
  { value: 5, label: "Excellent",       color: "var(--color-primary)", bg: "#7C3AED12" },
];

type PulseEntry = { rating: BehaviorRating | null; note: string };
type PulseState = Record<string, PulseEntry>;

function getInitial(): PulseState {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { return JSON.parse(saved); } catch {}
  }
  return Object.fromEntries(STUDENTS.map((s) => [s.id, { rating: null, note: "" }]));
}

export default function FridayPulsePage() {
  const [pulse, setPulse] = useState<PulseState>(getInitial);
  const [submitted, setSubmitted] = useState(false);

  function setRating(studentId: string, rating: BehaviorRating) {
    setPulse((prev) => {
      const next = { ...prev, [studentId]: { ...prev[studentId], rating } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setSubmitted(false);
  }

  function setNote(studentId: string, note: string) {
    setPulse((prev) => {
      const next = { ...prev, [studentId]: { ...prev[studentId], note } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function handleSubmit() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pulse));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  const entries = Object.values(pulse);
  const rated   = entries.filter((e) => e.rating !== null).length;
  const total   = STUDENTS.length;
  const avgRating = rated > 0
    ? entries.reduce((s, e) => s + (e.rating ?? 0), 0) / rated
    : 0;
  const dist = RATINGS.map(({ value, color }) => ({
    value,
    color,
    count: entries.filter((e) => e.rating === value).length,
  }));

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Friday Pulse
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            Week 18 · May 2026 · Term {CURRENT_TERM} {CURRENT_SESSION}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Send size={14} />}
          onClick={handleSubmit}
          disabled={rated === 0}
        >
          {submitted ? "✓ Submitted!" : `Submit Pulse (${rated}/${total})`}
        </Button>
      </div>

      {/* Class Mood Summary */}
      <div
        className="rounded-xl border border-border p-5 flex flex-col gap-4"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-ink text-[15px] font-semibold"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Class Mood
            </p>
            <p
              className="text-ink-5 text-[12px] mt-0.5"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {rated} of {total} students rated
            </p>
          </div>
          {avgRating > 0 && (
            <div className="text-right">
              <p
                className="text-[32px] font-bold leading-none"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: RATINGS[Math.round(avgRating) - 1]?.color ?? "var(--color-primary)",
                }}
              >
                {avgRating.toFixed(1)}
              </p>
              <p
                className="text-ink-5 text-[10px] uppercase tracking-widest mt-0.5"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                class avg
              </p>
            </div>
          )}
        </div>

        {/* Distribution bar */}
        <div className="flex gap-1 h-2.5 rounded-full overflow-hidden" style={{ background: "var(--color-elevated)" }}>
          {rated > 0 && dist.map(({ value, color, count }) =>
            count > 0 ? (
              <div
                key={value}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                style={{ flex: count, background: color }}
              />
            ) : null
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 flex-wrap">
          {dist.map(({ value, color, count }) => (
            <div key={value} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span
                className="text-ink-5 text-[11px]"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {RATINGS[value - 1].label}: {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Student cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STUDENTS.map((student) => {
          const entry   = pulse[student.id];
          const rating  = entry?.rating ?? null;
          const cfg     = rating !== null ? RATINGS[rating - 1] : null;

          return (
            <div
              key={student.id}
              className="rounded-xl border flex flex-col gap-4 p-5 transition-all duration-200"
              style={{
                background: cfg ? cfg.bg : "var(--color-surface)",
                borderColor: cfg ? `${cfg.color}33` : "var(--color-border)",
                borderLeftColor: cfg ? cfg.color : "transparent",
                borderLeftWidth: 3,
              }}
            >
              {/* Student row */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{ background: "var(--color-primary-badge)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
                >
                  {student.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ink text-[14px] font-semibold truncate">{student.name}</p>
                  <p className="text-ink-5 text-[11px]">{student.class}</p>
                </div>
                {cfg && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: cfg.bg, color: cfg.color, fontFamily: "var(--font-dm-mono)", border: `1px solid ${cfg.color}40` }}
                  >
                    {cfg.label}
                  </span>
                )}
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-2">
                {RATINGS.map(({ value, color }) => {
                  const filled = rating !== null && value <= rating;
                  return (
                    <button
                      key={value}
                      onClick={() => setRating(student.id, value)}
                      className="transition-transform duration-100 hover:scale-125 focus:outline-none"
                      aria-label={`Rate ${RATINGS[value - 1].label}`}
                    >
                      <Star
                        size={26}
                        color={filled ? color : "#2E2E3E"}
                        fill={filled ? color : "none"}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Note input */}
              <textarea
                placeholder="Add a note… (optional)"
                value={entry?.note ?? ""}
                onChange={(e) => setNote(student.id, e.target.value)}
                rows={2}
                className="w-full text-[12px] text-ink-3 bg-transparent resize-none outline-none border border-border rounded-lg px-3 py-2 placeholder:text-ink-5 focus:border-primary transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
