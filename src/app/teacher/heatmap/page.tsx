"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, Info } from "lucide-react";
import { TeacherShell } from "@/components/layout/TeacherShell";
import { getAllHeatmaps } from "@/lib/cognitive-store";
import { CBT_TOPICS, SUBJECTS, STUDENTS } from "@/lib/mock-data";
import type { StudentHeatmap } from "@/lib/types";

/* ─── Helpers ────────────────────────────────────────── */

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  red:   { bg: "#EF444420", text: "#EF4444", label: "RED"   },
  amber: { bg: "#F59E0B20", text: "#F59E0B", label: "AMB"  },
  green: { bg: "#10B98120", text: "#10B981", label: "GRN"  },
};

function MasteryCell({ mastery, status }: { mastery: number; status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "var(--color-elevated)", text: "var(--color-ink-5)", label: "—" };
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg text-center"
      style={{ background: s.bg, minWidth: 52, height: 40, padding: "2px 4px" }}
    >
      <span className="text-[11px] font-extrabold leading-none" style={{ color: s.text, fontFamily: "var(--font-dm-mono)" }}>
        {mastery}%
      </span>
      <span className="text-[8px] font-bold mt-0.5" style={{ color: s.text, fontFamily: "var(--font-dm-mono)", opacity: 0.7 }}>
        {s.label}
      </span>
    </div>
  );
}

