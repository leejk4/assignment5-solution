'use strict';

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
    $('a#start').show();
    const email = localStorage.getItem('email');
    $('img#my_gravitar').attr('src', getGravitarURL(email)).show();
  } else {
    $('a#register').show();
    $('a#login').show();
    $('a#logout').hide();
    $('a#start').hide();
  }
});
