/**
 * db-remoto.js — tiene il file del database su Turso, così sopravvive ai riavvii.
 *
 * PERCHE' SERVE: su Render, il piano free ha un filesystem che si azzera a ogni
 * riavvio e dopo 15 minuti di inattività. Senza questo, i profili dei
 * professionisti sparirebbero.
 *
 * COME FUNZIONA: non spostiamo il database. Spostiamo IL FILE del database.
 * Turso fa da magazzino: ci mettiamo dentro il file .db come un blob.
 * Il codice dell'applicazione non cambia: continua a usare better-sqlite3,
 * in modo sincrono, sul file locale.
 *
 * DUE RUOLI, UN FILE SOLO:
 *   - eseguito come script  → scarica il database (va fatto PRIMA di aprirlo)
 *   - richiesto come modulo → esporta carica() e avviaSincronizzazione()
 *
 * FAIL-SAFE: se TURSO_URL o TURSO_TOKEN non sono configurati, non fa niente
 * e l'applicazione funziona come prima. Così il deploy non si rompe mai.
 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const URL_TURSO = process.env.TURSO_URL || '';
const TOKEN = process.env.TURSO_TOKEN || '';
const ATTIVO = Boolean(URL_TURSO && TOKEN);

// libsql://nome.turso.io  →  https://nome.turso.io
function endpoint() {
  return URL_TURSO.replace(/^libsql:\/\//, 'https://').replace(/\/$/, '');
}

function percorsoDb() {
  const dataDir = path.join(__dirname, '..', 'data');
  return process.env.DB_PATH || path.join(dataDir, 'adattoxte.db');
}

// ── Copia consistente ───────────────────────────────────────────────────────
// Il database gira in journal_mode = WAL: le scritture finiscono nel file -wal
// e il file principale cambia solo al checkpoint. Leggere direttamente il .db
// significa caricare su Turso una copia vecchia, o addirittura vuota.
// Quindi: prima si forza il checkpoint, poi si legge.
function checkpoint() {
  const file = percorsoDb();
  if (!fs.existsSync(file)) return false;
  let connessione = null;
  try {
    connessione = new Database(file);
    connessione.pragma('wal_checkpoint(TRUNCATE)');
    return true;
  } catch (e) {
    console.warn('[db-remoto] checkpoint non riuscito:', String(e.message).slice(0, 160));
    return false;
  } finally {
    if (connessione) { try { connessione.close(); } catch (e) { /* niente */ } }
  }
}

// Firma del database: include il file -wal, che e' quello che cambia a ogni
// scrittura. Guardando solo il file principale le modifiche restano invisibili
// finche' non arriva un checkpoint, e quindi non vengono mai caricate.
function firma() {
  const file = percorsoDb();
  const pezzo = (f) => {
    try { const s = fs.statSync(f); return `${s.size}-${s.mtimeMs}`; } catch (e) { return 'x'; }
  };
  return `${pezzo(file)}|${pezzo(file + '-wal')}`;
}

let pronta = false;

