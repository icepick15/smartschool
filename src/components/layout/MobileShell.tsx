import { BottomNav } from "./BottomNav";

interface MobileShellProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
}

export function MobileShell({ children, hideBottomNav = false }: MobileShellProps) {
  return (
    <div className="min-h-screen bg-base flex items-start justify-center">
      {/* Phone frame — centered on desktop, full-bleed on mobile */}
      <div
        className="relative w-full max-w-[430px] min-h-screen flex flex-col"
        style={{ background: "var(--color-base)" }}
      >
        <div className="flex-1 overflow-y-auto pb-[64px]">{children}</div>
        {!hideBottomNav && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}
