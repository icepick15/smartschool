"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatNaira, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

type Status = "pending" | "approved" | "rejected";
type FilterTab = "all" | Status;

interface ExpenseRequest {
  id: string;
  title: string;
  amount: number;
  category: string;
  requester: string;
  date: string;
  status: Status;
}

const INITIAL_REQUESTS: ExpenseRequest[] = [
  { id: "e1", title: "Generator diesel refill",        amount: 45000,  category: "Utilities",   requester: "Mr. Bello",     date: "2026-04-28", status: "pending"  },
  { id: "e2", title: "Textbooks & stationery (Term 2)", amount: 62000,  category: "Supplies",    requester: "Mrs. Adeyemi",  date: "2026-04-25", status: "pending"  },
  { id: "e3", title: "Staff welfare — April",           amount: 35000,  category: "Welfare",     requester: "HR Dept",       date: "2026-04-20", status: "approved" },
  { id: "e4", title: "Classroom furniture repair",      amount: 28000,  category: "Maintenance", requester: "Mr. Okafor",    date: "2026-04-18", status: "rejected" },
  { id: "e5", title: "Sports equipment",                amount: 55000,  category: "Equipment",   requester: "Mr. Fashola",   date: "2026-04-15", status: "approved" },
  { id: "e6", title: "Water treatment chemicals",       amount: 18000,  category: "Utilities",   requester: "Facilities",    date: "2026-04-10", status: "pending"  },
  { id: "e7", title: "Printer cartridges & paper",      amount: 12000,  category: "Supplies",    requester: "Admin Office",  date: "2026-04-08", status: "pending"  },
  { id: "e8", title: "First aid restocking",            amount: 9500,   category: "Medical",     requester: "Matron",        date: "2026-04-05", status: "approved" },
];

const STORAGE_KEY = "smartschool_expenses";

function loadStatuses(): Record<string, Status> {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { return JSON.parse(saved); } catch {}
  }
  return Object.fromEntries(INITIAL_REQUESTS.map((r) => [r.id, r.status]));
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: "Pending",  color: "var(--color-warning)", bg: "#F59E0B20",                   icon: <Clock size={12} />        },
  approved: { label: "Approved", color: "var(--color-success)", bg: "var(--color-success-subtle)", icon: <CheckCircle size={12} />  },
  rejected: { label: "Rejected", color: "var(--color-danger)",  bg: "#EF444420",                   icon: <XCircle size={12} />      },
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",      label: "All"      },
  { key: "pending",  label: "Pending"  },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function SmartSpendPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(loadStatuses);
  const [filter,   setFilter]   = useState<FilterTab>("all");

  function updateStatus(id: string, status: Status) {
    setStatuses((prev) => {
      const next = { ...prev, [id]: status };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const requests = INITIAL_REQUESTS.map((r) => ({ ...r, status: statuses[r.id] ?? r.status }));
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts: Record<FilterTab, number> = {
    all:      requests.length,
    pending:  requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const totalPending  = requests.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalApproved = requests.filter((r) => r.status === "approved").reduce((s, r) => s + r.amount, 0);

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
              SmartSpend
            </h1>
            <p className="text-ink-4 text-[13px] mt-1">
              Expense approvals · Term {CURRENT_TERM} {CURRENT_SESSION}
            </p>
          </div>
        </div>
        {counts.pending > 0 && (
          <div
            className="px-3 py-1.5 rounded-lg text-warning text-[12px] font-semibold"
            style={{ background: "#F59E0B20", fontFamily: "var(--font-dm-mono)" }}
          >
            {counts.pending} PENDING REVIEW
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Requests",        value: `${requests.length}`,       icon: <Wallet size={16} />,        color: "var(--color-secondary)" },
          { label: "Pending Amount",  value: formatNaira(totalPending),  icon: <Clock size={16} />,         color: "var(--color-warning)" },
          { label: "Approved Total",  value: formatNaira(totalApproved), icon: <CheckCircle size={16} />,   color: "var(--color-success)" },
          { label: "Awaiting Review", value: `${counts.pending}`,        icon: <XCircle size={16} />,       color: "var(--color-danger)" },
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
              color:      filter === tab.key ? "#fff"    : "#5A5A7A",
            }}
          >
            {tab.label}{" "}
            <span className="opacity-60">({counts[tab.key]})</span>
          </button>
        ))}
      </div>

      {/* Request list */}
      <div className="flex flex-col gap-3">
        {filtered.map((req) => {
          const cfg = STATUS_CONFIG[req.status];
          return (
            <div
              key={req.id}
              className="rounded-xl border border-border p-5 flex flex-col gap-4"
              style={{ background: "var(--color-surface)" }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <p className="text-ink text-[14px] font-semibold">{req.title}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="text-ink-5 text-[11px]"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {req.requester}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md"
                      style={{ background: "var(--color-elevated)", color: "#5A5A7A", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {req.category}
                    </span>
                    <span
                      className="text-ink-5 text-[11px]"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {new Date(req.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color, fontFamily: "var(--font-dm-mono)" }}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  <span
                    className="text-[18px] font-bold"
                    style={{ fontFamily: "var(--font-syne)", color: "var(--color-ink)" }}
                  >
                    {formatNaira(req.amount)}
                  </span>
                </div>
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2 pt-1 border-t border-border">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<XCircle size={13} />}
                    onClick={() => updateStatus(req.id, "rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckCircle size={13} />}
                    onClick={() => updateStatus(req.id, "approved")}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
