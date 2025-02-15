const {getGroup:getGroupModel, 
    getAllGroups:getAllGroupsModel,
    createGroup:createGroupModel,
    updateGroup:updateGroupModel,
    deleteGroup:deleteGroupModel,
    leaveGroup:leaveGroupModel,
    checkIfOwner} =  require("../model/groupModel");



    
function inviteToObject(array){
    return {username:array[0], identifier:array[1]};
}


//Get info about group for recreating form
async function getGroup(req, res){
    //Gets info
    const groupName = req.query.groupName;
    var result = await getGroupModel(groupName);
    if(result === null){
        return res.status(500).send({msg:"Failed to get group"});
    }
    return res.status(200).send({msg:"Got group", group:result});
}



//Get all groups a person is in
async function getAllGroups(req, res){
    try{
        var result = await getAllGroupsModel(req.session.user.username, req.session.user.identifier);
        if(result === null){
            return res.status(500).send({msg:"Failed to get groups"});
        }
        return res.status(200).send({msg:"Got groups", groups:result});
    }
    catch{
        return res.status(500).send({msg:"Failed to get groups"});
    }
}



//Create group
async function createGroup(req, res){
    const {body : {groupName, members}} = req
    try{
        if(!groupName || groupName == ""){
            console.log("There was an attempt to create a group with an empty name");
            return res.status(500).send({msg:"Failed to create group"});
        }
        const owner = [{username:req.session.user.username, identifier:req.session.user.identifier}];
        const memberObjectArray = members.map(inviteToObject);
        var result = await createGroupModel(groupName, owner, memberObjectArray);
        if(result === null){
            return res.status(500).send({msg:"Failed to create group"});
        }
        return res.status(200).send({msg:"Created group"});
    }
    catch{
        return res.status(500).send({msg:"Failed to create group"});
    }
    
}  

//Update group
async function updateGroup(req, res){
    try{
        const {body : {currentGroupName, groupName, owners, members}} = req
        console.log("Current:",currentGroupName);
        console.log("GroupName:",groupName);
        console.log("Owners:", owners);
        console.log("Members", members);
        try{
            if(!groupName || groupName == ""){
                console.log("There was an attempt to update a group with an empty name");
                return res.status(500).send({msg:"Failed to update"});
            }
            const isOwner = await checkIfOwner(currentGroupName, req.session.user.username, req.session.user.identifier);
            if(!isOwner || isOwner === null || isOwner == 0){
                return res.status(403).send({msg:"User does not have the authority to update group"});
            }
        }
        catch(err){
            console.log("Failed to check if the user had authority to delete");
            console.log(err);
        }

        //Update group
        try{
            var result = await updateGroupModel(currentGroupName, groupName, owners, members, {username:req.session.user.username, identifier:req.session.user.identifier});
            if(result === null){
                return res.status(500).send({msg:"Failed to update group"});
            }

            return res.status(200).send({msg:"Updated group"});
        }
        catch(err){
            console.log("Failed to update");
            throw err;
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).send({msg:"Failed to update group"});
    }
}



//Delete group
async function deleteGroup(req, res){
    const {body : {groupName}} = req
    try{
        if((await checkIfOwner(groupName, req.session.user.username, req.session.user.identifier)) === null){
            console.log("User does not have the authority to delete group")
            return res.status(403).send({msg:"User does not have the authority to delete group"});
        }
    }
    catch(err){
        console.log("Failed to check if the user had authority to delete");
        console.log(err);
        return res.status(500).send({msg:"Failed to check if the user had authority to delete"});
    }
    
    //Get group
    var members = await getGroupModel(groupName).members;

    //delete group
    var result = await deleteGroupModel(groupName);
    if(result === null){
        return res.status(500).send({msg:"Failed to delete group"});
    }

    return res.status(200).send({msg:"Deleted group"});
}



//Takes groupname and if the user is in it then leave
async function leaveGroup(req, res) {
    try{
        const {body : {groupName}} = req;
        var result = await leaveGroupModel(groupName, req.session.user.username, req.session.user.identifier);
        if(result === null){
            return res.status(500).send({msg:"Failed leave group"});
        }
        
        //delete group if empty
        const groupState = (await getGroupModel(groupName))?.owners[0];
        console.log("Group state:", groupState);
        if(!(groupState?.username) || !(groupState?.identifier)){
            var result = await deleteGroupModel(groupName);
            if(result === null){
                return res.status(200).send({msg:"Left group"});
            }
        }
        return res.status(200).send({msg:"Left group"});
    }
    catch(err){
        console.log(err);
        return res.status(500).send({msg:"Failed leave group"});
    }
}


module.exports = {
    getGroup,
    getAllGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup
}