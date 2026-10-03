// Minimal service worker: makes WatGig a fully installable PWA and shows a friendly page offline.
// It never caches API responses or HTML pages, so people always see current events.
const VERSION = 'v1'
const SHELL_CACHE = `watgig-shell-${VERSION}`
const ASSET_CACHE = `watgig-assets-${VERSION}`

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(['/offline.html', '/icon-192.png']))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return // leave images, tiles and fonts to the browser
  if (url.pathname.startsWith('/api/')) return // always live

  // Page loads: network first, friendly offline page if the network is down
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')))
    return
  }

  // Hashed build files never change, so cache them for fast repeat loads
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const hit = await cache.match(request)
        if (hit) return hit
        const res = await fetch(request)
        if (res.ok) cache.put(request, res.clone())
        return res
      }),
    )
  }
})
