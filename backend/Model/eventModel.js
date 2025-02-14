const mongoose = require('mongoose');
const events = require("./schemas/eventSchema");
const users = require("../Microservices/Users/userSchema");
const {startmongoose} = require('./mongodbStarter');


//create event
async function createEvent(title, date, fromTime, toTime, location, description, color, repeat = 'never', visibility = 'private', invitePeople = [], createdBy)
{
    startmongoose();                                        //initialize the mongoose connection

    try{
        const currentUser = {
            username: createdBy.username,
            identifier: createdBy.identifier,
        }
        if (!currentUser) {
            return 0;
        }


        const newEvent = new events({
            title,
            date,
            fromTime,
            toTime,
            location,
            description,
            color,
            repeat,
            visibility,
            invitePeople,
            createdBy: currentUser    
        });
        
        

        await newEvent.save();                              //saves the event to the database
        return newEvent;                                    //success
    }
    catch (error) {
        console.error('Failed to create event:', error);    //logs the error
        return null;                                        //failed
    }
}



async function checkIfCreator(_id, username, identifier)
{
    startmongoose();

    const user = { username, identifier: String(identifier) };


    console.log("Checking if the user is the event creator:", user);

    const event = await events.findOne({
        _id
    });
    if (!event) {
        console.log(`Event with id ${_id} not found`);
        return null;
    }

    /* 
    const event = await events.findOne({
        _id,
        createdBy: user
    });
    */

    console.log("Event found:", event);


    if (event === null)
    {
        return null;
    }

    return 1;
}



//delete event
async function deleteEventModel(_id) 
{
    startmongoose();

    try {
        const deleted = (await events.deleteOne({
            _id:_id
        })).deletedCount;

        if (deleted) {
            return "Deleted";
        } else {
            return null;
        }
    }
    catch (error) {
        console.log('Failed to delete event:', error);
        return null;
    }
}





// Get users events
async function getEvents(username, identifier){
    startmongoose();
    try {
        const user = {username, identifier};
        const event = await events.find({
            $or: [
                {"createdBy.username": username, "createdBy.identifier": identifier},
                { "invitePeople": { $elemMatch: { "username": username, "identifier": identifier } } },
            ]
        })
        .sort({ date: 1 });
        
        // if (event.length > 0) {
        //     console.log(`Hittade ${event.length} event(s) skapat av ${user.username}`);
        // } else {
        //     console.log(`Inga events under ${user.username}`);
        // }

        if (!Array.isArray(event) || !event.length) {
            console.log("No events returned, returning null");
            return null;
        }
        return event;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}



module.exports = {
    createEvent,
    checkIfCreator,
    deleteEventModel,
    getEvents
}

