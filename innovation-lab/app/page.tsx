import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { DeveloperProfile } from "@/components/DeveloperProfile";
import { GitHubSection, GitHubSkeleton } from "@/components/GitHubSection";
import { Terminal } from "@/components/Terminal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";

// GitHub data is cached for an hour inside lib/github.ts (fetch revalidate), so no route-level config is needed.

export default function LabHome() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl space-y-28 px-5 pb-8">
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-24">
          <Reveal>
            <SectionHeading id="projects-title" eyebrow="01 · Projects" title="Experiments & applications">
              Every project shows its real status. Filter by category or search by name, technology or status.
            </SectionHeading>
          </Reveal>
          <ProjectShowcase />
        </section>

        <section id="profile" aria-labelledby="profile-title" className="scroll-mt-24">
          <Reveal>
            <SectionHeading id="profile-title" eyebrow="02 · Developer profile" title="Tools, languages & learning">
              Only technologies that are genuinely used or being learned are shown here.
            </SectionHeading>
          </Reveal>
          <DeveloperProfile />
        </section>

        <section id="github" aria-labelledby="github-title" className="scroll-mt-24">
          <Reveal>
            <SectionHeading id="github-title" eyebrow="03 · GitHub" title="Public repositories & activity">
              Live from the public GitHub API: repositories, languages, stars, forks and recent activity.
            </SectionHeading>
          </Reveal>
          <Suspense fallback={<GitHubSkeleton />}>
            <GitHubSection />
          </Suspense>
        </section>

        <section id="terminal" aria-labelledby="terminal-title" className="scroll-mt-24">
          <Reveal>
            <SectionHeading id="terminal-title" eyebrow="04 · Terminal" title="Explore from the command line">
              A working terminal. Try <code className="font-mono text-sage">help</code>, <code className="font-mono text-sage">projects</code> or <code className="font-mono text-sage">open digital-identity</code>.
            </SectionHeading>
          </Reveal>
          <Terminal />
        </section>
      </div>
    </>
  );
}
