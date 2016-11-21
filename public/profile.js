'use strict';

const EDITABLE_FIELDS = ['first_name', 'last_name', 'username', 'primary_email', 'address_city'];
let isEditing = false;

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
  $('button#edit').click(e => toggleEditing());
});
