"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Zap, Clock, CheckCircle, XCircle, TrendingUp, BookOpen, ChevronRight } from "lucide-react";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import {
  getStudentHeatmap,
  getWAECReadiness,
  getCognitiveFixPacks,
  getBrainMap,
  recalculateWAEC,
} from "@/lib/cognitive-store";
import { CBT_TOPICS, SUBJECTS } from "@/lib/mock-data";
import type { StudentHeatmap, WAECReadiness, CognitiveFixPack, BrainMap } from "@/lib/types";

/* ─── Helpers ────────────────────────────────────────── */

const STATUS_COLOR: Record<string, string> = {
  red:   "#EF4444",
  amber: "#F59E0B",
  green: "#10B981",
};

function WAECArc({ score, projected }: { score: number; projected: number }) {
  const r   = 54;
  const circ = Math.PI * r;
  const offset = circ * (1 - Math.min(100, score) / 100);
  return (
    <svg width={130} height={72} viewBox="0 0 130 72">
      {/* Track */}
      <path
        d={`M 10 66 A ${r} ${r} 0 0 1 120 66`}
        fill="none"
        stroke="var(--color-elevated)"
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* Score arc */}
      <path
        d={`M 10 66 A ${r} ${r} 0 0 1 120 66`}
        fill="none"
        stroke={score >= 50 ? "#10B981" : score >= 35 ? "#F59E0B" : "#EF4444"}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      {/* Score text */}
      <text x="65" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--color-ink)" fontFamily="var(--font-syne)">
        {score}
      </text>
      <text x="65" y="72" textAnchor="middle" fontSize="9" fill="var(--color-ink-5)" fontFamily="var(--font-dm-mono)">
        / 100
      </text>
    </svg>
  );
}

function formatDeliverAt(iso: string): string {
  const d   = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const h   = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  const label = `${h > 12 ? h - 12 : h}:00 ${ampm}`;
  return isToday ? `Today at ${label}` : `Tomorrow at ${label}`;
}

