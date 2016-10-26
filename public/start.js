'use strict';

$(document).ready(function() {
  $('form').submit(function(e) {
    e.preventDefault();

    // http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
    let formData = {};
    $(e.target).serializeArray().map(function(x){formData[x.name] = x.value;});

    // Set fields the server expects
    formData.deck_type = 'deck_type';
    formData.name =  'name';
    formData.num_players = 2;

    $.post('/v1/game', formData)
    .done((result) => {
      window.location = `/game.html?id=${result.planid}`
    })
    .fail((err) => {
      alert('Error starting game. Please try again.');
      console.error(err);
    });
  });
});
