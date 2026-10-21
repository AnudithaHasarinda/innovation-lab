/**
 * Prefix for files in /public when the lab is served under a sub-path (NEXT_PUBLIC_BASE_PATH, e.g. "/innovation-lab/lab").
 * Plain <img> and <iframe> tags are not rewritten by Next.js, so they need this helper.
 * Absolute URLs (https://...) are returned unchanged.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const assetPath = (p: string) => (p.startsWith("/") && !p.startsWith("//") ? BASE_PATH + p : p);
