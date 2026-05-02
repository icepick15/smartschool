import { SmartSchoolMark } from "./SmartSchoolMark";

interface Props {
  size?: number;
  color?: string;
  accent?: string;
  accent2?: string;
}

export function SmartSchoolWordmark({
  size = 20,
  color = "var(--color-ink)",
  accent = "#7C3AED",
  accent2 = "#6366F1",
}: Props) {
  return (
    <div className="flex items-center" style={{ gap: size * 0.3 }}>
      <SmartSchoolMark size={size * 1.1} c1={accent} c2={accent2} />
      <span
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: size,
          color,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        SmartSchool
      </span>
    </div>
  );
}
