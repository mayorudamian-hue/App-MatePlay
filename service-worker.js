const CACHE_NAME = 'mateplay-v1.2.1';
const ESSENTIAL_FILES = [
  './', 
  './index.html', 
  './js/game.js', 
  './css/estilos.css',
  './manifest.json', 
  './assets/icon-192.png', 
  './assets/icon-512.png',
  './data/pizza_rush.json', 
  './data/tetris.json', 
  './data/chef_fraccion.json',
  './data/arquitecto.json', 
  './data/porcentajes.json',
  './data/ascensor_extremo.json', 
  './data/clima_loco.json',
  './data/saldo_inteligente.json', 
  './data/zona_impacto.json',
  './data/combinados_enteros.json', 
  './data/combinados_fracciones.json'
];

const OPTIONAL_ASSETS = [
  './assets/sounds/exito.mp3', 
  './assets/sounds/error.mp3',
  './assets/sounds/grab.mp3', 
  './assets/sounds/drop.mp3',
  './assets/sounds/bubbling.mp3', 
  './assets/sounds/fanfarria.mp3',
  './assets/sounds/elevator.mp3', 
  './assets/sounds/ding.mp3',
  './assets/sounds/caja.mp3', 
  './assets/sounds/encaje.mp3'
];

// Instalación: Cachear lo esencial y luego intentar lo opcional
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Cacheando archivos esenciales...');
      // Intentar cachear archivos opcionales uno por uno para que no rompa la promesa global
      OPTIONAL_ASSETS.forEach(url => {
        cache.add(url).catch(err => console.warn(`[ServiceWorker] No se pudo cachear activo opcional: ${url}`));
      });
      // Estos SÍ deben existir para que el SW se instale
      return cache.addAll(ESSENTIAL_FILES);
    })
  );
  self.skipWaiting();
});

// Activación: Limpiar versiones antiguas
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Eliminando cache antiguo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch: Estrategia Cache-First
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then((cachedResponse) => {
      return cachedResponse || fetch(evt.request).catch(() => {
        // Fallback si no hay red ni cache
      });
    })
  );
});