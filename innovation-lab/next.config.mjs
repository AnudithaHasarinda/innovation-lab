/** @type {import('next').NextConfig} */
// Deploy under a sub-path of your main site (e.g. /lab) by setting NEXT_PUBLIC_BASE_PATH=/lab
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  basePath,
  // Every page becomes <folder>/index.html, so /lab/ and /lab/projects/<slug>/ work on any static host
  // (Firebase, Netlify, GitHub Pages) without special rewrite rules.
  trailingSlash: true,
  // LAB_EXPORT=1 -> fully static output in ./out (for Firebase, Netlify, GitHub Pages, any static host).
  // GitHub data is then fetched at build time; rebuild to refresh it.
  output: process.env.LAB_EXPORT === "1" ? "export" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
