type Variant = "primary" | "success" | "warning" | "danger";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: Variant;
  label?: string;
  sublabel?: string;
}

const strokeColors: Record<Variant, string> = {
  primary: "#7C3AED",
  success: "#10B981",
  warning: "#F59E0B",
  danger:  "#EF4444",
};

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  variant = "primary",
  label,
  sublabel,
}: CircularProgressProps) {
  const pct      = Math.min(Math.max(value / max, 0), 1);
  const radius   = (size - strokeWidth) / 2;
  const circumf  = 2 * Math.PI * radius;
  const offset   = circumf * (1 - pct);
  const center   = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#2A2A3A"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={strokeColors[variant]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumf}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {label && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-ink font-bold leading-none"
              style={{
                fontSize: size * 0.2,
                fontFamily: "var(--font-syne)",
              }}
            >
              {label}
            </span>
            {sublabel && (
              <span
                className="text-ink-4 leading-none mt-0.5"
                style={{
                  fontSize: size * 0.13,
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                {sublabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
