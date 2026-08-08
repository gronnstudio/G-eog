"use client"

import Link from "next/link"

import { useUI } from "@/components/language-provider"

export default function NotFound() {
  const ui = useUI()
  return (
    <div className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-4">
      <div className="eog-aurora absolute inset-0 opacity-60" />
      <div className="relative text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-faint">{ui("nfLabel")}</p>
        <h1 className="mt-4 font-heading text-6xl text-foreground sm:text-8xl">404</h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-lg text-muted">{ui("nfBody")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-gronn-green px-6 py-3 font-medium text-gronn-white">
            {ui("nfHome")}
          </Link>
          <Link href="/explore" className="rounded-full border border-line px-6 py-3 font-medium text-foreground">
            {ui("exploreGraph")}
          </Link>
        </div>
      </div>
    </div>
  )
}
