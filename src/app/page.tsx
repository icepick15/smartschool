"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import { ROLE_ROUTES } from "@/lib/constants";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("smartschool_session");
    if (saved) {
      try {
        const { role } = JSON.parse(saved) as { role: string };
        const dest = ROLE_ROUTES[role];
        if (dest) { router.replace(dest); return; }
      } catch {}
    }
    const t = setTimeout(() => router.replace("/login"), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-screen bg-base flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7C3AED1F 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      {/* Center content */}
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <SmartSchoolMark size={80} />
        <p
          className="text-ink text-[28px] font-extrabold tracking-[-0.04em]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          SmartSchool
        </p>
        <p className="text-ink-4 text-[15px] text-center max-w-[260px]">
          Your school is smart with us.
        </p>
      </div>

      {/* Bottom wordmark */}
      <p
        className="absolute bottom-11 text-ink-5 text-[11px] tracking-widest"
        style={{ fontFamily: "var(--font-dm-mono)" }}
      >
        IRO · SmartSchool · v1.0
      </p>
    </main>
  );
}
