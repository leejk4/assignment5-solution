### Overview
For this assignment you are going to be adding Javascript to your client to enhance its behavior.  Listed below are the enhancement you need to make.  Carefully follow the directions and submit a ZIP of all of the needed files to Blackboard.  A new server file has been created for you.  Make sure you use it instead of the one supplied last assignment.

You are primarily adding Javascript to your pages.  You should write all of the JS in separate files from the HTML.  Beyond calling functions from events, you should not have JS in your HTML.  Use of jQuery or other 3rd party libraries is encouraged but not required.

### Enhancements
#### Better user feedback in Login, Register and Create Game

We need our pages to work better and actually validate the user’s inputs.  We have three forms that need validation support: login, register, and create game.  

For the Login form, change the behavior to not submit using the default form behavior.  Instead capture the button click and perform an AJAX POST request to the path /v1/session with a JSON body.  The data should contain the username and password the user entered into the form.  The response from the server will either be a 201 CREATED and some additional user information, or a 4XX error meaning that the user did not provide a valid username/password.  On a 201, do a client-side redirect (Google window.location) to /start.html.  On a 4XX error, display a nice error message in the login window to let the user know login failed.

For the Register page we want to make sure the user is entering information in the right format.  Validate that their username is between 6-16 characters and contains only alphanumeric characters.  The password should also be greater than 8 characters and contain a lower-case, an upper-case, a number and a symbol.  The primary email address should be a valid looking email address.  Just like the Login page, capture the Submit button click and perform an AJAX POST to /v1/user and look for either a 201 CREATED, or a 4XX error.  On success, redirect to /profile.html?username=***newusername***.  Of course, replace with the appropriate new user name.

Follow the same instructions for the Create Game page.  It should validate all any appropriate inputs and perform an AJAX POST to /v1/game and look for the return status code.  On success redirect to /game.html?id=***newgameid***.  The newgameid value will be returned in a successful AJAX response.

5 bonus points if the transition from the forms to the next pages are animated in someway, such as swooshing left or right.

#### Data for our Profiles and Game Reviews

With the above directions in mind, hopefully you see what is coming here.  Now the profile and game pages are really just templates.  Once the pages have loaded, get the ID parameters from the query string.  I.e. from ?username=foo get foo.  Use this to perform an AJAX query to fetch data from the server with GET requests to /v1/user/***username*** and /v1/game/***planid***.  Get the JSON back from the server and populate the pages appropriately.

#### Clicky, clicky in our Cards

There are a number of events we want to recognize  in the game view, but for now let’s focus on clicking and dragging cards.  Do the following incrementally, to build up your understanding of how user events can be handled within your javascript code.  All of these activities should be within your main game page.

1. When a user’s mouse is clicked down, print to the console the X, Y screen location of the mouse.
2. Do the same when a user releases the mouse button
3. If the user clicks and drags the mouse, print out a drag distance in pixels
4. Identify which card the user has clicked on and print out it's identity
5. If the user clicks on the card located in the center of the screen they can click-drag it and it will move around following the mouse

5 bonus points if the user can click and drag any of the 17 cards on the screen


#### Application Landing Page
Create a simple landing page for the / path.  It must have links to the Register and Login pages.  Add any additional marketing type of material, be creative.  It doesn't have to be fancy, but should look nice.
5 bonus points will be awarded to the single best looking Landing Page as judged by myself and the TA.  This is completely subjective.

### Grading Criteria
Every page’s enhancements are worth equal points, except for the main game screen, it's worth double.  Meet the description above and you get all of the points.  As functionality isn't working, visual styling is not as desired, or things are simply missing, points will be deducted.

### Submission
Gather all of your files and zip them into an archive.  Then, please submit a ZIP archive to Blackboard.
