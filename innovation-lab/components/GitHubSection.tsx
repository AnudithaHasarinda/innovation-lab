import { getGithubData, type Repo } from "@/lib/github";
import { EmptyState, Skeleton } from "./ui";

const when = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function RepoCard({ r }: { r: Repo }) {
  return (
    <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="card card-glow block p-5">
      <h4 className="font-semibold">{r.name} <span aria-hidden="true" className="text-mute">↗</span></h4>
      <p className="mt-1 min-h-[2.5rem] text-sm leading-relaxed text-mute">{r.description || "No description provided."}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-mute">
        {r.language ? <span className="text-sage">{r.language}</span> : null}
        <span aria-label={`${r.stargazers_count} stars`}>★ {r.stargazers_count}</span>
        <span aria-label={`${r.forks_count} forks`}>⑂ {r.forks_count}</span>
        <span>Updated {when(r.pushed_at)}</span>
      </div>
    </a>
  );
}

export async function GitHubSection() {
  const data = await getGithubData();

  if (data.status === "unconfigured") {
    return (
      <EmptyState title="GitHub is not connected yet">
        Add your username as GITHUB_USERNAME in .env.local (see the README). Public repositories, languages, stars, forks and recent activity then appear here automatically. Nothing is shown until it is real.
      </EmptyState>
    );
  }
  if (data.status !== "ok") {
    return (
      <EmptyState title={data.status === "rate_limited" ? "GitHub is temporarily unavailable" : data.status === "not_found" ? "GitHub user not found" : "GitHub data could not be loaded"}>
        {data.message} Showing nothing is better than showing something wrong, so this section will fill in once the data is available.
      </EmptyState>
    );
  }

  const maxLang = Math.max(1, ...data.languages.map((l) => l.count));
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-3 gap-3 sm:max-w-md">
        {[["Repositories", data.totals.repos], ["Stars", data.totals.stars], ["Forks", data.totals.forks]].map(([k, v]) => (
          <div key={k as string} className="card p-4">
            <p className="text-2xl font-bold">{v}</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-mute">{k}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-sage">Featured repositories</h3>
        {data.featured.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{data.featured.map((r) => <RepoCard key={r.id} r={r} />)}</div>
        ) : (
          <EmptyState title="No public repositories yet">When you publish a repository it will appear here.</EmptyState>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-sage">Languages (by repository)</h3>
          {data.languages.length ? (
            <ul className="space-y-3">
              {data.languages.map((l) => (
                <li key={l.name}>
                  <div className="mb-1 flex justify-between text-sm"><span>{l.name}</span><span className="font-mono text-mute">{l.count}</span></div>
                  <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-sage" style={{ width: `${(l.count / maxLang) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-mute">No languages detected yet.</p>
          )}
        </div>
        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-sage">Recent public activity</h3>
          {data.activity.length ? (
            <ul className="space-y-3">
              {data.activity.map((a) => (
                <li key={a.id} className="card p-4 text-sm">
                  <p><span className="font-semibold">{a.repo}</span> <span className="text-mute">· {when(a.at)}</span></p>
                  <p className="mt-1 text-mute">{a.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-mute">{data.activityNote || "No recent public activity to show."}</p>
          )}
        </div>
      </div>

      <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Open @{data.username} on GitHub ↗</a>
    </div>
  );
}

export function GitHubSkeleton() {
  return (
    <div role="status" aria-label="Loading GitHub data" className="space-y-6">
      <div className="grid max-w-md grid-cols-3 gap-3">
        <Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-20" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
      </div>
      <span className="sr-only">Loading GitHub data</span>
    </div>
  );
}
