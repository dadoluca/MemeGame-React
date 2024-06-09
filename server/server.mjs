import express from 'express';
import { db } from './db.mjs';
import { getUser, getUserById } from './user_dao.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'shhhhh... it\'s a secret!',
  resave: false,
  saveUninitialized: false,
}));

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUser(username, password);
    if (!user) return done(null, false, { message: 'Incorrect username or password.' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Authentication routes
app.post('/api/sessions', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info);
    req.login(user, err => {
      if (err) return next(err);
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.end();
  });
});

/*
app.get('/api/memes/random', (req, res) => {
  db.get(`SELECT * FROM memes ORDER BY RANDOM() LIMIT 1`, (err, meme) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.all(`SELECT * FROM captions ORDER BY RANDOM() LIMIT 7`, (err, captions) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ meme, captions });
    });
  });
});

app.post('/api/scores', (req, res) => {
  const { user_id, score } = req.body;
  db.run(`INSERT INTO scores (user_id, score) VALUES (?, ?)`, [user_id, score], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});
*/
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
