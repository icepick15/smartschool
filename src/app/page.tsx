"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Zap, BrainCircuit, ChevronDown, ChevronRight,
  BarChart2, BookOpen, CreditCard, Bell, TrendingUp, Menu, X,
} from "lucide-react";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";
import { SmartSchoolWordmark } from "@/components/brand/SmartSchoolWordmark";
import { ROLE_ROUTES } from "@/lib/constants";

/* ─── Shared tokens ──────────────────────────────────── */

const P  = "#7C3AED";
const P2 = "#6366F1";
const G  = "#10B981";

/* ─── Nav ────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features",    href: "#features"   },
    { label: "How It Works", href: "#how"       },
    { label: "Pricing",     href: "#pricing"    },
    { label: "FAQ",         href: "#faq"        },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:  scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <SmartSchoolMark size={28} />
          <SmartSchoolWordmark size={13} color="#F8F8FC" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] transition-colors"
              style={{ color: "rgba(248,248,252,0.6)", fontFamily: "var(--font-dm-sans)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F8F8FC")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,248,252,0.6)")}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] px-4 py-2 rounded-xl"
            style={{ color: "rgba(248,248,252,0.7)", fontFamily: "var(--font-dm-sans)" }}
          >
            Sign In
          </Link>
          <a
            href="#pricing"
            className="text-[13px] font-bold px-4 py-2 rounded-xl"
            style={{ background: P, color: "white", fontFamily: "var(--font-dm-sans)" }}
          >
            Get Started
          </a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setOpen(o => !o)} style={{ color: "#F8F8FC" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: "rgba(10,10,15,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[14px]"
              style={{ color: "rgba(248,248,252,0.7)", fontFamily: "var(--font-dm-sans)" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={() => setOpen(false)}
            className="text-[14px] font-bold px-4 py-3 rounded-xl text-center"
            style={{ background: P, color: "white" }}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────── */

