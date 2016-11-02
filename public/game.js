'use strict';

const NUM_PILES = 7;

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

const generateCardImg = (card, row, col, stackCount = 0) => {
  const imgURL = card.up ? `img/${card.value}_of_${card.suit}.png` : 'img/card_back.png';
  const CARD_WIDTH = 200;
  const CARD_HEIGHT = 290;
  const CELL_PADDING = 25;
  const top = (CARD_HEIGHT + CELL_PADDING) * row + CELL_PADDING + (stackCount * 20);
  const left = (CARD_WIDTH + CELL_PADDING) * col + CELL_PADDING;
  return `<img class='card' src='${imgURL}' style='top:${top}px;left:${left}px;' />`;
};

const layoutKlondike = (gameState) => {
  // It's faster to build up the HTML and only alter the DOM once.
  let gameContent = '';
  gameState.draw.forEach(card => {
    gameContent += generateCardImg(card, 0, 0);
  });
  gameState.discard.forEach(card => {
    gameContent += generateCardImg(card, 0, 1);
  });
  for (let i = 1; i < 5; i++) {
    const key = `stack${i}`;
    gameState[key].forEach(card => {
      gameContent += generateCardImg(card, 0, i + 2);
    });
  }
  for (let i = 1; i < NUM_PILES + 1; i++) {
    const key = `pile${i}`;
    gameState[key].forEach((card, idx) => {
      gameContent += generateCardImg(card, 1, i - 1, idx);
    });
  }
  $('div#game').html(gameContent);
  $('img').draggable();
};

$(document).ready(function() {
  let startX, startY;

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

  $('img').on('mousedown', function(e) {
    e.preventDefault();
    const splitSource = e.target.src.split('/');
    const cardName = splitSource[splitSource.length - 1];
    console.log(`Clicked card: ${cardName}`);
  });

  // Fetch random deck from server
  $.ajax({
    type: 'get',
    url: '/v1/game/shuffle?jokers=false',
    success: (cards) => {
      const gameState = constructKlondike(cards);
      layoutKlondike(gameState);
      localStorage.setItem('gameState', JSON.stringify(gameState));
    },
    error: (xhr, status, error) => {
      alert('Error retrieving shuffled cards.');
    },
  });
});
