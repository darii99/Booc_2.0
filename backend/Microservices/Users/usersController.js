const usersModel = require('./usersModel.js');


//For user authentication
async function userAuth(req, res) {
    const {email, password} = req.query;

    try {
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
        //Test if user exists
        if(!req.session.user){
            //logger.logInfo('Session not found', { userId: null });
            return res.status(401).send({msg:"Cannot find session"});
        }

        //Updates user session before returning it
        const databaseUser = await usersModel.getUserWithUsername(req.session.user.username, req.session.user.identifier);
        req.session.user = {id:req.session.id, ...databaseUser, password:req.session.user.password, socket:req.session.socket};
        
        //Returns user session
        if(!req.session.user){
            return res.status(401).send({msg:"Not authenticated"})
        }

        //logger.logInfo('User session retrieved successfully', { userId: req.session.user.id });
        return res.status(200).send(req.session.user);
    }
    catch(err){
        console.log(err);
        //logger.logError('Failed to retrieve current user session', { error: err.message });
        return res.status(500).send({msg:"Failed to get current user"});
    }
    
}


//Create user
async function createUser(req, res){
    const {body: {email, username, password}} = req;

    const result = await usersModel.createUser(email, username, password);

    if(result === "All identifiers used"){
        //logger.logError('Failed to create user: All identifiers used', { username });
        return res.status(500).send({msg:"All identifiers used for this username"});
    }
    //console.log(result);
    if(typeof result !== "undefined"){
        req.session.user = {id:req.session.id, ...result, password:password, socket:req.session.socket};
        //logger.logInfo('User created successfully', { userId: req.session.user.id });
        return res.status(200).send({msg:"Created user"});
    }
    else{
        //logger.logError('Failed to create user', { username });
        return res.status(500).send({msg:"Failed to create user"});
    }
}





async function changeStartPage(req, res) {
    const result = await usersModel.changeStartPage(req.session.user.email, req.session.user.password, req.body.startPage);
    if(result){
        return res.status(200).send({msg:"Changed start page"});
    }
    else{
        return res.status(500).send({msg:"Failed to change start page"});
    }
}


async function changePassword(req, res) {
    const result = await usersModel.changePassword(req.session.user.email, req.session.user.password, req.body.password);
    if(result){
        //Change the session to be the new password
        req.session.user.password = req.body.password;

        return res.status(200).send({msg:"Changed users password"});
    }
    else{
        return res.status(500).send({msg:"Failed to change password"});
    }
}


async function deleteUser(req, res) {
    try{
        const result = await usersModel.deleteUser(req.session.user.email, req.session.user.password);

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




