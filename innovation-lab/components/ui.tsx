import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Status } from "@/data/projects";

export function SectionHeading({ eyebrow, title, children, id }: { eyebrow: string; title: string; children?: ReactNode; id?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-sage">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {children ? <p className="mt-3 text-mute">{children}</p> : null}
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-start gap-3 border-dashed p-8">
      <span aria-hidden="true" className="font-mono text-2xl text-sage">{"{ }"}</span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children ? <p className="max-w-xl text-sm leading-relaxed text-mute">{children}</p> : null}
      {action}
    </div>
  );
}

const statusStyle: Record<Status, string> = {
  Completed: "border-emerald-400/40 text-emerald-300",
  Prototype: "border-sage/50 text-sage",
  "In development": "border-amber-300/40 text-amber-200",
  Planned: "border-line text-mute",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider", statusStyle[status])}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden rounded-xl bg-white/5", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export function PrototypeBanner({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 flex items-start gap-2 rounded-xl border border-sage/30 bg-sage/5 px-4 py-3 text-xs leading-relaxed text-sage">
      <span aria-hidden="true" className="font-mono">[prototype]</span>
      <span>{children}</span>
    </p>
  );
}
