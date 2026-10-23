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
      "Describe the idea, the audience and the price. You get a lean canvas, a SWOT, real break-even maths and a 30-60-90 day plan, rebuilt as you type. It is rule-based: no AI model is connected.",
    categories: ["Experiments", "Web Apps"],
    stack: ["React 18", "JavaScript", "CSS", "Google Fonts"],
    status: "Prototype",
    statusNote:
      "Rule-based: no AI model is connected, and the page says so at the top. Everything you type stays in this browser (the form is saved on this device so it survives a refresh) and nothing is sent anywhere. The only outside requests are React and the fonts, loaded from public CDNs.",
    demo: { kind: "built-in", label: "Try the assistant" },
    screenshots: [
      { src: "/projects/ai-business-assistant/canvas.png", alt: "AI Business Assistant with the built-in example brief Nudge: a break-even figure of 63 subscribers and the lean canvas." },
      { src: "/projects/ai-business-assistant/swot.png", alt: "AI Business Assistant SWOT view for the example brief, with strengths and weaknesses." },
      { src: "/projects/ai-business-assistant/breakeven.png", alt: "AI Business Assistant break-even view showing the formula with the example numbers, and revenue against cost." },
      { src: "/projects/ai-business-assistant/roadmap.png", alt: "AI Business Assistant 30-60-90 day plan with the subscribers needed at day 30, 60 and 90." },
      { src: "/projects/ai-business-assistant/dark.png", alt: "AI Business Assistant in dark mode." },
    ],
    features: [
      "Three built-in example briefs, or start blank",
      "Fields for the idea, problem, audience, business or consumer, stage, revenue model, currency, price, costs and an optional target",
      "Break-even shown as the main number, with the margin per customer, break-even revenue and profit at your target",
      "Four views that update as you type: lean canvas, SWOT, break-even and a 30-60-90 day plan",
      "Copy the plan as Markdown or JSON",
      "Light and dark themes; the page states that nothing you type is sent anywhere",
    ],
    problem:
      "Early-stage founders often stall at the blank page. A structured starting point makes the next conversation, with advisors or customers, much more productive.",
    architecture: [
      "One self-contained HTML file. React 18 is loaded from a public CDN, and the app code is in the page.",
      "The plan is produced inside the page by rules from the brief. No model and no server are involved.",
      "The brief and the theme are saved in the browser's local storage, under names that start with aba.",
      "Break-even uses a single formula, shown on screen next to the numbers it used.",
    ],
    process: [
      "Put the brief on the left and the plan on the right, so every change shows up immediately.",
      "Made the break-even figure the one loud number on the page and kept everything else quiet.",
      "Handled impossible inputs with a plain explanation instead of a wrong number.",
      "Labelled the tool as rule-based, and the AI model as not connected, in the page header.",
    ],
    challenges: [
      {
        challenge: "Avoiding the appearance of AI where there is none.",
        solution: "The header says Rule-based and AI model not connected, and the page explains that it runs entirely in the browser.",
      },
      {
        challenge: "Break-even maths with missing or impossible inputs.",
        solution: "When the price does not exceed the cost per customer, the page shows a dash and says break-even is undefined until the price is higher, instead of showing a broken number.",
      },
      {
        challenge: "Keeping a private business idea private.",
        solution: "Nothing is sent to a server. The brief is kept only in this browser's local storage and can be cleared by editing the fields or clearing site data.",
      },
    ],
    future: ["Plug in an AI model behind the same inputs and outputs", "Export the plan as PDF", "Save several plans instead of only the latest brief"],
    docs: [
      {
        title: "Break-even formula",
        body: "Break-even customers = ceil(monthly fixed costs / (price - variable cost per customer)). Defined only when the price is greater than the variable cost. Example: 600 / (12 - 2.40) = 62.5, so 63 subscribers.",
      },
      {
        title: "Your data",
        body: "The form and theme are saved in your browser under names that start with aba. Nothing is uploaded. Clear this site's data in your browser to remove them.",
      },
      {
        title: "Screenshots",
        body: "Captured from the real page using its built-in Invoice reminders example, which is made-up. Web fonts could not load when capturing, so type looks slightly different live.",
      },
    ],
  },
  {
    slug: "digital-identity",
    name: "Digital Identity",
    tagline: "A digital business card with a privacy level for every detail, shared by QR code or contact file.",
    description:
      "Build a card, choose what is public and what stays hidden until the other person shares theirs back, then share it by QR code or a downloadable contact file. This is the earlier Tapcard prototype (version 5), before the Nearby radar was added.",
    categories: ["Web Apps", "Experiments"],
    stack: ["HTML", "CSS", "JavaScript", "Canvas", "vCard", "qrcode.js"],
    status: "Prototype",
    statusNote:
      "Works today in the browser: card editing with privacy levels, templates, a Free and a Premium view, QR sharing, a print kit, contacts with lead scores and meeting notes. Not built yet: a server or accounts (data stays in your own browser) and real profile links (they are placeholders). The Roadmap tab inside the app lists what needs a backend. It has not been tested on real phones. The QR code library and fonts load from the internet, so a first visit needs a connection.",
    demo: { kind: "built-in", label: "Try the prototype" },
    screenshots: [
      { src: "/projects/digital-identity/card.png", alt: "Digital Identity card editor with a phone preview showing a sample card. Sample data only." },
      { src: "/projects/digital-identity/qr.png", alt: "Digital Identity QR code tab for the sample card." },
      { src: "/projects/digital-identity/print.png", alt: "Print kit preview of a business card with a QR code. Sample data only." },
      { src: "/projects/digital-identity/contacts.png", alt: "Contacts list with lead scores, using three fictional sample contacts." },
      { src: "/projects/digital-identity/roadmap.png", alt: "Roadmap tab listing which features work today and which need a backend." },
    ],
    features: [
      "Privacy level for each detail: public, or hidden until the other person shares theirs back",
      "QR code and a standard vCard (.vcf) contact file that carry only the public details",
      "Templates, a Free and a Premium view",
      "Print kit exported as a PNG",
      "Contacts list with a rule-based lead score, follow-up dates and meeting notes",
      "Roadmap tab that says plainly what works and what needs a backend",
    ],
    problem:
      "Paper business cards are easy to lose and slow to save, and many digital cards expose every detail to anyone who scans them. This prototype lets the owner decide what each person sees.",
    architecture: [
      "A single self-contained HTML file with plain JavaScript and no framework.",
      "All data is kept in the browser's local storage under its own key. There is no server and no account.",
      "Canvas draws the print kit. qrcode.js draws QR codes. The contact card is a standard vCard (.vcf) file.",
      "Contact details are escaped before they are shown, so text typed into a field cannot run as code.",
    ],
    process: [
      "Started with the card, privacy levels and the vCard file.",
      "Added QR sharing and the print kit.",
      "Added contacts, lead scores and meeting notes, then a Roadmap tab to keep every limit visible.",
    ],
    challenges: [
      {
        challenge: "A QR code that includes private details would expose them to anyone who scans it.",
        solution: "The QR code and public profile are built only from details marked public. Hidden details are shared only when the other person sends theirs back.",
      },
      {
        challenge: "The Roadmap table was wider than a phone screen.",
        solution: "On narrow screens each row now stacks, so the page no longer scrolls sideways.",
      },
    ],
    future: ["Real hosted profile links", "Move to the newer Tapcard version with the Nearby radar", "Wallet pass export"],
    docs: [{ title: "Format", body: "vCard, UTF-8, saved as a .vcf file that phones import in one tap." }],
  },
  {
    slug: "brand-studio",
    name: "Brand Studio",
    tagline: "Pick a seed colour and a mood. Get a palette, type pairing and monogram with every contrast ratio checked.",
    description:
      "A brand-identity tool in one HTML page. Choose a seed colour and one of five moods to get a five-colour palette, a font pairing and a monogram, then check how well the colours fit a brand goal, recolour your own logo and export the tokens.",
    categories: ["Web Apps", "Experiments"],
    stack: ["HTML", "CSS", "JavaScript", "Canvas", "SVG", "WCAG contrast", "Google Fonts"],
    status: "Prototype",
    statusNote:
      "Working prototype. Palettes come from colour-theory rules, not from an AI model. The colour psychology score is an estimate of how closely the hues fit a goal, and the page says that colour meanings are tendencies, not rules. Everything, including a logo you upload, stays in your browser. The only outside request is Google Fonts for the typefaces.",
    demo: { kind: "built-in", label: "Open Brand Studio" },
    screenshots: [
      { src: "/projects/brand-studio/board.png", alt: "Brand Studio showing a sample brand called Hearth and Home: brand board with monogram, five-colour palette with contrast ratios, and mood choices." },
      { src: "/projects/brand-studio/psychology.png", alt: "Brand Studio colour psychology brief with a 96 percent match for warmth and friendliness, and notes on what each colour usually signals." },
      { src: "/projects/brand-studio/export.png", alt: "Brand Studio type pairing, monogram and CSS variable export for the sample palette." },
    ],
    features: [
      "Five moods (Serene, Luxe, Bold, Playful, Heritage), each built on a different colour harmony",
      "Five-colour palette with the text colour on each swatch chosen automatically and its WCAG contrast ratio shown",
      "Type pairing per mood, and a monogram you can copy as SVG",
      "Colour psychology brief: pick a brand goal and see a match score and how each colour is usually read",
      "Logo upload with recolouring (match primary hue, single colour or duotone) and optional white-background removal",
      "Export as CSS variables or JSON, plus a worked contrast calculation for your primary colour",
    ],
    problem:
      "Choosing brand colours feels subjective, but harmony and legibility can be measured. The aim was a tool that shows both, so a small business can start from a palette that is readable and fits the feeling it wants.",
    architecture: [
      "One self-contained HTML file with plain JavaScript and no framework.",
      "Pure functions (hexToHsl, hslToHex, harmonies, luminance, contrast) generate palettes and check accessibility; the page is a thin layer over them.",
      "Contrast follows the WCAG 2.1 relative-luminance formula, with thresholds for AA, AAA and large text.",
      "Logo recolouring runs on a canvas in the browser, so the image is never uploaded.",
    ],
    process: [
      "Started with the colour maths and the five harmonies.",
      "Added automatic text colours and contrast grading for every swatch.",
      "Added type pairing, monogram and export, then the colour psychology brief and logo recolouring.",
      "Replaced the earlier React version in this lab with this standalone page.",
    ],
    challenges: [
      {
        challenge: "A palette can look good and still be unreadable.",
        solution: "For each swatch the page picks white or the ink colour, whichever gives the higher contrast, and shows the ratio and grade (AAA, AA, AA large or Fail).",
      },
      {
        challenge: "Colour psychology can sound more certain than it is.",
        solution: "The score is explained as an estimate from hue, saturation and lightness, and the page states that culture and context change how a colour is read.",
      },
      {
        challenge: "Recolouring a logo without sending it anywhere.",
        solution: "The image is drawn to a canvas and recoloured pixel by pixel in the browser; single colour and duotone work best on logos with a transparent background.",
      },
    ],
    future: ["Test on real phones and tablets", "More moods and harmonies", "Export to more design-token formats"],
    docs: [
      {
        title: "How contrast is calculated",
        body: "Each sRGB channel is linearised, relative luminance is L = 0.2126 R + 0.7152 G + 0.0722 B, and the ratio is (lighter + 0.05) / (darker + 0.05), from 1:1 to 21:1. Thresholds: 4.5 for AA body text, 7 for AAA, 3 for large text.",
      },
      {
        title: "Screenshots",
        body: "Captured from the real page using a fictional brand (Hearth and Home). They were taken where Google Fonts could not load, so text appears in fallback fonts; the live page uses the intended typefaces.",
      },
    ],
  },
  {
    slug: "ledgerline",
    name: "Ledgerline",
    tagline: "A personal finance and money manager that keeps everything on your device.",
    description:
      "Track accounts, income, spending and transfers, set monthly budgets, and see net worth and spending charts. A small personal finance manager in one HTML page, with sample data to explore.",
    categories: ["Web Apps", "Experiments"],
    stack: ["HTML", "CSS", "JavaScript", "SVG", "Web Crypto API", "Google Fonts"],
    status: "Prototype",
    statusNote:
      "Working prototype with no server: all data stays in your browser. Sign-up only creates a profile on this device (the password is kept as a salted hash in this browser), so do not reuse a real password. The passcode lock hides the app but is not encryption. Exchange rates are values you set yourself, not live rates. The only outside request is Google Fonts.",
    demo: { kind: "built-in", label: "Open Ledgerline" },
    screenshots: [
      { src: "/projects/ledgerline/overview.png", alt: "Ledgerline overview with net worth, income, spending and saved, a budget bar and spending by category, using sample data." },
      { src: "/projects/ledgerline/transactions.png", alt: "Ledgerline transactions list for the month with search, grouped by day, using sample data." },
      { src: "/projects/ledgerline/accounts.png", alt: "Ledgerline accounts: assets, liabilities and net worth, with a wallet, bank account and credit card with a due date." },
      { src: "/projects/ledgerline/budget.png", alt: "Ledgerline monthly budget with a limit and progress bar for each category." },
      { src: "/projects/ledgerline/dark.png", alt: "Ledgerline overview in dark mode." },
    ],
    features: [
      "Accounts for cash, bank, savings, cards and loans, each in its own currency",
      "Income, expense and transfer transactions with categories, sub-categories, notes and search",
      "Monthly budgets with alerts at 80 percent and when over budget",
      "Credit cards with a due day, a pay-from account and optional auto-settlement",
      "Quick-add shortcuts, month navigation, and charts for spending by category and by day",
      "Net worth in your chosen currency using exchange rates you set",
      "Backup by copy and restore, CSV view, passcode lock, light and dark themes, and sample data",
    ],
    problem:
      "Many money apps want an account and a server. This is an experiment in how much a personal ledger can do when the data never leaves the device, while still handling cards, several currencies and budgets.",
    architecture: [
      "One self-contained HTML file with plain JavaScript and no framework.",
      "Each transaction has a from and a to account, so income, expenses and transfers share one model and balances are opening balance plus transactions.",
      "Data is saved in the browser's local storage, separate for each local profile and for guest use.",
      "Charts are hand-built SVG with text titles on each segment.",
      "Profiles use the Web Crypto API (SHA-256 with a per-profile salt) and are stored only in this browser.",
    ],
    process: [
      "Started with the double-entry model so transfers do not count as spending.",
      "Added budgets and alerts, then cards with due dates and auto-settlement.",
      "Added multiple currencies, backup and restore, the passcode and themes.",
      "Replaced the earlier fictional-data finance dashboard in this lab with this working app.",
    ],
    challenges: [
      {
        challenge: "Paying a credit card should not look like spending twice.",
        solution: "A card payment is a transfer from the bank to the card, so the purchase counts once as spending and the payment only moves money between accounts.",
      },
      {
        challenge: "Transfers between accounts in different currencies.",
        solution: "The received amount is calculated from your saved exchange rates and stored with the transaction, so balances stay correct if rates change later.",
      },
      {
        challenge: "Being honest about privacy and security without a server.",
        solution: "The app says that data stays in this browser, that a passcode only hides the app and is not encryption, and that accounts are local profiles.",
      },
    ],
    future: ["Test on real phones", "Optional live exchange rates", "Recurring transactions", "An encrypted backup file"],
    docs: [
      {
        title: "Your data",
        body: "Everything is stored in this browser's local storage under names that start with ledgerline. Use Backup in Settings to keep a copy, and Erase all data to remove it.",
      },
      {
        title: "Screenshots",
        body: "Captured from the real app using its built-in sample data (made-up accounts and transactions). They were taken where Google Fonts could not load, so text appears in fallback fonts.",
      },
    ],
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
  {
    slug: "content-calendar",
    name: "Content Calendar & Post Planner",
    tagline: "Pick your brand's themes and platforms and get a month of post ideas, hooks and times to edit and export.",
    description:
      "Choose content themes, platforms, posts per week and a goal. The planner builds a month calendar with an idea, hook, format and call to action for every post, shows how balanced your themes are, and exports a CSV or text plan.",
    categories: ["Web Apps", "Experiments"],
    stack: ["HTML", "CSS", "JavaScript", "Google Fonts"],
    status: "Prototype",
    statusNote:
      "Works today in the browser. The ideas and hooks come from a fixed built-in list, not an AI model, and the posting times are starting points for Sri Lanka time, not measured results. It does not post to any platform and has no accounts: your plan is saved only in this browser. The only outside request is Google Fonts.",
    demo: { kind: "built-in", label: "Plan a month" },
    screenshots: [
      { src: "/projects/content-calendar/calendar.png", alt: "Content Calendar showing a theme balance bar and a month calendar with planned posts, using a sample brand." },
      { src: "/projects/content-calendar/list.png", alt: "Content Calendar post list with date, platform, theme, idea, hook and status." },
      { src: "/projects/content-calendar/times.png", alt: "Content Calendar best-times table with a note that times are starting points." },
    ],
    features: [
      "Eight content themes and six platforms to choose from",
      "Builds a month from a start date, posts per week and a main goal (awareness, trust or sales)",
      "Theme balance bar so no single theme takes over the month",
      "Edit any post: date, time, platform, format, idea, hook, call to action and status",
      "Best-times table per platform, with the reason for each suggestion",
      "Export as CSV or a text plan, copy it, or print the post list",
    ],
    problem:
      "Small brands often post when they remember to, with no mix of content. A simple plan that spreads themes and platforms across the month makes it easier to stay regular.",
    architecture: [
      "A single self-contained HTML file with plain JavaScript and no framework.",
      "The plan is kept in the browser's local storage. There is no server and no account.",
      "Posts are spread across the chosen weekdays and rotate through the chosen themes and platforms. Ideas come from a built-in list, with the brand name filled in.",
      "Text typed by the user is escaped before it is shown.",
    ],
    process: [
      "Listed the themes a small brand actually needs and wrote several idea and hook templates for each.",
      "Built the month generator, then the calendar, list and editor around it.",
      "Added the theme balance bar and the export views, and kept the best-times wording honest about being starting points.",
    ],
    challenges: [
      {
        challenge: "A generated plan can look repetitive or unbalanced.",
        solution: "Posts rotate through the chosen themes in turn, the balance bar shows the result, and any idea can be swapped for another from the same theme.",
      },
      {
        challenge: "The month calendar is too wide for a phone screen.",
        solution: "The calendar scrolls sideways inside its own box and the page itself no longer scrolls sideways.",
      },
    ],
    future: ["Your own theme and idea lists", "Import an existing plan", "Compare planned times with real platform insights"],
    docs: [{ title: "Times", body: "Posting times are starting points in Sri Lanka time (UTC+5:30). Compare them with your own platform insights after two weeks." }],
  },
  {
    slug: "folio",
    name: "Folio",
    tagline: "Quotes, proposals and invoices in Sri Lankan rupees, ready to print or save as a PDF.",
    description:
      "Fill in your business, your client and your services and get a clean quote, proposal or invoice with discount, tax, amount in words and bank details. Print it or save it as a PDF from the browser.",
    categories: ["Web Apps"],
    stack: ["HTML", "CSS", "JavaScript", "Google Fonts"],
    status: "Prototype",
    statusNote:
      "Works today in the browser: three document types, live preview, discount and tax lines, your logo and accent colour, and print or save as PDF. It has no server, no sending by email and no payment collection, and numbering is manual. The sample business and client in the screenshots are fictional placeholders. Check tax rates and legal wording yourself, because this is a layout tool and not tax or legal advice. The only outside request is Google Fonts.",
    demo: { kind: "built-in", label: "Make a document" },
    screenshots: [
      { src: "/projects/folio/invoice.png", alt: "Folio invoice editor with a live preview showing a balance due in LKR, using sample data." },
      { src: "/projects/folio/proposal.png", alt: "Folio proposal with scope, timeline and a price table, using sample data." },
    ],
    features: [
      "Quote, proposal and invoice from one form",
      "Amounts in LKR with a percentage or fixed discount and any number of tax lines",
      "Amount in words, bank details, notes and terms",
      "Upload your logo and pick an accent colour",
      "Live preview, with Edit and Preview tabs on a phone",
      "Print or save as a PDF from the browser, with a signature block on quotes and proposals",
    ],
    problem:
      "Freelancers and small studios often send quotes from a blank document and rebuild the layout each time. A form that lays out the document the same way every time saves time and looks more professional.",
    architecture: [
      "A single self-contained HTML file with plain JavaScript and no framework.",
      "The document is kept in the browser's local storage, including an uploaded logo. Nothing is uploaded anywhere.",
      "Totals, discount and tax are calculated in the page, and the amount in words is generated by a small function.",
      "A print stylesheet hides the form and prints the A4 document, so the browser's own Save as PDF produces the file.",
      "Text typed by the user is escaped before it is shown.",
    ],
    process: [
      "Started with the invoice layout and the totals logic.",
      "Reused the same layout for quotes and proposals, and added the scope and timeline sections for proposals.",
      "Added a phone layout and a print stylesheet so the document can be saved as a PDF.",
    ],
    challenges: [
      {
        challenge: "The same data has to read correctly as a quote, a proposal and an invoice.",
        solution: "One data model drives all three. The labels, the due or valid-until date, the paid amount and the signature block change with the type.",
      },
      {
        challenge: "A form and a full A4 preview do not fit side by side on a phone.",
        solution: "On narrow screens an Edit and Preview switch shows one at a time.",
      },
    ],
    future: ["Several saved clients", "Automatic numbering", "Other currencies"],
    docs: [{ title: "Saving a PDF", body: "Choose Print or save PDF, then pick Save as PDF in the browser's print dialog." }],
  },
  {
    slug: "production-planner",
    name: "Production Budget & Shot Planner",
    tagline: "Budget a shoot, plan the shot list and print a call sheet, for film, TV, podcast, video or photo.",
    description:
      "Start from a starter budget for your format, adjust crew, gear and other costs, build a shot list that tells you how many days you really need, and print a call sheet for each shoot day.",
    categories: ["Web Apps", "Experiments"],
    stack: ["HTML", "CSS", "JavaScript", "Google Fonts"],
    status: "Prototype",
    statusNote:
      "Works today in the browser, with several saved sheets, CSV export and print. The starter rates are editable example figures in rupees, not market quotes, and other currencies use fixed example conversion rates, so replace them with your own rate card. The day estimate is a simple rule of thumb. There is no server and no accounts: sheets are saved only in this browser. The only outside request is Google Fonts.",
    demo: { kind: "built-in", label: "Plan a shoot" },
    screenshots: [
      { src: "/projects/production-planner/home.png", alt: "Production Budget and Shot Planner main menu with headline numbers for a sample production." },
      { src: "/projects/production-planner/budget.png", alt: "Budget estimate with crew rows and a cost breakdown, using starter example rates." },
      { src: "/projects/production-planner/shots.png", alt: "Shot list with size, movement, lens and minutes for each shot, and a check that the plan fits the shoot days." },
      { src: "/projects/production-planner/call.png", alt: "Call sheet with a timed schedule built from the shots assigned to the day." },
    ],
    features: [
      "Starter budgets for film, TV, podcast, videography and photography",
      "Crew, gear and other costs with rate, quantity and days, plus contingency, fee and tax",
      "Cost breakdown and cost per shot",
      "Shot list with a day-count check from setup and shoot minutes",
      "Call sheet with a timed schedule, lunch break and crew call",
      "Several saved sheets you can open, duplicate and delete; CSV export and print",
    ],
    problem:
      "Small crews often budget in one spreadsheet, list shots in another and write the call sheet by hand. Keeping all three in one place means a change in one shows up in the others.",
    architecture: [
      "A single self-contained HTML file with plain JavaScript and no framework.",
      "Every sheet is saved in the browser's local storage under its own keys, so it stays on this device.",
      "The budget is rate x quantity x days, with contingency, fee and tax applied in order. The day estimate divides total shot minutes by about 70 percent of a shoot day.",
      "The call sheet is built from the shots assigned to a day, with a lunch break added after about four and a half hours.",
      "Text typed by the user is escaped before it is shown.",
    ],
    process: [
      "Wrote the starter budgets for each format and the coverage shot sets.",
      "Built the budget table and the live totals, then the shot list and the day check.",
      "Added the call sheet, saved sheets and CSV export.",
    ],
    challenges: [
      {
        challenge: "Starter numbers can look like real prices.",
        solution: "They are labelled as editable examples in the app and in this page, and the headline numbers can be overridden by hand.",
      },
      {
        challenge: "A budget table with many columns overflowed a phone screen.",
        solution: "The table scrolls inside its own box and the page no longer scrolls sideways.",
      },
    ],
    future: ["Your own saved rate cards", "Export the call sheet as a PDF with a logo", "Share a sheet with the crew"],
    docs: [{ title: "Rates", body: "Starter rates are example figures in LKR. Replace them with your own rate card or vendor quotes before using a budget with a client." }],
  },
  {
    slug: "tempo",
    name: "Tempo",
    tagline: "A study planner with a focus timer, spaced revision and flashcards, built to work on a phone.",
    description:
      "Plan study tasks for the day and the week, focus with a Pomodoro timer and ambient sound, revise topics at spaced intervals, flip flashcards, and track your streak, subject time and mock exam scores.",
    categories: ["Web Apps", "Experiments"],
    stack: ["HTML", "CSS", "JavaScript", "Web Audio API", "Capacitor", "Google Fonts"],
    status: "Prototype",
    statusNote:
      "Works today in the browser, in light and dark themes, and fits phone screens. Everything is saved only in this browser, so there are no accounts and no sync between devices (use the built-in backup text to move data). Auto-plan and the spaced-revision gaps use simple rules, not AI. An Android project that wraps this page as an APK has been prepared but has not been built or tested on a real phone, so daily reminders are only confirmed in the browser. The only outside request is Google Fonts.",
    demo: { kind: "built-in", label: "Try Tempo" },
    screenshots: [
      { src: "/projects/tempo/plan.png", alt: "Tempo Plan screen with today's progress, tasks and a time-available check, using sample tasks." },
      { src: "/projects/tempo/week.png", alt: "Tempo Week screen listing tasks by day with arrows to move them." },
      { src: "/projects/tempo/focus.png", alt: "Tempo Focus screen with a circular 25 minute timer, ambient sound choices and a distraction log." },
      { src: "/projects/tempo/progress.png", alt: "Tempo Progress screen with a day streak, a last 7 days bar chart and time by subject, using sample sessions." },
      { src: "/projects/tempo/dark.png", alt: "Tempo Plan screen in the dark theme." },
    ],
    features: [
      "Daily plan with a check that your tasks fit the time you have",
      "Auto-plan and smart order using exam dates, priority and how little each subject was studied",
      "Week view: drag tasks between days, or use the arrows on a phone",
      "Focus timer (25/5, 50/10, 15/3) with rain, brown and white noise, a zen mode and a distraction log",
      "Spaced revision at 1, 3, 7, 14 and 30 days, plus flashcards rated Again, Good or Easy",
      "Progress: streak, last 7 days, time by subject, weekly goals, mock exam scores and a weekly review",
      "Light and dark theme, and a copy-and-paste backup and restore",
    ],
    problem:
      "Many students plan in several places and do not notice what they are neglecting. Tempo puts the plan, the timer, revision and progress in one small app that opens instantly on a phone.",
    architecture: [
      "A single self-contained HTML file with plain JavaScript and no framework.",
      "All data is kept in the browser's local storage. There is no server and no account.",
      "The timer works from an end time, so it stays accurate if the tab is slow. Ambient sound is generated in the page with the Web Audio API, so no audio files are needed.",
      "Spaced revision moves a topic through fixed gaps of 1, 3, 7, 14 and 30 days, and back to 1 day if it is forgotten.",
      "Text typed by the user is escaped before it is shown.",
      "A separate Capacitor project can wrap the same page as an Android app with local notifications for the daily reminder.",
    ],
    process: [
      "Started with the daily plan and the time-fit check.",
      "Added the focus timer, then revision, flashcards and progress around it.",
      "Added the week view, pace goals and backup, and prepared an Android project so it can be installed like an app.",
    ],
    challenges: [
      {
        challenge: "Browsers pause timers and notifications when the page is hidden.",
        solution: "The timer is calculated from an end time instead of counting ticks. Reliable daily reminders need the Android app and its notification plugin, which is not yet tested on a phone.",
      },
      {
        challenge: "Long task names and a crowded header pushed the page wider than a small phone.",
        solution: "Rows now wrap and long words break, so the page no longer scrolls sideways at 320 pixels wide.",
      },
    ],
    future: ["Build and test the Android app on a real phone", "Optional sync between devices", "Import a timetable"],
    docs: [{ title: "Backup", body: "Progress > Show backup copies your data as text. Paste it into Restore backup on another device or browser to load it." }],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
