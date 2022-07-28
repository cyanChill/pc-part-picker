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
    ...[{"revision":"5cabd7c39e9dbbbfc3dde6c58355609e","url":"data/uploads/32ff9d6c-8851-40f7-a9b4-f7ee1d12eb07.png"},{"revision":"001200b2d864aed883033ec7ba2cb476","url":"data/uploads/5ae1bd11-9a22-4729-b76c-5b483138f98b.png"},{"revision":"001200b2d864aed883033ec7ba2cb476","url":"data/uploads/997e7cda-db72-4fc2-af9b-d71c74c60566.png"},{"revision":"5cabd7c39e9dbbbfc3dde6c58355609e","url":"data/uploads/b572c313-eeb1-47df-b3b7-de75040e480e.png"},{"revision":"8586c1b863ac9cba0ba0c0fe76d7151f","url":"data/uploads/case.png"},{"revision":"bb2273ef2ced5bc6979217853337a23d","url":"data/uploads/cpu_cooler.png"},{"revision":"427cc6d455cf8fab53cf0130c770fdc3","url":"data/uploads/cpu.png"},{"revision":"b36932c339391fc49b3dff7b3a454cd2","url":"data/uploads/memory.png"},{"revision":"e1e5f11a12c91b7d1d4c4615998cfc26","url":"data/uploads/motherboard.png"},{"revision":"5bd7bf4620e53eedc5256236456dba38","url":"data/uploads/power_supply.png"},{"revision":"b688a95e2d121ec206c776cccf916093","url":"data/uploads/sample_build_img_1.jpg"},{"revision":"1dcf6c218fc3f5a2590471ac70992532","url":"data/uploads/sample_build_img_2.jpg"},{"revision":"3093abef30e863de9f2359157737967e","url":"data/uploads/storage.png"},{"revision":"69246d2b2d84238228df2ce4dbe1cb79","url":"data/uploads/video_card.png"},{"revision":"e88291fcda0115768cef91bc5ec864c0","url":"images/fallback_pc_build.jpg"},{"revision":"cdfc4ce60bad2d14533a23cdb5711c7f","url":"images/fallback_product.png"},{"revision":"15eb925e67f946eed2ab58ca23eed9af","url":"images/logo.png"},{"revision":"40b75c91b2090049f48268ce96de71dc","url":"images/products/amazon.svg"},{"revision":"4b8a4845e3c03b05cc92e2b3199889d5","url":"images/products/github.svg"},{"revision":"b83a0a77333f0cbb900d15398b1c40f8","url":"images/pwa/android-chrome-192x192.png"},{"revision":"be5254c4828d718f03e18effd5f343b2","url":"images/pwa/android-chrome-512x512.png"},{"revision":"f504d77867423a0b37bab81eb24f5852","url":"images/pwa/apple-touch-icon.png"},{"revision":"7da7f169f15bc123b65c6c1610eaa7fa","url":"images/pwa/favicon-16x16.png"},{"revision":"e290a3f8910dc25a979ba2ea7361e937","url":"images/pwa/favicon-32x32.png"},{"revision":"5d4a7da48d76ccbbce1bb4dcfdcc19b0","url":"images/pwa/favicon.ico"},{"revision":"12fac10fa920debd91ede1ee8c5a4b34","url":"images/ui/cpu.svg"},{"revision":"4b0c41b9c23ecd0128457611d8604588","url":"images/ui/icon-close.svg"},{"revision":"f672a4429bb14702f521c6dc0aa8ba83","url":"images/ui/icon-hamburger.svg"},{"revision":"8fbb8280be7c92b2cccf7099073bdcf2","url":"images/ui/moon.svg"},{"revision":"b94a6b3b5c768622c12caaa777c0217e","url":"images/ui/pc_case.svg"},{"revision":"52422ab416494249a78719ed1402b9bd","url":"images/ui/sun.svg"},{"revision":"93a69ddb068f4752c11b8bc0e83b0c4c","url":"images/ui/wrench.svg"},{"revision":"2c8f4b9f73a9fc4599a043a03d750fe9","url":"javascripts/build/build_form.js"},{"revision":"837f37f1ea6685e755027ac769005bd5","url":"javascripts/nav.js"},{"revision":"888037e42d06548591dce2b8f261b331","url":"javascripts/pass-validation.js"},{"revision":"853e2f8365b9b74edfdd60f80e31ccdd","url":"javascripts/product/product_form.js"},{"revision":"3422152cd28b22bee3eee9c5db3e83d9","url":"javascripts/pwa.js"},{"revision":"3912328490b16b4442462c4a323f89ad","url":"manifest.json"},{"revision":"b4ea6f8d743f7934226ada885727ebce","url":"stylesheets/brand/brand-detail.css"},{"revision":"eda3de9e4c997e3410862f1151cab0aa","url":"stylesheets/brand/brand-form.css"},{"revision":"2acbb34b8367b7614ee21c0a6767247f","url":"stylesheets/brand/brands.css"},{"revision":"fb598220be63a4a1319262a8267c4584","url":"stylesheets/build/build-card.css"},{"revision":"b2adbd41a6ccc15f494fac05521c3602","url":"stylesheets/build/build-delete.css"},{"revision":"9eaedc6ff17647fa2227bd7e3bb2924d","url":"stylesheets/build/build-detail.css"},{"revision":"c9eebdc7dbe0a573aafd80fee33c0b1e","url":"stylesheets/build/build-form.css"},{"revision":"169f6d415c01ad014924c03c9ed65453","url":"stylesheets/build/build-info-table.css"},{"revision":"fd7f168ed265d9f17d9f92ad06eff349","url":"stylesheets/build/builds.css"},{"revision":"48f1c37ca5830248c3cc23e0ab12abb5","url":"stylesheets/category/categories.css"},{"revision":"20b34699eb3c148b91f1ce9b66aec85b","url":"stylesheets/category/category-detail.css"},{"revision":"1614232cc1460ca8f25b262d31a9e5d9","url":"stylesheets/category/category-form.css"},{"revision":"8c754b553a751a0094567a23db6ee6a9","url":"stylesheets/delete-group.css"},{"revision":"0117d1709437072e206afcd1bc4d460d","url":"stylesheets/error.css"},{"revision":"64be200c7e7b6a762804afd7e743e970","url":"stylesheets/footer-styles.css"},{"revision":"42471ad80fd7a8a34036bbe321746d48","url":"stylesheets/home.css"},{"revision":"75a040b2ed2b17de014a87cf740a1f61","url":"stylesheets/nav-styles.css"},{"revision":"b680ad2abdf7eacf1c46b39e79b425a8","url":"stylesheets/pass-validation.css"},{"revision":"358fb854cd006448785826f81338f3ed","url":"stylesheets/product/product-detail.css"},{"revision":"5287de8f1c0539277164a2202b36214f","url":"stylesheets/product/product-form.css"},{"revision":"4f80632a3a506db0014e4b1fd64af107","url":"stylesheets/product/products-table.css"},{"revision":"f9b5a225d7013554c961397dfa5e7028","url":"stylesheets/redirect.css"},{"revision":"973d8ec16e13549c20e786ca867da99e","url":"stylesheets/style.css"}],
  ],
  {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  }
);
