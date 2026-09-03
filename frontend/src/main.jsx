import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import './styles.css';

// Monitoraggio errori (Sentry) — attivo solo se VITE_SENTRY_DSN è configurato
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.PROD ? 'production' : 'development',
    tracesSampleRate: 0.1,
    ignoreErrors: [
      'ResizeObserver loop',
      'Non-Error promise rejection captured',
      // Errori transitori post-deploy: il browser chiede un chunk vecchio appena
      // rinominato. L'app si ricarica da sola (handleBoundaryError); nessun bisogno
      // di allertare via email a ogni deploy.
      'Failed to fetch dynamically imported module',
      'Importing a module script failed',
      'error loading dynamically imported module',
      'dynamically imported module',
    ],
  });
}

// Dopo un deploy, il browser può avere in cache un bundle VECCHIO che chiede
// chunk eliminati/rinominati -> "Failed to fetch dynamically imported module".
// In quel caso la pagina non serve a niente: la ricarichiamo una volta (il
// reload scarica l'HTML e i chunk nuovi, coerenti tra loro).
// Guardia anti-loop: massimo un reload automatico ogni 15 secondi.
function isChunkLoadError(err) {
  const msg = err && err.message ? String(err.message) : String(err || '');
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('dynamically imported module')
  );
}

function handleBoundaryError(error) {
  if (!isChunkLoadError(error)) return;
  const last = Number(sessionStorage.getItem('adt-chunk-reload') || 0);
  const now = Date.now();
  if (now - last > 15000) {
    sessionStorage.setItem('adt-chunk-reload', String(now));
    window.location.reload();
  }
}

// Rotte pubbliche completamente statiche (prerender): l'HTML è già completo,
// niente idratazione React (zero JS del framework su queste pagine).
// Le interazioni (menu, FAQ, carosello, cookie...) sono gestite da /static.js
// NOTA: anche '/' (home) è statica: è interamente prerenderizzata e le sue
// interazioni (menu, lingua, cookie, FAQ, slider, recensioni) sono in static.js.
// Questo porta TBT ~0 e performance 95-100 su PageSpeed.
const STATIC_ROUTES = new Set([
  '/',
  '/blog',
  '/risorse',
  '/psicologo-online',
  '/psicologo-concorsi-pubblici',
  '/psicologo-sport',
  '/psicologia-giuridica',
  '/privacy',
  '/cookie',
  '/termini',
  '/tibiz',
  '/equipe',
]);

const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
// Anche gli articoli del blog sono pagine prerenderizzate statiche
const isStatic = STATIC_ROUTES.has(path) || (path.startsWith('/blog/') && path.length > 6);
// Durante il prerender statico (scripts/prerender.js) forziamo il render anche
// sulle rotte statiche, così l'HTML catturato contiene TUTTO il contenuto
const PRERENDER = new URLSearchParams(window.location.search).has('__prerender');
// Fallback (fix Vercel 28/08): se il prerender NON è stato eseguito (su Vercel
// manca Chrome e lo script esce in silenzio), l'HTML servito non contiene
// header/main ma solo la hero statica: montiamo React comunque, così la pagina
// funziona via rendering client-side (come con la vecchia architettura).
const hasStaticContent = !!(document.querySelector('header, nav, main'));

if (!isStatic || PRERENDER || !hasStaticContent) {
  // Disattiva gli handler vanilla (le interazioni tornano a React)
  if (typeof window.__disableStatic === 'function') window.__disableStatic();
  // Sui percorsi React le dissolvenze "reveal" usano l'observer.
  // Durante il PRERENDER NON aggiungiamo la classe: deve restare assente
  // nell'HTML statico, così il CSS (body:not(.react-mounted)) rende visibili
  // le sezioni sulle pagine senza React.
  if (!PRERENDER) document.body.classList.add('react-mounted');

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Sentry.ErrorBoundary
        onError={handleBoundaryError}
        fallback={
          <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ color: '#48A8D8' }}>Ops, qualcosa è andato storto</h1>
            <p>L'errore è stato segnalato automaticamente al nostro team.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '12px 24px', borderRadius: 999, border: 0, background: '#48A8D8', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              Ricarica la pagina
            </button>
          </div>
        }
      >
        <App />
      </Sentry.ErrorBoundary>
    </React.StrictMode>
  );
}

// PWA: registra il service worker (app installabile, funziona offline)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
