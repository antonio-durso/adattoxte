# SSG / Prerender completo — documentazione delle modifiche

> Stato: applicato su `main` e live in produzione (settembre 2026).
> Questo documento descrive i cambiamenti e i miglioramenti fatti al codice per
> risolvere il problema di indicizzazione (SPA renderizzata solo lato client).

---

## 1. Problema originale

- Sito SPA React+Vite: Google doveva eseguire JavaScript su ogni pagina per vedere
  il contenuto → 99 pagine "Discovered - not indexed" + 24 "URL is unknown to Google".
- Tutte le URL interne rispondevano con la stessa shell generica (32 KB, title
  "Adatto x Te - Psicologia online", nessun canonical nell'HTML statico).
- Il prerender esistente (`scripts/prerender.js`) girava nel build Vercel in modalità
  FAST (12 rotte) e i capture Chrome andavano in timeout nel sandbox Vercel.
- Sulla produzione alcune pagine core risultavano addirittura non generate
  (/privacy, /termini, /cookie → 404 sul file statico).

## 2. Soluzione applicata: SSG (prerender completo di tutte le rotte)

Obiettivo: ogni URL della sitemap serve **HTML statico completo** (title, description,
canonical, Open Graph, JSON-LD e contenuto) senza dipendere dal rendering JS di Google.

Risultato: **398 pagine statiche** (disturbi + città + blog + estero/paesi/capitali +
prezzi + aziende + pagine core), verificate live a 54-176 KB con title e H1 specifici.

## 3. File modificati

| File | Modifica |
|---|---|
| `frontend/scripts/prerender.js` | Cattura pagine via **puppeteer-core** (attesa `domcontentloaded` + timeout espliciti con retry, niente più hang su risorse esterne); fallback al dump CLI Chrome; flag Chrome per sandbox (`--disable-dev-shm-usage`, profili utente unici per evitare SingletonLock); gestione errori spawn di `vite preview` e backend locale (su Vercel il backend non è installato e non deve far crashare il prerender); pre-riscaldamento del backend live prima delle catture (cold start Render); opzione `--only=/percorso1,/percorso2` per test parziali; estensione rotte: paesi estero (hub + capitali), `/prezzi`, `/aziende` |
| `frontend/package.json` | Aggiunta `puppeteer-core` (devDependency); condizione di build: `PRERENDER_FAST=0` forza il prerender completo anche quando il CLI Vercel imposta `VERCEL=1` |
| `frontend/package-lock.json` | Allineato a package.json |
| `.github/workflows/prerender.yml` | Workflow **prerender-full**: a ogni push su `main` esegue `npm ci`, genera le 398 pagine statiche e fa il deploy **prebuilt** su Vercel (produzione). Include il link progetto Vercel (`.vercel/project.json`) e gira i comandi dalla radice del repo (il progetto ha `rootDirectory: frontend`) |
| `frontend/public/sitemap.xml` | Rigenerato con date reali |

## 4. Come funziona il flusso (produzione)

```
push su main
   └─ GitHub Actions "prerender-full" (~25-30 min)
        ├─ npm ci
        ├─ vercel pull (ambiente di produzione)
        ├─ PRERENDER_FAST=0 vercel build  → vite build + prerender 398 pagine + inline-css
        └─ vercel deploy --prebuilt --prod
             └─ www.adattoxte.com aggiornato con HTML statico completo
```

- **Unica fonte di produzione** = il workflow. L'auto-deploy git di Vercel è stato
  disattivato (altrimenti un secondo deploy veloce a 12 rotte sovrascriveva le pagine statiche).
- Rete di sicurezza: se una run fallisce, la produzione resta sull'ultima versione buona.

## 5. Comandi utili (sviluppo locale)

```bash
cd frontend
npm install

# Build completo con prerender di TUTTE le rotte (Chrome richiesto; si auto-installa)
# Nota: serve l'accesso al backend live per le pagine con dati API
node scripts/prerender.js

# Test su poche rotte (rapido)
node scripts/prerender.js --only=/psicologo-online/ansia,/blog/ansia-sociale

# Serve la dist generata per verifica visiva
npx vite preview
```

Verifica che una pagina sia statica (title e H1 specifici, non la shell):

```bash
curl -s -H 'Cache-Control: no-cache' https://www.adattoxte.com/psicologo-online/ansia \
  | grep -o '<title>[^<]*'          # title della pagina, non generico
curl -s -H 'Cache-Control: no-cache' https://www.adattoxte.com/psicologo-online/ansia \
  | grep -o '<h1[^>]*>[^<]*' | head -1   # H1 della pagina, non l'hero della home
```

## 6. Note operative e sicurezza

- I token usati per l'infrastruttura vanno **revocati a lavoro concluso**
  (GitHub → Settings → Developer settings → Personal access tokens).
- Il secret `VERCEL_TOKEN` nel repo (Settings → Secrets → Actions) contiene il
  token Vercel personale necessario al workflow. È criptato: nessuno può leggerlo.
- Se il backend su Render resta sul piano free: il DB viene azzerato a ogni deploy
  del backend; l'upgrade a Starter + disco persistente è previsto al primo paziente reale.
- Il prerender completo non può girare nel build cloud Vercel (limite 45 min):
  per questo viene eseguito su GitHub Actions e caricato come deployment "prebuilt".
