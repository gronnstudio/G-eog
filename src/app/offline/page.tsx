import Link from "next/link"

export const metadata = { title: "Offline" }

export default function OfflinePage() {
  return (
    <div className="flex min-h-[80svh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-faint">No connection</p>
        <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
          The ecosystem is resting.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-muted">
          You&rsquo;re offline. Pages you&rsquo;ve already visited remain available; the rest will
          return the moment you reconnect.
        </p>
        <Link href="/" className="mt-8 inline-block rounded-full border border-line px-6 py-3 text-foreground">
          Try home
        </Link>
      </div>
    </div>
  )
}
