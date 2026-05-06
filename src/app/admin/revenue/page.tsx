"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Wallet } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
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
  partial: { label: "Partial", color: "var(--color-warning)", bg: "#F59E0B20",                   progressVariant: "warning" },
  owing:   { label: "Owing",   color: "var(--color-danger)",  bg: "#EF444420",                   progressVariant: "danger"  },
};

export default function RevenueGatePage() {
  const [filter, setFilter] = useState<FilterTab>("all");

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

  const totalExpected = FEE_RECORDS.reduce((s, f) => s + f.amount, 0);
  const totalPaid     = FEE_RECORDS.reduce((s, f) => s + f.paid, 0);
  const totalOwing    = FEE_RECORDS.reduce((s, f) => s + f.balance, 0);
  const recoveryRate  = Math.round((totalPaid / totalExpected) * 100);

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-ink-3 hover:text-ink transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1
              className="text-ink text-[26px] font-extrabold leading-none"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Revenue Gate
            </h1>
            <p className="text-ink-4 text-[13px] mt-1">
              Fee recovery · Term {CURRENT_TERM} {CURRENT_SESSION}
            </p>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-success text-[12px] font-semibold"
          style={{ background: "var(--color-success-subtle)", fontFamily: "var(--font-dm-mono)" }}
        >
          {recoveryRate}% RECOVERED
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Expected",   value: formatNaira(totalExpected), icon: <Wallet size={16} />,        color: "var(--color-secondary)" },
          { label: "Collected",        value: formatNaira(totalPaid),     icon: <CheckCircle size={16} />,   color: "var(--color-success)" },
          { label: "Outstanding",      value: formatNaira(totalOwing),    icon: <AlertTriangle size={16} />, color: "var(--color-danger)" },
          { label: "Students Flagged", value: `${counts.owing + counts.partial}`, icon: <Clock size={16} />, color: "var(--color-warning)" },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border p-4 flex flex-col gap-3"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-widest text-ink-4 uppercase"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {label}
              </span>
              <span style={{ color }}>{icon}</span>
            </div>
            <p
              className="text-ink text-[22px] font-bold leading-none"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--color-surface)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: filter === tab.key ? "var(--color-primary)" : "transparent",
              color: filter === tab.key ? "#fff" : "#5A5A7A",
            }}
          >
            {tab.label}{" "}
            <span className="opacity-60">({counts[tab.key]})</span>
          </button>
        ))}
      </div>

      {/* Records list */}
      <div className="flex flex-col gap-3">
        {filtered.map(({ fee, student }) => {
          const cfg = STATUS_CONFIG[fee.status];
          return (
            <div
              key={student.id}
              className="rounded-xl border border-border p-5 flex flex-col gap-4"
              style={{ background: "var(--color-surface)" }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                    style={{ background: "var(--color-primary-badge)", color: "var(--color-primary-light)", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {student.avatarInitials}
                  </div>
                  <div>
                    <p className="text-ink text-[14px] font-semibold">{student.name}</p>
                    <p className="text-ink-5 text-[12px]">{student.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color, fontFamily: "var(--font-dm-mono)" }}
                  >
                    {cfg.label}
                  </span>
                  <span
                    className="text-[16px] font-bold"
                    style={{ fontFamily: "var(--font-syne)", color: fee.balance > 0 ? "var(--color-danger)" : "var(--color-success)" }}
                  >
                    {fee.balance > 0 ? `${formatNaira(fee.balance)} due` : "Cleared"}
                  </span>
                </div>
              </div>

              {/* Fee breakdown */}
              <div className="flex flex-col gap-2">
                <div
                  className="flex justify-between text-[11px]"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  <span className="text-ink-5">
                    Paid:{" "}
                    <span className="text-success">{formatNaira(fee.paid)}</span>
                  </span>
                  <span className="text-ink-5">Term fees: {formatNaira(fee.amount)}</span>
                </div>
                <ProgressBar
                  value={fee.paid}
                  max={fee.amount}
                  variant={cfg.progressVariant}
                  size="sm"
                />
              </div>

              {/* Actions */}
              {fee.status !== "paid" && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Send Reminder</Button>
                  <Button variant="primary" size="sm">Record Payment</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
