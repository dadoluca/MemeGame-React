/**
 * Before run delete the current db
 * To run: node init_db.mjs    (in server folder)
 */

import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('memes.sqlite', (err) => {
  if (err) throw err;
});

// Promisify the db.run and crypto.scrypt functions for better control of async operations
const runAsync = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const scryptAsync = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
};

(async () => {
  try {
    await runAsync(db, `CREATE TABLE IF NOT EXISTS memes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_path TEXT NOT NULL,
      description TEXT
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS captions (
      id INTEGER PRIMARY KEY,
      caption TEXT NOT NULL,
      translation_italian TEXT NOT NULL
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS meme_captions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meme_id INTEGER,
      caption_id INTEGER,
      is_suitable BOOLEAN,
      FOREIGN KEY (meme_id) REFERENCES memes(id),
      FOREIGN KEY (caption_id) REFERENCES captions(id)
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL, -- hashed password
      salt TEXT NOT NULL
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_score INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
    
    await runAsync(db, `CREATE TABLE IF NOT EXISTS game_rounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER,
      round INTEGER,
      meme_id INTEGER,
      score INTEGER,
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (meme_id) REFERENCES memes(id)
    )`);

    await runAsync(db, `INSERT INTO memes (image_path) VALUES
      ('/images/memes/meme1.jpg'),
      ('/images/memes/meme2.jpg'),
      ('/images/memes/meme3.jpg'),
      ('/images/memes/meme4.jpg'),
      ('/images/memes/meme5.jpg'),
      ('/images/memes/meme6.jpg'),
      ('/images/memes/meme7.jpg'),
      ('/images/memes/meme8.jpg'),
      ('/images/memes/meme9.jpg'),
      ('/images/memes/meme10.jpg')`);

      runAsync(db, `INSERT INTO captions (id, caption, translation_italian) VALUES
        (1,'When your cousin makes a joke about vegans at the dinner table', 'Quando tuo cugino fa una battuta sui vegani a tavola'),
        (2,'That moment when your browser history is more interesting than your conversation', 'Quel momento in cui la tua cronologia del browser è più interessante della tua conversazione'),
        (3,'When you accidentally like your crush’s post from three years ago', 'Quando metti per errore "mi piace" al post del tuo crush di tre anni fa'),
        (4,'The look you give when someone says "it’s just a joke" after a tasteless comment', 'Lo sguardo che dai quando qualcuno dice "è solo uno scherzo" dopo un commento di cattivo gusto'),
        (5,'When you search "how to disappear without a trace" after a bad date', 'Quando cerchi "come scomparire senza lasciare tracce" dopo un appuntamento andato male'),
        (6,'When you accidentally send a text about someone to that same person', 'Quando invii per errore un messaggio in cui sparli di qualcuno a quella stessa persona'),
        (7,'When she says "I’m not like other girls"', 'Quando dice "non sono come le altre ragazze"'),
        (8,'When you find out your ex is dating someone less attractive than you', 'Quando scopri che il tuo ex si sente con qualcuno meno attraente di te'),
        (9,'That moment when you realize you have more unread emails than friends', 'Quel momento in cui ti rendi conto di avere più email non lette che amici'),
        (10,'When you tell your therapist a joke and they start taking notes', 'Quando racconti una battuta al tuo psicologo e lui inizia a prendere appunti'),
        (11,'When someone says "I hope I’m not bothering you" after they’ve already bothered you', 'Quando dice "spero di non disturbarti" dopo che ti ha già disturbato'),
        (12,'When you laugh during a funeral because you look at your friend', 'Quando ridi durante un funerale perché guardi il tuo amico'),
        (13,'When you open a message you were trying to ignore', 'Quando apri quel messaggio che cercavi di ignorare'),
        (14,'When someone asks if you’re pregnant and you’re just bloated', 'Quando qualcuno ti chiede se sei incinta e tu sei solo gonfia'),
        (15,'When you realize your childhood crush grew up to be a conspiracy theorist', 'Quando scopri che la tua crush d’infanzia è diventato un complottista'),
        (16,'When you realize you’ve been pronouncing a word wrong your whole life', 'Quando ti rendi conto di aver pronunciato male una parola per tutta la vita'),
        (17,'When you accidentally like your own post', 'Quando metti per errore "mi piace" al tuo stesso post'),
        (18,'When someone says "you’ve changed" like it’s a bad thing', 'Quando qualcuno dice "sei cambiato" come se fosse una cosa negativa'),
        (19,'When you realize you’ve been pronouncing "quinoa" wrong for years', 'Quando ti rendi conto di aver pronunciato "quinoa" male per anni'),
        (20,'That moment when you accidentally send a screenshot of your conversation back to the same person', 'Quel momento in cui invii accidentalmente uno screenshot della conversazione alla stessa persona'),
        (21,'When you make a dark joke and everyone gets uncomfortable', 'Quando fai una battuta nera e tutti si sentono a disagio'),
        (22, 'When someone says "you look tired"', 'Quando qualcuno dice "sembri stanco"'),
        (23,'When you accidentally like your crush’s post from five years ago', 'Quando metti per errore "mi piace" al post della tua crush di cinque anni fa'),
        (24,'When you accidentally send a text meant for your therapist to your boss', 'Quando invii per errore un messaggio pensato per il tuo terapeuta al tuo capo'),
        (25,'That moment when you realize your last three brain cells are fighting to the death', 'Quel momento in cui ti rendi conto che le tue ultime tre cellule cerebrali stanno lottando fino alla morte'),
        (26,'When you realize your autobiography would be titled "Well, That Escalated Quickly"', 'Quando ti rendi conto che la tua autobiografia si intitolerebbe "Bene, questo è degenerato rapidamente"'),
        (27,'The look you give when someone suggests a "team-building exercise"', 'Quando qualcuno suggerisce un "esercizio di team-building"'),
        (28,'When you accidentally hit "reply all" and unleash chaos upon the office', 'Quando per errore premi "rispondi a tutti" e scatena il caos in ufficio'),
        (29,'That moment when you realize your life has more plot twists than a soap opera', 'Quel momento in cui ti rendi conto che la tua vita ha più colpi di scena di una soap opera'),
        (30,'When your therapist asks how you’re feeling and you burst into uncontrollable laughter', 'Quando il tuo terapeuta ti chiede come ti senti e scoppi a ridere'),
        (31,'When someone asks if you’ve found a job yet', 'Quando qualcuno ti chiede se hai già trovato un lavoro'),
        (32,'When you realize you’ve spent more time in therapy than at family gatherings', 'Quando ti rendi conto di aver trascorso più tempo in terapia che in famiglia'),
        (33,'That awkward moment when your phone autocorrects "I’ll be there in a sec" to "I’ll be there in a sex"', 'Quel momento imbarazzante quando il tuo telefono corregge "ci sarò tra un secondo" in "ci sarò in un sesso"'),
        (34,'The look you give when someone says "at least it can’t get any worse"', 'Lo sguardo che dai quando qualcuno dice "almeno non può peggiorare"'),
        (35,'When you realize your Tinder matches are more fictional than your favorite book characters', 'Quando ti rendi conto che i tuoi match su Tinder sono più finti dei tuoi personaggi di libro preferiti'),
        (36,'That moment when you consider becoming a hermit because people are exhausting', 'Quel momento in cui consideri di diventare un eremita perché le persone sono esaustive'),
        (37,'When you accidentally reveal your darkest secret during a job interview', 'Quando rivel accidentally il tuo segreto più oscuro durante un colloquio di lavoro'),
        (38,'The face you make when someone asks if you’ve tried yoga to cure your depression', 'Quando qualcuno ti chiede se hai provato lo yoga per curare la tua depressione'),
        (39,'When your horoscope predicts "a surprise at work"', 'Quando il tuo oroscopo prevede "una sorpresa al lavoro"'),
        (40,'That moment when you realize your life is a series of "I didn’t sign up for this" moments', 'Quel momento in cui ti rendi conto che la tua vita è una serie di momenti "non mi sono iscritto a questo"'),
        (41,'When you accidentally reply to your ex’s text with "I miss you too" instead of "I hate you"', 'Quando rispondi accidentalmente al messaggio del tuo ex con "mi manchi anche a me" invece di "ti odio"'),
        (42,'The look you give when someone says "you just need to get out more"', 'Lo sguardo che dai quando qualcuno dice "devi solo uscire di più"')
    `);

  
      

    await runAsync(db, `INSERT INTO meme_captions (meme_id, caption_id, is_suitable) VALUES
      (1, 10, true),
      (1, 34, true),
      (1, 2, false),
      (1, 18, false),
      (1, 23, false),
      (1, 26, false),
      (1, 30, false),
      (2, 23, true),
      (2, 14, true),
      (2, 40, false),
      (2, 31, false),
      (2, 28, false),
      (2, 25, false),
      (2, 29, false),
      (3, 24, true),
      (3, 31, true),
      (3, 36, false),
      (3, 40, false),
      (3, 41, false),
      (3, 22, false),
      (3, 19, false),
      (4, 1, true),
      (4, 27, true),
      (4, 20, false),
      (4, 22, false),
      (4, 23, false),
      (4, 36, false),
      (4, 42, false),
      (5, 10, true),
      (5, 11, true),
      (5, 27, false),
      (5, 17, false),
      (5, 16, false),
      (5, 25, false),
      (5, 29, false),
      (6, 7, true),
      (6, 39, true),
      (6, 30, false),
      (6, 28, false),
      (6, 26, false),
      (6, 35, false),
      (6, 32, false),
      (7, 29, true),
      (7, 40, true),
      (7, 1, false),
      (7, 8, false),
      (7, 12, false),
      (7, 16, false),
      (7, 18, false),
      (8, 41, true),
      (8, 9, true),
      (8, 8, false),
      (8, 11, false),
      (8, 12, false),
      (8, 17, false),
      (8, 27, false),
      (9, 38, true),
      (9, 35, true),
      (9, 33, false),
      (9, 15, false),
      (9, 7, false),
      (9, 4, false),
      (9, 18, false),
      (10, 18, true),
      (10, 10, true),
      (10, 24, false),
      (10, 26, false),
      (10, 30, false),
      (10, 35, false),
      (10, 37, false)
      `);

    const users = [
      { name: 'Luca Dadone', email: 'luca.dadone01@gmail.com', password: 'lucadadone' },
      { name: 'Luigi De Russis', email: 'luigi.de.russis@gmail.com', password: 'luigiderussis' },
      { name: 'Luca Mannella', email: 'luca.mannella@gmail.com', password: 'lucamannella' }
    ];

    for (const user of users) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await scryptAsync(user.password, salt);
      await runAsync(db, `INSERT INTO users (name, email, password, salt) VALUES (?, ?, ?, ?)`,
        [user.name, user.email, hashedPassword, salt]);
    }

    console.log('Database initialized');
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
})();
