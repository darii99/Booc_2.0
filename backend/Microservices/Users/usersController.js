const usersModel = require('./usersModel.js');


//For user authentication
async function userAuth(req, res) {
    try { 
        const {email, password} = req.query;
        //try to find a user with matching email and password in the database
        const user = await usersModel.getUser(email, password);
        return res.status(200).send({user: user});
    }
    catch(err) {
        console.log("Authentication error:", err);
        return res.status(500).send({ msg: "Failed to authenticate user" });
    }
}



//Get user info
async function getCurrentUser(req, res){
    try{
        const {username, identifier} = req.query;

        //Updates user session before returning it
        const databaseUser = await usersModel.getUserWithUsername(username, identifier);
        return res.status(200).send({user: databaseUser});
    }
    catch(err){
        console.log("Could not get current user", err);
        //logger.logError('Failed to retrieve current user session', { error: err.message });
        return res.status(500).send({msg:"Failed to get current user"});
    }
    
}

//Create user
async function createUser(req, res){
    try{
        const {email, username, password} = req.body;
        const result = await usersModel.createUser(email, username, password);

        return res.status(200).send({user: result});
    }
    catch(err){
        console.log("Could not create user", err);
        return res.status(500).send({msg:"Failed to create user"});
    }
}



async function changeStartPage(req, res) {
    const {email, password, startPage} = req.body;
    const result = await usersModel.changeStartPage(email, password, startPage);
    if(result){
        return res.status(200).send({msg:"Changed start page"});
    }
    else{
        return res.status(500).send({msg:"Failed to change start page"});
    }
}


async function changePassword(req, res) {
    const {email, password, newPassword} = req.body;
    const result = await usersModel.changePassword(email, password, newPassword);
    if(result){
        return res.status(200).send({msg:"Changed users password"});
    }
    else{
        return res.status(500).send({msg:"Failed to change password"});
    }
}


async function deleteUser(req, res) {
    try{
        const {email, password} = req.body;
        const result = await usersModel.deleteUser(email, password);

        if(result){
            return res.status(200).send({msg:"Deleted user"});
        }
        else{
            return res.status(500).send({msg:"Failed to delete user"});
        }
    }
    catch(err){
        console.log("Failed to delete user");
        console.log(err);
        return res.status(500).send({msg:"Failed to delete user"});
    }
}





module.exports = {
    userAuth,
    getCurrentUser,    
    createUser,
    deleteUser,
    changeStartPage,
    changePassword,
}




