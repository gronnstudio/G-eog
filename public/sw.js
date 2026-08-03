// Equilibrium service worker — conservative, offline-first for visited pages.
//
//   · immutable build assets (/_next/static, icons, fonts) → cache-first;
//   · navigations → network-first, falling back to a cached copy, then to
//     the precached /offline page;
//   · bump VERSION to invalidate everything after a change here.
const VERSION = "eog-sw-v1"
const OFFLINE_URL = "/offline"
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const IMMUTABLE = /^\/(_next\/static|icons)\/|\.(woff2?|ttf)$/

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return

  if (IMMUTABLE.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(
        (hit) =>
          hit ||
          fetch(event.request).then((res) => {
            const copy = res.clone()
            caches.open(VERSION).then((c) => c.put(event.request, copy))
            return res
          }),
      ),
    )
    return
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put(event.request, copy))
          return res
        })
        .catch(() =>
          caches.match(event.request).then((hit) => hit || caches.match(OFFLINE_URL)),
        ),
    )
  }
})
