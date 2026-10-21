"use client";
import { useMemo, useState } from "react";
import { expenseShare, lastN, sortTxns, summarize, transactions } from "@/lib/finance";
import { BarChart, Donut, LineChart } from "../charts";
import { PrototypeBanner } from "../ui";
import { cn } from "@/lib/cn";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
type Key = "date" | "amount" | "name";

export function FinanceDashboardDemo() {
  const [range, setRange] = useState<3 | 6 | 12>(6);
  const [sort, setSort] = useState<{ key: Key; dir: "asc" | "desc" }>({ key: "date", dir: "desc" });
  const rows = useMemo(() => lastN(range), [range]);
  const s = useMemo(() => summarize(rows), [rows]);
  const txns = useMemo(() => sortTxns(transactions, sort.key, sort.dir), [sort]);
  const labels = rows.map((r) => r.label);
  const profits = rows.map((r) => r.revenue - r.expenses);
  const toggle = (key: Key) => setSort((p) => ({ key, dir: p.key === key && p.dir === "desc" ? "asc" : "desc" }));
  const aria = (key: Key): "ascending" | "descending" | "none" => (sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none");

  const kpis = [
    { label: "Revenue", value: money(s.revenue), sub: `${s.growth >= 0 ? "+" : ""}${s.growth.toFixed(1)}% since ${labels[0]}` },
    { label: "Expenses", value: money(s.expenses), sub: `${rows.length} months` },
    { label: "Profit", value: money(s.profit), sub: s.profit >= 0 ? "Net positive" : "Net negative" },
    { label: "Margin", value: `${s.margin.toFixed(1)}%`, sub: "Profit / revenue" },
  ];

  return (
    <div>
      <PrototypeBanner>Sample data only. Every figure here is fictional and exists to demonstrate the dashboard.</PrototypeBanner>
      <div className="mb-5 flex items-center justify-between">
        <div role="group" aria-label="Date range" className="flex gap-2">
          {([3, 6, 12] as const).map((n) => (
            <button key={n} type="button" aria-pressed={range === n} onClick={() => setRange(n)} className={cn("rounded-full border px-4 py-1.5 text-sm", range === n ? "border-sage bg-sage text-black" : "border-line text-mute hover:text-cream")}>{n} months</button>
          ))}
        </div>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-live="polite">
        {kpis.map((k) => (
          <div key={k.label} className="card p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-mute">{k.label}</p>
            <p className="mt-1 text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-mute">{k.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-sage">Revenue vs expenses</h3>
          <LineChart labels={labels} title="Revenue versus expenses" summary={`Revenue totals ${money(s.revenue)} and expenses ${money(s.expenses)} over ${rows.length} months.`} series={[{ name: "Revenue", color: "#abb8a8", values: rows.map((r) => r.revenue) }, { name: "Expenses", color: "#e8789a", values: rows.map((r) => r.expenses) }]} />
        </div>
        <div className="card p-5">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-sage">Monthly profit</h3>
          <BarChart labels={labels} values={profits} title="Monthly profit" summary={`Profit ranges from ${money(Math.min(...profits))} to ${money(Math.max(...profits))}.`} />
        </div>
        <div className="card p-5">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-sage">Expense breakdown</h3>
          <Donut data={expenseShare} title="Expense breakdown" />
        </div>
        <div className="card overflow-x-auto p-5">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-sage">Recent transactions</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-mute">
                <th scope="col" aria-sort={aria("date")}><button type="button" onClick={() => toggle("date")} className="py-1">Date</button></th>
                <th scope="col" aria-sort={aria("name")}><button type="button" onClick={() => toggle("name")} className="py-1">Description</button></th>
                <th scope="col" className="text-right" aria-sort={aria("amount")}><button type="button" onClick={() => toggle("amount")} className="py-1">Amount</button></th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} className="border-t border-line">
                  <td className="py-2 font-mono text-xs text-mute">{t.date}</td>
                  <td className="py-2">{t.name}</td>
                  <td className={cn("py-2 text-right font-mono", t.type === "Income" ? "text-sage" : "text-rose-300")}>{t.type === "Income" ? "+" : "-"}{money(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
