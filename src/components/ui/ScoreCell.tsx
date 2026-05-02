type CellType = "ca" | "exam" | "total" | "grade";

interface ScoreCellProps {
  value: number | string | null;
  type?: CellType;
  editable?: boolean;
  onEdit?: (value: string) => void;
}

function gradeColor(score: number | null): string {
  if (score === null) return "text-ink-5";
  if (score >= 75) return "text-success";
  if (score >= 60) return "text-info";
  if (score >= 50) return "text-warning";
  if (score >= 45) return "text-gold";
  return "text-danger";
}

function gradeBg(score: number | null): string {
  if (score === null) return "";
  if (score >= 75) return "bg-success-muted";
  if (score >= 60) return "bg-info-muted";
  if (score >= 50) return "bg-warning-muted";
  if (score >= 45) return "bg-warning-muted/50";
  return "bg-danger-muted";
}

export function ScoreCell({ value, type = "ca", editable = false, onEdit }: ScoreCellProps) {
  const numericValue = typeof value === "number" ? value : null;
  const displayValue = value === null || value === undefined ? "—" : String(value);

  if (type === "grade") {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span
          className={[
            "w-6 h-6 rounded-md flex items-center justify-center",
            "text-[10px] font-bold",
            gradeBg(null),
            displayValue === "—" ? "text-ink-5" : "text-ink",
          ].join(" ")}
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {displayValue}
        </span>
      </div>
    );
  }

  if (type === "total") {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span
          className={[
            "text-sm font-semibold tabular-nums",
            gradeColor(numericValue),
          ].join(" ")}
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {displayValue}
        </span>
      </div>
    );
  }

  /* CA / exam cells — optionally editable */
  return (
    <div className="flex items-center justify-center h-full w-full group">
      {editable ? (
        <input
          type="number"
          defaultValue={numericValue ?? ""}
          placeholder="—"
          min={0}
          max={type === "exam" ? 60 : 20}
          onChange={(e) => onEdit?.(e.target.value)}
          className={[
            "w-full h-full text-center bg-transparent outline-none",
            "text-xs tabular-nums",
            "placeholder:text-ink-5",
            numericValue !== null ? gradeColor(numericValue) : "text-ink-3",
            "focus:bg-primary-muted rounded",
          ].join(" ")}
          style={{ fontFamily: "var(--font-dm-mono)" }}
        />
      ) : (
        <span
          className={[
            "text-xs tabular-nums",
            numericValue !== null ? gradeColor(numericValue) : "text-ink-5",
          ].join(" ")}
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
}
