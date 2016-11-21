'use strict';

$(document).ready(function() {
  $('form').submit(function(e) {
    e.preventDefault();

    // http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
    const formData = {};
    $(e.target).serializeArray().map(function(x){formData[x.name] = x.value;});

    $("#error").hide();
    const valid = [validateUsername, validatePassword].every(validator => {
      const error = validator(formData);
      if (error) {
        $("#error").text(error).show();
        return false;
      }
      return true;
    });

    if (!valid) {
      return;
    }

    $.post('/v1/user', formData)
    .done((result) => {
      localStorage.setItem('username', result.username);
      localStorage.setItem('email', result.primary_email);
      window.location = `/profile.html?username=${result.username}`
    })
    .fail((err) => {
      alert('Error signing up. Please try again.');
      console.error(err);
    });
  });
});

const ALPHANUMERIC_REGEX_PATTERN = /^[a-z0-9]+$/i;
const LOWERCASE_REGEX_PATTERN = /[a-z]/;
const UPPERCASE_REGEX_PATTERN = /[A-Z]/;
const NUMBER_REGEX_PATTERN = /[0-9]/;
// http://stackoverflow.com/questions/8359566/regex-to-match-symbols
const SYMBOL_REGEX_PATTERN = /[$-/:-?{-~!"^_`\[\]]/;

const validateUsername = function(data) {
  const {username} = data;
  if (username.length < 6 || username.length > 16) {
    return 'Username must be between 6-16 characters';
  } else if (!ALPHANUMERIC_REGEX_PATTERN.test(username)) {
    return 'Username must be alphanumeric';
  }
};

const validatePassword = function(data) {
  const {password} = data;
  if (password.length < 8) {
    return 'Password must be greater than 8 characters';
  } else if (!LOWERCASE_REGEX_PATTERN.test(password)) {
    return 'Password must contain a lowercase letter';
  } else if (!UPPERCASE_REGEX_PATTERN.test(password)) {
    return 'Password must contain a uppercase letter';
  } else if (!NUMBER_REGEX_PATTERN.test(password)) {
    return 'Password must contain a number';
  } else if (!SYMBOL_REGEX_PATTERN.test(password)) {
    return 'Password must contain a symbol';
  }
};
