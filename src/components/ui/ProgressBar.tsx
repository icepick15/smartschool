type Variant = "primary" | "success" | "warning" | "danger" | "info";
type Size = "xs" | "sm" | "md";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: Variant;
  size?: Size;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const trackColors: Record<Variant, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  info:    "bg-info",
};

const sizeStyles: Record<Size, string> = {
  xs: "h-1   rounded-full",
  sm: "h-1.5 rounded-full",
  md: "h-2.5 rounded-full",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "sm",
  label,
  showValue = false,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={["flex flex-col gap-1.5", className].join(" ")}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-ink-3 text-xs">{label}</span>}
          {showValue && (
            <span
              className="text-ink-4 text-xs"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}

      <div className={["w-full bg-border overflow-hidden", sizeStyles[size]].join(" ")}>
        <div
          className={[trackColors[variant], "h-full rounded-full"].join(" ")}
          style={{
            width: `${pct}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
