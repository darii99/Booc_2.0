const {startmongoose} = require('../../Model/mongodbStarter.js');
const users = require("./userSchema.js");
const argon2 = require('argon2');



//
async function getUserWithUsername(username, identifier){
    startmongoose();
    const user = await users.findOne({
        $and: [
            {"username":username},
            {"identifier":identifier}
        ],
    });

    if(user === null){return null;}
    const objUser = user.toObject();

    if(typeof objUser === "undefined"){
        return null;
    }
    
    return objUser;
}




//Gets user with the same email and password
async function getUser(email, password){
    startmongoose();
    const user = await users.findOne({
        "email":email,
    });
    if(user === null){return null;}
    const objUser = user.toObject();


    if(typeof objUser === "undefined"){
        return null;
    }
    
    if(await argon2.verify(objUser.password, password)){
        return objUser;
    }
    else{
        return "Failed to find";
    }
}


//Create user
async function createUser(email, username, password) {
    startmongoose();
    try{
        //Find smallest identifier within 9999
        var smallestAvailableIdentifier = 0;
        console.log("Started querry");
        try{
            smallestAvailableIdentifier = (await users.find({"username":username}).sort({"identifier":-1}).limit(1))[0].identifier;

            smallestAvailableIdentifier++;
            if(typeof smallestAvailableIdentifier === "undefined"){
                smallestAvailableIdentifier = 0;
            }
        }
        catch(err){
            console.log("Failed to find smallest identifier defaulting to 0");
            //console.log(err);
            smallestAvailableIdentifier = 0;
        }
        //console.log("Found smallest number: " + smallestAvailableIdentifier);
        if(0 > smallestAvailableIdentifier){
            //Invalid indexing has occoured
            console.log("To low of a identifier was attempted to be assigned");
            return "undefined"; //This should never happen
        } 
        else if(smallestAvailableIdentifier > 9999){
            console.log("Too high of a identifier was attempted to be assigned");
            return "All identifiers used"; //For the username
        }
        

        //Create the user
        const hashedPassword  = await argon2.hash(password);
        const newUser = new users({email, username,identifier:smallestAvailableIdentifier, password:hashedPassword});
        //console.log(newUser);
        await newUser.save();
        return newUser.toObject(); //success
    }
    catch{
        return; //failed
    }
}


async function changeStartPage(email, password, newStartPage) {
    startmongoose();
    const user = await users.findOne({
        "email":email,
    })
    if(!user){
        return 0; //Cannot find user
    }

    try{
        if(await argon2.verify(user.password, password)){
            const result = await users.updateOne({"email":email}, {"startingPage":newStartPage});
            return result; //Will return 1 if sucessfull
        } 
    }
    catch{
        return 0;
    }
}


async function changePassword(email, password, newPassword) {
    startmongoose();
    const user = await users.findOne({
        "email":email,
    })
    if(!user){
        return 0; //Cannot find user
    }

    try{
        if(await argon2.verify(user.password, password)){
            newPassword = await argon2.hash(newPassword) //Hashes the password
            const result = await users.updateOne({"email":email}, {"password":newPassword});
            return result; //Will return 1 if sucessfull
        } 
    }
    catch{
        return 0;
    }
}


//Delete user
async function deleteUser(email, password){
    startmongoose();
    const user = await users.findOne({
        "email":email,
    })

    if(!user){
        return 0; //Failed to delete
    }

    try{
        if(await argon2.verify(user.password, password)){
            const result = await user.deleteOne({"email":email});
            return result; //Will return 1 if sucessfull
        } 
    }
    catch{
        return 0;
    }
    
}



async function addFriend(currentUser, friendsUsername, friendIdentifier) 
{
    startmongoose();
    
    try {
        const user = await users.findOne({ username: currentUser.username });   //find the currently logged in user by username

        if (!user) {
            throw new Error("Current user not found");
        }


        
        //check if the friend (user) exists in the database
        const friendExists = await users.findOne({ username: friendsUsername, identifier: friendIdentifier });
        
        if (!friendExists)
        {
            return { status: 404, msg: "Friend not found" };
        }


        
        //check if the friend (user) is already in the friendList
        const friendAlreadyAdded = user.friendList.some(check => check.username === friendsUsername && check.identifier === friendIdentifier);
        
        if (friendAlreadyAdded)
        {
            return { status: 409, msg: "Friend already added" };
        }



        //add the new friend's username and identifier to the current user's friendlist
        user.friendList.push({ "username":friendsUsername, "identifier":friendIdentifier });

        //add the current user to the friend's friendlist
        friendExists.friendList.push({ "username": currentUser.username, "identifier": currentUser.identifier });



        //save the updated friendlists of the current user and the added friend to the database
        await user.save();          
        await friendExists.save();

        return user.toObject();     //return the updated user as an object
        
    }
    catch (error) {
        console.log("Failed to update friendlist", error);
        return null;
    }
}



//delete friend from friendlist
async function deleteFriend(currentUserID, friendsUsername, friendIdentifier)
{
    startmongoose();

    try{

        //remove the friend from the currently logged in user's friendlist
        const result = await users.updateOne(
            { _id: currentUserID },
            { $pull: {
                friendList: {
                    username: friendsUsername,
                    identifier: friendIdentifier
                }
            }}
        );
    
        if (result.modifiedCount === 0) {
            return "Friend not found";
        }
        


        //remove the currently logged in user from the friend's friendlist as well
        const currentUser = await users.findById(currentUserID);

        const deleteUserFromFriend = await users.updateOne(
            { username: friendsUsername, identifier: friendIdentifier },
            { $pull: { 
                friendList: {
                    username: currentUser.username,
                    identifier: currentUser.identifier
                }
            }}
        );

        
        if (deleteUserFromFriend.modifiedCount === 0)
        {
            console.log("Error when removing current user from friend's friendlist");
        }


        return "Deleted";
    
    }
    catch (error) {
        console.log("Failed to delete friend", error);
        return null;
    }
}




//Reset password
//TO DO, will need access to a mailing service
//For sending email: https://www.w3schools.com/nodejs/nodejs_email.asp
//Tutorial: https://dev.to/cyberwolves/how-to-implement-password-reset-via-email-in-node-js-132m 

module.exports = {
    getUser,
    createUser,
    changePassword,
    deleteUser,
    changeStartPage,
    //getCurrentUser,
    getUserWithUsername,
    addFriend,
    deleteFriend,
}
