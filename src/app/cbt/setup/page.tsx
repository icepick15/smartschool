"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Ear, Zap, Sun, Sunset, Moon, Clock3, Brain, ChevronRight } from "lucide-react";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import { saveBrainMap } from "@/lib/cognitive-store";
import type { LearningStyle } from "@/lib/types";

/* ─── Quiz data ──────────────────────────────────────── */

const STEPS = [
  {
    question: "How do you learn best?",
    sub: "This helps us choose the right content format for you.",
    options: [
      { value: "visual",      label: "Seeing diagrams & pictures",   icon: Eye,    desc: "Visual learner"  },
      { value: "auditory",    label: "Listening to explanations",    icon: Ear,    desc: "Auditory learner" },
      { value: "kinesthetic", label: "Doing exercises & activities", icon: Zap,    desc: "Hands-on learner" },
    ],
  },
  {
    question: "When do you feel most focused?",
    sub: "We'll deliver your Fix Packs at your brain's peak time.",
    options: [
      { value: "morning",   label: "Morning (8AM – 12PM)",  icon: Sun,    desc: "Early bird"   },
      { value: "afternoon", label: "Afternoon (12PM – 4PM)", icon: Sunset, desc: "Afternoon peak" },
      { value: "evening",   label: "Evening (4PM – 8PM)",    icon: Moon,   desc: "Evening focus" },
    ],
  },
  {
    question: "How long can you focus before needing a break?",
    sub: "We size each learning sprint to match your attention span.",
    options: [
      { value: "short",  label: "2 – 3 minutes",  icon: Clock3, desc: "Short sprints"  },
      { value: "medium", label: "5 – 7 minutes",  icon: Clock3, desc: "Medium sessions" },
      { value: "long",   label: "10+ minutes",    icon: Clock3, desc: "Deep focus"      },
    ],
  },
  {
    question: "How many new ideas can you handle at once?",
    sub: "This controls how many concepts we pack into one session.",
    options: [
      { value: "1", label: "One at a time — keep it simple", icon: Brain, desc: "1 concept"  },
      { value: "2", label: "Two ideas — I can juggle them",  icon: Brain, desc: "2 concepts" },
      { value: "3", label: "Three or more — bring it on",    icon: Brain, desc: "3+ concepts" },
    ],
  },
];

/* ─── Page ───────────────────────────────────────────── */

export default function BrainMapSetupPage() {
  const router = useRouter();

  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [entering, setEntering] = useState(true);
  const [studentId,   setStudentId]   = useState("");
  const [studentName, setStudentName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("cbt_student");
    if (!raw) { router.push("/cbt/join"); return; }
    const { id, name } = JSON.parse(raw) as { id: string; name: string };
    setStudentId(id);
    setStudentName(name);
    setMounted(true);
    setTimeout(() => setEntering(false), 50);
  }, [router]);

  function select(value: string) {
    const next = [...answers, value];
    setAnswers(next);

    if (step < STEPS.length - 1) {
      setEntering(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setEntering(false);
      }, 180);
    } else {
      // All answers collected — build brain map
      const [style, peakKey, attnKey, loadStr] = next;

      const peakMap: Record<string, [number, number]> = {
        morning:   [8,  12],
        afternoon: [12, 16],
        evening:   [16, 20],
      };
      const attnMap: Record<string, number> = {
        short: 3, medium: 6, long: 12,
      };
      const styleModalityMap: Record<string, string[]> = {
        visual:      ["infographic", "interactive", "video"],
        auditory:    ["video", "text", "infographic"],
        kinesthetic: ["interactive", "infographic", "video"],
      };

      const [peakStart, peakEnd] = peakMap[peakKey] ?? [16, 20];
      const styles = ["visual", "auditory", "kinesthetic"] as LearningStyle[];
      const secondary = styles.find(s => s !== style) ?? "auditory";

      saveBrainMap({
        studentId,
        learningStyle:      style as LearningStyle,
        secondaryStyle:     secondary,
        peakHoursStart:     peakStart,
        peakHoursEnd:       peakEnd,
        attentionSpanMinutes: attnMap[attnKey] ?? 6,
        cognitiveLoad:      parseInt(loadStr) || 2,
        modalityPreference: styleModalityMap[style] ?? ["text"],
        createdAt:          new Date().toISOString(),
      });

      // Navigate to pending join or fallback to join
      const pending = sessionStorage.getItem("cbt_pending_join");
      if (pending) {
        const { sessionId } = JSON.parse(pending) as { sessionId: string };
        sessionStorage.removeItem("cbt_pending_join");
        router.push(`/cbt/${sessionId}`);
      } else {
        router.push("/cbt/join");
      }
    }
  }

  if (!mounted) return null;

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "var(--color-base)" }}
    >
      <div className="w-full max-w-[420px] flex flex-col gap-6">

        {/* Logo + name */}
        <div className="flex flex-col items-center gap-2">
          <SmartSchoolMark size={32} />
          <p className="text-ink-4 text-[13px]">Setting up {studentName}&apos;s Brain Map</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--color-elevated)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ background: "var(--color-primary)", width: `${progress}%` }}
            />
          </div>
          <span className="text-ink-5 text-[11px] shrink-0" style={{ fontFamily: "var(--font-dm-mono)" }}>
            {step + 1}/{STEPS.length}
          </span>
        </div>

        {/* Question card */}
        <div
          className="rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-150"
          style={{
            background:   "var(--color-surface)",
            borderColor:  "var(--color-border)",
            opacity:      entering ? 0 : 1,
            transform:    entering ? "translateY(6px)" : "translateY(0)",
          }}
        >
          <div className="flex flex-col gap-1">
            <h1
              className="text-ink text-[20px] font-extrabold leading-snug"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {current.question}
            </h1>
            <p className="text-ink-4 text-[13px]">{current.sub}</p>
          </div>

          <div className="flex flex-col gap-3">
            {current.options.map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                onClick={() => select(value)}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background:  "var(--color-elevated)",
                  borderColor: "var(--color-border)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                  (e.currentTarget as HTMLElement).style.background = "var(--color-primary-badge)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLElement).style.background = "var(--color-elevated)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-primary-badge)" }}
                >
                  <Icon size={18} style={{ color: "var(--color-primary-light)" }} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="text-ink text-[14px] font-semibold leading-snug">{label}</p>
                  <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>{desc}</p>
                </div>
                <ChevronRight size={16} style={{ color: "var(--color-ink-5)" }} className="shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <p className="text-ink-5 text-[11px] text-center">
          This is saved to your profile and used to personalise every Fix Pack.
        </p>
      </div>
    </div>
  );
}
