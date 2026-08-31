/**
 * Diario personale del paziente (privato, visibile solo al proprietario).
 * Funzione presente nelle principali piattaforme concorrenti (Serenis, BetterHelp...).
 * Il diario è cifrato solo lato cliente: il server conserva i testi come forniti dall'utente.
 */
const express = require('express');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// GET /api/diary — elenco delle voci del diario dell'utente (dalla più recente)
router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM diary_entries WHERE user_id = ? ORDER BY created_at DESC, rowid DESC')
    .all(req.user.id);
  res.json({ entries: rows });
});

// POST /api/diary — nuova voce
router.post('/', (req, res) => {
  const { title, content, mood } = req.body || {};
  if (!content || !String(content).trim())
    return res.status(400).json({ error: 'Contenuto mancante' });
  const id = crypto.randomUUID();
  db.prepare(
    'INSERT INTO diary_entries (id, user_id, title, content, mood) VALUES (?, ?, ?, ?, ?)'
  ).run(id, req.user.id, String(title || '').trim().slice(0, 120), String(content).trim(), String(mood || '').trim().slice(0, 20));
  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(id);
  res.status(201).json({ entry });
});

// PATCH /api/diary/:id — modifica una voce (solo il proprietario)
router.patch('/:id', (req, res) => {
  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Voce non trovata' });
  if (entry.user_id !== req.user.id) return res.status(403).json({ error: 'Non autorizzato' });
  const { title, content, mood } = req.body || {};
  if (content !== undefined && !String(content).trim())
    return res.status(400).json({ error: 'Contenuto mancante' });
  db.prepare(
    "UPDATE diary_entries SET title = ?, content = ?, mood = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(
    String(title !== undefined ? title : entry.title).trim().slice(0, 120),
    String(content !== undefined ? content : entry.content).trim(),
    String(mood !== undefined ? mood : entry.mood).trim().slice(0, 20),
    entry.id
  );
  res.json({ entry: db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(entry.id) });
});

// DELETE /api/diary/:id — cancella una voce (solo il proprietario)
router.delete('/:id', (req, res) => {
  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Voce non trovata' });
  if (entry.user_id !== req.user.id) return res.status(403).json({ error: 'Non autorizzato' });
  db.prepare('DELETE FROM diary_entries WHERE id = ?').run(entry.id);
  res.json({ ok: true });
});

module.exports = router;
