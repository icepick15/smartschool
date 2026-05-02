type Variant = "default" | "primary" | "success" | "warning" | "danger" | "info";
type Size = "sm" | "md";

interface BadgeProps {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, { badge: string; dot: string }> = {
  default:  { badge: "bg-elevated text-ink-3 border border-border",           dot: "bg-ink-4"    },
  primary:  { badge: "bg-primary-muted text-primary-light border border-primary/30", dot: "bg-primary-light" },
  success:  { badge: "bg-success-muted text-success border border-success/30", dot: "bg-success"  },
  warning:  { badge: "bg-warning-muted text-warning border border-warning/30", dot: "bg-warning"  },
  danger:   { badge: "bg-danger-muted text-danger border border-danger/30",    dot: "bg-danger"   },
  info:     { badge: "bg-info-muted text-info border border-info/30",          dot: "bg-info"     },
};

const sizeStyles: Record<Size, string> = {
  sm: "px-2   py-0.5 text-[10px] gap-1   rounded-md",
  md: "px-2.5 py-1   text-xs     gap-1.5 rounded-lg",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  children,
  className = "",
}: BadgeProps) {
  const { badge, dot: dotColor } = variantStyles[variant];

  return (
    <span
      className={[
        "inline-flex items-center font-medium",
        "font-mono tracking-wide",
        badge,
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ fontFamily: "var(--font-dm-mono)" }}
    >
      {dot && (
        <span
          className={["w-1.5 h-1.5 rounded-full shrink-0", dotColor].join(" ")}
        />
      )}
      {children}
    </span>
  );
}
