# Manuale di gestione — Adatto x Te

Manuale operativo della piattaforma di psicologia online, aggiornato al lancio
(24 agosto 2026). Tutto è già online e funzionante: qui trovi come accedere,
come gestire i terapeuti e come usare la piattaforma.

---

## 1. Indirizzi ufficiali (già online)

| Cosa | Indirizzo |
|---|---|
| **Sito pubblico** (da condividere con i pazienti) | https://frontend-lovat-eta-71.vercel.app |
| Backend (API) | https://adattoxte-backend.onrender.com |
| Codice sorgente | https://github.com/antonio-durso/adattoxte |
| Anteprima statica (facoltativa) | https://antonio-durso.github.io/adattoxte/ |

## 2. Account di accesso

### Amministratore (chi gestisce la piattaforma — tu)
| Email | Password |
|---|---|
| admin@adattoxte.it | Admin123! |

**Importante:** cambia subito questa password dalla pagina Impostazioni dopo il
primo accesso.

### Paziente demo
| Email | Password |
|---|---|
| antonio@adattoxte.it | Demo1234! |

### Terapeuti demo (5, tutti gestibili dall'Area Admin)
| Email | Password |
|---|---|
| elena.bianchi@adattoxte.it | Terapeuta1! |
| marco.russo@adattoxte.it | Terapeuta2! |
| giulia.conti@adattoxte.it | Terapeuta3! |
| luca.ferrari@adattoxte.it | Terapeuta4! |
| sara.greco@adattoxte.it | Terapeuta5! |

---

## 3. Come gestire i terapeuti (Area Admin)

Hai la gestione completa dei terapeuti direttamente dal sito. Ecco i passaggi.

### 3.1 Accedere all'Area Admin
1. Apri il sito: https://frontend-lovat-eta-71.vercel.app
2. Tocca **"Accedi"** (in alto a destra)
3. Inserisci `admin@adattoxte.it` e la password `Admin123!`
4. Nel menu in alto comparirà la voce **"Area admin"** → toccala

### 3.2 Panoramica
In cima alla pagina vedi i numeri della piattaforma: pazienti registrati,
terapeuti, prenotazioni (totali, in attesa, confermate, completate).

### 3.3 Aggiungere un nuovo terapeuta
1. Tocca il pulsante **"+ Nuovo terapeuta"**
2. Compila i campi:
   - **Nome completo** (obbligatorio)
   - **Email** (obbligatoria, unica — servirà al terapeuta per accedere)
   - **Password** (obbligatoria, minimo 8 caratteri — da comunicare al terapeuta)
   - **Bio / presentazione**: testo visibile nella scheda pubblica del terapeuta
   - **Specializzazioni**: spunta una o più aree (es. ansia e depressione)
   - **Prezzo seduta individuale / di coppia**: default 45 € / 50 €
   - **Numero iscrizione albo**: numero dell'Ordine degli Psicologi
   - **Anni di esperienza**
   - **URL foto profilo** (facoltativo)
   - **Profilo verificato**: spunta se hai verificato le credenziali
3. Tocca **"Salva terapeuta"** → compare subito nel sito pubblico, sezione
   "I nostri terapeuti".

### 3.4 Modificare un terapeuta
1. Nell'elenco, accanto al terapeuta, tocca **"Modifica"**
2. Cambia i campi che servono (la password si lascia vuota per non cambiarla)
3. **"Salva terapeuta"**

### 3.5 Eliminare un terapeuta
1. Accanto al terapeuta tocca **"Elimina"**
2. Conferma nella finestra che compare.
L'operazione cancella profilo, disponibilità e prenotazioni associate (non
reversibile).

---

## 4. Come funziona la piattaforma (per i pazienti)

1. Il paziente si registra (o accede) e sceglie un terapeuta da "I nostri
   terapeuti"
2. Prenota giorno e ora (seduta individuale 45 € o di coppia 50 €)
3. Paga in modalità demo (per ora non vengono addebitati soldi veri)
4. Dal suo spazio personale entra nella **videochiamata sicura** (Jitsi)
5. Può anche scrivere messaggi al terapeuta e usare il programma **referral**
   ("Invita un amico" → 10 € di credito a entrambi)

## 5. Stato del lancio (che cosa è già fatto)

- [x] Sito pubblico online (Vercel, hosting gratuito)
- [x] Backend online (Render, hosting gratuito)
- [x] Codice su GitHub
- [x] Area Admin con gestione terapeuti
- [x] Dati demo caricati (5 terapeuti)
- [x] Pagine GDPR/privacy/cookie/termini presenti
- [ ] **Da fare tu**: cambiare la password admin
- [ ] **Da fare tu**: dominio personale (~10 €/anno, es. adattoxte.it)
- [ ] **Da fare tu**: far validare privacy/termini da un legale
- [ ] **Da fare tu**: attivare Stripe per pagamenti reali (oggi demo)

## 6. Prossimi passi consigliati

1. **Cambia la password admin** (Impostazioni) prima di far usare la piattaforma
2. **Compra il dominio** (~10 €/anno) e collegalo al sito
3. **Sostituisci i terapeuti demo** con i professionisti reali (Area Admin:
   modifica i 5 esistenti o creane di nuovi)
4. **Stripe** per incassare davvero (chiavi nel pannello Render)
5. **Legale GDPR** per validare le pagine privacy/termini
6. **Marketing**: pubblica i 6 articoli SEO già pronti in `content/seo/`

## 7. Problemi comuni

| Problema | Soluzione |
|---|---|
| Non vedo "Area admin" nel menu | Hai fatto l'accesso con l'account admin? (admin@adattoxte.it) |
| Email "esiste già un account" | Scegli un'altra email o elimina prima il terapeuta con quella email |
| Il sito non risponde la prima volta | Render (backend) si riattiva dopo l'inattività: ricarica dopo 30-60 secondi |
| Password dimenticata di un terapeuta | Area Admin → Modifica → imposta una nuova password |
| Videochiamata non parte | Usare Chrome o Safari aggiornati; il servizio Jitsi pubblico è gratuito |

## 8. Chi ha fatto cosa (per il tuo archivio)

- **Business plan**: AGILAE srl (2023) — file `Adattoxte_BP.pdf`
- **Sviluppo**: implementazione open-source completa (backend Node.js/Express +
  SQLite, frontend React) — costo 0 €
- **Deploy**: GitHub (codice), Vercel (sito), Render (backend) — free tier
- **Costo totale del lancio**: 0 € + dominio (~10 €/anno) + consulenza legale
