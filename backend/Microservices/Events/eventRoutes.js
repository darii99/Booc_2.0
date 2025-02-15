var express = require('express');
var router = express.Router();


const {userAuth} = require('../Users/usersController');
const { createEvent, deleteEvent, getEvents } = require('../Events/eventController');


//Authorization
router.get("/auth", userAuth);

//Events
router.get("/event", getEvents);
router.post("/event", createEvent);
router.post("/event", createEvent);
router.delete("/event", deleteEvent);




module.exports = router;


