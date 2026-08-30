/**
 * Seed dati per la piattaforma Adatto x Te.
 * Crea: 1 admin, 1 paziente demo.
 * In produzione (NODE_ENV=production) NON crea terapeuti fittizi né recensioni
 * demo: il catalogo e le recensioni devono essere reali.
 * Per i dati demo (5 terapeuti fittizi + 500 recensioni) in ambiente di sviluppo:
 * - default: solo se NODE_ENV non è production (locale)
 * - oppure esplicitamente con SEED_DEMO_DATA=1
 *
 * Avvio: npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db, initDb } = require('./db');

const THERAPISTS = [
  {
    name: 'Dott.ssa Elena Bianchi',
    email: 'elena.bianchi@adattoxte.it',
    password: 'Terapeuta1!',
    bio: 'Psicologa dello sport, lavoro con atleti professionisti e dilettanti per gestire pressione, ansia da prestazione e motivazione.',
    specialties: ['psicologia dello sport'],
    license: 'A-12345',
    experienceYears: 9,
    languages: ['it', 'en'],
    verified: true,
  },
  {
    name: 'Dott. Marco Russo',
    email: 'marco.russo@adattoxte.it',
    password: 'Terapeuta2!',
    bio: 'Preparazione mentale ai concorsi pubblici e alle prove selettive per le forze dell\'ordine: gestione dello stress, memoria e concentrazione.',
    specialties: ['preparazione concorsi pubblici'],
    license: 'B-23456',
    experienceYears: 7,
    languages: ['it'],
    verified: true,
  },
  {
    name: 'Dott.ssa Giulia Conti',
    email: 'giulia.conti@adattoxte.it',
    password: 'Terapeuta3!',
    bio: 'Psicologa giuridica: supporto in ambito forense, consulenze per professionisti legali e gestione delle dinamiche relazionali complesse.',
    specialties: ['psicologia giuridica'],
    license: 'C-34567',
    experienceYears: 11,
    languages: ['it', 'fr'],
    verified: true,
  },
  {
    name: 'Dott. Luca Ferrari',
    email: 'luca.ferrari@adattoxte.it',
    password: 'Terapeuta4!',
    bio: 'Terapia di coppia online: comunicazione, crisi di relazione, supporto alle decisioni. Sedute anche per due persone da remoto.',
    specialties: ['terapia di coppia'],
    license: 'D-45678',
    experienceYears: 12,
    languages: ['it'],
    verified: true,
  },
  {
    name: 'Dott.ssa Sara Greco',
    email: 'sara.greco@adattoxte.it',
    password: 'Terapeuta5!',
    bio: 'Ansia e depressione: percorsi di psicoterapia individuale per adulti tra i 15 e i 50 anni, con approccio cognitivo-comportamentale.',
    specialties: ['ansia e depressione'],
    license: 'E-56789',
    experienceYears: 6,
    languages: ['it', 'en', 'es'],
    verified: true,
  },
];

function hash(pw) {
  return bcrypt.hashSync(pw, 10);
}

// ---- Recensioni demo (500+) ------------------------------------------------
// Genera prenotazioni completate + valutazioni con ID deterministici, così il
// seed è idempotente: rieseguirlo non crea duplicati (INSERT OR IGNORE).
// Le recensioni sono DATI DEMO da sostituire con quelle reali dei pazienti.

const PATIENT_NAMES = [
  'Giulia Romano', 'Matteo Esposito', 'Chiara Colombo', 'Davide Ricci', 'Martina De Luca',
  'Alessandro Marino', 'Francesca Greco', 'Luca Barbieri', 'Sara Moretti', 'Andrea Conti',
  'Elena Fontana', 'Stefano Gallo', 'Alice Costa', 'Federico Rizzo', 'Giorgia Lombardi',
  'Simone Mancini', 'Valentina Bruno', 'Paolo Caruso', 'Camilla Bianchi', 'Davide Farina',
  'Roberta Sala', 'Marco Leone', 'Ilaria Serra', 'Tommaso Villa', 'Arianna Parisi',
];

const REVIEWS_5 = [
  'Seduta molto utile, mi sono sentito/a subito a mio agio. Consigliatissima!',
  'Professionista empatico e preparato. Ho già prenotato la prossima seduta.',
  'Esperienza positiva fin dal primo colloquio: mi ha aiutato a vedere le cose con più chiarezza.',
  'Puntuale, disponibile e davvero competente. Un percorso che consiglio a tutti.',
  'Mi ha aiutato a gestire l\u2019ansia con tecniche concrete e applicabili subito.',
  'Finalmente qualcuno che ascolta davvero, senza giudizio. Straordinario.',
  'La videochiamata funziona benissimo e la seduta è rilassante. Ottima piattaforma.',
  'Ha capito subito il mio problema e mi ha dato strumenti pratici. Molto soddisfatto/a.',
  'Un professionista eccezionale: si percepisce la preparazione e la passione.',
  'Percorso ben strutturato, obiettivi chiari e tanta empatia. Grazie di cuore.',
  'Ho superato una fase difficile grazie al suo supporto. Cinque stelle meritate.',
  'Seduta comodissima da casa, senza perdere tempo in spostamenti. La consiglio.',
  'Ottimo ascolto e consigli pratici per la gestione dello stress lavorativo.',
  'Mi sento capita e seguita nel mio percorso. Professionalità e umanità insieme.',
  'Dopo poche sedute ho già notato miglioramenti concreti nella mia quotidianità.',
  'Spiegazioni chiare, mai giudicante, sempre presente. Un vero punto di riferimento.',
  'La migliore esperienza di terapia online che abbia mai fatto.',
  'Mi ha aiutato a ritrovare fiducia in me stesso/a. Non posso che ringraziare.',
  'Terapeuta molto attento ai dettagli e alle emozioni. Esperienza profonda.',
  'Approccio concreto e senza fronzoli: si lavora davvero sui problemi.',
  'Disponibilità e flessibilità negli orari, perfetto per chi lavora.',
  'Ho consigliato questa piattaforma a due amici, è davvero un servizio valido.',
  'Seduta profonda e costruttiva. Mi ha dato molto da riflettere e da portare avanti.',
  'La prima seduta è stata già illuminante: mi ha mostrato strade che non vedevo.',
  'Gentilezza, professionalità e un metodo chiaro. Esperienza più che positiva.',
  'Mi ha aiutato a gestire la pressione prima di un esame importante. Super consigliato.',
  'Un percorso che mi ha cambiato il modo di vedere le mie difficoltà.',
  'Mi sento più leggera e più consapevole dopo ogni seduta. Grazie.',
  'Professionalità rara: si vede l\u2019esperienza e la formazione continua.',
  'Ogni seduta è un passo avanti. Piattaforma semplice e terapeuti eccellenti.',
  'Ha saputo creare un clima di fiducia fin da subito. Molto, molto bravo/a.',
  'Puntualità e preparazione. Ho trovato esattamente quello che cercavo.',
  'Un supporto prezioso in un momento delicato della mia vita. Non lo dimenticherò.',
  'Terapia di coppia che ha salvato la nostra relazione. Grazie infinite.',
  'Comunicazione chiara e un metodo che funziona. La consiglio senza riserve.',
  'Mi ha aiutato a prepararmi mentalmente al concorso: l\u2019ho passato!',
  'Anche da remoto si crea un rapporto autentico. Esperienza sorprendente.',
  'Esperienza, empatia e tanta disponibilità: tutto quello che serve.',
  'Ho ritrovato il sonno e la serenità. Un grazie sincero al mio terapeuta.',
  'Percorso personalizzato e attento alle mie esigenze specifiche. Eccellente.',
  'Consigli pratici, esercizi utili e un supporto costante. Davvero efficace.',
  'Mi ha aiutato a gestire l\u2019ansia da prestazione sportiva. Risultati concreti.',
  'Ho apprezzato moltissimo la chiarezza del percorso e degli obiettivi.',
  'Un professionista con cui ho instaurato un rapporto di fiducia immediato.',
  'La flessibilità della piattaforma mi ha permesso di continuare la terapia in viaggio.',
  'Mi ha aiutato a comunicare meglio con il mio partner. Grazie di cuore.',
  'Sedute sempre puntuali e mai affrettate: si prende il tempo necessario.',
  'Ho trovato la terapeuta giusta al primo colpo grazie al matching. Perfetto.',
  'Un approccio scientifico ma umano: la combinazione ideale.',
  'Mi ha dato gli strumenti per affrontare la mia ansia in autonomia.',
  'Ogni seduta mi lascia qualcosa di concreto da applicare. Molto valido.',
  'Persona squisita e professionale. Esperienza davvero positiva.',
  'Mi ha aiutato a superare il lutto con delicatezza e professionalità.',
  'La terapia online è comodissima e questo team è di altissimo livello.',
  'Ho notato la differenza già dalle prime sedute. Consigliatissimo.',
  'Un percorso di crescita personale che consiglio a chiunque.',
  'Attenzione, cura e competenza: tutto quello che cerchi in un terapeuta.',
  'Mi ha aiutato a ritrovare motivazione dopo il burnout. GRAZIE.',
  'Semplicemente il miglior servizio di psicologia online provato finora.',
  'Ha capito il mio bisogno prima ancora che lo spiegassi. Incredibile.',
  'Professionalità impeccabile e grande umanità. Esperienza che ripeto.',
  'La mia terapeuta è stata fondamentale in un momento di grande fragilità.',
  'Metodo chiaro, obiettivi condivisi e risultati visibili. Eccellente.',
  'Mi sento ascoltata e mai giudicata. Un porto sicuro.',
  'Ho iniziato per curiosità e ho trovato un percorso serio ed efficace.',
  'Puntuale, preparato e con una marcia in più nell\u2019empatia.',
  'La consiglierei a chiunque abbia bisogno di un supporto vero.',
  'Seduta online di qualità pari a quella in studio, anzi più comoda.',
  'Mi ha aiutato a gestire le dinamiche familiari con più serenità.',
  'Un grazie enorme: mi avete restituito la voglia di ricominciare.',
];

const REVIEWS_4 = [
  'Molto professionale, ho apprezzato l\u2019ascolto e i consigli pratici.',
  'Bravo/a e disponibile, piattaforma semplice da usare.',
  'Seduta valida, forse la prima volta ero un po\u2019 in imbarazzo ma è normale.',
  'Buona esperienza complessiva, consiglio di provare.',
  'Professionista competente, mi aspettavo solo tempi un po\u2019 diversi per vedere i risultati.',
  'Ottimo rapporto qualità-prezzo, videochiamata fluida.',
  'Terapeuta gentile e attento. Ottimo servizio.',
  'Molto soddisfatto/a del percorso, consiglio la piattaforma.',
  'Esperienza positiva, la consiglierei a chi cerca supporto online.',
  'Buon ascolto e disponibilità. Servizio serio.',
  'Mi ha dato spunti interessanti, proseguirò il percorso.',
  'Competenza e chiarezza, anche se all\u2019inizio ero scettico/a sul formato online.',
  'Bravo/a, puntuale e preparato/a. Piccoli margini di miglioramento nella piattaforma.',
  'Valutazione molto buona, terapeuta di alto livello.',
  'Ho apprezzato la flessibilità degli orari e la gentilezza.',
  'Seduta utile e ben gestita. Mi sento in buone mani.',
  'Professionista serio/a, percorso coerente con le mie esigenze.',
  'Buona esperienza, tempi di attesa per la risposta ai messaggi un po\u2019 lunghi.',
  'Consigliato: aiuta davvero a chiarire i propri pensieri.',
  'Esperienza complessivamente positiva, tornerò.',
  'Terapeuta disponibile e preparato. La piattaforma è intuitiva.',
  'Servizio valido e prezzi onesti. Lo consiglio.',
];

const REVIEWS_3 = [
  'Esperienza discreta: terapeuta gentile ma avrei preferito più concretezza.',
  'Professionista corretto, ma il mio percorso è appena iniziato.',
  'Seduta ok, la piattaforma funziona bene. Vediamo come prosegue.',
  'Servizio onesto, sto ancora valutando se fa per me.',
  'Terapeuta preparato ma non ho ancora visto risultati concreti.',
  'Buona la prima impressione, giudico dopo qualche seduta in più.',
  'Corretto ma non eccezionale per le mie esigenze.',
  'Mi aspettavo un approccio leggermente diverso, comunque professionale.',
];

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 19).replace('T', ' ');
}

function seedReviews() {
  const therapistRows = db.prepare("SELECT id, email FROM users WHERE role = 'therapist' ORDER BY email").all();
  const patientStmt = db.prepare(
    'INSERT OR IGNORE INTO users (id, name, email, password_hash, role, bio, consent_to_tos, consent_date, referral_code) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)'
  );
  const bookingStmt = db.prepare(
    "INSERT OR IGNORE INTO bookings (id, patient_id, therapist_id, availability_id, date, start_time, end_time, type, price, credit_used, status, paid, room_name, created_at) VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, 0, 'completed', 1, ?, ?)"
  );
  const ratingStmt = db.prepare(
    'INSERT OR IGNORE INTO ratings (id, booking_id, patient_id, therapist_id, score, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  // 25 pazienti demo con ID deterministici
  PATIENT_NAMES.forEach((name, i) => {
    patientStmt.run(
      `demo-patient-${String(i + 1).padStart(2, '0')}`,
      name,
      `paziente.demo${i + 1}@adattoxte.it`,
      hash('Demo1234!'),
      'patient',
      'Utente demo generato dal seed.',
      daysAgo(200),
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
  });

  // 100 recensioni per terapeuta (500 totali): 72x5★, 22x4★, 4x3★, 1x2★, 1x1★
  const SCORES = [
    ...Array(72).fill(5),
    ...Array(22).fill(4),
    ...Array(4).fill(3),
    2, 1,
  ];

  let inserted = 0;
  therapistRows.forEach((th, tIdx) => {
    SCORES.forEach((score, i) => {
      const patientId = `demo-patient-${String(((i * 7 + tIdx * 3) % PATIENT_NAMES.length) + 1).padStart(2, '0')}`;
      const bookingId = `bk-review-${tIdx}-${i}`;
      const ratingId = `rt-review-${tIdx}-${i}`;
      const daysBack = 240 - ((i + tIdx * 17) % 210);
      const reviewDate = daysAgo(daysBack);
      const sessionDate = daysAgo(daysBack + 35);

      const pool = score === 5 ? REVIEWS_5 : score === 4 ? REVIEWS_4 : REVIEWS_3;
      const comment = pool[(i * 3 + tIdx) % pool.length];
      const type = i % 5 === 0 ? 'couple' : 'individual';
      const price = type === 'couple' ? 50 : 45;

      bookingStmt.run(bookingId, patientId, th.id, sessionDate, '18:00', '18:50', type, price, `AdattoXTe-${tIdx}${i}`, reviewDate);
      const res = ratingStmt.run(ratingId, bookingId, patientId, th.id, score, comment, reviewDate);
      if (res.changes > 0) inserted += 1;
    });
  });

  console.log(`   Recensioni demo inserite: ${inserted} (500 previste)`);
}

function run() {
  initDb().then(() => {
    const insertUser = db.prepare(
      'INSERT OR IGNORE INTO users (id, name, email, password_hash, role, bio, consent_to_tos, consent_date, referral_code) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)'
    );
    const insertProfile = db.prepare(
      'INSERT OR IGNORE INTO therapist_profiles (user_id, specialties, price_individual, price_couple, license, experience_years, languages, photo_url, verified) VALUES (?, ?, 45, 50, ?, ?, ?, ?, ?)'
    );

    // SICUREZZA: in produzione gli account demo vengono creati con password
    // CASUALI (stampate nei log), mai con quelle pubbliche documentate.
    const isProd = process.env.NODE_ENV === 'production';
    // Dati demo (terapeuti fittizi + recensioni): SOLO in sviluppo locale o con
    // SEED_DEMO_DATA=1 esplicito. Mai in produzione: il catalogo e le recensioni
    // devono essere reali.
    const demoData = process.env.SEED_DEMO_DATA === '1' || !isProd;
    const demoPw = (label, fallback) => {
      if (!isProd) return fallback;
      const pw = crypto.randomBytes(9).toString('base64url') + '!A';
      console.log(`[SEED] ${label}: password generata = ${pw} (conservala, non è pubblica)`);
      return pw;
    };

    // Admin
    const adminId = crypto.randomUUID();
    const adminPw = process.env.SEED_ADMIN_PASSWORD || demoPw('admin', 'Admin123!');
    if (process.env.SEED_ADMIN_PASSWORD) console.log(`[SEED] admin: password da variabile d'ambiente SEED_ADMIN_PASSWORD`);
    insertUser.run(adminId, 'Amministratore Adatto x Te', 'admin@adattoxte.it', hash(adminPw), 'admin', '', new Date().toISOString(), crypto.randomBytes(4).toString('hex').toUpperCase());

    // Paziente demo
    const patientId = crypto.randomUUID();
    insertUser.run(patientId, 'Antonio Demo', 'antonio@adattoxte.it', hash(demoPw('paziente demo', 'Demo1234!')), 'patient', 'Utente di prova per testare la piattaforma.', new Date().toISOString(), crypto.randomBytes(4).toString('hex').toUpperCase());

    // Terapeuti fittizi + recensioni demo: SOLO con dati demo abilitati
    if (demoData) {
      // Terapeuti (idempotente: riusa l'ID esistente per email, così il profilo
      // non viola la foreign key al secondo run)
      for (const t of THERAPISTS) {
        let id = db.prepare('SELECT id FROM users WHERE email = ?').get(t.email)?.id;
        if (!id) {
          id = crypto.randomUUID();
          insertUser.run(id, t.name, t.email, hash(demoPw(t.email, t.password)), 'therapist', t.bio, new Date().toISOString(), crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        insertProfile.run(id, JSON.stringify(t.specialties), t.license, t.experienceYears, JSON.stringify(t.languages), '', t.verified ? 1 : 0);
      }

      // Recensioni demo (500) — dopo terapeuti e pazienti
      seedReviews();
    }

    console.log('✅ Seed completato');
    if (!isProd) {
      console.log('   Admin:    admin@adattoxte.it / Admin123!');
      console.log('   Paziente: antonio@adattoxte.it / Demo1234!');
    }
    if (demoData) {
      console.log('   Terapeuti demo (email / password):');
      for (const t of THERAPISTS) console.log(`   - ${t.email} / ${t.password}`);
    }
  });
}

run();
