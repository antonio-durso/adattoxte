/**
 * Persistenza del database su Turso.
 *
 * Regressione: il database gira in journal_mode = WAL, quindi le scritture
 * restano nel file -wal e il file principale cambia solo al checkpoint. Se la
 * copia caricata su Turso e' presa leggendo direttamente il .db, i dati scritti
 * dopo l'ultimo checkpoint non vengono mai salvati: al riavvio si perdono.
 *
 * Il test riproduce il ciclo completo: scrive, carica su un Turso finto,
 * simula un nuovo deploy su filesystem vuoto e verifica che i dati ci siano.
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Database = require('better-sqlite3');

/** Turso finto: implementa /v2/pipeline e tiene l'archivio in memoria. */
function avviaTursoFinto() {
  let archivio = null;
  const server = http.createServer((req, res) => {
    let corpo = '';
    req.on('data', (c) => { corpo += c; });
    req.on('end', () => {
      const body = JSON.parse(corpo || '{}');
      const results = (body.requests || []).map((r) => {
        if (r.type === 'close') return { type: 'close', response: { type: 'close' } };
        const sql = String((r.stmt && r.stmt.sql) || '').trim().toUpperCase();
        const args = (r.stmt && r.stmt.args) || [];
        const result = { cols: [], rows: [], affected_row_count: 0 };
        if (sql.startsWith('SELECT')) {
          result.rows = archivio ? [[{ type: 'blob', base64: archivio }]] : [];
        }
        if (sql.startsWith('INSERT')) {
          archivio = args[0] && args[0].base64;
        }
        return { type: 'execute', response: { type: 'execute', result } };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ baton: null, base_url: null, results }));
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({
      url: `http://127.0.0.1:${server.address().port}`,
      archivio: () => archivio,
      // fetch tiene le connessioni in keep-alive: senza chiuderle a forza,
      // server.close() non ritorna mai e il test resta appeso.
      chiudi: () => new Promise((r) => {
        server.close(r);
        if (server.closeAllConnections) server.closeAllConnections();
      })
    }));
  });
}

// Un solo Turso finto per tutto il file: db-remoto.js legge TURSO_URL una volta
// sola, quando viene caricato, quindi non si puo' cambiare server fra un test e
// l'altro senza svuotare la cache dei moduli.
let turso = null;
before(async () => { turso = await avviaTursoFinto(); });
after(async () => { if (turso) await turso.chiudi(); });

/** Crea un database vivo in WAL con dentro una tabella e delle righe. */
function creaDatabaseConDati(file, quante) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.exec('CREATE TABLE terapeuti (id INTEGER PRIMARY KEY, nome TEXT)');
  for (let i = 1; i <= quante; i++) {
    db.prepare('INSERT INTO terapeuti (id, nome) VALUES (?, ?)').run(i, 'terapeuta-' + i);
  }
  return db;
}

test('i dati scritti subito prima del deploy sopravvivono al riavvio', async () => {
  const radice = fs.mkdtempSync(path.join(os.tmpdir(), 'adattoxte-persistenza-'));
  const origine = path.join(radice, 'servizio-in-corso', 'adattoxte.db');
  const destinazione = path.join(radice, 'nuovo-deploy', 'adattoxte.db');

  process.env.TURSO_URL = turso.url;
  process.env.TURSO_TOKEN = 'token-di-prova';
  process.env.DB_PATH = origine;

  const remoto = require('../src/db-remoto.js');

  const vivo = creaDatabaseConDati(origine, 5);
  assert.ok(fs.existsSync(origine + '-wal'),
    'il database deve girare in WAL, altrimenti il test non verifica nulla');

  // quello che fa il servizio mentre gira
  assert.equal(await remoto.carica(), true, 'il caricamento deve riuscire');

  // quello che succede su un filesystem vuoto, dopo un deploy
  process.env.DB_PATH = destinazione;
  assert.equal(await remoto.scarica(), true, 'il ripristino deve riuscire');

  const copia = new Database(destinazione);
  const presenti = copia.prepare('SELECT COUNT(*) AS c FROM terapeuti').get().c;
  copia.close();
  vivo.close();

  assert.equal(presenti, 5, 'tutti i dati scritti prima del deploy devono essere presenti');

  fs.rmSync(radice, { recursive: true, force: true });
});

test('il ripristino elimina un -wal rimasto da una generazione precedente', async () => {
  const radice = fs.mkdtempSync(path.join(os.tmpdir(), 'adattoxte-wal-'));
  const origine = path.join(radice, 'servizio-in-corso', 'adattoxte.db');
  const destinazione = path.join(radice, 'con-disco-persistente', 'adattoxte.db');

  process.env.TURSO_URL = turso.url;
  process.env.TURSO_TOKEN = 'token-di-prova';
  process.env.DB_PATH = origine;

  const remoto = require('../src/db-remoto.js');

  const vivo = creaDatabaseConDati(origine, 3);
  await remoto.carica();

  // scenario del piano a pagamento: il disco conserva il vecchio -wal
  fs.mkdirSync(path.dirname(destinazione), { recursive: true });
  fs.writeFileSync(destinazione, 'vecchio database');
  fs.writeFileSync(destinazione + '-wal', 'wal di una generazione precedente');
  fs.writeFileSync(destinazione + '-shm', 'shm di una generazione precedente');

  process.env.DB_PATH = destinazione;
  assert.equal(await remoto.scarica(), true);

  assert.equal(fs.existsSync(destinazione + '-wal'), false,
    'un -wal vecchio applicato al database appena scaricato puo corromperlo');
  assert.equal(fs.existsSync(destinazione + '-shm'), false);

  const copia = new Database(destinazione);
  const presenti = copia.prepare('SELECT COUNT(*) AS c FROM terapeuti').get().c;
  copia.close();
  vivo.close();

  assert.equal(presenti, 3);

  fs.rmSync(radice, { recursive: true, force: true });
});
