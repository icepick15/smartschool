import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SUBJECTS } from "@/lib/mock-data";

const COMPARISON = [
  { subjectId: "sub1", name: "Mathematics",      student: 87, classAvg: 68, classHigh: 97 },
  { subjectId: "sub2", name: "English Language", student: 92, classAvg: 72, classHigh: 98 },
  { subjectId: "sub3", name: "Basic Science",    student: 79, classAvg: 65, classHigh: 94 },
  { subjectId: "sub4", name: "Social Studies",   student: 97, classAvg: 71, classHigh: 97 },
  { subjectId: "sub5", name: "Civic Education",  student: 83, classAvg: 69, classHigh: 98 },
  { subjectId: "sub6", name: "Agric Science",    student: 74, classAvg: 63, classHigh: 88 },
];

export default function ComparePage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">
      <div>
        <h2 className="text-ink text-[17px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
          vs Class Average
        </h2>
        <p className="text-ink-4 text-[12px] mt-0.5">How Amara compares to peers</p>
      </div>

      <div className="flex flex-col gap-4">
        {COMPARISON.map(({ name, student, classAvg, classHigh }) => {
          const delta = student - classAvg;
          return (
            <div
              key={name}
              className="p-4 rounded-xl border border-border flex flex-col gap-3"
              style={{ background: "#111118" }}
            >
              <div className="flex items-center justify-between">
                <p className="text-ink text-[13px] font-semibold">{name}</p>
                <Badge variant={delta >= 0 ? "success" : "danger"} size="sm">
                  {delta >= 0 ? "+" : ""}{delta} pts
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5">
                <ProgressBar value={student}  max={100} variant="primary" size="sm" label={`Amara: ${student}`}    showValue />
                <ProgressBar value={classAvg} max={100} variant="info"    size="xs" label={`Class avg: ${classAvg}`} />
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
