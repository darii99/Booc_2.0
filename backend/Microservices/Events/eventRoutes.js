var express = require('express');
var router = express.Router();

//const {userAuth} = require('../Users/usersController');
const { createEvent, deleteEvent, getEvents } = require('./eventController');


//Events
router.get("/event", getEvents);
router.post("/event", createEvent);
router.post("/event", createEvent);
router.delete("/event", deleteEvent);

//User
//router.get("/auth", userAuth);



module.exports = router;


