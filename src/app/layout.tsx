import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

import { Providers } from "@/components/providers"
import { SmoothScroll } from "@/components/motion/smooth-scroll"
import { CommandPaletteProvider } from "@/components/search/command-palette"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RegisterSW } from "@/components/register-sw"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" })
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" })

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
      className={`${inter.variable} ${playfair.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full">
        {/* Pre-paint theme seed to avoid a flash of the wrong ground. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add('dark')}`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-forest"
        >
          Skip to content
        </a>
        <Providers>
          <RegisterSW />
          <SmoothScroll />
          <CommandPaletteProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </CommandPaletteProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
