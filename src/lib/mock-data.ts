import type { Student, Subject, Score, FeeRecord, Transaction, KPI, Diary, FixPack, TeacherCompliance } from "./types";
import { getGrade } from "./constants";

/* ─── Students ──────────────────────────────────────── */
export const STUDENTS: Student[] = [
  { id: "s1", name: "Amara Okafor",   class: "JSS 3 Alpha", level: "JSS", avatarInitials: "AO" },
  { id: "s2", name: "Chidi Nwosu",    class: "JSS 3 Alpha", level: "JSS", avatarInitials: "CN" },
  { id: "s3", name: "Fatima Bello",   class: "JSS 3 Alpha", level: "JSS", avatarInitials: "FB" },
  { id: "s4", name: "Kolade Adeyemi", class: "JSS 3 Alpha", level: "JSS", avatarInitials: "KA" },
  { id: "s5", name: "Ngozi Eze",      class: "JSS 3 Alpha", level: "JSS", avatarInitials: "NE" },
  { id: "s6", name: "Tunde Fashola",  class: "JSS 3 Alpha", level: "JSS", avatarInitials: "TF" },
];

/* ─── Subjects ──────────────────────────────────────── */
export const SUBJECTS: Subject[] = [
  { id: "sub1", name: "Mathematics",        shortCode: "MTH" },
  { id: "sub2", name: "English Language",   shortCode: "ENG" },
  { id: "sub3", name: "Basic Science",      shortCode: "BSC" },
  { id: "sub4", name: "Social Studies",     shortCode: "SST" },
  { id: "sub5", name: "Civic Education",    shortCode: "CIV" },
  { id: "sub6", name: "Agricultural Sci.", shortCode: "AGR" },
];

/* ─── Scores ────────────────────────────────────────── */
const raw: [string, string, number | null, number | null, number | null][] = [
  ["s1", "sub1", 18, 17, 52], ["s1", "sub2", 19, 18, 55], ["s1", "sub3", 16, 15, 48],
  ["s1", "sub4", 20, 19, 58], ["s1", "sub5", 17, 16, 50], ["s1", "sub6", 15, 14, 45],
  ["s2", "sub1", 8, 7, 22], ["s2", "sub2", 16, 15, 49], ["s2", "sub3", 18, 17, 54],
  ["s2", "sub4", 15, 14, 44], ["s2", "sub5", 19, 18, 56], ["s2", "sub6", 13, 12, 38],
  ["s3", "sub1", 20, 19, 60], ["s3", "sub2", 20, 20, 58], ["s3", "sub3", 19, 18, 57],
  ["s3", "sub4", 18, 17, 53], ["s3", "sub5", 20, 19, 59], ["s3", "sub6", 17, 16, 51],
  ["s4", "sub1", 10, 9, 28],  ["s4", "sub2", 12, 11, 35], ["s4", "sub3", null, 10, 30],
  ["s4", "sub4", 11, 10, 32], ["s4", "sub5", 13, 12, 38], ["s4", "sub6", 9, 8, 25],
  ["s5", "sub1", 17, 16, 50], ["s5", "sub2", 18, 17, 53], ["s5", "sub3", 16, 15, 47],
  ["s5", "sub4", 19, 18, 55], ["s5", "sub5", 15, 14, 46], ["s5", "sub6", 16, 15, 48],
  ["s6", "sub1", 13, 12, 39], ["s6", "sub2", 14, 13, 40], ["s6", "sub3", 15, 14, 43],
  ["s6", "sub4", 12, 11, 36], ["s6", "sub5", 14, 13, 41], ["s6", "sub6", 11, 10, 32],
];

export const SCORES: Score[] = raw.map(([studentId, subjectId, ca1, ca2, exam]) => {
  const total = ca1 !== null && ca2 !== null && exam !== null ? ca1 + ca2 + exam : null;
  return { studentId, subjectId, ca1, ca2, exam, total, grade: getGrade(total) };
});

/* ─── Fee Records ───────────────────────────────────── */
export const FEE_RECORDS: FeeRecord[] = [
  { studentId: "s1", amount: 85000, paid: 85000, balance: 0,     status: "paid",    lastPaymentDate: "2026-01-15" },
  { studentId: "s2", amount: 85000, paid: 50000, balance: 35000, status: "partial", lastPaymentDate: "2026-02-01" },
  { studentId: "s3", amount: 85000, paid: 85000, balance: 0,     status: "paid",    lastPaymentDate: "2026-01-10" },
  { studentId: "s4", amount: 85000, paid: 0,     balance: 85000, status: "owing" },
  { studentId: "s5", amount: 85000, paid: 85000, balance: 0,     status: "paid",    lastPaymentDate: "2026-01-20" },
  { studentId: "s6", amount: 85000, paid: 30000, balance: 55000, status: "partial", lastPaymentDate: "2026-01-28" },
];