function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 90% 60% at 50% -10%, #2D1363 0%, transparent 70%),
                     linear-gradient(180deg, #0D0A1E 0%, #0A0A0F 40%)`,
      }}
    >
      {/* Ambient grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          background: `radial-gradient(circle, ${P}22 0%, transparent 70%)`,
          top: "10%", left: "50%", transform: "translateX(-50%)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-[1fr_440px] gap-12 items-center">

          {/* Left: copy */}
          <div className="flex flex-col gap-7">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-start text-[11px] font-bold"
              style={{ background: `${P}18`, border: `1px solid ${P}40`, color: "#C4B5FD", fontFamily: "var(--font-dm-mono)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
              NOW IN EARLY ACCESS · NIGERIAN SCHOOLS
            </div>

            <h1
              className="text-[52px] md:text-[64px] font-extrabold leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              <span style={{ color: "#F8F8FC" }}>The Operating</span>
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, #C4B5FD 10%, ${P} 50%, ${P2} 90%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                System for
              </span>
              <br />
              <span style={{ color: "#F8F8FC" }}>Nigerian Schools</span>
            </h1>

            <p
              className="text-[17px] leading-relaxed max-w-[520px]"
              style={{ color: "rgba(248,248,252,0.6)", fontFamily: "var(--font-dm-sans)" }}
            >
              Run CBTs, track WAEC readiness, manage fees, and keep parents in the
              loop — all from one dashboard built for how Nigerian schools actually work.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#pricing"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-[15px] text-white"
                style={{ background: `linear-gradient(135deg, ${P} 0%, ${P2} 100%)`, boxShadow: `0 0 32px ${P}50` }}
              >
                <Zap size={16} /> Get Started Free
              </a>
              <a
                href="#how"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-medium text-[15px]"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(248,248,252,0.8)", background: "rgba(255,255,255,0.04)" }}
              >
                See How It Works <ChevronRight size={15} />
              </a>
            </div>

            {/* Social proof inline */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex -space-x-2">
                {["AO", "CN", "FB", "KA"].map((i, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                    style={{ background: `hsl(${260 + idx * 20},60%,35%)`, borderColor: "#0A0A0F", color: "white", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-[12px]" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-sans)" }}>
                Pilot schools reporting <span style={{ color: G, fontWeight: 700 }}>23% WAEC improvement</span>
              </p>
            </div>
          </div>

          {/* Right: floating UI preview */}
          <div className="hidden lg:block relative h-[520px]">

            {/* Fix Pack card */}
            <div
              className="absolute top-0 right-0 w-[280px] rounded-2xl border p-4 flex flex-col gap-3"
              style={{ background: "rgba(17,17,24,0.95)", borderColor: "rgba(124,58,237,0.4)", backdropFilter: "blur(16px)", boxShadow: `0 0 40px ${P}30` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#EF4444" }} />
                  <span className="text-[10px] font-bold" style={{ color: "#EF4444", fontFamily: "var(--font-dm-mono)" }}>RISK DETECTED</span>
                </div>
                <span className="text-[10px]" style={{ color: "rgba(248,248,252,0.3)", fontFamily: "var(--font-dm-mono)" }}>4:00 PM</span>
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>Algebra Fix Pack</p>
                <p className="text-[11px]" style={{ color: "rgba(248,248,252,0.5)" }}>Variable Substitution · 32% mastery</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full w-[32%]" style={{ background: "#EF4444" }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: "#EF4444", fontFamily: "var(--font-dm-mono)" }}>32%</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(248,248,252,0.5)" }}>
                <Zap size={11} style={{ color: G }} />
                6 min · Visual Guide · +4 WAEC pts
              </div>
              <div
                className="w-full py-2 rounded-xl text-center text-[12px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${P}, ${P2})` }}
              >
                Start Fix Pack
              </div>
            </div>

            {/* WAEC Meter card */}
            <div
              className="absolute top-[200px] left-[-20px] w-[220px] rounded-2xl border p-4 flex flex-col gap-3"
              style={{ background: "rgba(17,17,24,0.95)", borderColor: "rgba(16,185,129,0.3)", backdropFilter: "blur(16px)", boxShadow: `0 0 30px ${G}20` }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={13} style={{ color: G }} />
                <span className="text-[10px] font-bold" style={{ color: G, fontFamily: "var(--font-dm-mono)" }}>WAEC READINESS</span>
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <span className="text-[36px] font-extrabold leading-none" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>74</span>
                  <span className="text-[14px]" style={{ color: "rgba(248,248,252,0.4)" }}>/100</span>
                </div>
                <div className="pb-1">
                  <span className="text-[11px] font-bold" style={{ color: G, fontFamily: "var(--font-dm-mono)" }}>↑16 pts</span>
                  <p className="text-[9px]" style={{ color: "rgba(248,248,252,0.3)", fontFamily: "var(--font-dm-mono)" }}>vs last month</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full w-[74%] transition-all" style={{ background: G }} />
              </div>
              <p className="text-[10px]" style={{ color: "rgba(248,248,252,0.4)" }}>Fix 3 more topics → reach 85</p>
            </div>

            {/* Parent notification */}
            <div
              className="absolute bottom-[40px] right-[20px] w-[250px] rounded-2xl border p-3.5 flex items-start gap-3"
              style={{ background: "rgba(17,17,24,0.95)", borderColor: "rgba(99,102,241,0.3)", backdropFilter: "blur(16px)" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[14px]"
                style={{ background: "rgba(99,102,241,0.2)" }}
              >
                💬
              </div>
              <div>
                <p className="text-[11px] font-bold" style={{ color: "#F8F8FC" }}>Parent Alert Sent</p>
                <p className="text-[10px]" style={{ color: "rgba(248,248,252,0.5)" }}>
                  &quot;Amara mastered Quadratic Equations — WAEC +6 pts&quot;
                </p>
              </div>
            </div>

            {/* Heatmap mini */}
            <div
              className="absolute top-[90px] left-[30px] rounded-2xl border p-3 flex flex-col gap-2"
              style={{ background: "rgba(17,17,24,0.95)", borderColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}
            >
              <p className="text-[9px] font-bold" style={{ color: "rgba(248,248,252,0.3)", fontFamily: "var(--font-dm-mono)" }}>CLASS HEATMAP · MATHS</p>
              <div className="flex gap-1">
                {[
                  { label: "Frac", status: "green" },
                  { label: "Quad", status: "red"   },
                  { label: "Geom", status: "amber" },
                ].map(({ label, status }) => {
                  const col = status === "green" ? G : status === "red" ? "#EF4444" : "#F59E0B";
                  return (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-6 rounded" style={{ background: `${col}30`, border: `1px solid ${col}50` }}>
                        <div className="h-full rounded" style={{ background: col, opacity: 0.4, width: status === "green" ? "85%" : status === "red" ? "32%" : "60%" }} />
                      </div>
                      <span className="text-[8px]" style={{ color: col, fontFamily: "var(--font-dm-mono)" }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex justify-center mt-16">
          <a href="#stats" className="flex flex-col items-center gap-1 animate-bounce" style={{ color: "rgba(248,248,252,0.2)" }}>
            <ChevronDown size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Bar ──────────────────────────────────────── */

function StatsBar() {
  const stats = [
    { value: "₦2.4B+",   label: "Projected annual revenue per 100 schools" },
    { value: "86%",       label: "Fix Pack completion rate in pilot schools" },
    { value: "+23%",      label: "Average WAEC readiness improvement" },
    { value: "48 hrs",    label: "Average school setup time" },
  ];

  return (
    <section
      id="stats"
      className="py-10 border-y"
      style={{ background: "rgba(17,17,24,0.8)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-1 text-center">
            <span
              className="text-[28px] font-extrabold"
              style={{
                background: `linear-gradient(135deg, #C4B5FD, ${P})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontFamily: "var(--font-syne)",
              }}
            >
              {value}
            </span>
            <span className="text-[11px]" style={{ color: "rgba(248,248,252,0.45)", fontFamily: "var(--font-dm-sans)" }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Features Bento ─────────────────────────────────── */

const FEATURES = [
  {
    icon:  Zap,
    title: "AI Fix Packs",
    sub:   "When a student fails, the AI doesn't just flag it — it builds a personalized 6-minute learning sprint. Visual learner? Gets diagrams. Kinesthetic? Gets puzzles. Delivered at their brain's peak hour.",
    badge: "BIGGEST DIFFERENTIATOR",
    large: true,
    col:   P,
    extra: (
      <div className="flex flex-col gap-2 mt-3">
        {["32% mastery → 6-min Fix Pack → 78% mastery", "Visual learner detected → infographic lesson", "Peak hour 4PM → delivered at 4PM sharp"].map(t => (
          <div key={t} className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(248,248,252,0.55)" }}>
            <CheckCircle size={11} style={{ color: G, flexShrink: 0 }} />
            {t}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:  BookOpen,
    title: "Computer-Based Testing",
    sub:   "Publish a 30-question test in 60 seconds. Set difficulty ratios, topic scope, timer, and score release. Students join with a code — no accounts needed.",
    col:   P2,
  },
  {
    icon:  BarChart2,
    title: "Academic Heatmap",
    sub:   "Every topic, every student — colour-coded RED, AMBER, GREEN. Spot class-wide weaknesses before exams hit.",
    col:   "#06B6D4",
  },
  {
    icon:  TrendingUp,
    title: "WAEC Readiness Meter",
    sub:   "Live projected WAEC score per student. Updates after every test. Shows exactly which topics to fix for the biggest score jump.",
    col:   G,
  },
  {
    icon:  Bell,
    title: "Parent Portal",
    sub:   "Parents see grades, receive Fix Pack completion alerts via WhatsApp, and track WAEC progress — all without installing an app.",
    col:   "#F59E0B",
  },
  {
    icon:  CreditCard,
    title: "Fee Management",
    sub:   "Track what's owed, what's paid, and who's overdue. Send one-click payment reminders. No more end-of-term chaos.",
    col:   "#EF4444",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24" style={{ background: "var(--color-base)" }}>
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3 max-w-[620px] mx-auto">
          <p className="text-[11px] font-bold tracking-widest" style={{ color: P, fontFamily: "var(--font-dm-mono)" }}>FEATURES</p>
          <h2 className="text-[40px] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>
            Everything your school needs. Nothing it doesn&apos;t.
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-sans)" }}>
            Four portals — Admin, Teacher, Parent, Student — unified in one platform built for Nigerian curriculum and context.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ gridAutoRows: "auto" }}>
          {FEATURES.map(({ icon: Icon, title, sub, badge, large, col, extra }, idx) => (
            <div
              key={title}
              className={`rounded-2xl border p-6 flex flex-col gap-3 group transition-all duration-300 ${
                idx === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
              style={{
                background:  "rgba(17,17,24,0.6)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${col}50`;
                (e.currentTarget as HTMLElement).style.background = `${col}06`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background = "rgba(17,17,24,0.6)";
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${col}18` }}
                >
                  <Icon size={18} style={{ color: col }} />
                </div>
                {badge && (
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${col}20`, color: col, fontFamily: "var(--font-dm-mono)" }}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3
                  className={`font-bold leading-tight ${large ? "text-[22px]" : "text-[16px]"}`}
                  style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}
                >
                  {title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-sans)" }}>
                  {sub}
                </p>
              </div>
              {extra}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AI Spotlight ───────────────────────────────────── */

function AISection() {
  const steps = [
    { n: "01", label: "Score Entry",    desc: "Student scores 4/20 on Algebra CBT" },
    { n: "02", label: "Heatmap Update", desc: "Variable Substitution → 32% RED" },
    { n: "03", label: "AI Diagnosis",   desc: "Brain Map + Heatmap → root cause" },
    { n: "04", label: "Fix Pack",       desc: "6-min lesson · right style · right time" },
    { n: "05", label: "Validated",      desc: "Challenge passed → GREEN → WAEC +4 pts" },
  ];

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0A0A0F 0%, #0E0820 50%, #0A0A0F 100%)`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${P}12 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 flex flex-col gap-14">
        <div className="text-center flex flex-col gap-3 max-w-[700px] mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-center text-[11px] font-bold"
            style={{ background: `${P}18`, border: `1px solid ${P}30`, color: "#C4B5FD", fontFamily: "var(--font-dm-mono)" }}
          >
            <BrainCircuit size={12} /> COGNITIVE ENGINE
          </div>
          <h2 className="text-[40px] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>
            The only school software that{" "}
            <span
              style={{
                background: `linear-gradient(135deg, #C4B5FD, ${P})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              learns your students
            </span>
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-sans)" }}>
            While other platforms give students more homework, SmartSchool builds a
            Brain Map for each learner — tracking their learning style, peak focus
            hours, and attention span — then delivers targeted lessons at exactly
            the right moment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "🗺️", title: "Sub-Subject Heatmap",  desc: "Not just 'weak in Maths' — we know it's Variable Substitution at 32% mastery that's dragging the WAEC score down by 8 points." },
            { icon: "🧠", title: "Brain Map",            desc: "Every student has a learning fingerprint: Visual, Auditory, or Kinesthetic. We track peak hours and optimal session length per student." },
            { icon: "📈", title: "WAEC Readiness Meter", desc: "A live projection of each student's WAEC score — and exactly which Fix Packs will move the needle the most. Shared with parents." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ background: "rgba(20,14,40,0.7)", borderColor: "rgba(124,58,237,0.2)" }}
            >
              <div className="text-2xl">{icon}</div>
              <h3 className="text-[15px] font-bold" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>{title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-sans)" }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-center text-[11px] font-bold tracking-widest" style={{ color: "rgba(248,248,252,0.3)", fontFamily: "var(--font-dm-mono)" }}>
            THE FLOW · FROM FAIL TO MASTERY
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-center">
            {steps.map(({ n, label, desc }, i) => (
              <div key={n} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 min-w-0">
                <div className="flex md:flex-col items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[11px] font-extrabold"
                    style={{ background: `${P}25`, color: "#C4B5FD", border: `1px solid ${P}40`, fontFamily: "var(--font-dm-mono)" }}
                  >
                    {n}
                  </div>
                  <div className="md:text-center min-w-0">
                    <p className="text-[12px] font-bold" style={{ color: "#F8F8FC" }}>{label}</p>
                    <p className="text-[11px]" style={{ color: "rgba(248,248,252,0.4)" }}>{desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight size={16} className="shrink-0 hidden md:block" style={{ color: "rgba(124,58,237,0.4)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "1",
      icon:  BookOpen,
      col:   P,
      title: "Teacher publishes a CBT in 60 seconds",
      desc:  "Set subject, topic scope, difficulty split (Easy / Medium / Hard), timer, and whether scores release immediately or after admin review. Students join with a 6-character code — no accounts, no downloads.",
    },
    {
      n: "2",
      icon:  BrainCircuit,
      col:   P2,
      title: "AI maps every student's exact weakness",
      desc:  "SmartSchool analyses every answer, updates topic mastery using exponential moving average, detects foundational gaps, and generates personalised Fix Packs for each student's RED topics — all within seconds of submission.",
    },
    {
      n: "3",
      icon:  TrendingUp,
      col:   G,
      title: "Students master topics. WAEC scores rise. Parents know.",
      desc:  "Fix Packs are delivered at the student's cognitive peak time. Complete the 6-minute sprint → pass the challenge → heatmap turns GREEN → WAEC meter ticks up → parent gets a real-time alert. All automated.",
    },
  ];

  return (
    <section id="how" className="py-24" style={{ background: "var(--color-base)" }}>
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-14">
        <div className="text-center flex flex-col gap-3 max-w-[560px] mx-auto">
          <p className="text-[11px] font-bold tracking-widest" style={{ color: P, fontFamily: "var(--font-dm-mono)" }}>HOW IT WORKS</p>
          <h2 className="text-[40px] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>
            Simple for teachers. Powerful for students.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ n, icon: Icon, col, title, desc }) => (
            <div
              key={n}
              className="rounded-2xl border p-6 flex flex-col gap-4"
              style={{ background: "rgba(17,17,24,0.5)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${col}18` }}>
                  <Icon size={18} style={{ color: col }} />
                </div>
                <span className="text-[40px] font-extrabold leading-none" style={{ color: `${col}18`, fontFamily: "var(--font-syne)" }}>
                  {n}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[16px] font-bold leading-snug" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-sans)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Roles ──────────────────────────────────────────── */

function RolesSection() {
  const roles = [
    {
      emoji: "🏫",
      role:  "School Admin",
      title: "Full visibility. No surprises.",
      points: [
        "See every class, every subject, every student — one dashboard",
        "Fee collection tracker with overdue alerts",
        "Teacher compliance monitoring (on-time %, periods logged)",
        "CBT score release control (hold or publish immediately)",
        "Revenue analytics and term-by-term reporting",
      ],
    },
    {
      emoji: "👩‍🏫",
      role:  "Teacher",
      title: "Less admin. More impact.",
      points: [
        "Publish CBT tests in under 60 seconds",
        "Class heatmap shows topic-level mastery at a glance",
        "Send parent diary messages from your phone",
        "Behaviour pulse — weekly student check-ins",
        "Analytics showing which students need attention now",
      ],
    },
    {
      emoji: "👨‍👩‍👧",
      role:  "Parent",
      title: "Never be the last to know.",
      points: [
        "Real-time WhatsApp alerts for grades and progress",
        "Fix Pack completion notifications with WAEC impact",
        "Fee balance and payment history at a glance",
        "Diary messages from teachers (with timestamps)",
        "WAEC readiness projection updated every test",
      ],
    },
  ];

  return (
    <section className="py-24" style={{ background: "rgba(11,11,18,0.95)" }}>
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3">
          <p className="text-[11px] font-bold tracking-widest" style={{ color: P, fontFamily: "var(--font-dm-mono)" }}>FOR EVERY ROLE</p>
          <h2 className="text-[40px] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>
            One platform. Four portals.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(({ emoji, role, title, points }) => (
            <div
              key={role}
              className="rounded-2xl border p-6 flex flex-col gap-5"
              style={{ background: "rgba(17,17,24,0.6)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex flex-col gap-2">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="text-[11px] font-bold tracking-widest" style={{ color: "rgba(248,248,252,0.4)", fontFamily: "var(--font-dm-mono)" }}>{role.toUpperCase()}</p>
                  <h3 className="text-[18px] font-bold" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>{title}</h3>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-2.5 text-[13px]" style={{ color: "rgba(248,248,252,0.6)", fontFamily: "var(--font-dm-sans)" }}>
                    <CheckCircle size={13} style={{ color: G, flexShrink: 0, marginTop: 2 }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────── */

const PLANS = [
  {
    name:     "Starter",
    price:    "₦25,000",
    period:   "/month",
    desc:     "For schools getting started with digital management.",
    students: "Up to 150 students",
    features: ["Admin + Teacher portals", "CBT engine (unlimited tests)", "Gradebook + results", "Fee management & tracking", "Parent diary messages", "Email support"],
    cta:      "Start 30-Day Trial",
    popular:  false,
  },
  {
    name:     "School",
    price:    "₦55,000",
    period:   "/month",
    desc:     "Full cognitive engine. For schools serious about results.",
    students: "Up to 600 students",
    features: ["Everything in Starter", "AI Fix Packs (unlimited)", "WAEC Readiness Meter", "Academic Heatmap per student", "Brain Map personalisation", "Parent WhatsApp alerts", "Priority support"],
    cta:      "Start 30-Day Trial",
    popular:  true,
  },
  {
    name:     "District",
    price:    "Custom",
    period:   "",
    desc:     "Multiple schools, centralised reporting, volume pricing.",
    students: "Unlimited students",
    features: ["Everything in School", "Multi-school dashboard", "Centralised analytics", "Custom onboarding", "Dedicated success manager", "SLA guarantee"],
    cta:      "Talk to Sales",
    popular:  false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="py-24" style={{ background: "var(--color-base)" }}>
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3 max-w-[560px] mx-auto">
          <p className="text-[11px] font-bold tracking-widest" style={{ color: P, fontFamily: "var(--font-dm-mono)" }}>PRICING</p>
          <h2 className="text-[40px] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>
            Transparent pricing. No hidden fees.
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-sans)" }}>
            30-day free trial on all plans. No credit card required. Cancel any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(({ name, price, period, desc, students, features, cta, popular }) => (
            <div
              key={name}
              className="rounded-2xl border p-6 flex flex-col gap-5 relative"
              style={{
                background:  popular ? `linear-gradient(160deg, ${P}18 0%, rgba(17,17,24,0.9) 100%)` : "rgba(17,17,24,0.6)",
                borderColor: popular ? P : "rgba(255,255,255,0.06)",
                boxShadow:   popular ? `0 0 40px ${P}20` : "none",
              }}
            >
              {popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${P}, ${P2})` }}
                >
                  MOST POPULAR
                </div>
              )}
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-bold" style={{ color: "rgba(248,248,252,0.5)", fontFamily: "var(--font-dm-mono)" }}>{name.toUpperCase()}</p>
                <div className="flex items-end gap-1">
                  <span className="text-[36px] font-extrabold" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)", lineHeight: 1 }}>{price}</span>
                  <span className="text-[14px] pb-1" style={{ color: "rgba(248,248,252,0.4)" }}>{period}</span>
                </div>
                <p className="text-[12px]" style={{ color: "rgba(248,248,252,0.4)" }}>{students}</p>
                <p className="text-[13px] mt-1" style={{ color: "rgba(248,248,252,0.55)", fontFamily: "var(--font-dm-sans)" }}>{desc}</p>
              </div>
              <ul className="flex flex-col gap-2.5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(248,248,252,0.65)", fontFamily: "var(--font-dm-sans)" }}>
                    <CheckCircle size={12} style={{ color: G, flexShrink: 0, marginTop: 2 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="w-full py-3 rounded-xl text-center text-[14px] font-bold transition-all"
                style={{
                  background:  popular ? `linear-gradient(135deg, ${P}, ${P2})` : "rgba(255,255,255,0.06)",
                  color:       "white",
                  border:      popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────── */

const FAQS = [
  { q: "How long does setup take?",                  a: "48 hours on average. We import your student register, configure subjects, and have you live. Your first CBT can go out on Day 1." },
  { q: "Does it work on low-end phones?",            a: "Yes. SmartSchool is optimised for 3G and low-end Android devices. The parent portal works entirely in browser — no app download required." },
  { q: "How is WAEC readiness calculated?",          a: "We use a weighted mastery model across all WAEC-aligned subjects. Each CBT updates topic mastery via exponential moving average. The meter recalculates in real time after every submission." },
  { q: "What if a student fails a Fix Pack?",        a: "A new, slightly adapted Fix Pack is automatically generated and scheduled for the next peak time. The system is fully adaptive — it doesn't give up on the student." },
  { q: "Can parents pay fees through the platform?", a: "Fee tracking and payment reminders are live. Integrated online payment (Paystack/Flutterwave) is coming in Q3 2026. Admins can log payments manually in the meantime." },
  { q: "Is there a free trial?",                     a: "Yes. Full 30-day access on any plan. No credit card required. If you don't love it after 30 days, we'll help you export all your data — no questions." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24" style={{ background: "rgba(11,11,18,0.95)" }}>
      <div className="max-w-[800px] mx-auto px-6 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-3">
          <p className="text-[11px] font-bold tracking-widest" style={{ color: P, fontFamily: "var(--font-dm-mono)" }}>FAQ</p>
          <h2 className="text-[40px] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>
            Questions schools ask us
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={q}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: open === i ? `${P}40` : "rgba(255,255,255,0.06)", background: "rgba(17,17,24,0.6)" }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-[14px] font-semibold" style={{ color: "#F8F8FC", fontFamily: "var(--font-dm-sans)" }}>{q}</span>
                <ChevronDown
                  size={16}
                  style={{
                    color: "rgba(248,248,252,0.4)",
                    transform: open === i ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-[13px] leading-relaxed" style={{ color: "rgba(248,248,252,0.55)", fontFamily: "var(--font-dm-sans)" }}>{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────── */

function FinalCTA() {
  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${P}22 0%, transparent 70%), #0A0A0F` }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative max-w-[700px] mx-auto px-6 text-center flex flex-col items-center gap-6">
        <SmartSchoolMark size={56} />
        <h2 className="text-[48px] font-extrabold leading-tight tracking-[-0.03em]" style={{ color: "#F8F8FC", fontFamily: "var(--font-syne)" }}>
          Give your school the edge.
        </h2>
        <p className="text-[16px] leading-relaxed" style={{ color: "rgba(248,248,252,0.55)", fontFamily: "var(--font-dm-sans)" }}>
          Join schools already running smarter. Full access free for 30 days —
          no credit card, no setup fees, no catch.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-[15px] text-white"
            style={{ background: `linear-gradient(135deg, ${P} 0%, ${P2} 100%)`, boxShadow: `0 0 40px ${P}50` }}
          >
            <Zap size={16} /> Start Free Trial
          </a>
          <a
            href="mailto:hello@smartschool.ng"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-[15px]"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(248,248,252,0.8)", background: "rgba(255,255,255,0.04)" }}
          >
            Request a Demo
          </a>
        </div>
        <p className="text-[11px]" style={{ color: "rgba(248,248,252,0.3)", fontFamily: "var(--font-dm-mono)" }}>
          30-DAY FREE TRIAL · NO CREDIT CARD · CANCEL ANYTIME
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────── */

function Footer() {
  const cols = [
    { heading: "Product",   links: ["Features", "How It Works", "Pricing", "Changelog"] },
    { heading: "Company",   links: ["About", "Blog", "Careers", "Contact"] },
    { heading: "Resources", links: ["Documentation", "Support", "Privacy Policy", "Terms of Service"] },
  ];

  return (
    <footer className="py-16 border-t" style={{ background: "#07070C", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-[1fr_auto_auto_auto] gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <SmartSchoolMark size={28} />
            <SmartSchoolWordmark size={13} color="#F8F8FC" />
          </div>
          <p className="text-[13px] max-w-[240px] leading-relaxed" style={{ color: "rgba(248,248,252,0.35)", fontFamily: "var(--font-dm-sans)" }}>
            The operating system for Nigerian schools. Built to make every student
            exam-ready, every parent informed, every teacher effective.
          </p>
          <div className="flex items-center gap-3">
            {["𝕏", "LinkedIn", "YouTube"].map(s => (
              <span
                key={s}
                className="text-[12px] cursor-pointer transition-colors"
                style={{ color: "rgba(248,248,252,0.3)", fontFamily: "var(--font-dm-sans)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F8F8FC")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,248,252,0.3)")}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        {cols.map(({ heading, links }) => (
          <div key={heading} className="flex flex-col gap-3">
            <p className="text-[11px] font-bold tracking-widest" style={{ color: "rgba(248,248,252,0.25)", fontFamily: "var(--font-dm-mono)" }}>
              {heading.toUpperCase()}
            </p>
            {links.map(l => (
              <a
                key={l}
                href="#"
                className="text-[13px] transition-colors"
                style={{ color: "rgba(248,248,252,0.4)", fontFamily: "var(--font-dm-sans)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F8F8FC")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,248,252,0.4)")}
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div
        className="max-w-[1200px] mx-auto px-6 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[11px]" style={{ color: "rgba(248,248,252,0.2)", fontFamily: "var(--font-dm-mono)" }}>
          © 2026 SmartSchool by IRO. All rights reserved.
        </p>
        <p className="text-[11px]" style={{ color: "rgba(248,248,252,0.2)", fontFamily: "var(--font-dm-mono)" }}>
          Built in Lagos, Nigeria 🇳🇬
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function LandingPage() {
  const router = useRouter();

  // Logged-in users skip the landing page and go straight to their dashboard
  useEffect(() => {
    try {
      const raw = localStorage.getItem("smartschool_session");
      if (raw) {
        const { role } = JSON.parse(raw) as { role: string };
        const dest = ROLE_ROUTES[role as keyof typeof ROLE_ROUTES];
        if (dest) router.replace(dest);
      }
    } catch {}
  }, [router]);

  return (
    <main style={{ background: "#0A0A0F", color: "#F8F8FC" }}>
      <Nav />
      <Hero />
      <StatsBar />
      <FeaturesSection />
      <AISection />
      <HowItWorks />
      <RolesSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
