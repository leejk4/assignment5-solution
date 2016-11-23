'use strict';

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {
  if (localStorage.getItem('username')) {
    $('a#profile').attr('href', `/profile?username=${localStorage.getItem('username')}`);
  } else {
    $('a#profile').remove();
  }

  const gameID = getParameterByName('id');
  $.get(`/v1/game/${gameID}`)
  .done((result) => {
    $("#name").html(result.name);
    $("#type").html(result.type);
    $("#drawNumber").html(result.draw_num);
    if (result.startDate && result.endDate) {
      $("#duration").html(result.endDate - result.startDate);
    }
    $("#numMoves").html(result.state.length);
  })
  .fail((err) => {
    alert('Error receiving game. Please try again.');
    console.error(err);
  });
});
