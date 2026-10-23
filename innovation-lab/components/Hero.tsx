import Link from "next/link";
import { CodeSnippet } from "./CodeSnippet";
import { Reveal } from "./Reveal";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="lab-title">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-sage/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-20 lg:grid-cols-[1.15fr_1fr] lg:pt-28">
        <div>
          <Reveal>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-sage">{site.name} · Coding Lab</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 id="lab-title" className="text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">
              The Innovation <span className="text-gold">Lab</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-xl font-semibold text-cream/90 sm:text-2xl">Exploring Ideas Through Code.</p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-xl leading-relaxed text-mute">
              A collection of experiments, applications, and digital products exploring the possibilities of technology.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/#projects" className="btn btn-primary">Explore projects</Link>
              <Link href="/#terminal" className="btn btn-ghost">Open the terminal</Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <CodeSnippet />
        </Reveal>
      </div>
    </section>
  );
}
