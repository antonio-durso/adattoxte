# Deploy gratuito — come andare online a costo (quasi) zero

Il business plan prevedeva ~137.000 € di investimento iniziale, di cui la maggior
parte per sviluppo e marketing. Questa piattaforma elimina i costi di sviluppo:
restano solo i costi operativi, che puoi tenere a zero o quasi con i free tier.

## Costi totali realistici

| Voce | Costo minimo | Costo consigliato |
|---|---|---|
| Sviluppo software | 0 € (già fatto) | 0 € |
| Dominio | ~10 €/anno | ~12 €/anno (.it) |
| Hosting backend | 0 € (free tier Render) | ~7 €/mese |
| Hosting frontend | 0 € (Vercel free) | 0 € |
| Database | 0 € (SQLite) | 0 € (poi Neon free) |
| Videochiamate | 0 € (Jitsi pubblico) | 0 € |
| Pagamenti | 0 € (demo) | commissioni Stripe solo a incasso |
| Legal/GDPR | 0 € (modelli inclusi) | 500-1500 € una tantum |

**Totale per il lancio: ~10 € (il dominio).**

## Opzione A — Lancio locale (0 €, oggi)

```bash
cd backend && npm install && npm run seed && npm start
cd frontend && npm install && npm run dev
```
Apri http://localhost:5173. Perfetto per testare con amici e primi pazienti
dalla stessa rete (o con un tunnel gratuito tipo Cloudflare Tunnel).

## Opzione B — Online con free tier (0 €)

1. **Backend su Render** (free tier: https://render.com):
   - New → Web Service → collega il repo GitHub
   - Root directory: `backend`, Build: `npm install`, Start: `npm start`
   - Environment: `JWT_SECRET` (generane uno lungo), `CORS_ORIGIN` = URL frontend
   - Nota: il free tier di Render sospende il servizio dopo 15 min di inattività
     (riparte alla prima richiesta). Ok per i test, non per produzione.

2. **Frontend su Vercel** (free tier: https://vercel.com):
   - Importa il repo, Root directory: `frontend`, Build: `npm run build`
   - Aggiungi le variabili d'ambiente necessarie

3. **Database**: per ora SQLite va bene (file sul server). Quando cresci,
   migra a PostgreSQL free su Neon (https://neon.tech) o Supabase.

4. **Dominio**: ~10 €/anno su un registrar (es. registro.it per .it).
   Collegalo a Render/Vercel (DNS).

## Opzione C — Produzione a basso costo (5-15 €/mese)

Quando la piattaforma ha utenti reali:
- Backend: Render/VPS con uptime garantito (~7 €/mese)
- Database: PostgreSQL su Neon o Supabase (free tier fino a 500 MB)
- HTTPS automatico su Render/Vercel
- Video: se vuoi privacy totale, installa un server Jitsi su un VPS
  (~5 €/mese) invece del meet.jit.si pubblico

## Attivare i pagamenti reali (Stripe)

1. Crea un account su https://stripe.com (gratis, commissioni solo a incasso)
2. Copia le chiavi in `backend/.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Configura il webhook nel dashboard Stripe:
   `https://IL-TUO-BACKEND/api/payments/webhook`, evento
   `checkout.session.completed`
4. Con `stripe listen --forward-to localhost:3001/api/payments/webhook` testi in locale

## Marketing a costo zero (mitiga il rischio del cap. 5 BP)

- **SEO**: le pagine pubbliche (terapeuti, servizi) sono già strutturate per i
  motori di ricerca; aggiungi contenuti sul blog per "psicologo online",
  "psicologo dello sport", "preparazione concorsi"…
- **Social organici**: profili Instagram/Facebook/LinkedIn del brand con contenuti
  del team (competenze marketing già nel BP: Google Ads, piano editoriale)
- **Referral**: il BP cita i programmi referral — puoi aggiungerli come prossima
  feature (sconto su sedute per amici invitati)
- **Network locale**: ordini professionali, centri sportivi, associazioni
  (partner chiave nel BP)

## Checklist pre-lancio

- [ ] Validare Privacy/Cookie/Termini con un legale
- [ ] Verificare le credenziali dei terapeuti (numero albo)
- [ ] Nominare eventualmente un DPO (art. 37 GDPR)
- [ ] Testare il flusso completo: registrazione → prenotazione → pagamento → video
- [ ] Configurare Stripe reale prima di accettare pagamenti
- [ ] Backup periodico del database (SQLite: copia del file `backend/data/`)