function EmptyCell() {
  return (
    <div
      className="flex items-center justify-center rounded-lg"
      style={{ background: "var(--color-elevated)", minWidth: 52, height: 40 }}
    >
      <span className="text-[11px]" style={{ color: "var(--color-ink-5)", fontFamily: "var(--font-dm-mono)" }}>—</span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function TeacherHeatmapPage() {
  const [heatmaps, setHeatmaps] = useState<Record<string, StudentHeatmap>>({});
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setHeatmaps(getAllHeatmaps());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <TeacherShell>
        <div className="px-8 py-8 max-w-[1280px] mx-auto">
          <p className="text-ink-4 text-[13px]">Loading…</p>
        </div>
      </TeacherShell>
    );
  }

  // Filter subjects that have at least one assessed topic across all students
  const assessedTopicIds = new Set<string>();
  Object.values(heatmaps).forEach(h => {
    Object.keys(h.topics).forEach(id => assessedTopicIds.add(id));
  });

  const activeSubjects = SUBJECTS.filter(s =>
    CBT_TOPICS.some(t => t.subjectId === s.id && assessedTopicIds.has(t.id)),
  );

  // Class-wide RED topic detection
  const classWeakTopics: { topicId: string; topicName: string; subjectName: string; redCount: number }[] = [];
  CBT_TOPICS.forEach(t => {
    if (!assessedTopicIds.has(t.id)) return;
    const redCount = STUDENTS.filter(s => {
      const h = heatmaps[s.id];
      return h?.topics[t.id]?.status === "red";
    }).length;
    if (redCount >= 2) {
      const subj = SUBJECTS.find(s => s.id === t.subjectId);
      classWeakTopics.push({ topicId: t.id, topicName: t.name, subjectName: subj?.name ?? "", redCount });
    }
  });
  classWeakTopics.sort((a, b) => b.redCount - a.redCount);

  const hasAnyData = assessedTopicIds.size > 0;

  return (
    <TeacherShell>
      <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <BrainCircuit size={20} style={{ color: "var(--color-primary-light)" }} />
              <h1 className="text-ink text-[22px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
                Class Heatmap
              </h1>
            </div>
            <p className="text-ink-4 text-[13px]">Topic mastery per student — sourced from CBT results</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 shrink-0">
            {[
              { label: "Weak (<40%)",     col: "#EF4444" },
              { label: "Developing",      col: "#F59E0B" },
              { label: "Strong (>70%)",   col: "#10B981" },
              { label: "Not assessed",    col: "var(--color-ink-5)" },
            ].map(({ label, col }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: col, opacity: col.startsWith("var") ? 0.3 : 0.8 }} />
                <span className="text-ink-5 text-[11px]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {!hasAnyData ? (
          <div
            className="rounded-2xl border p-12 flex flex-col items-center gap-3 text-center"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <BrainCircuit size={36} style={{ color: "var(--color-ink-5)" }} />
            <p className="text-ink-4 text-[14px] font-medium">No CBT data yet.</p>
            <p className="text-ink-5 text-[12px]">Once students complete CBT tests, their topic mastery will appear here.</p>
          </div>
        ) : (
          <>
            {/* Class-wide weak topics alert */}
            {classWeakTopics.length > 0 && (
              <div
                className="rounded-2xl border p-4 flex flex-col gap-3"
                style={{ background: "#EF444408", borderColor: "#EF444430" }}
              >
                <div className="flex items-center gap-2">
                  <Info size={14} style={{ color: "#EF4444" }} />
                  <p className="text-[13px] font-bold" style={{ color: "#EF4444", fontFamily: "var(--font-syne)" }}>
                    Class-wide weak areas — consider a group lesson
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classWeakTopics.map(t => (
                    <div
                      key={t.topicId}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px]"
                      style={{ background: "#EF444418", color: "#EF4444", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {t.topicName}
                      <span className="opacity-70">· {t.redCount} students</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Heatmap grid per subject */}
            {activeSubjects.map(subj => {
              const topics = CBT_TOPICS.filter(
                t => t.subjectId === subj.id && assessedTopicIds.has(t.id),
              );
              if (topics.length === 0) return null;

              return (
                <div
                  key={subj.id}
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                >
                  {/* Subject header */}
                  <div
                    className="px-5 py-3 border-b flex items-center gap-2"
                    style={{ background: "var(--color-elevated)", borderColor: "var(--color-border)" }}
                  >
                    <p className="text-ink text-[13px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                      {subj.name}
                    </p>
                    <span className="text-ink-5 text-[11px]">· {topics.length} topic{topics.length > 1 ? "s" : ""} assessed</span>
                  </div>

                  {/* Scrollable grid */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <th
                            className="text-left px-5 py-2.5 text-[11px] font-semibold"
                            style={{ color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)", minWidth: 120 }}
                          >
                            Student
                          </th>
                          {topics.map(t => (
                            <th
                              key={t.id}
                              className="px-2 py-2.5 text-[10px] font-semibold text-center"
                              style={{ color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)", minWidth: 60 }}
                            >
                              {t.name.split(" ").slice(0, 2).join(" ")}
                            </th>
                          ))}
                          <th
                            className="px-3 py-2.5 text-[10px] font-semibold text-center"
                            style={{ color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)", minWidth: 60 }}
                          >
                            AVG
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {STUDENTS.map((student, rowIdx) => {
                          const h = heatmaps[student.id];
                          const cells = topics.map(t => h?.topics[t.id] ?? null);
                          const assessed = cells.filter(Boolean);
                          const avg = assessed.length > 0
                            ? Math.round(assessed.reduce((s, c) => s + (c?.mastery ?? 0), 0) / assessed.length)
                            : null;
                          const avgColor = avg === null ? "var(--color-ink-5)" : avg >= 70 ? "#10B981" : avg >= 40 ? "#F59E0B" : "#EF4444";

                          return (
                            <tr
                              key={student.id}
                              style={{ borderBottom: rowIdx < STUDENTS.length - 1 ? "1px solid var(--color-border)" : "none" }}
                            >
                              {/* Student name */}
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                                    style={{ background: "var(--color-elevated)", color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)" }}
                                  >
                                    {student.avatarInitials}
                                  </div>
                                  <span className="text-ink text-[12px] font-medium">{student.name.split(" ")[0]}</span>
                                </div>
                              </td>

                              {/* Topic cells */}
                              {cells.map((cell, ci) => (
                                <td key={ci} className="px-2 py-3">
                                  <div className="flex justify-center">
                                    {cell ? (
                                      <MasteryCell mastery={cell.mastery} status={cell.status} />
                                    ) : (
                                      <EmptyCell />
                                    )}
                                  </div>
                                </td>
                              ))}

                              {/* Average */}
                              <td className="px-3 py-3">
                                <div className="flex justify-center">
                                  {avg !== null ? (
                                    <div
                                      className="px-2 py-1 rounded-lg text-[12px] font-extrabold text-center"
                                      style={{
                                        background: `${avgColor}18`,
                                        color: avgColor,
                                        fontFamily: "var(--font-dm-mono)",
                                        minWidth: 44,
                                      }}
                                    >
                                      {avg}%
                                    </div>
                                  ) : (
                                    <EmptyCell />
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </TeacherShell>
  );
}
