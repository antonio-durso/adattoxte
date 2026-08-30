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

export const articles = [
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
].sort(
  (a, b) => (a.date < b.date ? 1 : -1)
);

export const getArticle = (slug) => articles.find((a) => a.slug === slug) || null;

export const totalArticles = articles.length;
