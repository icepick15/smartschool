"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, Lock, CheckCircle } from "lucide-react";
import { StatusBanner } from "@/components/brand/StatusBanner";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SCHOOL_NAME, SCHOOL_LOCATION, ROLE_ROUTES } from "@/lib/constants";

type Role = "teacher" | "admin";

const ROLES: { id: Role; label: string; emoji: string; sub: string }[] = [
  { id: "teacher", label: "Teacher",    emoji: "👩‍🏫", sub: "Enter & track scores" },
  { id: "admin",   label: "MD / Bursar", emoji: "💼", sub: "Finance & oversight"  },
];

const FEATURES = [
  "Score entry, broadsheet & report cards",
  "Fee management with Revenue Gate",
  "Friday Pulse behavioural tracking",
  "Works offline — no internet required",
];

function LoginForm() {
  const router = useRouter();
  const [role,    setRole]    = useState<Role>("teacher");
  const [phone,   setPhone]   = useState("");
  const [pin,     setPin]     = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleContinue() {
    if (!phone.trim()) { setError("Enter your phone number"); return; }
    if (!pin.trim())   { setError("Enter your PIN");          return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    localStorage.setItem("smartschool_session", JSON.stringify({ role, phone }));
    setLoading(false);
    router.push(ROLE_ROUTES[role]);
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Logo — mobile only */}
      <div className="flex justify-center pt-4 md:hidden">
        <SmartSchoolWordmark size={22} />
      </div>

      {/* Heading */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h1
          className="text-ink text-[22px] font-bold"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Welcome back
        </h1>
        <p className="text-ink-4 text-[13px]">
          {SCHOOL_NAME}, {SCHOOL_LOCATION}
        </p>
      </div>

      {/* Role selector */}
      <div className="flex flex-col gap-2">
        <p
          className="text-ink-4 text-[12px] font-medium"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Sign in as
        </p>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map(({ id, label, emoji, sub }) => {
            const isSelected = role === id;
            return (
              <button
                key={id}
                onClick={() => setRole(id)}
                className="flex flex-col gap-1.5 p-[18px] rounded-xl border text-left transition-all duration-150"
                style={{
                  background: "#111118",
                  borderColor: isSelected ? "#7C3AED" : "#2A2A3A",
                  boxShadow: isSelected ? "0 0 0 1px #7C3AED" : "none",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
              >
                <span className="text-[28px] leading-none">{emoji}</span>
                <span
                  className="text-ink text-[12px] font-bold"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {label}
                </span>
                <span className="text-ink-4 text-[11px]">{sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your school phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          prefix={<Phone size={15} />}
        />
        <Input
          label="PIN / 2FA Code"
          type={showPin ? "text" : "password"}
          placeholder="● ● ● ● ● ●"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          prefix={<Lock size={15} />}
          suffix={
            <button
              type="button"
              onClick={() => setShowPin((v) => !v)}
              className="text-ink-4 hover:text-ink transition-colors"
            >
              {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={error}
        />
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleContinue}
      >
        Continue →
      </Button>

      {/* Forgot PIN */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-ink-4 text-[13px]">Forgot PIN?</p>
        <button
          className="text-[13px] font-semibold"
          style={{ color: "#A78BFA", fontFamily: "var(--font-dm-sans)" }}
        >
          WhatsApp support 💬
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col md:flex-row">

      {/* ── Left branding panel (desktop only) ── */}
      <div
        className="hidden md:flex md:w-[480px] lg:w-[540px] shrink-0 flex-col justify-between p-12 border-r border-border"
        style={{ background: "#0D0D14" }}
      >
        <SmartSchoolWordmark size={16} />

        <div className="flex flex-col gap-8">
          <SmartSchoolMark size={64} />
          <div className="flex flex-col gap-3">
            <h2
              className="text-ink text-[38px] font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Your school,<br />powered smart.
            </h2>
            <p className="text-ink-4 text-[15px] leading-relaxed max-w-[340px]">
              Scores, fees, and reports — everything your school needs in one place.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle size={15} className="text-success shrink-0" />
                <span className="text-ink-3 text-[13px]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-ink-5 text-[11px] tracking-widest"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          IRO · SmartSchool · v1.0
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col">
        <StatusBanner />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-[420px]">
            <LoginForm />
          </div>
        </div>

        {/* Offline badge — mobile only */}
        <div
          className="md:hidden flex items-center justify-center gap-1.5 py-4 text-ink-4 text-[11px]"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          🔒 Offline mode · Login works without internet
        </div>
      </div>
    </div>
  );
}
