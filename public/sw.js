importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    // workbox.precaching.precacheAndRoute([{"revision":"cc4c67a03c8a50ac445155cb44b51687","url":"build/bundle.css"},{"revision":"6527abd1feec927a7eb1c694c4cf71d9","url":"global.css"},{"revision":"6b7939304e1bc55fac601aabffcc528d","url":"leaflet/leaflet.css"},{"revision":"d54e1c199b4bde5240ab82129722daf9","url":"assets/android-chrome-192x192.png"},{"revision":"8e6a39317c4539970341c5cb430e4466","url":"assets/android-chrome-512x512.png"},{"revision":"d3cb5570f70d58f2f8c966f051af81dd","url":"assets/apple-touch-icon.png"},{"revision":"575ddba26332303397b43f7920023ee4","url":"assets/favicon-16x16.png"},{"revision":"f65b14bc688820d9fa4f12c055f93cd3","url":"assets/favicon-32x32.png"},{"revision":"29cef7b23d3be905670c46e228ec231d","url":"assets/mstile-150x150.png"},{"revision":"c64beab291de80970aa4887a5a1c9135","url":"favicon.png"},{"revision":"4f0283c6ce28e888000e978e537a6a56","url":"leaflet/images/layers-2x.png"},{"revision":"a6137456ed160d7606981aa57c559898","url":"leaflet/images/layers.png"},{"revision":"401d815dc206b8dc1b17cd0e37695975","url":"leaflet/images/marker-icon-2x.png"},{"revision":"2273e3d8ad9264b7daa5bdbf8e6b47f8","url":"leaflet/images/marker-icon.png"},{"revision":"44a526eed258222515aa21eaffd14a96","url":"leaflet/images/marker-shadow.png"},{"revision":"7277480fe84d8ff18330681948ea7f0b","url":"assets/marker.svg"},{"revision":"43700525b5eabcb4d591a2d509e31066","url":"assets/safari-pinned-tab.svg"},{"revision":"cda969cb89e8462ab2668c7e089d0cdf","url":"assets/favicon.ico"},{"revision":"52fcdbcb6b2a1f64f6eb1b6732fabfbb","url":"index.html"},{"revision":"8c2bfc007e139023923c89858af47db3","url":"build/bundle.js"},{"revision":"63b5ce0e004061918e58524dd3a5a8d7","url":"leaflet/leaflet-src.esm.js"},{"revision":"55900883061c6dc52cf471278317f1e4","url":"leaflet/leaflet-src.js"},{"revision":"21f4844183d578536e5cd3cd4ec844e1","url":"leaflet/leaflet.js"},{"revision":"e93d75419193f9d17c7990bf4fabb7b8","url":"manifest.json"}]);
    workbox.routing.registerRoute(
        new RegExp('https://http://bishkek-air.netlify.app'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'bishkek-air'
        }),
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}