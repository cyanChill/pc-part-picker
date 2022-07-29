// Disable Workbox Debug Messages
self.__WB_DISABLE_DEV_LOGS = true;

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);
const { ExpirationPlugin, CacheExpiration } = workbox.expiration;
const { precacheAndRoute, getCacheKeyForURL } = workbox.precaching;
const { NavigationRoute, registerRoute } = workbox.routing;
const { StaleWhileRevalidate, NetworkFirst } = workbox.strategies;

const VERSION_NUMBER = "v1.0.0";

// Set expiration time for all non-precached routes
const PG_ROUTES_CACHE_NAME = "page-routes";
const routeExpirationManager = new CacheExpiration(PG_ROUTES_CACHE_NAME, {
  maxAgeSeconds: 60 * 60 * 24 * 3,
});

// Set expiration time for all non-precached images
const DYNAMIC_IMGS_CACHE_NAME = "images";
const imgExpirationManager = new CacheExpiration(DYNAMIC_IMGS_CACHE_NAME, {
  maxAgeSeconds: 60 * 60 * 24 * 3,
  maxEntries: 20,
});

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                    Handling Imported Fonts
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const fontRegex = /.*(?:googleapis|gstatic)\.com.*$/;
registerRoute(
  ({ url }) => url.origin.match(fontRegex),
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
);

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      Route Page Caching w/ Offline Fallback (Network First)
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
registerRoute(
  ({ event, url }) =>
    url.origin === self.location.origin &&
    event.request.headers.get("accept").includes("text/html"),

  async ({ request, url }) => {
    const pgRouteCache = await caches.open(PG_ROUTES_CACHE_NAME);
    // ⭐ Network-First Implementation ⭐
    try {
      const res = await fetch(request);
      // Save network response in cache
      await pgRouteCache.put(request.url, res.clone());
      // Update cache expiration time for result
      await routeExpirationManager.updateTimestamp(request.url);
      await routeExpirationManager.expireEntries(); // Clean up cache

      return res; // Return fetched result
    } catch (err) {
      // Error thrown if offline
      if (url.pathname === "/") {
        // Look to see if there exists a dynamically cached version of
        // the homepage before serving the one from the precache
        const res = await pgRouteCache.match(request);
        if (res) return res; // Return dynamic cache result
        return caches.match(getCacheKeyForURL("/")); // Return precache result
      } else {
        // Return cached response (for all other routes)
        const cachedRes = await caches.match(request);
        if (cachedRes) return cachedRes;
        // Render Offline Fallback Page
        return caches.match(getCacheKeyForURL("/offline"));
      }
    }
  },
  "GET"
);

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            Network-Only Strategy for POST Requests
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
// Regex for general structure of our post routes
const POST_ROUTES_REGEX = [
  /(brands|builds|category|products)\/(create|deleteComponent)/,
  /(brands|builds|category|products)\/.*\/(add|update|delete|validateSavePass)/,
];
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    POST_ROUTES_REGEX.some((rx) => rx.test(url.pathname)),

  async ({ request }) => {
    // ⭐ Network-Only Implementation ⭐
    try {
      const res = await fetch(request);
      if (res) return res; // Return response fetched
      throw new Error("Action Unsupported Offline.");
    } catch (err) {
      // Render Unsupported Action Fallback Page
      return caches.match(getCacheKeyForURL("/unsupported"));
    }
  },
  "POST"
);

/*
  Put (near) the end as to have these cached routes be served if they
  were not found by earlier routse
*/
precacheAndRoute(
  [
    { url: "/", revision: VERSION_NUMBER },
    { url: "/offline", revision: VERSION_NUMBER },
    { url: "/unsupported", revision: VERSION_NUMBER },
    ...self.__WB_MANIFEST,
  ],
  {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  }
);

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
          Cache-First Strategy For All Other Images
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
registerRoute(/.*\.(png|jpg|webp)|/, async ({ request }) => {
  // Look for image in cache
  const cacheResult = await caches.match(request);
  if (cacheResult) return cacheResult;
  // If it doesn't exist in cache, fetch the result
  const fetchResult = await fetch(request);
  const dynamicImgCache = await caches.open(DYNAMIC_IMGS_CACHE_NAME);
  // Save Network response in cache
  await dynamicImgCache.put(request.url, fetchResult.clone());
  await imgExpirationManager.updateTimestamp(request.url);
  await imgExpirationManager.expireEntries(); // Clean up cache

  return fetchResult; // Return network response
});