/* ─── Transactions ──────────────────────────────────── */
export const TRANSACTIONS: Transaction[] = [
  { id: "t1", description: "Term 2 school fees — JSS 3",   amount: 255000, type: "income",  category: "Fees",       date: "2026-01-15" },
  { id: "t2", description: "Staff salaries — January",     amount: 180000, type: "expense", category: "Payroll",    date: "2026-01-31" },
  { id: "t3", description: "Generator diesel refill",      amount: 45000,  type: "expense", category: "Utilities",  date: "2026-02-03" },
  { id: "t4", description: "Term 2 fees — Primary 5",      amount: 170000, type: "income",  category: "Fees",       date: "2026-02-05" },
  { id: "t5", description: "Textbooks & stationery",       amount: 62000,  type: "expense", category: "Supplies",   date: "2026-02-10" },
  { id: "t6", description: "UBEC grant disbursement",      amount: 500000, type: "income",  category: "Grant",      date: "2026-02-14" },
];

/* ─── Diaries ───────────────────────────────────────── */
export const DIARIES: Diary[] = [
  {
    id: "d1",
    studentId: "s2",
    teacherName: "Mrs Adeleke",
    subject: "Mathematics",
    message: "Chidi was attentive in class today. We covered fractions — he participated well but needs more practice at home. I've sent exercises in his notebook.",
    date: "2026-05-06",
    time: "2:45pm",
  },
  {
    id: "d2",
    studentId: "s1",
    teacherName: "Mrs Adeleke",
    subject: "English Language",
    message: "Amara submitted an excellent essay today. Her vocabulary and structure are improving each week. Keep encouraging her reading habit.",
    date: "2026-05-05",
    time: "1:30pm",
  },
];

/* ─── Teacher Profile ──────────────────────────────── */
export const TEACHER_PROFILE = {
  name:           "Mr. Adeleke",
  subRole:        "subject_teacher" as "class_teacher" | "subject_teacher",
  assignedClass:  "JSS 3 Alpha",
  mySubjectIds:   ["sub1", "sub2", "sub3"], // Mathematics, English Language, Basic Science
};

/* ─── Today's Timetable (admin-set) ─────────────────── */
export type TimetableSlot = { period: number; time: string; subjectId: string; class: string };
export const TODAY_TIMETABLE: TimetableSlot[] = [
  { period: 1, time: "8:00–8:45",   subjectId: "sub1", class: "JSS 3 Alpha" },
  { period: 2, time: "9:00–9:45",   subjectId: "sub3", class: "JSS 3 Alpha" },
  { period: 3, time: "10:00–10:45", subjectId: "sub2", class: "JSS 3 Alpha" },
];

/* ─── Admin KPIs ────────────────────────────────────── */
export const ADMIN_KPIS: KPI[] = [
  { label: "Cash at Bank",      value: "₦24.3M",  subValue: "+₦1.2M this week", trend: "up",   trendPercent: 5 },
  { label: "Outstanding Fees",  value: "₦12.45M", subValue: "312 students",     trend: "down",  trendPercent: 8 },
  { label: "Total Students",    value: "1,248",   subValue: "Enrolled term 2",  trend: "flat" },
  { label: "Fee Recovery Rate", value: "78%",     subValue: "Target: 90%",      trend: "up",   trendPercent: 3 },
];

/* ─── Teacher Compliance (seeded) ──────────────────── */
export const TEACHER_COMPLIANCE: TeacherCompliance[] = [
  { id: "tc1", name: "Mrs. Adeleke",  onTimePercent: 94, periodsLogged: 47, periodsExpected: 50, streakDays: 14, phone: "08012345678" },
  { id: "tc2", name: "Mr. Okonkwo",   onTimePercent: 78, periodsLogged: 39, periodsExpected: 50, streakDays: 5,  phone: "08023456789" },
  { id: "tc3", name: "Mrs. Fashola",  onTimePercent: 55, periodsLogged: 28, periodsExpected: 50, streakDays: 2,  phone: "08034567890" },
  { id: "tc4", name: "Mr. Babatunde", onTimePercent: 88, periodsLogged: 44, periodsExpected: 50, streakDays: 9,  phone: "08045678901" },
  { id: "tc5", name: "Mrs. Nwosu",    onTimePercent: 42, periodsLogged: 21, periodsExpected: 50, streakDays: 0,  phone: "08056789012" },
];

/* ─── Fix Packs (seeded) ────────────────────────────── */
export const FIX_PACKS: FixPack[] = [
  {
    id:          "fp1",
    studentId:   "s2",
    teacherName: "Mr. Adeleke",
    subject:     "Mathematics",
    title:       "Chidi Maths Fix Pack",
    items: [
      { id: "fp1-1", text: "Complete fractions worksheet pages 24–28",          completed: false },
      { id: "fp1-2", text: "Daily 20-min revision on fractions & decimals",     completed: false },
      { id: "fp1-3", text: "One-on-one session with Mr Adeleke on Thursday",    completed: false },
      { id: "fp1-4", text: "Parent to review Chidi's notes every evening",      completed: false },
      { id: "fp1-5", text: "Mini re-test on Friday — target 50+/100",           completed: false },
    ],
    createdAt: "2026-05-06",
    purchased: false,
    price:     5000,
  },
];
