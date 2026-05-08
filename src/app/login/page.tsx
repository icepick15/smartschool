"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SCHOOL_NAME, SCHOOL_LOCATION } from "@/lib/constants";
import { getSession, setPendingAuth, type SessionRole } from "@/lib/session";

const ROLES: { id: SessionRole; label: string; emoji: string; sub: string }[] = [
  { id: "teacher", label: "Teacher",     emoji: "👩‍🏫", sub: "Upload marks · class diary" },
  { id: "admin",   label: "MD / Bursar", emoji: "💼",  sub: "Fee recovery · full oversight" },
  { id: "parent",  label: "Parent",      emoji: "👨‍👧", sub: "Results · fees · diary" },
];

const FEATURES = [
  { icon: "📊", title: "One-Click Report Cards",   desc: "Marks in → report cards and broadsheet out. 60 seconds." },
  { icon: "💰", title: "Pay-to-View Fee Gate",     desc: "Schools hit 92% collection. ₦10M+ recovered per term." },
  { icon: "📈", title: "Weekly Student Check-In",  desc: "Catch Tolu dropping in Maths before it's too late." },
];

function LoginForm() {
  const router = useRouter();
  const [role,    setRole]    = useState<SessionRole>("teacher");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Redirect already-authenticated users to their own portal
  useEffect(() => {
    const session = getSession();
    if (session) router.replace(`/${session.role}`);
  }, [router]);

  async function handleSendOtp() {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length < 7) { setError("Enter a valid phone number"); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setPendingAuth({ role, phone: cleaned });
    setLoading(false);
    router.push("/login/otp");
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
          Welcome to SmartSchool
        </h1>
        <p className="text-ink-4 text-[13px]">
          {SCHOOL_NAME}, {SCHOOL_LOCATION}
        </p>
      </div>

      {/* Role selector */}
      <div className="flex flex-col gap-2">
        <p className="text-ink-4 text-[12px] font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Sign in as
        </p>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map(({ id, label, emoji, sub }) => {
            const active = role === id;
            return (
              <button
                key={id}
                onClick={() => setRole(id)}
                className="flex flex-col gap-1.5 p-4 rounded-xl border text-left transition-all duration-150"
                style={{
                  background:   "var(--color-surface)",
                  borderColor:  active ? "var(--color-primary)" : "var(--color-border)",
                  boxShadow:    active ? "0 0 0 1px var(--color-primary)" : "none",
                  transform:    active ? "scale(1.02)" : "scale(1)",
                }}
              >
                <span className="text-[22px] leading-none">{emoji}</span>
                <span className="text-ink text-[11px] font-bold" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {label}
                </span>
                <span className="text-ink-4 text-[10px] leading-tight">{sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phone input */}
      <div className="flex flex-col gap-3">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+234 800 000 0000"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setError(""); }}
          prefix={<Phone size={15} />}
          error={error}
          onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
        />
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleSendOtp}
        icon={<MessageCircle size={16} />}
        style={{ background: "#10B981", borderColor: "#10B981" }}
      >
        Send WhatsApp OTP
      </Button>

      {/* Demo hint */}
      <p className="text-center text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
        Demo: any phone number works
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col md:flex-row">

      {/* Left branding panel (desktop) */}
      <div
        className="hidden md:flex md:w-[480px] lg:w-[540px] shrink-0 flex-col justify-between p-12 border-r border-border"
        style={{ background: "var(--color-sidebar)" }}
      >
        <SmartSchoolWordmark size={16} />

        <div className="flex flex-col gap-8">
          <SmartSchoolMark size={64} />
          <div className="flex flex-col gap-3">
            <h2
              className="text-ink text-[36px] font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Stop losing ₦10M<br />per term to unpaid<br />fees &amp; manual chaos.
            </h2>
            <p className="text-ink-4 text-[14px] leading-relaxed max-w-[320px]">
              Results, rankings, and fee collection — automated so your staff stops drowning in paperwork.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-[20px] leading-none mt-0.5 shrink-0">{f.icon}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-ink text-[13px] font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {f.title}
                  </span>
                  <span className="text-ink-4 text-[12px] leading-relaxed">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-ink-5 text-[11px] tracking-widest" style={{ fontFamily: "var(--font-dm-mono)" }}>
          SmartSchool · v1.0
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
