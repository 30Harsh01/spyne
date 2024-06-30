Flow of Project

conn.js
When the application starts, it connects to the MongoDB database using Mongoose..
index.js
The Express server is initialized.
Middleware for handling CORS and parsing JSON requests is set up.
The database connection is established by calling connectToMongogo.
The server listens on a specified port for incoming requests.
Route files for authentication, discussion, comments, and likes are included and mounted on specific API paths.
middleware/auth.js
Middleware checks if incoming requests have a valid JWT token.
It verifies the token and attaches the user information to the request object.
Routes requiring authentication use this middleware to protect them.
Routes and Schemas
routes/auth.js
Register User:
Endpoint for new users to register.
Require user details, hashes the password, from the body and saves the user to the database.
Generates JWT token
Login User:
Endpoint for users to log in.
Validates credentials and generates a token upon successful login.
Get User Details:
Protected endpoint that returns user information based on the token.
Such as name email mobile
routes/discussion.js
Create Discussion:
Endpoint for creating a new discussion.
Requires user authentication.
Saves the discussion to the database, linking it to the authenticated user.
Get Discussions:
Endpoint for fetching all discussions.
Can include pagination and filtering options.
Update Discussion:
Endpoint for updating a discussion.
Requires user authentication and checks if the user owns the discussion.
Delete Discussion:
Endpoint for deleting a discussion.
Requires user authentication and checks if the user owns the discussion.
routes/comment.js
Add Comment:
Endpoint for adding a comment to a discussion.
Requires user authentication.
Get Comments:
Endpoint for fetching comments for a specific discussion.
Delete Comment:
Endpoint for deleting a comment.
Requires user authentication and checks if the user owns the comment.
routes/like.js
Like Discussion:
Endpoint for liking a discussion.
Requires user authentication.
Like Comment:
Endpoint for liking a comment.
Requires user authentication.
Get Likes:
Endpoint for getting the like count for a discussion or comment.

Api / Endpoints 

There are total 18 apis that I am using for different purposes

USER

1.http://localhost:5000/api/auth/createuser
Method-post
Using this Api for creating the user
This will take name email mobile password from the user
2. http://localhost:5000/api/auth/login
Method-post
This api is working to login the user 
One user is logged in a jwt is generated that will be used further for various purposes
This api takes email or mobile and password
It checks the bcryptjs password which is encoded during the time of signup
3.http://localhost:5000/api/auth/getusers
Method-get
Header- Auth-token
Use to find all users
Protected api
4.http://localhost:5000/api/auth/updateuser/
Method-put
Header- Auth-token
User can update his/her id using this api 
Takes all the parameters that are provided at the time of signup
5.http://localhost:5000/api/auth/deleteuser
Method-delete
Header- Auth-token
User can delete his/her account using this 
This is also protected i.e no other user can delete another user’s account
6.http://localhost:5000/api/auth/getuserbyname
Method-Get
Header- Auth-token
Take String of name as user input
Any one who is using the application can search user by name

Discussion

1.http://localhost:5000/api/discussion/creatediscussion
Method-post
Header auth-token
Using this Api for creating the discussion
This will take description, image and tag 
2.http://localhost:5000/api/discussion/fetchalldiscussions
Method Get
Header auth-token
Fetch all the discussions
3.http://localhost:5000/api/discussion/updatediscussion/667fd8cfdd8bbd497c6ef416
Method Put
Header auth-token
Update the decisions
Take description,  img,  tag from user
4.http://localhost:5000/api/discussion/deletediscussion/667fd943ad0d08428e7fe80a
Method delete
Header auth-token
Use to delete the decisions
5.http://localhost:5000/api/discussion/fetchdiscussionsbytag
Method post
Header auth-token
Require tag from the body
Fetch all the discussions

Comment

1.http://localhost:5000/api/comment/comment/668000522fc1920a3bc2fb33
Method post
Header auth-token
Take the comment form the body 
Take the comment _id from the url
2.http://localhost:5000/api/comment/editcomment/668129131ed0f14c402ec570
Method put
Header auth-token
Take _id of comment form url 
Edit the comment of specific user only
3.http://localhost:5000/api/comment/comment/668129131ed0f14c402ec570
Method Delete
Header auth-token
Use to delete the comment by taking comment _id

Likes

1.http://localhost:5000/api/like/likeondiscussion/667fdc7fdcd09b6067150d58
Method post
Headed auth-token
Use to like the specific discussion by taking discussion id from url
2.http://localhost:5000/api/like/unlikeondiscussion/667fdc7fdcd09b6067150d58
Use to unlike the discussion
Method post
Header auth token
Take the discussion _id from url
3.http://localhost:5000/api/like/likeoncomment/668129f31ed0f14c402ec57b
Method Post
Header auth-token
Use to like the specific comment
4.http://localhost:5000/api/like/unlikeoncomment/668129f31ed0f14c402ec57b
Method Post
Header auth-token
Use to unlike any comment



