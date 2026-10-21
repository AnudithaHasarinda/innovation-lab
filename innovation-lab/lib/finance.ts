/** SAMPLE DATA ONLY. Fictional figures for demonstration. Replace to connect real numbers. */
export type Month = { label: string; revenue: number; expenses: number };
export const months: Month[] = [
  { label: "Jan", revenue: 18200, expenses: 14100 },
  { label: "Feb", revenue: 19400, expenses: 14600 },
  { label: "Mar", revenue: 21800, expenses: 15200 },
  { label: "Apr", revenue: 20900, expenses: 15900 },
  { label: "May", revenue: 23600, expenses: 16400 },
  { label: "Jun", revenue: 25100, expenses: 17200 },
  { label: "Jul", revenue: 24300, expenses: 17800 },
  { label: "Aug", revenue: 27200, expenses: 18100 },
  { label: "Sep", revenue: 28900, expenses: 18900 },
  { label: "Oct", revenue: 30400, expenses: 19600 },
  { label: "Nov", revenue: 29800, expenses: 20400 },
  { label: "Dec", revenue: 33100, expenses: 21300 },
];

export const expenseShare = [
  { label: "Salaries", value: 46 },
  { label: "Marketing", value: 20 },
  { label: "Software", value: 12 },
  { label: "Operations", value: 14 },
  { label: "Other", value: 8 },
];

export type Txn = { id: number; date: string; name: string; type: "Income" | "Expense"; amount: number };
export const transactions: Txn[] = [
  { id: 1, date: "2025-12-28", name: "Brand project (client A)", type: "Income", amount: 4200 },
  { id: 2, date: "2025-12-26", name: "Software subscriptions", type: "Expense", amount: 640 },
  { id: 3, date: "2025-12-22", name: "Retainer (client B)", type: "Income", amount: 2800 },
  { id: 4, date: "2025-12-19", name: "Ad spend", type: "Expense", amount: 1350 },
  { id: 5, date: "2025-12-15", name: "Video production (client C)", type: "Income", amount: 5600 },
  { id: 6, date: "2025-12-11", name: "Equipment", type: "Expense", amount: 2100 },
  { id: 7, date: "2025-12-05", name: "Workshop tickets", type: "Income", amount: 950 },
  { id: 8, date: "2025-12-02", name: "Contractor payment", type: "Expense", amount: 1800 },
];

export const lastN = (n: number) => months.slice(-n);

export function summarize(rows: Month[]) {
  const revenue = rows.reduce((a, r) => a + r.revenue, 0);
  const expenses = rows.reduce((a, r) => a + r.expenses, 0);
  const profit = revenue - expenses;
  const margin = revenue === 0 ? 0 : (profit / revenue) * 100;
  const first = rows[0], last = rows[rows.length - 1];
  const growth = first && first.revenue ? ((last.revenue - first.revenue) / first.revenue) * 100 : 0;
  return { revenue, expenses, profit, margin, growth };
}

export function sortTxns(rows: Txn[], key: "date" | "amount" | "name", dir: "asc" | "desc") {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key], y = b[key];
    return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sign;
  });
}
