// Paesi con comunità italiana significativa o grande presenza di expat italiani.
// Ogni voce alimenta una landing unica per paese e una per capitale.
// Struttura: { slug, nome, bandiera, capitale: { slug, nome, nota }, regione, fuso, comunita }
import { paesiEstesi1 } from './paesi-estesi-1.js';
import { paesiEstesi2 } from './paesi-estesi-2.js';
import { paesiEstesi3 } from './paesi-estesi-3.js';
import { paesiEstesi4 } from './paesi-estesi-4.js';
import { paesiEstesi5 } from './paesi-estesi-5.js';
import { paesiZone } from './paesi-zone.js';

const paesiBase = [
  { slug: 'stati-uniti', nome: 'Stati Uniti', bandiera: '🇺🇸', capitale: { slug: 'washington', nome: 'Washington', nota: 'capitale federale e città dove lavorano molti professionisti italiani' }, regione: 'Nord America', fuso: '6-9 ore in meno rispetto all\'Italia', comunita: 'Gli Stati Uniti ospitano una delle comunità italiane più grandi al mondo, da New York alla California', citta: ['New York', 'New Jersey', 'Miami', 'Chicago', 'Los Angeles', 'San Francisco', 'Boston', 'Houston'] },
  { slug: 'canada', nome: 'Canada', bandiera: '🇨🇦', capitale: { slug: 'ottawa', nome: 'Ottawa', nota: 'capitale amministrativa con una comunità italiana attiva' }, regione: 'Nord America', fuso: 'da 6 a 9 ore in meno rispetto all\'Italia', comunita: 'La comunità italiana in Canada è storica e organizzata, con forti presenze a Montréal e Toronto', citta: ['Toronto', 'Montréal', 'Vancouver', 'Calgary', 'Ottawa', 'Hamilton', 'Winnipeg', 'Edmonton'] },
  { slug: 'regno-unito', nome: 'Regno Unito', bandiera: '🇬🇧', capitale: { slug: 'londra', nome: 'Londra', nota: 'prima destinazione europea dei giovani italiani' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'Il Regno Unito ospita una delle comunità italiane più numerose e giovani d\'Europa', citta: ['Londra', 'Manchester', 'Birmingham', 'Glasgow', 'Edimburgo', 'Leeds', 'Leicester', 'Milton Keynes'] },
  { slug: 'francia', nome: 'Francia', bandiera: '🇫🇷', capitale: { slug: 'parigi', nome: 'Parigi', nota: 'capitale con una comunità italiana storica e vivace' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La comunità italiana in Francia è storica e numerosa, presente in tutto il territorio', citta: ['Parigi', 'Lione', 'Nizza', 'Marsiglia', 'Tolosa', 'Bordeaux', 'Lille', 'Grenoble'] },
  { slug: 'germania', nome: 'Germania', bandiera: '🇩🇪', capitale: { slug: 'berlino', nome: 'Berlino', nota: 'capitale creativa con molti italiani giovani e professionisti', titolo: 'Psicologo italiano online a Berlino', desc: 'Psicologo italiano online a Berlino: sedute in videochiamata in italiano, fuso orario identico a quello italiano. Prima seduta gratuita, 45 € la seduta.' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La Germania ospita una delle comunità italiane più numerose d\'Europa', citta: ['Berlino', 'Monaco', 'Francoforte', 'Stoccarda', 'Colonia', 'Amburgo', 'Düsseldorf', 'Norimberga'] },
  { slug: 'svizzera', nome: 'Svizzera', bandiera: '🇨🇭', capitale: { slug: 'berna', nome: 'Berna', nota: 'capitale federale, hub di aziende e istituzioni', titolo: 'Psicologo italiano online a Berna', desc: "Psicologo italiano online a Berna: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa.", vicine: ['koniz', 'soletta', 'biel-bienne', 'basilea'] }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La Svizzera conta una delle comunità italiane più grandi d\'Europa, tra frontalieri e residenti', zoneNota: "Non conta in quale cantone ti trovi: uno psicologo online in italiano raggiunge anche chi vive nei cantoni di Svitto, Nidvaldo, Lucerna, Sciaffusa e Turgovia, non solo nelle grandi città.", citta: ['Zurigo', 'Ginevra', 'Lugano', 'Basilea', 'Berna', 'Losanna', 'San Gallo', 'Soletta', 'Glarona', 'Grenchen', 'Herisau', 'Küssnacht', 'Muttenz', 'Arosa', 'Emmen'],
    // Località con una PAGINA PROPRIA, oltre alla capitale. Stessa forma di `capitale`
    // (slug + nome) più i campi di contenuto differenziato: `desc` (meta description),
    // `intro` (paragrafo sotto il titolo), `local` (scheda con i dettagli del posto),
    // `faqLocal` (domande specifiche). È la stessa regola delle città italiane
    // (src/content/citta.js): una pagina locale è indicizzabile SOLO se ha un testo suo.
    // Una pagina templata con il nome cambiato è una pagina porta, e Google la tratta
    // come tale.
    //
    // Perché queste quattro: sono le località per cui Search Console registra già query
    // reali ("psicologo italiano online <luogo>") e per cui non esisteva alcuna pagina —
    // la pagina Svizzera veniva servita come ripiego, a posizione media 34,4. La domanda
    // è misurata, non stimata.
    //
    // Dati citati nei testi (generali, verificati): seduta privata in Svizzera 150-200
    // CHF; riferimento LAMal 155 CHF/ora; dal 1/7/2022 la psicoterapia è a carico
    // dell'assicurazione di base con prescrizione medica, max 15 sedute per ricetta, più
    // franchigia e 10% di partecipazione. Il percorso del sito resta privato e senza
    // prescrizione: non promettere rimborsi.
    //
    // Campi aggiunti il 05/10/2026 (Lane A, misurati sulla finestra GSC a 28 giorni):
    // - `titolo`: la frase della query reale ("psicologo italiano online <luogo>").
    //   Alimenta <title> E H1 (vedi PaeseLanding.jsx), così i due non possono divergere.
    //   Prima esisteva solo su alcune pagine e l'H1 restava la formula generica, che
    //   nessuno cercava: le query a pos. 10-25 con 0 clic sono la prova.
    // - `vicine`: slug di altre località con pagina propria. Alimenta la maglia di link
    //   interni: le pagine locali non si linkavano fra loro e arrivavano solo da sitemap
    //   e dalla pagina paese.
    // - `desc`: riscritta per aprirsi con la frase esatta della query (prima apriva con
    //   "per italiani a <luogo>", formula che non corrisponde ad alcuna ricerca misurata).
    cittaPagine: [
      {
        slug: 'lugano',
        nome: 'Lugano',
        titolo: 'Psicologo italiano online a Lugano',
        vicine: ['glarona', 'svitto', 'lucerna', 'zurigo'],
        nota: 'il cuore della Svizzera italiana, a pochi minuti dal confine',
        intro: "A Lugano la terapia in italiano non è una comodità: è la lingua in cui sei abituato a pensare. In Ticino gli studi privati lavorano già in italiano, ma con tariffe alte e tempi lunghi. Online inizi quando vuoi, a CHF 130 e senza prescrizione.",
        local: `<h3>Terapia online a Lugano: in italiano, senza prescrizione e senza lista d'attesa</h3><p>In Ticino il problema non è trovare un terapeuta che parli italiano — è il <strong>prezzo</strong> e l'<strong>attesa</strong>. Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta (il riferimento LAMal è di 155 CHF l'ora) e per il rimborso serve la prescrizione del medico: al massimo <strong>15 sedute per ricetta</strong>, più franchigia e il 10% di partecipazione a tuo carico.</p><p>Con Adatto x Te la seduta individuale da 50 minuti costa <strong>CHF 130</strong> (145 CHF quella di coppia), si paga in euro all'equivalente fisso e la prima seduta conoscitiva è gratuita. Nessuna prescrizione, nessuna diagnosi nel dossier assicurativo, nessuna lista d'attesa: scegli il terapeuta e prenoti.</p><p>Funziona se vivi a Lugano, a Paradiso o in uno dei comuni del Luganese, se fai il frontaliere o se ti sposti spesso fra Ticino e Italia: il percorso non si interrompe quando cambi casa, ufficio o confine.</p>`,
        faqLocal: [
          ["Quanto costa uno psicologo a Lugano?", "In Ticino uno studio privato costa mediamente 150-200 CHF a seduta. Con Adatto x Te la seduta individuale da 50 minuti costa CHF 130, pagabili in euro all'equivalente fisso, e la prima è gratuita."],
          ["Serve la prescrizione del medico per iniziare?", "No, se scegli il percorso diretto: inizi senza prescrizione e senza che nulla finisca nel dossier assicurativo. La prescrizione serve solo se vuoi il rimborso LAMal, e in quel caso il trattamento va svolto da terapeuti riconosciuti in Svizzera (PsiReg)."],
          ["Sono frontaliere: posso seguire le sedute dall'Italia?", "Sì. La videochiamata funziona da qualsiasi luogo e il fuso è lo stesso dell'Italia: puoi fare la seduta da casa in Italia, dall'ufficio a Lugano o in pausa pranzo."]
        ],
        desc: "Psicologo italiano online a Lugano: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa."
      },
      {
        slug: 'zurigo',
        nome: 'Zurigo',
        titolo: 'Psicologo italiano online a Zurigo',
        vicine: ['baden', 'baar', 'lucerna', 'san-gallo', 'sciaffusa', 'turgovia', 'winterthur', 'duebendorf'],
        nota: 'la città più grande della Svizzera',
        intro: "A Zurigo lavori in tedesco o in inglese tutto il giorno. Ma quando si parla di te, la lingua che ti viene naturale è un'altra. Le sedute si svolgono in italiano, con terapeuti italiani.",
        local: `<h3>Terapia in italiano a Zurigo: parlare di sé nella propria lingua</h3><p>Zurigo è la città più grande della Svizzera e una delle mete europee con la maggiore presenza di professionisti italiani. Molti arrivano per lavoro e si trovano a vivere, negoziare, discutere e perfino scherzare in una lingua che non è la loro. In terapia questo pesa più che altrove: raccontare un disagio in tedesco o in inglese è uno sforzo che spesso fa rimandare la richiesta d'aiuto.</p><p>Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta, e i terapeuti che lavorano in italiano a Zurigo sono pochi. Online hai un elenco di psicologi e psicoterapeuti italiani a <strong>CHF 130</strong> la seduta da 50 minuti, con la prima conversazione gratuita.</p><p>Se lavori a Zurigo, a Winterthur o lungo la Limmat, oppure sei in smart working e ti sposti, prenoti quando hai un'ora libera: sera, pausa pranzo o weekend.</p>`,
        faqLocal: [
          ["Posso fare terapia in italiano a Zurigo?", "Sì: tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani. Non devi tradurre quello che provi e non perdi le sfumature proprio dove contano."],
          ["Quanto costa rispetto a uno studio a Zurigo?", "In Svizzera una seduta privata costa mediamente 150-200 CHF. Online la seduta individuale da 50 minuti costa CHF 130, con la prima conversazione gratuita."],
          ["Lavoro tutto il giorno: quali orari ci sono?", "Prenoti tu lo slot, anche la sera o nel weekend, con lo stesso fuso dell'Italia. E se ti trasferisci in un'altra città il percorso continua senza interruzioni."]
        ],
        desc: "Psicologo italiano online a Zurigo: parla di te nella tua lingua, CHF 130 a seduta, prima conoscitiva gratuita, senza lista d'attesa."
      },
      {
        slug: 'ginevra',
        nome: 'Ginevra',
        titolo: 'Psicologo italiano online a Ginevra',
        vicine: ['basilea', 'berna', 'lucerna', 'lugano'],
        nota: 'città internazionale, sede di organizzazioni e grandi aziende',
        intro: "A Ginevra si lavora in francese e in inglese, fra organizzazioni internazionali, missioni e contratti a termine. Le sedute online sono in italiano, con terapeuti italiani.",
        local: `<h3>Terapia in italiano a Ginevra: per chi vive fra contratti e trasferimenti</h3><p>Ginevra è una città di passaggio per mestiere: organizzazioni internazionali, missioni, contratti a durata determinata, trasferimenti ogni pochi anni. È un contesto stimolante e faticoso insieme — e la lingua in cui ti racconti resta l'italiano.</p><p>Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta, e per il rimborso LAMal serve la prescrizione del medico (al massimo 15 sedute per ricetta, più franchigia e 10% a tuo carico). Con il percorso diretto paghi <strong>CHF 130</strong> a seduta individuale, in euro all'equivalente fisso, senza prescrizione e senza diagnosi nel dossier assicurativo.</p><p>Se vivi a Ginevra, a Carouge o sulla rive droite, o se il contratto ti porterà altrove fra sei mesi, il percorso online ti segue: stesso terapeuta, stessa lingua, stesso orario.</p>`,
        faqLocal: [
          ["Vivo a Ginevra per lavoro: posso iniziare subito?", "Sì: non serve alcuna prescrizione e non ci sono liste d'attesa. Scegli il terapeuta e prenoti la prima seduta conoscitiva, che è gratuita."],
          ["E se il mio contratto mi porta in un'altra città?", "Il percorso è online: non cambia nulla. Puoi continuare con lo stesso terapeuta anche se ti trasferisci in un altro paese, con lo stesso fuso dell'Italia."],
          ["Il rimborso LAMal è possibile?", "Solo con prescrizione medica e con terapeuti riconosciuti in Svizzera (PsiReg). Il percorso diretto con noi resta privato e riservato: paghi la seduta e niente finisce nel dossier assicurativo."]
        ],
        desc: "Psicologo italiano online a Ginevra: sedute in videochiamata a CHF 130, prima gratuita, senza prescrizione né lista d'attesa."
      },
      {
        slug: 'basilea',
        nome: 'Basilea',
        titolo: 'Psicologo italiano online a Basilea',
        vicine: ['basilea-campagna', 'soletta', 'baden', 'zurigo', 'sciaffusa', 'muttenz', 'reinach'],
        nota: 'sul Reno, al confine con Germania e Francia',
        intro: "A Basilea vivi a pochi minuti da due paesi e lavori in un ambiente internazionale. Le sedute online si svolgono in italiano, senza spostamenti e senza coincidenze da prendere.",
        local: `<h3>Terapia in italiano a Basilea: per chi vive fra tre paesi</h3><p>A Basilea la giornata attraversa tre paesi: casa in Svizzera, ufficio magari a Weil am Rhein o a Saint-Louis, tempo libero dove capita. È una vita comoda e complicata insieme, e incastrare uno studio di psicoterapia fra dogana, tram e turni non è banale.</p><p>Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta, e per il rimborso tramite LAMal serve una prescrizione medica. Online elimini il problema logistico: <strong>CHF 130</strong> la seduta individuale da 50 minuti, prima seduta conoscitiva gratuita, pagamento in euro all'equivalente fisso.</p><p>Funziona anche per chi lavora su turni o in laboratorio con orari che cambiano ogni settimana: sposti la seduta quando serve, senza perdere l'appuntamento.</p>`,
        faqLocal: [
          ["Basilea non è comoda da raggiungere: come funziona?", "È il motivo per cui molti scelgono l'online: nessuno spostamento, nessuna attesa, 50 minuti da casa o dall'ufficio. Scegli tu l'orario, anche la sera."],
          ["Quanto costa rispetto a uno studio a Basilea?", "In Svizzera una seduta privata costa mediamente 150-200 CHF. Con Adatto x Te la seduta individuale costa CHF 130 e la prima è gratuita."],
          ["Lavoro su turni: posso spostare le sedute?", "Sì: prenoti lo slot che ti serve ogni volta. Molti pazienti alternano settimane con orari diversi senza problemi."]
        ],
        desc: "Psicologo italiano online a Basilea: sedute a CHF 130, prima gratuita, senza prescrizione, nessuno spostamento."
      },
      {
        slug: 'lucerna',
        nome: 'Lucerna',
        titolo: 'Psicologo italiano online a Lucerna',
        vicine: ['emmen', 'baar', 'svitto', 'zurigo', 'glarona', 'hergiswil'],
        nota: "sul lago dei Quattro Cantoni, fra turismo e sanità",
        desc: "Psicologo italiano online a Lucerna: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né attese.",
        intro: "Lucerna è una città che lavora: ospedali, alberghi, cantieri, servizi. Molti italiani ci sono arrivati per una stagione o per un impiego in reparto, e poi ci sono rimasti. Il punto è che la lingua del lavoro e quella in cui ti apri non coincidono quasi mai.",
        local: `<h3>Terapia in italiano a Lucerna, senza liste d'attesa</h3><p>Lucerna è piccola, ordinata e cara, e il mercato della salute mentale non fa eccezione: gli studi privati del Cantone lavorano su appuntamento, con tariffe che in Svizzera partono da <strong>150-200 CHF</strong> a seduta. Per il rimborso tramite LAMal serve la prescrizione del medico, e da lì vengono anche i limiti: al massimo <strong>15 sedute per ricetta</strong>, più la franchigia e il 10 per cento di partecipazione a tuo carico.</p><p>Con il percorso diretto paghi <strong>CHF 130</strong> la seduta individuale da 50 minuti (145 CHF quella di coppia), in euro all'equivalente fisso, e la prima seduta conoscitiva è gratuita. Nessuna prescrizione, nessuna diagnosi nel dossier assicurativo, nessuna lista d'attesa.</p><p>Funziona se vivi in città o in uno dei comuni dell'agglomerato, come Kriens o Ebikon, se lavori su turni in ospedale o negli alberghi, e anche se ogni tanto rientri in Italia: il percorso non si interrompe quando cambia il tuo orario.</p>`,
        faqLocal: [
          ["Quanto costa uno psicologo a Lucerna?", "Gli studi privati del Cantone lavorano intorno ai 150-200 CHF a seduta. Con Adatto x Te la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Serve la prescrizione del medico per iniziare?", "Serve solo se vuoi il rimborso LAMal: in quel caso la cura va seguita da terapeuti riconosciuti in Svizzera (PsiReg) e la ricetta copre al massimo 15 sedute. Il percorso diretto non richiede prescrizione."]
        ]
      },
      {
        slug: 'glarona',
        nome: 'Glarona',
        titolo: 'Psicologo italiano online a Glarona',
        vicine: ['svitto', 'lucerna', 'zurigo', 'san-gallo', 'altdorf', 'rapperswil-jona'],
        nota: "il cantone di montagna che ha attirato manodopera italiana per generazioni",
        desc: "Psicologo italiano online a Glarona e nel Glarnerland: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Glarona è un cantone piccolo, di valle, dove le aziende e le famiglie si conoscono tutte. Per chi arriva da fuori la vita sociale può sembrare chiusa, e il disagio passa inosservato proprio perché manca qualcuno con cui nominarlo.",
        local: `<h3>Terapia in italiano nel Glarnerland, in videochiamata</h3><p>Il cantone di Glarona conta poche decine di migliaia di abitanti e una tradizione industriale che ha portato manodopera italiana in valle per generazioni. Il rovescio della medaglia è la dimensione: pochi professionisti, attese lunghe e la sensazione che tutti sappiano chi sei. Nelle valli laterali l'offerta specialistica è ancora più rarefatta.</p><p>Per questo la videochiamata cambia le cose. Costo del percorso diretto: <strong>CHF 130</strong> la seduta individuale da 50 minuti, pagabile in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se invece punti al rimborso LAMal, la strada resta quella della prescrizione medica e dei terapeuti riconosciuti in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta, più franchigia e 10 per cento.</p><p>Vale se vivi a Glarona, a Näfels, a Schwanden o in uno dei comuni della valle, e anche se lavori su turni in fabbrica o in ospedale.</p>`,
        faqLocal: [
          ["In un cantone piccolo si rischia di incontrarsi in giro?", "È un timore legittimo e va detto: nella terapia online non incroci il terapeuta al supermercato, e nulla entra nel tuo giro di conoscenze. È uno dei motivi per cui in una valle stretta molte persone scelgono la videochiamata."],
          ["Il percorso online vale anche se poi mi trasferisco?", "Sì, ed è uno dei suoi vantaggi in un cantone dove i contratti durano pochi anni. Stesso terapeuta e stessa lingua anche se ti sposti in un'altra valle, in un altro cantone o rientri in Italia."]
        ]
      },
      {
        slug: 'soletta',
        nome: 'Soletta',
        titolo: 'Psicologo italiano online a Soletta',
        vicine: ['basilea-campagna', 'basilea', 'baden', 'berna', 'koniz', 'grenchen', 'olten'],
        nota: "città barocca sull'Aar, terra di pendolari",
        desc: "Psicologo italiano online a Soletta e nel Cantone: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Soletta è una città di provincia ordinata e silenziosa, con una piazza barocca che sembra ferma nel tempo. Molti ci vivono per lavorare altrove, tra Olten, Basilea e Zurigo, e tornare la sera in una città tranquilla è comodo ma anche solitario.",
        local: `<h3>Terapia in italiano a Soletta, fra casa e pendolarismo</h3><p>Soletta vive di pendolarismo: la mattina la stazione si riempie di chi va a Olten, a Basilea o fino a Zurigo, e la sera si svuota. È una vita che funziona sulla carta e costa molto in pratica, perché il tempo del viaggio si toglie al riposo e alle relazioni. In una città di questa dimensione, poi, i servizi di salute mentale sono pochi e le liste si allungano.</p><p>La videochiamata toglie di mezzo proprio il problema logistico: nessuno spostamento dopo una giornata già passata in treno. La seduta individuale da 50 minuti costa <strong>CHF 130</strong>, in euro all'equivalente fisso, e la prima seduta conoscitiva è gratuita. Nessuna prescrizione medica, nessuna lista d'attesa, niente nel dossier assicurativo.</p><p>Vale se vivi a Soletta, a Grenchen, a Olten o nei comuni intorno, e anche se il tuo orario cambia ogni settimana.</p>`,
        faqLocal: [
          ["Devo spostarmi fino a uno studio?", "No. Tutte le sedute sono in videochiamata: si fanno da casa o dall'ufficio, senza aggiungere viaggi a una giornata già segnata dal pendolarismo."],
          ["E se voglio il rimborso della cassa malattia?", "In quel caso serve la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg): la ricetta copre al massimo 15 sedute, e restano a tuo carico franchigia e 10 per cento. Il percorso diretto con noi resta privato."]
        ]
      },
      {
        slug: 'sciaffusa',
        nome: 'Sciaffusa',
        titolo: 'Psicologo italiano online a Sciaffusa',
        vicine: ['zurigo', 'san-gallo', 'baden', 'baar', 'turgovia'],
        nota: "sul Reno, al confine con la Germania",
        desc: "Psicologo italiano online a Sciaffusa e nel Cantone: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Sciaffusa è una città sul Reno, con il Munot sopra le case e le cascate più famose del paese a pochi minuti. Il cantone ha una forma strana, fatta di pezzi separati: la vita quotidiana scavalca continuamente un confine che non si vede.",
        local: `<h3>Terapia online in italiano a Sciaffusa</h3><p>Il Cantone di Sciaffusa è un puzzle: il capoluogo, le exclave, la campagna attorno a Reiath, e un confine con la Germania che si attraversa senza pensarci. Molti ci lavorano nell'industria e nella meccanica di precisione, altri pendolano verso Zurigo o Winterthur. In un territorio così piccolo l'offerta di psicoterapia è limitata e i tempi di attesa si allungano.</p><p>Il percorso online aggira il problema: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, nessuna diagnosi nel dossier assicurativo. Se invece vuoi passare dalla cassa malattia, serve la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi in città, a Neuhausen, a Beringen o nei comuni del cantone, e anche se la tua settimana è fatta di turni.</p>`,
        faqLocal: [
          ["Quanto costa rispetto a uno studio locale?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Il percorso diretto con Adatto x Te costa CHF 130 la seduta individuale da 50 minuti, con la prima gratuita."],
          ["Vale anche se vivo in una delle exclave?", "Sì: essendo tutto in videochiamata, conta solo la tua disponibilità oraria, non la distanza dal capoluogo."]
        ]
      },
      {
        slug: 'appenzello-interno',
        nome: 'Appenzello Interno',
        titolo: 'Psicologo italiano online ad Appenzello Interno',
        vicine: ['san-gallo', 'zurigo', 'glarona', 'herisau'],
        nota: "il cantone più piccolo, di tradizione contadina",
        desc: "Psicologo italiano online ad Appenzello Interno: sedute a CHF 130, prima gratuita, senza prescrizione né attese.",
        intro: "Appenzello Interno è il cantone più piccolo del paese: colline, case dipinte, latterie e una comunità dove le tradizioni contano ancora molto. Chi arriva da fuori impiega anni a entrare davvero nei giri, e la solitudine qui non si vede perché il paesaggio è bellissimo.",
        local: `<h3>Un percorso in italiano per chi vive ad Appenzello Interno</h3><p>Ad Appenzello Interno le distanze sono brevi e i legami sono antichi: le famiglie si conoscono da generazioni e la vita associativa è intensa, ma resta chiusa a chi arriva da poco. Per una persona italiana trasferita qui, la fatica più comune non è la lingua del lavoro, è non avere nessuno con cui parlare di come si sente. E i servizi specialistici sono lontani, a San Gallo o a Herisau.</p><p>La videochiamata risolve la distanza: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se vuoi il rimborso tramite LAMal serve invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta.</p><p>Vale se vivi ad Appenzello, ad Appenzello Esterno o nei comuni della valle del Reno, anche in una fattoria.</p>`,
        faqLocal: [
          ["Non c'è nessuno con cui parlare in italiano qui: serve comunque?", "È esattamente la situazione per cui esiste questo percorso. Le sedute sono in italiano e il terapeuta non fa parte della tua comunità, quindi puoi dire le cose senza il timore di come verranno prese in paese."],
          ["Funziona da una zona di campagna con poca connessione?", "Basta una connessione stabile e un posto tranquillo. Se la rete è debole possiamo lavorare per telefono senza problemi."]
        ]
      },
      {
        slug: 'koniz',
        nome: 'Köniz',
        titolo: 'Psicologo italiano online a Köniz',
        vicine: ['berna', 'soletta', 'biel-bienne', 'basilea-campagna'],
        nota: "il grande comune alle porte di Berna",
        desc: "Psicologo italiano online a Köniz e nell'area di Berna: sedute a CHF 130, prima gratuita, senza prescrizione né attese.",
        intro: "Köniz non è un paesino: è uno dei comuni più popolosi della Svizzera, attaccato a Berna, fatto di quartieri residenziali e di pendolari. Ci si vive comodi, a due fermate dal centro, ma è facile scivolare in una routine in cui non si parla mai davvero con nessuno.",
        local: `<h3>Terapia in italiano a Köniz e nell'area di Berna</h3><p>Köniz è la tipica periferia ben collegata: tram verso Berna, quartieri tranquilli, case ordinate e una vita sociale che resta per lo più dentro le mura di casa. Molti italiani ci arrivano per lavorare nel settore pubblico, nella ricerca o nella sanità, e scoprono che una città ordinata non mette automaticamente a proprio agio. La lingua dei colleghi è una, quella degli affetti un'altra.</p><p>Il percorso online sta negli orari che scegli tu: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se vuoi invece il rimborso LAMal serve la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi a Köniz, a Liebefeld, a Spiegel o in uno dei comuni intorno a Berna, e anche se lavori a Berna e torni a casa solo la sera.</p>`,
        faqLocal: [
          ["Quanto costa rispetto a uno studio a Berna?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Serve la prescrizione per il rimborso LAMal?", "Sì: la prescrizione del medico è necessaria e la cura va seguita da terapeuti riconosciuti in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta, più franchigia e 10 per cento a tuo carico."]
        ]
      },
      {
        slug: 'biel-bienne',
        nome: 'Biel/Bienne',
        titolo: 'Psicologo italiano online a Biel/Bienne',
        vicine: ['koniz', 'soletta', 'berna', 'basilea-campagna', 'grenchen'],
        nota: "la città dell'orologeria, dove la metà degli abitanti viene da fuori",
        desc: "Psicologo italiano online a Biel/Bienne: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Biel/Bienne è la città svizzera dell'orologeria, cresciuta a forza di officine e di lavoratori arrivati da lontano. Qui l'italiano è una presenza storica: ci sono famiglie italiane da tre generazioni e altre arrivate da poco per lavorare nel settore tecnico.",
        local: `<h3>Terapia in italiano a Biel/Bienne</h3><p>Biel/Bienne è una città industriale con una storia precisa: le fabbriche di orologi hanno attirato manodopera straniera per tutto il Novecento, e le famiglie italiane sono parte di questa storia da generazioni. È anche una città dichiarata bilingue, con quartieri storici e altri nuovi, e un lago a pochi minuti dal centro. Per chi ci vive oggi, la fatica più frequente non riguarda il lavoro: riguarda il sentirsi parte di un posto che conosce da sempre senza esserne davvero dentro.</p><p>Il percorso online dà uno spazio tuo: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se punti al rimborso della cassa malattia, la strada resta quella della prescrizione medica e dei terapeuti riconosciuti in Svizzera (PsiReg).</p><p>Vale per la città e per i comuni intorno, da Nidau a Brügg, e anche per chi lavora in orologeria su turni che cambiano ogni mese.</p>`,
        faqLocal: [
          ["A Biel molta gente parla italiano: che bisogno c'è di un percorso online?", "Parlare una lingua non è la stessa cosa che essere a proprio agio in un percorso. Il terapeuta online non fa parte né della tua cerchia né della comunità locale, e questa estraneità è ciò che rende possibile dire le cose difficili."],
          ["Quanto costa la seduta?", "CHF 130 per la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita. Nessuna prescrizione richiesta."]
        ]
      },
      {
        slug: 'baden',
        nome: 'Baden',
        titolo: 'Psicologo italiano online a Baden',
        vicine: ['zurigo', 'basilea-campagna', 'basilea', 'soletta', 'baar'],
        nota: "città termale e industriale a venti minuti da Zurigo",
        desc: "Psicologo italiano online a Baden e nel Cantone Argovia: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Baden è cresciuta attorno alle terme e alla grande industria elettrotecnica, e oggi è uno dei posti da cui si raggiunge Zurigo in venti minuti di treno. Molti italiani ci lavorano nell'ingegneria, nell'IT o nella ricerca: una vita efficiente, che lascia poco spazio per fermarsi.",
        local: `<h3>Terapia in italiano a Baden, per chi vive di pendolarismo</h3><p>La valle della Limmat a Baden è uno dei poli industriali storici del paese, e il treno per Zurigo è così comodo che in molti ci abitano lavorando altrove. Il risultato è una giornata lunga, fatta di ufficio, spostamenti e poco altro. È il tipo di vita in cui il disagio non si annuncia con un crollo: si annuncia con l'apatia delle domeniche, con la sensazione di non avere più niente da raccontare.</p><p>Un percorso online si inserisce dove c'è spazio: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se preferisci passare dalla cassa malattia, servono invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Baden, a Wettingen, a Neuenhof o nei comuni della valle, e anche se lavori a Zurigo e rientri la sera.</p>`,
        faqLocal: [
          ["Quanto costa rispetto a uno studio a Baden o a Zurigo?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Il percorso diretto costa CHF 130 la seduta individuale da 50 minuti, con la prima seduta gratuita."],
          ["Se abito in Argovia posso comunque iniziare?", "Sì. Il percorso è in videochiamata e non dipende dal cantone di residenza: contano solo la tua disponibilità e una connessione stabile."]
        ]
      },
      {
        slug: 'baar',
        nome: 'Baar',
        titolo: 'Psicologo italiano online a Baar',
        vicine: ['zurigo', 'lucerna', 'svitto', 'emmen', 'baden', 'zugo'],
        nota: "nel Cantone Zugo, terra di aziende e trasferimenti",
        desc: "Psicologo italiano online a Baar e nel Cantone Zugo: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Baar sta nel Cantone Zugo, dove ogni anno arrivano persone da mezzo mondo per lavorare in aziende e società di commercio. È un posto ricco, ordinato e internazionale, dove però le relazioni si costruiscono con fatica e si sciolgono in fretta, perché molti restano pochi anni.",
        local: `<h3>Un percorso in italiano a Baar e nel Cantone Zugo</h3><p>Zugo è il cantone delle sedi societarie e dei trasferimenti: si arriva per un incarico, si resta due o tre anni, poi si riparte. Questa mobilità continua rende facile conoscere gente e difficile legare. A Baar, poi, la vita è organizzata intorno al lavoro e alla famiglia, con poco spazio per i legami che non rientrano in nessuno dei due.</p><p>La terapia online offre una continuità che il resto non ha: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se vuoi il rimborso tramite LAMal, servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta.</p><p>Vale se vivi a Baar, a Zugo, a Cham o in uno dei comuni del cantone, e resta valido anche se il tuo incarico ti porta altrove.</p>`,
        faqLocal: [
          ["Mi trasferisco spesso: ha senso iniziare un percorso?", "Sì, proprio per questo. Stesso terapeuta e stessa lingua anche se cambi casa, cantone o paese: il percorso non riparte da zero a ogni trasferimento."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso. La prima seduta conoscitiva è gratuita e non serve prescrizione."]
        ]
      },
      {
        slug: 'svitto',
        nome: 'Svitto',
        titolo: 'Psicologo italiano online a Svitto',
        vicine: ['lucerna', 'baar', 'glarona', 'zurigo', 'altdorf', 'kuessnacht'],
        nota: "il cantone che dà il nome al paese, fra i due Mythen",
        desc: "Psicologo italiano online a Svitto e nei comuni del Cantone: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Il Cantone di Svitto è il luogo da cui prende il nome l'intero paese: due montagne sopra i pascoli, paesi ordinati e una tradizione civica molto sentita. È una terra bella e poco abituata a chi arriva da fuori, dove inserirsi richiede tempo che spesso non si ha.",
        local: `<h3>Terapia in italiano a Svitto e nei comuni del cantone</h3><p>Il Cantone di Svitto è fatto di paesi e di valli, con una vita associativa forte e legami che vengono da generazioni. Chi si trasferisce qui per lavoro — verso Zurigo, verso Zugo o in uno dei comuni del cantone — trova paesaggi splendidi e una rete sociale difficile da aprire. A questo si aggiunge la distanza dai servizi specialistici, che si concentrano altrove.</p><p>Il percorso online accorcia entrambe le distanze: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se punti al rimborso della cassa malattia, la strada prevede invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi a Svitto, a Brunnen, a Schwyz o in uno dei comuni del cantone, anche in una zona di campagna.</p>`,
        faqLocal: [
          ["In un posto così piccolo la riservatezza è un problema?", "Nella terapia online il terapeuta non vive nel tuo paese e non incrocia la tua cerchia. È spesso il motivo principale per cui, in una comunità piccola, si sceglie questa strada."],
          ["Serve la prescrizione del medico?", "No, se scegli il percorso diretto. La prescrizione serve solo se vuoi il rimborso LAMal, e in quel caso la ricetta copre al massimo 15 sedute."]
        ]
      },
      {
        slug: 'emmen',
        nome: 'Emmen',
        titolo: 'Psicologo italiano online a Emmen',
        vicine: ['lucerna', 'baar', 'svitto', 'zurigo', 'sarnen'],
        nota: "grande comune operaio alle porte di Lucerna",
        desc: "Psicologo italiano online a Emmen e nell'area di Lucerna: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Emmen sta appena fuori Lucerna: un comune grande, popoloso, con zone industriali, capannoni e quartieri residenziali cresciuti in fretta. Ci vive gente arrivata da mezza Europa, e proprio per questo è facile restare invisibili anche in mezzo a tanta gente.",
        local: `<h3>Terapia in italiano a Emmen, accanto a Lucerna</h3><p>Emmen è uno dei comuni più popolosi del Cantone di Lucerna e uno dei più industriali: officine, logistica, grandi superfici commerciali e quartieri come Emmenbrücke, cresciuti per accogliere chi arrivava a lavorare. È un posto concreto, dove molte famiglie vivono tra turni e doppi lavori, e dove chiedere aiuto per la salute mentale non è ancora la cosa più semplice da fare.</p><p>Un percorso online si incastra negli orari che hai: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, nessuna traccia nel dossier assicurativo. Se preferisci il rimborso LAMal, servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Emmen, a Emmenbrücke o in uno dei comuni dell'agglomerato di Lucerna, e anche se lavori su turni che cambiano ogni settimana.</p>`,
        faqLocal: [
          ["Devo per forza andare in studio?", "No: tutte le sedute sono in videochiamata, da casa o da un posto tranquillo. È pensato anche per chi non può assentarsi dal lavoro o dai turni."],
          ["Quanto costa uno psicologo da queste parti?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."]
        ]
      },
      {
        slug: 'san-gallo',
        nome: 'San Gallo',
        titolo: 'Psicologo italiano online a San Gallo',
        vicine: ['appenzello-interno', 'zurigo', 'glarona', 'sciaffusa', 'herisau', 'teufen'],
        nota: "capoluogo della Svizzera orientale, terra di ricamo e tessuti",
        desc: "Psicologo italiano online a San Gallo e nella Svizzera orientale: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "San Gallo è la città svizzera del ricamo e dei tessuti, con l'abbaziale e la sua biblioteca fra i patrimoni dell'umanità. È il capoluogo della Svizzera orientale, a pochi minuti dal confine con l'Austria e con la Germania: una terra di passaggio dove molti arrivano per lavoro e ripartono.",
        local: `<h3>Un percorso in italiano a San Gallo e nella Svizzera orientale</h3><p>San Gallo è una città media, con una tradizione tessile che ha portato lavoro e persone da tutta Europa, e un tessuto universitario che continua ad attirare chi viene da fuori. La vicinanza al confine rende normale lavorare in un paese e abitare in un altro, e questa mobilità continua ha un prezzo: legami brevi, case che cambiano, la sensazione di essere sempre di passaggio.</p><p>La terapia online dà continuità: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se invece vuoi passare dalla cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta.</p><p>Vale se vivi in città o nei comuni intorno, e anche se lavori oltre confine o ti dividi fra due paesi.</p>`,
        faqLocal: [
          ["Quanto costa uno psicologo a San Gallo?", "Gli studi privati in Svizzera partono da 150-200 CHF a seduta. Con Adatto x Te la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Vale anche se vivo oltre confine e lavoro a San Gallo?", "Sì: essendo tutto in videochiamata, il percorso non dipende da dove ti trovi nella settimana, né da quale lato del confine ti svegli."]
        ]
      },
      {
        slug: 'basilea-campagna',
        nome: 'Basilea Campagna',
        titolo: 'Psicologo italiano online nel Cantone di Basilea Campagna',
        vicine: ['basilea', 'soletta', 'baden', 'zurigo', 'muttenz', 'liestal'],
        nota: "il cantone attorno a Basilea, fra Liestal e la grande industria",
        desc: "Psicologo italiano online nel Cantone di Basilea Campagna: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Il Cantone di Basilea Campagna circonda la città di Basilea senza esserne parte: il capoluogo è Liestal, e molti comuni funzionano come quartieri residenziali della grande industria chimica e farmaceutica. Si abita in un cantone e si lavora in un altro, e questo basta a complicare il senso di appartenenza.",
        local: `<h3>Terapia in italiano nel Cantone di Basilea Campagna</h3><p>Basilea Campagna è una fascia di comuni attorno alla città: Liestal, Reinach, Allschwil, Pratteln, Binningen. Molti italiani ci vivono perché si sta un po' meglio che in città e si arriva al lavoro in tram o in bicicletta, nei laboratori e negli stabilimenti dell'area renana. È una vita comoda, ma vissuta in un territorio amministrativo che non è quello in cui si lavora, e per chi arriva da fuori questo doppio riferimento pesa più di quanto sembri.</p><p>Il percorso online elimina anche questo problema: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se punti al rimborso della cassa malattia, serviranno la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi a Liestal, a Reinach, ad Allschwil o in uno dei comuni del cantone, e anche se lavori a Basilea o in uno dei poli industriali della zona.</p>`,
        faqLocal: [
          ["Vivo in campagna, in un comune piccolo: funziona lo stesso?", "Sì, serve solo una connessione stabile e un posto tranquillo. Se la rete è debole possiamo lavorare per telefono."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."]
        ]
      },
      {
        slug: 'grenchen',
        nome: 'Grenchen',
        nota: "la città dell'orologeria, fra Bienne e Soletta",
        titolo: "Psicologo italiano online a Grenchen",
        desc: "Psicologo italiano online a Grenchen: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa.",
        intro: "Grenchen è la seconda città del Canton Soletta e vive di orologeria dal 1851: fabbriche, officine e turni che scandiscono la settimana di migliaia di famiglie. È il tipo di città in cui il lavoro funziona e la vita privata resta in secondo piano.",
        local: "<h3>Terapia in italiano a Grenchen, fra il Giura e l'Aar</h3><p>Grenchen sta fra Bienne e Soletta, stretta fra il massiccio del Giura e il fiume Aar, a 451 metri sul livello del mare, ed è capoluogo del distretto di Lebern. Il suo nome è legato a un'industria sola: l'orologeria, arrivata in città nel 1851, quando la popolazione cominciò a crescere rapidamente. Qui hanno messo radici aziende storiche come ETA Manufacture Horlogère, che produce per il gruppo Swatch, Eterna, Breitling, Fortis e Rodania; vi ha sede anche BMC, che costruisce biciclette da corsa e componentistica. Per chi ci lavora significa turni, reparti, controllo qualità e una giornata che si svolge in tedesco o in inglese: un ambiente dove la precisione è la norma e chiedere aiuto per sé non lo è affatto.</p><p>Il percorso online si incastra negli orari che hai: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, nessuna traccia nel dossier assicurativo. Se preferisci passare dalla cassa malattia servono invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta più franchigia e 10 per cento a tuo carico.</p><p>Vale se vivi in città o nella frazione di Staad, e anche nei comuni vicini come Bettlach, Selzach, Lengnau o Arch, se lavori su turni che cambiano ogni mese, o se fai il pendolare verso Bienne e Soletta: le due stazioni, Grenchen Nord e Grenchen Süd, portano al lavoro, non da uno psicologo.</p>",
        faqLocal: [
          ["Si può fare terapia in italiano a Grenchen?", "Sì: tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani. Nel cantone l'offerta in italiano è scarsa, e chi lavora in orologeria su turni ha orari difficili da incastrare con uno studio: la videochiamata toglie di mezzo entrambi i problemi."],
          ["Quanto costa rispetto a uno studio della zona?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130, in euro all'equivalente fisso, e la prima è gratuita."],
          ["Lavoro su turni in fabbrica: quali orari ci sono?", "Prenoti tu lo slot che ti serve, anche la sera o nel weekend: non devi chiedere permessi né spostarti fino a uno studio."],
        ],
        vicine: ['soletta', 'biel-bienne', 'koniz', 'basilea-campagna'],
      },
      {
        slug: 'herisau',
        nome: 'Herisau',
        nota: "capoluogo di Appenzello Esterno, alle porte di San Gallo",
        titolo: "Psicologo italiano online a Herisau",
        desc: "Psicologo italiano online a Herisau: sedute in videochiamata a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Herisau è il capoluogo di Appenzello Esterno, il semicantone delle colline e delle case dipinte, a pochi minuti da San Gallo. Chi arriva da fuori trova paesaggi bellissimi e una vita associativa che esiste da generazioni: entrare davvero nei giri richiede tempo che spesso non si ha.",
        local: "<h3>Un percorso in italiano a Herisau e in Appenzello Esterno</h3><p>Herisau è capoluogo di Appenzello Esterno dal 1877, anche se la corte suprema e altre istituzioni cantonali hanno sede a Trogen: un dettaglio che dice molto di questo cantone, dove i paesi si spartiscono le funzioni e le distanze restano brevi. È una città di circa 15.000 abitanti con un centro storico raccolto, la chiesa riformata attestata dal 907 e ricostruita nel Cinquecento, la chiesa cattolica di fine Ottocento e le rovine del castello di Rosenburg appena fuori dall'abitato. Nel 2003 ha ricevuto il titolo di Città alpina dell'anno. La sua storia è tessile: le filande e i telai hanno portato in valle lavoro e persone da mezza Europa, e anche gli italiani.</p><p>Il rovescio della medaglia è la dimensione: in un cantone così piccolo i servizi specialistici sono pochi e si concentrano a San Gallo, e la sensazione che tutti conoscano tutti rende più difficile dire le cose come stanno. La videochiamata risolve entrambe: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa, e il terapeuta non fa parte della tua comunità. Se invece punti al rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi in città o in uno dei comuni della valle — Gossau, Flawil, Degersheim, Waldstatt, Schwellbrunn o Stein — e anche se lavori a San Gallo e rientri la sera.</p>",
        faqLocal: [
          ["In un cantone così piccolo si rischia di incontrarsi in giro?", "È un timore legittimo in una comunità di poche migliaia di persone: nella terapia online il terapeuta non vive nel tuo paese e non incrocia la tua cerchia. È spesso il motivo principale per cui, qui, si sceglie questa strada."],
          ["Quanto costa uno psicologo a Herisau o a San Gallo?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Lavoro a San Gallo e vivo in Appenzello Esterno: cambia qualcosa?", "No: essendo tutto in videochiamata, conta solo la tua disponibilità, non il cantone in cui ti trovi."],
        ],
        vicine: ['san-gallo', 'appenzello-interno', 'zurigo', 'glarona', 'teufen'],
      },
      {
        slug: 'muttenz',
        nome: 'Muttenz',
        nota: "città del Cantone Basilea Campagna, ai piedi del Gempen",
        titolo: "Psicologo italiano online a Muttenz",
        desc: "Psicologo italiano online a Muttenz: sedute a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Muttenz sta subito fuori Basilea, nel Cantone Basilea Campagna, con i laboratori dell'area renana da una parte e il Gempen dall'altra. Molti italiani ci vivono perché si sta meglio che in città e si arriva al lavoro in tram: una vita comoda, ma in un cantone che non è quello in cui si lavora.",
        local: "<h3>Terapia in italiano a Muttenz e nel distretto di Arlesheim</h3><p>Muttenz è una città di circa 17.000 abitanti del Cantone Basilea Campagna, nel distretto di Arlesheim, a un passo da Basilea e dai comuni di Birsfelden, Pratteln, Münchenstein e Arlesheim; confina anche con Frenkendorf e, sull'altra sponda del Reno, con Grenzach-Wyhlen, in Germania. Con i suoi sedici chilometri quadrati e le frazioni di Freidorf, Feldreben e Auf der Schanz è uno dei comuni più popolosi del cantone, cresciuto come quartiere residenziale della grande industria chimica e farmaceutica renana. La ragione per cui molti italiani ci vivono è concreta: si sta un po' meglio che in città e si arriva al lavoro in tram o in bicicletta. Il rovescio è che si vive in un cantone e si lavora in un altro, e questo doppio riferimento pesa più di quanto sembri a chi è arrivato da poco.</p><p>Il percorso online elimina anche la logistica: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se preferisci passare dalla cassa malattia servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg), con 15 sedute al massimo per ricetta più franchigia e 10 per cento.</p><p>Vale se vivi a Muttenz o a Freidorf e anche nei comuni intorno, e se lavori a Basilea in laboratorio o su turni che cambiano ogni settimana.</p>",
        faqLocal: [
          ["Vivo in Basilea Campagna e lavoro a Basilea: ha senso?", "Sì, ed è la situazione più comune da queste parti. Il percorso è in videochiamata e non dipende dal cantone di residenza né da quello in cui lavori: contano solo i tuoi orari."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['basilea-campagna', 'basilea', 'soletta', 'baden'],
      },
      {
        slug: 'altdorf',
        nome: 'Altdorf',
        nota: "capoluogo del Canton Uri, sulla piana della Reuss",
        titolo: "Psicologo italiano online ad Altdorf",
        desc: "Psicologo italiano online ad Altdorf, Canton Uri: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Altdorf è il capoluogo del Canton Uri e il suo centro più popoloso: la piana della Reuss, il lago dei Quattro Cantoni a pochi minuti, la strada del Gottardo che passa di qui. È una terra di transito, dove molta gente arriva per lavorare e riparte quando il progetto finisce.",
        local: "<h3>Terapia in italiano ad Altdorf e in Canton Uri</h3><p>Altdorf è capoluogo e centro più popoloso del Canton Uri, poco meno di 10.000 abitanti nella piana del fiume Reuss, a monte di dove il fiume entra nel lago dei Quattro Cantoni. Il nome significa letteralmente \"vecchio villaggio\", ed è il luogo della leggenda di Guglielmo Tell e della mela: storia e turismo qui contano davvero. Ma è anche una città di servizi e di transito, dove passano la ferrovia e l'autostrada del Gottardo e con esse il lavoro legato a cantieri, logistica, manutenzione delle infrastrutture e ospitalità. Chi arriva per un cantiere o per una stagione spesso sa già che resterà poco, e questo rende difficile costruire legami — o chiedere aiuto mentre si è ancora lì. Va detto anche il resto: nel fondovalle il favonio alza le temperature e Altdorf è fra i comuni più caldi della Svizzera, un dettaglio che cambia il modo di vivere le giornate.</p><p>A questo si aggiunge un ostacolo pratico: in una valle stretta i servizi specialistici sono pochi e si concentrano altrove. La videochiamata lo elimina: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se invece vuoi il rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi in città o nelle frazioni di montagna, e anche nei comuni vicini come Schattdorf, Bürglen, Flüelen, Seedorf o Attinghausen, se lavori su turni o se ti dividi fra Uri e il resto della Svizzera.</p>",
        faqLocal: [
          ["In Canton Uri si rischia di incontrarsi in giro?", "Uri è una valle e le conoscenze si incrociano facilmente. Nella terapia online il terapeuta non vive nel tuo cantone: è uno dei motivi per cui, in una zona così, si sceglie la videochiamata."],
          ["Quanto costa uno psicologo in Canton Uri?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Sono qui solo per un cantiere: ha senso iniziare?", "Sì: il percorso è online e non si interrompe se il progetto finisce o ti sposti in un'altra valle o in un altro cantone."],
        ],
        vicine: ['svitto', 'glarona', 'lucerna', 'zurigo'],
      },
      {
        slug: 'turgovia',
        nome: 'Turgovia',
        nota: "il cantone sul Lago di Costanza, fra Frauenfeld e Kreuzlingen",
        titolo: "Psicologo italiano online in Turgovia",
        desc: "Psicologo italiano online in Turgovia: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa, da Frauenfeld a Kreuzlingen.",
        intro: "La Turgovia è il cantone che si allunga fra il Lago di Costanza e il Reno, con Frauenfeld come capoluogo e una fascia di comuni che vivono di industria, agricoltura e pendolarismo verso Zurigo. Molti italiani ci lavorano e pochi ci hanno una rete sociale.",
        local: "<h3>Terapia in italiano in Turgovia, da Frauenfeld a Kreuzlingen</h3><p>Il Canton Turgovia occupa l'angolo nord-orientale della Svizzera: a nord il Lago di Costanza e il confine con la Germania, a nord-ovest il Reno, a sud il Canton San Gallo, a ovest Zurigo e Sciaffusa. È un cantone di 991 chilometri quadrati, cinque distretti e ottanta comuni, e al suo interno convivono situazioni molto diverse: il capoluogo Frauenfeld sul fiume Murg, Kreuzlingen incollata a Costanza dall'altra parte del confine, Weinfelden e Amriswil fra industria e campagne, Arbon e Romanshorn sul lago. Buona parte dei comuni è diventata dormitorio di chi lavora a Zurigo o a San Gallo, e in questo pendolarismo quotidiano la vita privata si comprime in poche ore della sera.</p><p>La videochiamata si inserisce proprio lì: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se invece vuoi passare dalla cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta.</p><p>Vale per tutta la fascia del cantone, da Frauenfeld a Kreuzlingen, da Weinfelden ad Arbon, e anche se lavori oltre confine e nella stessa settimana ti muovi fra due paesi.</p>",
        faqLocal: [
          ["Lavoro a Zurigo ma vivo in Turgovia: posso iniziare?", "Sì. Il percorso è in videochiamata e non dipende dal cantone di residenza: scegli l'orario che ti resta libero, anche dopo il rientro."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e nessuna prescrizione richiesta."],
          ["In Turgovia l'offerta in italiano è scarsa: come funziona?", "È esattamente il motivo per cui esiste questo percorso: le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, ovunque tu sia nel cantone."],
        ],
        vicine: ['sciaffusa', 'zurigo', 'san-gallo', 'herisau', 'weinfelden'],
      },
      {
        slug: 'teufen',
        nome: "Teufen",
        nota: "comune di Appenzello Esterno, a cinque minuti da San Gallo",
        titolo: "Psicologo italiano online a Teufen",
        desc: "Psicologo italiano online a Teufen: sedute in videochiamata a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Teufen è un comune di circa 6.200 abitanti del Canton Appenzello Esterno, a pochi minuti da San Gallo: case dipinte, prati e pendolarismo quotidiano verso la città. Un posto dove ci si conosce tutti, e dove il confine fra vita privata e pubblica è sottile.",
        local: "<h3>Un percorso in italiano a Teufen e nella valle appenzellese</h3><p>Teufen sta a 833 metri, su quindici chilometri quadrati di prati e colline, e non appartiene a nessun distretto: in Appenzello Esterno i distretti non esistono e il comune si amministra direttamente. Il nucleo si divide fra Dorf, Niederteufen e Lustmühle, e la ferrovia San Gallo-Gais-Appenzello lo attraversa con cinque fermate — Teufen, Teufen AR Stofel, Sternen bei Teufen, Niederteufen e Lustmühle — sulla linea S22 della rete celere di San Gallo. È il motivo per cui molti abitanti lavorano a San Gallo e rientrano la sera in pochi minuti.</p><p>La storia qui è antica e visibile: la chiesa riformata, già intitolata a San Giovanni Battista, è documentata dal 1479 ed è stata ricostruita fra il 1776 e il 1779; la chiesa cattolica è di fine Ottocento. Nel 1723 Bühler si separò da Teufen e divenne comune autonomo, e ancora oggi i due paesi si toccano.</p><p>In un comune di seimila persone la discrezione non è un dettaglio: il percorso in videochiamata porta la terapia fuori dal paese. <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Teufen o nelle sue frazioni, e anche nei comuni vicini come Bühler, Speicher, Stein o Schlatt-Haslen, se ti muovi ogni giorno verso San Gallo.</p>",
        faqLocal: [
          ["In un paese così piccolo si rischia di incontrarsi?", "Sì, è il timore più comune in Appenzello Esterno: nella terapia online il terapeuta non vive nel tuo comune e non incrocia la tua cerchia. Spesso è la ragione principale per cui si sceglie la videochiamata."],
          ["Quanto costa uno psicologo a Teufen o a San Gallo?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['herisau', 'san-gallo', 'appenzello-interno', 'zurigo'],
      },
      {
        slug: 'duebendorf',
        nome: "Dübendorf",
        nota: "città del Canton Zurigo, nel distretto di Uster",
        titolo: "Psicologo italiano online a Dübendorf",
        desc: "Psicologo italiano online a Dübendorf: sedute a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Dübendorf è una città di quasi 28.000 abitanti nel distretto di Uster, attaccata a Zurigo ma con una vita sua. Ci vivono molte famiglie che lavorano in città o nei laboratori federali di ricerca: comoda, ma con poco tempo per sé.",
        local: "<h3>Terapia in italiano a Dübendorf, nel distretto di Uster</h3><p>Dübendorf confina direttamente con Zurigo e con Wallisellen, Dietlikon, Wangen-Brüttisellen, Volketswil, Schwerzenbach e Fällanden: tredici chilometri quadrati a 440 metri di quota, con lo status di città e una densità di oltre duemila abitanti per chilometro quadrato. È il tipo di comune che si è sviluppato come cintura residenziale della grande città, e che oggi ha una sua economia: qui hanno sede i laboratori federali di ricerca Empa ed Eawag, oltre all'aerodromo. Per chi ci vive significa una doppia giornata, fra il pendolarismo verso Zurigo e gli orari di chi lavora in laboratorio o in ufficio.</p><p>La città ha anche un passato lungo: la chiesa riformata, già dedicata a Santa Maria, risale all'ottavo secolo ed è stata ricostruita nel 1968; la chiesa cattolica di Santa Maria della Pace è del 1951-1952.</p><p>Il percorso in videochiamata entra nella giornata senza spostamenti: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, nessuna prescrizione e nessuna lista d'attesa. Se preferisci passare dalla cassa malattia, servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in città o nelle frazioni, e anche se lavori a Zurigo, a Wallisellen o in uno dei comuni del distretto di Uster.</p>",
        faqLocal: [
          ["Lavoro a Zurigo e vivo a Dübendorf: come incastro le sedute?", "Scegli tu l'orario, anche la sera o il sabato: non devi spostarti né chiedere permessi. Il percorso è in videochiamata e si adatta alla tua settimana."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['zurigo', 'winterthur', 'baar', 'baden'],
      },
      {
        slug: 'weinfelden',
        nome: "Weinfelden",
        nota: "capoluogo del distretto di Weinfelden, in Turgovia",
        titolo: "Psicologo italiano online a Weinfelden",
        desc: "Psicologo italiano online a Weinfelden: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Weinfelden è capoluogo del distretto omonimo, in Canton Turgovia: poco più di 11.000 abitanti, una piazza centrale viva e un tessuto di piccole e medie imprese. È il centro di riferimento per buona parte della valle della Thur.",
        local: "<h3>Terapia in italiano a Weinfelden e nel Canton Turgovia</h3><p>Weinfelden si trova a 432 metri, a metà strada fra Frauenfeld e Kreuzlingen, ed è capoluogo del distretto che porta il suo nome: cinque comuni confinanti — Amlikon-Bissegg, Berg, Bürglen, Bussnang, Kemmental e Märstetten — che dicono quanto questo pezzo di Turgovia sia fatto di paesi vicini e collegati. La città ha poco più di 11.000 abitanti e lo status di città, con un centro raccolto intorno alla piazza e una vita associativa che è il vero tessuto sociale della zona: società di ginnastica, cori, pompieri volontari.</p><p>Per chi arriva da fuori il quadro è chiaro: si lavora, si rientra, e in mezzo resta poco spazio. Molti comuni del cantone sono diventati dormitori di chi lavora a Zurigo o a San Gallo, e nella stessa settimana ci si può trovare a guidare verso due direzioni diverse senza un momento per sé.</p><p>La videochiamata sta esattamente in quello spazio: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta.</p><p>Vale se vivi a Weinfelden o nei comuni intorno, e anche per tutta la fascia del cantone, da Frauenfeld a Kreuzlingen.</p>",
        faqLocal: [
          ["A Weinfelden trovo uno psicologo che parla italiano?", "Nel cantone l'offerta in italiano è limitata: è il motivo per cui esiste questo percorso. Le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, ovunque tu sia in Turgovia."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita."],
        ],
        vicine: ['turgovia', 'zurigo', 'san-gallo', 'sciaffusa'],
      },
      {
        slug: 'hergiswil',
        nome: "Hergiswil",
        nota: "comune del Canton Nidvaldo, sulla riva del lago",
        titolo: "Psicologo italiano online a Hergiswil",
        desc: "Psicologo italiano online a Hergiswil: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Hergiswil è un comune di circa 6.200 abitanti del Canton Nidvaldo, sulla sponda sud del lago dei Quattro Cantoni, all'imbocco del ramo di Alpnach. Nidvaldo non ha distretti: il comune è la cellula che conta.",
        local: "<h3>Un percorso in italiano a Hergiswil, fra Nidvaldo e Lucerna</h3><p>Hergiswil si allunga sulla sponda sud del lago dei Quattro Cantoni, a 449 metri, dove il lago si stringe nel ramo di Alpnach. Confina con Alpnach, che è Obvaldo, con Stansstad e con tre comuni lucernesi — Horw, Kriens e Schwarzenberg — e questa vicinanza dice molto: da qui Lucerna è a pochi minuti, e in tanti lavorano nel capoluogo pur vivendo in Nidvaldo. Il cantone non ha distretti: Hergiswil è una delle undici località che lo compongono, e la sua vita amministrativa resta tutta interna al comune.</p><p>Il paese è un luogo di lavoro oltre che di residenza: vi ha sede la Glasi Hergiswil, la vetreria fondata nel 1817 che è parte della storia industriale del posto. Per molti abitanti questo significa turni, produzione, stagionalità e un pendolarismo continuo fra due cantoni.</p><p>Il percorso in videochiamata taglia la logistica: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in paese o nelle sue frazioni, e anche nei comuni vicini di Stansstad, Alpnach, Kriens e Horw.</p>",
        faqLocal: [
          ["Vivo in Nidvaldo e lavoro a Lucerna: posso fare terapia online?", "Sì: il percorso non dipende dal cantone di residenza. Tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, negli orari che scegli tu."],
          ["Quanto costa uno psicologo in questa zona?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['lucerna', 'emmen', 'sarnen', 'baar'],
      },
      {
        slug: 'rapperswil-jona',
        nome: "Rapperswil-Jona",
        nota: "città sul lago di Zurigo, nel distretto di See-Gaster",
        titolo: "Psicologo italiano online a Rapperswil-Jona",
        desc: "Psicologo italiano online a Rapperswil-Jona: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Rapperswil-Jona sta all'estremità orientale del lago di Zurigo, in Canton San Gallo: quasi 29.000 abitanti, un castello, il ponte di legno e un lungolago che nei mesi caldi è il centro della vita sociale. Bello da vivere, meno semplice se ti manca la tua lingua.",
        local: "<h3>Terapia in italiano a Rapperswil-Jona, distretto di See-Gaster</h3><p>Rapperswil-Jona è un comune di circa 28.600 abitanti del Canton San Gallo, nel distretto di See-Gaster, a 409 metri sul livello del mare, all'estremità orientale del lago di Zurigo. Il suo territorio è un intreccio di confini: tocca il canton Svitto con Altendorf, Lachen, Wangen, Freienbach e Tuggen, il canton Zurigo con Bubikon, Rüti e Hombrechtikon, e i comuni sangallesi di Eschenbach e Schmerikon. È un nodo fra cantoni e fra laghi, con una parte storica intorno al castello e una parte moderna verso Jona, e una vocazione turistica che d'estate cambia il ritmo della città.</p><p>Chi ci vive lo sa: si arriva da fuori per il lavoro — servizi, industria leggera, turismo, sanità — e costruire una rete in una città che cambia faccia ogni stagione richiede tempo. E l'italiano, qui, non è la lingua del posto: lo si parla in famiglia, non negli uffici.</p><p>Il percorso in videochiamata tiene insieme le due cose: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Rapperswil, a Jona o nelle frazioni, e anche nei comuni vicini come Eschenbach, Schmerikon, Rüti o Freienbach.</p>",
        faqLocal: [
          ["In una città di quasi 29.000 abitanti serve la terapia online?", "Il problema qui non è la dimensione, è la lingua: l'offerta di psicoterapia in italiano è rara. Con il percorso online le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['zurigo', 'glarona', 'san-gallo', 'kuessnacht'],
      },
      {
        slug: 'liestal',
        nome: "Liestal",
        nota: "capitale del Canton Basilea Campagna",
        titolo: "Psicologo italiano online a Liestal",
        desc: "Psicologo italiano online a Liestal: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Liestal è la capitale del Canton Basilea Campagna e capoluogo del suo distretto: circa 14.400 abitanti, un centro storico in salita e la funzione di sede delle istituzioni cantonali. Una città di servizi, abitata anche da chi lavora a Basilea.",
        local: "<h3>Terapia in italiano a Liestal, capitale del Cantone</h3><p>Liestal è a 327 metri, sul bordo della valle dell'Ergolz, e da oltre due secoli è il luogo dove il Canton Basilea Campagna tiene le sue istituzioni: qui hanno sede il governo e il parlamento cantonali, il tribunale e l'amministrazione. Circa 14.400 abitanti, otto comuni confinanti — Arisdorf, Bubendorf, Frenkendorf, Füllinsdorf, Hersberg, Lausen, Seltisberg e Nuglar-Sankt Pantaleon, che è già Soletta — e una posizione che la mette a pochi minuti da Basilea e a pochi minuti dalla campagna.</p><p>È una città con un'identità forte, legata anche alle sue tradizioni: il carnevale di Liestal, con le sue fiaccole, è uno dei più conosciuti della Svizzera e segna il calendario di tutta la zona. Ma una città amministrativa vive anche di pendolarismo: molti abitanti lavorano a Basilea, nel settore chimico o farmaceutico, e rientrano la sera.</p><p>Il percorso in videochiamata evita di aggiungere spostamenti a una giornata già piena: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se preferisci passare dalla cassa malattia servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Liestal o nei comuni del distretto, e anche se lavori a Basilea o a Pratteln.</p>",
        faqLocal: [
          ["Vivo in Basilea Campagna e lavoro a Basilea: posso iniziare?", "Sì, è la situazione più diffusa in questo cantone. Il percorso è in videochiamata e non dipende dal cantone di residenza né da quello di lavoro."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['basilea-campagna', 'basilea', 'reinach', 'soletta'],
      },
      {
        slug: 'reinach',
        nome: "Reinach",
        nota: "città del distretto di Arlesheim, in Basilea Campagna",
        titolo: "Psicologo italiano online a Reinach",
        desc: "Psicologo italiano online a Reinach: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Reinach è una città di circa 19.000 abitanti nel distretto di Arlesheim, in Canton Basilea Campagna, a pochi minuti dal centro di Basilea. È uno dei comuni della cintura urbana renana, e secondo i dati linguistici l'italiano vi è la seconda lingua più diffusa.",
        local: "<h3>Terapia in italiano a Reinach, dove l'italiano è la seconda lingua</h3><p>Reinach ha poco più di 19.000 abitanti su sette chilometri quadrati, a 304 metri, nel distretto di Arlesheim: confina con Basilea, con Aesch, Arlesheim, Münchenstein, Oberwil, Bottmingen e Therwil e, oltre il confine cantonale, con Dornach, che è già Soletta. Il primo documento che la nomina risale al 1168-1176, quando si chiamava Rinacho, e la chiesa cattolica di San Nicola è attestata dal 1336. Oggi è una città densa, cresciuta come quartiere residenziale dell'area renana.</p><p>C'è un dato che qui vale più di ogni altro: nella rilevazione linguistica del 2000, l'88,6 per cento della popolazione era di madrelingua tedesca e l'italiano risultava la seconda lingua più diffusa, con 556 persone, davanti al francese e a tutte le altre. Non è un dettaglio statistico: significa che in una città come questa l'italiano si parla in famiglia, nei corridoi delle scuole, fra colleghi, ma raramente è la lingua in cui si fa un percorso di cura. L'offerta di psicoterapia in italiano, qui come nel resto dell'area renana, resta marginale.</p><p>Il percorso in videochiamata copre esattamente quel vuoto: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione e senza lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Reinach o nei comuni del distretto, e anche se lavori a Basilea o a Pratteln.</p>",
        faqLocal: [
          ["Si trova uno psicologo italiano a Reinach?", "L'offerta in italiano nell'area renana è limitata. Con questo percorso le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, senza spostarsi da casa."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita."],
        ],
        vicine: ['basilea-campagna', 'basilea', 'muttenz', 'liestal'],
      },
      {
        slug: 'sarnen',
        nome: "Sarnen",
        nota: "capitale del Canton Obvaldo",
        titolo: "Psicologo italiano online a Sarnen",
        desc: "Psicologo italiano online a Sarnen: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Sarnen è la capitale del Canton Obvaldo, poco più di 10.000 abitanti fra il lago che porta il suo nome e le montagne. Un cantone senza distretti, dove il comune è anche la comunità: bello, raccolto, e con pochi servizi specialistici.",
        local: "<h3>Un percorso in italiano a Sarnen e in Obvaldo</h3><p>Sarnen è la capitale del Canton Obvaldo, a 471 metri, sulle rive del lago che porta il suo nome. Il comune politico è stato istituito nel 1850, ma la storia del luogo è più lunga: fra il 1798 e il 1801 Sarnen fu capoluogo del Canton Waldstätten della Repubblica Elvetica, il cantone che univa Uri, Svitto, Untervaldo e Obvaldo. Il cantone non ha distretti — sette comuni, e basta — e Sarnen confina con Alpnach, Giswil, Kerns e Sachseln, oltre che con tre comuni lucernesi: Entlebuch, Flühli e Hasle.</p><p>Vivere qui significa una cosa molto concreta: i servizi specialistici sono pochi e si trovano a Lucerna, a mezz'ora di strada o di treno. Per chi ha già una giornata piena di lavoro e famiglia, aggiungere due trasferte a settimana per andare in studio è spesso l'ostacolo vero, più della disponibilità a parlarne.</p><p>La videochiamata lo elimina: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in paese o nei comuni del cantone, e anche se lavori a Lucerna e rientri la sera.</p>",
        faqLocal: [
          ["In Obvaldo si trova uno psicologo che parla italiano?", "I servizi specialistici sono pochi e si concentrano a Lucerna. Con il percorso online le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, senza spostarsi."],
          ["Quanto costa uno psicologo in questa zona?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['lucerna', 'hergiswil', 'baar', 'zugo'],
      },
      {
        slug: 'zugo',
        nome: "Zugo",
        nota: "capitale del Canton Zugo, sul lago",
        titolo: "Psicologo italiano online a Zugo",
        desc: "Psicologo italiano online a Zugo: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Zugo è la capitale dell'omonimo cantone, poco più di 30.000 abitanti sul lago e una delle piazze economiche più dinamiche d'Europa. Chi arriva per lavoro trova stipendi alti e una città piccola, dove però l'italiano resta una lingua di casa.",
        local: "<h3>Terapia in italiano a Zugo, fra lago e quartieri nuovi</h3><p>Zugo si trova a 425 metri, sulla sponda nord-orientale del lago di Zugo, ed è il capoluogo di uno dei cantoni più piccoli della Svizzera. Confina con Baar, Cham e Steinhausen — i tre comuni che con Zugo formano l'agglomerato urbano — con Risch, Unterägeri e Walchwil, e poi con Arth e Steinerberg, che sono già Svitto, e con Meierskappel, che è Lucerna. Poco più di 30.000 abitanti in città, ma un cantone diventato uno dei centri finanziari e commerciali più importanti d'Europa: merci, materie prime, holding, e un mercato del lavoro che attira da tutta la Svizzera e dall'estero.</p><p>Questo produce una vita particolare: contratti internazionali, trasferimenti frequenti, uffici dove si parla inglese e tedesco tutto il giorno. Molti italiani arrivano qui per un ruolo e si trovano in una città efficiente e silenziosa, dove è facile lavorare bene e difficile costruire legami, e dove il sostegno psicologico in italiano è praticamente assente.</p><p>Il percorso in videochiamata risolve entrambe le cose: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in città o nell'agglomerato, a Baar, Cham o Steinhausen, e anche se lavori su fusi orari che non coincidono con quelli svizzeri.</p>",
        faqLocal: [
          ["Vivo a Zugo e lavoro in un contesto internazionale: posso farlo in italiano?", "Sì, ed è il senso del percorso: le sedute si svolgono in italiano anche se la tua giornata si svolge in tedesco o in inglese. Non serve cambiare lingua per parlare di te."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['baar', 'zurigo', 'lucerna', 'svitto'],
      },
      {
        slug: 'winterthur',
        nome: "Winterthur",
        nota: "seconda città del Canton Zurigo, capoluogo del suo distretto",
        titolo: "Psicologo italiano online a Winterthur",
        desc: "Psicologo italiano online a Winterthur: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Winterthur è la seconda città del Canton Zurigo, quasi 110.000 abitanti e un passato industriale che ha segnato tutto: fabbriche, quartieri operai, musei. Oggi è una città di servizi e di cultura, a mezz'ora da Zurigo.",
        local: "<h3>Terapia in italiano a Winterthur, la città dell'industria</h3><p>Winterthur ha quasi 110.000 abitanti, è capoluogo del distretto omonimo e confina con quindici comuni, da Brütten a Wiesendangen, da Illnau-Effretikon a Neftenbach: un territorio vasto, a 439 metri, che si stende a nord-est di Zurigo lungo la valle della Töss. La sua identità è industriale: qui sono nate e cresciute aziende come Sulzer e Rieter, e le fabbriche hanno costruito quartieri, scuole e istituzioni. La città ha poi riconvertito quel patrimonio, e oggi conta musei e collezioni d'arte fra i più importanti del paese.</p><p>Per chi ci lavora, il presente è fatto di servizi, sanità, logistica, alta tecnologia e di un pendolarismo continuo verso Zurigo. La comunità italiana qui è storica — le fabbriche l'hanno portata negli anni Cinquanta e Sessanta — ma molto è cambiato: i figli e i nipoti parlano tedesco, e chi arriva oggi spesso arriva solo.</p><p>Il percorso in videochiamata è pensato per questo: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi passare dalla cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale per tutta la città e per i comuni del distretto, e anche se lavori a Zurigo e rientri la sera.</p>",
        faqLocal: [
          ["A Winterthur c'è una comunità italiana: serve una terapia in italiano?", "La lingua di casa non è la lingua in cui si fanno le terapie: nel cantone l'offerta in italiano resta limitata. Con questo percorso le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani."],
          ["Quanto costa uno psicologo a Winterthur?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['zurigo', 'duebendorf', 'sciaffusa', 'turgovia'],
      },
      {
        slug: 'olten',
        nome: "Olten",
        nota: "nodo ferroviario della Svizzera, nel Canton Soletta",
        titolo: "Psicologo italiano online a Olten",
        desc: "Psicologo italiano online a Olten: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Olten è il nodo ferroviario della Svizzera: qui si incrociano le linee che collegano Basilea, Zurigo, Berna e Lucerna. Poco più di 19.000 abitanti nel Canton Soletta, sull'Aar, con una stazione che è un pezzo di infrastruttura nazionale.",
        local: "<h3>Terapia in italiano a Olten, dove si incrociano tutte le linee</h3><p>Olten si trova a 396 metri, in Canton Soletta, capoluogo del distretto omonimo, lungo il fiume Aar. Il suo nome è legato alla ferrovia: nella stazione di Olten si incrociano le linee che collegano Basilea, Zurigo, Berna e Lucerna, e per generazioni questo ha significato lavoro — ferrovieri, officine, manutenzione — e una posizione che mette la città a meno di un'ora da quasi tutto l'altopiano svizzero. Confina con nove comuni, fra cui Aarburg e Rothrist, che sono Argovia, e Trimbach, Dulliken, Winznau e Starrkirch-Wil, che restano in Soletta.</p><p>È una città di pendolari per vocazione: molti abitanti escono la mattina verso Basilea, Zurigo o Berna e rientrano la sera. Una giornata così lascia poco spazio al resto, e chi ha accumulato stanchezza o ansia tende a rimandare, anche perché in una città di passaggio è facile pensare di essere solo di passaggio.</p><p>Il percorso in videochiamata si adatta al nodo: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in città o nei comuni del distretto, e anche se cambi treno due volte al giorno.</p>",
        faqLocal: [
          ["Faccio il pendolare ogni giorno: quali orari ci sono?", "Gli orari li scegli tu, anche la sera o nel fine settimana: non devi spostarti né chiedere permessi. È il motivo per cui molti pendolari scelgono la videochiamata."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['soletta', 'grenchen', 'basilea-campagna', 'baden'],
      },
      {
        slug: 'kuessnacht',
        nome: "Küssnacht",
        nota: "comune del Canton Svitto, sul lago dei Quattro Cantoni",
        titolo: "Psicologo italiano online a Küssnacht",
        desc: "Psicologo italiano online a Küssnacht: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Küssnacht sta all'estremità settentrionale del lago dei Quattro Cantoni, in Canton Svitto, e forma da sola un distretto. Quattordicimila abitanti, il Rigi sopra, la Hohle Gasse e una posizione a metà fra Lucerna e Zugo.",
        local: "<h3>Un percorso in italiano a Küssnacht, fra il Rigi e il lago</h3><p>Küssnacht è a 445 metri, all'estremità settentrionale del lago dei Quattro Cantoni, e forma da sola un distretto del Canton Svitto: circa 14.200 abitanti fra il capoluogo e le frazioni di Immensee e Merlischachen, con il monte Rigi che si alza subito dietro. I suoi confini raccontano la posizione: confina con Arth e Walchwil, che sono Svitto, e con sei comuni lucernesi — Adligenswil, Greppen, Meggen, Meierskappel, Udligenswil e Weggis. In pratica è un pezzo di Svitto incastonato nel Lucernese, con Lucerna e Zugo entrambe a pochi minuti.</p><p>Il suo nome è legato alla Hohle Gasse e alla leggenda di Guglielmo Tell, ma per chi ci vive la questione è più quotidiana: è un territorio piccolo e molto coeso, dove le famiglie si conoscono da generazioni e i servizi specialistici sono pochi. Chi ha bisogno di uno psicologo, nella migliore delle ipotesi lo trova a Lucerna o a Svitto; nella peggiore scopre che in paese ci si conosce tutti.</p><p>La videochiamata risolve entrambe: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Küssnacht, a Immensee o a Merlischachen, e anche nei comuni vicini di Greppen, Weggis, Meggen e Walchwil.</p>",
        faqLocal: [
          ["In un distretto così piccolo si rischia di incontrarsi?", "È un timore reale in una comunità di quattordicimila persone: nella terapia online il terapeuta non vive nel tuo distretto e non incrocia la tua cerchia."],
          ["Quanto costa uno psicologo fra Svitto e Lucerna?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['zugo', 'lucerna', 'svitto', 'baar'],
      },
    ] },
  { slug: 'belgio', nome: 'Belgio', bandiera: '🇧🇪', zoneNota: "<h2>Bruxelles non è una città: è un quartiere</h2><p>La comunità italiana di Bruxelles vive concentrata in una manciata di zone — il Quartiere Europeo, Ixelles, Etterbeek — dove lavora chi è arrivato per la Commissione, il Parlamento, il Consiglio o la NATO. Il risultato è che molti italiani conoscono Bruxelles benissimo e il Belgio quasi per niente.</p><p>Il paese è diviso in tre comunità linguistiche — francese, olandese e tedesca — e non è un dettaglio amministrativo: cambia la lingua della scuola, il mercato del lavoro, perfino il modo in cui si viene accolti. Chi si sposta da Bruxelles a Gand o ad Anversa scopre di dover ricominciare da capo, linguisticamente e socialmente.</p><h2>La navetta che non si vede</h2><p>Una parte della comunità lavora in Lussemburgo e dorme in Belgio, o il contrario. Il treno Bruxelles-Lussemburgo è un'istituzione: oltre tre ore tra andata e ritorno, ogni giorno, spesso in silenzio. È un pendolarismo che si regge per anni e che consuma molto più di quanto si ammetta.</p><h2>Il rimborso delle sedute</h2><p>In Belgio l'assistenza sanitaria passa dalle mutuelles — in olandese ziekenfonds — e le regole sul rimborso delle sedute psicologiche sono cambiate più volte negli ultimi anni. Prima di iniziare conviene chiedere alla propria mutuelle quali sedute copre, se serve la prescrizione del medico di base e se le sedute a distanza rientrano nelle stesse condizioni di quelle in studio.</p><p>Le sedute di Adatto x Te si svolgono in videochiamata, in italiano. Il Belgio è nello stesso fuso orario dell'Italia, quindi gli orari si incastrano senza calcoli — anche dopo una giornata di navetta.</p>", capitale: { slug: 'bruxelles', nome: 'Bruxelles', nota: 'capitale europea, sede delle istituzioni UE con molti italiani' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'Il Belgio ha una comunità italiana storica, rafforzata dalla presenza delle istituzioni europee', citta: ['Bruxelles', 'Anversa', 'Liegi', 'Gand', 'Charleroi'] },
  { slug: 'spagna', nome: 'Spagna', bandiera: '🇪🇸', capitale: { slug: 'madrid', nome: 'Madrid', nota: 'capitale con una comunità italiana in forte crescita' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La comunità italiana in Spagna è in forte crescita, soprattutto tra i giovani', citta: ['Madrid', 'Barcellona', 'Valencia', 'Siviglia', 'Malaga', 'Alicante', 'Palma di Maiorca', 'Bilbao'] },
  { slug: 'paesi-bassi', nome: 'Paesi Bassi', bandiera: '🇳🇱', capitale: { slug: 'amsterdam', nome: 'Amsterdam', nota: 'capitale dinamica con molti italiani nel tech e nel design' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La comunità italiana nei Paesi Bassi è giovane e in crescita, legata a lavoro e studio', citta: ['Amsterdam', 'Rotterdam', 'L\'Aia', 'Utrecht', 'Eindhoven'] },
  { slug: 'irlanda', nome: 'Irlanda', bandiera: '🇮🇪', capitale: { slug: 'dublino', nome: 'Dublino', nota: 'hub tecnologico europeo con una grande presenza italiana' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'L\'Irlanda ha una comunità italiana giovane, legata all\'hub tech di Dublino', citta: ['Dublino', 'Cork', 'Galway', 'Limerick'] },
  { slug: 'austria', nome: 'Austria', bandiera: '🇦🇹', capitale: { slug: 'vienna', nome: 'Vienna', nota: 'capitale con stretti legami storici con l\'Italia' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'L\'Austria ha stretti legami storici e culturali con l\'Italia', zoneNota: "<h2>Vivere in Austria da italiani: le città, la lingua, la distanza</h2><p>L'Austria è a poche ore dall'Italia e per molti è una scelta quasi naturale: montagne, stagioni, un'economia solida. Ma la lingua cambia tutto. Il tedesco austriaco ha parole e cadenze che non si imparano sui manuali — e quando si parla di come ci si sente, la lingua in cui si riesce davvero a dire le cose difficili è quasi sempre l'italiano.</p><p>Le presenze italiane più visibili sono a Vienna, dove lavorano ricercatori, professionisti e personale di organizzazioni internazionali; a Graz, città universitaria a poche ore dal confine; a Linz e Salisburgo, tra industria e turismo; e a Innsbruck, che è di fatto la porta del Tirolo verso l'Italia e dove l'italiano si sente in strada tutto l'anno.</p><p>C'è poi una fascia diversa: chi lavora nella stagione turistica — hotel, ristoranti, impianti — e alterna mesi in Austria a mesi a casa. Per queste persone la terapia online ha un vantaggio pratico enorme: non serve essere nella stessa città per tutto il percorso. Si può iniziare a Innsbruck e continuare da casa in Italia a fine stagione, senza cambiare terapeuta.</p><p>Il fuso è una buona notizia: l'Austria è nello stesso orario dell'Italia, quindi non ci sono orari strani da calcolare. Una seduta alle 19 in Austria è alle 19 anche a Milano. Le sedute durano 50 minuti, si fanno in videochiamata dal browser — senza installare nulla — e si pagano come in Italia.</p><p>Un'ultima cosa che riguarda l'Austria più di altri paesi: la vicinanza rende facile rimandare. Molti dicono «tanto quando torno in Italia ci penso». Conviene invece iniziare mentre si è ancora lì: la lingua, le abitudini e le difficoltà di quel periodo sono proprio il materiale del lavoro.</p>", citta: ['Vienna', 'Innsbruck', 'Graz', 'Salisburgo', 'Linz'] },
  { slug: 'lussemburgo', nome: 'Lussemburgo', bandiera: '🇱🇺', zoneNota: "<h2>Perché quasi tutti quelli che incontri vengono da altrove</h2><p>Il Lussemburgo ha una popolazione che, per metà, è nata fuori dal paese. Il motivo è presto detto: sulla collina di Kirchberg hanno sede la Corte di Giustizia dell'Unione Europea, la Banca Europea per gli Investimenti, la Corte dei Conti e il segretariato del Parlamento europeo, mentre in città lavora la macchina dei fondi e della finanza privata. Sono ambienti piccoli e molto intrecciati: ci si ritrova alle stesse cene, negli stessi palazzi, sulle stesse linee del tram.</p><p>Questo produce un effetto che sorprende molti italiani: si è circondati di persone nella propria stessa situazione, eppure legare davvero risulta difficile. Gli espatriati vanno e vengono, i contratti durano due o tre anni, e costruire rapporti che restino richiede più tempo di quanto si pensasse.</p><h2>La lingua: la distanza che non ti aspetti</h2><p>Il francese è la lingua dell'amministrazione, il tedesco quella della carta stampata, l'inglese quella in cui si lavora. Ma la lingua in cui si scherza davvero, nei bar e tra vicini, è il lussemburghese — e non si impara sui manuali. Restare fuori dalla conversazione quotidiana è una fatica silenziosa, ed è una delle cose di cui si finisce più spesso per parlare in terapia.</p><h2>Chi dorme oltre il confine</h2><p>Una parte consistente di chi lavora in Lussemburgo non ci abita: attraversa il confine ogni giorno da Thionville, da Arlon, da Metz o da Treviri. Due ore di strada al giorno cambiano il tono di una settimana. In questi casi la terapia in videochiamata ha un vantaggio pratico: non serve trovarsi in una città precisa per cominciare, e il percorso non si interrompe se ti trasferisci dall'altra parte del confine.</p><h2>Il rimborso delle sedute</h2><p>Una cosa da chiarire prima di cominciare: il rimborso delle sedute psicologiche dipende dalla tua cassa malattia e dalle regole del paese. In genere serve una prescrizione del medico di base, i percorsi sono organizzati a blocchi di sedute, e le sedute a distanza non sempre rientrano nelle stesse condizioni di quelle in studio. È una telefonata che vale la pena fare prima, per non scoprire dopo tre mesi che non ti rimborsano.</p><p>Le sedute di Adatto x Te si svolgono in videochiamata, in italiano, e il Lussemburgo è nello stesso fuso orario dell'Italia: una seduta alle 19 è alle 19, senza orari da ricalcolare.</p>", capitale: { slug: 'lussemburgo', nome: 'Lussemburgo', nota: 'la capitale con la più alta concentrazione di italiani pro capite' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'Il Lussemburgo ha un\'altissima concentrazione di italiani, tra finanza e istituzioni europee', citta: ['Lussemburgo', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Pétange'] },
  { slug: 'portogallo', nome: 'Portogallo', bandiera: '🇵🇹', capitale: { slug: 'lisbona', nome: 'Lisbona', nota: 'capitale che attrae sempre più italiani e digital nomad' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La comunità italiana in Portogallo è in crescita, anche tra i nomadi digitali', citta: ['Lisbona', 'Porto', 'Faro', 'Cascais', 'Braga', 'Coimbra'] },
  { slug: 'australia', nome: 'Australia', bandiera: '🇦🇺', capitale: { slug: 'canberra', nome: 'Canberra', nota: 'capitale amministrativa con comunità italiana presente' }, regione: 'Oceania', fuso: 'da +8 a +10 ore rispetto all\'Italia', comunita: 'La comunità italiana in Australia è storica e organizzata, con forti presenze a Melbourne e Sydney', citta: ['Melbourne', 'Sydney', 'Adelaide', 'Perth', 'Brisbane', 'Gold Coast', 'Canberra', 'Newcastle'] },
  { slug: 'argentina', nome: 'Argentina', bandiera: '🇦🇷', capitale: { slug: 'buenos-aires', nome: 'Buenos Aires', nota: 'capitale con una delle più grandi discendenze italiane' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'L\'Argentina ha una fortissima discendenza italiana e legami culturali profondi', citta: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'Santa Fe', 'Tucumán'] },
  { slug: 'brasile', nome: 'Brasile', bandiera: '🇧🇷', capitale: { slug: 'brasilia', nome: 'Brasilia', nota: 'capitale moderna con comunità italiana presente' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'Il Brasile ha la più grande discendenza italiana fuori dall\'Italia', citta: ['San Paolo', 'Rio de Janeiro', 'Curitiba', 'Porto Alegre', 'Belo Horizonte', 'Florianópolis', 'Campinas', 'Brasilia'] },
  { slug: 'uruguay', nome: 'Uruguay', bandiera: '🇺🇾', capitale: { slug: 'montevideo', nome: 'Montevideo', nota: 'capitale con una fortissima componente di origine italiana' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'L\'Uruguay ha una delle discendenze italiane più alte al mondo', citta: ['Montevideo', 'Salto', 'Paysandú', 'Punta del Este', 'Colonia del Sacramento', 'Rivera'] },
  { slug: 'venezuela', nome: 'Venezuela', bandiera: '🇻🇪', capitale: { slug: 'caracas', nome: 'Caracas', nota: 'capitale con una comunità italiana storica', intro: "Da Caracas la terapia in italiano ha un senso che va oltre la comodità. La comunità italiana qui non è recente: è arrivata generazioni fa, e molte famiglie parlano italiano in casa anche quando i figli sono nati in Venezuela. Per loro la lingua della terapia — quella in cui si riesce davvero a dire le cose difficili — è l'italiano. Le sedute si tengono in videochiamata dal browser, senza installare nulla e senza spostarsi. L'unica accortezza è il fuso: Caracas è da 5 a 6 ore indietro rispetto all'Italia, quindi le sedute si fissano nel pomeriggio o nella sera venezuelana, così coincidono con la sera italiana. Vale anche per chi nel frattempo si è trasferito altrove: il percorso continua con lo stesso professionista, senza ricominciare da capo." }, regione: 'Sud America', fuso: 'da -5 a -6 ore rispetto all\'Italia', comunita: 'Il Venezuela ha una comunità italiana storica e radicata', citta: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Mérida'] },
  { slug: 'cile', nome: 'Cile', bandiera: '🇨🇱', capitale: { slug: 'santiago', nome: 'Santiago', nota: 'capitale con una comunità italiana consolidata' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'Il Cile ha una comunità italiana consolidata, con legami culturali forti', citta: ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'Antofagasta', 'La Serena'] },
  { slug: 'messico', nome: 'Messico', bandiera: '🇲🇽', capitale: { slug: 'citta-del-messico', nome: 'Città del Messico', nota: 'capitale con una comunità italiana in crescita' }, regione: 'Nord America', fuso: 'da -7 a -8 ore rispetto all\'Italia', comunita: 'La comunità italiana in Messico è in crescita, tra aziende e istituzioni', citta: ['Città del Messico', 'Guadalajara', 'Monterrey', 'Puebla', 'Querétaro', 'Cancún'] },
  { slug: 'emirati-arabi', nome: 'Emirati Arabi', bandiera: '🇦🇪', capitale: { slug: 'abu-dhabi', nome: 'Abu Dhabi', nota: 'capitale con molti professionisti italiani in azienda' }, regione: 'Medio Oriente', fuso: '+2 ore rispetto all\'Italia', comunita: 'Gli Emirati Arabi contano molti professionisti italiani in finanza, energia e costruzioni', citta: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman'] },
  { slug: 'singapore', nome: 'Singapore', bandiera: '🇸🇬', capitale: { slug: 'singapore', nome: 'Singapore', nota: 'città-stato, hub finanziario asiatico con italiani in carriera' }, regione: 'Asia', fuso: '+6 ore rispetto all\'Italia', comunita: 'Singapore ospita una comunità di professionisti italiani in finanza e tech', citta: ['Singapore'] },
  { slug: 'cina', nome: 'Cina', bandiera: '🇨🇳', capitale: { slug: 'pechino', nome: 'Pechino', nota: 'capitale con una presenza italiana tra istituzioni e imprese' }, regione: 'Asia', fuso: '+7 ore rispetto all\'Italia', comunita: 'La Cina ha una presenza italiana tra Pechino e Shanghai, soprattutto per lavoro', citta: ['Shanghai', 'Pechino', 'Hong Kong', 'Canton', 'Shenzhen', 'Suzhou', 'Hangzhou'] },
  { slug: 'giappone', nome: 'Giappone', bandiera: '🇯🇵', capitale: { slug: 'tokyo', nome: 'Tokyo', nota: 'capitale con una piccola ma attiva comunità italiana' }, regione: 'Asia', fuso: '+8 ore rispetto all\'Italia', comunita: 'Il Giappone ha una comunità italiana piccola ma attiva, tra moda, design e aziende', citta: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'] },
  { slug: 'sudafrica', nome: 'Sudafrica', bandiera: '🇿🇦', capitale: { slug: 'pretoria', nome: 'Pretoria', nota: 'capitale amministrativa con comunità italiana storica' }, regione: 'Africa', fuso: 'da 0 a +1 ora rispetto all\'Italia', comunita: 'Il Sudafrica ha una comunità italiana storica, con presenze a Johannesburg e Città del Capo', citta: ['Johannesburg', 'Città del Capo', 'Durban', 'Pretoria', 'Port Elizabeth'] },
  { slug: 'nuova-zelanda', nome: 'Nuova Zelanda', bandiera: '🇳🇿', capitale: { slug: 'wellington', nome: 'Wellington', nota: 'capitale con una comunità italiana piccola ma attiva' }, regione: 'Oceania', fuso: 'da +10 a +12 ore rispetto all\'Italia', comunita: 'La Nuova Zelanda ha una comunità italiana storica e in crescita, legata a studio e lavoro', citta: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Queenstown'] },
  { slug: 'malta', nome: 'Malta', bandiera: '🇲🇹', capitale: { slug: 'la-valletta', nome: 'La Valletta', nota: 'capitale con moltissimi italiani residenti' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'Malta conta moltissimi italiani tra studio, lavoro e impresa', citta: ['La Valletta', 'Sliema', 'St Julian\'s', 'Birkirkara', 'Mosta', 'Qormi'] },
  { slug: 'svezia', nome: 'Svezia', bandiera: '🇸🇪', capitale: { slug: 'stoccolma', nome: 'Stoccolma', nota: 'capitale scandinava con una comunità italiana in crescita' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La comunità italiana in Svezia è in crescita, tra lavoro e studio', citta: ['Stoccolma', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås', 'Linköping'] },
  { slug: 'danimarca', nome: 'Danimarca', bandiera: '🇩🇰', capitale: { slug: 'copenaghen', nome: 'Copenaghen', nota: 'capitale con una comunità italiana giovane' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Danimarca ha una comunità italiana giovane, legata a università e aziende', citta: ['Copenaghen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'] },
  { slug: 'norvegia', nome: 'Norvegia', bandiera: '🇳🇴', capitale: { slug: 'oslo', nome: 'Oslo', nota: 'capitale con italiani presenti in vari settori' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Norvegia ha una comunità italiana legata a lavoro, ricerca e settore marittimo', citta: ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Tromsø'] },
  { slug: 'finlandia', nome: 'Finlandia', bandiera: '🇫🇮', capitale: { slug: 'helsinki', nome: 'Helsinki', nota: 'capitale nordica con una piccola comunità italiana' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Finlandia ha una comunità italiana piccola ma attiva tra design e tecnologia', citta: ['Helsinki', 'Espoo', 'Tampere', 'Turku', 'Oulu'] },
  { slug: 'polonia', nome: 'Polonia', bandiera: '🇵🇱', capitale: { slug: 'varsavia', nome: 'Varsavia', nota: 'capitale con professionisti italiani in crescita' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Polonia vede crescere i professionisti italiani, tra aziende e istituzioni', citta: ['Varsavia', 'Cracovia', 'Danzica', 'Breslavia', 'Poznań', 'Łódź', 'Katowice'] },
  { slug: 'romania', nome: 'Romania', bandiera: '🇷🇴', capitale: { slug: 'bucarest', nome: 'Bucarest', nota: 'capitale con una comunità imprenditoriale italiana' }, regione: 'Europa', fuso: '1 ora in più rispetto all\'Italia', comunita: 'La Romania ha una comunità imprenditoriale italiana molto presente', citta: ['Bucarest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Costanza', 'Brașov', 'Sibiu', 'Oradea'] },
  { slug: 'ungheria', nome: 'Ungheria', bandiera: '🇭🇺', capitale: { slug: 'budapest', nome: 'Budapest', nota: 'capitale con una comunità italiana attiva' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'L\'Ungheria ha una comunità italiana attiva tra aziende e università', citta: ['Budapest', 'Seghedino', 'Debrecen', 'Pécs', 'Győr', 'Miskolc'] },
  { slug: 'repubblica-ceca', nome: 'Repubblica Ceca', bandiera: '🇨🇿', capitale: { slug: 'praga', nome: 'Praga', nota: 'capitale che attrae molti italiani per lavoro' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Repubblica Ceca vede crescere gli italiani, tra aziende e studio', citta: ['Praga', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc'] },
  { slug: 'grecia', nome: 'Grecia', bandiera: '🇬🇷', capitale: { slug: 'atene', nome: 'Atene', nota: 'capitale con legami storici con l\'Italia' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Grecia ha una comunità italiana storica e una presenza imprenditoriale', citta: ['Atene', 'Salonicco', 'Patrasso', 'Candia', 'Larissa', 'Corfù', 'Volos'] },
  { slug: 'croazia', nome: 'Croazia', bandiera: '🇭🇷', capitale: { slug: 'zagabria', nome: 'Zagabria', nota: 'capitale vicina all\'Italia, con comunità italiana presente' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Croazia è vicina di casa: la presenza italiana è diffusa lungo la costa', citta: ['Zagabria', 'Fiume', 'Spalato', 'Pola', 'Zara', 'Ragusa'] },
  { slug: 'slovenia', nome: 'Slovenia', bandiera: '🇸🇮', capitale: { slug: 'lubiana', nome: 'Lubiana', nota: 'capitale al confine con l\'Italia' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Slovenia confina direttamente con l\'Italia: molti italiani la scelgono per lavoro e famiglia', citta: ['Lubiana', 'Maribor', 'Capodistria', 'Pirano', 'Nova Gorica', 'Isola', 'Celje'] },
  { slug: 'israele', nome: 'Israele', bandiera: '🇮🇱', capitale: { slug: 'gerusalemme', nome: 'Gerusalemme', nota: 'capitale con una presenza italiana tra istituzioni e aziende' }, regione: 'Medio Oriente', fuso: '1 ora in più rispetto all\'Italia', comunita: 'Israele ha una presenza italiana tra tecnologia e istituzioni', citta: ['Tel Aviv', 'Gerusalemme', 'Haifa', 'Netanya'] },
  { slug: 'qatar', nome: 'Qatar', bandiera: '🇶🇦', zoneNota: "<h2>Vivere a Doha: quando è il clima a dettare l'agenda</h2><p>Da maggio a settembre la vita si svolge al chiuso. Non è un modo di dire: si esce la mattina presto o dopo il tramonto, e per mesi l'aria condizionata è la vera infrastruttura della giornata. Cambia il rapporto con lo sport, con gli spostamenti, con il tempo libero — e per molti è la parte più difficile da spiegare a chi è rimasto in Italia.</p><p>Anche il calendario è diverso: il fine settimana è venerdì e sabato, e la settimana lavorativa scivola di un giorno rispetto a quella europea. Chi lavora con l'Italia vive spesso su due calendari contemporaneamente.</p><h2>Una comunità che ruota intorno al lavoro</h2><p>Gli italiani in Qatar sono legati in gran parte alle imprese, alle grandi opere e agli eventi internazionali, oltre che al mondo dell'università: Education City ospita i campus di diverse università americane ed europee. È una comunità che si rinnova in fretta, fatta di contratti a scadenza e partenze improvvise: poche persone restano abbastanza a lungo da mettere radici, e questo si sente.</p><h2>Il rimborso delle sedute</h2><p>In Qatar la copertura sanitaria è in genere legata all'assicurazione prevista dal contratto di lavoro, e i piani internazionali trattano la salute mentale in modi molto diversi tra loro: alcuni rimborsano le sedute, altri no, altri solo se autorizzate in anticipo. Vale la pena chiederlo all'ufficio del personale o alla propria assicurazione prima di cominciare.</p><p>Le sedute di Adatto x Te si svolgono in videochiamata, in italiano. Il fuso è spostato in avanti rispetto all'Italia, quindi si trovano facilmente orari nella tarda serata locale che corrispondono alla sera italiana.</p>", capitale: { slug: 'doha', nome: 'Doha', nota: 'capitale con molti professionisti italiani' }, regione: 'Medio Oriente', fuso: '+2 ore rispetto all\'Italia', comunita: 'Il Qatar conta professionisti italiani in energia, costruzioni e ospitalità', citta: ['Doha', 'Lusail', 'Al Rayyan', 'Al Wakrah', 'Al Khor'] },
  { slug: 'corea-del-sud', nome: 'Corea del Sud', bandiera: '🇰🇷', capitale: { slug: 'seul', nome: 'Seul', nota: 'capitale con presenza italiana tra moda e tecnologia' }, regione: 'Asia', fuso: '+8 ore rispetto all\'Italia', comunita: 'La Corea del Sud ha una presenza italiana tra moda, design e tecnologia', citta: ['Seul', 'Busan', 'Incheon', 'Daejeon', 'Daegu'] },
  { slug: 'india', nome: 'India', bandiera: '🇮🇳', capitale: { slug: 'nuova-delhi', nome: 'Nuova Delhi', nota: 'capitale con italiani tra aziende e istituzioni' }, regione: 'Asia', fuso: '+4 ore e 30 minuti rispetto all\'Italia', comunita: 'L\'India conta professionisti italiani tra aziende, commercio e istituzioni', citta: ['Nuova Delhi', 'Mumbai', 'Bangalore', 'Calcutta', 'Chennai', 'Hyderabad', 'Pune'] },
  { slug: 'thailandia', nome: 'Thailandia', bandiera: '🇹🇭', capitale: { slug: 'bangkok', nome: 'Bangkok', nota: 'capitale con italiani residenti e imprenditori' }, regione: 'Asia', fuso: '+6 ore rispetto all\'Italia', comunita: 'La Thailandia ospita italiani residenti, imprenditori e pensionati', citta: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hua Hin', 'Ko Samui'] },
];

// --- Estensioni ---------------------------------------------------------
// I file paesi-estesi-*.js contengono SOLO i campi riscritti. Il merge è per campo:
// quello che non è nell'estensione resta quello originale, così un campo
// dimenticato non fa sparire un pezzo della pagina.
const paesiEstesi = [
  ...paesiEstesi1,
  ...paesiEstesi2,
  ...paesiEstesi3,
  ...paesiEstesi4,
  ...paesiEstesi5,
  ...paesiZone,
];

const paesiPerSlug = new Map(paesiBase.map((x) => [x.slug, x]));
for (const o of paesiEstesi) {
  const base = paesiPerSlug.get(o.slug);
  paesiPerSlug.set(o.slug, base ? { ...base, ...o } : o);
}

export const paesi = [...paesiPerSlug.values()];
