// Indice completo degli articoli del blog (65 articoli)
// NOTA: estensione .js esplicita negli import: serve sia a Vite sia al
// prerender statico (Node ESM richiede l'estensione).
import { baseArticles } from './articles-base.js';
import { extraArticles } from './extra-articles.js';
import { extraArticles2 } from './extra-articles-2.js';
import { extraArticles3 } from './extra-articles-3.js';
import { extraArticles4 } from './extra-articles-4.js';
import { extraArticles5 } from './extra-articles-5.js';
import { extraArticles6 } from './extra-articles-6.js';
import { extraArticles7 } from './extra-articles-7.js';
import { extraArticles8 } from './extra-articles-8.js';
import { extraArticles9 } from './extra-articles-9.js';
import { extraArticles10 } from './extra-articles-10.js';
import { extraArticles11 } from './extra-articles-11.js';
import { extraArticles12 } from './extra-articles-12.js';
import { extraArticles13 } from './extra-articles-13.js';
import { extraArticles14 } from './extra-articles-14.js';
import { extraArticles15 } from './extra-articles-15.js';
import { extraArticles16 } from './extra-articles-16.js';
import { extraArticles17 } from './extra-articles-17.js';
import { extraArticles18 } from './extra-articles-18.js';
import { extraArticles19 } from './extra-articles-19.js';
import { extraArticles20 } from './extra-articles-20.js';
import { extraArticles21 } from './extra-articles-21.js';
import { extraArticles22 } from './extra-articles-22.js';
import { extraArticles23 } from './extra-articles-23.js';

// Estensioni: contengono la versione lunga di articoli già esistenti (stesso slug).
// Stanno in fondo e vincono sull'originale — vedi la deduplica per slug qui sotto.
import { articoliEstesi1 } from './articoli-estesi-1.js';
import { articoliEstesi2 } from './articoli-estesi-2.js';
import { articoliEstesi3 } from './articoli-estesi-3.js';
import { articoliEstesi4 } from './articoli-estesi-4.js';
import { articoliEstesi5 } from './articoli-estesi-5.js';
import { articoliEstesi6 } from './articoli-estesi-6.js';
import { articoliEstesi7 } from './articoli-estesi-7.js';
import { articoliEstesi8 } from './articoli-estesi-8.js';
import { articoliEstesi9 } from './articoli-estesi-9.js';
import { articoliEstesi10 } from './articoli-estesi-10.js';
import { articoliEstesi11 } from './articoli-estesi-11.js';
import { articoliEstesi12 } from './articoli-estesi-12.js';

const rawArticles = [
  ...baseArticles,
  ...extraArticles,
  ...extraArticles2,
  ...extraArticles3,
  ...extraArticles4,
  ...extraArticles5,
  ...extraArticles6,
  ...extraArticles7,
  ...extraArticles8,
  ...extraArticles9,
  ...extraArticles10,
  ...extraArticles11,
  ...extraArticles12,
  ...extraArticles13,
  ...extraArticles14,
  ...extraArticles15,
  ...extraArticles16,
  ...extraArticles17,
  ...extraArticles18,
  ...extraArticles19,
  ...extraArticles20,
  ...extraArticles21,
  ...extraArticles22,
  ...extraArticles23,
  ...articoliEstesi1,
  ...articoliEstesi2,
  ...articoliEstesi3,
  ...articoliEstesi4,
  ...articoliEstesi5,
  ...articoliEstesi6,
  ...articoliEstesi7,
  ...articoliEstesi8,
  ...articoliEstesi9,
  ...articoliEstesi10,
  ...articoliEstesi11,
  ...articoliEstesi12,
];

// Deduplica per slug: a parità di slug vince l'ULTIMA occorrenza, cioè la versione
// estesa. Prima di questo filtro l'elenco conteneva due volte lo stesso slug e
// getArticle() restituiva la prima — quindi un'estensione scritta in coda non si
// sarebbe mai vista. Il test 'articoli: slug univoci' copre la regressione.
const perSlug = new Map();
for (const a of rawArticles) perSlug.set(a.slug, a);

export const articles = [...perSlug.values()].sort(
  (a, b) => (a.date < b.date ? 1 : -1)
);

// Articoli 'in attesa': restano nel codice con URL vivo ma sono nascosti ai
// visitatori (elenchi) e ai motori (noindex + fuori sitemap) finché non verranno
// riattivati rimuovendo lo slug da questo set (es. quando ci saranno terapeuti anglofoni).
export const HIDDEN_ARTICLE_SLUGS = new Set(['psicologo-online-in-inglese']);
export const visibleArticles = articles.filter((a) => !HIDDEN_ARTICLE_SLUGS.has(a.slug));

export const getArticle = (slug) => articles.find((a) => a.slug === slug) || null;

export const totalArticles = articles.length;
