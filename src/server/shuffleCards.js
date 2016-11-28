'use strict';

const _ = require('underscore');

const CARDS = [
  { 'suit': 'clubs', 'value': 1 }, // Ace
  { 'suit': 'clubs', 'value': 2 },
  { 'suit': 'clubs', 'value': 3 },
  { 'suit': 'clubs', 'value': 4 },
  { 'suit': 'clubs', 'value': 5 },
  { 'suit': 'clubs', 'value': 6 },
  { 'suit': 'clubs', 'value': 7 },
  { 'suit': 'clubs', 'value': 8 },
  { 'suit': 'clubs', 'value': 9 },
  { 'suit': 'clubs', 'value': 10 },
  { 'suit': 'clubs', 'value': 11 }, // Jack
  { 'suit': 'clubs', 'value': 12 }, // Queen
  { 'suit': 'clubs', 'value': 13 }, // King
  { 'suit': 'diamonds', 'value': 1 }, // Ace
  { 'suit': 'diamonds', 'value': 2 },
  { 'suit': 'diamonds', 'value': 3 },
  { 'suit': 'diamonds', 'value': 4 },
  { 'suit': 'diamonds', 'value': 5 },
  { 'suit': 'diamonds', 'value': 6 },
  { 'suit': 'diamonds', 'value': 7 },
  { 'suit': 'diamonds', 'value': 8 },
  { 'suit': 'diamonds', 'value': 9 },
  { 'suit': 'diamonds', 'value': 10 },
  { 'suit': 'diamonds', 'value': 11 }, // Jack
  { 'suit': 'diamonds', 'value': 12 }, // Queen
  { 'suit': 'diamonds', 'value': 13 }, // King
  { 'suit': 'hearts', 'value': 1 }, // Ace
  { 'suit': 'hearts', 'value': 2 },
  { 'suit': 'hearts', 'value': 3 },
  { 'suit': 'hearts', 'value': 4 },
  { 'suit': 'hearts', 'value': 5 },
  { 'suit': 'hearts', 'value': 6 },
  { 'suit': 'hearts', 'value': 7 },
  { 'suit': 'hearts', 'value': 8 },
  { 'suit': 'hearts', 'value': 9 },
  { 'suit': 'hearts', 'value': 10 },
  { 'suit': 'hearts', 'value': 11 }, // Jack
  { 'suit': 'hearts', 'value': 12 }, // Queen
  { 'suit': 'hearts', 'value': 13 }, // King
  { 'suit': 'spades', 'value': 1 }, // Ace
  { 'suit': 'spades', 'value': 2 },
  { 'suit': 'spades', 'value': 3 },
  { 'suit': 'spades', 'value': 4 },
  { 'suit': 'spades', 'value': 5 },
  { 'suit': 'spades', 'value': 6 },
  { 'suit': 'spades', 'value': 7 },
  { 'suit': 'spades', 'value': 8 },
  { 'suit': 'spades', 'value': 9 },
  { 'suit': 'spades', 'value': 10 },
  { 'suit': 'spades', 'value': 11 }, // Jack
  { 'suit': 'spades', 'value': 12 }, // Queen
  { 'suit': 'spades', 'value': 13 }, // King
];

const JOKERS = [
  { 'suit': null, 'value': 'Joker' },
  { 'suit': null, 'value': 'Joker' },
];

const shuffleCards = (jokers) => {
  const cards = jokers ? CARDS.concat(JOKERS) : CARDS;
  return _.shuffle(cards);
};

module.exports = shuffleCards;
