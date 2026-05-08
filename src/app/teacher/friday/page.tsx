"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, CheckCircle } from "lucide-react";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const WEEK_START   = "2026-05-04";
const STORAGE_KEY  = `ss_weekly_report_${WEEK_START}`;

type SliderKey = "punctuality" | "participation" | "conduct" | "effort" | "homework";

const SLIDERS: { key: SliderKey; label: string; icon: string }[] = [
  { key: "punctuality",   label: "Punctuality",   icon: "⏰" },
  { key: "participation", label: "Participation",  icon: "🙋" },
  { key: "conduct",       label: "Conduct",        icon: "🤝" },
  { key: "effort",        label: "Effort",         icon: "💪" },
  { key: "homework",      label: "Homework",       icon: "📚" },
];

const RATING_LABELS: Record<number, string> = {
  1: "Poor", 2: "Below average", 3: "Average", 4: "Good", 5: "Excellent",
};

function ratingColor(v: number): string {
  if (v <= 2) return "#EF4444";
  if (v === 3) return "#F59E0B";
  return "#10B981";
}

type ReportState = Record<SliderKey, number> & { note: string; submitted: boolean };

const DEFAULT: ReportState = {
  punctuality: 3, participation: 3, conduct: 3, effort: 3, homework: 3,
  note: "", submitted: false,
};

function loadSaved(): ReportState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT;
}

