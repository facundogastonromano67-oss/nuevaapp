import { render } from './views.js';

const root = document.querySelector('#app');

function showRecovery(error) {
  console.error('SYSTEM no pudo iniciar', error);
  root.innerHTML = `<section class="fatal panel">
    <p class="eyebrow">RECUPERACIÓN DEL SISTEMA</p>
    <h1>No pudimos cargar tu interfaz</h1>
    <p>Tus datos siguen guardados. Probá recargar la aplicación; si el problema continúa, limpiá sólo la caché visual.</p>
    <div class="row-actions">
      <button class="primary" id="retry-app">RECARGAR</button>
      <button class="ghost" id="clear-app-cache">LIMPIAR CACHÉ Y RECARGAR</button>
    </div>
    <details><summary>Detalle técnico</summary><code>${String(error?.message || error)}</code></details>
  </section>`;
  document.querySelector('#retry-app').onclick = () => location.reload();
  document.querySelector('#clear-app-cache').onclick = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
    }
    location.reload();
  };
}

function renderSafely() {
  try { render(); } catch (error) { showRecovery(error); }
}

root.innerHTML='<div class="boot"><span>SYSTEM</span><small>Sincronizando núcleo personal…</small></div>';
setTimeout(renderSafely, 350);
window.addEventListener('statechange', renderSafely);
window.addEventListener('error', event => showRecovery(event.error || event.message));
window.addEventListener('unhandledrejection', event => showRecovery(event.reason));

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
      registration.update();
    } catch (error) {
      console.warn('PWA no disponible; la app continúa en modo local.', error);
    }
  });
}
