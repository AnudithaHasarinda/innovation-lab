"use client";
import { assetPath } from "@/lib/assetPath";

const SRC = "/projects/tapcard/prototype.html";

/**
 * Runs the real Tapcard prototype (public/projects/tapcard/prototype.html) in a frame.
 * The prototype is a single self-contained HTML file; it keeps its data only in this browser.
 */
export function TapcardDemo() {
  const src = assetPath(SRC);
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-mute">
        This is the real prototype, running in your browser. Anything you type stays on this device. To try <strong className="text-cream">Nearby</strong>, open the
        prototype in two windows (button below), tap Nearby in both, then tap Start Radar. It only finds windows of the same browser; Bluetooth between real phones is not built yet.
      </p>
      <div className="card overflow-hidden">
        <iframe
          title="Tapcard prototype"
          src={src}
          className="block h-[820px] w-full bg-white"
          loading="lazy"
          allow="clipboard-write; web-share"
        />
      </div>
      <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Open the prototype in its own window ↗</a>
    </div>
  );
}
