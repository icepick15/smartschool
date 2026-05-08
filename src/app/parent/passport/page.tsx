"use client";

import { useState, useEffect } from "react";
import { Download, ChevronRight } from "lucide-react";
import { STUDENTS } from "@/lib/mock-data";

const STORAGE_KEY = "ss_academic_passport_s2";

type PassportEntry = {
  year: string;
  term: 1 | 2 | 3;
  avg: number | null;
  subjects: { name: string; score: number | null }[];
};

const YEARS = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"] as const;
const LIVE_YEAR: string = "JSS 3";
const LIVE_TERM: number = 2;

const SEED: PassportEntry[] = [
  { year: "JSS 1", term: 1, avg: 68, subjects: [{ name: "Mathematics", score: 68 }, { name: "English", score: 72 }, { name: "Basic Science", score: 64 }] },
  { year: "JSS 1", term: 2, avg: 71, subjects: [{ name: "Mathematics", score: 70 }, { name: "English", score: 75 }, { name: "Basic Science", score: 68 }] },
  { year: "JSS 1", term: 3, avg: 74, subjects: [{ name: "Mathematics", score: 73 }, { name: "English", score: 78 }, { name: "Basic Science", score: 71 }] },
  { year: "JSS 2", term: 1, avg: 65, subjects: [{ name: "Mathematics", score: 62 }, { name: "English", score: 70 }, { name: "Basic Science", score: 63 }] },
  { year: "JSS 2", term: 2, avg: 58, subjects: [{ name: "Mathematics", score: 52 }, { name: "English", score: 65 }, { name: "Basic Science", score: 57 }] },
  { year: "JSS 2", term: 3, avg: 62, subjects: [{ name: "Mathematics", score: 58 }, { name: "English", score: 68 }, { name: "Basic Science", score: 60 }] },
  { year: "JSS 3", term: 1, avg: 51, subjects: [{ name: "Mathematics", score: 44 }, { name: "English", score: 59 }, { name: "Basic Science", score: 50 }] },
  { year: "JSS 3", term: 2, avg: 37, subjects: [{ name: "Mathematics", score: 22 }, { name: "English", score: 49 }, { name: "Basic Science", score: 40 }] },
  { year: "JSS 3", term: 3, avg: null, subjects: [] },
  { year: "SS 1",  term: 1, avg: null, subjects: [] },
  { year: "SS 1",  term: 2, avg: null, subjects: [] },
  { year: "SS 1",  term: 3, avg: null, subjects: [] },
  { year: "SS 2",  term: 1, avg: null, subjects: [] },
  { year: "SS 2",  term: 2, avg: null, subjects: [] },
  { year: "SS 2",  term: 3, avg: null, subjects: [] },
  { year: "SS 3",  term: 1, avg: null, subjects: [] },
  { year: "SS 3",  term: 2, avg: null, subjects: [] },
  { year: "SS 3",  term: 3, avg: null, subjects: [] },
];

function cellColors(avg: number | null) {
  if (avg === null) return { bg: "var(--color-elevated)", text: "var(--color-ink-5)", border: "var(--color-border)" };
  if (avg >= 70)    return { bg: "#10B98118", text: "#10B981", border: "#10B98144" };
  if (avg >= 50)    return { bg: "#F59E0B15", text: "#F59E0B", border: "#F59E0B44" };
  return              { bg: "#EF444415", text: "#EF4444", border: "#EF444444" };
}

