import type { Metadata } from "next"
import { Geist_Mono, Montserrat } from "next/font/google"
import localFont from "next/font/local"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

import { Providers } from "@/components/providers"
import {
  DAY_START_HOUR,
  DAY_THEME,
  NIGHT_START_HOUR,
  NIGHT_THEME,
  THEME_KEY,
  THEME_MODE_KEY,
} from "@/lib/themes"
import { SmoothScroll } from "@/components/motion/smooth-scroll"
import { CommandPaletteProvider } from "@/components/search/command-palette"
import { Header } from "@/components/layout/header"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { TopVeil } from "@/components/layout/top-veil"
import { MobileDock } from "@/components/layout/mobile-dock"
import { Footer } from "@/components/layout/footer"
import { RegisterSW } from "@/components/register-sw"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { Thread } from "@/components/thread"
import { InstallPrompt } from "@/components/install-prompt"
import { Preloader } from "@/components/preloader"

// Type system shared with GRØNN Studio: Syne SemiBold for headings,
// Montserrat for body/interface, Geist Mono for technical annotations.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400"],
})
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const syne = localFont({
  src: "../fonts/Syne-SemiBold.ttf",
  variable: "--font-syne",
  weight: "600",
  display: "swap",
})

const SITE = "https://equilibrium.gronn.studio"

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Equilibrium — The living knowledge ecosystem for regenerative thinking",
    template: "%s — Equilibrium",
  },
  description:
    "Equilibrium makes humanity's ecological knowledge freely accessible, beautifully organized and endlessly connected. Explore soil, water, forests, fungi, climate and regenerative design as one living graph.",
  keywords: [
    "ecology", "regenerative design", "permaculture", "soil science", "food forests",
    "climate", "systems thinking", "biodiversity", "open knowledge",
  ],
  openGraph: {
    type: "website",
    siteName: "Equilibrium",
    url: SITE,
    title: "Equilibrium — The living knowledge ecosystem",
    description: "Humanity's ecological knowledge, freely accessible and endlessly connected.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Equilibrium" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Equilibrium — RSS feed" }],
    },
  },
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Equilibrium",
  url: SITE,
  description: "The living knowledge ecosystem for regenerative thinking.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE}/knowledge?q={query}`,
    "query-input": "required name=query",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${geistMono.variable} ${syne.variable} h-full`}
    >
      <body className="min-h-full">
        {/* Time-of-day default (GRØNN base). Unless the visitor has
            overruled it, seed next-themes' storage from their own clock
            BEFORE its script runs — this element precedes <Providers>, so
            the palette is decided pre-paint and an auto visitor never
            sees a flash of the wrong ground. Hours come from
            src/lib/themes.ts so the boundaries cannot drift from
            resolveAutoTheme(). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem(${JSON.stringify(THEME_MODE_KEY)})!=="manual"){var h=new Date().getHours();localStorage.setItem(${JSON.stringify(THEME_KEY)},h>=${DAY_START_HOUR}&&h<${NIGHT_START_HOUR}?${JSON.stringify(DAY_THEME)}:${JSON.stringify(NIGHT_THEME)})}}catch(e){}`,
          }}
        />
        {/* Pre-paint locale seed: reflect a returning visitor's stored
            language onto <html lang/dir> before first paint, so an Arabic
            reader never flashes left-to-right. Only "ar" is RTL today. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem("eog-locale");if(l){document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr"}}catch(e){}`,
          }}
        />
        {/* Pre-paint intro gate: show the opening veil only on the first
            visit of a session and only when motion is allowed, so the veil
            is in the first paint (no content flash) and never repeats. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem("eog-intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-intro","1");sessionStorage.setItem("eog-intro-seen","1")}}catch(e){}`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-gronn-green focus:px-4 focus:py-2 focus:text-gronn-white"
        >
          Skip to content
        </a>
        <Preloader />
        <Providers>
          <RegisterSW />
          <SmoothScroll />
          <CommandPaletteProvider>
            <PullToRefresh />
            <TopVeil />
            <ScrollProgress />
            <Header />
            <Thread />
            <main id="main">{children}</main>
            <Footer />
            <MobileDock />
            <InstallPrompt />
          </CommandPaletteProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
