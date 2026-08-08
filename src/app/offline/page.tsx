import Link from "next/link"

import { UIText } from "@/components/ui/ui-text"

export const metadata = { title: "Offline" }

export default function OfflinePage() {
  return (
    <div className="flex min-h-[80svh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-faint">
          <UIText k="nfOffline" />
        </p>
        <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
          <UIText k="nfOfflineHead" />
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-muted">
          <UIText k="nfOfflineBody" />
        </p>
        <Link href="/" className="mt-8 inline-block rounded-full border border-line px-6 py-3 text-foreground">
          <UIText k="nfTryHome" />
        </Link>
      </div>
    </div>
  )
}
