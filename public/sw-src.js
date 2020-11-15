importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    // workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
    workbox.routing.registerRoute(
        new RegExp('https://http://bishkek-air.netlify.app'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'bishkek-air'
        }),
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}