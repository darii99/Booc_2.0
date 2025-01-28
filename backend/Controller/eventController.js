
const eventModel = require('../model/eventModel');
const { logInfo, logError } = require('../services/logger.js');
const {createEvent:createEventModel,
        deleteEventModel,
        checkIfCreator} = eventModel;
        


function inviteToObject(array){
    return {username:array[0], identifier:array[1]};
}
const { sendToSocket, getSocket } = require("../model/io_socket");

//create event
async function createEvent(req, res){

    const { body: { title, date, fromTime, toTime, location, description, color, repeat, visibility, invitePeople } } = req;
    const createdBy = req.session.user;
    const mappedInvite = invitePeople.map(inviteToObject); //Transforms the [[]] to [{}]

    const result = await createEventModel(title, date, fromTime, toTime, location, description, color, repeat, visibility, mappedInvite, createdBy);

    if (result)
    {
        //Send notification to all group members
        for(const {username, identifier} of invitePeople){
            const emitted_obj = {Type:"Create group", Cause:`${req.session.user.username}#${req.session.user.identifier}`,}
            await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
        }
        return res.status(201).send({result});                          // 201 Created
    }
    else
    {
        return res.status(400).send({msg:"Failed to create event"});    // 400 Bad Request
    }
}



//delete event
async function deleteEvent(req, res) {

    const { body: { _id } } = req;


    //check if the user is the creator of the event
    try {

        const isEventCreator = await checkIfCreator(_id, req.session.user.username, req.session.user.identifier);

        console.log("Event creator:", isEventCreator);


        if (isEventCreator === null)
        {
            console.log("User does not have the authority to delete this event");
            return res.status(403).send({ msg: "User does not have the authority to delete this event"});       // 403 forbidden
        }

    } catch (error) {
        console.log("Failed to check if user is the event creator", error);
        return res.status(500).send({ msg: "Failed to check if user is the event creator"});
    }
    //Get event
    //invited people:
    
    //delete the event
    const result = await deleteEventModel(_id);

    if (result === null)
    {
        return res.status(500).send({msg:"Couldn't Delete Event"});     // 500 error
    }
    
    return res.status(200).send({msg:"Event Deleted"});              // 200 OK
}




// Get users events
async function getEvents(req, res){
    try{
        var uName = req.session.user.username;
        var uId = req.session.user.identifier;

        var result = await eventModel.getEvents(uName, uId);
        //console.log(`I controller så ser result ut såhär`, result);
        if (result === null) {
            console.log("Failed to get events");
            return res.status(500).send({msg:"Failed to get events"});
        }
        return res.status(200).send({msg:"Got group", group:result});
    }
    catch(err){
        console.log("Failed to get events");
        console.log(err);
        return res.status(500).send({msg:"Failed to get events"});
    }
    
}



module.exports = {
    createEvent,
    deleteEvent,
    getEvents
}
