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

const loggedIn = () => {
  return localStorage.getItem('username') !== null;
};

const getGravitarURL = (email) => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}`;
}

$(document).ready(function() {
  const username = getParameterByName('username');
  $.get(`/v1/user/${username}`)
  .done((result) => {
    $("#name").html(`${result.first_name} ${result.last_name}`);
    $("#username").html(result.username);
    $("#primary_email").html(result.primary_email);
    $("#address_city").html(result.address_city);
    $('img#user_gravitar').attr('src', getGravitarURL(result.primary_email));
  })
  .fail((err) => {
    alert('Error receiving profile. Please try again.');
    console.error(err);
  });


  if (loggedIn()) {
    $('a#register').hide();
    $('a#login').hide();
    $('a#logout').show();
    const email = localStorage.getItem('email');
    $('img#my_gravitar').attr('src', getGravitarURL(email)).show();
  } else {
    $('a#register').show();
    $('a#login').show();
    $('a#logout').hide();
  }
});
