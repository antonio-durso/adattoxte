# MANUALE COMPLETO DI RIPRODUZIONE — Piattaforma "Adatto x Te"

> Documento di handover: contiene TUTTO ciò che serve a un'altra intelligenza
> artificiale (o a un tecnico) per ricostruire, gestire e continuare la piattaforma
> in modo automatico. Ultimo aggiornamento: 24 agosto 2026.

---

## 1. STATO ATTUALE (cosa è ONLINE)

| Componente | Indirizzo | Stato |
|---|---|---|
| Sito principale (frontend) | https://adattoxte.vercel.app | ✅ ONLINE |
| Backend (API) | https://adattoxte-backend.onrender.com | ✅ ONLINE |
| Sito alternativo (GitHub Pages) | https://antonio-durso.github.io/adattoxte/ | ✅ ONLINE |
| Repository codice | https://github.com/antonio-durso/adattoxte | ✅ ONLINE |
| Blog | https://adattoxte.vercel.app/blog | ✅ 65 articoli |
| Sitemap | https://adattoxte.vercel.app/sitemap.xml | ✅ 73 URL |
| Google Search Console | proprietà `https://adattoxte.vercel.app/` | ✅ verificata + sitemap inviata |
| Hero animato (fumetto) | https://adattoxte.vercel.app | ✅ online |

**IN SOSPESO / DA FARE:**
- Video animati: NON generati (crediti insufficienti: servono 240/video, disponibili 191)
- Frontend valutazioni/guadagni/ricevuta/matching: backend pronto, UI frontend NON ancora implementata
- Dominio proprio (~10 €/anno): non acquistato
- Stripe (pagamenti reali): non attivato (modalità demo attiva)
- Collegamento GitHub/Vercel da ripristinare dopo ogni riavvio dell'ambiente (vedi §6)

---

## 2. CREDENZIALI E ACCOUNT (TUTTI)

### Account piattaforma (seed automatico)
| Ruolo | Email | Password |
|---|---|---|
| Admin | admin@adattoxte.it | Admin123! |
| Paziente demo | antonio@adattoxte.it | Demo1234! |
| Terapeuta 1 | elena.bianchi@adattoxte.it | Terapeuta1! |
| Terapeuta 2 | marco.russo@adattoxte.it | Terapeuta2! |
| Terapeuta 3 | giulia.conti@adattoxte.it | Terapeuta3! |
| Terapeuta 4 | luca.ferrari@adattoxte.it | Terapeuta4! |
| Terapeuta 5 | sara.greco@adattoxte.it | Terapeuta5! |

### Account esterni
| Servizio | Identificativo | Note |
|---|---|---|
| GitHub | antonio-durso | password cambiata il 24/08 (account personale) |
| Vercel | team "spazio-cambiamento", utente antdurso1-7724 | progetto "adattoxte" |
| Render | account con sign-in GitHub | Blueprint "adattoxte-backend" |
| Gmail | ant.durso1@gmail.com | usato per recuperi password |
| Google Search Console | proprietà https://adattoxte.vercel.app/ | meta tag: `<meta name="google-site-verification" content="LaLxpY_r91NfbWwxBuKEBsiR_cykBocaGhyAnF4nrn8" />` |

### Link "magico" per l'accesso admin (campi precompilati — NON condividere)
```
https://adattoxte.vercel.app/accedi?email=admin@adattoxte.it&pw=Admin123%21
```

---

## 3. ARCHITETTURA E STACK

- **Backend**: Node.js + Express + SQLite (better-sqlite3), JWT auth, bcrypt. Porta 3001.
- **Frontend**: React + Vite (SPA), i18n it/en, axios.
- **Videochiamate**: Jitsi Meet pubblico (meet.jit.si) — embed nel browser, nessuna app.
- **Pagamenti**: modalità demo (Stripe non configurato → nessun addebito).
- **Deploy**: Vercel (frontend) + Render (backend, free tier) + GitHub Pages (backup statico).
- **Proxy same-origin**: su Vercel, `/api/*` viene inoltrato al backend Render (vedi §5) — elimina i problemi CORS/blocchi browser.

