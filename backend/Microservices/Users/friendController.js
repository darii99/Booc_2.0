
const { //getCurrentUser:getCurrentUserModel,
        addFriend:addFriendModel,
        deleteFriend:deleteFriendModel } = require("./usersModel");


/* 
async function getCurrentUser(req, res) 
{
    const currentUser = req.query.currentUser;
    var result = await getCurrentUserModel(currentUser);
    
    if (result === null)
    {
        return res.status(500).send({ msg: "Failed to get current user" });
    }

    return res.status(200).send({ msg: "Got current user", user:result });
}
*/

async function addFriend(req, res)
{
    const { friendsUsername, friendIdentifier } = req.body;      // the username and identifier inputted by the user
    const currentUser = req.session.user;                        // retrieve the currently logged in user

    try {
        //pass the data to the addFriend() function in usersModel
        const result = await addFriendModel(currentUser, friendsUsername, friendIdentifier);    

        if (result.status === 404)
        {
            return res.status(404).send({ msg: "Friend not found" });
        }

        if (result.status === 409)
        {
            return res.status(409).send({ msg: "Friend already added" });
        }

        if (result === null)
        {
            return res.status(500).send({ msg: "Failed to add friend" });
        }

    
        return res.status(200).send({ msg: "Added friend" });
    }
    catch (error) {
        console.log("Failed to add friend", error);
        return res.status(500).send({ msg: "Failed to add friend" });
    }
}



//delete friend from friendlist
async function deleteFriend(req, res)
{
    const { currentUserID, friendsUsername, friendIdentifier } = req.body;
    const currentUser = req.session.user;       

    try {
        const result = await deleteFriendModel(currentUserID, friendsUsername, friendIdentifier);
        
        if (result === "Deleted") {
            return res.status(200).send({ msg: "Friend successfully deleted" });
            
        }
        else if (result === "Friend not found") {
            return res.status(404).send({ msg: "Friend not found" });
        }
        else {
            return res.status(500).send({ msg: "Failed to delete friend" });
        }
        
    }
    catch (error) {
        console.log("Failed to delete friend", error);
        return res.status(500).send({ msg: "Failed to delete friend" });
    }
}



module.exports = {
    //getCurrentUser,
    addFriend,
    deleteFriend
}

