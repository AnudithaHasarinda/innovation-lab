"use client";
import { useMemo, useState } from "react";
import { generateBusinessPlan, type PlanInput, type RevenueModel, type Stage } from "@/lib/planner";
import { CopyButton } from "../CopyButton";
import { PrototypeBanner } from "../ui";

const EXAMPLE: PlanInput = {
  idea: "a mobile brand-photography studio",
  audience: "small businesses in Colombo",
  model: "services",
  stage: "prototype",
  price: 250,
  variableCost: 60,
  fixedCosts: 1500,
};

export function BusinessAssistantDemo() {
  const [v, setV] = useState<PlanInput>(EXAMPLE);
  const plan = useMemo(() => generateBusinessPlan(v), [v]);
  const set = <K extends keyof PlanInput>(k: K, val: PlanInput[K]) => setV((p) => ({ ...p, [k]: val }));
  const num = (s: string) => (s === "" ? 0 : Number(s));
  const asText = [
    plan.summary,
    "",
    ...Object.entries(plan.canvas).map(([k, t]) => `${k.toUpperCase()}: ${t}`),
    "",
    ...plan.roadmap.flatMap((r) => [r.phase, ...r.actions.map((a) => `  - ${a}`)]),
  ].join("\n");

  return (
    <div>
      <PrototypeBanner>Rule-based prototype. No AI model is connected, and nothing you type leaves your browser.</PrototypeBanner>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form className="card space-y-4 p-5" onSubmit={(e) => e.preventDefault()} aria-label="Business idea inputs">
          <div><label className="label" htmlFor="ba-idea">Your idea</label><textarea id="ba-idea" className="input" rows={2} value={v.idea} onChange={(e) => set("idea", e.target.value)} /></div>
          <div><label className="label" htmlFor="ba-aud">Target audience</label><input id="ba-aud" className="input" value={v.audience} onChange={(e) => set("audience", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label" htmlFor="ba-model">Revenue model</label>
              <select id="ba-model" className="input" value={v.model} onChange={(e) => set("model", e.target.value as RevenueModel)}>
                <option value="subscription">Subscription</option><option value="one-time">One-time sales</option><option value="marketplace">Marketplace</option><option value="services">Services</option><option value="advertising">Advertising</option>
              </select></div>
            <div><label className="label" htmlFor="ba-stage">Stage</label>
              <select id="ba-stage" className="input" value={v.stage} onChange={(e) => set("stage", e.target.value as Stage)}>
                <option value="idea">Idea</option><option value="prototype">Prototype</option><option value="launched">Launched</option>
              </select></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label" htmlFor="ba-price">Price</label><input id="ba-price" type="number" min="0" className="input" value={v.price} onChange={(e) => set("price", num(e.target.value))} /></div>
            <div><label className="label" htmlFor="ba-var">Cost / sale</label><input id="ba-var" type="number" min="0" className="input" value={v.variableCost} onChange={(e) => set("variableCost", num(e.target.value))} /></div>
            <div><label className="label" htmlFor="ba-fix">Fixed / mo</label><input id="ba-fix" type="number" min="0" className="input" value={v.fixedCosts} onChange={(e) => set("fixedCosts", num(e.target.value))} /></div>
          </div>
          <p className="text-xs text-mute">Amounts are in any currency you like; the maths is the same.</p>
        </form>

        <div className="space-y-4" aria-live="polite">
          <div className="card p-5">
            <div className="mb-2 flex items-center justify-between"><h3 className="font-mono text-xs uppercase tracking-widest text-sage">Summary</h3><CopyButton text={asText} label="Copy plan" /></div>
            <p className="text-sm leading-relaxed">{plan.summary}</p>
          </div>
          <div className={"card p-5 " + (plan.breakEven.ok ? "" : "border-amber-300/40")}>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-sage">Break-even</h3>
            {plan.breakEven.ok ? (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-2xl font-bold">{plan.breakEven.customers}</p><p className="text-xs text-mute">customers</p></div>
                <div><p className="text-2xl font-bold">{plan.breakEven.monthlyRevenue.toLocaleString("en-US")}</p><p className="text-xs text-mute">revenue / month</p></div>
                <div><p className="text-2xl font-bold">{plan.breakEven.margin.toLocaleString("en-US")}</p><p className="text-xs text-mute">margin / sale</p></div>
              </div>
            ) : (
              <p className="text-sm text-amber-200">{plan.breakEven.reason}</p>
            )}
          </div>
          <div className="card p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-sage">Lean canvas</h3>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {Object.entries(plan.canvas).map(([k, t]) => (
                <div key={k}><dt className="text-xs uppercase tracking-wider text-mute">{k}</dt><dd className="mt-0.5">{t}</dd></div>
              ))}
            </dl>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(Object.entries(plan.swot) as [string, string[]][]).map(([k, items]) => (
              <div key={k} className="card p-5">
                <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-sage">{k}</h3>
                <ul className="list-disc space-y-1 pl-4 text-sm text-mute">{items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-sage">30-60-90 day plan</h3>
            <div className="space-y-4">
              {plan.roadmap.map((r) => (
                <div key={r.phase}><p className="font-semibold">{r.phase}</p><ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-mute">{r.actions.map((a) => <li key={a}>{a}</li>)}</ul></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
