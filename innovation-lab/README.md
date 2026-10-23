# The Innovation Lab

A premium, interactive "Coding Lab" for Anuditha Hasarinda's personal website, built with
**Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Motion · GitHub API**.

It is a self-contained app that lives next to your existing website (it does not touch your current
HTML), and links back to it. See *Integrating with your existing website* below.

## What is inside

| Area | Where |
|---|---|
| Lab homepage ("THE INNOVATION LAB", hero, animated code snippet) | `app/page.tsx`, `components/Hero.tsx`, `components/CodeSnippet.tsx` |
| Project showcase: category filters (AI · Web Apps · Mobile Apps · Experiments · Open Source) + search | `components/ProjectShowcase.tsx` |
| Project registry: **the one place to add projects** | `data/projects.ts` |
| Project detail pages with all 10 sections | `app/projects/[slug]/page.tsx` |
| Interactive demos (working prototypes) | `components/demos/*` (logic in `lib/*`) |
| Developer profile (only real technologies) | `data/profile.ts`, `components/DeveloperProfile.tsx` |
| GitHub integration (repos, languages, stars, forks, activity; rate-limit safe) | `lib/github.ts`, `components/GitHubSection.tsx` |
| Terminal-style interactive element | `components/Terminal.tsx` |
| Page transitions, loading states, 404 | `app/template.tsx`, `app/loading.tsx`, `app/not-found.tsx` |

### The projects (all labelled by status)

Standalone single-file apps:

- **Digital Identity** is the earlier Tapcard prototype (v5): a single HTML file with privacy levels, QR sharing, print kit, contacts and a roadmap tab (`public/projects/digital-identity/`).

Standalone single-file apps, each kept as-is in `public/projects/<slug>/app.html` (or `prototype.html`) and shown in a frame by
`components/demos/FrameDemo.tsx` (or its own small wrapper). To replace one with a newer version, overwrite its HTML file:

- **AI Business Assistant** (`public/projects/ai-business-assistant/`): a *rule-based* planner (lean canvas, SWOT, break-even maths, 30-60-90 plan). **No AI model is connected.** It loads React from a public CDN.
- **Brand Studio** (`public/projects/brand-studio/`): palettes from colour theory with WCAG contrast checks, font pairing, monogram, colour psychology brief, logo recolouring and CSS/JSON export.
- **Content Calendar & Post Planner** (`public/projects/content-calendar/`): builds a month of posts from themes and platforms; ideas are built-in templates, not AI; times are starting points.
- **Folio** (`public/projects/folio/`): quote, proposal and invoice maker in LKR with print or save as PDF. Not tax or legal advice.
- **Production Budget & Shot Planner** (`public/projects/production-planner/`): starter budgets, shot list with day check, call sheet, saved sheets. Starter rates are examples.
- **Tempo** (`public/projects/tempo/`): study planner with focus timer, spaced revision, flashcards and progress. Rule-based, saved only in the browser. The Android (Capacitor) wrapper is a separate project and is untested.
- **Ledgerline** (`public/projects/ledgerline/`): a personal money manager (accounts, budgets, cards, multi-currency, backup). Data stays in the browser; sign-up is only a local profile.
- **Tapcard** (`public/projects/tapcard/`): a digital business card with QR, a test Nearby radar, print kit and contacts.
- **Shadow Run** (`public/projects/shadow-run/`): an offline 3D runner game.

The earlier React versions of the AI Business Assistant, Brand Studio and Finance Dashboard (`components/demos/BusinessAssistantDemo.tsx`,
`components/demos/BrandStudioDemo.tsx`, `components/demos/FinanceDashboardDemo.tsx`, `lib/planner.ts`, `lib/palette.ts`, `lib/finance.ts`) are no longer shown on the site. They are kept so the
logic tests still run; delete them together with their tests if you do not want them.

## Honesty rules (built in)

- Every project shows a status badge: `Completed`, `Prototype`, `In development` or `Planned`. Nothing is marked
  `Completed` unless you set it.
