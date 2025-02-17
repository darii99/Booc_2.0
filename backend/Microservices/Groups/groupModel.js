const { startmongoose } = require('./mongodbStarter.js');
const groups = require("./groupSchema.js");

//Get info about group for recreating form
async function getGroup(groupName){
    startmongoose();

    const group = await groups.findOne({
        groupName:groupName,
    });

    if(group === null){return null;}
    const objGroup = group.toObject();

    return objGroup;
}

//Get all groups a person is in ---------------------------------------------------------------------------------------------------------------------------------------TO DO, TODO
async function getAllGroups(username, identifier){
    startmongoose();
    try{
        const user = {username, identifier};
        const group = await groups.find({
            $or: [
                {owners: {$all:[user]}},
                {members:{$all:[user]}},
            ]
        });
        /*
        console.log("The following is the group: \n");
        console.log(group);
        console.log(group[0].owners[0]);
        */

        if(!Array.isArray(group) || !group.length){
            console.log("Failed to find groups");
            return null;
        }
        return group;
    }
    catch(err){
        console.log("Failed to get the users groups");
        console.log(err);
        return null;
    }
    

    
}

//Create group
async function createGroup(groupName, owner, members){
    startmongoose();
    try{
        //Create the user
        const newGroup = new groups({groupName,owners:owner, members});
        //console.log(newUser);
        await newGroup.save();
        return newGroup.toObject(); //success
    }
    catch{
        return null; //failed
    }
}  

//Update group
async function updateGroup(currentGroupName, groupName, owners, members, previous_owner){
    startmongoose();
    try{
        const newGroup = await groups.findOneAndReplace({groupName:currentGroupName}, {groupName, owners, members});

        //Removes previous owner from member list
        try{
            await groups.findOneAndReplace({groupName}, {$pull:{members: [previous_owner]}} );
        }
        catch(err){
            console.log("Attampted to remove owner from members");
        }
        


        await newGroup.save();
        console.log("Updated",newGroup);
        return newGroup.toObject(); //success
    }
    catch(err){
        console.log("Failed to update group");
        console.log(err);
        return null; //failed
    }
}

//Delete group
async function deleteGroup(groupName){
    startmongoose();
    try{
        const deleted = (await groups.deleteOne({
            groupName:groupName,
        })).deletedCount;
        if(deleted){
            return "Deleted"
        }
        else{
            return null;
        }
        
    }
    catch(err){
        console.log("Failed deletion of group");
        console.log(err);
        return null;
    }
}

async function checkIfOwner(groupName, username, identifier) {
    startmongoose();

    //Checks if the user is a owner of the group
    const user = {username, identifier};
    console.log(user, " Attempted to change group", groupName);
    const group = await groups.findOne({
        $and: [
            {groupName},
            {owners: {$all:[user]}}
        ]
    });
    console.log(group);
    if(!group || group == null){return null;}
    return 1; //Found group where user is owner
    
}

async function leaveGroup(groupName, username, identifier) {
    startmongoose();
    try{
        const user = {username, identifier};
        //Finds if the user is in the group
        const filter = {
            $and: [
                {groupName},
                {
                    $or: [
                        {owners: {$all:[user]}},
                        {members:{$all:[user]}},
                    ]
                },
            ]
        }

        
        //Leaves group
        const group1 = await groups.updateOne(filter, {
            $pullAll : {
                owners:[user]
            },
        })
        const group2 = await groups.updateOne(filter, {
            $pullAll : {
                members:[user]
            },
        })

        const finalModifiedCount = group1?.modifiedCount + group2?.modifiedCount;
        if(finalModifiedCount === 0){return null;}

        //Deletes group if no owners
        const groupData = await getGroup(groupName);
        if(!Array.isArray(groupData.owners) || !(groupData.owners.length)){
            console.log("No owners detected of '" + groupName + "' deleting group.");
            deleteGroup(groupName);
        }

        return groupData;
    }
    catch(err){
        console.log("Failed to get the users groups");
        console.log(err);
        return null;
    }
}

module.exports = {
    getGroup,
    getAllGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup,
    checkIfOwner
}