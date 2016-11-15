#Overview

For this assignment you are going to add persistence throughout your application.  You will be adding MongoDB into your application stack, and connecting to it using the MongooseJS Node module.

## Add Mongo and Mongoose (10pts)

I would recommend using Docker and Kitematic to easily install MongoDB on your laptop.  Enhance your index.js so that when you start it running, it connects to your Mongo instance.  This needs to be configurable, since we will need your application to connect to our Mongo instance when we test it.  Your connection should define that it connects to a database named the same as your VUNetID, for example mongodb://localhost:33701/heminggs.  You should not need anything more than a simple connection, so don't worry about any advanced configuration parameters.

## Mongoose Schemas (20pts each)

Develop Mongoose schemas for Users and Games.  You know most of the fields that should be included in each of these schemas.  Think of what else is necessary.  In class we explored the initial stages of support for Users.  Expand on this and leverage this knowledge to complete the Games schema.

_User Schema_

* Username
* First name
* Last name
* Primary email
* Hashed password (Either bcrypt or sha512)
* Salt (for password hashing)

_Game Schema_

* Players (An array of refs to Users)
* Start date
* End date
* Status (May use start/end date)
* Creator (Ref to User)
* Turn (Again, a ref to a User)
* State (Array that can hold every step of the state of every type of game)
* Type (Klondyke, etc.)
* Deck (Color, etc.)


## Supported Workflows (50pts)

There are a number of things that need to get upgraded throughout the application.  You need to support CRUD actions for users and games.  This means that a user should be able to register, log in and out, view profiles, modify their profile, and set their account to inactive.  A user should also be able to create a new game, and mark a game as either deleted or completed (these are both valid choices).

* The login page itself doesn't need to change, but the server side now needs to properly support user login and password verification. (5pts)

* From the previous assignment the profile page should recognize if the user is logged in or not and provide the appropriate links to login/register or profile/logout.

* The registration page itself doesn't need to change, but the server side now need to properly support creation of documents in the Users collection in the database. (5pts)

* The profile page should show basic profile information for any registered user.  If the user is logged in and looking at their own page they should have the option to edit their profile.  This information should update the document in the database.  Below the user's profile should be a list of all games they started (since we can not complete games yet).  Don't list all of the info for each game, only show Type, Date, Duration and number of moves.  Clicking on a game should take you to the review game page.  There should also be a link to create a new game.  Render the basic user profile on the server-side with a Pug template, and the list of games should be fetched with an AJAX call and rendered with an Underscore template on the client. (20pts)

* The game creation page itself doesn't need to change, but the server-side needs to properly support game creation in the Games collection. (5pts)

* The review games page should allow the user to see details about the selected game.  Since we don't have moves or the ability to change much, just have nice placeholders for these details.  Think about how you could show a list of individual moves. (20pts).


##Grading Criteria:

Point totals for each criteria are listed above.  Meet the description above and you get all of the points.  As functionality isn't working, visual styling is not as desired, or things are simplly missing, points will be deducted.

Submission:

Ensure your files are in a clean and organized folder hierarchy.  Make sure your package.json is complete and up-to-date.  Commit all necessary files (not node_modules) to your GitHub repository.  Grading will follow the same script as last assignment:

* Clone student's repo
* Run ```npm install``` and all dependencies are installed
* Run ```npm start``` and the web app is running
* Navigate to localhost:8080 and the grader is on the landing page

Your repo must be compliant with these steps.  It is easy to practice this on your local machine to ensure you have everything in the right place.
