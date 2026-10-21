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
  {
    slug: "tapcard",
    name: "Tapcard",
    tagline: "A digital business card you share by QR code, nearby radar or your phone's own sharing.",
    description:
      "Build a card with a privacy level for every detail, then share it by QR code, a Nearby radar, or the phone's own share sheet. Includes templates, a print kit, a contacts list with lead scores and meeting notes.",
    categories: ["Web Apps"],
    stack: ["HTML", "CSS", "JavaScript", "Canvas", "Web Crypto API", "BroadcastChannel", "Web Share API", "qrcode.js"],
    status: "Prototype",
    statusNote:
      "Works today in the browser: card editing with privacy levels, templates, QR sharing, a print kit, contacts with lead scores, meeting notes and a Nearby radar tab. Not built yet: a server or accounts (data stays in your own browser) and real profile links (they are placeholders). The Nearby radar and its consent and encrypted-transfer steps only work between windows of the same browser; Bluetooth between real phones needs a mobile app that does not exist yet. It has not been tested on real Android or iPhone devices, and sharing with non-users through AirDrop or Quick Share is untried on real phones too.",
    demo: { kind: "built-in", label: "Try the prototype" },
    screenshots: [
      { src: "/projects/tapcard/card.png", alt: "Tapcard card editor with a phone preview showing a sample card. Sample data only." },
      { src: "/projects/tapcard/qr.png", alt: "Tapcard QR code tab showing a scannable code for the sample card." },
      { src: "/projects/tapcard/nearby.png", alt: "Tapcard Nearby radar with one other window found, using the test radar between two browser windows." },
      { src: "/projects/tapcard/print.png", alt: "Tapcard print kit preview of a business card with a QR code. Sample data only." },
      { src: "/projects/tapcard/contacts.png", alt: "Tapcard contacts list with lead scores, using three fictional sample contacts." },
    ],
    features: [
      "Privacy level for each detail: public, or hidden until the other person shares theirs back",
      "Templates, a Free and a Premium view, and separate identities",
      "QR code that carries only the public details",
      "Print kit: business card, round sticker, table sign and review sign, exported as a PNG",
      "Contacts list with a rule-based lead score and follow-up dates, plus meeting notes",
      "Nearby tab: radar, invitation, consent and encrypted transfer (test radar between browser windows)",
      "Share with anyone nearby through the phone's own share sheet, using a standard contact file",
    ],
    problem:
      "Paper cards get lost and most digital cards ask the person receiving them to install an app. Tapcard explores a card that works for anyone with a phone camera, while the owner decides which details each person may see.",
    architecture: [
      "A single self-contained HTML file with plain JavaScript and no framework.",
      "All data is kept in the browser's local storage. There is no server and no account.",
      "Canvas draws the print kit. qrcode.js draws QR codes. The contact card is a standard vCard (.vcf) file.",
      "Nearby messages are encrypted in the page with the Web Crypto API (ECDH P-256, HKDF and AES-GCM). In the browser a BroadcastChannel carries them between windows.",
      "A transport boundary lets a native plugin named TapcardNearby replace the test radar later without changing the page. The adapter code has never run on real hardware.",
    ],
    process: [
      "Started with the card, the privacy levels and the QR code, since they work on any phone camera.",
      "Added the print kit, contacts and meeting notes around that core.",
      "Built the whole Nearby flow (radar, invite, accept, encrypted transfer, save, QR fallback) against a test transport, then wrote down the contract a native plugin must meet.",
      "Kept every limit in plain words in the interface and in the spec, so nothing claims more than it does.",
    ],
    challenges: [
      {
        challenge: "Browsers cannot advertise over Bluetooth, and Safari on iPhone has no Web Bluetooth at all.",
        solution: "The page talks to a small transport interface. In the browser it uses a test radar between windows. A planned Capacitor plugin would use real Bluetooth Low Energy, and the page switches to it automatically when it is present.",
      },
      {
        challenge: "iPhones do not accept unsolicited Bluetooth files from third-party apps, so a card cannot be pushed to someone without Tapcard.",
        solution: "Sharing with non-users goes through the phone's own share sheet (AirDrop on iPhone, Quick Share on Android) with a standard .vcf file. Details marked 'after connect' start unticked, because a non-user can never connect back.",
      },
      {
        challenge: "A nearby radar must only show real users and must not guess distance.",
        solution: "Two phones only see each other if both run Tapcard in the foreground. Signal strength is never turned into metres; without proximity data every device sits on one ring labelled 'Signal detected'.",
      },
    ],
    future: [
      "Build and test the TapcardNearby plugin on real Android and iPhone devices",
      "Try the share-sheet route (AirDrop and Quick Share) on real phones",
      "Add a Supabase backend with accounts so profile links become real",
      "Wrap the app with Capacitor for the Android and iOS stores",
    ],
    docs: [
      {
        title: "Native Nearby plugin contract",
        body: "The page expects a plugin called TapcardNearby with requestPermissions, checkAvailability, start, send and stop, and the events peerFound, peerLost and message. Messages are already encrypted by the page, so the plugin only moves bytes. This plugin does not exist yet.",
      },
      {
        title: "Test on two real phones before shipping",
        body: "Android to Android, Android to iPhone and iPhone to iPhone; Bluetooth off and permission denied; matching pairing codes; decline, cancel, out-of-range and timeout; nothing saved until the receiver taps Save; and invitations that only reach the chosen device.",
      },
      {
        title: "Screenshots",
        body: "Captured from the real prototype using fictional sample data (Sample Person, Example Studio and three sample leads). The Nearby screenshot uses the test radar between two browser windows, not real phones.",
      },
    ],
  },
  {
    slug: "shadow-run",
    name: "SHADOW RUN",
    tagline: "A dark, atmospheric 3D survival runner. Swipe, jump, slide and escape the shadow.",
    description:
      "A small 3D runner game with a 10-level story, an endless mode and a daily challenge. Dodge walls and pits, collect crystals, find secret routes and unlock characters. It runs offline in the browser.",
    categories: ["Experiments", "Web Apps"],
    stack: ["HTML", "CSS", "JavaScript", "WebGL", "Web Audio API"],
    status: "Prototype",
    statusNote:
      "Offline edition: there are no accounts, leaderboards or ads, and the game makes no network requests. Progress is saved only in your own browser. Code for an optional online server and for a mobile wrapper exists in the file but is switched off, and neither has been built or tested. It has been tested only in a desktop browser, not on real phones.",
    demo: { kind: "built-in", label: "Play the game" },
    screenshots: [
      { src: "/projects/shadow-run/menu.jpg", alt: "SHADOW RUN main menu over a dark city scene, with Play, Story Mode, Endless Survival, Daily Challenge, Characters, Missions, Achievements and Settings." },
      { src: "/projects/shadow-run/gameplay-1.jpg", alt: "SHADOW RUN gameplay in The Forgotten Forest: a runner on a glowing path between pine trees, with a score, a progress bar and a swipe hint." },
      { src: "/projects/shadow-run/gameplay-2.jpg", alt: "SHADOW RUN gameplay with two obstacles ahead on the path in the forest level." },
      { src: "/projects/shadow-run/levels.png", alt: "SHADOW RUN story mode level list with ten levels; only the first is unlocked at the start." },
      { src: "/projects/shadow-run/characters.png", alt: "SHADOW RUN outfits screen. Outfits are cosmetic only and give no gameplay advantage." },
    ],
    features: [
      "Story mode with 10 levels, from The Forgotten Forest to The Final Escape",
      "Endless Survival and a Daily Challenge with its own seed each day",
      "Swipe or keyboard controls: change lane, jump and slide",
      "Crystals, secret routes, missions, achievements and unlockable characters",
      "3D graphics in WebGL, generated sound, and vibration feedback on phones",
      "Works fully offline; progress is saved only on your device and can be erased in Settings",
    ],
    problem:
      "A small game is a good way to practise real-time graphics, input, sound and game design in one place. The goal was a runner that feels good with a single swipe and needs nothing but a browser.",
    architecture: [
      "One self-contained HTML file with plain JavaScript and no game engine or framework.",
      "A deterministic simulation: level layouts come from a seeded random generator, so the daily challenge is the same for everyone on the same day.",
      "WebGL draws the 3D scene; the Web Audio API generates sound effects and music.",
      "Progress is stored in the browser's local storage under one key, with a version number so saves can be upgraded.",
      "A configuration object switches the game between the offline edition (used here) and a future online one.",
    ],
    process: [
      "Built the core run first: lanes, jump, slide, obstacles and collisions.",
      "Added level generation from a seed, then the story levels, endless mode and the daily challenge.",
      "Added crystals, missions, achievements and characters to give runs a reason to repeat.",
      "Chose an offline edition for this site so visitors need no account and nothing leaves their device.",
      "Cleaned up before publishing: any stored sign-in data is removed when the game starts, and a style clash that hid the Reset progress button and blocked the Privacy link was fixed.",
    ],
    challenges: [
      {
        challenge: "Controls have to feel instant on a phone, where a swipe is not a button press.",
        solution: "A swipe fires its action as soon as it crosses a threshold, without waiting for the finger to lift, and chained swipes work in one gesture.",
      },
      {
        challenge: "A daily challenge should be fair without needing a server.",
        solution: "The level is generated from a seed built from the date, so the same day gives the same layout on every device.",
      },
      {
        challenge: "Players should not lose progress, but the game should not collect personal data.",
        solution: "Everything is kept in local storage on the player's own device, and Settings has a Reset progress button that erases it.",
      },
    ],
    future: [
      "Test on real Android and iPhone devices",
      "Optional online leaderboards and accounts, only if a secure server is built",
      "Wrap it as a mobile app",
      "More levels, characters and sounds",
    ],
    docs: [
      { title: "Controls", body: "Keyboard: arrow keys or A, D, W, S and Space. Touch: swipe left or right to change lane, up to jump and down to slide. Played in landscape." },
      { title: "Your data", body: "The game stores your progress in your browser under one key. It has no login. Reset progress in Settings, or clearing this site's data in your browser, removes it." },
      { title: "Screenshots", body: "Captured from the real game in a desktop browser at phone size, from the first level." },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
