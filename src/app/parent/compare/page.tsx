import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

/* Chidi Nwosu (s2) — T2 '25 scores vs class */
const COMPARISON = [
  { subjectId: "sub1", name: "Mathematics",      student: 37, classAvg: 68, classHigh: 99 },
  { subjectId: "sub2", name: "English Language", student: 80, classAvg: 72, classHigh: 98 },
  { subjectId: "sub3", name: "Basic Science",    student: 89, classAvg: 65, classHigh: 94 },
  { subjectId: "sub4", name: "Social Studies",   student: 73, classAvg: 71, classHigh: 88 },
  { subjectId: "sub5", name: "Civic Education",  student: 93, classAvg: 69, classHigh: 98 },
  { subjectId: "sub6", name: "Agric Science",    student: 63, classAvg: 63, classHigh: 84 },
];

export default function ComparePage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">
      <div>
        <h2 className="text-ink text-[17px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
          vs Class Average
        </h2>
        <p className="text-ink-4 text-[12px] mt-0.5">How Chidi compares to peers · Term 2</p>
      </div>

      <div className="flex flex-col gap-4">
        {COMPARISON.map(({ name, student, classAvg, classHigh }) => {
          const delta   = student - classAvg;
          const isRisk  = student < 40;
          return (
            <div
              key={name}
              className="p-4 rounded-xl border flex flex-col gap-3"
              style={{
                background:   isRisk ? "var(--color-danger-muted)" : "var(--color-surface)",
                borderColor:  isRisk ? "var(--color-danger)" : "var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-ink text-[13px] font-semibold">{name}</p>
                  {isRisk && (
                    <span className="text-[10px] font-bold" style={{ color: "var(--color-danger)", fontFamily: "var(--font-dm-mono)" }}>
                      ⚠ BELOW PASS
                    </span>
                  )}
                </div>
                <Badge variant={delta >= 0 ? "success" : "danger"} size="sm">
                  {delta >= 0 ? "+" : ""}{delta} pts
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5">
                <ProgressBar value={student}  max={100} variant={isRisk ? "danger" : "primary"} size="sm" label={`Chidi: ${student}`}       showValue />
                <ProgressBar value={classAvg} max={100} variant="info"                            size="xs" label={`Class avg: ${classAvg}`} />
              </div>
              <p className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                Class high: {classHigh}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
