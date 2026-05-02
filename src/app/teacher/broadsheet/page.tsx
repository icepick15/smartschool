import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SUBJECTS } from "@/lib/mock-data";
import { CURRENT_TERM } from "@/lib/constants";

const SUBJECT_META: Record<string, { emoji: string; bg: string }> = {
  sub1: { emoji: "🔢", bg: "#7C3AED18" },
  sub2: { emoji: "📚", bg: "#6366F118" },
  sub3: { emoji: "🔬", bg: "#10B98118" },
  sub4: { emoji: "🌍", bg: "#F59E0B18" },
  sub5: { emoji: "🏛️", bg: "#3B82F618" },
  sub6: { emoji: "🌱", bg: "#14B8A618" },
};

export default function BroadsheetPage() {
  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Broadsheet
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">Select a subject to enter or review scores</p>
        </div>
        <Badge variant="primary" size="md">CA1 · Term {CURRENT_TERM}</Badge>
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBJECTS.map((subject) => {
          const meta = SUBJECT_META[subject.id] ?? { emoji: "📖", bg: "#7C3AED18" };
          return (
            <Link
              key={subject.id}
              href={`/teacher/scores?subject=${subject.id}`}
              className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border transition-all duration-150 hover:border-primary/50 hover:scale-[0.99] active:scale-[0.98]"
              style={{ background: "#111118" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px] shrink-0"
                style={{ background: meta.bg }}
              >
                {meta.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink text-[15px] font-semibold leading-tight">
                  {subject.name}
                </p>
                <p className="text-ink-4 text-[12px] mt-0.5">6 students · CA1</p>
              </div>
              <ChevronRight size={16} className="text-ink-5 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
