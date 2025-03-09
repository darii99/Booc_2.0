const usersModel = require('./usersModel');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'booc2secret';

// Generate JWT Token
function generateToken(user) {
    const payload = { email: user.email };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Set expiry time as needed
}

// Authenticate user and issue a JWT token
async function authenticate(req, res) {
    const { email, password } = req.body;

    // Check if user exists and credentials are correct
    const user = await usersModel.getUser(email, password);

    if (!user || user === "Failed to find") {
        console.log("Invalid credentials");
        return res.status(401).send({ msg: "Bad credentials" });
    }

    console.log("Valid credentials");

    // Generate JWT token
    const token = generateToken(user);

    const { startingPage } = user;
    return res.status(200).send({ msg: "Valid credentials", startingPage, token });
}

// Check if the user is authenticated by verifying the JWT token
async function checkAuthStatus(req, res) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).send({ msg: "Not authenticated" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await usersModel.getUser(decoded.email);

        if (!user || user === "Failed to find") {
            return res.status(401).send({ msg: "Not authenticated" });
        }

        return res.status(200).send({ msg: "You are authenticated" });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send({ msg: "Not authenticated" });
    }
}

// Logout by deleting the token on client-side (No need to destroy session)
async function removeAuth(req, res) {
    return res.status(200).send({ msg: "Logged out" }); // Token-based logout is handled client-side
}

module.exports = {
    authenticate,
    checkAuthStatus,
    removeAuth,
};

/* 
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
        console.log("valid credentials");
        //Updates session
        const recastUser = user;
        req.session.user = {...recastUser, password:password};
        //res.cookie("user", recastUser, );
        const {startingPage: startingPage} = recastUser;
        return res.status(200).send({msg: "Valid crendentials", startingPage:startingPage});
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

*/