### Alberatura progetto (workspace)
```
project/
├── Adattoxte_BP.pdf          # business plan originale (AGILAE srl, 2023)
├── README.md
├── render.yaml               # blueprint Render (copia di backend/render.yaml)
├── ANALISI-FOTO-LOCALITA.md  # analisi foto (non correlata)
├── backend/
│   ├── package.json          # "start": node src/server.js; "seed": node src/seed.js
│   ├── render.yaml           # config Render (plan: free, startCommand: sh -c "npm run seed && npm start")
│   └── src/
│       ├── server.js         # Express + mount rotte
│       ├── db.js             # schema SQLite (users, therapist_profiles, availabilities, bookings, messages, referrals, ratings)
│       ├── seed.js           # dati demo (idempotente: INSERT OR IGNORE)
│       ├── middleware/auth.js# authRequired + requireRole('admin'|'therapist'|'patient')
│       └── routes/
│           ├── auth.js       # registrazione/login
│           ├── therapists.js # catalogo + disponibilità + earnings (nuovo)
│           ├── bookings.js   # prenotazioni + GET /:id (ricevuta)
│           ├── messages.js   # messaggistica tra sedute
│           ├── referral.js   # programma invita-amico
│           ├── admin.js      # gestione terapeuti + prenotazioni (admin)
│           └── ratings.js    # valutazioni pazienti (nuovo)
├── frontend/
│   ├── vercel.json           # rewrites: /api/* → backend; /(.*) → index.html
│   ├── index.html            # contiene il meta tag di verifica Google
│   ├── public/
│   │   ├── sitemap.xml       # 73 URL (rigenerare quando si aggiungono articoli)
│   │   ├── robots.txt
│   │   ├── images/           # hero.jpg, workspace.jpg, costa.jpg (stile cartoon 3D)
│   │   └── google772ac5a8e56fa263.html  # file verifica (non più necessario, meta tag attivo)
│   └── src/
│       ├── content/          # articoli blog: articles.js (indice) + articles-base.js + extra-articles(-2..-6).js = 65 articoli
│       ├── pages/            # Home, Therapists, TherapistDetail, Login, Register, PatientDashboard, TherapistDashboard, AdminDashboard, BlogList, BlogArticle, CookiePolicy, Privacy, Settings, Terms
│       ├── components/       # Navbar, HeroComic (fumetto animato), ProtectedRoute, ...
│       └── context/AuthContext.jsx, i18n.jsx, api.js
├── content/
│   ├── seo/                  # 6 articoli markdown originali
│   └── build-articles.js     # convertitore markdown → JS
└── docs/
    ├── ARCHITETTURA.md, MAPPING-BUSINESS-PLAN.md, DEPLOY-GRATUITO.md,
    ├── LANCIO-ONLINE.md, MANUALE-GESTIONE.md, CALENDARIO-EDITORIALE.md,
    ├── ANALISI-CONCORRENTI.md
    └── MANUALE-RIPRODUZIONE.md  (questo file)
```

---

## 4. ENDPOINT API PRINCIPALI (base: https://adattoxte-backend.onrender.com)

