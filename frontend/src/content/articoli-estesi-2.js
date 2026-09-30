// articoli-estesi-2.js — versioni lunghe di articoli già presenti.
// REGOLE (la build si blocca se non vengono rispettate):
//  1. STESSO slug dell'articolo originale: la deduplica in articles.js tiene
//     l'ultima occorrenza, quindi questa versione vince.
//  2. Copiare la `date` dall'originale: cambiarla sposta l'ordine del blog.
//  3. Usare il template literal per `body`: body: \`...\`  — così gli apostrofi
//     italiani non vanno sfuggiti e non si rompe il file.
//  4. Solo link interni a slug esistenti: node scripts/check-links.mjs è un
//     gate di build e blocca il deploy se trova un link rotto.
//  5. Nessun dato, statistica, studio o fonte inventata.

export const articoliEstesi2 = [];
