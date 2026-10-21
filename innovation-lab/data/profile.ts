/**
 * DEVELOPER PROFILE
 * Only list technologies you have genuinely used or are genuinely learning.
 * Empty lists render an elegant empty state, so nothing is ever invented.
 *
 * Example entry:  { name: "TypeScript", note: "Used in my website projects" }
 */
export type Skill = { name: string; note?: string };

export const profile = {
  languages: [] as Skill[],
  frameworks: [] as Skill[],
  tools: [] as Skill[],
  learning: [] as Skill[],
  experiments: [] as Skill[],
};

export const profileGroups: { key: keyof typeof profile; title: string; hint: string }[] = [
  { key: "languages", title: "Programming languages", hint: "Add languages you use" },
  { key: "frameworks", title: "Technologies & frameworks", hint: "Add frameworks you use" },
  { key: "tools", title: "Development tools", hint: "Add tools you use" },
  { key: "learning", title: "Currently learning", hint: "Add what you are learning" },
  { key: "experiments", title: "Technical experiments", hint: "Add experiments you are running" },
];
