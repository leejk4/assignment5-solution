'use strict';

const EDITABLE_FIELDS = ['first_name', 'last_name', 'username', 'primary_email', 'address_city'];
let isEditing = false;

const getGravitarURL = (email) => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}`;
}

const toggleEditing = () => {
  // If our editing is complete, PUT to the server
  if (isEditing) {
    const username = getParameterByName('username');

    // Gather data to send to server
    const data = {};
    EDITABLE_FIELDS.forEach(p => {
      data[p] = $(`#${p}`).val();
    });

    // Perform PUT to update object on server
    $.ajax({
      url: `/v1/user/${username}`,
      type: 'PUT',
      data,
      success: () => {
        // In case email or username changed, update localStorage
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.primary_email);

        // Update the UI to not be editable. Note we wait until success to do this.
        EDITABLE_FIELDS.forEach(p => {
          $(`#${p}`).prop('disabled', isEditing);
        });
        isEditing = !isEditing;
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Unauthorized');
          localStorage.clear();
          window.location = '/login.html';
        } else {
          alert('Error signing up. Please try again.');
          console.error(err);
        }
      }
    });
  } else {
    EDITABLE_FIELDS.forEach(p => {
      $(`#${p}`).prop('disabled', isEditing);
    });
    isEditing = !isEditing;
  }
};

$(document).ready(function() {
  const username = getParameterByName('username');
  $.get(`/v1/user/${username}`)
  .done((result) => {
    $("#first_name").val(result.first_name);
    $("#last_name").val(result.last_name);
    $("#username").val(result.username);
    $("#primary_email").val(result.primary_email);
    $("#address_city").val(result.address_city);
    $('img#user_gravitar').attr('src', getGravitarURL(result.primary_email));
  })
  .fail((err) => {
    alert('Error receiving profile. Please try again.');
    console.error(err);
  });

  if (loggedIn()) {
    $('a#logout').show();
    $('a#start').show();

    const email = localStorage.getItem('email');
    $('img#my_gravitar').attr('src', getGravitarURL(email)).show();

    if (username === localStorage.getItem('username')) {
      $('#edit').css('display', 'block');
    }
  } else {
    $('a#register').show();
    $('a#login').show();
  }

  $('button#edit').click(e => toggleEditing());
});
