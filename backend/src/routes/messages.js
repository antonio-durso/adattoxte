/**
 * Messaggistica sicura tra paziente e terapeuta.
 * Capitoli 2 (relazioni con i clienti) e 4.1 (comunicazione).
 * Ogni utente vede solo le conversazioni che lo riguardano.
 */
const express = require('express');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// POST /api/messages - invia messaggio a un altro utente
router.post('/', (req, res) => {
  const { recipientId, content } = req.body || {};
  if (!recipientId || !content || !String(content).trim()) {
    return res.status(400).json({ error: 'destinatario e contenuto sono obbligatori' });
  }
  if (String(content).length > 2000) return res.status(400).json({ error: 'Messaggio troppo lungo (max 2000 caratteri)' });

  const recipient = db.prepare('SELECT id FROM users WHERE id = ?').get(recipientId);
  if (!recipient) return res.status(404).json({ error: 'Destinatario non trovato' });
  if (recipientId === req.user.id) return res.status(400).json({ error: 'Non puoi mandare un messaggio a te stesso' });

  const id = crypto.randomUUID();
  db.prepare('INSERT INTO messages (id, sender_id, recipient_id, content) VALUES (?, ?, ?, ?)')
    .run(id, req.user.id, recipientId, String(content).trim());

  res.status(201).json({
    message: { id, senderId: req.user.id, recipientId, content: String(content).trim(), read: 0, createdAt: new Date().toISOString() },
  });
});

// GET /api/messages/conversations - elenco conversazioni dell'utente con ultimo messaggio
router.get('/conversations', (req, res) => {
  const me = req.user.id;
  const rows = db.prepare(`
    SELECT m.*, u.name AS peer_name, u.role AS peer_role
    FROM messages m
    JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.recipient_id ELSE m.sender_id END
    WHERE m.sender_id = ? OR m.recipient_id = ?
    ORDER BY m.created_at DESC
  `).all(me, me, me);

  const seen = new Set();
  const conversations = [];
  for (const m of rows) {
    const peerId = m.sender_id === me ? m.recipient_id : m.sender_id;
    if (seen.has(peerId)) continue;
    seen.add(peerId);
    conversations.push({
      peerId,
      peerName: m.peer_name,
      peerRole: m.peer_role,
      lastMessage: m.content,
      lastMessageAt: m.created_at,
      unread: m.sender_id !== me && !m.read ? 1 : 0,
    });
  }
  res.json({ conversations });
});

// GET /api/messages/conversations/:userId - storico con un determinato utente
router.get('/conversations/:userId', (req, res) => {
  const me = req.user.id;
  const peerId = req.params.userId;
  const peer = db.prepare('SELECT id, name FROM users WHERE id = ?').get(peerId);
  if (!peer) return res.status(404).json({ error: 'Utente non trovato' });

  // Segna come lette le ricevute
  db.prepare('UPDATE messages SET read = 1 WHERE sender_id = ? AND recipient_id = ?').run(peerId, me);

  const rows = db.prepare(`
    SELECT * FROM messages
    WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
    ORDER BY created_at ASC
  `).all(me, peerId, peerId, me);

  res.json({
    peer: { id: peer.id, name: peer.name },
    messages: rows.map(m => ({
      id: m.id, senderId: m.sender_id, recipientId: m.recipient_id,
      content: m.content, read: !!m.read, createdAt: m.created_at,
    })),
  });
});

// GET /api/messages/export - GDPR art. 20: esporta TUTTI i messaggi dell'utente (JSON)
router.get('/export', (req, res) => {
  const me = req.user.id;
  const rows = db.prepare(`
    SELECT m.id, m.sender_id AS senderId, m.recipient_id AS recipientId,
           m.content, m.read, m.created_at AS createdAt,
           sender.name AS senderName, recipient.name AS recipientName
    FROM messages m
    JOIN users sender ON sender.id = m.sender_id
    JOIN users recipient ON recipient.id = m.recipient_id
    WHERE m.sender_id = ? OR m.recipient_id = ?
    ORDER BY m.created_at ASC
  `).all(me, me);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="adattoxte-messaggi.json"');
  res.json({
    exportedAt: new Date().toISOString(),
    user: { id: me, name: req.user.name, email: req.user.email },
    messages: rows,
  });
});

// DELETE /api/messages/conversations/:userId - GDPR art. 17: cancella la conversazione con un utente
router.delete('/conversations/:userId', (req, res) => {
  const me = req.user.id;
  const peerId = req.params.userId;
  const peer = db.prepare('SELECT id, name FROM users WHERE id = ?').get(peerId);
  if (!peer) return res.status(404).json({ error: 'Utente non trovato' });

  const result = db.prepare(`
    DELETE FROM messages
    WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
  `).run(me, peerId, peerId, me);

  res.json({ ok: true, deleted: result.changes });
});

// DELETE /api/messages/:messageId - GDPR art. 17: cancella un singolo messaggio (solo se di proprietà)
router.delete('/:messageId', (req, res) => {
  const me = req.user.id;
  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.messageId);
  if (!msg) return res.status(404).json({ error: 'Messaggio non trovato' });
  if (msg.sender_id !== me) return res.status(403).json({ error: 'Puoi cancellare solo i tuoi messaggi' });
  db.prepare('DELETE FROM messages WHERE id = ?').run(msg.id);
  res.json({ ok: true, deleted: 1 });
});

module.exports = router;
