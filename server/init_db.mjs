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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caption TEXT NOT NULL
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS meme_captions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_meme INTEGER,
      id_caption INTEGER,
      FOREIGN KEY (id_meme) REFERENCES memes(id),
      FOREIGN KEY (id_caption) REFERENCES captions(id)
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL, -- hashed password
      salt TEXT NOT NULL
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      score INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    await runAsync(db, `INSERT INTO memes (image_path) VALUES
      ('/public/images/memes/meme1.jpg'),
      ('/public/images/memes/meme2.jpg'),
      ('/public/images/memes/meme3.jpg'),
      ('/public/images/memes/meme4.jpg'),
      ('/public/images/memes/meme5.jpg'),
      ('/public/images/memes/meme6.jpg'),
      ('/public/images/memes/meme7.jpg'),
      ('/public/images/memes/meme8.jpg'),
      ('/public/images/memes/meme9.jpg'),
      ('/public/images/memes/meme10.jpg'),
      ('/public/images/memes/meme11.jpg'),
      ('/public/images/memes/meme12.jpg'),
      ('/public/images/memes/meme13.jpg'),
      ('/public/images/memes/meme14.jpg')`);

    await runAsync(db, `INSERT INTO captions (caption) VALUES
        ('Tapping someone on the left shoulder but being on the right'),
        ('When you realize you left your wallet at home'),
        ('That moment when your joke ruins the conversation'),
        ('When your pet looks at you like you betrayed them'),
        ('That face you make when someone says something stupid'),
        ('When you find an extra fry at the bottom of the bag'),
        ('The look you give your friend when they are about to spill the tea'),
        ('When you hear your own voice on a recording'),
        ('That awkward moment when you wave back at someone who was not waving at you'),
        ('When you are about to sneeze and it disappears'),
        ('When someone uses your favorite mug without asking'),
        ('That feeling when you step on a Lego'),
        ('When you are trying to diet and someone brings donuts'),
        ('The face you make when you have to wake up early'),
        ('When you walk into a room and forget why you went there'),
        ('That moment when you realize you sent the text to the wrong person'),
        ('When you are telling a story and realize no one is listening'),
        ('That look when the WiFi stops working'),
        ('When someone asks if you are okay and you say "I am fine" but you are not fine'),
        ('The face you make when you see your food coming at a restaurant'),
        ('When you accidentally open the front camera'),
        ('That moment when you finish a series and do not know what to do with your life'),
        ('When you see someone wearing the same outfit as you'),
        ('The face you make when you try to remember if you locked the door'),
        ('When you are in a group project and no one else is doing anything'),
        ('That feeling when you finally understand a math problem'),
        ('When you see your ex with someone new'),
        ('The look you give your friend when the teacher says "pick a partner"'),
        ('When you are on a diet and someone eats a pizza in front of you'),
        ('That moment when you realize you have been watching tutorials instead of actually doing work'),
        ('When you see a spider in your room'),
        ('The face you make when someone says "we need to talk"'),
        ('When you are trying to impress someone and fail miserably'),
        ('That moment when you are about to fall asleep and you suddenly jerk awake'),
        ('When you are at a party and do not know anyone'),
        ('The face you make when you are trying not to laugh at a serious moment'),
        ('When you are scrolling through memes instead of being productive'),
        ('That look when you cannot remember if you closed the garage door'),
        ('When you are trying to take a selfie and someone walks in'),
        ('The face you make when you hear a song you used to love'),
        ('When you are trying to be healthy but you pass by a bakery'),
        ('That moment when you realize you have been on hold for an hour')
    `);

    await runAsync(db, `INSERT INTO meme_captions (id_meme, id_caption) VALUES
      (4, 1),
      (4, 2),
      (5, 3),
      (5, 4),
      (6, 5),
      (6, 6),
      (7, 7),
      (7, 8),
      (8, 9),
      (8, 10),
      (9, 11),
      (9, 12),
      (10, 13),
      (10, 14),
      (11, 15),
      (11, 16),
      (12, 17),
      (12, 18),
      (13, 19),
      (13, 20),
      (14, 21)`);

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
