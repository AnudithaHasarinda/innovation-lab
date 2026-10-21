export type Mood = "calm" | "bold" | "luxury" | "fresh" | "warm";
export const moods: { id: Mood; label: string; blurb: string }[] = [
  { id: "calm", label: "Calm", blurb: "Analogous, soft and trustworthy" },
  { id: "bold", label: "Bold", blurb: "Complementary, high energy" },
  { id: "luxury", label: "Luxury", blurb: "Deep base with a refined accent" },
  { id: "fresh", label: "Fresh", blurb: "Triadic, lively and modern" },
  { id: "warm", label: "Warm", blurb: "Analogous warm tones, friendly" },
];

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const mod360 = (h: number) => ((h % 360) + 360) % 360;

export function normalizeHex(input: string): string | null {
  let s = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(s)) s = s.split("").map((c) => c + c).join("");
  return /^[0-9a-fA-F]{6}$/.test(s) ? "#" + s.toLowerCase() : null;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex) || "#000000";
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
}

/** Returns [h 0-360, s 0-100, l 0-100] */
export function hexToHsl(hex: string): [number, number, number] {
  const [r8, g8, b8] = hexToRgb(hex);
  const r = r8 / 255, g = g8 / 255, b = b8 / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [mod360(h), s * 100, l * 100];
}

export function hslToHex(h: number, s: number, l: number): string {
  const S = clamp(s, 0, 100) / 100, L = clamp(l, 0, 100) / 100, H = mod360(h);
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = L - c / 2;
  let rgb: [number, number, number];
  if (H < 60) rgb = [c, x, 0];
  else if (H < 120) rgb = [x, c, 0];
  else if (H < 180) rgb = [0, c, x];
  else if (H < 240) rgb = [0, x, c];
  else if (H < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgbToHex((rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255);
}

export function relativeLuminance(hex: string): number {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a), lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Black or white, whichever reads better on the given background. */
export const readableOn = (bg: string) => (contrastRatio(bg, "#000000") >= contrastRatio(bg, "#ffffff") ? "#000000" : "#ffffff");

export type Swatch = { role: string; hex: string };
export type Palette = { mood: Mood; seed: string; variant: number; swatches: Swatch[] };

/** Deterministic: the same seed, mood and variant always give the same palette. */
export function generatePalette(seedInput: string, mood: Mood, variant = 0): Palette {
  const seed = normalizeHex(seedInput) || "#abb8a8";
  const [h0, s0, l0] = hexToHsl(seed);
  const h = mod360(h0 + variant * 18);
  const S = clamp(s0, 18, 92);
  const sw = (role: string, hh: number, ss: number, ll: number): Swatch => ({ role, hex: hslToHex(hh, ss, ll) });
  let swatches: Swatch[];
  switch (mood) {
    case "calm":
      swatches = [sw("Primary", h, clamp(S, 25, 55), 42), sw("Secondary", h + 24, clamp(S, 22, 50), 58), sw("Accent", h - 28, clamp(S + 10, 30, 65), 66), sw("Surface", h, 18, 94), sw("Ink", h, 28, 14)];
      break;
    case "bold":
      swatches = [sw("Primary", h, clamp(S + 15, 60, 95), 48), sw("Secondary", h + 180, clamp(S + 10, 55, 90), 52), sw("Accent", h + 30, 90, 58), sw("Surface", h, 20, 96), sw("Ink", h, 40, 10)];
      break;
    case "luxury":
      swatches = [sw("Primary", h, clamp(S, 30, 60), 14), sw("Secondary", h, clamp(S - 10, 15, 45), 26), sw("Accent", 42, 62, 56), sw("Surface", 40, 22, 93), sw("Ink", h, 20, 8)];
      break;
    case "fresh":
      swatches = [sw("Primary", h, clamp(S + 10, 55, 90), 50), sw("Secondary", h + 120, clamp(S, 50, 85), 52), sw("Accent", h + 240, clamp(S, 50, 85), 60), sw("Surface", h + 120, 25, 96), sw("Ink", h + 240, 35, 14)];
      break;
    default: // warm
      swatches = [sw("Primary", 14 + (h % 40), clamp(S + 10, 55, 90), 50), sw("Secondary", 32 + (h % 24), 75, 58), sw("Accent", 6 + (h % 20), 80, 44), sw("Surface", 36, 40, 95), sw("Ink", 18, 40, 13)];
  }
  void l0;
  return { mood, seed, variant, swatches };
}

const fontPairs: Record<Mood, { heading: string; body: string }[]> = {
  calm: [{ heading: "Fraunces", body: "Inter" }, { heading: "Lora", body: "Source Sans 3" }],
  bold: [{ heading: "Archivo Black", body: "Work Sans" }, { heading: "Space Grotesk", body: "DM Sans" }],
  luxury: [{ heading: "Playfair Display", body: "Montserrat" }, { heading: "Cormorant Garamond", body: "Jost" }],
  fresh: [{ heading: "Poppins", body: "Nunito Sans" }, { heading: "Outfit", body: "Inter" }],
  warm: [{ heading: "DM Serif Display", body: "DM Sans" }, { heading: "Merriweather", body: "Open Sans" }],
};
export const suggestFonts = (mood: Mood, variant = 0) => fontPairs[mood][Math.abs(variant) % fontPairs[mood].length];

export function monogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export const paletteToCss = (p: Palette) =>
  ":root {\n" + p.swatches.map((s) => `  --brand-${s.role.toLowerCase()}: ${s.hex};`).join("\n") + "\n}";
export const paletteToJson = (p: Palette) =>
  JSON.stringify(Object.fromEntries(p.swatches.map((s) => [s.role.toLowerCase(), s.hex])), null, 2);
