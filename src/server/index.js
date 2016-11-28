'use strict';

let express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    _               = require('underscore'),
    shuffleCards    = require('./shuffleCards'),
    pug             = require('pug'),
    md5             = require('md5'),
    session         = require('express-session');

const validMoves = require('./validMoves');

const Users = require('./db').Users;
const Games = require('./db').Games;
const profileView = pug.compileFile('src/views/profile.pug');

let app = express();
app.use(express.static('public'));
app.use(logger('combined'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

let users = [
    { username: 'tumbler', password: 'WBush', first_name: 'George', last_name: 'Bush', primary_email: 'decider@bush2.com' },
    { username: 'eagle', password: 'BlueDress', first_name: 'William', last_name: 'Clinton', primary_email: 'slickwilly@clinton.com' },
    { username: 'renegade', password: 'yeswecan', first_name: 'Barak', last_name: 'Obama', primary_email: 'nearly.done@potus.gov' },
    { username: 'timberwolf', password: 'nobroccoli', first_name: 'George', last_name: 'Bush', primary_email: 'nogonnadoit@bush1.com' },
    { username: 'rawhide', password: 'lovenancy', first_name: 'Ronald', last_name: 'Reagan', primary_email: 'gipper@reagan.com' }
];

let games = [];


// Handle POST to create a user session
app.post('/v1/session', function(req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
      res.status(400).send({ error: 'username and password required' });
    } else {
      Users.findOne({username: req.body.username}, (err, user) => {
        if (err) {
          console.error(err);
          res.status(400).send({ error: 'Error signing in user' });
        } else {
          if (user) {
            user.comparePassword(req.body.password, (err, isMatch) => {
              if (err || !isMatch) {
                console.error(err);
                res.status(400).send({ error: 'Error signing in user' });
              } else {
                req.session.username = user.username;
                req.session.primary_email = user.primary_email;
                req.session.user_id = user._id;

                res.status(201).send({
                    username:       user.username,
                    primary_email:  user.primary_email
                });
              }
            });
          } else {
            res.status(400).send({ error: 'Error signing in user' });
          }
        }
      });
    }
});

// Handle POST to create a new user account
app.post('/v1/user', function(req, res) {
    let user = req.body;

    // Ensure all required fields are included
    const hasRequiredFields = ['username', 'first_name', 'last_name', 'primary_email']
      .every(property => user.hasOwnProperty(property));
    if (!hasRequiredFields) {
      return res.status(400).send({ error: 'Invalid payload' });
    }

    // Verify the password is correct before we hash it (Mongoose does this, see db.js)
    const LOWER_UPPER_NUM_AND_SYMBOL_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
    if (user.password.length < 8 || !user.password.match(LOWER_UPPER_NUM_AND_SYMBOL_REGEX)) {
      return res.status(400).send({ error: 'Invalid password format' });
    }

    // Create the User in the database
    new Users(user).save((err, user) => {
      if (err) {
        console.error(err);
        res.status(400).send({ error: 'Error creating user' });
      } else {
        // Add the proper session data
        req.session.username = user.username;
        req.session.primary_email = user.primary_email;
        req.session.user_id = user._id;

        res.status(201).send({
          username: user.username,
          primary_email: user.primary_email,
        });
      }
    });
});

// Handle GET to fetch user information
app.get('/profile', function(req, res) {
  Users.findOne({username: req.query.username}, (err, user) => {
    if (err || !user) {
      console.error(err);
      res.status(404).send({ error: 'Error fetching user' });
    } else {
      user = user.toJSON();
      delete user.hashed_password;
      delete user._id;
      delete user.__v;

      let hash;
      user.my_gravitar_src = 'https://www.gravatar.com/avatar/?f=y';
      if (req.session.primary_email) {
        hash = md5(req.session.primary_email.trim().toLowerCase());
        user.my_gravitar_src = `https://www.gravatar.com/avatar/${hash}`;
      }
      hash = md5(user.primary_email.trim().toLowerCase());
      user.profile_gravitar_src = `https://www.gravatar.com/avatar/${hash}`;
      user.can_edit = req.query.username === req.session.username;
      user.logged_in = !!req.session.username;

      res.status(200).send(profileView(user));
    }
  });
});

// Handle PUT to edit user information
app.put('/v1/user/:username', function(req, res) {
  if (req.session.username !== req.params.username) {
    return res.status(401).send({ error: 'unauthorized' });
  }

  Users.findOne({username: req.params.username}, (err, user) => {
    if (err || !user) {
      console.error(err);
      res.status(404).send({ error: 'Error editing user' });
    } else {
      for (let prop in req.body) {
        user[prop] = req.body[prop];
      }

      user.save(err => {
        if (err) {
          console.error(err);
          res.status(400).send({error: 'Error editing user'});
        } else {
          // User could have changed their username/password, so update session info
          req.session.username = req.body.username;
          req.session.primary_email = req.body.primary_email;
          res.status(200).send();
        }
      });
    }
  });
});

// Handle GET to retrieve list of all games specified username started
app.get('/v1/user/:username/game', function(req, res) {
  Users.findOne({'username': req.params.username}, (err, user) => {
        Games.find({'creator': user._id}, (err, games) => {
            if (err) {
                res.status(401).send({error: 'unable to find list of games'});
            } else {
                res.status(200).send(games);
            }
        });
    });
});

// Handle POST to create a new game
app.post('/v1/game', function(req, res) {
    if (!req.session.user_id) {
      return res.status(401).send({ error: 'unauthorized' });
    }

    const data = req.body;
    if (!data ||
        !data.type ||
        !data.num_players ||
        !data.name ||
        !data.draw_num) {
        res.status(400).send({ error: 'all form fields required' });
    } else {
      // Create local object representing the new game...
      let newGame = _.pick(data, 'type', 'num_players', 'name', 'deck_type', 'draw_num');
      newGame.players = [req.session.user_id];
      newGame.startDate = Date.now();
      newGame.creator = req.session.user_id;
      newGame.turn = req.session.user_id;
      newGame.state = [];

      // ...and save it in the database
      new Games(newGame).save((err, game) => {
        if (err) {
          console.error(err);
          res.status(400).send({error: 'Error creating game'});
        } else {
          res.status(201).send({
              planid: game._id
          });
        }
      });
    }
});

app.get('/v1/game/shuffle', function(req, res) {
  const jokers = req.query.jokers === 'true';
  res.status(200).send(shuffleCards(jokers));
});

// Handle GET to fetch game information
app.get('/v1/game/:id', function(req, res) {
  Games.findOne({'_id': req.params.id}, (err, game) => {
      if (err || !game) {
        console.error(err);
        res.status(401).send({error: 'unable to find game'});
      } else {
        res.status(200).send(game);
      }
  });
});

// Handle PUT to make a move for a game
app.put('/v1/game/:id', function(req, res) {
  if (!req.session.user_id) {
    return res.status(401).send({ error: 'unauthorized' });
  }

  // If the body has a state, the client must be sending the initial game state.
  if (req.body.state) {
    Games.findOne({'_id': req.params.id}, (err, game) => {
      if (err || !game) {
        console.error(err);
        res.status(401).send({error: 'unable to find game'});
      } else {
        game.state.push(req.body.state);
        game.save((err, game) => {
          if (err) {
            console.error(err);
            res.status(400).send({error: 'Error updating game state'});
          } else {
            return res.status(200).send();
          }
        });
      }
    });
  } else {
    Games.findOne({'_id': req.params.id}, (err, game) => {
      if (err || !game) {
        console.error(err);
        res.status(401).send({error: 'unable to find game'});
      } else {
        if (game.creator != req.session.user_id) {
          return res.status(401).send({ error: 'unauthorized' });
        }

        // Guaranteed to have at least an initial state.
        const state = JSON.parse(game.state[game.state.length - 1]);
        const move = req.body.move;
        const isValid = validMoves(state).some(m => {
          if (m.dst === move.dst && m.src === move.src && m.cards.length === move.cards.length) {
            return m.cards.every((lCard, idx) => {
              const rCard = move.cards[idx];
              return lCard.suit === rCard.suit &&
                lCard.up == (rCard.up === 'true') &&
                lCard.value == rCard.value;
            });
          }
        });

        if (isValid) {
          // Update the state to reflect the move
          move.cards.forEach(card => {
            const cardIdx = state[move.src].indexOf(card);
            const removedCards = state[move.src].splice(cardIdx, 1);
            state[move.dst].push(removedCards[0]);
          });

          // Update and save the model in the DB
          game.state.push(JSON.stringify(state));
          game.save((err, game) => {
            if (err) {
              console.error(err);
              res.status(400).send({error: 'Error updating game state'});
            } else {
              return res.status(200).send({ state: game.state[game.state.length - 1] });
            }
          });
        } else {
          return res.status(400).send({ error: 'invalid move' });
        }
      }
    });
  }
});

let server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});
