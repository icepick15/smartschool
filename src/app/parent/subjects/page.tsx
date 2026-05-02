import { HeatmapCell } from "@/components/ui/HeatmapCell";
import { STUDENTS, SUBJECTS, SCORES } from "@/lib/mock-data";

/* Show all students so the parent can see class context */
const TERMS = ["Term 1", "Term 2", "Term 3"];

/* Mock term history — only Term 2 is real; Terms 1 & 3 are illustrative */
const TERM_SCORES: Record<string, Record<string, number[]>> = {
  sub1: { s1: [70, 87, 0], s2: [60, 69, 0], s3: [92, 97, 0], s4: [38, 37, 0], s5: [74, 83, 0], s6: [56, 64, 0] },
  sub2: { s1: [68, 92, 0], s2: [62, 80, 0], s3: [90, 98, 0], s4: [45, 58, 0], s5: [72, 88, 0], s6: [58, 67, 0] },
  sub3: { s1: [65, 79, 0], s2: [74, 89, 0], s3: [88, 94, 0], s4: [42, 50, 0], s5: [70, 78, 0], s6: [60, 72, 0] },
  sub4: { s1: [78, 97, 0], s2: [62, 73, 0], s3: [86, 90, 0], s4: [44, 54, 0], s5: [76, 92, 0], s6: [55, 59, 0] },
  sub5: { s1: [72, 83, 0], s2: [78, 93, 0], s3: [89, 98, 0], s4: [50, 63, 0], s5: [65, 75, 0], s6: [58, 68, 0] },
  sub6: { s1: [68, 74, 0], s2: [55, 63, 0], s3: [82, 88, 0], s4: [38, 42, 0], s5: [70, 79, 0], s6: [50, 53, 0] },
};

export default function SubjectHeatmapPage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      <div>
        <h2
          className="text-ink text-[17px] font-bold"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Subject Heatmap
        </h2>
        <p className="text-ink-4 text-[12px] mt-0.5">Score history across terms</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: "85+",   color: "#10B981" },
          { label: "75–84", color: "#6366F1" },
          { label: "65–74", color: "#FCD34D" },
          { label: "55–64", color: "#F59E0B" },
          { label: "<55",   color: "#EF4444" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-[3px]" style={{ background: color + "50" }} />
            <span className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Heatmap grid per subject */}
      <div className="flex flex-col gap-4">
        {SUBJECTS.map((sub) => (
          <div key={sub.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-ink text-[12px] font-semibold">{sub.name}</p>
              <span className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {sub.shortCode}
              </span>
            </div>

            {/* Student rows */}
            <div className="flex flex-col gap-1">
              {STUDENTS.map((student) => {
                const termData = TERM_SCORES[sub.id]?.[student.id] ?? [null, null, null];
                const isMe = student.id === "s1";
                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-2"
                    style={{ opacity: isMe ? 1 : 0.55 }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                      style={{ background: "#7C3AED22", color: "#A78BFA", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {student.avatarInitials[0]}
                    </div>
                    <span className="text-ink-4 text-[10px] w-14 truncate">{student.name.split(" ")[0]}</span>
                    <div className="flex gap-1">
                      {termData.map((score, ti) =>
                        ti < 2 ? (
                          <HeatmapCell key={ti} score={score} size={26} />
                        ) : (
                          <div
                            key={ti}
                            className="flex items-center justify-center rounded-[4px] text-[8px] text-ink-5"
                            style={{ width: 26, height: 30, background: "#1A1A24", fontFamily: "var(--font-dm-mono)" }}
                          >
                            —
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex gap-2 ml-1">
                      {TERMS.map((t, i) => (
                        <span key={t} className="text-ink-5 text-[9px]" style={{ fontFamily: "var(--font-dm-mono)", width: 26, textAlign: "center" }}>
                          {i < 2 ? t.replace("Term ", "T") : "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
