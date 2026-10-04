METODO CURL: FUNZIONA

Nota di metodo (comune): `curl` funziona. Alcuni domini ufficiali bloccano le richieste dirette con WAF anti-bot: ameli.fr e sante.gouv.fr restituiscono «Vérification de sécurité» (HTTP 403, Cloudflare/F5), health.gov.au e servicesaustralia.gov.au restituiscono HTTP 403 (Akamai), sns.gov.pt/sns24.gov.pt/min-saude.pt rispondono a intermittenza con una pagina «O serviço encontra-se com muita procura» (rate-limit). Per questi domini il contenuto è stato letto tramite indicizzazione di ricerca della pagina ufficiale esatta (non tramite blog/testate). URL citati = pagine ufficiali.

### portogallo — Portogallo
- ente: Programa Nacional para a Saúde Mental (PNSM) / Coordenação Nacional das Políticas de Saúde Mental (CNPSM), da Direção-Geral da Saúde (DGS), Ministério da Saúde
- fatto: Em Portugal, os cuidados de saúde mental enquadram-se no Serviço Nacional de Saúde (SNS) e são prestados nos serviços de psiquiatria e saúde mental dos hospitais. O acesso a uma primeira consulta de especialidade faz-se por referenciação do médico de família, no âmbito do sistema de Livre Acesso e Circulação (LAC), podendo o utente escolher a unidade do SNS onde existe a especialidade necessária; os tempos médios de resposta são publicados no Portal SNS. A Portaria n.º 153/2017 fixa um máximo de espera para as primeiras consultas de especialidade. Existe um modelo de organização próprio para a Psicologia Clínica e da Saúde no SNS (diploma publicado em dezembro de 2017).
- cifre: «as primeiras consultas de especialidade terão um máximo de espera de quatro meses»
- fonte: https://saudemental.min-saude.pt/programa-nacional-para-a-saude-mental/ ; https://www.sns.gov.pt/noticias/2017/05/04/tempos-de-resposta-no-sns/ ; https://www.sns.gov.pt/cidadao/livre-acesso-e-circulacao-lac/
- citazione: «as primeiras consultas de especialidade terão um máximo de espera de quatro meses»
- note: sns.gov.pt/sns24.gov.pt/min-saude.pt erano rate-limited/SPA: contenuto letto dall'indice della pagina ufficiale esatta. NON ho trovato in fonti ufficiali: un percorso specifico «psicoterapia/psicologia» per il cittadino distinto dalla consulta di specialità, un numero di sedute, tariffe, o un ente pagatore/rimborso per sessione. I «quattro mesi» sono il tempo massimo generale per le prime consultas de especialidade (non specifico alla psicoterapia).

### francia — Francia
- ente: Assurance Maladie (Caisse nationale / CPAM), dispositivo «Mon soutien psy»
- fatto: «Mon soutien psy» propone fino a 12 sedute all'anno con uno psicologo partner (conventionné); la seduta costa 50 euro ed è rimborsata al 60% dall'Assurance Maladie (la parte restante può essere coperta dalla mutuelle/complementare). Dal 15 giugno 2024 non è più obbligatorio consultare un medico prima: il paziente può prenotare direttamente con uno psicologo conventionné dall'annuario dedicato, ma può comunque passare prima dal medico. Il rimborso avviene tramite l'invio della feuille de soins alla propria CPAM (o in tiers payant). Nessun dépassement d'honoraires è ammesso in questo dispositivo.
- cifre: «jusqu'à 12 séances» ; «La séance coûte 50 euros. Elle est remboursée à 60 % par l'Assurance Maladie.»
- fonte: https://www.ameli.fr/assure/remboursements/rembourse/remboursement-seance-psychologue-mon-soutien-psy
- citazione: «Mon soutien psy est un dispositif qui propose jusqu'à 12 séances d'accompagnement psychologique chez un psychologue partenaire. La séance coûte 50 euros. Elle est remboursée à 60 % par l'Assurance Maladie.»
- note: ameli.fr (Cloudflare) e sante.gouv.fr (F5) bloccano curl → contenuto letto dall'indice delle pagine ufficiali ameli.fr esatte. Pagina professionisti ameli (https://www.ameli.fr/psychologue/exercice-professionnel/parcours-prise-en-charge-patient-mon-soutien-psy) conferma: dal 15/06/2024 accesso diretto, «tutte le sedute sono fatturate 50 €», «fino a 12 sedute (invece delle 8 precedenti)». Non riporto cifre oltre a quelle scritte.

