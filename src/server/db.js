'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const VUNETID = 'peposesf';
// http://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
const NUM_SALT_ROUNDS = 15; // really means 2^15 rounds

mongoose.connect(`mongodb://localhost:27017/${VUNETID}`, err => {
  if (err) {
    console.error("ERROR: Could not connect to the mongo db. Is `mongod` running?");
    process.exit();
  }
});

// huge credit to Tommy Meisel (thomasameisel) for the schemas :-)
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Must specify username'],
    unique: true,
    validate: {
      validator: un => (un.length >=6 || un.length <= 16) && un.match(/^[a-zA-Z0-9]+$/),
      message: 'Username must be between 6 and 16 characters and alphanumeric',
    },
  },
  first_name: { type: String, required: [true, 'Must specify first name'] },
  last_name: { type: String, required: [true, 'Must specify last name'] },
  primary_email: {
    type: String,
    required: [true, 'Must specify email'],
    unique: [true, 'Email already in use'],
    validate: {
      validator: email => email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
      message: 'Email is not well-formed',
    },
  },
  hashed_password: { type: String, required: true },
});

// Add a 'virtual' field named 'password'. When this value is set, the 'set' cb
// is called. This cb hashes the password using bcrypt and stores it in the proper
// 'hashed_password' field. Since the 'password' field is virtual, it is never sent
// to the client or database.
userSchema.virtual('password')
  .set(function(password) {
    this.hashed_password = bcrypt.hashSync(password, NUM_SALT_ROUNDS);
  });

// http://stackoverflow.com/questions/14588032/mongoose-password-hashing
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.hashed_password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

const gameSchema = new Schema({
  players: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}], required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  turn: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  state: { type: [String] },
  type: {
    type: String,
    required: [true, 'Must specify type of game'],
    enum: ['Klondike', 'Pyramid', 'Canfield', 'Golf', 'Yukon'],
  },
  num_players: {
    type: Number,
    required: [true, 'Must specify number of players'],
    min: [1, 'Number of players must be 1 or greater'],
  },
  name: { type: String, required: [true, 'Must specify game name'] },
  draw_num: {
    type: Number,
    required: [true, 'Must specify number of cards to draw'],
    validate: {
      validator: n => n === 1 || n === 3,
      message: 'Number of cards to draw is not valid'
    },
  },
});

const Users = mongoose.model('Users', userSchema);
const Games = mongoose.model('Games', gameSchema);

module.exports = {
  Users,
  Games,
};
