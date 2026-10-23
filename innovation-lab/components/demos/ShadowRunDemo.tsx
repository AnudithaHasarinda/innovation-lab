"use client";
import { assetPath } from "@/lib/assetPath";

const SRC = "/projects/shadow-run/app.html";

/**
 * Runs the real SHADOW RUN game (public/projects/shadow-run/app.html) in a frame.
 * It is a single self-contained HTML file. Progress is saved only in this browser.
 */
export function ShadowRunDemo() {
  const src = assetPath(SRC);
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-mute">
        This is the real game, running in your browser. Move with the arrow keys or <strong className="text-cream">W A S D</strong> (or swipe on a touch screen). On a phone it is played in landscape, so use the
        button below to open it full screen and turn the phone sideways. Progress is saved on this device only. There are no accounts and no network requests.
      </p>
      <div className="demo-frame">
        <iframe
          title="SHADOW RUN game"
          src={src}
          className="block aspect-video min-h-[320px] w-full bg-black"
          loading="lazy"
          allow="fullscreen; autoplay"
        />
      </div>
      <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Open the game in its own window ↗</a>
    </div>
  );
}