function FixPackCard({ pack, onStart }: { pack: CognitiveFixPack; onStart: () => void }) {
  const now       = new Date();
  const deliverAt = new Date(pack.deliverAt);
  const isReady   = deliverAt <= now || pack.status === "in_progress";
  const statusColor = pack.status === "completed" ? "#10B981" : pack.status === "failed" ? "#EF4444" : isReady ? "var(--color-primary)" : "#F59E0B";

  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{
        background:  "var(--color-surface)",
        borderColor: pack.status === "completed" ? "#10B98130" : pack.status === "failed" ? "#EF444430" : "var(--color-border)",
        opacity:     pack.status === "completed" ? 0.75 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: `${STATUS_COLOR[pack.status === "completed" ? "green" : pack.status === "failed" ? "red" : "amber"]}18`, color: statusColor, fontFamily: "var(--font-dm-mono)" }}
            >
              {pack.status === "completed" ? "MASTERED" : pack.status === "failed" ? "RETRY" : isReady ? "READY" : "SCHEDULED"}
            </span>
            <span className="text-ink-5 text-[10px]">{pack.subjectName}</span>
          </div>
          <p className="text-ink text-[14px] font-bold leading-snug" style={{ fontFamily: "var(--font-syne)" }}>
            {pack.topicName}
          </p>
        </div>

        {pack.status === "completed" ? (
          <CheckCircle size={20} style={{ color: "#10B981" }} className="shrink-0 mt-0.5" />
        ) : pack.status === "failed" ? (
          <XCircle size={20} style={{ color: "#EF4444" }} className="shrink-0 mt-0.5" />
        ) : null}
      </div>

      {/* Mastery bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full" style={{ background: "var(--color-elevated)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width:      `${pack.masteryAfter ?? pack.masteryBefore}%`,
              background: statusColor,
            }}
          />
        </div>
        <span className="text-[11px] font-semibold shrink-0" style={{ color: statusColor, fontFamily: "var(--font-dm-mono)" }}>
          {pack.masteryAfter ?? pack.masteryBefore}%
        </span>
      </div>

      {/* WAEC impact + timing */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} style={{ color: "#10B981" }} />
          <span className="text-ink-4 text-[11px]">+{pack.waecImpact} WAEC pts if fixed</span>
        </div>
        {(pack.status === "pending" || pack.status === "in_progress") && (
          <div className="flex items-center gap-1">
            <Clock size={10} style={{ color: "var(--color-ink-5)" }} />
            <span className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
              {isReady ? "Ready now" : formatDeliverAt(pack.deliverAt)}
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      {(pack.status === "pending" || pack.status === "in_progress") && isReady && (
        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-[13px] font-bold"
          style={{ background: "var(--color-primary)" }}
        >
          <Zap size={14} />
          {pack.status === "in_progress" ? "Continue Fix Pack" : "Start Fix Pack"}
        </button>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function StudentDashboard() {
  const router = useRouter();

  const [heatmap,   setHeatmap]   = useState<StudentHeatmap | null>(null);
  const [waec,      setWaec]      = useState<WAECReadiness | null>(null);
  const [fixPacks,  setFixPacks]  = useState<CognitiveFixPack[]>([]);
  const [brainMap,  setBrainMap]  = useState<BrainMap | null>(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("cbt_student");
    if (!raw) { router.push("/cbt/join"); return; }
    const { id, name } = JSON.parse(raw) as { id: string; name: string };
    setStudentId(id);
    setStudentName(name);

    const h  = getStudentHeatmap(id);
    const w  = getWAECReadiness(id) ?? recalculateWAEC(id);
    const fp = getCognitiveFixPacks(id);
    const bm = getBrainMap(id);
    setHeatmap(h);
    setWaec(w);
    setFixPacks(fp.sort((a, b) => {
      const order: Record<string, number> = { in_progress: 0, pending: 1, failed: 2, completed: 3 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    }));
    setBrainMap(bm);
    setMounted(true);
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-base)" }}>
        <p className="text-ink-4 text-[13px]">Loading your dashboard…</p>
      </div>
    );
  }

  const hasData     = Object.keys(heatmap?.topics ?? {}).length > 0;
  const activePacks = fixPacks.filter(fp => fp.status === "pending" || fp.status === "in_progress" || fp.status === "failed");
  const donePacks   = fixPacks.filter(fp => fp.status === "completed");

  // Group heatmap topics by subject
  const subjectGroups: Record<string, typeof CBT_TOPICS> = {};
  CBT_TOPICS.forEach(t => {
    if (!subjectGroups[t.subjectId]) subjectGroups[t.subjectId] = [];
    subjectGroups[t.subjectId].push(t);
  });

  const peakLabel = brainMap
    ? `Peak ${brainMap.peakHoursStart > 12 ? brainMap.peakHoursStart - 12 : brainMap.peakHoursStart}${brainMap.peakHoursStart >= 12 ? "PM" : "AM"}–${brainMap.peakHoursEnd > 12 ? brainMap.peakHoursEnd - 12 : brainMap.peakHoursEnd}${brainMap.peakHoursEnd >= 12 ? "PM" : "AM"}`
    : null;
  const styleLabel = brainMap
    ? `${brainMap.learningStyle.charAt(0).toUpperCase() + brainMap.learningStyle.slice(1)} Learner`
    : null;

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--color-base)" }}>
      <div className="w-full max-w-[640px] mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SmartSchoolMark size={28} />
            <div>
              <p className="text-ink text-[16px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                {studentName}
              </p>
              {brainMap && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: "var(--color-primary-badge)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {styleLabel}
                  </span>
                  {peakLabel && (
                    <span className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>{peakLabel}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push("/cbt/join")}
            className="text-[12px] px-3 py-1.5 rounded-xl border"
            style={{ color: "var(--color-ink-4)", borderColor: "var(--color-border)", background: "var(--color-surface)" }}
          >
            Join Test
          </button>
        </div>

        {/* WAEC Readiness Meter */}
        {hasData && waec && (
          <div
            className="rounded-2xl border p-5 flex flex-col gap-4"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={15} style={{ color: "#10B981" }} />
              <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                WAEC Readiness
              </h2>
            </div>

            <div className="flex items-end gap-6">
              <div className="flex flex-col items-center">
                <WAECArc score={waec.overallScore} projected={waec.projectedScore} />
                <p className="text-ink-5 text-[10px] -mt-1" style={{ fontFamily: "var(--font-dm-mono)" }}>CURRENT</p>
              </div>

              <div className="flex-1 flex flex-col gap-2 pb-1">
                {waec.subjects.slice(0, 3).map(s => {
                  const col = s.score >= 70 ? "#10B981" : s.score >= 40 ? "#F59E0B" : "#EF4444";
                  return (
                    <div key={s.subjectId} className="flex items-center gap-2">
                      <span className="text-[11px] text-ink-4 w-[88px] shrink-0 truncate">{s.subjectName.split(" ")[0]}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: `${col}20` }}>
                        <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: col }} />
                      </div>
                      <span className="text-[10px] font-semibold w-[30px] text-right" style={{ color: col, fontFamily: "var(--font-dm-mono)" }}>{s.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {waec.projectedScore > waec.overallScore && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px]"
                style={{ background: "#10B98112", color: "#10B981" }}
              >
                <Zap size={12} />
                Fix your RED topics → score jumps to <strong className="ml-1">{waec.projectedScore}</strong>
              </div>
            )}
          </div>
        )}

        {/* Active Fix Packs */}
        {activePacks.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap size={14} style={{ color: "var(--color-primary-light)" }} />
              <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Fix Packs
              </h2>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded ml-1"
                style={{ background: "var(--color-primary-badge)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
              >
                {activePacks.length}
              </span>
            </div>
            {activePacks.map(pack => (
              <FixPackCard
                key={pack.id}
                pack={pack}
                onStart={() => router.push(`/fix-pack/${pack.id}`)}
              />
            ))}
          </div>
        )}

        {/* Academic Heatmap */}
        <div
          className="rounded-2xl border p-5 flex flex-col gap-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <BrainCircuit size={15} style={{ color: "var(--color-primary-light)" }} />
            <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              Academic Heatmap
            </h2>
          </div>

          {!hasData ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <BookOpen size={28} style={{ color: "var(--color-ink-5)" }} />
              <p className="text-ink-4 text-[13px]">Take a CBT test to see your topic mastery here.</p>
              <button
                onClick={() => router.push("/cbt/join")}
                className="mt-1 text-[12px] font-medium px-4 py-2 rounded-xl"
                style={{ background: "var(--color-primary)", color: "white" }}
              >
                Join a Test
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(subjectGroups).map(([subjectId, topics]) => {
                const subj       = SUBJECTS.find(s => s.id === subjectId);
                const topicData  = heatmap?.topics ?? {};
                const hasAnyData = topics.some(t => topicData[t.id]);
                if (!hasAnyData) return null;

                return (
                  <div key={subjectId} className="flex flex-col gap-2">
                    <p className="text-ink-4 text-[11px] font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      {subj?.name ?? subjectId}
                    </p>
                    <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
                      {topics.map(t => {
                        const td  = topicData[t.id];
                        if (!td) return null;
                        const col = STATUS_COLOR[td.status];
                        return (
                          <div
                            key={t.id}
                            className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border"
                            style={{
                              background:  `${col}0A`,
                              borderColor: `${col}30`,
                            }}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: col, fontFamily: "var(--font-dm-mono)" }}>
                                {td.status}
                              </span>
                              <span className="text-[12px] font-extrabold" style={{ color: col, fontFamily: "var(--font-syne)" }}>
                                {td.mastery}%
                              </span>
                            </div>
                            <p className="text-ink text-[12px] leading-snug font-medium">{t.name}</p>
                            <div className="h-1 rounded-full" style={{ background: `${col}20` }}>
                              <div className="h-full rounded-full" style={{ width: `${td.mastery}%`, background: col }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Fix Packs */}
        {donePacks.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} style={{ color: "#10B981" }} />
              <h2 className="text-ink text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Mastered
              </h2>
            </div>
            {donePacks.map(pack => (
              <FixPackCard key={pack.id} pack={pack} onStart={() => {}} />
            ))}
          </div>
        )}

        {/* Footer CTA if no brain map */}
        {!brainMap && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <BrainCircuit size={16} style={{ color: "var(--color-primary-light)" }} />
            <div className="flex-1">
              <p className="text-ink text-[13px] font-semibold">Set up your Brain Map</p>
              <p className="text-ink-4 text-[11px]">Personalise how your Fix Packs are delivered</p>
            </div>
            <button
              onClick={() => router.push("/cbt/setup")}
              className="text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
              style={{ background: "var(--color-primary)", color: "white" }}
            >
              Start <ChevronRight size={12} />
            </button>
          </div>
        )}

        <p className="text-ink-5 text-[11px] text-center pb-4">
          Powered by SmartSchool Cognitive Engine
        </p>
      </div>
    </div>
  );
}
