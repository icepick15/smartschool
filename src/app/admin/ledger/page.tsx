import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Activity, DollarSign } from "lucide-react";
import { TRANSACTIONS } from "@/lib/mock-data";
import { formatNaira, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

export default function LedgerPage() {
  const sorted     = [...TRANSACTIONS].sort((a, b) => b.date.localeCompare(a.date));
  const income     = TRANSACTIONS.filter((t) => t.type === "income");
  const expenses   = TRANSACTIONS.filter((t) => t.type === "expense");
  const totalIn    = income.reduce((s, t) => s + t.amount, 0);
  const totalOut   = expenses.reduce((s, t) => s + t.amount, 0);
  const net        = totalIn - totalOut;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-ink-3 hover:text-ink transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Fee Ledger
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            Full transaction history · Term {CURRENT_TERM} {CURRENT_SESSION}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Income",   value: formatNaira(totalIn),  icon: <ArrowUpRight size={16} />,   color: "var(--color-success)" },
          { label: "Total Expenses", value: formatNaira(totalOut), icon: <ArrowDownLeft size={16} />,  color: "var(--color-danger)" },
          { label: "Net Balance",    value: formatNaira(net),      icon: <DollarSign size={16} />,     color: net >= 0 ? "var(--color-success)" : "var(--color-danger)" },
          { label: "Transactions",   value: `${TRANSACTIONS.length}`, icon: <Activity size={16} />,   color: "var(--color-secondary)" },
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
              style={{ fontFamily: "var(--font-syne)", color: label === "Net Balance" ? color : undefined }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Transaction table */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Table header */}
        <div
          className="grid px-5 py-3 border-b border-border"
          style={{ gridTemplateColumns: "120px 1fr 120px 120px", background: "var(--color-sidebar)" }}
        >
          {["Date", "Description", "Category", "Amount"].map((h) => (
            <span
              key={h}
              className="text-[10px] tracking-widest text-ink-4 uppercase last:text-right"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-border">
          {sorted.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                className="grid items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: "120px 1fr 120px 120px" }}
              >
                {/* Date */}
                <span
                  className="text-ink-5 text-[12px]"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  {new Date(tx.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                {/* Description */}
                <div className="flex items-center gap-2 pr-4">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isIncome ? "var(--color-success-subtle)" : "#EF444420",
                      color:      isIncome ? "var(--color-success)"        : "var(--color-danger)",
                    }}
                  >
                    {isIncome
                      ? <ArrowUpRight size={12} />
                      : <ArrowDownLeft size={12} />
                    }
                  </div>
                  <span className="text-ink text-[13px] truncate">{tx.description}</span>
                </div>

                {/* Category */}
                <span
                  className="text-[11px] text-ink-5 px-2 py-0.5 rounded-md w-fit"
                  style={{ background: "var(--color-elevated)", fontFamily: "var(--font-dm-mono)" }}
                >
                  {tx.category}
                </span>

                {/* Amount */}
                <span
                  className="text-[14px] font-bold text-right"
                  style={{
                    fontFamily: "var(--font-syne)",
                    color: isIncome ? "var(--color-success)" : "var(--color-danger)",
                  }}
                >
                  {isIncome ? "+" : "−"}{formatNaira(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
