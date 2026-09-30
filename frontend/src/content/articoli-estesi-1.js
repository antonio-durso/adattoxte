// articoli-estesi-1.js — versioni lunghe di articoli già presenti.
//
// REGOLE (importanti, la build si blocca se non vengono rispettate):
//  1. Ogni voce ha lo STESSO `slug` dell'articolo originale: la deduplica in
//     articles.js tiene l'ultima occorrenza, quindi questa vince.
//  2. La `date` va copiata dall'originale: cambiarla sposta l'ordine del blog e
//     il blocco "articoli più recenti" in fondo a tutte le pagine.
//  3. Nel body usare SOLO apici doppi per gli attributi HTML e, se si usa una
//     stringa con apici singoli, sfuggire gli apostrofi ('l\'ansia'). Il modo
//     sicuro è il template literal: body: `...`
//  4. I link interni devono puntare a slug esistenti: `node scripts/check-links.mjs`
//     è un gate di build e blocca il deploy se trova un link rotto.

export const articoliEstesi1 = [];
