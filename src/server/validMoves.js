const NUM_PILES = 7;
const NUM_STACKS = 4;

const ACE = 1;
const KING = 13;

const isRed = function(card) {
  return card.suit === 'diamonds' || card.suit === 'hearts';
}

const canMoveToPile = function(card, pile) {
  // Check if the pile is empty. If so, we can only move a KING into it.
  if (pile.length === 0) {
    return card.value === KING;
  } else {
    const pileCard = pile[pile.length - 1];
    return isRed(pileCard) !== isRed(card) && card.value === pileCard.value - 1;
  }
}

const canMoveToStack = function(card, stack) {
  // Check if the stack is empty. If so, we can only move an ACE into it.
  if (stack.length === 0) {
    return card.value === ACE;
  } else {
    const toCard = stack[stack.length - 1];
    return card.suit === toCard.suit && card.value - 1 === toCard.value;
  }
}

const validMoves = function(state) {
    let results = [];

    // Generate possibilies moving from each pile
    for (let i = 1; i < NUM_PILES + 1; i++) {
      const fromPile = state[`pile${i}`];

      // Loop through each card in the pile
      fromPile.forEach((fromCard, fromIndex) => {
        // Get to the face up part of the pile
        if (!fromCard.up) {
          return;
        }

        // Check the bottom of each other pile
        for (let j = 1; j < NUM_PILES + 1; j++) {
          // Skip the "move from" pile...
          if (j === i) {
            continue;
          }

          // Check if we can move it to the bottom of the pile
          const toPile = state[`pile${j}`];
          if (canMoveToPile(fromCard, toPile)) {
            results.push({
              cards: fromPile.slice(fromIndex, fromPile.length),
              src: `pile${i}`,
              dst: `pile${j}`,
            });
          }
        }

        // Also check all of the stacks
        for (let j = 1; j < NUM_STACKS + 1; j++) {
          const toStack = state[`stack${j}`];
          if(canMoveToStack(fromCard, toStack)) {
            results.push({
              cards: fromPile.slice(fromIndex, fromPile.length),
              src: `pile${i}`,
              dst: `stack${j}`,
            });
          }
        }
      });
    }

    // Generate possibilies moving from the discard pile
    if (state.discard.length > 0) {
      const topOfDiscard = state.discard[state.discard.length - 1];

      // Check if we can move it to a pile
      for (let i = 1; i < NUM_PILES + 1; i++) {
        const toPile = state[`pile${i}`];
        if (canMoveToPile(topOfDiscard, toPile)) {
          results.push({
            cards: [topOfDiscard],
            src: 'discard',
            dst: `pile${i}`,
          });
        }
      }

      // Check if we can move it to a stack
      for (let i = 1; i < NUM_STACKS + 1; i++) {
        const toStack = state[`stack${i}`];
        if (canMoveToStack(topOfDiscard, toStack)) {
          results.push({
            cards: [topOfDiscard],
            src: 'discard',
            dst: `stack${i}`,
          });
        }
      }
    }

    // Generate possibilies moving from each stack
    for (let i = 1; i < NUM_STACKS + 1; i++) {
      const fromStack = state[`stack${i}`];
      const card = fromStack[fromStack.length - 1];
      if (fromStack.length === 0) {
        continue;
      }

      // Check if we can move it to a pile
      for (let j = 1; j < NUM_PILES + 1; j++) {
        const toPile = state[`pile${i}`];
        if (canMoveToPile(card, toPile)) {
          results.push({
            cards: [card],
            src: `stack${i}`,
            dst: `pile${i}`,
          });
        }
      }
    }

    return results;
};

module.exports = validMoves;
