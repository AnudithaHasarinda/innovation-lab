import { profile, profileGroups } from "@/data/profile";
import { site } from "@/data/site";
import { EmptyState } from "./ui";

export function DeveloperProfile() {
  const total = profileGroups.reduce((n, g) => n + profile[g.key].length, 0);
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Professional interests">
        <span className="mr-2 font-mono text-xs uppercase tracking-widest text-mute">Interests</span>
        {site.interests.map((i) => (
          <span key={i} className="chip !text-cream">{i}</span>
        ))}
      </div>
      {total === 0 ? (
        <EmptyState title="Technologies are listed here once they are real">
          Only languages, frameworks and tools that are genuinely used or being learned appear in this section. Add them in data/profile.ts and they are shown automatically.
        </EmptyState>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {profileGroups.map((g) => (
            <div key={g.key} className="card p-6">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-sage">{g.title}</h3>
              {profile[g.key].length ? (
                <ul className="flex flex-wrap gap-2">
                  {profile[g.key].map((s) => (
                    <li key={s.name} className="chip !text-cream" title={s.note}>{s.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-mute">{g.hint}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
