/**
 * Business planning engine (rule-based).
 * This is NOT an AI model. It is a deterministic template engine with one real
 * calculation (break-even). The input/output contract below is the integration point
 * where an AI provider could be plugged in later without changing the UI.
 */
export type RevenueModel = "subscription" | "one-time" | "marketplace" | "services" | "advertising";
export type Stage = "idea" | "prototype" | "launched";

export type PlanInput = {
  idea: string;
  audience: string;
  model: RevenueModel;
  stage: Stage;
  price: number; // per customer per month (or per sale)
  variableCost: number; // per customer
  fixedCosts: number; // per month
};

export type BreakEven =
  | { ok: true; customers: number; monthlyRevenue: number; margin: number }
  | { ok: false; reason: string };

export type BusinessPlan = {
  summary: string;
  canvas: { problem: string; solution: string; value: string; channels: string; revenue: string; costs: string; metrics: string };
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  breakEven: BreakEven;
  roadmap: { phase: string; actions: string[] }[];
};

export function breakEven(price: number, variableCost: number, fixedCosts: number): BreakEven {
  if (![price, variableCost, fixedCosts].every((n) => Number.isFinite(n) && n >= 0)) {
    return { ok: false, reason: "Enter zero or positive numbers for price and costs." };
  }
  const margin = price - variableCost;
  if (margin <= 0) {
    return { ok: false, reason: "Price must be higher than the variable cost per customer, otherwise every sale loses money." };
  }
  const customers = Math.ceil(fixedCosts / margin);
  return { ok: true, customers, monthlyRevenue: customers * price, margin };
}

const modelText: Record<RevenueModel, { revenue: string; channel: string; risk: string }> = {
  subscription: { revenue: "Recurring monthly subscriptions", channel: "Free trials, content marketing and referrals", risk: "Churn can erase growth if retention is not tracked early." },
  "one-time": { revenue: "One-off purchases", channel: "Launch campaigns, partnerships and social proof", risk: "Revenue resets every month, so demand must be rebuilt continually." },
  marketplace: { revenue: "Commission on each transaction", channel: "Seed one side of the marketplace first, then invite the other", risk: "The chicken-and-egg problem: both sides must be present to be useful." },
  services: { revenue: "Paid projects and retainers", channel: "Referrals, case studies and direct outreach", risk: "Income scales with time, so capacity limits growth." },
  advertising: { revenue: "Advertising and sponsorship", channel: "Organic reach and audience-building content", risk: "Needs a large audience before revenue becomes meaningful." },
};

const stageText: Record<Stage, { strength: string; weakness: string; first: string }> = {
  idea: { strength: "Low sunk cost, so you can still change direction freely", weakness: "No evidence yet that customers will pay", first: "Interview 10 target customers before building anything." },
  prototype: { strength: "Something real to show and test with customers", weakness: "Prototype may not yet match what customers truly value", first: "Put the prototype in front of 5 real users and watch where they struggle." },
  launched: { strength: "Real usage data to learn from", weakness: "Early habits and costs are harder to change once set", first: "Measure activation and retention, and fix the biggest drop-off first." },
};

export function generateBusinessPlan(input: PlanInput): BusinessPlan {
  const idea = input.idea.trim() || "your idea";
  const audience = input.audience.trim() || "your target customers";
  const m = modelText[input.model];
  const s = stageText[input.stage];
  const be = breakEven(input.price, input.variableCost, input.fixedCosts);
  const beLine = be.ok
    ? `At ${fmt(input.price)} per customer you need about ${be.customers} customers (${fmt(be.monthlyRevenue)} per month) to cover fixed costs.`
    : "Break-even cannot be calculated yet. " + be.reason;
  return {
    summary: `${cap(idea)} for ${audience}, earning through ${m.revenue.toLowerCase()}. ${beLine}`,
    canvas: {
      problem: `${cap(audience)} lack a simple, trusted way to get what ${idea} promises.`,
      solution: `${cap(idea)}, delivered in the simplest form that proves value quickly.`,
      value: `A faster, clearer path to the outcome ${audience} actually want.`,
      channels: m.channel,
      revenue: m.revenue,
      costs: `Fixed: ${fmt(input.fixedCosts)} per month. Variable: ${fmt(input.variableCost)} per customer.`,
      metrics: "Customers acquired, activation rate, retention, revenue per customer, payback period.",
    },
    swot: {
      strengths: [s.strength, "A clearly defined audience", `A revenue model (${m.revenue.toLowerCase()}) that can be tested quickly`],
      weaknesses: [s.weakness, "Limited brand awareness at the start", "Small team, so focus is essential"],
      opportunities: ["Early customers can shape the product", "Partnerships with communities that already serve this audience", "Word of mouth in a niche market"],
      threats: [m.risk, "Competitors with larger budgets", "Customer needs changing before you reach scale"],
    },
    breakEven: be,
    roadmap: [
      { phase: "Days 1-30: Validate", actions: [s.first, "Write the one-sentence value proposition and test it with real people", "Set a single success metric for the next 30 days"] },
      { phase: "Days 31-60: Build and test", actions: ["Ship the smallest version that solves the core problem", `Test the channel: ${m.channel.toLowerCase()}`, "Collect feedback weekly and change one thing at a time"] },
      { phase: "Days 61-90: Grow", actions: ["Double down on the one channel that worked", be.ok ? `Track progress toward ${be.customers} customers` : "Fix pricing so each sale is profitable", "Decide: scale, adjust or stop, based on evidence"] },
    ],
  };
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const fmt = (n: number) => (Number.isFinite(n) ? "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "$0");