export default function WeeklyReportPage() {
  const [state,      setState]      = useState<ReportState>(loadSaved);
  const [recording,  setRecording]  = useState(false);
  const [recSecs,    setRecSecs]    = useState(0);
  const [hasVoice,   setHasVoice]   = useState(false);
  const [voiceSecs,  setVoiceSecs]  = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(state.submitted);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function persist(next: ReportState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  }

  function setSlider(key: SliderKey, value: number) {
    persist({ ...state, [key]: value });
  }

  function setNote(note: string) {
    persist({ ...state, note });
  }

  function toggleRecording() {
    if (recording) {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecording(false);
      setHasVoice(true);
      setVoiceSecs(recSecs);
      setRecSecs(0);
    } else {
      setRecSecs(0);
      setRecording(true);
      timerRef.current = setInterval(() => {
        setRecSecs(prev => {
          if (prev >= 59) {
            clearInterval(timerRef.current!);
            setRecording(false);
            setHasVoice(true);
            setVoiceSecs(60);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const next = { ...state, submitted: true };
    persist(next);
    setSubmitting(false);
    setSubmitted(true);
  }

  const overallAvg = Math.round(
    SLIDERS.reduce((s, sl) => s + state[sl.key], 0) / SLIDERS.length
  );

  /* ─── Success screen ──────────────────────────────── */
  if (submitted) {
    return (
      <div
        className="px-8 py-8 max-w-[960px] mx-auto flex flex-col items-center gap-5 text-center"
        style={{ minHeight: "60vh", justifyContent: "center" }}
      >
        <CheckCircle size={48} style={{ color: "#10B981" }} />
        <h1
          className="text-ink text-[26px] font-extrabold"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Report Submitted!
        </h1>
        <p className="text-ink-4 text-[14px] max-w-[320px] leading-relaxed">
          Parents will receive this Saturday at 9am. Be the teacher parents brag about.
        </p>
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-[13px]"
          style={{ borderColor: "#10B98133", background: "#10B98110", color: "#10B981", border: "1px solid #10B98133" }}
        >
          <span>Week of {WEEK_START}</span>
          <span>·</span>
          <span>Class avg: {overallAvg}/5</span>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-ink-4 text-[12px] underline mt-2 hover:text-ink transition-colors"
        >
          Edit report
        </button>
      </div>
    );
  }

  /* ─── Report form ─────────────────────────────────── */
  return (
    <div className="px-8 py-8 max-w-[960px] mx-auto flex flex-col gap-7">

      {/* Header */}
      <div>
        <p
          className="text-ink-5 text-[11px] uppercase tracking-widest mb-1"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Weekly Report
        </p>
        <h1
          className="text-ink text-[26px] font-extrabold leading-none"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          JSS 3 Alpha
        </h1>
        <p className="text-ink-4 text-[13px] mt-1">
          {SCHOOL_NAME} · Week of {WEEK_START} · Term {CURRENT_TERM} · {CURRENT_SESSION}
        </p>
        <p className="text-ink-3 text-[14px] font-semibold mt-3 italic">
          &quot;Be the teacher parents brag about.&quot;
        </p>
      </div>

      {/* Overall tile */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div>
          <p
            className="text-ink-5 text-[10px] uppercase tracking-widest mb-0.5"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Overall class rating
          </p>
          <p
            className="text-[32px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)", color: ratingColor(overallAvg) }}
          >
            {overallAvg}
            <span className="text-[16px] text-ink-4 ml-1">/5</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-ink-3 text-[13px] font-medium">{RATING_LABELS[overallAvg]}</p>
          <p className="text-ink-5 text-[11px] mt-0.5" style={{ fontFamily: "var(--font-dm-mono)" }}>
            {SLIDERS.length} dimensions
          </p>
        </div>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-7">
        {SLIDERS.map(({ key, label, icon }) => {
          const value = state[key];
          const color = ratingColor(value);
          const pct   = (value - 1) / 4 * 100;
          return (
            <div key={key} className="flex flex-col gap-2">
              {/* Label + rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[18px]">{icon}</span>
                  <span
                    className="text-ink text-[14px] font-semibold"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded"
                    style={{
                      background: color + "18",
                      color,
                      border:     `1px solid ${color}40`,
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    {RATING_LABELS[value]}
                  </span>
                  <span
                    className="text-[22px] font-extrabold w-6 text-right"
                    style={{ fontFamily: "var(--font-syne)", color }}
                  >
                    {value}
                  </span>
                </div>
              </div>

              {/* Track */}
              <div className="relative h-2.5 rounded-full" style={{ background: "var(--color-elevated)" }}>
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
                  style={{ width: `${pct}%`, background: color }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow transition-all duration-150"
                  style={{ left: `calc(${pct}% - 8px)`, background: color }}
                />
                <input
                  type="range"
                  min={1} max={5} step={1}
                  value={value}
                  onChange={e => setSlider(key, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Step labels */}
              <div className="flex justify-between px-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <span
                    key={n}
                    className="text-[10px]"
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      color:      n === value ? color : "var(--color-ink-5)",
                      fontWeight: n === value ? 700 : 400,
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice note */}
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-ink text-[13px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              Voice Note
            </p>
            <span className="text-ink-5 text-[11px]">(optional)</span>
          </div>
          <p className="text-ink-4 text-[12px]">
            Record a short note for parents. &quot;Here&apos;s what I noticed this week...&quot;
          </p>
        </div>

        {!hasVoice ? (
          <button
            onClick={toggleRecording}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all w-fit"
            style={{
              background: recording ? "#EF444418" : "var(--color-elevated)",
              border:     `1.5px solid ${recording ? "#EF4444" : "var(--color-border)"}`,
              color:      recording ? "#EF4444" : "var(--color-ink)",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {recording ? (
              <>
                <MicOff size={15} style={{ color: "#EF4444" }} />
                <span>Stop Recording</span>
                <div className="flex items-end gap-0.5 ml-2 h-5">
                  {[3, 6, 4, 7, 5, 3, 6].map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full animate-pulse"
                      style={{
                        height:          `${h}px`,
                        background:      "#EF4444",
                        animationDelay:  `${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-[12px] ml-1 tabular-nums"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  0:{String(recSecs).padStart(2, "0")}
                </span>
              </>
            ) : (
              <>
                <Mic size={15} />
                <span>Record Voice Note</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium"
              style={{ background: "#10B98112", border: "1.5px solid #10B98133", color: "#10B981" }}
            >
              <span>🔊</span>
              <span>Voice note ready</span>
              <span
                className="text-[11px] opacity-70 tabular-nums"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                (0:{String(voiceSecs).padStart(2, "0")})
              </span>
            </div>
            <button
              onClick={() => { setHasVoice(false); setVoiceSecs(0); }}
              className="text-ink-4 text-[12px] hover:text-danger transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        <textarea
          rows={3}
          value={state.note}
          onChange={e => setNote(e.target.value)}
          placeholder="Written note (optional)... e.g. The class is struggling with fractions. Extra support at home would really help."
          className="w-full px-3 py-2.5 rounded-xl text-[13px] border outline-none resize-none"
          style={{
            background:  "var(--color-elevated)",
            borderColor: "var(--color-border)",
            color:       "var(--color-ink)",
            fontFamily:  "var(--font-dm-sans)",
          }}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-xl text-white text-[14px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#10B981", fontFamily: "var(--font-dm-sans)" }}
        >
          {submitting ? "Submitting…" : "Submit – Parents get Sat 9am"}
        </button>
        <p
          className="text-center text-ink-5 text-[11px]"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Sent to 6 parents · JSS 3 Alpha · Term {CURRENT_TERM} · {CURRENT_SESSION}
        </p>
      </div>
    </div>
  );
}
