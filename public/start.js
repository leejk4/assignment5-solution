'use strict';

$(document).ready(function() {
  if (!loggedIn()) {
    window.location = '/login.html';
  }

  $('form').submit(function(e) {
    e.preventDefault();

    // http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
    let formData = {};
    $(e.target).serializeArray().map(function(x){formData[x.name] = x.value;});

    // Set fields the server expects
    formData.num_players = 2;

    $.post('/v1/game', formData)
    .done((result) => {
      window.location = `/game.html?id=${result.planid}`
    })
    .fail((err) => {
      if (err.status === 401) {
        alert('Unauthorized!');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        window.location = '/login.html';
      } else {
        alert('Error starting game. Please try again.');
        console.error(err);
      }
    });
  });
});
