"use client";

import { useState } from "react";
import { Users, Wallet, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatNaira, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

type PayStatus = "paid" | "pending";
type FilterTab = "all" | PayStatus;

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  status: PayStatus;
}

const STAFF: StaffMember[] = [
  { id: "p1", name: "Mrs. Adeyemi",     role: "Head Teacher",       department: "Academic",    salary: 180000, status: "paid"    },
  { id: "p2", name: "Mr. Adeleke",      role: "Class Teacher",      department: "JSS",         salary: 120000, status: "paid"    },
  { id: "p3", name: "Ms. Okonkwo",      role: "Mathematics",        department: "Academic",    salary: 115000, status: "paid"    },
  { id: "p4", name: "Mr. Bello",        role: "Basic Science",      department: "Academic",    salary: 115000, status: "pending" },
  { id: "p5", name: "Mrs. Fashola",     role: "English Language",   department: "Academic",    salary: 115000, status: "pending" },
  { id: "p6", name: "Mr. Eze",          role: "Administrator",      department: "Admin",       salary: 95000,  status: "paid"    },
  { id: "p7", name: "Mrs. Okafor",      role: "Accountant",         department: "Finance",     salary: 110000, status: "paid"    },
  { id: "p8", name: "Security (×3)",    role: "Security",           department: "Operations",  salary: 90000,  status: "pending" },
];

const STORAGE_KEY = "smartschool_payroll_apr2026";

function loadStatuses(): Record<string, PayStatus> {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { return JSON.parse(saved); } catch {}
  }
  return Object.fromEntries(STAFF.map((s) => [s.id, s.status]));
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",     label: "All Staff" },
  { key: "paid",    label: "Paid"      },
  { key: "pending", label: "Pending"   },
];

export default function PayrollPage() {
  const [statuses, setStatuses] = useState<Record<string, PayStatus>>(loadStatuses);
  const [filter,   setFilter]   = useState<FilterTab>("all");

  function runPayment(id: string) {
    setStatuses((prev) => {
      const next = { ...prev, [id]: "paid" as PayStatus };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const staff    = STAFF.map((s) => ({ ...s, status: statuses[s.id] ?? s.status }));
  const filtered = filter === "all" ? staff : staff.filter((s) => s.status === filter);

  const totalPayroll  = staff.reduce((s, m) => s + m.salary, 0);
  const paidTotal     = staff.filter((s) => s.status === "paid").reduce((s, m) => s + m.salary, 0);
  const pendingTotal  = staff.filter((s) => s.status === "pending").reduce((s, m) => s + m.salary, 0);
  const pendingCount  = staff.filter((s) => s.status === "pending").length;

  const counts: Record<FilterTab, number> = {
    all:     staff.length,
    paid:    staff.filter((s) => s.status === "paid").length,
    pending: pendingCount,
  };

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
            Payroll
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">April 2026 · Term {CURRENT_TERM} {CURRENT_SESSION}</p>
        </div>
        {pendingCount > 0 && (
          <div
            className="px-3 py-1.5 rounded-lg text-warning text-[12px] font-semibold"
            style={{ background: "#F59E0B20", fontFamily: "var(--font-dm-mono)" }}
          >
            {pendingCount} PAYMENTS PENDING
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Staff",    value: staff.length,           icon: <Users size={16} />,       color: "#6366F1" },
          { label: "Total Payroll",  value: formatNaira(totalPayroll), icon: <Wallet size={16} />,   color: "#7C3AED" },
          { label: "Paid Out",       value: formatNaira(paidTotal),  icon: <CheckCircle size={16} />, color: "#10B981" },
          { label: "Pending",        value: formatNaira(pendingTotal), icon: <Clock size={16} />,    color: "#F59E0B" },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border p-4 flex flex-col gap-3"
            style={{ background: "#111118" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest text-ink-4 uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {label}
              </span>
              <span style={{ color }}>{icon}</span>
            </div>
            <p className="text-ink text-[22px] font-bold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#111118" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: filter === tab.key ? "#7C3AED" : "transparent",
              color:      filter === tab.key ? "#fff"    : "#5A5A7A",
            }}
          >
            {tab.label} <span className="opacity-60">({counts[tab.key]})</span>
          </button>
        ))}
      </div>

      {/* Staff list */}
      <div className="rounded-xl border border-border overflow-hidden" style={{ background: "#111118" }}>
        <div
          className="grid px-5 py-3 border-b border-border"
          style={{ gridTemplateColumns: "1fr 140px 120px 100px 120px", background: "#0D0D14" }}
        >
          {["Staff Member", "Role", "Department", "Salary", "Status"].map((h) => (
            <span key={h} className="text-[10px] tracking-widest text-ink-4 uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
              {h}
            </span>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="grid items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              style={{ gridTemplateColumns: "1fr 140px 120px 100px 120px" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: "#7C3AED22", color: "#A78BFA", fontFamily: "var(--font-dm-mono)" }}
                >
                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <span className="text-ink text-[13px] font-semibold">{member.name}</span>
              </div>
              <span className="text-ink-4 text-[12px]">{member.role}</span>
              <span className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {member.department}
              </span>
              <span className="text-ink text-[13px] font-bold" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {formatNaira(member.salary)}
              </span>
              <div>
                {member.status === "paid" ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "#10B98120", color: "#10B981", fontFamily: "var(--font-dm-mono)" }}
                  >
                    <CheckCircle size={10} /> Paid
                  </span>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => runPayment(member.id)}>
                    Run Payment
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
