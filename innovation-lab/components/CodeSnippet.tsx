"use client";
import { useEffect, useState } from "react";

const CODE = `const lab = {
  curiosity: "always on",
  rule: "label every prototype honestly",
};

export function build(idea: string) {
  return prototype(idea)
    .test()
    .learn()
    .improve();
}`;

/** Types the snippet out. Users who prefer reduced motion see the full text immediately. */
export function CodeSnippet() {
  const [n, setN] = useState(CODE.length); // server render shows full text (no flash, works without JS)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    setN(0);
    const id = setInterval(() => {
      i += 2;
      setN(Math.min(i, CODE.length));
      if (i >= CODE.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);
  const done = n >= CODE.length;
  return (
    <figure className="card overflow-hidden" aria-label="Animated code snippet">
      <figcaption className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-xs text-mute">lab.ts</span>
      </figcaption>
      <pre className="min-h-[15rem] overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-cream/90">
        <code aria-label={CODE}>
          <span aria-hidden="true">{CODE.slice(0, n)}</span>
          <span aria-hidden="true" className={done ? "animate-blink text-sage" : "text-sage"}>▍</span>
        </code>
      </pre>
    </figure>
  );
}