async function pipeline(richieste) {
  const r = await fetch(`${endpoint()}/v2/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: richieste })
  });
  const testo = await r.text();
  if (!r.ok) throw new Error(`Turso ${r.status}: ${testo.slice(0, 300)}`);
  return JSON.parse(testo);
}

const EXEC = (sql, args = []) => ({ type: 'execute', stmt: { sql, args } });

async function creaTabella() {
  await pipeline([
    EXEC('CREATE TABLE IF NOT EXISTS archivio (id INTEGER PRIMARY KEY CHECK (id = 1), dati BLOB, aggiornato TEXT)'),
    { type: 'close' }
  ]);
}

/** Scarica il database da Turso. Restituisce true se ha scritto il file. */
async function scarica() {
  if (!ATTIVO) return false;
  await creaTabella();
  const out = await pipeline([EXEC('SELECT dati FROM archivio WHERE id = 1'), { type: 'close' }]);
  const righe = (out.results && out.results[0] && out.results[0].response
    && out.results[0].response.result && out.results[0].response.result.rows) || [];
  if (!righe.length || !righe[0] || !righe[0][0]) {
    console.log('[db-remoto] nessuna copia su Turso: si parte dal database locale');
    return false;
  }
  const cella = righe[0][0];
  const b64 = cella.base64 || cella.value;
  if (!b64) return false;

  const dati = Buffer.from(b64, 'base64');

  // SICUREZZA: prima di sovrascrivere il database locale, controllo che quello
  // scaricato sia davvero un database SQLite. Senza questo controllo, una copia
  // corrotta renderebbe l'applicazione inutilizzabile — e non partirebbe piu'.
  if (dati.length < 100 || dati.subarray(0, 15).toString('latin1') !== 'SQLite format 3') {
    console.warn('[db-remoto] la copia su Turso non e\' un database SQLite valido: la ignoro');
    return false;
  }

  const file = percorsoDb();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // scrivo su file temporaneo e poi rinomino: se si interrompe, il db resta valido
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, dati);
  fs.renameSync(tmp, file);
  // Un -wal rimasto da una generazione precedente del database verrebbe
  // applicato al file appena scaricato. Senza disco persistente non capita,
  // ma con il disco (piano a pagamento) questo corrompe il database.
  for (const residuo of [file + '-wal', file + '-shm']) {
    try { if (fs.existsSync(residuo)) fs.unlinkSync(residuo); } catch (e) { /* niente */ }
  }
  console.log(`[db-remoto] database scaricato da Turso (${Math.round(fs.statSync(file).size / 1024)} KB)`);
  return true;
}

/** Carica il database su Turso. */
async function carica() {
  if (!ATTIVO) return false;
  const file = percorsoDb();
  if (!fs.existsSync(file)) return false;
  // Il file principale deve contenere anche cio' che sta nel -wal, altrimenti
  // si spedisce a Turso una copia incompleta.
  checkpoint();
  const b64 = fs.readFileSync(file).toString('base64');
  if (!pronta) { await creaTabella(); pronta = true; }
  await pipeline([
    EXEC('INSERT OR REPLACE INTO archivio (id, dati, aggiornato) VALUES (1, ?, ?)',
      [{ type: 'blob', base64: b64 }, { type: 'text', value: new Date().toISOString() }]),
    { type: 'close' }
  ]);
  return true;
}

/**
 * Controlla ogni pochi secondi se il file e' cambiato e, se si', lo carica.
 * Cosi' non serve toccare nessuna rotta: basta che il file cambi.
 */
function avviaSincronizzazione(intervalloMs = 5000) {
  if (!ATTIVO) {
    console.log('[db-remoto] TURSO_URL/TURSO_TOKEN assenti: persistenza disattivata');
    return null;
  }
  const file = percorsoDb();
  let ultimaFirma = firma();

  let inCorso = false;
  const timer = setInterval(async () => {
    if (inCorso) return;
    try {
      if (!fs.existsSync(file)) return;
      if (firma() === ultimaFirma) return;
      inCorso = true;
      await carica();
      ultimaFirma = firma();
    } catch (e) {
      console.warn('[db-remoto] caricamento non riuscito:', String(e.message).slice(0, 160));
    } finally {
      inCorso = false;
    }
  }, intervalloMs);

  if (timer.unref) timer.unref();
  console.log(`[db-remoto] sincronizzazione attiva (ogni ${intervalloMs / 1000}s)`);
  return timer;
}

module.exports = { scarica, carica, avviaSincronizzazione, percorsoDb, ATTIVO };

// ── Se eseguito come script: scarica e esce ──────────────────────────────────
// db.js lo lancia con execFileSync PRIMA di aprire il database.
if (require.main === module) {
  scarica()
    .then((fatto) => { console.log(fatto ? '[db-remoto] pronto' : '[db-remoto] nessuna copia remota'); })
    .catch((e) => { console.warn('[db-remoto] download non riuscito:', String(e.message).slice(0, 200)); })
    .finally(() => process.exit(0));
}
