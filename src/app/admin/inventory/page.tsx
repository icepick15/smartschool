"use client";

import { useState } from "react";
import { Package, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

type Condition = "New" | "Good" | "Fair" | "Poor";
type FilterTab = "all" | string;

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: Condition;
  lastChecked: string;
  minStock?: number;
}

const ITEMS: InventoryItem[] = [
  { id: "i1",  name: "Student Chairs",          category: "Furniture",   quantity: 480, condition: "Good", lastChecked: "2026-02-28", minStock: 400 },
  { id: "i2",  name: "Desks",                   category: "Furniture",   quantity: 240, condition: "Fair", lastChecked: "2026-02-28", minStock: 200 },
  { id: "i3",  name: "Whiteboards",             category: "Furniture",   quantity: 18,  condition: "Good", lastChecked: "2026-03-15" },
  { id: "i4",  name: "Laptops",                 category: "Technology",  quantity: 24,  condition: "Good", lastChecked: "2026-04-15", minStock: 20  },
  { id: "i5",  name: "Projectors",              category: "Technology",  quantity: 8,   condition: "Fair", lastChecked: "2026-04-10" },
  { id: "i6",  name: "Printers",                category: "Technology",  quantity: 4,   condition: "Good", lastChecked: "2026-04-20" },
  { id: "i7",  name: "Textbooks (JSS 3)",       category: "Books",       quantity: 156, condition: "Good", lastChecked: "2026-03-20", minStock: 120 },
  { id: "i8",  name: "Exercise Books (reams)",  category: "Supplies",    quantity: 45,  condition: "New",  lastChecked: "2026-04-28", minStock: 30  },
  { id: "i9",  name: "Printer Paper (reams)",   category: "Supplies",    quantity: 12,  condition: "New",  lastChecked: "2026-04-28", minStock: 20  },
  { id: "i10", name: "Generators",              category: "Equipment",   quantity: 2,   condition: "Good", lastChecked: "2026-04-20" },
  { id: "i11", name: "Fire Extinguishers",      category: "Safety",      quantity: 12,  condition: "Good", lastChecked: "2026-04-01", minStock: 10  },
  { id: "i12", name: "First Aid Kits",          category: "Safety",      quantity: 6,   condition: "Fair", lastChecked: "2026-03-30", minStock: 5   },
];

const CONDITION_CONFIG: Record<Condition, { color: string; bg: string }> = {
  New:  { color: "var(--color-secondary)", bg: "#6366F120" },
  Good: { color: "var(--color-success)",   bg: "var(--color-success-subtle)" },
  Fair: { color: "var(--color-warning)",   bg: "#F59E0B20" },
  Poor: { color: "var(--color-danger)",    bg: "#EF444420" },
};

const CATEGORIES = ["all", ...Array.from(new Set(ITEMS.map((i) => i.category)))];

export default function InventoryPage() {
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = filter === "all" ? ITEMS : ITEMS.filter((i) => i.category === filter);
  const lowStock = ITEMS.filter((i) => i.minStock !== undefined && i.quantity <= i.minStock).length;
  const categories = new Set(ITEMS.map((i) => i.category)).size;

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-ink text-[26px] font-extrabold leading-none"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Inventory
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            Asset register · Term {CURRENT_TERM} {CURRENT_SESSION}
          </p>
        </div>
        {lowStock > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-warning text-[12px] font-semibold"
            style={{ background: "#F59E0B20", fontFamily: "var(--font-dm-mono)" }}
          >
            <AlertTriangle size={13} />
            {lowStock} LOW STOCK
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Items",    value: ITEMS.length,    icon: <Package size={16} />,        color: "var(--color-secondary)" },
          { label: "Categories",     value: categories,      icon: <CheckCircle size={16} />,    color: "var(--color-primary)" },
          { label: "Low Stock",      value: lowStock,        icon: <AlertTriangle size={16} />,  color: "var(--color-warning)" },
          { label: "Last Audit",     value: "Apr 2026",      icon: <Clock size={16} />,          color: "var(--color-success)" },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border p-4 flex flex-col gap-3"
            style={{ background: "var(--color-surface)" }}
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

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 capitalize"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: filter === cat ? "var(--color-primary)" : "var(--color-surface)",
              color:      filter === cat ? "#fff"    : "#5A5A7A",
              border:     filter === cat ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory table */}
      <div className="rounded-xl border border-border overflow-hidden" style={{ background: "var(--color-surface)" }}>
        <div
          className="grid px-5 py-3 border-b border-border"
          style={{ gridTemplateColumns: "1fr 120px 80px 80px 130px", background: "var(--color-sidebar)" }}
        >
          {["Item", "Category", "Qty", "Condition", "Last Checked"].map((h) => (
            <span
              key={h}
              className="text-[10px] tracking-widest text-ink-4 uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {h}
            </span>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-border">
          {filtered.map((item) => {
            const condCfg  = CONDITION_CONFIG[item.condition];
            const isLow    = item.minStock !== undefined && item.quantity <= item.minStock;
            return (
              <div
                key={item.id}
                className="grid items-center px-5 py-3 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: "1fr 120px 80px 80px 130px" }}
              >
                <div className="flex items-center gap-2">
                  {isLow && <AlertTriangle size={12} className="text-warning shrink-0" />}
                  <span className="text-ink text-[13px] font-medium">{item.name}</span>
                </div>
                <span className="text-ink-5 text-[12px]">{item.category}</span>
                <span
                  className="text-[13px] font-bold"
                  style={{ fontFamily: "var(--font-dm-mono)", color: isLow ? "var(--color-warning)" : "var(--color-ink)" }}
                >
                  {item.quantity}
                </span>
                <span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: condCfg.bg, color: condCfg.color, fontFamily: "var(--font-dm-mono)" }}
                  >
                    {item.condition}
                  </span>
                </span>
                <span
                  className="text-ink-5 text-[11px]"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  {new Date(item.lastChecked).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
