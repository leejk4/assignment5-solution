#Overview

For this assignment you are to continuing to expand on the card game playing application we built in Assignments #1 and #2.  Listed below are the requirements for the specific enhancements you need to make and how they will be graded.  Follow the directions closely and the site will that much closer to being usable.


##Enhancements

###A. Standard Structure \& Submission using GitHub

 * I will send out a link via email that you must follow to create a GitHub repository specific to this assignment.  Clicking on the link will have automatically forked this repo as your starting point.  You must commit and push all of your changes to your personal repo by the assignment deadline.  We will not accept any submissions via Blackboard, email, or anything else.  ONLY GITHUB submissions will be accepted.

 * Since I am providing you with a common starting point, your project structure will also be standardized.  Look at the directory hierarchy.  You should follow this structure and not alter it.


###B. Get your game on!!

We need to start building actual card playing logic and capabilities into our application.  So, lets start small and build up over the next few assignments.  Here is what you need to enable:

* Build a new server-side route (GET /v1/game/shuffle?jokers=false) - The jokers false query parameter indicates we only want 52 cards, not including any jokers.  The return from this call should be a JSON array that is a randomized set of shuffled cards.  This route should be in its own module that is imported using ```require``` in your index.js. The returned JSON array should be of the following form:

```
[{ "suit": "clubs", "value": 7 }, { "suit": "diamonds", "value": 12 }, ... ]
```

* We need to start laying out the cards according to the game we want to play.  The first game we will attempt to implement will be simple [Klondike Solitare](https://en.wikipedia.org/wiki/Klondike_(solitaire)).  When your game.html page loads it should fetch a randomized deck from the server (see above point).  With the deck in hand, build a client-side JSON data structure that encodes the initial state of your Klondike game.  You must follow the rules of the game in terms of how many cards go in each pile, which are face up or down, etc.  Save this structure into localStorage.  It should look something like this:
 
 ```
{
     pile1: [{"suit": "clubs", "value": 7, "up": false}, {"suit": "diamonds", "value": 12, "up": false}, ...],
     pile2: [...],
     ...
     pile7: [...],
     stack1: [...],
     ...
     stack4: [...],
     draw: [...],
     discard: [...]
}
```

* Lastly, using the above data structure, render the game onto the game.html page with cards in the appropriate places according to the game rules.  Cards should face up and down correctly and the overall game page should layout like the Klondike game shown in the wiki page.


###C. Add client-side state

The game screen is not your entire application.  We need to build the rest of our application to support it.  So, we need to enable all of the normal functions our users expect.  For example, once a user logs in, they should be recognized as logged in until they log out.  This awareness should persist even on reload of the browser.

Here are the criteria for this task:

* On the profile page show a link to the register and login pages by default.  If a person has logged in, remove these links and replace it with the person's Gravatar icon (based on their email address).  If logged in, they should also have a link to log out (though this will not do anything for now).

* On the profile page, we want a user to be able to edit their profile.  So, on the profile page, if the profile is for the same username as the one the user is logged in as, make an edit button visible.  This button should navigate the user to /edit.html.  For now, nothing needs to actually be at this address.

* Only let a logged-in user go to the start page to initiate a new game.  Have the start.html page check if a user is logged in.  If not, automatically redirect them to the login.html page.  The profile.html page should also only display the link to the start.html page if the user is logged in.



###D. Build your server-side pipeline

We have a lot to do on the server side, so let's get started.  First, we need to get our ExpressJS pipeline up to speed.  

Here are the criteria for this task:

* Ensure logging is in the pipeline and start using it.  Check out the Morgan module for ExpressJS.  We want to log all non-static requests.  I.e. if the request is for something outside of the public folder, log it to the console.  We don't want anything logged for static requests.  Add some logging output for the shuffle route discussed above.

* Add session support.  Use a simple configuration of the express-session module.  We don't need a fancy session store (like Redis).  Just use the default in-memory store.  This isn't ideal, but we will improve on it.  Have sessions expire after 30 days.  We want to easily be able to identify if a session has authenticated or not.  Add ```username``` to the session with the appropriate value once a user logs in.


###E. Make life easy for Sam

Let's make life easy for our dear grader.  I have given you a shell of the package.json file in this repo.  You need to complete it so that the grader follow these steps to have your application running:

* Clone student's repo
* Run ```npm install``` and all dependencies are installed
* Run ```npm start``` and the web app is running
* Navigate to localhost:8080 and the grader is on the landing page

Your repo must be compliant with these steps.  It is easy to practice this on your local machine to ensure you have everything in the right place.


##Grading Criteria:

Each requirement is worth 1/6 of the total points, so 16.66 points.  Except for requirement B, this is worth double.  Meet the description above and you get all of the points.  As functionality isn't working, visual styling is not as desired, or things are simply missing, points will be deducted.


##Submission:

As mentioned above, you must submit by committing and pushing your repo to GitHub.  PERIOD.
