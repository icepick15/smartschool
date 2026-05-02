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
import { SUBJECTS } from "@/lib/mock-data";

const TREND_DATA = [
  { term: "T1 '24", Math: 70, English: 68, Science: 65, Social: 78 },
  { term: "T2 '24", Math: 75, English: 72, Science: 74, Social: 80 },
  { term: "T3 '24", Math: 72, English: 76, Science: 70, Social: 77 },
  { term: "T1 '25", Math: 80, English: 78, Science: 76, Social: 82 },
  { term: "T2 '25", Math: 87, English: 92, Science: 79, Social: 97 },
];

const SUBJECT_LINES = [
  { key: "Math",    color: "#6366F1" },
  { key: "English", color: "#F59E0B" },
  { key: "Science", color: "#7C3AED" },
  { key: "Social",  color: "#10B981" },
];

const CLASS_COMPARISON = [
  { subject: "MTH", student: 87, classAvg: 68 },
  { subject: "ENG", subject2: "ENG", student: 92, classAvg: 72 },
  { subject: "BSC", student: 79, classAvg: 65 },
  { subject: "SST", student: 97, classAvg: 71 },
  { subject: "CIV", student: 83, classAvg: 69 },
  { subject: "AGR", student: 74, classAvg: 63 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "#16161F",
  border: "1px solid #2A2A3A",
  borderRadius: 8,
  fontFamily: "var(--font-dm-mono)",
  fontSize: 11,
  color: "#F8F8FC",
};

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
        style={{ background: "#111118" }}
      >
        <div
          className="w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#6366F112" }}
        >
          <span className="text-[24px] font-extrabold" style={{ color: "#6366F1", fontFamily: "var(--font-syne)" }}>
            #1
          </span>
        </div>
        <div>
          <p className="text-ink text-[13px] font-semibold">Amara Okafor</p>
          <p className="text-ink-4 text-[11px]">Rank 1 of 6 students</p>
          <p className="text-success text-[11px] font-medium mt-0.5">+19 pts vs class avg</p>
        </div>
      </div>

      {/* Trendline chart */}
      <Card variant="surface" padding="md">
        <p className="text-ink text-[13px] font-bold mb-1" style={{ fontFamily: "var(--font-syne)" }}>
          Score Trendlines
        </p>
        <p className="text-ink-4 text-[11px] mb-4">Last 5 terms</p>

        {/* Legend */}
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
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
            <XAxis
              dataKey="term"
              tick={{ fill: "#5A5A7A", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[50, 100]}
              tick={{ fill: "#5A5A7A", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
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
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
            <XAxis
              dataKey="subject"
              tick={{ fill: "#5A5A7A", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[40, 100]}
              tick={{ fill: "#5A5A7A", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="classAvg" fill="#2A2A3A" radius={[3, 3, 0, 0]} name="Class Avg" />
            <Bar dataKey="student"  fill="#7C3AED" radius={[3, 3, 0, 0]} name="Amara" />
          </BarChart>
        </ResponsiveContainer>

        {/* Delta chips */}
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
            style={{ color: "#A78BFA", fontFamily: "var(--font-dm-sans)" }}
          >
            AI Recommendation
          </p>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "#C4C4E0" }}>
          Amara is excelling in language subjects. To maintain momentum, focus on consistent revision in Agricultural Science where scores dipped slightly this term.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="success" size="sm" dot>💪 Strength: Mathematics</Badge>
          <Badge variant="warning" size="sm" dot>📖 Focus: Agric Science</Badge>
        </div>
      </div>

    </div>
  );
}
