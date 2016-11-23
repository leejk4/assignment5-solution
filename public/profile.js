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
  const username = getParameterByName('username');
  const templateString = `
    <table>
      <thead>
        <tr>
          <td>Type</td>
          <td>Start Date</td>
          <td>Duration</td>
          <td># Moves</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <% _.each(games, (game) => { %>
          <tr>
            <td><%- game.type %></td>
            <td><%- moment(game.startDate).format('MMMM Do YYYY, h:mm:ssa') %></td>
            <% if (game.endDate){ %>
              <td><%- moment(game.endDate - game.startDate) %></td>
            <% } else { %>
              <td>N/A</td>
            <% } %>
            <td><%- game.state.length %></td>
            <td><a href="/results.html?id=<%- game._id %>">⇗</a></td>
          </tr>
        <% }); %>
      </tbody>
    </table>
  `;

  $.ajax({
    url: `/v1/user/${username}/game`,
    type: 'GET',
    success: (games) => {
      const gameTableTemplate = _.template(templateString);
      $("table#gameList").html(gameTableTemplate({games}));
    },
    error: (err) => {
      alert('Error loading game list. Please try again.');
      console.error(err);
    },
  });

  $('button#edit').click(e => toggleEditing());
});
