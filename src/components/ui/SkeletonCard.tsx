export function SkeletonCard({ lines = 3, height = "h-3" }: { lines?: number; height?: string }) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3 animate-pulse"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="h-4 rounded-lg w-2/5" style={{ background: "var(--color-elevated)" }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} rounded-lg`}
          style={{ background: "var(--color-elevated)", width: `${90 - i * 18}%` }}
        />
      ))}
      <div className="h-8 rounded-lg w-full mt-1" style={{ background: "var(--color-elevated)" }} />
    </div>
  );
}

export function SkeletonGrid({ cols = 3, count = 3 }: { cols?: number; count?: number }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}
