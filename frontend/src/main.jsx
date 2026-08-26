import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Rotte pubbliche completamente statiche (prerender): l'HTML è già completo,
// niente idratazione React (zero JS del framework su queste pagine).
// Le interazioni (menu, FAQ, carosello, cookie...) sono gestite da /static.js
// NOTA: '/' NON è nella lista: la home dipende da dati API e il prerender può
// catturarla parziale; con React attivo il contenuto si completa nel browser.
const STATIC_ROUTES = new Set([
  '/blog',
  '/risorse',
  '/psicologo-concorsi-pubblici',
  '/psicologo-sport',
  '/psicologia-giuridica',
  '/privacy',
  '/cookie',
  '/termini',
]);

const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
// Durante il prerender statico (scripts/prerender.js) forziamo il render anche
// sulle rotte statiche, così l'HTML catturato contiene TUTTO il contenuto
const PRERENDER = new URLSearchParams(window.location.search).has('__prerender');

if (!STATIC_ROUTES.has(path) || PRERENDER) {
  // Disattiva gli handler vanilla (le interazioni tornano a React)
  if (typeof window.__disableStatic === 'function') window.__disableStatic();
  // Sui percorsi React le dissolvenze "reveal" usano l'observer.
  // Durante il PRERENDER NON aggiungiamo la classe: deve restare assente
  // nell'HTML statico, così il CSS (body:not(.react-mounted)) rende visibili
  // le sezioni sulle pagine senza React.
  if (!PRERENDER) document.body.classList.add('react-mounted');

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// PWA: registra il service worker (app installabile, funziona offline)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
