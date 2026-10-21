"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

type Line = { kind: "in" | "out" | "err"; text: string };

const HELP = [
  "Available commands:",
  "  help            show this list",
  "  about           who built this lab",
  "  projects        list the projects",
  "  open <slug>     open a project page",
  "  skills          technologies listed in the profile",
  "  github          GitHub connection status",
  "  contact         how to reach me",
  "  clear           clear the screen",
];

export function runCommand(input: string): { lines: string[]; error?: boolean; open?: string; clear?: boolean } {
  const [cmd, ...rest] = input.trim().split(/\s+/);
  switch ((cmd || "").toLowerCase()) {
    case "":
      return { lines: [] };
    case "help":
      return { lines: HELP };
    case "about":
      return { lines: [`${site.name} — ${site.role}`, `Interests: ${site.interests.join(", ")}.`, "This lab holds experiments and prototypes. Each one is labelled with its true status."] };
    case "projects":
      return { lines: projects.length ? projects.map((p) => `${p.slug.padEnd(24)} [${p.status}]`) : ["No projects yet. Add one in data/projects.ts."] };
    case "open": {
      const slug = rest[0];
      if (!slug) return { lines: ["Usage: open <slug>   (try: projects)"], error: true };
      const p = projects.find((x) => x.slug === slug);
      return p ? { lines: [`Opening ${p.name}...`], open: `/projects/${p.slug}` } : { lines: [`No project called "${slug}". Type "projects" to see the list.`], error: true };
    }
    case "skills": {
      const all = [...profile.languages, ...profile.frameworks, ...profile.tools].map((s) => s.name);
      return { lines: all.length ? [all.join(", ")] : ["No technologies listed yet. They are added in data/profile.ts, and only real ones are shown."] };
    }
    case "github":
      return { lines: [site.githubUsername ? `https://github.com/${site.githubUsername}` : "GitHub is not connected yet. Set GITHUB_USERNAME in .env.local."] };
    case "contact":
      return { lines: [site.email] };
    case "clear":
      return { lines: [], clear: true };
    default:
      return { lines: [`command not found: ${cmd}. Type "help".`], error: true };
  }
}

export function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: 'Welcome to the Innovation Lab terminal. Type "help" to begin.' }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const input = value;
    const res = runCommand(input);
    setHistory((h) => (input.trim() ? [...h, input] : h));
    setCursor(-1);
    setValue("");
    if (res.clear) return setLines([]);
    setLines((l) => [...l, { kind: "in", text: input }, ...res.lines.map((t): Line => ({ kind: res.error ? "err" : "out", text: t }))]);
    if (res.open) setTimeout(() => router.push(res.open as string), 350);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown" && cursor !== -1) {
      e.preventDefault();
      const i = cursor + 1;
      if (i >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(i);
        setValue(history[i]);
      }
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-xs text-mute">lab — terminal</span>
      </div>
      <div ref={box} role="log" aria-live="polite" aria-label="Terminal output" className="h-72 overflow-y-auto p-5 font-mono text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <p key={i} className={l.kind === "in" ? "text-cream" : l.kind === "err" ? "text-red-300" : "text-mute"} style={{ whiteSpace: "pre-wrap" }}>
            {l.kind === "in" ? <span className="text-sage">$ </span> : null}
            {l.text}
          </p>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-line px-5 py-3 font-mono text-[13px]">
        <label htmlFor="term-input" className="text-sage">$</label>
        <input
          id="term-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          spellCheck={false}
          placeholder='type "help"'
          aria-label="Terminal command"
          className="min-w-0 flex-1 bg-transparent text-cream placeholder:text-mute/60 focus:outline-none"
        />
        <button type="submit" className="btn btn-ghost !px-3 !py-1 !text-xs">Run</button>
      </form>
    </div>
  );
}
