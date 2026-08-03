// BVN Command Center service worker.
// Network-first, with static assets cached so the shell still opens offline.
// API and auth requests are never cached — always live.
const CACHE = "bvn-cmd-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isStatic(pathname) {
  return (
    pathname.startsWith("/icons") ||
    pathname.startsWith("/_next/static") ||
    /\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$/.test(pathname)
  );
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // third-party -> untouched
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/auth")) return; // always live

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && isStatic(url.pathname)) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
