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
    ...[{"revision":"5978c92961bc56b4afca35264fba1044","url":"data/uploads/238f4262-8d25-4a1b-8d1f-b8186e3e9f39.webp"},{"revision":"9b102fc77bd29a4b026c49cc6a4aeeee","url":"data/uploads/case.webp"},{"revision":"052d6f9c69abab722137213dbbaab7b7","url":"data/uploads/cpu_cooler.webp"},{"revision":"a51e58e8ca6be8e7defda1e99912b955","url":"data/uploads/cpu.webp"},{"revision":"6859e6ada48cc241b98c83056bfdd84e","url":"data/uploads/memory.webp"},{"revision":"73a404b6e2eae5ac76d5eda8dec6cc86","url":"data/uploads/motherboard.webp"},{"revision":"d51d23f7baac732f84eb914c8cd1b6b6","url":"data/uploads/power_supply.webp"},{"revision":"a1dd6f1ee3c327030bc191133d97eac7","url":"data/uploads/sample_build_img_1.webp"},{"revision":"470a776c51657d55950dced70ee82415","url":"data/uploads/sample_build_img_2.webp"},{"revision":"e64a17ac4031e4b040464e603f6dc4c5","url":"data/uploads/storage.webp"},{"revision":"4d788707bcc45517167f02a5b19897a3","url":"data/uploads/video_card.webp"},{"revision":"12f85346842a7e6c71224ff9abdc6ec8","url":"images/fallback_pc_build.webp"},{"revision":"cd3cd8f653f09517c6c4189a279331ba","url":"images/fallback_product.webp"},{"revision":"8ee92086f0ce4e0510bc68b1daada0c5","url":"images/logo.webp"},{"revision":"40b75c91b2090049f48268ce96de71dc","url":"images/products/amazon.svg"},{"revision":"4b8a4845e3c03b05cc92e2b3199889d5","url":"images/products/github.svg"},{"revision":"b83a0a77333f0cbb900d15398b1c40f8","url":"images/pwa/android-chrome-192x192.png"},{"revision":"be5254c4828d718f03e18effd5f343b2","url":"images/pwa/android-chrome-512x512.png"},{"revision":"f504d77867423a0b37bab81eb24f5852","url":"images/pwa/apple-touch-icon.png"},{"revision":"7da7f169f15bc123b65c6c1610eaa7fa","url":"images/pwa/favicon-16x16.png"},{"revision":"e290a3f8910dc25a979ba2ea7361e937","url":"images/pwa/favicon-32x32.png"},{"revision":"5d4a7da48d76ccbbce1bb4dcfdcc19b0","url":"images/pwa/favicon.ico"},{"revision":"12fac10fa920debd91ede1ee8c5a4b34","url":"images/ui/cpu.svg"},{"revision":"4b0c41b9c23ecd0128457611d8604588","url":"images/ui/icon-close.svg"},{"revision":"f672a4429bb14702f521c6dc0aa8ba83","url":"images/ui/icon-hamburger.svg"},{"revision":"8fbb8280be7c92b2cccf7099073bdcf2","url":"images/ui/moon.svg"},{"revision":"b94a6b3b5c768622c12caaa777c0217e","url":"images/ui/pc_case.svg"},{"revision":"52422ab416494249a78719ed1402b9bd","url":"images/ui/sun.svg"},{"revision":"93a69ddb068f4752c11b8bc0e83b0c4c","url":"images/ui/wrench.svg"},{"revision":"2c8f4b9f73a9fc4599a043a03d750fe9","url":"javascripts/build/build_form.js"},{"revision":"837f37f1ea6685e755027ac769005bd5","url":"javascripts/nav.js"},{"revision":"888037e42d06548591dce2b8f261b331","url":"javascripts/pass-validation.js"},{"revision":"853e2f8365b9b74edfdd60f80e31ccdd","url":"javascripts/product/product_form.js"},{"revision":"3422152cd28b22bee3eee9c5db3e83d9","url":"javascripts/pwa.js"},{"revision":"3912328490b16b4442462c4a323f89ad","url":"manifest.json"},{"revision":"b4ea6f8d743f7934226ada885727ebce","url":"stylesheets/brand/brand-detail.css"},{"revision":"eda3de9e4c997e3410862f1151cab0aa","url":"stylesheets/brand/brand-form.css"},{"revision":"2acbb34b8367b7614ee21c0a6767247f","url":"stylesheets/brand/brands.css"},{"revision":"fb598220be63a4a1319262a8267c4584","url":"stylesheets/build/build-card.css"},{"revision":"b2adbd41a6ccc15f494fac05521c3602","url":"stylesheets/build/build-delete.css"},{"revision":"9eaedc6ff17647fa2227bd7e3bb2924d","url":"stylesheets/build/build-detail.css"},{"revision":"c9eebdc7dbe0a573aafd80fee33c0b1e","url":"stylesheets/build/build-form.css"},{"revision":"169f6d415c01ad014924c03c9ed65453","url":"stylesheets/build/build-info-table.css"},{"revision":"fd7f168ed265d9f17d9f92ad06eff349","url":"stylesheets/build/builds.css"},{"revision":"48f1c37ca5830248c3cc23e0ab12abb5","url":"stylesheets/category/categories.css"},{"revision":"20b34699eb3c148b91f1ce9b66aec85b","url":"stylesheets/category/category-detail.css"},{"revision":"1614232cc1460ca8f25b262d31a9e5d9","url":"stylesheets/category/category-form.css"},{"revision":"8c754b553a751a0094567a23db6ee6a9","url":"stylesheets/delete-group.css"},{"revision":"0117d1709437072e206afcd1bc4d460d","url":"stylesheets/error.css"},{"revision":"0d40dd9d381893d65f60dd402f3b562f","url":"stylesheets/footer-styles.css"},{"revision":"42471ad80fd7a8a34036bbe321746d48","url":"stylesheets/home.css"},{"revision":"75a040b2ed2b17de014a87cf740a1f61","url":"stylesheets/nav-styles.css"},{"revision":"b680ad2abdf7eacf1c46b39e79b425a8","url":"stylesheets/pass-validation.css"},{"revision":"358fb854cd006448785826f81338f3ed","url":"stylesheets/product/product-detail.css"},{"revision":"5287de8f1c0539277164a2202b36214f","url":"stylesheets/product/product-form.css"},{"revision":"4f80632a3a506db0014e4b1fd64af107","url":"stylesheets/product/products-table.css"},{"revision":"f9b5a225d7013554c961397dfa5e7028","url":"stylesheets/redirect.css"},{"revision":"973d8ec16e13549c20e786ca867da99e","url":"stylesheets/style.css"}],
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
