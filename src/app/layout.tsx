import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Inter, JetBrains_Mono } from "next/font/google";
import { Tracker } from "@/components/analytics/Tracker";
import { LogoIntro } from "@/components/ui/LogoIntro";
import { getSite } from "@/lib/content";
import { site } from "@/content/site";
import "./globals.css";
import "./v6.css";
import "./mobile.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"], weight: ["500", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Clentr — Software engineering studio", template: "%s — Clentr" },
  description: site.description,
  openGraph: { title: "Clentr — Software engineering studio", description: site.description, url: site.url, siteName: "Clentr", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

// Applies the saved (or system) theme before first paint.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`;
// Plays the logo intro on every page load (not with reduced motion, in the admin panel or in its preview frame).
const introScript = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||location.pathname.indexOf('/admin')===0||window.self!==window.top)return;document.documentElement.dataset.intro='1'}catch(e){}})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const glass = Math.min(100, Math.max(0, Number((await getSite()).content.appearance?.glass ?? 45)));
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${inter.variable} ${mono.variable} ${hand.variable}`} style={{ ["--glass" as string]: glass }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <LogoIntro />
        {children}
        <Tracker />
      </body>
    </html>
  );
}
