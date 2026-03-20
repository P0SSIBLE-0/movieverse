const STATIC_CACHE_NAME = "movieverse-static-v1";
const RUNTIME_CACHE_NAME = "movieverse-runtime-v1";
const IMAGE_CACHE_NAME = "movieverse-images-v1";
const API_CACHE_NAME = "movieverse-api-v1";

const APP_SHELL_ROUTES = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/icons/pwa-icon.svg",
  "/icons/pwa-maskable.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_ROUTES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const activeCaches = [
    STATIC_CACHE_NAME,
    RUNTIME_CACHE_NAME,
    IMAGE_CACHE_NAME,
    API_CACHE_NAME,
  ];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => !activeCaches.includes(cacheName))
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isCacheableResponse(response) {
  return response && (response.ok || response.type === "opaque");
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (isCacheableResponse(response)) {
        void cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkResponsePromise;
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (isCacheableResponse(response)) {
      void cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    if (fallbackUrl) {
      const fallbackResponse = await caches.match(fallbackUrl);

      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, RUNTIME_CACHE_NAME, "/offline"));
    return;
  }

  if (url.origin === self.location.origin) {
    const isStaticAsset =
      url.pathname.startsWith("/_next/") ||
      url.pathname === "/manifest.webmanifest" ||
      ["style", "script", "worker", "font", "image"].includes(
        request.destination
      );

    if (isStaticAsset) {
      event.respondWith(staleWhileRevalidate(request, STATIC_CACHE_NAME));
      return;
    }
  }

  if (url.origin === "https://image.tmdb.org") {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE_NAME));
    return;
  }

  if (url.origin === "https://api.themoviedb.org") {
    event.respondWith(staleWhileRevalidate(request, API_CACHE_NAME));
  }
});
