/**
 * GitHub integration (server-side). Reads only PUBLIC data and never invents anything.
 * Configure with GITHUB_USERNAME (and optionally GITHUB_TOKEN, GITHUB_FEATURED) in .env.local.
 * Every failure mode (not configured, rate limit, not found, network) returns a typed status
 * so the UI can show a graceful message instead of crashing.
 */
const API = "https://api.github.com";

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  topics?: string[];
};

export type Activity = { id: string; repo: string; text: string; at: string };

export type GithubResult =
  | { status: "unconfigured" }
  | { status: "not_found" | "rate_limited" | "error"; message: string; username: string }
  | {
      status: "ok";
      username: string;
      profileUrl: string;
      totals: { repos: number; stars: number; forks: number };
      languages: { name: string; count: number }[];
      featured: Repo[];
      repos: Repo[];
      activity: Activity[];
      activityNote?: string;
    };

type Fetched<T> = { ok: true; data: T } | { ok: false; reason: "not_found" | "rate_limited" | "error"; message: string };

async function gh<T>(path: string): Promise<Fetched<T>> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(API + path, { headers, next: { revalidate: 3600 } });
    if (res.status === 404) return { ok: false, reason: "not_found", message: "That GitHub user was not found." };
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      if (remaining === "0" || res.status === 429) {
        return { ok: false, reason: "rate_limited", message: "GitHub's rate limit was reached. Data will refresh automatically later. Adding a GITHUB_TOKEN raises the limit." };
      }
    }
    if (!res.ok) return { ok: false, reason: "error", message: `GitHub responded with status ${res.status}.` };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, reason: "error", message: "GitHub could not be reached right now." };
  }
}

type RawEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: { commits?: { message: string }[]; size?: number; action?: string; ref_type?: string; ref?: string | null; pull_request?: { title?: string; merged?: boolean } };
};

/** Turn real GitHub events into short readable lines. Unknown event types are skipped, never guessed. */
export function describeEvent(e: RawEvent): Activity | null {
  const repo = e.repo.name.split("/").pop() || e.repo.name;
  const p = e.payload || {};
  let text: string | null = null;
  switch (e.type) {
    case "PushEvent": {
      const n = p.size ?? p.commits?.length ?? 0;
      const msg = p.commits?.length ? p.commits[p.commits.length - 1].message.split("\n")[0] : "";
      text = `Pushed ${n || "some"} commit${n === 1 ? "" : "s"}${msg ? `: "${msg}"` : ""}`;
      break;
    }
    case "CreateEvent":
      text = p.ref_type === "repository" ? "Created the repository" : `Created ${p.ref_type || "a ref"}${p.ref ? ` ${p.ref}` : ""}`;
      break;
    case "PullRequestEvent":
      text = `${p.pull_request?.merged ? "Merged" : cap(p.action || "updated")} a pull request${p.pull_request?.title ? `: "${p.pull_request.title}"` : ""}`;
      break;
    case "IssuesEvent":
      text = `${cap(p.action || "updated")} an issue`;
      break;
    case "ReleaseEvent":
      text = "Published a release";
      break;
    default:
      return null;
  }
  return { id: e.id, repo, text, at: e.created_at };
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export function aggregate(repos: Repo[]) {
  const own = repos.filter((r) => !r.fork && !r.archived);
  const counts = new Map<string, number>();
  own.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) || 0) + 1));
  const languages = [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  const totals = { repos: own.length, stars: own.reduce((a, r) => a + r.stargazers_count, 0), forks: own.reduce((a, r) => a + r.forks_count, 0) };
  return { own, languages, totals };
}

export function pickFeatured(own: Repo[], names: string[]): Repo[] {
  const wanted = names.map((n) => n.trim().toLowerCase()).filter(Boolean);
  const pinned = wanted.map((n) => own.find((r) => r.name.toLowerCase() === n)).filter((r): r is Repo => !!r);
  if (pinned.length) return pinned;
  return [...own].sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.pushed_at) - +new Date(a.pushed_at)).slice(0, 6);
}

export async function getGithubData(): Promise<GithubResult> {
  const username = (process.env.GITHUB_USERNAME || "").trim();
  if (!username) return { status: "unconfigured" };

  const reposRes = await gh<Repo[]>(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner`);
  if (!reposRes.ok) return { status: reposRes.reason, message: reposRes.message, username };

  const { own, languages, totals } = aggregate(reposRes.data);
  const eventsRes = await gh<RawEvent[]>(`/users/${encodeURIComponent(username)}/events/public?per_page=30`);
  const activity = eventsRes.ok ? (eventsRes.data.map(describeEvent).filter(Boolean) as Activity[]).slice(0, 8) : [];

  return {
    status: "ok",
    username,
    profileUrl: `https://github.com/${username}`,
    totals,
    languages,
    featured: pickFeatured(own, (process.env.GITHUB_FEATURED || "").split(",")),
    repos: own,
    activity,
    activityNote: eventsRes.ok ? undefined : eventsRes.message,
  };
}
