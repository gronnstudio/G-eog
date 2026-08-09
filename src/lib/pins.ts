"use client"

import { useSyncExternalStore } from "react"

/**
 * Favourites and recently-opened articles, kept on the device.
 *
 * There are no accounts in the static open core, so "your" state lives in
 * localStorage: a starred list and a most-recent-first history. Both are
 * plain slug arrays — everything else about an article is derivable from
 * the knowledge model, and duplicating it here would just let the copy rot.
 */

const FAVS_KEY = "eog-favs"
const RECENT_KEY = "eog-recent"
const RECENT_LIMIT = 8

const listeners = new Set<() => void>()

function read(key: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : []
  } catch {
    return []
  }
}

function write(key: string, value: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked — favourites are a convenience, not data.
  }
  cache.delete(key)
  listeners.forEach((l) => l())
}

// useSyncExternalStore compares snapshots by reference, so reads are cached
// until the next write — returning a fresh array every call would loop.
const cache = new Map<string, string[]>()

function snapshot(key: string): string[] {
  let hit = cache.get(key)
  if (!hit) {
    hit = read(key)
    cache.set(key, hit)
  }
  return hit
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const EMPTY: string[] = []

export function useFavourites(): string[] {
  return useSyncExternalStore(subscribe, () => snapshot(FAVS_KEY), () => EMPTY)
}

export function useRecent(): string[] {
  return useSyncExternalStore(subscribe, () => snapshot(RECENT_KEY), () => EMPTY)
}

export function toggleFavourite(slug: string) {
  const current = snapshot(FAVS_KEY)
  write(
    FAVS_KEY,
    current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
  )
}

export function recordVisit(slug: string) {
  const current = snapshot(RECENT_KEY)
  const next = [slug, ...current.filter((s) => s !== slug)].slice(0, RECENT_LIMIT)
  // Re-visiting the top item changes nothing; skip the notify churn.
  if (next.length === current.length && next.every((s, i) => s === current[i])) return
  write(RECENT_KEY, next)
}
