"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Wallet, MessageCircle } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FEE_RECORDS, STUDENTS } from "@/lib/mock-data";
import { formatNaira, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";
import type { FeeStatus } from "@/lib/types";

type FilterTab = "all" | FeeStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",     label: "All Students" },
  { key: "owing",   label: "Owing"        },
  { key: "partial", label: "Partial"      },
  { key: "paid",    label: "Paid"         },
];

const STATUS_CONFIG: Record<FeeStatus, { label: string; color: string; bg: string; progressVariant: "success" | "warning" | "danger" }> = {
  paid:    { label: "Paid",    color: "var(--color-success)", bg: "var(--color-success-subtle)", progressVariant: "success" },
  partial: { label: "Partial", color: "var(--color-warning)", bg: "#F59E0B18",                   progressVariant: "warning" },
  owing:   { label: "Owing",   color: "var(--color-danger)",  bg: "#EF444418",                   progressVariant: "danger"  },
};

function nudgeUrl(studentName: string, balance: number): string {
  const msg = `Dear Parent of ${studentName}, your child's school fees of ₦${balance.toLocaleString()} are outstanding. Please clear payment to unlock their academic report card. Contact us for payment options. Thank you.`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

function fmtDate(raw?: string): string {
  if (!raw) return "—";
  const d = new Date(raw);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "2-digit" });
}

export default function RevenueGatePage() {
  const [filter,  setFilter]  = useState<FilterTab>("all");
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const records = FEE_RECORDS.map((fee) => ({
    fee,
    student: STUDENTS.find((s) => s.id === fee.studentId)!,
  }));

  const counts: Record<FilterTab, number> = {
    all:     records.length,
    owing:   records.filter((r) => r.fee.status === "owing").length,
    partial: records.filter((r) => r.fee.status === "partial").length,
    paid:    records.filter((r) => r.fee.status === "paid").length,
  };

  const filtered = filter === "all" ? records : records.filter((r) => r.fee.status === filter);

  const totalExpected = FEE_RECORDS.reduce((s, f) => s + f.amount,  0);
  const totalPaid     = FEE_RECORDS.reduce((s, f) => s + f.paid,    0);
  const totalOwing    = FEE_RECORDS.reduce((s, f) => s + f.balance, 0);
  const recoveryRate  = Math.round((totalPaid / totalExpected) * 100);

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-ink-4 hover:text-ink transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
              Revenue Gate
            </h1>
            <p className="text-ink-4 text-[13px] mt-1">Fee recovery · Term {CURRENT_TERM} {CURRENT_SESSION}</p>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
          style={{ background: "var(--color-success-subtle)", color: "var(--color-success)", fontFamily: "var(--font-dm-mono)" }}
        >
          {recoveryRate}% RECOVERED
        </div>
      </div>

      {/* ─── KPI Stats ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Expected",   value: formatNaira(totalExpected), icon: <Wallet size={16} />,        color: "var(--color-secondary)" },
          { label: "Collected",        value: formatNaira(totalPaid),     icon: <CheckCircle size={16} />,   color: "var(--color-success)"   },
          { label: "Outstanding",      value: formatNaira(totalOwing),    icon: <AlertTriangle size={16} />, color: "var(--color-danger)"    },
          { label: "Students Flagged", value: `${counts.owing + counts.partial}`, icon: <Clock size={16} />, color: "var(--color-warning)"   },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-xl border border-border p-4 flex flex-col gap-3" style={{ background: "var(--color-surface)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest text-ink-4 uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {label}
              </span>
              <span style={{ color }}>{icon}</span>
            </div>
            <p className="text-ink text-[22px] font-bold leading-none" style={{ fontFamily: "var(--font-syne)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ─── Overall progress ───────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-ink-4">Fee collection progress</span>
          <span className="text-ink font-semibold" style={{ fontFamily: "var(--font-dm-mono)" }}>
            {formatNaira(totalPaid)} of {formatNaira(totalExpected)}
          </span>
        </div>
        <ProgressBar value={totalPaid} max={totalExpected} variant={recoveryRate >= 80 ? "success" : recoveryRate >= 60 ? "warning" : "danger"} size="sm" />
      </div>

      {/* ─── Filter tabs ────────────────────────────── */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: filter === tab.key ? "var(--color-primary)" : "transparent",
              color:      filter === tab.key ? "#fff" : "var(--color-ink-4)",
            }}
          >
            {tab.label} <span className="opacity-60">({counts[tab.key]})</span>
          </button>
        ))}
      </div>

      {/* ─── Fee Ledger Table ───────────────────────── */}
      <div className="rounded-xl border border-border overflow-hidden" style={{ background: "var(--color-surface)" }}>

        {/* Column headers */}
        <div
          className="grid items-center gap-4 px-5 py-3 border-b border-border"
          style={{
            gridTemplateColumns: "1fr 130px 130px 110px 160px",
            background: "var(--color-elevated)",
          }}
        >
          {["Name", "Class", "Owing", "Last Paid", "Action"].map((h, i) => (
            <span
              key={h}
              className={`text-[10px] font-semibold tracking-widest text-ink-4 uppercase ${i >= 2 ? "text-right" : ""}`}
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 && (
          <p className="text-ink-4 text-[13px] text-center py-10">No students match this filter.</p>
        )}
        {filtered.map(({ fee, student }) => {
          const cfg     = STATUS_CONFIG[fee.status];
          const sent    = sentIds.has(student.id);
          const hasDebt = fee.balance > 0;

          return (
            <div
              key={student.id}
              className="grid items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-elevated/50 transition-colors"
              style={{ gridTemplateColumns: "1fr 130px 130px 110px 160px" }}
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{
                    background: hasDebt ? "#EF444418" : "var(--color-primary-badge)",
                    color:      hasDebt ? "var(--color-danger)"       : "var(--color-primary)",
                    fontFamily: "var(--font-dm-mono)",
                  }}
                >
                  {student.avatarInitials}
                </div>
                <span className="text-ink text-[13px] font-semibold truncate">{student.name}</span>
              </div>

              {/* Class */}
              <span className="text-ink-4 text-[12px]">{student.class}</span>

              {/* Owing */}
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-[13px] font-bold"
                  style={{ color: hasDebt ? "var(--color-danger)" : "var(--color-success)", fontFamily: "var(--font-dm-mono)" }}
                >
                  {hasDebt ? formatNaira(fee.balance) : "Cleared"}
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: cfg.bg, color: cfg.color, fontFamily: "var(--font-dm-mono)" }}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Last Paid */}
              <span
                className="text-[12px] text-right"
                style={{ color: "var(--color-ink-4)", fontFamily: "var(--font-dm-mono)" }}
              >
                {fmtDate(fee.lastPaymentDate)}
              </span>

              {/* Action */}
              <div className="flex justify-end">
                {fee.status === "paid" ? (
                  <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "var(--color-success)" }}>
                    <CheckCircle size={13} />
                    All clear
                  </span>
                ) : sent ? (
                  <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "#25D366" }}>
                    <CheckCircle size={13} />
                    Sent
                  </span>
                ) : (
                  <a
                    href={nudgeUrl(student.name, fee.balance)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSentIds(prev => new Set(prev).add(student.id))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "#EF4444", fontFamily: "var(--font-dm-sans)" }}
                  >
                    <MessageCircle size={12} />
                    WhatsApp Nudge
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
