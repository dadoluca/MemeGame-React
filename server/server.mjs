// import
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
//import {check, validationResult} from 'express-validator';
import {getUser, getUserById} from './user_dao.mjs';
import {getRandomMeme} from './meme_dao.mjs';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// middleware
app.use(express.json());
app.use(morgan('dev'));

// Session Configuration
// set up and enable CORS -- UPDATED
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Passport configuration
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
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

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

//To serve meme images
app.use(express.static('public'));


/*  ROUTES -------------------------------------------------------*/

// Authentication routes
app.post('/api/sessions', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) return res.status(401).json(info);// display wrong login messages

    req.login(user, err => {    // success, perform the login
      if (err) return next(err);
      // req.user contains the authenticated user, we send all the user info back
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
/* ------------------------------------------------------- ROUTES */

app.get('/api/memes/random', (req, res) => {
  getRandomMeme().then(meme => res.json(meme));
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
