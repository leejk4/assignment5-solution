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

  $('img').draggable();

  // Fetch random deck from server
  $.ajax({
    type: 'get',
    url: '/v1/game/shuffle?jokers=false',
    success: (cards) => {
      const gameState = constructKlondike(cards);
      console.log(gameState);
      localStorage.setItem('gameState', JSON.stringify(gameState));
    },
    error: (xhr, status, error) => {

    },
  });
});
