import type {
  StudentHeatmap,
  TopicMastery,
  BrainMap,
  WAECReadiness,
  WAECTopicImpact,
  WAECSubjectReadiness,
  CognitiveFixPack,
  CognitiveSprint,
  CognitiveChallengeQ,
  ContentModality,
} from "./types";
import { CBT_TOPICS, CBT_QUESTIONS, SUBJECTS, TOPIC_CONTENT } from "./mock-data";

/* ─── Constants ──────────────────────────────────────── */

const HEATMAP_KEY  = "ss_heatmaps";
const BRAINMAP_KEY = "ss_brain_maps";
const WAEC_KEY     = "ss_waec";
const COGFP_KEY    = "ss_cognitive_fps";

const SUBJECT_WEIGHTS: Record<string, number> = {
  sub1: 0.25,
  sub2: 0.20,
  sub3: 0.20,
  sub4: 0.15,
  sub5: 0.10,
  sub6: 0.10,
};

function masteryStatus(m: number): "red" | "amber" | "green" {
  return m < 40 ? "red" : m < 70 ? "amber" : "green";
}

function nextPeakTime(peakHoursStart: number): string {
  const now    = new Date();
  const target = new Date();
  target.setHours(peakHoursStart, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.toISOString();
}

function modalityFromStyle(style: string): ContentModality {
  if (style === "visual")      return "infographic";
  if (style === "auditory")    return "video";
  if (style === "kinesthetic") return "interactive";
  return "text";
}

/* ─── Heatmap ────────────────────────────────────────── */

export function getAllHeatmaps(): Record<string, StudentHeatmap> {
  try { return JSON.parse(localStorage.getItem(HEATMAP_KEY) || "{}"); }
  catch { return {}; }
}

export function getStudentHeatmap(studentId: string): StudentHeatmap {
  const all = getAllHeatmaps();
  return all[studentId] ?? { studentId, topics: {}, lastUpdated: new Date().toISOString() };
}

export function updateTopicMastery(
  studentId: string,
  topicId: string,
  subjectId: string,
  scorePercent: number,
): void {
  const all      = getAllHeatmaps();
  const heatmap  = all[studentId] ?? { studentId, topics: {}, lastUpdated: "" };
  const existing = heatmap.topics[topicId];
  // Exponential moving average: new = 0.3 × current_score + 0.7 × previous_mastery
  const newMastery = existing
    ? Math.min(100, Math.round(0.3 * scorePercent + 0.7 * existing.mastery))
    : Math.min(100, Math.round(scorePercent));
  heatmap.topics[topicId] = {
    topicId,
    subjectId,
    mastery:     newMastery,
    status:      masteryStatus(newMastery),
    attempts:    (existing?.attempts ?? 0) + 1,
    lastUpdated: new Date().toISOString(),
  } satisfies TopicMastery;
  heatmap.lastUpdated = new Date().toISOString();
  all[studentId] = heatmap;
  localStorage.setItem(HEATMAP_KEY, JSON.stringify(all));
}

export function updateHeatmapFromCBT(
  studentId: string,
  breakdown: { topicId: string; isCorrect: boolean }[],
): void {
  const topicMap = new Map<string, { correct: number; total: number; subjectId: string }>();
  breakdown.forEach(b => {
    const topic = CBT_TOPICS.find(t => t.id === b.topicId);
    if (!topic) return;
    const entry = topicMap.get(b.topicId) ?? { correct: 0, total: 0, subjectId: topic.subjectId };
    entry.total++;
    if (b.isCorrect) entry.correct++;
    topicMap.set(b.topicId, entry);
  });
  topicMap.forEach(({ correct, total, subjectId }, topicId) => {
    updateTopicMastery(studentId, topicId, subjectId, Math.round((correct / total) * 100));
  });
}

/* ─── Brain Map ──────────────────────────────────────── */

function getAllBrainMaps(): Record<string, BrainMap> {
  try { return JSON.parse(localStorage.getItem(BRAINMAP_KEY) || "{}"); }
  catch { return {}; }
}

export function getBrainMap(studentId: string): BrainMap | null {
  return getAllBrainMaps()[studentId] ?? null;
}

export function saveBrainMap(brainMap: BrainMap): void {
  const all = getAllBrainMaps();
  all[brainMap.studentId] = brainMap;
  localStorage.setItem(BRAINMAP_KEY, JSON.stringify(all));
}

/* ─── WAEC Readiness ─────────────────────────────────── */

export function getWAECReadiness(studentId: string): WAECReadiness | null {
  try {
    const all = JSON.parse(localStorage.getItem(WAEC_KEY) || "{}") as Record<string, WAECReadiness>;
    return all[studentId] ?? null;
  } catch { return null; }
}

export function recalculateWAEC(studentId: string): WAECReadiness {
  const heatmap    = getStudentHeatmap(studentId);
  const topicsList = Object.values(heatmap.topics);

  // Group assessed topics by subject
  const bySubject: Record<string, TopicMastery[]> = {};
  topicsList.forEach(t => {
    if (!bySubject[t.subjectId]) bySubject[t.subjectId] = [];
    bySubject[t.subjectId].push(t);
  });

  const subjectTopicCounts: Record<string, number> = {};
  CBT_TOPICS.forEach(t => {
    subjectTopicCounts[t.subjectId] = (subjectTopicCounts[t.subjectId] ?? 0) + 1;
  });

  const subjects: WAECSubjectReadiness[] = [];
  let overallNum = 0, overallDen = 0;
  let projectedNum = 0, projectedDen = 0;

  Object.entries(bySubject).forEach(([subjectId, topics]) => {
    const subj       = SUBJECTS.find(s => s.id === subjectId);
    if (!subj) return;
    const weight     = SUBJECT_WEIGHTS[subjectId] ?? 0.1;
    const topicCount = subjectTopicCounts[subjectId] ?? 1;

    const avgMastery      = topics.reduce((s, t) => s + t.mastery, 0) / topics.length;
    const projectedAvg    = topics.reduce((s, t) => s + (t.status === "red" ? 80 : t.mastery), 0) / topics.length;

    const topicImpacts: WAECTopicImpact[] = [...topics]
      .sort((a, b) => a.mastery - b.mastery)
      .map(t => {
        const td = CBT_TOPICS.find(c => c.id === t.topicId);
        return {
          topicId:        t.topicId,
          topicName:      td?.name ?? "—",
          subjectId,
          currentMastery: t.mastery,
          potentialGain:  t.status === "red"
            ? Math.max(1, Math.round((0.8 - t.mastery / 100) * (weight / topicCount) * 100))
            : 0,
        };
      });

    subjects.push({ subjectId, subjectName: subj.name, score: Math.round(avgMastery), topics: topicImpacts });
    overallNum   += avgMastery   * weight;
    overallDen   += weight;
    projectedNum += projectedAvg * weight;
    projectedDen += weight;
  });

  const waec: WAECReadiness = {
    studentId,
    overallScore:   overallDen   > 0 ? Math.round(overallNum   / overallDen)   : 0,
    subjects:       subjects.sort((a, b) => a.score - b.score),
    projectedScore: projectedDen > 0 ? Math.round(projectedNum / projectedDen) : 0,
    lastUpdated:    new Date().toISOString(),
  };

  const all: Record<string, WAECReadiness> = (() => {
    try { return JSON.parse(localStorage.getItem(WAEC_KEY) || "{}"); }
    catch { return {}; }
  })();
  all[studentId] = waec;
  localStorage.setItem(WAEC_KEY, JSON.stringify(all));
  return waec;
}

/* ─── Cognitive Fix Packs ────────────────────────────── */

export function getAllCognitiveFixPacks(): CognitiveFixPack[] {
  try { return JSON.parse(localStorage.getItem(COGFP_KEY) || "[]"); }
  catch { return []; }
}

export function getCognitiveFixPacks(studentId: string): CognitiveFixPack[] {
  return getAllCognitiveFixPacks().filter(fp => fp.studentId === studentId);
}

export function getCognitiveFixPack(packId: string): CognitiveFixPack | null {
  return getAllCognitiveFixPacks().find(fp => fp.id === packId) ?? null;
}

function saveCognitiveFixPacks(packs: CognitiveFixPack[]): void {
  localStorage.setItem(COGFP_KEY, JSON.stringify(packs));
}

export function generateCognitiveFixPacks(studentId: string): CognitiveFixPack[] {
  const heatmap  = getStudentHeatmap(studentId);
  const brainMap = getBrainMap(studentId);
  const existing = getCognitiveFixPacks(studentId);

  const activeTopics = new Set(
    existing
      .filter(fp => fp.status === "pending" || fp.status === "in_progress")
      .map(fp => fp.topicId),
  );

  const redTopics = Object.values(heatmap.topics).filter(t => t.status === "red");

  const subjectTopicCounts: Record<string, number> = {};
  CBT_TOPICS.forEach(t => {
    subjectTopicCounts[t.subjectId] = (subjectTopicCounts[t.subjectId] ?? 0) + 1;
  });

  const newPacks: CognitiveFixPack[] = [];

  for (const topic of redTopics) {
    if (activeTopics.has(topic.topicId)) continue;

    const topicData = CBT_TOPICS.find(t => t.id === topic.topicId);
    const subjData  = SUBJECTS.find(s => s.id === topic.subjectId);
    const content   = TOPIC_CONTENT[topic.topicId];
    if (!topicData || !subjData || !content) continue;

    const modality    = brainMap ? modalityFromStyle(brainMap.learningStyle) : "text";
    const attnSpan    = brainMap?.attentionSpanMinutes ?? 5;
    const peakStart   = brainMap?.peakHoursStart ?? 16;
    const weight      = SUBJECT_WEIGHTS[topic.subjectId] ?? 0.1;
    const topicCount  = subjectTopicCounts[topic.subjectId] ?? 3;
    const waecImpact  = Math.max(1, Math.round((0.8 - topic.mastery / 100) * (weight / topicCount) * 100));

    const lessonContent =
      brainMap?.learningStyle === "visual"      ? content.visual :
      brainMap?.learningStyle === "kinesthetic" ? content.kinesthetic :
      content.auditory;

    const modalityLabel =
      modality === "infographic" ? "Visual Guide" :
      modality === "interactive" ? "Practice Exercise" :
      modality === "video"       ? "Step-by-Step" : "Deep Dive";

    const sprints: CognitiveSprint[] = [
      {
        id:              `sp-${Date.now()}-1-${topic.topicId}`,
        type:            "refresher",
        title:           `Quick Recap: ${topicData.name}`,
        content:         content.refresherPoints.join("\n"),
        durationSeconds: 60,
        modality:        "text",
        completed:       false,
      },
      {
        id:              `sp-${Date.now()}-2-${topic.topicId}`,
        type:            "lesson",
        title:           `${modalityLabel}: ${topicData.name}`,
        content:         lessonContent,
        durationSeconds: attnSpan * 60,
        modality,
        completed:       false,
      },
    ];

    // Challenge: up to 3 questions for this topic
    const pool = CBT_QUESTIONS.filter(q => q.topicId === topic.topicId);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    const challenge: CognitiveChallengeQ[] = shuffled.map(q => ({
      questionId:   q.id,
      question:     q.text,
      options:      q.options,
      correctIndex: q.correctIndex,
    }));

    const now = Date.now();
    newPacks.push({
      id:            `cfp-${now}-${topic.topicId}`,
      studentId,
      topicId:       topic.topicId,
      topicName:     topicData.name,
      subjectId:     topic.subjectId,
      subjectName:   subjData.name,
      masteryBefore: topic.mastery,
      masteryAfter:  null,
      waecImpact,
      sprints,
      challenge,
      status:        "pending",
      deliverAt:     nextPeakTime(peakStart),
      completedAt:   null,
      createdAt:     new Date().toISOString(),
      challengeScore: null,
    });
  }

  if (newPacks.length > 0) {
    saveCognitiveFixPacks([...getAllCognitiveFixPacks(), ...newPacks]);
  }
  return newPacks;
}

export function startCognitiveFixPack(packId: string): void {
  const all = getAllCognitiveFixPacks();
  const i   = all.findIndex(fp => fp.id === packId);
  if (i >= 0 && all[i].status === "pending") {
    all[i] = { ...all[i], status: "in_progress" };
    saveCognitiveFixPacks(all);
  }
}

export function completeSprintInPack(packId: string, sprintId: string): void {
  const all  = getAllCognitiveFixPacks();
  const pack = all.find(fp => fp.id === packId);
  if (!pack) return;
  const sprint = pack.sprints.find(s => s.id === sprintId);
  if (sprint) sprint.completed = true;
  saveCognitiveFixPacks(all);
}

export function submitChallenge(
  packId: string,
  answers: (number | null)[],
  studentId: string,
): { passed: boolean; score: number; waecBefore: number; waecAfter: number } {
  const all = getAllCognitiveFixPacks();
  const i   = all.findIndex(fp => fp.id === packId);
  if (i < 0) return { passed: false, score: 0, waecBefore: 0, waecAfter: 0 };

  const pack    = all[i];
  const correct = pack.challenge.filter((q, idx) => answers[idx] === q.correctIndex).length;
  const total   = pack.challenge.length;
  const score   = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed  = correct >= Math.ceil(total * 0.67); // 2 of 3

  const waecBefore = getWAECReadiness(studentId)?.overallScore ?? 0;

  // Update heatmap: treat challenge pass as 90% score, fail as 55%
  updateTopicMastery(studentId, pack.topicId, pack.subjectId, passed ? 90 : 55);

  const newHeatmap    = getStudentHeatmap(studentId);
  const masteryAfter  = newHeatmap.topics[pack.topicId]?.mastery ?? pack.masteryBefore;
  const newWAEC       = recalculateWAEC(studentId);
  const waecAfter     = newWAEC.overallScore;

  all[i] = {
    ...pack,
    status:         passed ? "completed" : "failed",
    completedAt:    new Date().toISOString(),
    challengeScore: score,
    masteryAfter,
  };
  saveCognitiveFixPacks(all);

  // If failed and topic still red, schedule a new fix pack
  if (!passed && newHeatmap.topics[pack.topicId]?.status === "red") {
    generateCognitiveFixPacks(studentId);
  }

  return { passed, score, waecBefore, waecAfter };
}
