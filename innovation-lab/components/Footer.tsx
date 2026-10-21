import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. The Innovation Lab.</p>
        <p className="font-mono text-xs">Prototypes are labelled. Nothing here is invented.</p>
        <a className="text-sage hover:underline" href={`mailto:${site.email}`}>{site.email}</a>
      </div>
    </footer>
  );
}
