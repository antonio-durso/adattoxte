/**
 * Autenticazione JWT e controllo ruoli.
 * Capitolo 4.1 BP: "Registrazione e autenticazione degli utenti".
 */
const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, bio: u.bio };
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Autenticazione richiesta' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: 'Utente non trovato' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token non valido o scaduto' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Autenticazione richiesta' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Operazione non consentita per il tuo ruolo' });
    next();
  };
}

module.exports = { JWT_SECRET, signToken, publicUser, authRequired, requireRole };
