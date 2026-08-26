/**
 * Adatto x Te - server principale
 * Piattaforma di consulenza psicologica online (business plan cap. 4.1)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDb } = require('./db');

const app = express();

// Sicurezza header HTTP (CSP, X-Frame-Options, nosniff, ...)
app.use(helmet());
// Compressione gzip delle risposte HTTP (prima delle rotte)
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true }));

// Rate limiting su /api/auth (protezione login/registrazione da brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 20,                  // massimo 20 richieste per IP
  standardHeaders: true,    // Restituisce gli header RateLimit-*
  legacyHeaders: false,
  message: { error: 'Troppi tentativi. Riprova tra qualche minuto.' },
});
app.use('/api/auth', authLimiter);

app.use(express.json());

app.get('/api/health', (req, res) => {
  let mailerStatus = 'demo';
  try {
    mailerStatus = require('./mailer').configured ? 'attivo' : 'demo';
  } catch (e) { mailerStatus = 'non-disponibile'; }
  res.json({ ok: true, service: 'adattoxte-backend', version: '1.0.0', mailer: mailerStatus });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/me', require('./routes/me'));
app.use('/api/therapists', require('./routes/therapists'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/admin', require('./routes/admin'));

// Gestione errori centralizzata
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Errore interno del server' });
});

const PORT = process.env.PORT || 3001;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Adatto x Te backend in ascolto su http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('Errore inizializzazione database:', err);
    process.exit(1);
  });
