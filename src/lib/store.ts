import type { FeeRecord, Score, Diary } from "./types";

export function seedStore(
  fees: FeeRecord[],
  scores: Score[],
  diaries: Diary[],
) {
  if (localStorage.getItem("ss_seeded")) return;
  localStorage.setItem("ss_fees",    JSON.stringify(fees));
  localStorage.setItem("ss_scores",  JSON.stringify(scores));
  localStorage.setItem("ss_diaries", JSON.stringify(diaries));
  localStorage.setItem("ss_seeded",  "1");
}

export function resetStore(
  fees: FeeRecord[],
  scores: Score[],
  diaries: Diary[],
) {
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
