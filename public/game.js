'use strict';

const NUM_PILES = 7;

// Keep a mapping of id to card in the state. Each card has a unique ID (0-51).
// This allows us to easily map DOM objects (say, from event handlers) to our state.
const IdStateCardMap = {};

const constructKlondike = (cards) => {
  const gameState = {
    stack1: [],
    stack2: [],
    stack3: [],
    stack4: [],
    discard: [],
  };
  for (let i = 1; i < NUM_PILES + 1; i++) {
    gameState[`pile${i}`] = [];
    for (let j = 0; j < i; j++) {
      const card = cards.pop();
      card.up = (j == i - 1);
      gameState[`pile${i}`].push(card);
    }
  }
  gameState.draw = cards.map(card => {
    card.up = false;
    return card;
  });
  return gameState;
};

const generateCardImg = (card, key, id, row, col, stackCount = 0) => {
  const imgURL = card.up ? `img/${card.value}_of_${card.suit}.png` : 'img/card_back.png';
  const CARD_WIDTH = 200;
  const CARD_HEIGHT = 290;
  const CELL_PADDING = 25;
  const top = (CARD_HEIGHT + CELL_PADDING) * row + CELL_PADDING + (stackCount * 20);
  const left = (CARD_WIDTH + CELL_PADDING) * col + CELL_PADDING;

  // Add the <id, card> entry to the map
  IdStateCardMap[`card-${id}`] = {location: key, card};

  return `<img class='card' id='card-${id}' src='${imgURL}' style='top:${top}px;left:${left}px;' />`;
};

const layoutKlondike = (gameState) => {
  // Counter to give each card in state a unique ID (0-51)
  let counter = 0;
  // It's faster to build up the HTML and only alter the DOM once.
  let gameContent = '';
  gameState.draw.forEach(card => {
    gameContent += generateCardImg(card, 'draw', counter++, 0, 0);
  });
  gameState.discard.forEach(card => {
    gameContent += generateCardImg(card, 'discard', counter++, 0, 1);
  });
  for (let i = 1; i < 5; i++) {
    const key = `stack${i}`;
    gameState[key].forEach(card => {
      gameContent += generateCardImg(card, key, counter++, 0, i + 2);
    });
  }
  for (let i = 1; i < NUM_PILES + 1; i++) {
    const key = `pile${i}`;
    gameState[key].forEach((card, idx) => {
      gameContent += generateCardImg(card, key, counter++, 1, i - 1, idx);
    });
  }

  $('div#game').html(gameContent);
  // $('img').draggable();
};

$(document).ready(function() {
  let gameState = null;
  let move = null;

  let startX, startY;

  $('a#profile').attr('href', `/profile?username=${localStorage.getItem('username')}`);

  $('body').mousedown((e) => {
    startX = e.clientX;
    startY = e.clientY;
    console.log(`Mousedown at: ${startX}, ${startY}`);
  });

  $('body').mouseup((e) => {
    const endX = e.clientX;
    const endY = e.clientY;
    console.log(`Mouseup at: ${e.clientX}, ${e.clientY}`);
    if (startX !== endX || startY !== endY) {
      const v = Math.pow((endX - startX), 2);
      const u = Math.pow((endY - startY), 2);
      const dist = Math.sqrt(v + u);
      console.log(`Mouse dragged: ${dist}`);
    }
  });

  $(document).on('click', 'img', (e) => {
    const {location, card} = IdStateCardMap[e.target.id];

    // Ignore cards that are face down
    if (!card.up) {
      return;
    }

    if (!move) { // 1st click
      const stack = gameState[location];
      const startIdx = stack.indexOf(card);
      const endIdx = stack.length;

      move = {
        // Ensure we move all cards in the stack on top of the selected card
        cards: stack.slice(startIdx, endIdx),
        src: location,
        dst: null,
      };
    } else { // 2nd click
      move.dst = location;

      // TODO: Finalize the move!
      console.log(move);

      move = null;
    }
  });

  // Fetch random deck from server
  $.ajax({
    type: 'get',
    url: '/v1/game/shuffle?jokers=false',
    success: (cards) => {
      gameState = constructKlondike(cards);
      layoutKlondike(gameState);
      localStorage.setItem('gameState', JSON.stringify(gameState));
    },
    error: (xhr, status, error) => {
      alert('Error retrieving shuffled cards.');
    },
  });
});