### germania — Germania
- ente: Gesetzliche Krankenversicherung (GKV) — le Krankenkassen (assicurazione sanitaria legale); quadro regolamentare: Psychotherapie-Richtlinie (G-BA) e Psychotherapie-Vereinbarung (KBV / GKV-Spitzenverband)
- fatto: La psicoterapia è una prestazione a carico della Krankenkasse (assicurazione sanitaria legale). Gli assicurati GKV possono rivolgersi senza previa consultazione medica a psicoterapeuti abilitati; l'accesso a bassa soglia è la «psychotherapeutische Sprechstunde», seguita eventualmente da trattamento acuto (Akutbehandlung) e sedute probatorie. Le sedute di psicoterapia che vanno oltre vengono richieste alla Krankenkasse («bei der Krankenkasse beantragt»), in genere dal/dalla terapeuta; il Gutachterverfahren (parere di esperti) verifica la richiesta (Antrag, modulo PTV 1) insieme al Bericht del terapeuta, per accertare che sussistano i requisiti previsti dalla Psychotherapie-Richtlinie e dalla Psychotherapie-Vereinbarung.
- cifre: «höchstens sechsmal je Krankheitsfall (insgesamt bis zu 150 Minuten)» per la Sprechstunde negli adulti; «mindestens 25 Minuten» per seduta; «Voraussetzung für eine weitergehende Behandlung ist eine Sprechstunde von mindestens 50 Minuten Dauer»
- fonte: https://www.bundesgesundheitsministerium.de/psychotherapie ; https://www.kbv.de/psychotherapie ; https://www.kbv.de/praxis/tools-und-services/gutachterverfahren-psychotherapie
- citazione: «Darüber hinausgehende Psychotherapiesitzungen in dem geeigneten Verfahren werden bei der Krankenkasse beantragt.»
- note: gkv-spitzenverband.de non ha risposto (curl vuoto/timeout); BMG e KBV letti direttamente con curl. La KBV definisce il Gutachterverfahren come verifica dell'Antrag (modulo PTV 1) + Bericht del terapeuta. Non ho riportato importi in euro (nessuna tariffa esplicita letta nelle fonti ufficiali consultate).

### australia — Australia
- ente: Department of Health, Disability and Ageing — «Better Access» initiative; rimborso tramite Medicare (Services Australia)
- fatto: Con l'iniziativa Better Access i pazienti idonei possono ottenere benefici Medicare per servizi selezionati di trattamento della salute mentale. Per accedere serve un Mental Health Treatment Plan (MHTP) redatto da un GP (o prescribed medical practitioner) — oppure un psychiatrist assessment and management plan (PAMP) o un invio diretto da psichiatra/pediatra — insieme a una valida referral. Medicare copre fino a 10 servizi individuali e 10 di gruppo per anno civile. I professionisti stabiliscono liberamente le proprie tariffe e possono applicare il bulk billing (nessun costo per il paziente) oppure fatturare lasciando una quota a carico del paziente.
- cifre: «up to 10 individual and 10 group therapy mental health treatment services per calendar year» ; «Initial course of treatment under Better Access – a maximum of 6 services»
- fonte: https://www.health.gov.au/our-work/better-access-initiative ; https://www.servicesaustralia.gov.au/eligibility-for-mental-health-treatment-plan?context=20 ; https://www.healthdirect.gov.au/mental-health-treatment-plan
- citazione: «Through Better Access, eligible patients can claim a Medicare benefit for up to 10 individual and 10 group therapy mental health treatment services per calendar year»
- note: health.gov.au e servicesaustralia.gov.au bloccano curl (HTTP 403); le pagine ufficiali sono state lette dall'indice. healthdirect.gov.au (servizio pubblico finanziato dal governo) è stato letto direttamente con curl e conferma «up to 10 sessions of mental health treatment each year». Le fonti ufficiali NON indicano una quota fissa a carico del paziente: dicono che i professionisti fissano le proprie tariffe e possono fare bulk billing. Nessun importo in dollari riportato perché non scritto nelle fonti.

---

Riepilogo compatto (slug | ente | fonte):
- portogallo | Programa Nacional para a Saúde Mental / CNPSM (DGS, Ministério da Saúde) | https://saudemental.min-saude.pt/programa-nacional-para-a-saude-mental/
- francia | Assurance Maladie (CPAM) — «Mon soutien psy» | https://www.ameli.fr/assure/remboursements/rembourse/remboursement-seance-psychologue-mon-soutien-psy
- germania | Gesetzliche Krankenversicherung (Krankenkassen); Richtlinie/Vereinbarung via G-BA, KBV, GKV-Spitzenverband | https://www.bundesgesundheitsministerium.de/psychotherapie
- australia | Department of Health, Disability and Ageing — Better Access / Medicare (Services Australia) | https://www.health.gov.au/our-work/better-access-initiative
