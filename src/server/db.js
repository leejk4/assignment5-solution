'use strict';

const VUNETID = 'peposesf';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

mongoose.connect(`mongodb://localhost:27017/${VUNETID}`);

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
  dob: String,
  address_street: String,
  address_city: String,
  address_state: String,
  address_zip: Number,
  primary_phone: Number,
});

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
  deck_type: {
    type: String,
    required: [true, 'Must specify deck type'],
    enum: ['Blue cards', 'Pink cards', 'Yellow cards', 'Cards with ponies', 'Cards with antelopes'],
  },
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
