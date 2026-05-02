interface HeatmapCellProps {
  score: number | null;
  size?: number;
}

function cellColor(score: number | null): { bg: string; text: string } {
  if (score === null) return { bg: "#1A1A24", text: "#3D3D52" };
  if (score >= 85)    return { bg: "#10B98130", text: "#10B981" };
  if (score >= 75)    return { bg: "#6366F130", text: "#818CF8" };
  if (score >= 65)    return { bg: "#F59E0B25", text: "#FCD34D" };
  if (score >= 55)    return { bg: "#F59E0B18", text: "#F59E0B" };
  return               { bg: "#EF444420", text: "#EF4444" };
}

export function HeatmapCell({ score, size = 28 }: HeatmapCellProps) {
  const { bg, text } = cellColor(score);
  return (
    <div
      className="flex items-center justify-center rounded-[4px] font-bold"
      style={{
        width: size,
        height: size + 4,
        background: bg,
        color: text,
        fontSize: 8,
        fontFamily: "var(--font-dm-mono)",
      }}
    >
      {score ?? "—"}
    </div>
  );
}
