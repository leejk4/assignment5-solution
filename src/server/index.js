'use strict';

let express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    _               = require('underscore'),
    shuffleCards    = require('./shuffleCards'),
    session         = require('express-session');



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
        console.log(req.session);
        let user = _.findWhere(users, { username: req.body.username.toLowerCase() });
        if (!user || user.password !== req.body.password) {
            if (user) console.log('It the password: ' + user.password + ' vs. ' + req.body.password);
            else console.log('No user found: ' + req.body.username);
            res.status(401).send({ error: 'unauthorized' });
        } else {
            req.session.username = user.username;
            res.status(201).send({
                username:       user.username,
                primary_email:  user.primary_email
            });
        }
    }
});

// Handle POST to create a new user account
app.post('/v1/user', function(req, res) {
    let data = req.body;
    if (!data || !data.username || !data.password || !data.first_name || !data.last_name || !data.primary_email) {
        res.status(400).send({ error: 'username, password, first_name, last_name and primary_email required' });
    } else {
        let user = _.findWhere(users, { username: data.username.toLowerCase() });
        if (user) {
            res.status(400).send({ error: 'username already in use' });
        } else {
            let newUser = _.pick(data, 'username', 'first_name', 'last_name', 'password', 'dob', 'address_street', 'address_city', 'address_state', 'address_zip', 'primary_phone', 'primary_email');
            users.push(newUser);
            res.status(201).send({
                username:       data.username,
                primary_email:  data.primary_email
            });
        }
    }
});

// Handle GET to fetch user information
app.get('/v1/user/:username', function(req, res) {
    let user = _.findWhere(users, { username: req.params.username.toLowerCase() });
    if (!user) {
        res.status(404).send({ error: 'unknown user' });
    } else {
        user = _.pick(user, 'username', 'first_name', 'last_name', 'dob', 'address_street', 'address_city', 'address_state', 'address_zip', 'primary_phone', 'primary_email');
        res.status(200).send(user);
    }
});

// Handle POST to create a new game
app.post('/v1/game', function(req, res) {
    let data = req.body;
    if (!data ||
        !data.type ||
        !data.num_players ||
        !data.name ||
        !data.deck_type ||
        !data.draw_num) {
        res.status(400).send({ error: 'all form fields required' });
    } else {
        let newGame = _.pick(data, 'type', 'num_players', 'name', 'deck_type', 'draw_num');
        newGame = _.extend(newGame, {
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
            duration: Math.floor(Math.random() * 500),
            winner: '',
            points: Math.floor(Math.random() * 100)
        });
        games.push(newGame);
        res.status(201).send({
            planid: newGame.id
        });
    }
});

app.get('/v1/game/shuffle', function(req, res) {
  const jokers = req.query.jokers === 'true';
  res.status(200).send(shuffleCards(jokers));
});

// Handle GET to fetch game information
app.get('/v1/game/:id', function(req, res) {
    let game = _.findWhere(games, { id: req.params.id.toLowerCase() });
    if (!game) {
        res.status(404).send({ error: 'unknown game id' });
    } else {
        res.status(200).send(game);
    }
});


let server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});
