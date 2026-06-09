// Self-destructing service worker.
// When this loads on a device that has an older SW installed, it
// activates immediately, deletes all caches, unregisters itself, and
// reloads any open clients. After one cycle, the app runs with NO
// service worker, so HTML updates always reach the user fresh.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => { try { c.navigate(c.url); } catch (e) {} });
    } catch (e) {}
  })());
});
// No fetch handler — browser handles all requests normally (no caching, no interception).
