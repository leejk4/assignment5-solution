#Overview

For this assignment you are going to add gameplay logic and actions to your application.


##Let the User Move a Card (20pts + 2x10pt bonuses)

In an earlier assignment you enabled users to move a card, but there was no game structure at that point.  Now you must allow the user to move one or more cards:

 * From one of the seven piles to another of the seven piles (one or more cards)
 * From one of the seven piles to one of the four stacks (one card)
 * From one of the four stacks to one of the seven piles (one card)
 * From the discard pile to one of the seven piles (one card)

The simplest way of approaching this is to maintain some state in the client.  The user clicks some card once to select it (and the cards below it in a pile) and then clicks another card to identify where the card is to be moved.  The user should not be able to click a card that is face-down.

We can capture the requested move in JSON as follows:

```{ cards: [{"suit": "clubs", "value": 7}], src: "pile1", dst: "stack2" }```

Print out this structure for the requested move to get your points.  We are going to send this to the server shortly.

***BONUS***: In addition to the two-click method, allow the user to drag-and-drop card(s) from the source to the destination.

***BONUS***: On the first click visually highlight the card(s) that are being selected.  Once one or more cards have been selected pressing the 'ESC' key or clicking on a face-down card will deselect the cards, removing the highlighting.


##Validate Moves (50pts)

Implement a server-side module that exports one function.  Here is the starting point of what I am looking for:

```
let validMoves = function(state) {
    let results = [];
    ...
    return results;
};

module.exports = validMoves;
```

It takes in a "state" object as described in assignment 3. It must output a list of all valid moves, each in the format specified above.  _Hint_: for now you only need to consider the face-up cards in the piles and the top card in each of the stacks and discard.  There actually aren't that many combinations!



##Send the Move Request (30pts)

Now that our clients are generating move JSONs, and we have some means of knowing if they are valid or not, we need to bring it all together.

* After the user has clicked the second card to generate the move JSON, execute an AJAX PUT to /v1/game/:gameID with the JSON data for the move
* The server-side must have a route handler that receives this request.  It must validate that the user is logged in, is the owner of the game
* Finally, we have to make sure the move is valid.  So call validMoves() with game's state info.  Now all you need to do is check the requested move against the list of valid moves.
* If the requested move is not valid, send an appropriate error back to the client
* If the move is valid, update the game's state, push the new state into the state array, save the document to the DB and send success, and the new state, back to the client
* If the client should receive an error, restore the visual state to match the valid prior state
* If the client should receive a success, update the visual state to match the send new state


##Grading Criteria:

Point totals for each criteria are listed above.  Meet the description above and you get all of the points.  As functionality isn't working, visual styling is not as desired, or things are simply missing, points will be deducted.

##Submission:

Ensure your files are in a clean and organized folder hierarchy.  Make sure your package.json is complete and up-to-date.  Commit all necessary files (not node_modules) to your GitHub repository.  Grading will follow the same script as last assignment:

* Clone student's repo
* Run ```npm install``` and all dependencies are installed
* Run ```npm start``` and the web app is running
* Navigate to localhost:8080 and the grader is on the landing page

Your repo must be compliant with these steps.  It is easy to practice this on your local machine to ensure you have everything in the right place.