| Metodo | Percorso | Ruolo | Funzione |
|---|---|---|---|
| POST | /api/auth/register | pubblico | registrazione paziente |
| POST | /api/auth/login | pubblico | login (email+password) → JWT |
| GET | /api/therapists | pubblico | catalogo (con rating) |
| GET | /api/therapists/:id | pubblico | profilo terapeuta |
| GET | /api/therapists/:id/availability | pubblico | slot liberi |
| GET | /api/therapists/earnings | terapeuta | guadagni (nuovo) |
| GET/POST | /api/bookings... | paziente/terapeuta | prenotazioni |
| GET | /api/bookings/:id | proprietario/terapeuta/admin | dettaglio per ricevuta (nuovo) |
| GET | /api/bookings/my | paziente | prenotazioni del paziente |
| POST | /api/ratings | paziente | valuta seduta completata (nuovo) |
| GET | /api/ratings/therapist/:id | pubblico | recensioni terapeuta (nuovo) |
| GET | /api/messages/* | autenticati | messaggistica |
| GET | /api/referral/* | autenticati | referral |
| GET | /api/admin/overview | admin | statistiche |
| GET/POST/PUT/DELETE | /api/admin/therapists | admin | gestione terapeuti |
| GET | /api/admin/bookings | admin | tutte le prenotazioni (nuovo) |
| PATCH | /api/admin/bookings/:id/status | admin | conferma/annulla/completa (nuovo) |

**Nota CORS**: il backend accetta (CORS_ORIGIN, lista separata da virgole):
`https://frontend-lovat-eta-71.vercel.app,https://adattoxte.vercel.app,https://antonio-durso.github.io`

---

## 5. CONFIGURAZIONE DEPLOY (da riprodurre)

### 5.1 Frontend su Vercel
1. `npm install` in `frontend/`
2. Build: `npm run build` (usa `index.html` + `public/`, la variabile `VITE_API_URL` è INCOSTRUITA nel bundle — per il deploy attuale si usa il proxy, quindi NON serve VITE_API_URL)
3. `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://adattoxte-backend.onrender.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
4. Deploy: copiare `dist/*` + `vercel.json` in una cartella pulita e:
   `vercel link --yes --project adattoxte --scope spazio-cambiamento`
   `vercel --prod --yes`
5. **ATTENZIONE**: il nome del progetto Vercel deriva dal nome della cartella — usare SEMPRE `vercel link --project adattoxte` per evitare progetti duplicati.

### 5.2 Backend su Render (aggiornamento automatico)
1. Render usa il Blueprint (`render.yaml` nella radice del repo) con `plan: free`
2. `startCommand: sh -c "npm run seed && npm start"` (il seed è idempotente)
3. Il deploy si attiva da solo a ogni push su GitHub (main) — nessuna azione su Render richiesta
4. `render.yaml` chiavi: CORS_ORIGIN, FRONTEND_URL, JWT_SECRET (generateValue: true), STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET (sync: false, vuote)

### 5.3 Sito alternativo GitHub Pages
```bash
cd frontend
VITE_API_URL=https://adattoxte-backend.onrender.com npm run build -- --base=/adattoxte/
cd dist && cp index.html 404.html
git init -q && git config user.name "antonio-durso" && git config user.email "ant.durso1@gmail.com"
git add -A && git commit -qm "Pages" && git branch -M gh-pages
git remote add origin https://github.com/antonio-durso/adattoxte.git
git push -f origin gh-pages
```

### 5.4 Backup codice su GitHub
```bash
cd project
git add -A && git commit -qm "msg" && git push origin main
```

---

## 6. AUTENTICAZIONI DEI SERVIZI (flussi esatti — essenziali dopo ogni riavvio ambiente)

L'ambiente VPS riparte spesso e **azzera**: `/tmp`, `node_modules`, CLI globali (vercel), token GitHub/`~/.config/gh`. Da rifare:

### 6.1 GitHub (gh CLI) — device flow
```bash
echo Y | nohup gh auth login --hostname github.com --git-protocol https --web > /tmp/gh_auth.log 2>&1 &
sleep 8; grep -oE "one-time code: [A-Z0-9-]+" /tmp/gh_auth.log
# → mostrare all'utente: aprire https://github.com/login/device e inserire il codice
gh auth setup-git   # configura git per usare gh
```
- Il codice scade in ~15 minuti; se scade, rigenerare.
- L'utente ha dimenticato la password 2 volte: recupero via github.com/password_reset → link su Gmail (l'app Gmail del telefono è già autenticata).
- **Trappola nota**: mai inserire l'apostrofo nel nome utente ("antonio-durso", NON "antonio-d'urso") — causa errore 405 nel login.

### 6.2 Vercel — device flow
```bash
nohup vercel login > /tmp/vercel_login.log 2>&1 &
sleep 8; grep -o "https://[^ ]*" /tmp/vercel_login.log
# → mostrare all'utente il link https://vercel.com/oauth/device?user_code=XXXX-XXXX (codice già nel link, basta Authorize)
```
- Dopo il riavvio ambiente: `npm i -g vercel` potrebbe servire.

### 6.3 Google (Search Console / Gmail)
- **NON esiste un connettore Search Console** (verificato: 97 tool Google disponibili, nessuno Search Console).
- L'autorizzazione Google ha redirect `http://127.0.0.1:4097/mcp/google/callback` → **non completabile da telefono**.
- La verifica Search Console è l'UNICA cosa che l'utente deve fare da sé (5-10 min, guidato a passi con screenshot).
- Metodo verifica usato: **meta tag HTML** (il file HTML ricostruito da screenshot fallisce: token troncato → usare SEMPRE il metodo Tag HTML con copia-incolla integrale).

---

## 7. FUNZIONALITÀ IMPLEMENTATE (elenco completo)

**Area paziente**: registrazione, login, catalogo terapeuti (nomi ANONIMI: "Psicologo · specializzazione"), profilo terapeuta, prenotazione (45€ individua/50€ coppia), pagamento demo, videochiamata Jitsi nel browser, messaggi, programma referral (10€ credito), storico prenotazioni, privacy/cookie/termini, hero con fumetto animato interattivo ("Adatto x Te" lettera per lettera), blog con 65 articoli + sitemap.

**Area terapeuta**: agenda prenotazioni, conferma/annulla/completa, messaggi, guadagni (endpoint pronto — UI da completare).

**Area admin**: statistiche cliccabili, gestione terapeuti (crea/modifica/elimina), gestione prenotazioni (conferma/completa/annulla), valutazioni backend pronto.

**SEO**: 65 articoli, sitemap 73 URL, robots.txt, Search Console verificata (meta tag), sitemap inviata. Indicizzazione Google in corso (3-10 giorni home, 2-6 settimane tutto).

---

## 8. GOOGLE SEARCH CONSOLE — dettagli

- Proprietà: `https://adattoxte.vercel.app/` (URL prefix — NON il metodo Dominio, che richiede DNS impossibile su vercel.app)
- Meta tag di verifica in `frontend/index.html`:
  `<meta name="google-site-verification" content="LaLxpY_r91NfbWwxBuKEBsiR_cykBocaGhyAnF4nrn8" />`
- Sitemap inviata: `https://adattoxte.vercel.app/sitemap.xml`
- **Trappola**: creare la proprietà con `/sitemap.xml` nel nome → verifica fallisce ("meta tag non trovato"); la proprietà giusta è la radice.
- Tempi indicizzazione: 3-10 giorni (home) / 2-6 settimane (tutti).

---

## 9. PROCEDURA GUIDATA PER L'UTENTE (pattern vincente)

L'utente è poco tecnico e usa il telefono. Regole apprese:
1. **UN passo alla volta**, numerato, con cosa deve apparire sullo schermo.
2. Chiedere **screenshot a ogni dubbio** (li invia volentieri) e dare istruzioni sul singolo tocco.
3. **Copia-incolla invece di scrivere** (evita errori di battitura): mettere i valori in blocchi `code`.
4. Mai far scegliere tra troppe opzioni: dare UN percorso alla volta.
5. Se un flusso fallisce 2 volte: cambiare metodo (es. file HTML → meta tag).
6. Il server Render free si "addormenta" dopo ~15 min: la pagina di login "sveglia" il server da sola (ping /health) e l'interceptor axios ritenta 4×15s su errori di rete/502/503/504 — spiegare di ASPETTARE 30-60s.

---

## 10. PROSSIMI PASSI CONSIGLIATI (per la prossima sessione)

1. [ ] Completare la UI frontend di: valutazioni (pulsante "Valuta" su sedute completate), guadagni terapeuta, ricevuta stampabile (/ricevuta/:id), matching guidato ("Di cosa hai bisogno?" su /terapeuti) — il backend è già pronto
2. [ ] Video animati: servono crediti (240/video, ne mancano ~49+) — dopo il ricaricamento, generare 3 video (hero/workspace/costa) e sostituire le immagini
3. [ ] Acquistare il dominio (adattoxte.it ~10€/anno) e collegarlo a Vercel (DNS + CORS_ORIGIN + render.yaml)
4. [ ] Stripe reale (chiavi in render.yaml, sync: false — valorizzarle dal pannello Render)
5. [ ] Fattura elettronica (Sistema TS/SDI) — richiede partita IVA e servizio esterno
6. [ ] App mobile (PWA o store) — richiede progetto dedicato
7. [ ] Ricaricare crediti account se si vogliono video/immagini extra
8. [ ] Riga "media-output" e `content/build-articles.js`: rigenerare sitemap dopo nuovi articoli:
   `node --input-type=module` con lo script della sitemap (vedi cronologia) e redeploy

---

## 11. COMANDI RAPIDI (snippet)

```bash
# Deploy frontend su Vercel (dopo build in frontend/)
npm run build
mkdir -p /tmp/adt_deploy && cp -r dist/* /tmp/adt_deploy/ && cp vercel.json /tmp/adt_deploy/
cd /tmp/adt_deploy && vercel link --yes --project adattoxte --scope spazio-cambiamento
vercel --prod --yes

# Push backend/altro su GitHub
cd project && git add -A && git commit -qm "msg" && git push origin main

# Pages
VITE_API_URL=https://adattoxte-backend.onrender.com npm run build -- --base=/adattoxte/
cd dist && cp index.html 404.html && git init -q && git config user.name "antonio-durso" && git config user.email "ant.durso1@gmail.com" && git add -A && git commit -qm "Pages" && git branch -M gh-pages && git remote add origin https://github.com/antonio-durso/adattoxte.git && git push -f origin gh-pages

# Verifica salute backend
curl https://adattoxte-backend.onrender.com/api/health
# Verifica login admin
curl -X POST https://adattoxte-backend.onrender.com/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@adattoxte.it","password":"Admin123!"}'
```
