"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { STUDENTS } from "@/lib/mock-data";
import { CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { BehaviorRating } from "@/lib/types";

const STORAGE_KEY = "smartschool_pulse_2026-05-01";

const DIMENSIONS = [
  { key: "punctuality",     label: "Punctuality",      icon: "⏰" },
  { key: "time_management", label: "Time Management",  icon: "🕐" },
  { key: "social_life",     label: "Social Life",      icon: "🤝" },
  { key: "cleanliness",     label: "Cleanliness",      icon: "✨" },
  { key: "effort",          label: "Urgency / Effort", icon: "🎯" },
] as const;

type DimensionKey = typeof DIMENSIONS[number]["key"];
type DimRatings = Record<DimensionKey, BehaviorRating | null>;
type PulseEntry = { ratings: DimRatings; note: string };
type PulseState = Record<string, PulseEntry>;

const EMPTY_RATINGS: DimRatings = {
  punctuality: null, time_management: null, social_life: null, cleanliness: null, effort: null,
};

const RATING_COLORS: Record<number, string> = {
  1: "var(--color-danger)",
  2: "#F97316",
  3: "var(--color-warning)",
  4: "var(--color-success)",
  5: "var(--color-primary)",
};

const RATING_LABELS = ["Needs Attention", "Below Average", "Average", "Good", "Excellent"];

function getInitial(): PulseState {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { return JSON.parse(saved); } catch {}
  }
  return Object.fromEntries(
    STUDENTS.map(s => [s.id, { ratings: { ...EMPTY_RATINGS }, note: "" }])
  );
}

function getAvg(ratings: DimRatings): number | null {
  const vals = Object.values(ratings).filter((r): r is BehaviorRating => r !== null);
  if (!vals.length) return null;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

export default function FridayPulsePage() {
  const [pulse, setPulse] = useState<PulseState>(getInitial);
  const [submitted, setSubmitted] = useState(false);

  function setDimRating(studentId: string, dim: DimensionKey, rating: BehaviorRating) {
    setPulse(prev => {
      const next = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          ratings: { ...prev[studentId].ratings, [dim]: rating },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setSubmitted(false);
  }

  function setNote(studentId: string, note: string) {
    setPulse(prev => {
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
  const fullyRated = entries.filter(e =>
    Object.values(e.ratings).every(r => r !== null)
  ).length;
  const total = STUDENTS.length;

  const dimAvgs = DIMENSIONS.map(({ key, label }) => {
    const vals = entries
      .map(e => e.ratings[key])
      .filter((r): r is BehaviorRating => r !== null);
    const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
    return { key, label, avg };
  });

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
          disabled={fullyRated === 0}
        >
          {submitted ? "✓ Submitted!" : `Submit Pulse (${fullyRated}/${total} complete)`}
        </Button>
      </div>

      {/* Class averages per dimension */}
      <div
        className="rounded-xl border border-border p-5 flex flex-col gap-4"
        style={{ background: "var(--color-surface)" }}
      >
        <p
          className="text-ink text-[15px] font-semibold"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Class Behaviour Averages
        </p>
        <div className="grid grid-cols-5 gap-3">
          {dimAvgs.map(({ key, label, avg }) => (
            <div key={key} className="flex flex-col items-center gap-2 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-bold"
                style={{
                  background: avg ? `${RATING_COLORS[Math.round(avg)]}22` : "var(--color-elevated)",
                  color: avg ? RATING_COLORS[Math.round(avg)] : "var(--color-ink-5)",
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                {avg ? avg.toFixed(1) : "—"}
              </div>
              <span
                className="text-ink-4 text-[10px] leading-tight"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Student cards */}
      <div className="flex flex-col gap-4">
        {STUDENTS.map(student => {
          const entry      = pulse[student.id];
          const overallAvg = getAvg(entry.ratings);

          return (
            <div
              key={student.id}
              className="rounded-xl border p-5 flex flex-col gap-4"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              {/* Student header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{
                    background: "var(--color-primary-badge)",
                    color: "var(--color-primary-light)",
                    fontFamily: "var(--font-dm-mono)",
                  }}
                >
                  {student.avatarInitials}
                </div>
                <div className="flex-1">
                  <p className="text-ink text-[14px] font-semibold">{student.name}</p>
                  <p className="text-ink-5 text-[11px]">{student.class}</p>
                </div>
                {overallAvg !== null && (
                  <div className="text-right">
                    <p
                      className="text-[20px] font-bold leading-none"
                      style={{
                        fontFamily: "var(--font-syne)",
                        color: RATING_COLORS[Math.round(overallAvg)],
                      }}
                    >
                      {overallAvg.toFixed(1)}
                    </p>
                    <p
                      className="text-ink-5 text-[9px] uppercase tracking-widest mt-0.5"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      avg
                    </p>
                  </div>
                )}
              </div>

              {/* 5 behavior dimension rows */}
              <div className="flex flex-col gap-3">
                {DIMENSIONS.map(({ key, label, icon }) => {
                  const dimRating = entry.ratings[key];
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        style={{ width: 168 }}
                      >
                        <span className="text-[13px]">{icon}</span>
                        <span
                          className="text-ink-3 text-[12px]"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {([1, 2, 3, 4, 5] as BehaviorRating[]).map(v => {
                          const filled = dimRating !== null && v <= dimRating;
                          return (
                            <button
                              key={v}
                              onClick={() => setDimRating(student.id, key, v)}
                              className="w-6 h-6 rounded-full border-2 transition-all duration-100 hover:scale-110 focus:outline-none"
                              style={{
                                background:  filled ? RATING_COLORS[dimRating!] : "transparent",
                                borderColor: filled ? RATING_COLORS[dimRating!] : "var(--color-border)",
                              }}
                              aria-label={`Rate ${label} as ${v}`}
                            />
                          );
                        })}
                      </div>

                      {dimRating !== null && (
                        <span
                          className="text-[11px] font-semibold"
                          style={{
                            color: RATING_COLORS[dimRating],
                            fontFamily: "var(--font-dm-mono)",
                          }}
                        >
                          {RATING_LABELS[dimRating - 1]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Note */}
              <textarea
                placeholder="Add a note… (optional)"
                value={entry?.note ?? ""}
                onChange={e => setNote(student.id, e.target.value)}
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
