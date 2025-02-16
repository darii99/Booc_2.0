# Booc
In this fork we will migrate Booc to the cloud!  

Booc is an event scheduling app. 
By adding friends and joining groups you can invite others to your events. Keep track of everything on your personal page.


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
3. Open cmd (in the current directory) and enter ```npm ci``` (this requires node.js).
4. Enter ```npm start``` in cmd.

Starting backend server
---------
1. Clone repository
2. Go into "backend" folder.
3. Open cmd in current directory and enter ```npm ci``` (this requires node.js).
4. Create a .env file (currently you need one .env in the backend directory, one in backend/Microservices/Events and one in backend/Microservices/Groups).
5. Enter your username and password for the mongodb connection string in the .env file. The format should be:
```
DB_USERNAME = place username here  
DB_PASSWORD = place password here  
SESSION_SECRET = place your session secret here
```

- If you want to connect to a database other than the one setup by us, then change the following in backend:  
    - In app.js change line 49 to your connection string  (uri:)  
    - In ./model/mongodbStarter.js change line 9 and 12 to your connection string  
    - Observe that this connection string should preferably set its user with process.env.DB_USERNAME, and process.env.DB_PASSWORD to avoid leaking the connection string.  
    - The connection string also decides which database in the cluster is used to so set it to an appropriate name. (This is the /Booc? part of the connection string where booc is the database name).  

6. For debugging run ```SET DEBUG=backend:* & npm start``` in the cmd (this has a problem with doing it in vscode) or if you are running it for production ```npm start```.
   

Starting gateway
---------
1. Clone repository
2. Open "backend" in cmd
4. Run ```node gateway.js```


Starting microservices
---------
1. Clone repository
2. Open "backend/Microservices/Users" in cmd
3. Run ```npm ci```
4. Run ```node userService.js```


Do the same for the other microservices.    
"backend/Microservices/Events" ```node eventService.js```  
"backend/Microsevices/Groups" ```node groupService.js```  




List of Features
----------
- user accounts
- security (password encryption)
- create and join events
- create and join groups
- add friends
- personal page with your scheduled events
- change password

Main Entities
----------
users, events, groups

