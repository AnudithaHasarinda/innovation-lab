/**
 * PROJECT REGISTRY — the single place to add projects.
 *
 * Honesty rules built into the UI:
 *  - `status` is always shown. Only mark a project "Completed" when it truly is.
 *  - The "GitHub" button appears only when `repo` is set.
 *  - The "Live demo" button appears only when `demo` is set.
 *  - Empty screenshot lists render a clear empty state instead of fake images.
 *
 * To add a project: copy one object below, change the fields, save. The card, filters,
 * search and the detail page (/projects/<slug>) update automatically.
 */
export type Category = "AI" | "Web Apps" | "Mobile Apps" | "Experiments" | "Open Source";
export type Status = "Completed" | "Prototype" | "In development" | "Planned";

export const categories: Category[] = ["AI", "Web Apps", "Mobile Apps", "Experiments", "Open Source"];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categories: Category[];
  stack: string[];
  status: Status;
  /** Plain-language honesty note shown next to the status badge */
  statusNote?: string;
  /** Public GitHub URL. Omit if there is no public repository. */
  repo?: string;
  /** "built-in" = interactive demo rendered inside this lab; "external" = link out to a hosted app */
  demo?: { kind: "built-in" | "external"; url?: string; label: string };
  screenshots: { src: string; alt: string }[];
  features: string[];
  problem: string;
  architecture: string[];
  process: string[];
  challenges: { challenge: string; solution: string }[];
  future: string[];
  docs: { title: string; body: string }[];
};

