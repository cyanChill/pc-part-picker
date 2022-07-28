importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute, getCacheKeyForURL } = workbox.precaching;
const { NavigationRoute, registerRoute } = workbox.routing;
const { StaleWhileRevalidate, NetworkFirst } = workbox.strategies;

const VERSION_NUMBER = "v1.0.0";

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

  ({ event, url }) => {
    // Network-First
    return fetch(event.request)
      .then((res) => {
        return caches.open("page-routes").then((cache) => {
          // Save Network response in cache
          cache.put(event.request.url, res.clone());
          return res; // Return network response
        });
      })
      .catch((err) => {
        if (url.pathname === "/") {
          // Look to see if there exists a dynamically cached version of
          // the homepage before serving the one from the precache
          return caches.open("page-routes").then((cache) => {
            return cache.match(event.request).then((res) => {
              if (res) return res; // Return dynamic cache result
              return caches.match(getCacheKeyForURL("/")); // Return precache result
            });
          });
        } else {
          // Return cached response (for all other routes)
          return caches
            .match(event.request)
            .then((res) => {
              if (res) return res;
              throw new Error("Page Not Found in Cache.");
            })
            .catch((err) => {
              // Render Offline Fallback Page
              return caches.match(getCacheKeyForURL("/offline"));
            });
        }
      });
  },
  "GET"
);

// Regex for general structure of our post routes
const POST_ROUTES_REGEX = [
  /(brands|builds|category|products)\/(create|deleteComponent)/,
  /(brands|builds|category|products)\/.*\/(add|update|delete|validateSavePass)/,
];
registerRoute(
  ({ event, url }) =>
    url.origin === self.location.origin &&
    POST_ROUTES_REGEX.some((rx) => rx.test(url.pathname)),

  ({ event }) => {
    // Network-Only
    return fetch(event.request)
      .then((res) => {
        if (res) return res;
        throw new Error("Action Unsupported Offline.");
      }) // Return response fetched
      .catch((err) => {
        // Render Unsupported Action Fallback Page
        return caches.match(getCacheKeyForURL("/unsupported"));
      });
  },
  "POST"
);

/*
  Put at end as to have these cached routes be served if they were not found by
  earlier routse
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
