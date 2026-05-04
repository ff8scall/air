const CACHE_NAME = "air-dashboard-v1";
const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10분

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", "/manifest.webmanifest"])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CHECK_AIR_QUALITY") {
    checkAndNotify(event.data.station);
  }
});

async function checkAndNotify(station) {
  try {
    const res = await fetch(`/api/air-quality?station=${encodeURIComponent(station || "오금동")}`);
    const json = await res.json();
    if (!json.ok || !json.data) return;

    const { pm10Grade1h, pm25Grade1h, pm10Grade, pm25Grade, pm10Value, pm25Value } = json.data;
    const pm10g = parseInt(pm10Grade1h || pm10Grade || "0");
    const pm25g = parseInt(pm25Grade1h || pm25Grade || "0");

    if (pm10g === 1 && pm25g === 1) {
      self.registration.showNotification("🌬️ 환기 최적 시간!", {
        body: `현재 ${station} PM10: ${pm10Value}㎍/㎥, PM2.5: ${pm25Value}㎍/㎥ — 지금 창문을 여세요!`,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: "air-good",
        renotify: false,
        data: { url: "/" },
      });
    }
  } catch (e) {
    console.error("[SW] 공기질 체크 오류:", e);
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
