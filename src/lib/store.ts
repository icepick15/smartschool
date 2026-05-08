import type { FeeRecord, Score, Diary, FixPack, TeacherCompliance } from "./types";

/* ─── Core store ─────────────────────────────────────── */

export function seedStore(fees: FeeRecord[], scores: Score[], diaries: Diary[]) {
  if (localStorage.getItem("ss_seeded")) return;
  localStorage.setItem("ss_fees",    JSON.stringify(fees));
  localStorage.setItem("ss_scores",  JSON.stringify(scores));
  localStorage.setItem("ss_diaries", JSON.stringify(diaries));
  localStorage.setItem("ss_seeded",  "1");
}

export function resetStore(fees: FeeRecord[], scores: Score[], diaries: Diary[]) {
  localStorage.setItem("ss_fees",    JSON.stringify(fees));
  localStorage.setItem("ss_scores",  JSON.stringify(scores));
  localStorage.setItem("ss_diaries", JSON.stringify(diaries));
  localStorage.setItem("ss_seeded",  "1");
}

export function getFees():    FeeRecord[] { return JSON.parse(localStorage.getItem("ss_fees")    || "[]"); }
export function getScores():  Score[]     { return JSON.parse(localStorage.getItem("ss_scores")  || "[]"); }
export function getDiaries(): Diary[]     { return JSON.parse(localStorage.getItem("ss_diaries") || "[]"); }

export function updateFee(studentId: string, patch: Partial<FeeRecord>) {
  const fees = getFees();
  const i = fees.findIndex(f => f.studentId === studentId);
  if (i >= 0) fees[i] = { ...fees[i], ...patch };
  localStorage.setItem("ss_fees", JSON.stringify(fees));
}

export function upsertScore(score: Score) {
  const scores = getScores();
  const i = scores.findIndex(
    s => s.studentId === score.studentId && s.subjectId === score.subjectId,
  );
  if (i >= 0) scores[i] = score; else scores.push(score);
  localStorage.setItem("ss_scores", JSON.stringify(scores));
}

export function addDiary(diary: Diary) {
  const diaries = getDiaries();
  diaries.unshift(diary);
  localStorage.setItem("ss_diaries", JSON.stringify(diaries));
}

/* ─── Fix Pack store ─────────────────────────────────── */

const FP_KEY    = "ss_fixpacks";
const FP_SEEDED = "ss_fp_seeded";

export function seedFixPacks(initialPacks: FixPack[]): void {
  if (localStorage.getItem(FP_SEEDED)) return;
  localStorage.setItem(FP_KEY,    JSON.stringify(initialPacks));
  localStorage.setItem(FP_SEEDED, "1");
}

export function resetFixPacks(initialPacks: FixPack[]): void {
  localStorage.setItem(FP_KEY,    JSON.stringify(initialPacks));
  localStorage.setItem(FP_SEEDED, "1");
}

export function getFixPacks(): FixPack[] {
  return JSON.parse(localStorage.getItem(FP_KEY) || "[]");
}

export function addFixPack(fp: FixPack): void {
  const packs = getFixPacks();
  packs.unshift(fp);
  localStorage.setItem(FP_KEY, JSON.stringify(packs));
}

export function purchaseFixPack(id: string): void {
  const packs = getFixPacks();
  const i = packs.findIndex(p => p.id === id);
  if (i >= 0) {
    packs[i] = {
      ...packs[i],
      purchased:    true,
      purchasedAt:  new Date().toISOString().split("T")[0],
    };
  }
  localStorage.setItem(FP_KEY, JSON.stringify(packs));
}

/* ─── Teacher Compliance store ───────────────────────── */

const TC_KEY    = "ss_teacher_compliance";
const TC_SEEDED = "ss_tc_seeded";

export function seedTeacherCompliance(data: TeacherCompliance[]): void {
  if (localStorage.getItem(TC_SEEDED)) return;
  localStorage.setItem(TC_KEY,    JSON.stringify(data));
  localStorage.setItem(TC_SEEDED, "1");
}

export function getTeacherCompliance(): TeacherCompliance[] {
  return JSON.parse(localStorage.getItem(TC_KEY) || "[]");
}

export function toggleFixPackItem(packId: string, itemId: string): void {
  const packs = getFixPacks();
  const pack  = packs.find(p => p.id === packId);
  if (!pack) return;
  const item  = pack.items.find(i => i.id === itemId);
  if (item) item.completed = !item.completed;
  localStorage.setItem(FP_KEY, JSON.stringify(packs));
}
