"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { Button } from "@/components/ui/Button";
import { getPendingAuth } from "@/lib/session";

const DEMO_OTP = "123456";
const RESEND_SECONDS = 30;

export default function OtpPage() {
  const router = useRouter();
  const [digits, setDigits]       = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const inputRefs                 = useRef<(HTMLInputElement | null)[]>([]);
  const pending                   = getPendingAuth();

  // Redirect if no pending auth
  useEffect(() => {
    if (!pending) router.replace("/login");
  }, [pending, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const char = value.slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    const filled = next.join("");
    if (filled.length === 6) verify(filled);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    text.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    if (text.length === 6) verify(text);
    else inputRefs.current[text.length]?.focus();
  }

  async function verify(code: string) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (code !== DEMO_OTP) {
      setError("Incorrect code. Demo OTP is 123456");
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push("/login/school");
  }

  function handleResend() {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(RESEND_SECONDS);
    setDigits(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  }

  const phone = pending?.phone ?? "";
  const masked = phone.length > 4
    ? phone.slice(0, -4).replace(/\d/g, "•") + phone.slice(-4)
    : phone;

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
          <div
            className="flex items-center gap-2 text-[13px] font-medium px-3 py-2 rounded-lg w-fit"
            style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
          >
            <MessageCircle size={14} />
            WhatsApp OTP sent to {masked}
          </div>
          <h1 className="text-ink text-[24px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
            Enter your code
          </h1>
          <p className="text-ink-4 text-[13px]">
            Type the 6-digit code sent to your WhatsApp.
          </p>
        </div>

        {/* Demo hint */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px]"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <span className="text-[16px]">💡</span>
          <span className="text-ink-4">
            Demo mode — use code{" "}
            <span className="font-bold" style={{ color: "#10B981", fontFamily: "var(--font-dm-mono)" }}>
              123456
            </span>
          </span>
        </div>

        {/* 6-box OTP input */}
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className="w-12 h-14 text-center text-ink text-[22px] font-bold rounded-xl border transition-all outline-none"
              style={{
                background:  "var(--color-surface)",
                borderColor: error ? "#EF4444" : d ? "#10B981" : "var(--color-border)",
                boxShadow:   d && !error ? "0 0 0 1px #10B981" : "none",
                fontFamily:  "var(--font-dm-mono)",
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-[13px]" style={{ color: "#EF4444" }}>{error}</p>
        )}

        {/* Verify button (fallback if auto-submit didn't fire) */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={() => verify(digits.join(""))}
          disabled={digits.join("").length < 6}
          style={{ background: "#10B981", borderColor: "#10B981" }}
        >
          Verify Code →
        </Button>

        {/* Resend */}
        <p className="text-center text-ink-4 text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
          {canResend ? (
            <button
              onClick={handleResend}
              className="font-semibold underline"
              style={{ color: "#10B981" }}
            >
              Resend code
            </button>
          ) : (
            <>Resend in <span className="font-bold text-ink">{countdown}s</span></>
          )}
        </p>
      </div>
    </div>
  );
}
