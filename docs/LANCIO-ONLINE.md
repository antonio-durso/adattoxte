# Checklist di lancio online — Adatto x Te

Tutto ciò che serve per passare dalla versione di sviluppo (già funzionante) al
lancio pubblico. Ogni voce indica **cosa manca**, **chi la fa** e **quanto costa**.

## ✅ Già fatto (costo 0 €)

- Piattaforma completa e testata (backend + frontend + video + pagamenti demo)
- Pagine GDPR/privacy/cookie/termini (modelli pronti)
- Configurazioni di deploy: `render.yaml` (backend), `vercel.json` (frontend),
  variabili d'ambiente documentate
- Documentazione: README, ARCHITETTURA, MAPPING-BUSINESS-PLAN, DEPLOY-GRATUITO

## 🔧 Passo 1 — Account e credenziali (a carico tuo, ~30 min)

| Cosa | Dove | Costo |
|---|---|---|
| Account GitHub | github.com (per ospitare il codice) | 0 € |
| Account Vercel | vercel.com (hosting frontend) | 0 € |
| Account Render | render.com (hosting backend) | 0 € |
| Account Stripe | stripe.com (pagamenti reali) | 0 € (commissioni solo a incasso) |
| Dominio | registrar italiano (es. registro.it) | ~10-12 €/anno |

**Io posso accompagnarti passo-passo in ognuna di queste registrazioni.**

## 🔧 Passo 2 — Deploy tecnico (io preparo tutto, tu clicchi)

1. Carica il codice su GitHub (posso preparare il repo e i comandi git)
2. Vercel: importa il progetto → root `frontend` → `npm run build` → imposta
   `VITE_API_URL` = URL backend Render
3. Render: usa il blueprint `backend/render.yaml` → il backend parte da solo
   (incluso seed con `npm run seed` manuale la prima volta)
4. Collega il dominio al frontend (Vercel) e al backend (Render, sottodominio api.)
5. HTTPS automatico su entrambi

## 🔧 Passo 3 — Pagamenti reali (Stripe, ~20 min)

1. Nel dashboard Stripe: attiva l'account, verifica la partita IVA
2. Copia le chiavi in Render (variabili d'ambiente):
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
3. Configura il webhook Stripe → `https://api.tuodominio.it/api/payments/webhook`,
   evento `checkout.session.completed`
4. Test: prenota una seduta con una carta di prova Stripe (4242 4242 4242 4242)

## 🔧 Passo 4 — Legal e società (consulenza obbligatoria, a carico tuo)

| Voce | Note | Costo indicativo |
|---|---|---|
| Validazione Privacy/Cookie/Termini | da un legale esperto GDPR | 500-1500 € una tantum |
| Costituzione società (s.r.l. come da BP) | commercialista | ~2.500 €/anno (previsto nel BP) |
| Verifica linee guida Ordine Psicologi | psicoterapia online: consenso informato, verifica credenziali | 0-500 € |
| DPO se obbligatorio (art. 37 GDPR) | in base ai volumi di trattamento | variabile |

## 🔧 Passo 5 — Contenuti e verifica pre-lancio

- [ ] Foto e bio reali dei primi 5-10 terapeuti (al posto dei dati demo)
- [ ] Rimuovere l'account admin demo e cambiare le password seed
- [ ] Test completo su mobile: registrazione → prenotazione → pagamento → video
- [ ] Backup automatico del database (task giornaliero)
- [ ] Logo e colori definitivi (quelli attuali sono provvisori)

## 🚀 Passo 6 — Marketing (a costo zero, come da cap. 5 BP)

1. **SEO**: pubblicare 10-20 articoli (es. "psicologo online", "psicologo dello
   sport", "preparazione mentale concorsi") — posso scriverli io
2. **Social organici**: profili brand + contenuti del team (competenze Google Ads
   e piano editoriale già nel BP, cap. 1.2)
3. **Referral**: la funzione "invita un amico" (il BP la prevede) — la sviluppo
   come prossima feature
4. **Network**: ordini professionali, centri sportivi, associazioni (partner
   chiave del BP)

## 📊 Riepilogo economico del lancio

| Voce | Importo |
|---|---|
| Sviluppo software | 0 € (completato) |
| Dominio | ~10 €/anno |
| Hosting (free tier fino a utenti reali) | 0 € |
| Legal (consulenza) | 500-1.500 € una tantum |
| Stripe | 0 € + commissioni solo a incasso |
| **Totale minimo per andare online** | **~10 €** |

## Prossime feature consigliate (dopo il lancio)

- Abbonamenti mensili (flusso di ricavi n. 1 del BP)
- Programma referral
- Recensioni dei pazienti
- Autenticazione a due fattori (2FA) — prevista dal BP cap. 4.1
- Migrazione a PostgreSQL (Neon/Supabase free) quando il volume cresce
