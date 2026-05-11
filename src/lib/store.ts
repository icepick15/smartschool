import type { FeeRecord, Score, Diary, FixPack, TeacherCompliance, CBTSession, CBTResult } from "./types";

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

/* ─── CBT store ──────────────────────────────────────── */

const CBT_SESSIONS_KEY = "smartschool_cbt_sessions";
const CBT_RESULTS_KEY  = "smartschool_cbt_results";

export function getCBTSessions(): CBTSession[] {
  try { return JSON.parse(localStorage.getItem(CBT_SESSIONS_KEY) || "[]"); }
  catch { return []; }
}

export function saveCBTSessions(sessions: CBTSession[]): void {
  localStorage.setItem(CBT_SESSIONS_KEY, JSON.stringify(sessions));
}

export function getCBTSessionByCode(code: string): CBTSession | null {
  return getCBTSessions().find(s => s.code === code.toUpperCase() && s.status === "active") ?? null;
}

export function getCBTResults(): CBTResult[] {
  try { return JSON.parse(localStorage.getItem(CBT_RESULTS_KEY) || "[]"); }
  catch { return []; }
}

export function saveCBTResult(result: CBTResult): void {
  const results = getCBTResults();
  const i = results.findIndex(r => r.sessionId === result.sessionId && r.studentId === result.studentId);
  if (i >= 0) results[i] = result; else results.push(result);
  localStorage.setItem(CBT_RESULTS_KEY, JSON.stringify(results));
}

export function releaseCBTResult(resultId: string): void {
  const results = getCBTResults();
  const i = results.findIndex(r => r.id === resultId);
  if (i < 0) return;
  results[i].released = true;
  localStorage.setItem(CBT_RESULTS_KEY, JSON.stringify(results));
  const r = results[i];
  const existing = getScores().find(s => s.studentId === r.studentId && s.subjectId === r.subjectId);
  upsertScore({
    studentId: r.studentId,
    subjectId: r.subjectId,
    ca1:       existing?.ca1 === null ? r.caScore : (existing?.ca1 ?? r.caScore),
    ca2:       existing?.ca1 !== null ? r.caScore : (existing?.ca2 ?? null),
    exam:      existing?.exam ?? null,
    total:     null,
    grade:     null,
  });
}

export function getTimerStart(sessionId: string, studentId: string): number | null {
  const raw = localStorage.getItem(`cbt_start_${sessionId}_${studentId}`);
  return raw ? Number(raw) : null;
}

export function setTimerStart(sessionId: string, studentId: string): number {
  const existing = getTimerStart(sessionId, studentId);
  if (existing) return existing;
  const now = Date.now();
  localStorage.setItem(`cbt_start_${sessionId}_${studentId}`, String(now));
  return now;
}

export function toggleFixPackItem(packId: string, itemId: string): void {
  const packs = getFixPacks();
  const pack  = packs.find(p => p.id === packId);
  if (!pack) return;
  const item  = pack.items.find(i => i.id === itemId);
  if (item) item.completed = !item.completed;
  localStorage.setItem(FP_KEY, JSON.stringify(packs));
}
