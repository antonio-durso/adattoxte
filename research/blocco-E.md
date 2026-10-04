METODO CURL: FUNZIONA

### nuova-zelanda — Nuova Zelanda
- ente: Health New Zealand | Te Whatu Ora (servizio sanitario pubblico; ex Ministero della Salute, ora servito su healthnz.govt.nz)
- fatto: Nel servizio pubblico si accede alla salute mentale tramite il proprio GP (medico di famiglia) o un operatore sanitario di fiducia, che indirizza e invia ai servizi di salute mentale; per le urgenze ci si rivolge al crisis assessment team locale. Māori, persone del Pacifico e giovani dai 12 ai 24 anni possono accedere a servizi di salute mentale gratuiti senza referral (programma Access and Choice); esiste inoltre un supporto telefonico gratuito 24/7 (chiamare o SMS al 1737). I servizi pubblici sono riservati a chi è eleggibile per l'assistenza pubblica: chi non lo è può comunque ricevere cure ma deve pagare tutti i costi (e si raccomanda un'assicurazione sanitaria).
- cifre: 1737 (linea di supporto, 24 ore/giorno, 7 giorni); 12–24 anni (accesso gratuito senza referral)
- fonte: https://www.healthnz.govt.nz/health-topics/mental-health/where-to-get-help ; https://www.healthnz.govt.nz/hospitals-services/eligibility-subsidies/publicly-funded-healthcare
- citazione: «Book an appointment with your usual GP or healthcare provider, or talk to a trusted healthcare professional. They can help you through next steps, including referrals to mental health services.»
- note: Non ho trovato nessuna dichiarazione ufficiale esplicita su cosa la salute mentale pubblica NON copra. L'unico limite di copertura letto è di eleggibilità: chi non è eleggibile all'assistenza pubblica deve pagare tutti i costi (pagina eligibility/subsidies). health.govt.nz restituisce HTTP 403 (Cloudflare) e il dominio tewhatuora.govt.nz reindirizza a healthnz.govt.nz; il sito è una app JS, quindi alcune sottopagine non sono estraibili via curl. Non ho trovato alcun riferimento a rimborsi per psicoterapia privata.

### malta — Malta
- ente: NESSUNA (i siti nazionali gov.mt, health.gov.mt e deputyprimeminister.gov.mt restituiscono tutti HTTP 403/Cloudflare e non sono leggibili); fonte alternativa ufficiale UE/OCSE (vedi note)
- fatto: Il servizio sanitario nazionale maltese è finanziato tramite la fiscalità generale e offre accesso universale a un pacchetto di prestazioni completo. La quota di spesa sanitaria pubblica sul totale è però relativamente bassa e la spesa out-of-pocket è alta. I servizi di salute mentale di comunità per l'assistenza ambulatoriale sono stati ampliati; durante la pandemia un quinto dei bisogni sanitari non soddisfatti riguardava la salute mentale. Non ho potuto leggere una pagina ufficiale maltese su percorso pubblico, accesso o rimborso della psicoterapia.
- cifre: 67% (quota di spesa sanitaria pubblica sul totale); 30% (spesa out-of-pocket sul totale)
- fonte: https://health.ec.europa.eu/system/files/2023-12/2023_chp_mt_english.pdf
- citazione: «The Maltese national health service is financed through general taxation and offers universal access to a comprehensive benefits package.»
- note: ATTENZIONE: nessun sito ufficiale maltese (.gov.mt) è raggiungibile via curl (403 Cloudflare), quindi NESSUNA FONTE nazionale. Il fatto sopra è tratto da un documento ufficiale UE/OCSE ("State of Health in the EU — Malta: Country Health Profile 2023"), non da un ministero maltese: usarlo come tale. Non contiene cifre su costi/rimborsi specifici della psicoterapia.

### svezia — Svezia
- ente: 1177 Vårdguiden / regionerna (servizio sanitario regionale svedese)
- fatto: Si può cercare psicoterapia attraverso la sanità pubblica della propria regione oppure privatamente; per vari servizi basta contattare il centro di prima linea psichiatrica o la vårdcentral, per altri serve un remiss (invio). L'assistenza è finanziata in gran parte con le tasse regionali e il paziente paga una patientavgift (ticket), il cui importo lo decide la regione. Per l'outpatient esiste un högköstnadsskydd: si paga al massimo 1 450 SEK in 12 mesi, dopodiché si ottiene un frikort valido in tutte le regioni. Nella sanità interamente privata senza accordo con una regione si paga l'intero costo.
- cifre: 1 450 SEK (tetto massimo in 12 mesi per l'outpatient); 130 SEK/die (tetto di legge per la degenza ospedaliera)
- fonte: https://www.1177.se/liv--halsa/psykisk-halsa/psykoterapi-och-psykologisk-behandling/ ; https://www.1177.se/sa-fungerar-varden/kostnader-och-ersattningar/hogkostnadsskydd-for-oppenvard/
- citazione: «Högkostnadsskyddet innebär att du betalar sammanlagt högst 1 450 kronor för besök i öppenvården under en period på tolv månader.»
- note: Le tariffe dei ticket variano da regione a regione; 1177 indica il tetto nazionale del högköstnadsskydd (1 450 SEK) ma ogni regione può fissare un importo inferiore. Non esiste un "rimborso" diretto per la psicoterapia privata senza accordo regionale: si paga tutto di tasca propria. Socialstyrelsen non è stato usato perché la pagina non conteneva i dati su ticket/rimborso.

### danimarca — Danimarca
- ente: Borger.dk (portale pubblico danese) — regole della Den Offentlige Sygesikring / regionerne
- fatto: Per ottenere il tilskud (rimborso) per il trattamento da psicologo serve una henvisning (invio) del proprio medico di base, da usare entro tre mesi. Il medico può inviare se il paziente rientra in una delle categorie previste (tra cui depressione lieve-moderata e ansia lieve-moderata/OCD dai 25 anni, vittime di reati, ecc.). Il rimborso copre il 60% dell'onorario dello psicologo per un massimo di 12 consultazioni, estendibili fino a 24 in caso di depressione e ansia con un nuovo invio. Il trattamento da psichiatra è gratuito, ma anche qui serve l'invio del medico.
- cifre: 60% (dell'onorario dello psicologo); 12 consultazioni (fino a 24); 25 anni (età minima per depressione/ansia); 3 mesi (validità dell'invio); 6–12 mesi (termini per l'emissione dell'invio)
- fonte: https://www.borger.dk/sundhed-og-sygdom/psykolog-og-psykiatri/Psykologer-og-psykiatere
- citazione: «Du skal have en henvisning fra din læge for at få tilskud til behandling hos en psykolog.»
- note: sst.dk ha restituito HTTP 429 (rate limit/block) e sundhed.dk è una app JS non estraibile via curl, quindi ho usato il portale pubblico ufficiale borger.dk, che riporta le stesse regole della sygesikring. La pagina rimanda alla "Bekendtgørelse om tilskud til psykologbehandling i praksissektoren".
