"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { STUDENTS, SUBJECTS, SCORES } from "@/lib/mock-data";
import { getGrade, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

const TOOLTIP_STYLE = {
  backgroundColor: "#16161F",
  border: "1px solid #2A2A3A",
  borderRadius: 8,
  fontFamily: "var(--font-dm-mono)",
  fontSize: 11,
  color: "#F8F8FC",
};

const BAR_COLORS = ["#7C3AED", "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#A78BFA"];

export default function AnalyticsPage() {
  /* subject averages */
  const subjectData = SUBJECTS.map((sub, i) => {
    const scores = SCORES.filter((s) => s.subjectId === sub.id && s.total !== null);
    const avg    = scores.length
      ? Math.round(scores.reduce((a, s) => a + (s.total ?? 0), 0) / scores.length)
      : 0;
    return { name: sub.shortCode, fullName: sub.name, avg, color: BAR_COLORS[i] };
  });

  /* student rankings */
  const studentData = STUDENTS.map((student) => {
    const scores = SCORES.filter((s) => s.studentId === student.id && s.total !== null);
    const avg    = scores.length
      ? Math.round(scores.reduce((a, s) => a + (s.total ?? 0), 0) / scores.length)
      : 0;
    return { ...student, avg, grade: getGrade(avg) };
  }).sort((a, b) => b.avg - a.avg);

  const classAvg  = Math.round(studentData.reduce((s, d) => s + d.avg, 0) / studentData.length);
  const topScore  = studentData[0];
  const passCount = studentData.filter((d) => d.avg >= 50).length;
  const passRate  = Math.round((passCount / studentData.length) * 100);

  /* best and weakest subject */
  const bestSub    = [...subjectData].sort((a, b) => b.avg - a.avg)[0];
  const weakestSub = [...subjectData].sort((a, b) => a.avg - b.avg)[0];

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
            Analytics
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            JSS 3 Alpha · Term {CURRENT_TERM} {CURRENT_SESSION}
          </p>
        </div>
        <Badge variant="default" size="md">{STUDENTS.length} STUDENTS</Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Class Average", value: classAvg,      sub: getGrade(classAvg), color: "#7C3AED" },
          { label: "Top Score",     value: topScore.avg,  sub: topScore.name.split(" ")[0], color: "#10B981" },
          { label: "Pass Rate",     value: `${passRate}%`, sub: `${passCount}/${studentData.length} students`, color: "#6366F1" },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border p-4 flex flex-col gap-2"
            style={{ background: "#111118" }}
          >
            <span className="text-[10px] tracking-widest text-ink-4 uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
              {label}
            </span>
            <p className="text-[28px] font-bold leading-none" style={{ fontFamily: "var(--font-syne)", color }}>
              {value}
            </p>
            <p className="text-ink-5 text-[11px]">{sub}</p>
          </div>
        ))}
      </div>

      {/* Subject averages chart */}
      <Card variant="surface" padding="md">
        <CardHeader title="Subject Averages" subtitle="Class mean score per subject · current term" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={subjectData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#5A5A7A", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#5A5A7A", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, _n, p) => [v, p.payload.fullName]} />
            <Bar dataKey="avg" radius={[4, 4, 0, 0]} name="Avg">
              {subjectData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Subject strength tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="success" size="sm" dot>💪 Strength: {bestSub.fullName}</Badge>
          <Badge variant="warning" size="sm" dot>📖 Focus: {weakestSub.fullName}</Badge>
        </div>
      </Card>

      {/* Student ranking */}
      <Card variant="surface" padding="md">
        <CardHeader title="Student Rankings" subtitle="Sorted by average score across all subjects" />
        <div className="flex flex-col divide-y divide-border mt-1">
          {studentData.map((student, i) => {
            const isAboveAvg = student.avg >= classAvg;
            return (
              <div key={student.id} className="flex items-center gap-4 py-3">
                {/* Rank */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{
                    background: i === 0 ? "#F59E0B20" : "#1A1A24",
                    color:      i === 0 ? "#F59E0B"   : "#5A5A7A",
                    fontFamily: "var(--font-dm-mono)",
                  }}
                >
                  #{i + 1}
                </div>

                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: "#7C3AED22", color: "#A78BFA", fontFamily: "var(--font-dm-mono)" }}
                >
                  {student.avatarInitials}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-ink text-[13px] font-semibold">{student.name}</p>
                  <p className="text-ink-5 text-[11px]">{student.class}</p>
                </div>

                {/* Score + grade */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      background: isAboveAvg ? "#10B98120" : "#EF444420",
                      color:      isAboveAvg ? "#10B981"   : "#EF4444",
                    }}
                  >
                    {isAboveAvg ? "▲" : "▼"} {Math.abs(student.avg - classAvg)}
                  </span>
                  <span
                    className="text-ink text-[18px] font-bold w-10 text-right"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {student.avg}
                  </span>
                  <span
                    className="text-[12px] font-bold w-5 text-center"
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      color: student.grade === "A" ? "#10B981" : student.grade === "B" ? "#6366F1" : student.grade === "C" ? "#F59E0B" : "#EF4444",
                    }}
                  >
                    {student.grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
