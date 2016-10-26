'use strict';

$(document).ready(function() {
  $('form').submit(function(e) {
    e.preventDefault();

    // http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
    const formData = {};
    $(e.target).serializeArray().map(function(x){formData[x.name] = x.value;});

    $.post('/v1/session', formData)
    .done((result) => {
      window.location = 'start.html';
    })
    .fail((err) => {
      alert('Could not authenticate user. Please try again.');
      console.error(err);
    });
  });
});
