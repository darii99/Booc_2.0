const usersModel = require('./usersModel');
const jwt = require('jwt-express');
const axios = require('axios');



//Checks if the given credentials are a valid login.
async function authenicate(req, res){
    try{
        //Extract parameters from req
        const {body: {email, password}} = req;   
        const response = await axios.get(`http://user-microservice/api/auth`, {params: {email: email, password: password}});  

        if(response.data) {
            user = response.data.user;
        }

        //Exists
        if(!user || user == null || user == "Failed to find"){
            console.log("Invalid credentials");
            return res.status(401).send({msg: "Bad credentials"});
        }
        else{
            console.log("valid credentials");
            //Updates session
            const recastUser = user;
            //req.session.user = {...recastUser, password:password};
            //res.cookie("user", recastUser, );
            const {startingPage: startingPage} = recastUser;
            const token = (jwt.create(process.env.SESSION_SECRET, {...recastUser, password:password})).token;
            return res.status(200).send({msg: "Valid crendentials", startingPage:startingPage, token});
        }
    }
    catch (err){
        console.log(err);
        return res.status(500).send({msg: "Invalid credentials"});
    }
}




//Check if user is logged in
async function authStatus(req, res){
    //const {body: {email, password}} = req;
    try{
        //console.log(req.session.user.email);
        //console.log(req.session.user.password);
        const user = (await axios.get(`http://user-microservice/api/auth`, {params: {email: req.jwt.payload.email, password: req.jwt.payload.password}})).data.user;
        //console.log(user);
        if(typeof user === "undefined"|| user === "Failed to find" || user === null){
            return res.status(401).send({msg:"Not authenticated"})
        } 
        return res.status(200).send({msg:"You are authenticated"});
    }
    catch(err){
        console.log("Not authenticated: ", err);
        return res.status(401).send({msg:"Not authenticated"})
    }
}



async function removeAuth(req, res) {
    try{
        //req.session.destroy();
        return res.status(200).send({msg:"Logged out", token:null});
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

