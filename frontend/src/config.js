// config.js — configurazione del sito (valori statici, non segreti)
// ================================================================
// EN_ACTIVE: abilita la versione inglese (/en) del sito.
//   false (default): il bottone lingua è nascosto, le pagine /en sono noindex
//                    e fuori dalla sitemap (nessun traffico EN in arrivo).
//   true:            ricompare il bottone IT/EN; sono indicizzabili SOLO le pagine
//                    /en con contenuto inglese reale (vedi enIndexable in Seo.jsx):
//                    blog, "italiani all'estero" e le landing non tradotte restano noindex.
//
// ATTIVO dal 17/09/2026. ATTENZIONE AL MESSAGGIO: le sedute si svolgono SOLO in
// italiano. La versione inglese serve a spiegare il servizio a chi legge in inglese
// (espatriati, studenti, residenti stranieri) e ogni pagina /en lo dichiara in modo
// esplicito: NON promettiamo terapeuti che parlano inglese.
export const EN_ACTIVE = true;
