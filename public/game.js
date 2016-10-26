'use strict';

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
});