export const projects: Project[] = [
  {
    slug: "ai-business-assistant",
    name: "AI Business Assistant",
    tagline: "Turn a rough idea into a structured business plan.",
    description:
      "An interactive planning assistant: describe an idea, audience and pricing and it produces a lean canvas, SWOT, break-even maths and a 30-60-90 day plan.",
    categories: ["Experiments", "Web Apps"],
    stack: ["TypeScript", "React", "Next.js"],
    status: "Prototype",
    statusNote:
      "Rule-based engine. No AI model is connected yet; the engine is isolated in lib/planner.ts so a model can be plugged in later.",
    demo: { kind: "built-in", label: "Try the assistant" },
    screenshots: [],
    features: [
      "Lean canvas generated from your inputs",
      "SWOT analysis tailored to stage and revenue model",
      "Real break-even calculation from price and costs",
      "30-60-90 day action plan",
      "Everything runs in the browser; nothing is sent anywhere",
    ],
    problem:
      "Early-stage founders often stall at the blank page. A structured starting point makes the next conversation, with advisors or customers, much more productive.",
    architecture: [
      "Pure function generateBusinessPlan(input) in lib/planner.ts returns a typed BusinessPlan.",
      "The React demo only collects input and renders the result, so the engine is unit-testable and replaceable.",
      "A future AI provider can implement the same input/output contract without touching the UI.",
    ],
    process: [
      "Defined the input contract and the output sections first.",
      "Implemented deterministic templates so results are reproducible and explainable.",
      "Added the break-even maths as the one numerically checked section.",
    ],
    challenges: [
      {
        challenge: "Avoiding the appearance of AI where there is none.",
        solution: "The prototype is labelled as rule-based everywhere it appears, and the engine boundary is documented.",
      },
      {
        challenge: "Break-even maths with missing or impossible inputs.",
        solution: "The function returns a clear explanation instead of NaN when price does not exceed variable cost.",
      },
    ],
    future: ["Plug in an AI model behind the same contract", "Export the plan as PDF", "Save plans locally"],
    docs: [
      {
        title: "Break-even formula",
        body: "Break-even customers = ceil(monthly fixed costs / (price - variable cost per customer)). Defined only when price is greater than variable cost.",
      },
    ],
  },
  {
    slug: "digital-identity",
    name: "Digital Identity",
    tagline: "A working digital contact card with QR sharing.",
    description:
      "Fill in your details and get a live QR code plus a downloadable .vcf contact file that phones import in one tap.",
    categories: ["Web Apps", "Experiments"],
    stack: ["TypeScript", "React", "vCard 3.0", "QR code"],
    status: "Prototype",
    statusNote: "Functional prototype. The card is generated in your browser and never uploaded.",
    demo: { kind: "built-in", label: "Build a card" },
    screenshots: [],
    features: [
      "Standards-based vCard 3.0 with correct escaping and line folding",
      "Live QR code that updates as you type",
      "One-click .vcf download",
      "Copy the raw vCard text",
    ],
    problem: "Paper business cards are easy to lose and slow to save. A scannable digital card removes the typing.",
    architecture: [
      "lib/vcard.ts builds RFC-compliant vCard text from a typed ContactCard.",
      "The QR image is rendered client-side from the same text with the qrcode library.",
      "Downloads use a Blob URL, so no server is involved.",
    ],
    process: [
      "Started from the vCard specification and listed required versus optional fields.",
      "Built the serializer as a pure function and verified escaping rules.",
      "Connected it to the live form and QR preview.",
    ],
    challenges: [
      {
        challenge: "Commas, semicolons and line breaks break vCard fields.",
        solution: "Every value is escaped per the spec, and long lines are folded at 75 characters.",
      },
      {
        challenge: "QR codes get unreadable as data grows.",
        solution: "The demo shows a size warning when the encoded card becomes large.",
      },
    ],
    future: ["Photo support", "Multiple saved cards", "Wallet pass export"],
    docs: [{ title: "Format", body: "vCard 3.0 (RFC 2426), UTF-8, CRLF line endings, folded at 75 characters." }],
  },
  {
    slug: "brand-studio",
    name: "Brand Studio",
    tagline: "Generate a colour palette and identity concept.",
    description:
      "Pick a seed colour and a mood to generate a five-colour palette, font pairing and monogram concept with live accessibility checks.",
    categories: ["Web Apps", "Experiments"],
    stack: ["TypeScript", "React", "Colour theory", "WCAG contrast"],
    status: "Prototype",
    statusNote: "Functional prototype. Palettes are generated by colour-theory rules, not by an AI model.",
    demo: { kind: "built-in", label: "Open Brand Studio" },
    screenshots: [],
    features: [
      "Five moods built on analogous, complementary and triadic harmonies",
      "WCAG contrast ratio shown for text on every swatch",
      "Font pairing suggestions per mood",
      "Monogram logo concept in SVG",
      "Export as CSS variables or JSON",
    ],
    problem: "Choosing brand colours is subjective, but accessibility and harmony are measurable. This tool makes both visible.",
    architecture: [
      "lib/palette.ts converts between hex and HSL and generates harmonies from a seed.",
      "Contrast uses the WCAG relative luminance formula.",
      "The UI is a thin layer over the pure functions.",
    ],
    process: [
      "Implemented colour conversion and verified round trips.",
      "Defined mood presets by saturation, lightness and hue offsets.",
      "Added contrast badges so every palette shows its accessibility.",
    ],
    challenges: [
      {
        challenge: "Generated palettes can fail accessibility.",
        solution: "Each swatch shows the contrast ratio and a pass or fail badge for AA text.",
      },
    ],
    future: ["Save favourite palettes", "Image-based seed colour", "Export to design tools"],
    docs: [{ title: "Contrast", body: "Ratio = (L1 + 0.05) / (L2 + 0.05) with WCAG relative luminance. AA normal text needs at least 4.5." }],
  },
  {
    slug: "finance-dashboard",
    name: "Finance Dashboard",
    tagline: "Interactive charts over sample financial data.",
    description:
      "A functional dashboard with KPIs, revenue versus expenses, expense breakdown and a sortable table. All figures are sample data.",
    categories: ["Web Apps"],
    stack: ["TypeScript", "React", "SVG charts"],
    status: "Prototype",
    statusNote: "All numbers are fictional sample data, clearly labelled inside the demo.",
    demo: { kind: "built-in", label: "Open dashboard" },
    screenshots: [],
    features: [
      "Switch between 3, 6 and 12 month ranges",
      "KPIs computed from the data, not hard-coded",
      "Hand-built accessible SVG charts with no chart library",
      "Sortable transactions table",
    ],
    problem: "Numbers become decisions only when trends are visible. This demonstrates how a small, dependency-free dashboard can do that.",
    architecture: [
      "lib/finance.ts holds the sample dataset and the aggregation functions.",
      "components/charts.tsx renders SVG line, bar and donut charts from plain arrays.",
      "No chart dependency keeps the bundle small.",
    ],
    process: [
      "Modelled the dataset and aggregations first.",
      "Built scale and path helpers for the charts.",
      "Added range controls and the sortable table.",
    ],
    challenges: [
      {
        challenge: "Charts must stay readable and accessible without a library.",
        solution: "Each chart has a title, description and a text summary for screen readers.",
      },
    ],
    future: ["Import a CSV", "Budget targets", "Month-over-month annotations"],
    docs: [{ title: "Data", body: "Sample figures only. Replace lib/finance.ts data to connect real numbers." }],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
