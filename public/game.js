'use strict';

const NUM_PILES = 7;
const KING = 13;
const QUEEN = 12;
const JACK = 11;
const ACE = 1;


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
  let imgName = null;
  switch (card.value) {
    case KING:
      imgName = 'king';
      break;
    case QUEEN:
      imgName = 'queen';
      break;
    case JACK:
      imgName = 'jack';
      break;
    case ACE:
      imgName = 'ace';
      break;
    default:
      imgName = card.value;
  }
  const imgURL = card.up ? `img/${imgName}_of_${card.suit}.png` : 'img/card_back.png';
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
  const gameID = getParameterByName('id');
  if (!gameID) {
    window.location = '/start.html';
  }
  const localStorageKey = `gameState-${gameID}`;
  let gameState = null;
  let move = null;

  $('a#profile').attr('href', `/profile?username=${localStorage.getItem('username')}`);

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

      $.ajax({
        type: 'put',
        url: `/v1/game/${gameID}`,
        data: {
          move: move,
        },
        success: ({state}) => {
          // Update localstorage and the UI with the new state
          localStorage.setItem(localStorageKey, state);
          gameState = JSON.parse(state);
          layoutKlondike(gameState);
        },
        error: (xhr, status, error) => {
          // Invalid move
          if (xhr.status === 400) {
          } else {
            alert('Error sending move to server.');
          }
        },
      });

      move = null;
    }
  });

  if (localStorage.getItem(localStorageKey)) {
    gameState = JSON.parse(localStorage.getItem(localStorageKey));
    layoutKlondike(gameState);
  } else {
    // Fetch most recent state from server
    $.ajax({
      type: 'get',
      url: `/v1/game/${gameID}`,
      success: (game) => {
        // If we've started the game already, update localstorage to represent latest state
        if (game.state.length > 0) {
          gameState = JSON.parse(game.state[game.state.length - 1]);
          localStorage.setItem(localStorageKey, JSON.stringify(gameState));
          layoutKlondike(gameState);
        } else {
          // We haven't started this game yet, so fetch random deck from server...
          $.ajax({
            type: 'get',
            url: '/v1/game/shuffle?jokers=false',
            success: (cards) => {
              gameState = constructKlondike(cards);
              // ... and update the state on the server to represent
              // Note: if this seems round-about / redundant, that's bc it is :-)
              $.ajax({
                type: 'put',
                url: `/v1/game/${gameID}`,
                data: {
                  state: JSON.stringify(gameState),
                },
                success: () => {
                  layoutKlondike(gameState);
                  localStorage.setItem(localStorageKey, JSON.stringify(gameState));
                },
                error: (xhr, status, error) => {
                  alert('Error saving initial gamestate.');
                },
              });
            },
            error: (xhr, status, error) => {
              alert('Error retrieving shuffled cards.');
            },
          });
        }
      },
      error: (xhr, status, error) => {
        alert('Error getting game from server.');
      },
    });
  }
});
