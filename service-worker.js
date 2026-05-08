const CACHE_NAME = 'mateplay-v1.1.0';
const FILES_TO_CACHE = [
  './', './index.html', './js/game.js', './css/estilos.css',
  './data/pizza_rush.json', './data/tetris.json', './data/chef_fraccion.json',
  './data/arquitecto.json', './data/porcentajes.json',
  './data/ascensor_extremo.json', './data/clima_loco.json',
  './data/saldo_inteligente.json', './data/zona_impacto.json',
  './data/combinados_enteros.json', './data/combinados_fracciones.json',
  './manifest.json', './assets/icon-192.png', './assets/icon-512.png'
];

// Sonidos opcionales: se intentan cachear pero no bloquean la instalación
const OPTIONAL_FILES = [
  './assets/sounds/exito.mp3', './assets/sounds/error.mp3',
  './assets/sounds/grab.mp3', './assets/sounds/drop.mp3',
  './assets/sounds/bubbling.mp3', './assets/sounds/fanfarria.mp3',
  './assets/sounds/elevator.mp3', './assets/sounds/ding.mp3',
  './assets/sounds/caja.mp3', './assets/sounds/encaje.mp3'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cachear archivos opcionales sin romper si faltan
      OPTIONAL_FILES.forEach(url => cache.add(url).catch(() => {}));
      // Cachear archivos esenciales (estos SÍ deben existir)
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(caches.keys().then((keyList) => Promise.all(keyList.map((key) => {
    if (key !== CACHE_NAME) return caches.delete(key);
  }))));
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(caches.match(evt.request).then((response) => response || fetch(evt.request)));
});