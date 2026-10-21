"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, projects, type Category, type Project } from "@/data/projects";
import { EmptyState, StatusBadge } from "./ui";
import { cn } from "@/lib/cn";

export function filterProjects(list: Project[], cat: Category | "All", q: string): Project[] {
  const query = q.trim().toLowerCase();
  return list.filter((p) => {
    if (cat !== "All" && !p.categories.includes(cat)) return false;
    if (!query) return true;
    return [p.name, p.tagline, p.description, p.stack.join(" "), p.categories.join(" "), p.status].join(" ").toLowerCase().includes(query);
  });
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="card card-glow flex h-full flex-col p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <StatusBadge status={p.status} />
        <span className="font-mono text-[11px] text-mute">{p.categories.join(" · ")}</span>
      </div>
      <h3 className="text-xl font-bold tracking-tight">{p.name}</h3>
      <p className="mt-1 text-sm font-medium text-sage">{p.tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{p.description}</p>
      {p.statusNote ? <p className="mt-3 rounded-lg border border-line bg-black/30 px-3 py-2 text-xs leading-relaxed text-mute">{p.statusNote}</p> : null}
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technology stack">
        {p.stack.map((s) => (
          <li key={s} className="chip">{s}</li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/projects/${p.slug}`} className="btn btn-primary !py-2">View project</Link>
        {p.demo?.kind === "built-in" ? <Link href={`/projects/${p.slug}#demo`} className="btn btn-ghost !py-2">Live demo</Link> : null}
        {p.demo?.kind === "external" && p.demo.url ? <a href={p.demo.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !py-2">Live demo ↗</a> : null}
        {p.repo ? <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !py-2">GitHub ↗</a> : null}
      </div>
    </article>
  );
}

export function ProjectShowcase() {
  const [cat, setCat] = useState<Category | "All">("All");
  const [q, setQ] = useState("");
  const results = useMemo(() => filterProjects(projects, cat, q), [cat, q]);
  const count = (c: Category | "All") => (c === "All" ? projects.length : projects.filter((p) => p.categories.includes(c)).length);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn("rounded-full border px-4 py-2 text-sm transition", cat === c ? "border-sage bg-sage text-black" : "border-line bg-white/5 text-mute hover:border-sage hover:text-cream")}
            >
              {c} <span className="ml-1 font-mono text-[11px] opacity-70">{count(c)}</span>
            </button>
          ))}
        </div>
        <div className="w-full lg:w-72">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <input id="project-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, stack, status..." className="input" />
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{results.length} project{results.length === 1 ? "" : "s"} shown</p>

      {projects.length === 0 ? (
        <EmptyState title="No projects yet">The lab is ready for its first project. Add an object to data/projects.ts and it appears here automatically.</EmptyState>
      ) : results.length === 0 ? (
        <EmptyState
          title={cat !== "All" && !q ? `No ${cat} projects yet` : "Nothing matches that search"}
          action={<button type="button" className="btn btn-ghost" onClick={() => { setCat("All"); setQ(""); }}>Show all projects</button>}
        >
          {cat !== "All" && !q ? "This category is ready and waiting. Projects tagged with it in data/projects.ts will appear here." : "Try a different word, or clear the filters."}
        </EmptyState>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {results.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
