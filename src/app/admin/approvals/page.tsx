"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Calendar, ShoppingCart, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

type ApprovalStatus = "pending" | "approved" | "rejected";
type ApprovalType   = "leave" | "purchase" | "policy";
type Priority       = "low" | "medium" | "high";
type FilterTab      = "all" | ApprovalStatus;

interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  description: string;
  detail: string;
  requester: string;
  date: string;
  priority: Priority;
  status: ApprovalStatus;
}

const REQUESTS: ApprovalRequest[] = [
  { id: "a1", type: "purchase", description: "Emergency generator repair",          detail: "Main generator requires urgent servicing — ₦38,000",       requester: "Facilities Dept",  date: "2026-05-01", priority: "high",   status: "pending"  },
  { id: "a2", type: "leave",    description: "Annual leave — 5 days",               detail: "Annual leave: May 5–9, 2026. Class covered by substitute.", requester: "Mr. Adeleke",      date: "2026-05-01", priority: "low",    status: "pending"  },
  { id: "a3", type: "purchase", description: "CCTV camera replacement",             detail: "2 cameras malfunctioning — estimated ₦55,000 for 2 units",  requester: "Security Dept",    date: "2026-04-30", priority: "medium", status: "pending"  },
  { id: "a4", type: "policy",   description: "New late fee policy proposal",         detail: "Proposes ₦500/day late fee after grace period of 14 days.", requester: "Mrs. Adeyemi",     date: "2026-04-28", priority: "medium", status: "pending"  },
  { id: "a5", type: "leave",    description: "Sick leave — 2 days",                 detail: "Medical certificate attached. Apr 29–30.",                  requester: "Mrs. Fashola",     date: "2026-04-28", priority: "low",    status: "approved" },
  { id: "a6", type: "purchase", description: "Exam question paper printing",        detail: "Term 2 final exams — 1,248 booklets × 2 sets",             requester: "Exams Dept",       date: "2026-04-25", priority: "high",   status: "approved" },
  { id: "a7", type: "policy",   description: "Parent portal access expansion",      detail: "Proposal to enable parents to view live attendance data.",  requester: "ICT Dept",         date: "2026-04-20", priority: "low",    status: "rejected" },
];

const STORAGE_KEY = "smartschool_approvals";

function loadStatuses(): Record<string, ApprovalStatus> {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { return JSON.parse(saved); } catch {}
  }
  return Object.fromEntries(REQUESTS.map((r) => [r.id, r.status]));
}

const TYPE_CONFIG: Record<ApprovalType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  leave:    { label: "Leave",    color: "var(--color-secondary)",    bg: "#6366F120",                   icon: <Calendar size={12} />     },
  purchase: { label: "Purchase", color: "var(--color-warning)",     bg: "#F59E0B20",                   icon: <ShoppingCart size={12} /> },
  policy:   { label: "Policy",   color: "var(--color-primary-light)", bg: "var(--color-primary-badge)", icon: <FileText size={12} />     },
};

const PRIORITY_CONFIG: Record<Priority, { color: string }> = {
  low:    { color: "var(--color-nav-inactive)" },
  medium: { color: "var(--color-warning)" },
  high:   { color: "var(--color-danger)" },
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",      label: "All"      },
  { key: "pending",  label: "Pending"  },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function ApprovalsPage() {
  const [statuses, setStatuses] = useState<Record<string, ApprovalStatus>>(loadStatuses);
  const [filter,   setFilter]   = useState<FilterTab>("pending");

  function decide(id: string, decision: "approved" | "rejected") {
    setStatuses((prev) => {
      const next = { ...prev, [id]: decision };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const requests = REQUESTS.map((r) => ({ ...r, status: statuses[r.id] ?? r.status }));
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const counts: Record<FilterTab, number> = {
    all:      requests.length,
    pending:  pendingCount,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
            Approvals
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">Requests awaiting your decision · Term {CURRENT_TERM} {CURRENT_SESSION}</p>
        </div>
        {pendingCount > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-warning text-[12px] font-semibold"
            style={{ background: "#F59E0B20", fontFamily: "var(--font-dm-mono)" }}
          >
            <AlertTriangle size={13} />
            {pendingCount} AWAITING REVIEW
          </div>
        )}
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
              color:      filter === tab.key ? "#fff"    : "var(--color-nav-inactive)",
            }}
          >
            {tab.label} <span className="opacity-60">({counts[tab.key]})</span>
          </button>
        ))}
      </div>

      {/* Requests */}
      <div className="flex flex-col gap-3">
        {filtered.map((req) => {
          const typeCfg = TYPE_CONFIG[req.type];
          const priCfg  = PRIORITY_CONFIG[req.priority];
          const isPending = req.status === "pending";

          return (
            <div
              key={req.id}
              className="rounded-xl border border-border p-5 flex flex-col gap-3"
              style={{ background: "var(--color-surface)" }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: typeCfg.bg, color: typeCfg.color, fontFamily: "var(--font-dm-mono)" }}
                    >
                      {typeCfg.icon}{typeCfg.label}
                    </span>
                    <span
                      className="text-[10px] font-semibold uppercase"
                      style={{ color: priCfg.color, fontFamily: "var(--font-dm-mono)" }}
                    >
                      {req.priority} priority
                    </span>
                  </div>
                  <p className="text-ink text-[14px] font-semibold">{req.description}</p>
                  <p className="text-ink-4 text-[12px] leading-relaxed max-w-[480px]">{req.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-ink-3 text-[12px] font-medium">{req.requester}</p>
                  <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    {new Date(req.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {isPending ? (
                <div className="flex gap-2 pt-1 border-t border-border">
                  <Button variant="danger" size="sm" icon={<XCircle size={13} />} onClick={() => decide(req.id, "rejected")}>
                    Reject
                  </Button>
                  <Button variant="primary" size="sm" icon={<CheckCircle size={13} />} onClick={() => decide(req.id, "approved")}>
                    Approve
                  </Button>
                </div>
              ) : (
                <div className="pt-1 border-t border-border">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: req.status === "approved" ? "var(--color-success-subtle)" : "#EF444420",
                      color:      req.status === "approved" ? "var(--color-success)"        : "var(--color-danger)",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {req.status === "approved" ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {req.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
