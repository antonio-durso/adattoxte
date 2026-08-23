# Architettura

## Schema database (SQLite)

```
users
├── id              TEXT PK (uuid)
├── name            TEXT
├── email           TEXT UNIQUE
├── password_hash   TEXT (bcrypt)
├── role            patient | therapist | admin
├── bio             TEXT
├── consent_to_tos  INTEGER (GDPR)
├── consent_date    TEXT
└── created_at      TEXT

therapist_profiles
├── user_id          TEXT PK → users.id
├── specialties      JSON array
├── price_individual INTEGER (default 45)
├── price_couple     INTEGER (default 50)
├── license          TEXT (iscrizione albo)
├── experience_years INTEGER
├── languages        JSON array
├── photo_url        TEXT
└── verified         INTEGER

availabilities
├── id           TEXT PK
├── therapist_id TEXT → users.id
├── date         TEXT (YYYY-MM-DD)
├── start_time   TEXT (HH:MM)
├── duration_min INTEGER (default 50)
└── booked       INTEGER
   UNIQUE(therapist_id, date, start_time)

bookings
├── id              TEXT PK
├── patient_id      TEXT → users.id
├── therapist_id    TEXT → users.id
├── availability_id TEXT → availabilities.id
├── date            TEXT
├── start_time      TEXT
├── end_time        TEXT
├── type            individual | couple
├── price           INTEGER
├── status          pending | confirmed | completed | cancelled
├── paid            INTEGER
├── room_name       TEXT (sala Jitsi: AdattoXTe-XXXXXXXX)
└── created_at      TEXT

messages
├── id           TEXT PK
├── sender_id    TEXT → users.id
├── recipient_id TEXT → users.id
├── content      TEXT (max 2000)
├── read         INTEGER
└── created_at   TEXT
```

## Endpoint API

### Pubbliche
| Metodo | Percorso | Descrizione |
|---|---|---|
| GET | `/api/health` | stato del servizio |
| GET | `/api/auth/specialties` | elenco specializzazioni |
| POST | `/api/auth/register` | registrazione (`name, email, password, role, consent`) |
| POST | `/api/auth/login` | login (`email, password`) → `{token, user}` |
| GET | `/api/therapists` | lista terapeuti (`?q=&specialty=`) |
| GET | `/api/therapists/:id` | profilo terapeuta |
| GET | `/api/therapists/:id/availability?date=YYYY-MM-DD` | slot liberi |

### Protette (Bearer token)
| Metodo | Percorso | Ruolo | Descrizione |
|---|---|---|---|
| GET | `/api/me` | tutti | profilo corrente |
| PATCH | `/api/me` | tutti | aggiornamento profilo |
| GET | `/api/me/data` | tutti | export dati GDPR (art. 20) |
| DELETE | `/api/me` | tutti | cancellazione account (art. 17) |
| POST | `/api/bookings` | patient | crea prenotazione |
| GET | `/api/bookings/my` | patient | le mie prenotazioni |
| GET | `/api/bookings/my-sessions` | therapist | agenda sedute |
| PATCH | `/api/bookings/:id/status` | patient/therapist | `confirm` (terapeuta), `cancel`, `complete` (terapeuta) |
| POST | `/api/messages` | tutti | invia messaggio |
| GET | `/api/messages/conversations` | tutti | elenco conversazioni |
| GET | `/api/messages/conversations/:userId` | tutti | storico con un utente |
| POST | `/api/payments/checkout` | patient | crea pagamento (Stripe o demo) |
| POST | `/api/payments/webhook` | — | conferma asincrona Stripe (body raw) |

## Note tecniche

- **Auth**: JWT (30 giorni), password bcrypt, ruoli verificati dal middleware.
- **Slot**: se una data futura non ha slot, il backend li genera automaticamente
  (lun-ven, 09:00–17:00) — comportamento demo per semplificare i test.
- **Pagamenti**: senza `STRIPE_SECRET_KEY` il checkout marca la seduta come pagata
  (demo). Con le chiavi configurate usa Stripe Checkout e webhook firmato.
- **Video**: ogni prenotazione genera una sala Jitsi pubblica gratuita
  (`https://meet.jit.si/AdattoXTe-XXXXXXXX`). Per produzione con privacy rafforzata
  si può installare un proprio server Jitsi.
- **GDPR**: consenso obbligatorio alla registrazione, export JSON e cancellazione
  completa disponibili da `/impostazioni`.
