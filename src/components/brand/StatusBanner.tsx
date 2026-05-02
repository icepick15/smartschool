interface StatusBannerProps {
  online?: boolean;
  schoolName?: string;
}

export function StatusBanner({ online = true, schoolName = "Sunshine Academy, Lagos" }: StatusBannerProps) {
  return (
    <div
      className="w-full h-8 flex items-center justify-center px-4 text-white text-[11px] font-medium shrink-0"
      style={{
        background: online ? "#10B981" : "#EF4444",
        fontFamily: "var(--font-dm-mono)",
      }}
    >
      {online
        ? `● Online — SmartSchool · ${schoolName}`
        : "⚡ You're offline — Saving locally"}
    </div>
  );
}
