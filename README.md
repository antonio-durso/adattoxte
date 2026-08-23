# Adatto x Te — Piattaforma di psicologia online

Implementazione open-source della piattaforma **"Adatto x Te"** descritta nel business plan
`Adattoxte_BP.pdf` (AGILAE srl, 2023): consulenza psicologica online con rete di
professionisti qualificati, sedute individuali (45 €) e di coppia (50 €), videochiamate
sicure, messaggistica, pagamenti e conformità GDPR.

> **Costo di sviluppo: 0 €.** Tutte le tecnologie usate sono open-source o free tier.
> Gli unici costi futuri (non di sviluppo) sono dominio (~10 €/anno) e, quando vorrai,
> hosting a pagamento — vedi `docs/DEPLOY-GRATUITO.md`.

## Stack

| Componente | Tecnologia | Costo |
|---|---|---|
| Backend | Node.js + Express + SQLite | 0 € |
| Frontend | React + Vite | 0 € |
| Videochiamate | Jitsi Meet (WebRTC) | 0 € |
| Pagamenti | Stripe (modalità demo senza chiavi) | 0 € fino al lancio |
| Database | SQLite (file locale) | 0 € |

## Avvio in 3 comandi

```bash
# 1) Backend (porta 3001)
cd backend
npm install
npm run seed      # crea dati demo: 1 admin, 1 paziente, 5 terapeuti
npm start

# 2) Frontend (porta 5173) — in un altro terminale
cd frontend
npm install
npm run dev
```

Apri <http://localhost:5173> nel browser.

### Account demo

| Ruolo | Email | Password |
|---|---|---|
| Admin | admin@adattoxte.it | Admin123! |
| Paziente | antonio@adattoxte.it | Demo1234! |
| Terapeuta | elena.bianchi@adattoxte.it | Terapeuta1! |
| Terapeuta | marco.russo@adattoxte.it | Terapeuta2! |
| Terapeuta | giulia.conti@adattoxte.it | Terapeuta3! |
| Terapeuta | luca.ferrari@adattoxte.it | Terapeuta4! |
| Terapeuta | sara.greco@adattoxte.it | Terapeuta5! |

## Funzionalità

- **Landing page** con servizi, "come funziona" e prezzi (45 € / 50 €)
- **Catalogo terapeuti** con ricerca e filtri per specializzazione
- **Prenotazione sedute** (individuale / coppia) con scelta di giorno e ora
- **Pagamenti** in modalità demo; attivabili con chiavi Stripe reali
- **Videochiamata** Jitsi Meet per sedute confermate e pagate
- **Area paziente**: sedute, storico, annullamento, messaggi
- **Area terapeuta**: agenda, conferma/annulla/completa sedute, messaggi
- **GDPR**: consenso, informativa privacy, export dati (art. 20), cancellazione account (art. 17)
- **Multilingua** italiano/inglese
- **PWA-ready** (manifest)

## Struttura del progetto

```
├── Adattoxte_BP.pdf          # business plan originale
├── backend/                  # API Express + SQLite
│   ├── src/
│   │   ├── server.js         # entry point
│   │   ├── db.js             # schema database
│   │   ├── seed.js           # dati di esempio
│   │   ├── middleware/auth.js
│   │   └── routes/           # auth, me, therapists, bookings, messages, payments
│   └── .env.example
├── frontend/                 # React + Vite
│   └── src/
│       ├── pages/            # landing, terapeuti, prenotazione, dashboard, GDPR
│       ├── components/       # navbar, footer, video, messaggi, cookie
│       └── context/          # autenticazione
└── docs/
    ├── ARCHITETTURA.md       # schema DB ed endpoint API
    ├── MAPPING-BUSINESS-PLAN.md
    └── DEPLOY-GRATUITO.md    # come andare online a costo zero
```

## Documentazione

- [Architettura e API](docs/ARCHITETTURA.md)
- [Mappatura col business plan](docs/MAPPING-BUSINESS-PLAN.md)
- [Deploy gratuito](docs/DEPLOY-GRATUITO.md)
- [Checklist di lancio online](docs/LANCIO-ONLINE.md)

## Nota legale

Le pagine Privacy/Cookie/Termini sono modelli operativi pronti all'uso ma vanno
validati da un legale prima del lancio pubblico (GDPR, dati sanitari, linee guida
dell'Ordine degli Psicologi per la psicoterapia online).
