"use client";
import { useMemo, useState } from "react";
import { contrastRatio, generatePalette, monogram, moods, normalizeHex, paletteToCss, paletteToJson, readableOn, suggestFonts, type Mood } from "@/lib/palette";
import { CopyButton } from "../CopyButton";
import { PrototypeBanner } from "../ui";
import { cn } from "@/lib/cn";

export function BrandStudioDemo() {
  const [seed, setSeed] = useState("#abb8a8");
  const [hexInput, setHexInput] = useState("#abb8a8");
  const [mood, setMood] = useState<Mood>("calm");
  const [variant, setVariant] = useState(0);
  const [name, setName] = useState("Dynamic Horizon");
  const [format, setFormat] = useState<"css" | "json">("css");

  const palette = useMemo(() => generatePalette(seed, mood, variant), [seed, mood, variant]);
  const fonts = suggestFonts(mood, variant);
  const [primary, secondary, accent, surface, ink] = palette.swatches;
  const exportText = format === "css" ? paletteToCss(palette) : paletteToJson(palette);
  const hexValid = normalizeHex(hexInput) !== null;

  function onHex(v: string) {
    setHexInput(v);
    const n = normalizeHex(v);
    if (n) { setSeed(n); setVariant(0); }
  }

  return (
    <div>
      <PrototypeBanner>Working prototype. Palettes come from colour-theory rules (harmonies and WCAG contrast), not from an AI model.</PrototypeBanner>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="card space-y-5 p-5">
          <div>
            <label className="label" htmlFor="bs-hex">Seed colour</label>
            <div className="flex gap-3">
              <input aria-label="Pick a seed colour" type="color" value={seed} onChange={(e) => { setSeed(e.target.value); setHexInput(e.target.value); setVariant(0); }} className="h-11 w-14 cursor-pointer rounded-lg border border-line bg-transparent" />
              <input id="bs-hex" className={cn("input font-mono", !hexValid && "border-red-400")} value={hexInput} onChange={(e) => onHex(e.target.value)} aria-invalid={!hexValid} />
            </div>
            {!hexValid ? <p className="mt-1 text-xs text-red-300">Enter a valid hex colour such as #abb8a8.</p> : null}
          </div>
          <div>
            <p className="label">Mood</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Mood">
              {moods.map((m) => (
                <button key={m.id} type="button" aria-pressed={mood === m.id} onClick={() => { setMood(m.id); setVariant(0); }} className={cn("rounded-full border px-3.5 py-1.5 text-sm transition", mood === m.id ? "border-sage bg-sage text-black" : "border-line text-mute hover:border-sage hover:text-cream")}>{m.label}</button>
              ))}
            </div>
            <p className="mt-2 text-xs text-mute">{moods.find((m) => m.id === mood)?.blurb}</p>
          </div>
          <div><label className="label" htmlFor="bs-name">Brand name</label><input id="bs-name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <button type="button" className="btn btn-primary w-full" onClick={() => setVariant((v) => v + 1)}>Shuffle variation <span className="font-mono text-xs opacity-70">#{variant + 1}</span></button>
        </div>

        <div className="space-y-4">
          <ul className="grid grid-cols-5 gap-2" aria-label="Generated palette">
            {palette.swatches.map((s) => {
              const text = readableOn(s.hex);
              const ratio = contrastRatio(s.hex, text);
              const pass = ratio >= 4.5;
              return (
                <li key={s.role} className="overflow-hidden rounded-xl border border-line">
                  <div className="flex h-28 flex-col justify-end p-2" style={{ background: s.hex, color: text }}>
                    <span className="text-[11px] font-semibold">{s.role}</span>
                    <span className="font-mono text-[11px]">{s.hex}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-panel px-2 py-1.5 text-[10px] text-mute">
                    <span title="Contrast of readable text on this colour">{ratio.toFixed(1)}:1</span>
                    <span className={pass ? "text-emerald-300" : "text-amber-200"}>{pass ? "AA" : "low"}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
            <div className="card grid place-items-center p-5">
              <svg viewBox="0 0 120 120" role="img" aria-label={`Monogram concept for ${name || "your brand"}`} className="h-32 w-32">
                <rect x="6" y="6" width="108" height="108" rx="28" fill={primary.hex} />
                <circle cx="94" cy="26" r="9" fill={accent.hex} />
                <text x="60" y="73" textAnchor="middle" fontSize="44" fontWeight="700" fill={readableOn(primary.hex)} style={{ fontFamily: "ui-sans-serif, system-ui" }}>{monogram(name)}</text>
              </svg>
            </div>
            <div className="card p-5" style={{ background: surface.hex, color: ink.hex }}>
              <p className="text-xs uppercase tracking-widest opacity-60">Identity concept</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: primary.hex === surface.hex ? ink.hex : ink.hex }}>{name || "Your brand"}</p>
              <p className="mt-2 text-sm"><strong>Headings:</strong> {fonts.heading} · <strong>Body:</strong> {fonts.body}</p>
              <span className="mt-4 inline-block rounded-full px-4 py-2 text-sm font-semibold" style={{ background: primary.hex, color: readableOn(primary.hex) }}>Call to action</span>
              <span className="ml-2 inline-block rounded-full px-4 py-2 text-sm font-semibold" style={{ background: secondary.hex, color: readableOn(secondary.hex) }}>Secondary</span>
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex gap-2" role="group" aria-label="Export format">
                {(["css", "json"] as const).map((f) => (
                  <button key={f} type="button" aria-pressed={format === f} onClick={() => setFormat(f)} className={cn("rounded-full border px-3 py-1 font-mono text-xs", format === f ? "border-sage text-sage" : "border-line text-mute")}>{f.toUpperCase()}</button>
                ))}
              </div>
              <CopyButton text={exportText} label="Copy export" />
            </div>
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-cream/80">{exportText}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
