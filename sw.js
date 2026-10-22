/* Agentic Coding PR · Mini-Lesson · Service Worker
 * Strategie: Cache-First für App-Shell und Inhalte, im Hintergrund aktualisieren.
 * Bei Versionsänderung: CACHE_VERSION hochzählen → neuer Cache wird angelegt, alter gelöscht.
 */

const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = `agentic-pr-${CACHE_VERSION}`;

// Dateien, die offline verfügbar sein müssen
const PRECACHE = [
  "./",
  "./index.html",
  "./lesson.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: Pre-Cache der App-Shell
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
});

// Activate: alte Caches aufräumen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch: eigene Dateien und Google Fonts aus dem Cache, sonst Netz
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const istFont = url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com");
  if (url.origin !== self.location.origin && !istFont) return;

  event.respondWith(
    caches.match(req).then(cached => {
      const netz = fetch(req).then(net => {
        if (net && (net.ok || net.type === "opaque")) {
          const copy = net.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return net;
      }).catch(() => cached);
      return cached || netz;
    })
  );
});
