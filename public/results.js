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
  const gameID = getParameterByName('id');
  $.get(`/v1/game/${gameID}`)
  .done((result) => {
    $("#duration").html(result.duration);
    $("#points").html(result.points);
  })
  .fail((err) => {
    alert('Error receiving game. Please try again.');
    console.error(err);
  });
});
