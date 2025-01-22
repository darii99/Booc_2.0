# Booc
This is an app where you can create and schedule meetings and events. Don't miss any events by following people and get a notice when someone uploads a new event. Keep track of everything on your personal page.


Group 3 - List of members
---------
Github handle - Firstname Lastname

* darii99 - Darina Larsen
* sodqv - Sara Odqvist



Tools
----------
[Material UI Components](https://mui.com/material-ui/all-components)


Starting app on client
---------
1. Clone repository.
2. Go into "frontend" folder.
3. Open cmd (in the current directory) and enter "npm ci". (This requires node.js)
4. then enter "npm start" in cmd.

Starting server
---------
1. Clone repository
2. Go into "Backend" folder.
3. Open cmd in current directory and enter "npm ci". (This requires node.js)
4. Create an .env file (in the backend directory) and enter your username and password for the mongodb connection string in the format:  
DB_USERNAME = place username here  
DB_PASSWORD = place password here  
SESSION_SECRET= place your session secret here

    -If you want to connect to a database other than the one setup by us, then change the following in backend:  
    in app.js change line 49 to your connection string  (uri:)  
    in ./model/mongodbStarter.js change line 9 and 12 to your connection string  
    observe that this connection string should preferably set its user with process.env.DB_USERNAME, and process.env.DB_PASSWORD to avoid leaking the connection string.  
    The connection string also decides which database in the cluster is used to so set it to an appropriate name. (This is the /Booc? part of the connection string where booc is the database name).  

5. For debugging run "SET DEBUG=backend:* & npm start" in the cmd(this has a problem with doing it in vscode) or if you are running it for production "npm start".

Preliminary List of Features
----------
- user accounts
- create events
- join events
- security(password encryption)
- personal page with your scheduled events
- follow other users, see other users events
- reset password
- notification, user roles

Main Entities
----------
users, events, groups

