"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROLE_ROUTES } from "@/lib/constants";
import { getPendingAuth, setSession, clearPendingAuth } from "@/lib/session";

const DEMO_CODE = "DEMO2025";

export default function SchoolCodePage() {
  const router = useRouter();
  const [code,    setCode]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const pending = getPendingAuth();

  useEffect(() => {
    if (!pending) router.replace("/login");
  }, [pending, router]);

  async function handleSubmit() {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) { setError("Enter your school code"); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    if (trimmed !== DEMO_CODE) {
      setError("Invalid school code. Demo code: DEMO2025");
      setLoading(false);
      return;
    }

    // Create the full session
    const role = pending!.role;
    const defaultChildId = role === "parent" ? "s2" : undefined;
    setSession({
      role,
      phone:        pending!.phone,
      schoolCode:   trimmed,
      activeChildId: defaultChildId,
    });
    clearPendingAuth();
    setLoading(false);
    router.push(ROLE_ROUTES[role]);
  }

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[400px] flex flex-col gap-8">

        {/* Logo */}
        <div className="flex justify-center">
          <SmartSchoolWordmark size={18} />
        </div>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-ink-4 text-[13px] hover:text-ink transition-colors w-fit"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-ink text-[24px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
            Enter school code
          </h1>
          <p className="text-ink-4 text-[13px] leading-relaxed">
            Your school has a unique code that links you to the right account.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <Input
            label="School Code"
            type="text"
            placeholder="e.g. DEMO2025"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            prefix={<ShieldCheck size={15} />}
            error={error}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          {/* Security subtext */}
          <div
            className="flex items-start gap-2 px-3 py-3 rounded-lg text-[12px]"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <ShieldCheck size={14} className="shrink-0 mt-0.5" style={{ color: "#10B981" }} />
            <span className="text-ink-4 leading-relaxed">
              Ask your admin. This keeps Tolu&apos;s data safe.
            </span>
          </div>
        </div>

        {/* Demo hint */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px]"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <span className="text-[16px]">💡</span>
          <span className="text-ink-4">
            Demo code:{" "}
            <span className="font-bold" style={{ color: "#10B981", fontFamily: "var(--font-dm-mono)" }}>
              DEMO2025
            </span>
          </span>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handleSubmit}
          style={{ background: "#10B981", borderColor: "#10B981" }}
        >
          Secure Tolu&apos;s Data →
        </Button>
      </div>
    </div>
  );
}
