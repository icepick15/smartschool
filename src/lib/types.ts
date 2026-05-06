/* ─── Roles ──────────────────────────────────────────── */
export type Role = "admin" | "teacher" | "parent";

/* ─── School Term ───────────────────────────────────── */
export type Term = 1 | 2 | 3;
export type Level = "Primary" | "JSS" | "SSS";

/* ─── User ──────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  avatarInitials: string;
}

/* ─── School ────────────────────────────────────────── */
export interface School {
  id: string;
  name: string;
  location: string;
  term: Term;
  session: string;
}

/* ─── Student ───────────────────────────────────────── */
export interface Student {
  id: string;
  name: string;
  class: string;
  level: Level;
  avatarInitials: string;
  parentId?: string;
}

/* ─── Subject & Score ───────────────────────────────── */
export interface Subject {
  id: string;
  name: string;
  shortCode: string;
}

export interface Score {
  studentId: string;
  subjectId: string;
  ca1: number | null;
  ca2: number | null;
  exam: number | null;
  total: number | null;
  grade: string | null;
}

/* ─── Finance ───────────────────────────────────────── */
export type FeeStatus = "paid" | "partial" | "owing";

export interface FeeRecord {
  studentId: string;
  amount: number;
  paid: number;
  balance: number;
  status: FeeStatus;
  lastPaymentDate?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

/* ─── KPI / Dashboard ───────────────────────────────── */
export interface KPI {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "flat";
  trendPercent?: number;
}

/* ─── Behavior / Pulse ──────────────────────────────── */
export type BehaviorRating = 1 | 2 | 3 | 4 | 5;

export interface BehaviorEntry {
  studentId: string;
  week: string;
  rating: BehaviorRating;
  note?: string;
}

/* ─── Diary ──────────────────────────────────────────── */
export interface Diary {
  id: string;
  studentId: string;
  teacherName: string;
  subject: string;
  message: string;
  date: string;
  time: string;
}
