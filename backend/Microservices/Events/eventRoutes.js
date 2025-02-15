var express = require('express');
var router = express.Router();


const {authenicate, authStatus, removeAuth} = require("../../Controller/authController");
const {getCurrentUser} = require('../Users/usersController');

const {addFriend, deleteFriend} = require('../../Controller/friendController');
const { createEvent, deleteEvent, getEvents } = require('../Events/eventController');


//Authorization
router.post("/auth", authenicate);
//router.get("/auth", authStatus);
//router.delete("/auth", removeAuth);

//Users
router.get("/users", getCurrentUser);
//router.post("/users", createUser);
//router.put("/users", changeStartPage);
//router.delete("/users", deleteUser);

//Friend
//router.post("/users/addFriend", addFriend);
//router.delete("/users/deleteFriend", deleteFriend);

//Password
//router.put("/password", changePassword);

//Group
//router.get("/group", getGroup);
//router.post("/group", createGroup);
//router.put("/group", updateGroup);
//router.delete("/group", deleteGroup);

//Groups
//router.get("/groups", getAllGroups);
//router.delete("/groups", leaveGroup);

//Events
router.get("/event", getEvents);
router.post("/event", createEvent);
router.post("/event", createEvent);
router.delete("/event", deleteEvent);




module.exports = router;









