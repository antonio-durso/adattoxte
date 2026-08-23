/**
 * Seed dati di esempio per la piattaforma Adatto x Te.
 * Crea: 1 admin, 1 paziente demo, 5 terapeuti fittizi
 * con le specializzazioni individuate nel business plan (cap. 3):
 * psicologia dello sport, concorsi pubblici, psicologia giuridica,
 * terapia di coppia, ansia e depressione.
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

function run() {
  initDb().then(() => {
    const insertUser = db.prepare(
      'INSERT OR IGNORE INTO users (id, name, email, password_hash, role, bio, consent_to_tos, consent_date, referral_code) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)'
    );
    const insertProfile = db.prepare(
      'INSERT OR IGNORE INTO therapist_profiles (user_id, specialties, price_individual, price_couple, license, experience_years, languages, photo_url, verified) VALUES (?, ?, 45, 50, ?, ?, ?, ?, ?)'
    );

    // Admin
    const adminId = crypto.randomUUID();
    insertUser.run(adminId, 'Amministratore Adatto x Te', 'admin@adattoxte.it', hash('Admin123!'), 'admin', '', new Date().toISOString(), crypto.randomBytes(4).toString('hex').toUpperCase());

    // Paziente demo
    const patientId = crypto.randomUUID();
    insertUser.run(patientId, 'Antonio Demo', 'antonio@adattoxte.it', hash('Demo1234!'), 'patient', 'Utente di prova per testare la piattaforma.', new Date().toISOString(), crypto.randomBytes(4).toString('hex').toUpperCase());

    // Terapeuti
    for (const t of THERAPISTS) {
      const id = crypto.randomUUID();
      insertUser.run(id, t.name, t.email, hash(t.password), 'therapist', t.bio, new Date().toISOString(), crypto.randomBytes(4).toString('hex').toUpperCase());
      insertProfile.run(id, JSON.stringify(t.specialties), t.license, t.experienceYears, JSON.stringify(t.languages), '', t.verified ? 1 : 0);
    }

    console.log('✅ Seed completato');
    console.log('   Admin:    admin@adattoxte.it / Admin123!');
    console.log('   Paziente: antonio@adattoxte.it / Demo1234!');
    console.log('   Terapeuti demo (email / password):');
    for (const t of THERAPISTS) console.log(`   - ${t.email} / ${t.password}`);
  });
}

run();
