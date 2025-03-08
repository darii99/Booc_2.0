const usersModel = require('../Microservices/Users/usersModel');

//Checks if the given credentials are a valid login.
async function authenicate(req, res){
    //Extract parameters from req
    const {body: {email, password}} = req;

    //Check auth
    const user = await usersModel.getUser(email, password);

    //Exists
    if(!user || user == null || user == "Failed to find"){
        console.log("Invalid credentials");
        return res.status(401).send({msg: "Bad credentials"});
    }
    else{
        console.log("Valid credentials");
        //Updates session
        const recastUser = user;
        req.session.user = {...recastUser, password:password};
        //res.cookie("user", recastUser, );
        const {startingPage: startingPage} = recastUser;
        return res.status(200).send({msg: "Valid credentials", startingPage:startingPage});
    }
}



//Check if user is logged in
async function authStatus(req, res){
    //const {body: {email, password}} = req;
    try{
        //console.log(req.session.user.email);
        //console.log(req.session.user.password);
        const user = await usersModel.getUser(req.session.user.email, req.session.user.password);
        //console.log(user);
        if(typeof req.session.user === "undefined"|| typeof user === "undefined" || user === "Failed to find" || user === null){
            return res.status(401).send({msg:"Not authenticated"})
        } 
        return res.status(200).send({msg:"You are authenticated"});
    }
    catch{
        return res.status(401).send({msg:"Not authenticated"})
    }
}

async function removeAuth(req, res) {
    try{
        req.session.destroy();
        return res.status(200).send({msg:"Logged out"});
    }
    catch{
        return res.status(500).send({msg:"Failed to log out"});
    }
    
}



module.exports = {
    authenicate,
    authStatus,
    removeAuth,
}

