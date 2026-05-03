// Self-uninstalling service worker.
// The previous cache-first SW served stale index.html across Vercel deploys,
// which referenced bundle hashes that no longer existed → blank screen.
// This SW unregisters itself and wipes every cache the moment it activates.
// We will reintroduce a properly versioned SW later.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })()
  );
});

// Pass everything through to the network while we're alive.
self.addEventListener("fetch", () => {});
