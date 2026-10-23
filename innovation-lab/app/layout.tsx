import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "The Innovation Lab | Anuditha Hasarinda", template: "%s | The Innovation Lab" },
  description: "A collection of experiments, applications, and digital products exploring the possibilities of technology.",
};
export const viewport: Viewport = { themeColor: "#050504", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-sage focus:px-4 focus:py-2 focus:text-black">
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
