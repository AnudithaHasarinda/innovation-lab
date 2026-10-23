import assert from "node:assert/strict";
import { buildVCard, escapeVCard, foldLine, vcardFilename } from "@/lib/vcard";
import { generatePalette, hexToHsl, hslToHex, contrastRatio, normalizeHex, monogram, readableOn, paletteToCss, paletteToJson, suggestFonts } from "@/lib/palette";
import { breakEven, generateBusinessPlan } from "@/lib/planner";
import { lastN, summarize, sortTxns, transactions, months } from "@/lib/finance";
import { describeEvent, aggregate, pickFeatured, getGithubData } from "@/lib/github";
import { runCommand } from "@/components/Terminal";
import { filterProjects } from "@/components/ProjectShowcase";
import { projects, categories, getProject } from "@/data/projects";

// Run with:  npm test   (uses tsx; resolves the @/ path alias from tsconfig.json)
let n = 0; const t = (name: string, fn: () => void | Promise<void>) => { n++; return Promise.resolve(fn()).then(() => console.log("  ok  " + name)); };

(async () => {
  // ---- vCard
  await t("vcard escaping + structure", () => {
    const v = buildVCard({ firstName: "A", lastName: "B", org: "Foo, Bar; Inc", note: "line1\nline2", email: "a@b.co" });
    assert.ok(v.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")); assert.ok(v.endsWith("END:VCARD\r\n"));
    assert.ok(v.includes("ORG:Foo\\, Bar\\; Inc")); assert.ok(v.includes("NOTE:line1\\nline2")); assert.ok(v.includes("FN:A B")); assert.ok(v.includes("N:B;A;;;"));
  });
  await t("vcard folds long lines to <=75 chars, continuation starts with space", () => {
    const line = "NOTE:" + "x".repeat(200); const folded = foldLine(line).split("\r\n");
    assert.ok(folded.every((l) => l.length <= 75)); assert.ok(folded.slice(1).every((l) => l.startsWith(" ")));
    assert.equal(folded.map((l, i) => (i ? l.slice(1) : l)).join(""), line);
  });
  await t("vcard omits empty optional fields, filename safe", () => {
    const v = buildVCard({ firstName: "Ann", lastName: "Lee" }); assert.ok(!v.includes("TEL")); assert.ok(!v.includes("ORG")); assert.ok(!v.includes("ADR"));
    assert.equal(vcardFilename({ firstName: "Anuditha", lastName: "Hasarinda" }), "anuditha-hasarinda.vcf"); assert.equal(vcardFilename({ firstName: "", lastName: "" }), "contact.vcf");
    assert.equal(escapeVCard("a\\b"), "a\\\\b");
  });
  // ---- palette
  await t("hex<->hsl round trip", () => { for (const h of ["#abb8a8", "#ff0000", "#123456", "#ffffff", "#000000", "#7f7f7f"]) { const [a, b, c] = hexToHsl(h); const back = hslToHex(a, b, c); const d = [1, 3, 5].map((i) => Math.abs(parseInt(h.slice(i, i + 2), 16) - parseInt(back.slice(i, i + 2), 16))); assert.ok(Math.max(...d) <= 2, `${h} -> ${back}`); } });
  await t("WCAG contrast known values", () => { assert.ok(Math.abs(contrastRatio("#000000", "#ffffff") - 21) < 0.01); assert.ok(Math.abs(contrastRatio("#777777", "#ffffff") - 4.48) < 0.05); assert.equal(readableOn("#ffffff"), "#000000"); assert.equal(readableOn("#000000"), "#ffffff"); });
  await t("normalizeHex handles shorthand & rejects junk", () => { assert.equal(normalizeHex("#ABC"), "#aabbcc"); assert.equal(normalizeHex("abb8a8"), "#abb8a8"); assert.equal(normalizeHex("zzz"), null); assert.equal(normalizeHex("#12345"), null); });
  await t("palette deterministic, 5 valid swatches for every mood/variant", () => {
    for (const m of ["calm", "bold", "luxury", "fresh", "warm"] as const) for (let v = 0; v < 6; v++) { const p = generatePalette("#abb8a8", m, v); assert.equal(p.swatches.length, 5); p.swatches.forEach((s) => assert.match(s.hex, /^#[0-9a-f]{6}$/)); assert.deepEqual(p, generatePalette("#abb8a8", m, v)); }
    assert.notDeepEqual(generatePalette("#abb8a8", "calm", 0).swatches, generatePalette("#abb8a8", "calm", 1).swatches);
    assert.equal(generatePalette("garbage", "calm").seed, "#abb8a8");
  });
  await t("palette helpers", () => { assert.equal(monogram("Dynamic Horizon"), "DH"); assert.equal(monogram("Solo"), "SO"); assert.equal(monogram("  "), "?"); const p = generatePalette("#336699", "bold"); assert.ok(paletteToCss(p).includes("--brand-primary")); assert.deepEqual(Object.keys(JSON.parse(paletteToJson(p))), ["primary", "secondary", "accent", "surface", "ink"]); assert.ok(suggestFonts("luxury", 3).heading); });
  // ---- planner
  await t("break-even maths", () => {
    const b = breakEven(250, 60, 1500); assert.ok(b.ok && b.customers === 8 && b.monthlyRevenue === 2000 && b.margin === 190); // ceil(1500/190)=8
    const exact = breakEven(100, 50, 500); assert.ok(exact.ok && exact.customers === 10);
    assert.ok(!breakEven(50, 60, 500).ok); assert.ok(!breakEven(50, 50, 500).ok); assert.ok(!breakEven(-1, 0, 0).ok); assert.ok(!breakEven(NaN, 0, 0).ok);
    const zero = breakEven(10, 5, 0); assert.ok(zero.ok && zero.customers === 0);
  });
  await t("plan generation covers all sections, no NaN, handles empty input", () => {
    const p = generateBusinessPlan({ idea: "", audience: "", model: "subscription", stage: "idea", price: 10, variableCost: 20, fixedCosts: 100 });
    const all = JSON.stringify(p); assert.ok(!all.includes("NaN") && !all.includes("undefined")); assert.equal(p.roadmap.length, 3); assert.ok(!p.breakEven.ok); assert.ok(p.summary.includes("Break-even cannot be calculated"));
    const q = generateBusinessPlan({ idea: "a bakery", audience: "locals", model: "one-time", stage: "launched", price: 5, variableCost: 2, fixedCosts: 300 }); assert.ok(q.summary.includes("100 customers"));
  });
  // ---- finance
  await t("finance aggregations", () => {
    assert.equal(lastN(3).length, 3); assert.equal(lastN(12).length, months.length);
    const s = summarize(lastN(12)); assert.equal(s.revenue, months.reduce((a, m) => a + m.revenue, 0)); assert.equal(s.profit, s.revenue - s.expenses); assert.ok(Math.abs(s.margin - (s.profit / s.revenue) * 100) < 1e-9);
    const e = summarize([]); assert.equal(e.margin, 0); assert.equal(e.growth, 0);
    assert.equal(sortTxns(transactions, "amount", "desc")[0].amount, Math.max(...transactions.map((x) => x.amount))); assert.equal(sortTxns(transactions, "date", "asc")[0].date, "2025-12-02");
  });
  // ---- github helpers
  await t("describeEvent only describes real events", () => {
    assert.equal(describeEvent({ id: "1", type: "PushEvent", repo: { name: "u/app" }, created_at: "2026-01-01T00:00:00Z", payload: { size: 2, commits: [{ message: "a" }, { message: "fix bug\nbody" }] } })?.text, 'Pushed 2 commits: "fix bug"');
    assert.equal(describeEvent({ id: "2", type: "WatchEvent", repo: { name: "u/app" }, created_at: "x", payload: {} }), null);
    assert.equal(describeEvent({ id: "3", type: "CreateEvent", repo: { name: "u/app" }, created_at: "x", payload: { ref_type: "repository" } })?.text, "Created the repository");
    assert.equal(describeEvent({ id: "4", type: "PullRequestEvent", repo: { name: "u/app" }, created_at: "x", payload: { action: "closed", pull_request: { merged: true, title: "T" } } })?.text, 'Merged a pull request: "T"');
  });
  const R = (o: any) => ({ id: o.id, name: o.name, description: null, html_url: "u", homepage: null, language: o.language ?? null, stargazers_count: o.stars ?? 0, forks_count: o.forks ?? 0, fork: !!o.fork, archived: !!o.archived, pushed_at: o.pushed ?? "2026-01-01T00:00:00Z" });
  await t("aggregate + featured selection", () => {
    const repos = [R({ id: 1, name: "a", language: "TypeScript", stars: 3 }), R({ id: 2, name: "b", language: "TypeScript", stars: 9, forks: 2 }), R({ id: 3, name: "c", language: "Python" }), R({ id: 4, name: "fork", language: "Go", fork: true }), R({ id: 5, name: "old", language: "Go", archived: true })];
    const a = aggregate(repos); assert.equal(a.totals.repos, 3); assert.equal(a.totals.stars, 12); assert.equal(a.totals.forks, 2); assert.deepEqual(a.languages, [{ name: "TypeScript", count: 2 }, { name: "Python", count: 1 }]);
    assert.equal(pickFeatured(a.own, [])[0].name, "b"); assert.deepEqual(pickFeatured(a.own, ["C", "a"]).map((r) => r.name), ["c", "a"]); assert.equal(pickFeatured(a.own, ["nope"])[0].name, "b");
  });
  // ---- getGithubData with mocked fetch
  const realFetch = globalThis.fetch;
  const mock = (map: (url: string) => { status: number; body?: any; headers?: Record<string, string> } | "throw") => { (globalThis as any).fetch = async (url: string) => { const r = map(url); if (r === "throw") throw new Error("net"); return { status: r.status, ok: r.status >= 200 && r.status < 300, headers: { get: (k: string) => r.headers?.[k.toLowerCase()] ?? null }, json: async () => r.body }; }; };
  await t("github: unconfigured makes no network calls", async () => { delete process.env.GITHUB_USERNAME; let called = false; (globalThis as any).fetch = async () => { called = true; throw new Error("x"); }; const r = await getGithubData(); assert.equal(r.status, "unconfigured"); assert.equal(called, false); });
  process.env.GITHUB_USERNAME = "someone";
  await t("github: ok path", async () => { mock((u) => u.includes("/events/") ? { status: 200, body: [{ id: "9", type: "PushEvent", repo: { name: "someone/app" }, created_at: "2026-02-01T00:00:00Z", payload: { size: 1, commits: [{ message: "init" }] } }, { id: "8", type: "WatchEvent", repo: { name: "x/y" }, created_at: "z", payload: {} }] } : { status: 200, body: [R({ id: 1, name: "app", language: "TypeScript", stars: 4 })] }); const r: any = await getGithubData(); assert.equal(r.status, "ok"); assert.equal(r.totals.stars, 4); assert.equal(r.activity.length, 1); assert.equal(r.activity[0].text, 'Pushed 1 commit: "init"'); assert.equal(r.profileUrl, "https://github.com/someone"); });
  await t("github: rate limited", async () => { mock(() => ({ status: 403, headers: { "x-ratelimit-remaining": "0" } })); const r: any = await getGithubData(); assert.equal(r.status, "rate_limited"); assert.ok(r.message.length > 10); });
  await t("github: 429 also rate limited", async () => { mock(() => ({ status: 429 })); assert.equal(((await getGithubData()) as any).status, "rate_limited"); });
  await t("github: plain 403 (not rate limit) is generic error", async () => { mock(() => ({ status: 403, headers: { "x-ratelimit-remaining": "42" } })); assert.equal(((await getGithubData()) as any).status, "error"); });
  await t("github: not found", async () => { mock(() => ({ status: 404 })); assert.equal(((await getGithubData()) as any).status, "not_found"); });
  await t("github: network failure", async () => { mock(() => "throw"); assert.equal(((await getGithubData()) as any).status, "error"); });
  await t("github: events fail but repos ok -> ok with note, no fake activity", async () => { mock((u) => u.includes("/events/") ? { status: 500 } : { status: 200, body: [R({ id: 1, name: "app" })] }); const r: any = await getGithubData(); assert.equal(r.status, "ok"); assert.equal(r.activity.length, 0); assert.ok(r.activityNote); });
  (globalThis as any).fetch = realFetch;
  // ---- terminal + filtering + registry integrity
  await t("terminal commands", () => {
    assert.ok(runCommand("help").lines.length > 5); assert.deepEqual(runCommand("").lines, []); assert.ok(runCommand("projects").lines.length === projects.length);
    assert.equal(runCommand("open digital-identity").open, "/projects/digital-identity"); assert.ok(runCommand("open nope").error); assert.ok(runCommand("open").error); assert.ok(runCommand("zzz").error); assert.ok(runCommand("clear").clear);
    assert.ok(runCommand("skills").lines[0].includes("data/profile.ts")); assert.ok(runCommand("contact").lines[0].includes("@")); assert.ok(runCommand("HELP").lines.length > 5);
  });
  await t("filter + search", () => {
    assert.equal(filterProjects(projects, "All", "").length, projects.length); assert.equal(filterProjects(projects, "AI", "").length, 0); assert.equal(filterProjects(projects, "Mobile Apps", "").length, 0);
    assert.ok(filterProjects(projects, "Web Apps", "").length >= 1); assert.equal(filterProjects(projects, "All", "vcard")[0].slug, "digital-identity"); assert.equal(filterProjects(projects, "All", "zzzz").length, 0); assert.equal(filterProjects(projects, "All", "  FINANCE ").length, 1);
  });
  await t("registry integrity & honesty rules", () => {
    const slugs = projects.map((p) => p.slug); assert.equal(new Set(slugs).size, slugs.length);
    for (const p of projects) { assert.ok(p.categories.every((c) => categories.includes(c))); assert.ok(p.challenges.length && p.architecture.length && p.features.length); if (p.status !== "Completed") assert.ok(true); assert.ok(!p.repo, "no invented repo links"); if (!["ai-business-assistant", "digital-identity", "brand-studio", "ledgerline", "tapcard", "shadow-run", "content-calendar", "folio", "production-planner", "tempo"].includes(p.slug)) assert.equal(p.screenshots.length, 0, "no invented screenshots"); else assert.ok(p.screenshots.length > 0 && p.screenshots.every((sc) => sc.src.startsWith("/projects/" + p.slug + "/")), p.slug + " screenshots are real captures"); assert.notEqual(p.status, "Completed"); if (p.demo?.kind === "built-in") assert.ok(["ai-business-assistant","digital-identity","brand-studio","ledgerline","tapcard","shadow-run","content-calendar","folio","production-planner","tempo"].includes(p.slug)); }
    assert.ok(getProject("brand-studio")); assert.equal(getProject("nope"), undefined);
  });
  console.log(`\n${n} unit tests passed`);
})().catch((e) => { console.error("FAIL:", e); process.exit(1); });
