importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    workbox.precaching.precacheAndRoute([{"revision":"86f97039b71726bb53adb914961bdb37","url":"build/bundle.css"},{"revision":"b5f56448dcadfe7a8da87a259e219f97","url":"global.css"},{"revision":"6b7939304e1bc55fac601aabffcc528d","url":"leaflet/leaflet.css"},{"revision":"ef977972263e69307c304f10c4116e46","url":"assets/android-chrome-192x192.png"},{"revision":"20feec3c7a326981265dfdac5797171c","url":"assets/android-chrome-512x512.png"},{"revision":"2da18a7aaea3c4950f8c1e8ebbbf55dc","url":"assets/apple-touch-icon.png"},{"revision":"d7649b546fc95e1385d30d15f3e01c50","url":"assets/favicon-16x16.png"},{"revision":"06b091b6dcb579f826b0c07a6f6961f5","url":"assets/favicon-32x32.png"},{"revision":"a0edaeadd9ee23020350a70a0780cb69","url":"assets/mstile-150x150.png"},{"revision":"c64beab291de80970aa4887a5a1c9135","url":"favicon.png"},{"revision":"4f0283c6ce28e888000e978e537a6a56","url":"leaflet/images/layers-2x.png"},{"revision":"a6137456ed160d7606981aa57c559898","url":"leaflet/images/layers.png"},{"revision":"401d815dc206b8dc1b17cd0e37695975","url":"leaflet/images/marker-icon-2x.png"},{"revision":"2273e3d8ad9264b7daa5bdbf8e6b47f8","url":"leaflet/images/marker-icon.png"},{"revision":"44a526eed258222515aa21eaffd14a96","url":"leaflet/images/marker-shadow.png"},{"revision":"7277480fe84d8ff18330681948ea7f0b","url":"assets/marker.svg"},{"revision":"3ada1c230fa721234afe17a63f95fe35","url":"assets/safari-pinned-tab.svg"},{"revision":"6f5f2cf325ba05600c473f80ad299326","url":"assets/favicon.ico"},{"revision":"6956eef13f6f43067baa7cc7cbb33a8a","url":"index.html"},{"revision":"71a3cbbf570698910e14fc4097470749","url":"build/bundle.js"},{"revision":"63b5ce0e004061918e58524dd3a5a8d7","url":"leaflet/leaflet-src.esm.js"},{"revision":"55900883061c6dc52cf471278317f1e4","url":"leaflet/leaflet-src.js"},{"revision":"21f4844183d578536e5cd3cd4ec844e1","url":"leaflet/leaflet.js"},{"revision":"9c102e7190af31a9477df45111e857e0","url":"manifest.json"}]);
    workbox.routing.registerRoute(
        new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        new workbox.strategies.CacheFirst({
            cacheName: 'google-fonts',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 30,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
            ],
        }),
    );

} else {
    console.log(`Boo! Workbox didn't load 😬`);
}