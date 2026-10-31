// Registers the service worker so the site can be installed and used offline.
if ("serviceWorker" in navigator) {
  addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
