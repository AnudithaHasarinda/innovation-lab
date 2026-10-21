import Link from "next/link";
import { site } from "@/data/site";

const links = [
  { href: "/#projects", label: "Projects" },
  { href: "/#profile", label: "Profile" },
  { href: "/#github", label: "GitHub" },
  { href: "/#terminal", label: "Terminal" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight" aria-label="The Innovation Lab, home">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-sage/50 font-mono text-xs text-sage">AH</span>
          <span className="hidden sm:inline">Innovation Lab</span>
        </Link>
        <nav aria-label="Primary" className="-mx-1 flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-mute transition hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a href={site.mainSiteUrl} className="btn btn-ghost !px-4 !py-2 !text-xs shrink-0">
          <span aria-hidden="true">←</span> Main site
        </a>
      </div>
    </header>
  );
}
