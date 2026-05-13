const CACHE_NAME = 'mateplay-v1.2.0';
const FILES_TO_CACHE = [
  './', 
  './index.html', 
  './js/game.js', 
  './css/estilos.css',
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
  './data/combinados_fracciones.json',
  './manifest.json', 
  './assets/icon-192.png', 
  './assets/icon-512.png',
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

// Instalación: Cachear todo lo necesario
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-cacheando archivos para uso offline');
      return cache.addAll(FILES_TO_CACHE);
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

// Fetch: Estrategia Cache-First (Priorizar cache para velocidad y offline)
self.addEventListener('fetch', (evt) => {
  // Solo manejar peticiones GET
  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    caches.match(evt.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      // Si no está en cache, intentar red
      return fetch(evt.request).then((response) => {
        // Opcional: Podríamos cachear dinámicamente aquí si quisiéramos
        return response;
      }).catch(() => {
        // Si falla red y no hay cache, podrías retornar una página offline aquí
      });
    })
  );
});