export default function AcademicPassportPage() {
  const [passport,  setPassport]  = useState<PassportEntry[]>([]);
  const [selected,  setSelected]  = useState<PassportEntry | null>(null);
  const [exported,  setExported]  = useState(false);

  const student = STUDENTS.find(s => s.id === "s2")!;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setPassport(JSON.parse(saved)); return; } catch {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    setPassport(SEED);
  }, []);

  function getEntry(year: string, term: 1 | 2 | 3): PassportEntry | undefined {
    return passport.find(e => e.year === year && e.term === term);
  }

  function handleCellClick(entry: PassportEntry | undefined) {
    if (!entry || entry.avg === null || !entry.subjects.length) return;
    setSelected(prev => (prev?.year === entry.year && prev?.term === entry.term) ? null : entry);
  }

  function handleExport() {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  const completed  = passport.filter(e => e.avg !== null);
  const avgs       = completed.map(e => e.avg as number);
  const bestAvg    = avgs.length ? Math.max(...avgs) : null;
  const latestAvg  = avgs.length ? avgs[avgs.length - 1] : null;
  const prevAvg    = avgs.length > 1 ? avgs[avgs.length - 2] : null;
  const trend = latestAvg === null || prevAvg === null ? "flat"
    : latestAvg > prevAvg ? "up"
    : latestAvg < prevAvg ? "down"
    : "flat";

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-7">

      {/* ─── Header ──────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p
            className="text-ink-5 text-[11px] uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Academic Passport
          </p>
          <h1
            className="text-ink text-[28px] font-extrabold leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {student.name}
          </h1>
          <p className="text-ink-4 text-[13px] mt-0.5">{student.class} · 6-year record</p>
          <p className="text-ink-3 text-[14px] font-semibold mt-3 italic">
            &quot;WAEC is 1 day. This is 6 years.&quot;
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all"
            style={{
              background: exported ? "#10B98118" : "var(--color-surface)",
              border:     `1px solid ${exported ? "#10B98155" : "var(--color-border)"}`,
              color:      exported ? "#10B981" : "var(--color-ink)",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            <Download size={14} />
            {exported ? "PDF generated!" : "Export 6-Year PDF"}
          </button>
          <p
            className="text-[11px]"
            style={{ color: trend === "down" ? "#EF4444" : trend === "up" ? "#10B981" : "var(--color-ink-4)" }}
          >
            {trend === "down" ? "↘ Declining trend — action needed"
              : trend === "up" ? "↗ Improving trend"
              : "→ Stable"}
          </p>
        </div>
      </div>

      {/* ─── Heatmap grid ────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
      >
        {/* Column headers */}
        <div
          className="grid border-b"
          style={{ gridTemplateColumns: "120px 1fr 1fr 1fr", borderColor: "var(--color-border)" }}
        >
          <div className="px-4 py-3" />
          {[1, 2, 3].map(t => (
            <div key={t} className="px-4 py-3 text-center">
              <span
                className="text-[10px] tracking-widest text-ink-5 uppercase"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                Term {t}
              </span>
            </div>
          ))}
        </div>

        {/* Year rows */}
        {YEARS.map(year => (
          <div
            key={year}
            className="grid border-b last:border-0"
            style={{ gridTemplateColumns: "120px 1fr 1fr 1fr", borderColor: "var(--color-border)" }}
          >
            {/* Year label */}
            <div className="flex items-center px-4 py-2 gap-2">
              <span
                className="text-[13px] font-semibold"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  color: year.startsWith("SS") ? "var(--color-primary-light)" : "var(--color-ink-3)",
                }}
              >
                {year}
              </span>
              {year === "SS 3" && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "#F59E0B18", color: "#F59E0B" }}
                >
                  WAEC
                </span>
              )}
            </div>

            {/* Term cells */}
            {([1, 2, 3] as const).map(term => {
              const entry      = getEntry(year, term);
              const colors     = cellColors(entry?.avg ?? null);
              const isLive     = year === LIVE_YEAR && term === LIVE_TERM;
              const isSelected = selected?.year === year && selected?.term === term;
              const clickable  = !!entry?.avg && !!entry.subjects.length;

              return (
                <div key={term} className="p-2">
                  <button
                    onClick={() => handleCellClick(entry)}
                    disabled={!clickable}
                    className="relative w-full h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all"
                    style={{
                      background: isSelected ? colors.text + "25" : colors.bg,
                      border:     `1.5px solid ${isSelected ? colors.text : colors.border}`,
                      cursor:     clickable ? "pointer" : "default",
                    }}
                  >
                    {isLive && (
                      <span
                        className="absolute -top-1.5 -right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#7C3AED", color: "white" }}
                      >
                        LIVE
                      </span>
                    )}
                    <span
                      className="text-[18px] font-extrabold leading-none"
                      style={{ color: colors.text, fontFamily: "var(--font-syne)" }}
                    >
                      {entry?.avg ?? "—"}
                    </span>
                    {entry?.avg !== null && entry?.avg !== undefined && (
                      <span
                        className="text-[9px] opacity-50"
                        style={{ color: colors.text, fontFamily: "var(--font-dm-mono)" }}
                      >
                        /100
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ─── Legend ──────────────────────────────────── */}
      <div className="flex items-center gap-5 flex-wrap">
        {[
          { label: "70+ (Strong)",        bg: "#10B98118", border: "#10B98144" },
          { label: "50–69 (Average)",     bg: "#F59E0B15", border: "#F59E0B44" },
          { label: "Below 50 (At Risk)",  bg: "#EF444415", border: "#EF444444" },
          { label: "Not taken yet",       bg: "var(--color-elevated)", border: "var(--color-border)" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded"
              style={{ background: item.bg, border: `1.5px solid ${item.border}` }}
            />
            <span className="text-ink-4 text-[11px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Subject breakdown (on cell click) ───────── */}
      {selected && (
        <div
          className="rounded-xl border p-5 flex flex-col gap-4"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
        >
          <div className="flex items-center gap-2">
            <ChevronRight size={14} className="text-ink-4" />
            <h3 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              {selected.year} — Term {selected.term} Breakdown
            </h3>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded ml-auto"
              style={{
                ...cellColors(selected.avg),
                fontFamily: "var(--font-dm-mono)",
                border: `1px solid ${cellColors(selected.avg).border}`,
              }}
            >
              Avg {selected.avg}/100
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {selected.subjects.map(subj => {
              const c = cellColors(subj.score);
              return (
                <div
                  key={subj.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: "var(--color-ink-3)", fontFamily: "var(--font-dm-sans)" }}
                  >
                    {subj.name}
                  </span>
                  <span
                    className="text-[15px] font-extrabold ml-3"
                    style={{ color: c.text, fontFamily: "var(--font-syne)" }}
                  >
                    {subj.score ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 6-year summary stats ─────────────────────── */}
      <div
        className="rounded-xl p-5 flex flex-col gap-3"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <h3 className="text-ink text-[13px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
          6-Year Summary
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Terms completed", value: `${completed.length}/18`              },
            { label: "Best term avg",   value: bestAvg   !== null ? `${bestAvg}/100`   : "—" },
            { label: "Current avg",     value: latestAvg !== null ? `${latestAvg}/100` : "—" },
          ].map(m => (
            <div key={m.label}>
              <p className="text-ink-5 text-[11px] mb-0.5" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {m.label}
              </p>
              <p
                className="text-ink text-[22px] font-extrabold"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
