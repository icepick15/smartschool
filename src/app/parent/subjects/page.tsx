import { HeatmapCell } from "@/components/ui/HeatmapCell";
import { Card } from "@/components/ui/Card";
import { STUDENTS, SUBJECTS } from "@/lib/mock-data";

const DEMO_STUDENT_ID = "s2"; // Chidi Nwosu

/* Term score history. Term 3 = 0 (not yet). s2/sub1 updated to 37 (at-risk). */
const TERM_SCORES: Record<string, Record<string, [number, number, 0]>> = {
  sub1: { s1: [70, 87, 0], s2: [60, 37, 0], s3: [92, 97, 0], s4: [38, 37, 0], s5: [74, 83, 0], s6: [56, 64, 0] },
  sub2: { s1: [68, 92, 0], s2: [62, 80, 0], s3: [90, 98, 0], s4: [45, 58, 0], s5: [72, 88, 0], s6: [58, 67, 0] },
  sub3: { s1: [65, 79, 0], s2: [74, 89, 0], s3: [88, 94, 0], s4: [42, 50, 0], s5: [70, 78, 0], s6: [60, 72, 0] },
  sub4: { s1: [78, 97, 0], s2: [62, 73, 0], s3: [86, 90, 0], s4: [44, 54, 0], s5: [76, 92, 0], s6: [55, 59, 0] },
  sub5: { s1: [72, 83, 0], s2: [78, 93, 0], s3: [89, 98, 0], s4: [50, 63, 0], s5: [65, 75, 0], s6: [58, 68, 0] },
  sub6: { s1: [68, 74, 0], s2: [55, 63, 0], s3: [82, 88, 0], s4: [38, 42, 0], s5: [70, 79, 0], s6: [50, 53, 0] },
};

const TERMS  = ["Term 1", "Term 2", "Term 3"];
const CELL_W = 40; // px — must match HeatmapCell size prop

const LEGEND = [
  { label: "85+",   bg: "#10B98130", color: "var(--color-success)"          },
  { label: "75–84", bg: "#6366F130", color: "var(--color-secondary-light)"  },
  { label: "65–74", bg: "#F59E0B25", color: "#FCD34D"                       },
  { label: "55–64", bg: "#F59E0B18", color: "var(--color-warning)"          },
  { label: "<55",   bg: "#EF444420", color: "var(--color-danger)"           },
];

export default function SubjectHeatmapPage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* ── Page header ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-ink text-[17px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
            Subject Heatmap
          </h2>
          <p className="text-ink-4 text-[12px] mt-0.5">Score history across terms · JSS 3 Alpha</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap justify-end shrink-0">
          {LEGEND.map(({ label, bg, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-[3px] flex items-center justify-center text-[7px] font-bold"
                style={{ background: bg, color, fontFamily: "var(--font-dm-mono)" }}
              >
                {label.split("+")[0].split("–")[0]}
              </div>
              <span className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subject cards ────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {SUBJECTS.map(sub => (
          <Card key={sub.id} variant="surface" padding="md">

            {/* Subject title row */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-ink text-[13px] font-semibold">{sub.name}</p>
              <span
                className="text-ink-5 text-[10px] tracking-widest"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {sub.shortCode}
              </span>
            </div>

            {/* Column header row */}
            <div className="flex items-center gap-2 pb-2 border-b border-border mb-1">
              <div className="w-6 shrink-0" /> {/* avatar spacer */}
              <div className="flex-1 min-w-0" /> {/* name spacer */}
              {TERMS.map((t, i) => (
                <div
                  key={t}
                  className="text-center text-[9px] tracking-widest text-ink-5 uppercase shrink-0"
                  style={{ width: CELL_W, fontFamily: "var(--font-dm-mono)", opacity: i === 2 ? 0.4 : 1 }}
                >
                  {t.replace("Term ", "T")}
                </div>
              ))}
            </div>

            {/* Student rows */}
            {STUDENTS.map(student => {
              const scores = TERM_SCORES[sub.id]?.[student.id] ?? [null, null, null];
              const isMe   = student.id === DEMO_STUDENT_ID;
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-2 py-1"
                  style={{ opacity: isMe ? 1 : 0.45 }}
                >
                  {/* Avatar */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                    style={{
                      background: isMe ? "var(--color-primary-badge)" : "var(--color-elevated)",
                      color:      isMe ? "var(--color-primary-light)"  : "var(--color-ink-5)",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {student.avatarInitials[0]}
                  </div>

                  {/* Name */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span
                      className="text-[12px] truncate"
                      style={{
                        color:      isMe ? "var(--color-ink)" : "var(--color-ink-4)",
                        fontWeight: isMe ? 600 : 400,
                      }}
                    >
                      {student.name.split(" ")[0]}
                    </span>
                    {isMe && (
                      <span
                        className="text-[9px] shrink-0"
                        style={{ color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
                      >
                        you
                      </span>
                    )}
                  </div>

                  {/* Term cells */}
                  {scores.map((score, ti) =>
                    ti < 2 ? (
                      <div key={ti} className="shrink-0" style={{ width: CELL_W, display: "flex", justifyContent: "center" }}>
                        <HeatmapCell score={score} size={CELL_W - 4} />
                      </div>
                    ) : (
                      <div
                        key={ti}
                        className="shrink-0 flex items-center justify-center rounded-[4px] text-[9px]"
                        style={{
                          width:      CELL_W,
                          height:     CELL_W,
                          background: "var(--color-elevated)",
                          color:      "var(--color-ink-5)",
                          fontFamily: "var(--font-dm-mono)",
                          opacity:    0.5,
                        }}
                      >
                        —
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </Card>
        ))}
      </div>
    </div>
  );
}
