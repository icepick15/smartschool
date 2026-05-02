export const SCHOOL_NAME = "Sunshine Academy";
export const SCHOOL_LOCATION = "Lagos";
export const CURRENT_TERM: 1 | 2 | 3 = 2;
export const CURRENT_SESSION = "2025/2026";

export const GRADE_THRESHOLDS = [
  { min: 75, grade: "A" },
  { min: 60, grade: "B" },
  { min: 50, grade: "C" },
  { min: 45, grade: "D" },
  { min: 0,  grade: "F" },
] as const;

export function getGrade(score: number | null): string {
  if (score === null) return "—";
  for (const { min, grade } of GRADE_THRESHOLDS) {
    if (score >= min) return grade;
  }
  return "F";
}

export function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(1)}K`;
  return `₦${amount.toLocaleString("en-NG")}`;
}

export const ROLE_ROUTES: Record<string, string> = {
  admin:   "/admin",
  teacher: "/teacher",
  parent:  "/parent",
};
