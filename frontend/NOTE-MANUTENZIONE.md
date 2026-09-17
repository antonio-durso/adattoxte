# Note per chi mantiene il sito

## 1. Nel `<head>` non va messo un tag robots statico

`index.html` è anche la sorgente di `dist/app.html`, la shell servita come fallback SPA. Un
`<meta name="robots" content="index, follow">` statico finirebbe dentro quella shell e
contraddirebbe l'header `X-Robots-Tag: noindex` applicato dall'edge su alcune rotte.

Regola del sito:

> Le pagine indicizzabili **non dichiarano nulla** (assenza di tag = indicizzabile). Solo le pagine
> da escludere dichiarano `noindex`, tramite il componente `Seo`.

Corollario: **non reintrodurre** il markup di un `<meta name="robots">` in `index.html`. Gli
strumenti di controllo che leggono l'HTML con espressioni regolari lo interpreterebbero come una
direttiva reale.

## 2. Il canonical lo imposta il JavaScript

Non c'è un canonical statico nel `<head>`: tutte le rotte servono lo stesso documento, quindi un
canonical fisso punterebbe alla home anche per le landing e gli articoli. Lo imposta uno script
inline (subito, prima del mount di React) e poi il componente `Seo`. Va usata l'URL base del sito,
**mai** `location.origin`: durante il prerender statico l'origin è `localhost:4173` e il canonical
finirebbe rotto in produzione.

## 3. Coerenza sitemap ↔ noindex (obbligatoria)

> Una URL con `noindex` non va mai messa in sitemap. Una URL in sitemap non deve mai avere `noindex`.

Le pagine città escluse e `/impostazioni` sono coperte da `scripts/sync-vercel.mjs`.
