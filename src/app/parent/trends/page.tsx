"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/* Chidi Nwosu (s2) — historical scores per term */
const TREND_DATA = [
  { term: "T1 '24", Math: 55, English: 58, Science: 65, Civic: 70 },
  { term: "T2 '24", Math: 62, English: 60, Science: 68, Civic: 72 },
  { term: "T3 '24", Math: 58, English: 63, Science: 70, Civic: 75 },
  { term: "T1 '25", Math: 60, English: 62, Science: 74, Civic: 78 },
  { term: "T2 '25", Math: 37, English: 80, Science: 89, Civic: 93 },
];

const SUBJECT_LINES = [
  { key: "Math",    color: "var(--color-danger)"    },
  { key: "English", color: "var(--color-warning)"   },
  { key: "Science", color: "var(--color-primary)"   },
  { key: "Civic",   color: "var(--color-success)"   },
];

/* Chidi's T2 '25 scores vs class avg */
const CLASS_COMPARISON = [
  { subject: "MTH", student: 37,  classAvg: 68 },
  { subject: "ENG", student: 80,  classAvg: 72 },
  { subject: "BSC", student: 89,  classAvg: 65 },
  { subject: "SST", student: 73,  classAvg: 71 },
  { subject: "CIV", student: 93,  classAvg: 69 },
  { subject: "AGR", student: 63,  classAvg: 63 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "var(--color-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontFamily: "var(--font-dm-mono)",
  fontSize: 11,
  color: "var(--color-ink)",
};

const TICK_STYLE = { fill: "var(--color-nav-inactive)", fontSize: 9, fontFamily: "var(--font-dm-mono)" } as const;
const GRID_STROKE = "var(--color-border)";

export default function TrendsPage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      <div>
        <h2 className="text-ink text-[17px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
          Performance Trend
        </h2>
        <p className="text-ink-4 text-[12px] mt-0.5">Trendlines · Comparison · AI Insights</p>
      </div>

      {/* Rank badge */}
      <div
        className="flex items-center gap-4 p-4 rounded-xl border border-border"
        style={{ background: "var(--color-surface)" }}
      >
        <div
          className="w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--color-primary-badge)" }}
        >
          <span className="text-[24px] font-extrabold" style={{ color: "var(--color-primary-light)", fontFamily: "var(--font-syne)" }}>
            #4
          </span>
        </div>
        <div>
          <p className="text-ink text-[13px] font-semibold">Chidi Nwosu</p>
          <p className="text-ink-4 text-[11px]">Rank 4 of 6 students · JSS 3 Alpha</p>
          <p className="text-warning text-[11px] font-medium mt-0.5">⚠ Maths dropped 23 pts — needs attention</p>
        </div>
      </div>

      {/* Trendline chart */}
      <Card variant="surface" padding="md">
        <p className="text-ink text-[13px] font-bold mb-1" style={{ fontFamily: "var(--font-syne)" }}>
          Score Trendlines
        </p>
        <p className="text-ink-4 text-[11px] mb-4">Last 5 terms</p>

        <div className="flex flex-wrap gap-3 mb-3">
          {SUBJECT_LINES.map(({ key, color }) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 rounded" style={{ background: color }} />
              <span className="text-ink-4 text-[10px]">{key}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={TREND_DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="term" tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis domain={[30, 100]} tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {SUBJECT_LINES.map(({ key, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3, fill: color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Class comparison bar chart */}
      <Card variant="surface" padding="md">
        <p className="text-ink text-[13px] font-bold mb-1" style={{ fontFamily: "var(--font-syne)" }}>
          vs Class Average
        </p>
        <p className="text-ink-4 text-[11px] mb-4">Current term · all subjects</p>

        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={CLASS_COMPARISON} barGap={2} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="subject" tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis domain={[25, 100]} tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="classAvg" fill="var(--color-border)" radius={[3, 3, 0, 0]} name="Class Avg" />
            <Bar dataKey="student"  fill="var(--color-primary)" radius={[3, 3, 0, 0]} name="Chidi" />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap gap-2 mt-3">
          {CLASS_COMPARISON.map(({ subject, student, classAvg }) => {
            const delta = student - classAvg;
            return (
              <Badge key={subject} variant={delta >= 0 ? "success" : "danger"} size="sm">
                {subject} {delta >= 0 ? "+" : ""}{delta}
              </Badge>
            );
          })}
        </div>
      </Card>

      {/* AI Recommendation card */}
      <div
        className="rounded-xl border p-4 flex flex-col gap-3"
        style={{
          background: "linear-gradient(135deg, #7C3AED0A, #6366F10A)",
          borderColor: "#7C3AED25",
        }}
      >
        <div className="flex items-center gap-2">
          <span>🌟</span>
          <p
            className="text-[11px] font-bold"
            style={{ color: "var(--color-primary-light)", fontFamily: "var(--font-dm-sans)" }}
          >
            AI Recommendation
          </p>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "#C4C4E0" }}>
          Chidi's Maths score fell from 60 to 37 this term while every other subject improved — this is likely a focus or comprehension issue, not a general learning one. A targeted Maths intervention before Term 3 should lift him back above the class average.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="success" size="sm" dot>💪 Strength: Civic Education (93)</Badge>
          <Badge variant="danger"  size="sm" dot>📖 Urgent: Mathematics (37)</Badge>
        </div>
      </div>

    </div>
  );
}
