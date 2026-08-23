# Mappatura col business plan "Adatto x Te"

Corrispondenza tra i capitoli del business plan (Adattoxte_BP.pdf, AGILAE srl) e
le funzionalità implementate nella piattaforma.

## 0. Executive summary — ✅ implementato
> Piattaforma di consulenza psicologica online, rete di professionisti qualificati,
> supporto immediato e accessibile, sedute via video/chat/telefono.

- Landing page con proposta di valore e servizi
- Catalogo terapeuti con profili verificati
- Videochiamata, messaggistica e prenotazione online

## 1. L'impresa e la Business Idea — ✅ implementato
> Servizi: salute mentale generale, psicologia dello sport, comunicazione politica,
> psicologia giuridica. Accesso 24/7, privacy e riservatezza.

- Specializzazioni nel catalogo: psicologia dello sport, preparazione concorsi
  pubblici (forze dell'ordine), psicologia giuridica, terapia di coppia,
  ansia e depressione
- Prenotazione in qualsiasi momento, sedute da remoto
- GDPR: crittografia, consenso, export/cancellazione dati

## 1.2 Team imprenditoriale — ✅ supportato
- Ruoli multipli (patient/therapist/admin) nel sistema
- Competenze di marketing del team (Google Ads, social) → pagine pronte per
  l'acquisizione clienti (vedi DEPLOY-GRATUITO.md, sezione marketing)

## 2. Modello di business — ✅ implementato
| Blocco Business Model Canvas | Implementazione |
|---|---|
| Segmenti di clientela (sportivi, concorsi, 15-50 anni) | Filtri per specializzazione nel catalogo |
| Proposta di valore (accesso immediato, multilingua, riservatezza) | Prenotazione rapida, i18n IT/EN, GDPR |
| Canali (sito web, app mobile, chat/video/telefono) | Web responsive PWA-ready, Jitsi Meet, messaggi |
| Relazioni con clienti (assistenza) | Messaggistica integrata |
| Flussi di ricavi (abbonamento + fee per consulenza) | Seduta individuale 45 €, coppia 50 € (fee) |
| Risorse chiave (piattaforma, rete terapeuti) | Backend/frontend completi, seed terapeuti |
| Attività chiave (sviluppo, selezione terapeuti, marketing) | Dashboard terapeuta con verifica profili |
| Partner chiave (pagamenti, associazioni) | Stripe (checkout + webhook) |
| Struttura dei costi | Documentata in DEPLOY-GRATUITO.md |

## 3. Analisi del mercato e della concorrenza — ✅ supportato
- I competitor citati (Unobravo, BetterHelp, Talkspace) non sono replicati: il
  posizionamento di Adatto x Te (nicchie: sport, concorsi, giuridica) è implementato
  tramite le specializzazioni del catalogo
- Il prezzo di 45/50 € è in linea con il mercato italiano (49-60 €)

## 4. Fattibilità tecnologica — ✅ implementato
| Requisito BP (cap. 4.1) | Implementazione |
|---|---|
| Registrazione e autenticazione | JWT + bcrypt, ruoli, consenso GDPR |
| Gestione pagamenti | Stripe Checkout + webhook + modalità demo |
| Privacy e sicurezza (crittografia, 2FA, GDPR) | HTTPS in produzione, password cifrate, GDPR completo (2FA: previsto per la fase di lancio) |
| Comunicazione in tempo reale (WebRTC/Meet/Teams) | Jitsi Meet integrato (gratuito) |
| Front-end (React/Angular) | React + Vite |
| Back-end (Node.js/Django) | Node.js + Express |
| Database (MySQL/PostgreSQL/MongoDB) | SQLite (migrazione a PostgreSQL documentata) |
| Prenotazione sessioni | Sistema slot + disponibilità |
| Profili dei professionisti | Profilo con specialità, albo, esperienza, lingue |

## 5. Analisi dei rischi — ✅ mitigato nel progetto
| Rischio (fattore BP) | Mitigazione implementata |
|---|---|
| Errata stima del mercato (Fr=3) | MVP a costo zero → validazione senza investimenti |
| Bassa percezione del valore (Fr=6) | Landing chiara, prove gratuite possibili, recensioni future |
| Difficile individuazione figure professionali (Fr=9) | Dashboard terapeuta semplificata per on-boarding rapido |
| Strategia di marketing errata (Fr=9) | Costi marketing zero all'avvio: SEO, social organici (vedi DEPLOY-GRATUITO.md) |
| Errata definizione requisiti (Fr=3) | Sviluppo iterativo: il codice è modificabile in ogni momento |

## 6. Previsioni economiche-finanziarie — ✅ supportato
- Prezzi: seduta individuale 45 €, coppia 50 € (cap. 6.1) → configurati nel sistema
- Investimento iniziale: il BP prevedeva **-137.870 €**; questa implementazione
  riduce la voce "sviluppo software" a **0 €** (vedi confronto costi in
  DEPLOY-GRATUITO.md), eliminando il rischio di VAN risicato (4.423 € su 3 anni)
- I ricavi previsti (1000 sedute individuali + 1200 di coppia al primo anno)
  restano invariati: la piattaforma supporta i volumi previsti

## Funzionalità aggiuntive rispetto al BP
- Multilingua IT/EN (BP citava "consulenza in lingua straniera")
- Messaggistica asincrona tra paziente e terapeuta
- Export dati e cancellazione account GDPR direttamente dalle impostazioni
- PWA installabile su mobile (sostituisce l'app nativa a costo zero)
- Programma referral "invita un amico" (cap. 6.2): codice invito, 10 € di
  credito all'invitato alla registrazione, 10 € al referrer alla prima seduta
  pagata dell'invitato
- Logo e palette fedeli al documento originale: azzurro #48A8D8 e pesca #F0AA82
  estratti dalle pagine 1-2 del PDF
- 6 articoli SEO pronti (content/seo/) per l'acquisizione clienti organica