- The **GitHub** button on a project appears only if you set `repo`. The **Live demo** button only if `demo` exists.
- No screenshots yet? An honest empty state is shown instead of fake images.
- `data/profile.ts` ships **empty**. Only add technologies you genuinely use or are learning.
- GitHub activity comes straight from the public API. Unknown event types are skipped, never guessed.
- If GitHub is not configured, rate-limited, or unreachable, the section explains that instead of showing anything made up.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local     # then edit it (see below)
npm run dev                    # http://localhost:3000
```

Other commands: `npm run build`, `npm start`, `npm run typecheck`, `npm test` (logic tests).

## Connect GitHub

1. Open `.env.local` and set `GITHUB_USERNAME=your-github-username` and `NEXT_PUBLIC_GITHUB_USERNAME=your-github-username`.
2. Optional: `GITHUB_FEATURED=repo-one,repo-two` to pin which repositories are featured first
   (otherwise your most-starred / most recently updated repositories are shown).
3. Optional: `GITHUB_TOKEN=...` raises the limit from 60 to 5,000 requests per hour. Create a *fine-grained* or classic
   personal access token with **no scopes** (public data only). The token is used on the server only and is never sent to the browser.

Data is cached for one hour. If the limit is hit, the section shows a clear message and fills in automatically later.

## Add a project

Open `data/projects.ts`, copy an object, and change it. The card, filters, search and the page at
`/projects/<slug>` appear automatically.

- Set `status` truthfully. Add `repo: "https://github.com/you/project"` when a public repository exists.
- Screenshots: put images in `public/projects/<slug>/` and list them under `screenshots`.
- External live demo: `demo: { kind: "external", url: "https://...", label: "Open app" }`.
- Built-in interactive demo: create `components/demos/MyDemo.tsx`, then register its slug in `components/DemoSlot.tsx`.

## Add your developer profile

Edit `data/profile.ts`. Example: `languages: [{ name: "TypeScript", note: "Website projects" }]`.
Empty groups show a hint instead of anything invented.

## Integrating with your existing website

Your current site is one HTML file, and this lab is a separate app, so nothing in your site can break.
Pick one option:

**Option A: separate deployment (simplest).** Deploy this project on Vercel (import the repo, add the env vars from
`.env.example`, deploy), then optionally attach a subdomain such as `lab.yourdomain.com`. Set
`NEXT_PUBLIC_MAIN_SITE_URL` to your main site's URL so the "← Main site" button returns there.

**Option B: static export under `/lab` on your existing host (Firebase Hosting, Netlify, GitHub Pages, any static host).**

```bash
NEXT_PUBLIC_BASE_PATH=/lab LAB_EXPORT=1 npm run build
```

Copy the generated `out/` folder to a folder named `lab` next to your existing `index.html`
(for Firebase, put it inside your `public` folder, then run `firebase deploy`). The lab is then at `https://yourdomain.com/lab/`.
In this mode GitHub data is fetched at build time, so rebuild and redeploy to refresh it.

**Option C: node server (VPS).** `npm run build && npm start` behind your reverse proxy.

Then add a link to the lab from your existing site. `integration/existing-site-snippet.html` contains a ready-to-paste
navigation pill and an optional teaser block. It is not applied automatically.

## Design and customisation

Colours, fonts and animation tokens are in `tailwind.config.ts` (`sage`, `cream`, `mute`, `panel`, `line`) and
`app/globals.css`, matching your main site's black and sage palette. Fonts are Outfit and JetBrains Mono through `next/font`.

## Accessibility

Skip link, semantic landmarks, labelled form controls, `aria-pressed` filters, live regions for filter results and the terminal,
text alternatives for every chart and the QR code, visible focus styles, and keyboard-operable everything.
Animations respect `prefers-reduced-motion` (Motion's `MotionConfig` plus a CSS fallback); the typing effect shows instantly for those users.

## What was and was not verified

This project was written and tested in an environment **without network access**, so `npm install` and `next build` could not be run there.

Verified:
- All logic and data files type-check under strict TypeScript, and all React files type-check against minimal React/Next type stand-ins.
- 24 logic tests: vCard escaping and folding, colour conversion and WCAG contrast, break-even maths, finance aggregation,
  GitHub helpers and every failure mode (not configured, rate limit, 403, 429, not found, network error, events failing), terminal commands, filters, registry honesty rules.
- 15 server-render checks: all 4 detail pages render all 10 sections with the correct empty states, every GitHub status renders, the hero uses the exact requested copy.
- 61 browser checks on the real components (filters, search, terminal, history, all four demos, downloads, error states, no console errors),
  run with local stand-ins for `next/link`, `next/navigation`, `motion/react` and `qrcode`.

Not verified (do these on first run):
- `npm install` and `npm run build` with the real Next.js, Tailwind, Motion and qrcode packages.
- Visual styling, because Tailwind could not generate CSS offline. Review the layout on desktop and phone and adjust spacing as you like.
- The real QR rendering (the `qrcode` package) and live GitHub responses.
