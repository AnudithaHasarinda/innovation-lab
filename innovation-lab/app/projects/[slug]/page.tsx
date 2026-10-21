import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { DemoSlot } from "@/components/DemoSlot";
import { EmptyState, StatusBadge } from "@/components/ui";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: p.name, description: p.tagline } : { title: "Project not found" };
}

function Block({ n, title, id, children }: { n: number; title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`h-${n}`} className="scroll-mt-24 border-t border-line pt-10">
      <h2 id={`h-${n}`} className="mb-5 flex items-baseline gap-3 text-2xl font-bold tracking-tight">
        <span className="font-mono text-sm text-sage">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-2 pl-5 leading-relaxed text-mute">
    {items.map((i) => <li key={i}>{i}</li>)}
  </ul>
);

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.findIndex((x) => x.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-4xl space-y-12 px-5 py-16">
      <header>
        <Link href="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm text-mute hover:text-sage"><span aria-hidden="true">←</span> All projects</Link>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={p.status} />
          <span className="font-mono text-xs text-mute">{p.categories.join(" · ")}</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{p.name}</h1>
        <p className="mt-3 text-xl text-sage">{p.tagline}</p>
        {p.statusNote ? <p className="mt-5 max-w-2xl rounded-xl border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-mute">{p.statusNote}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {p.demo?.kind === "built-in" ? <a href="#demo" className="btn btn-primary">{p.demo.label}</a> : null}
          {p.demo?.kind === "external" && p.demo.url ? <a href={p.demo.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{p.demo.label} ↗</a> : null}
          {p.repo ? <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">GitHub ↗</a> : null}
        </div>
      </header>

      <Block n={1} title="Project overview">
        <p className="mb-5 leading-relaxed text-mute">{p.description}</p>
        <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-sage">Key features</h3>
        <List items={p.features} />
      </Block>

      <Block n={2} title="Problem being solved">
        <p className="leading-relaxed text-mute">{p.problem}</p>
      </Block>

      <Block n={3} title="Technical architecture">
        <List items={p.architecture} />
        {p.docs.length ? (
          <div className="mt-6 space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-sage">Technical documentation</h3>
            {p.docs.map((d) => (
              <div key={d.title} className="card p-4"><p className="font-semibold">{d.title}</p><p className="mt-1 text-sm leading-relaxed text-mute">{d.body}</p></div>
            ))}
          </div>
        ) : null}
      </Block>

      <Block n={4} title="Technologies used">
        <ul className="flex flex-wrap gap-2">{p.stack.map((s) => <li key={s} className="chip !text-cream">{s}</li>)}</ul>
      </Block>

      <Block n={5} title="Development process">
        <ol className="list-decimal space-y-2 pl-5 leading-relaxed text-mute">{p.process.map((s) => <li key={s}>{s}</li>)}</ol>
      </Block>

      <Block n={6} title="Interactive demonstration" id="demo">
        {p.demo?.kind === "built-in" ? (
          <DemoSlot slug={p.slug} />
        ) : p.demo?.kind === "external" && p.demo.url ? (
          <a href={p.demo.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{p.demo.label} ↗</a>
        ) : (
          <EmptyState title="No interactive demo yet">This project does not have a live demonstration. When it does, it will appear here.</EmptyState>
        )}
      </Block>

      <Block n={7} title="Screenshots">
        {p.screenshots.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {p.screenshots.map((s) => (
              <figure key={s.src} className="card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} className="w-full" loading="lazy" />
              </figure>
            ))}
          </div>
        ) : (
          <EmptyState title="Screenshots coming soon">
            Add images to public/projects/{p.slug}/ and list them under screenshots in data/projects.ts. The interactive demo above is the real thing in the meantime.
          </EmptyState>
        )}
      </Block>

      <Block n={8} title="Challenges and solutions">
        <div className="space-y-3">
          {p.challenges.map((c) => (
            <div key={c.challenge} className="card p-5">
              <p className="text-xs uppercase tracking-widest text-mute">Challenge</p>
              <p className="mt-1 font-semibold">{c.challenge}</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-sage">Solution</p>
              <p className="mt-1 text-sm leading-relaxed text-mute">{c.solution}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block n={9} title="Future improvements">
        <List items={p.future} />
      </Block>

      <Block n={10} title="Source code">
        {p.repo ? (
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View on GitHub ↗</a>
        ) : (
          <EmptyState title="Source code is not public yet">This project has no public repository. When one exists, add its URL as repo in data/projects.ts and the link appears here.</EmptyState>
        )}
      </Block>

      <nav aria-label="More projects" className="flex justify-between border-t border-line pt-8">
        <Link href="/#projects" className="btn btn-ghost">← Back to the lab</Link>
        {next && next.slug !== p.slug ? <Link href={`/projects/${next.slug}`} className="btn btn-primary">Next: {next.name} →</Link> : null}
      </nav>
    </article>
  );
}
