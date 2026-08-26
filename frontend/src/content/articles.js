// Indice completo degli articoli del blog (65 articoli)
import { baseArticles } from './articles-base';
import { extraArticles } from './extra-articles';
import { extraArticles2 } from './extra-articles-2';
import { extraArticles3 } from './extra-articles-3';
import { extraArticles4 } from './extra-articles-4';
import { extraArticles5 } from './extra-articles-5';
import { extraArticles6 } from './extra-articles-6';
import { extraArticles7 } from './extra-articles-7';
import { extraArticles8 } from './extra-articles-8';
import { extraArticles9 } from './extra-articles-9';
import { extraArticles10 } from './extra-articles-10';
import { extraArticles11 } from './extra-articles-11';

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
].sort(
  (a, b) => (a.date < b.date ? 1 : -1)
);

export const getArticle = (slug) => articles.find((a) => a.slug === slug) || null;

export const totalArticles = articles.length;
