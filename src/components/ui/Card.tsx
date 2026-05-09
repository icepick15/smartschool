type Variant = "surface" | "elevated" | "overlay";
type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantStyles: Record<Variant, string> = {
  surface:  "bg-surface  border border-border shadow-sm",
  elevated: "bg-elevated border border-border shadow-md",
  overlay:  "bg-overlay  border border-border shadow-lg",
};

const paddingStyles: Record<Padding, string> = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-6",
};

export function Card({
  variant = "surface",
  padding = "md",
  hover = false,
  className = "",
  children,
  onClick,
}: CardProps) {
  const isInteractive = hover || !!onClick;

  return (
    <div
      onClick={onClick}
      className={[
        "rounded-xl",
        variantStyles[variant],
        paddingStyles[padding],
        isInteractive
          ? "transition-transform duration-150 hover:scale-[0.98] cursor-pointer active:scale-[0.97]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ boxShadow: "0 1px 3px rgba(15,17,35,0.07), 0 1px 2px rgba(15,17,35,0.04)" }}
    >
      {children}
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────── */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = "" }: CardHeaderProps) {
  return (
    <div className={["flex items-start justify-between gap-3 mb-4", className].join(" ")}>
      <div className="flex flex-col gap-0.5">
        <h3
          className="text-ink text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-ink-4 text-xs">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
