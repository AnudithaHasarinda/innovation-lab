"use client";
import type { ReactNode } from "react";
import { assetPath } from "@/lib/assetPath";

/**
 * Runs a standalone, self-contained HTML app from /public in a frame.
 * Used for projects that are a single HTML file (Brand Studio, Ledgerline and others).
 */
export function FrameDemo({ src, title, note, height = 820, openLabel = "Open in its own window" }: {
  src: string; title: string; note?: ReactNode; height?: number; openLabel?: string;
}) {
  const url = assetPath(src);
  return (
    <div className="space-y-4">
      {note ? <p className="rounded-xl border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-mute">{note}</p> : null}
      <div className="card overflow-hidden">
        <iframe title={title} src={url} className="block w-full bg-white" style={{ height }} loading="lazy" allow="clipboard-write" />
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{openLabel} ↗</a>
    </div>
  );
}
