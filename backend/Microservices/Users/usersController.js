const usersModel = require('./usersModel.js');
const jwt = require('jsonwebtoken');

// Secret key for signing JWT
const secretKey = 'booc2secret';

const generateToken = (user) => {
    if (!user || !user.id) {
        throw new Error('User or User ID is undefined');
    }
    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });
    return token;
};

/*
// Function to generate a JWT token
function generateToken(user) {
    return jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
}
*/

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(403).json({ msg: "No token provided" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Invalid or expired token" });
        }

        // Attach decoded user data to the request object
        req.user = decoded;  // This contains userId and email from the token
        next();
    });
}

/*
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
}*/

// User authentication
async function userAuth(req, res) {
    const { email, password } = req.query;

    try {
        const user = await usersModel.getUser(email, password);
        if (!user) {
            return res.status(401).send({ msg: "Invalid credentials" });
        }

        const token = generateToken(user);
        return res.status(200).send({ token, user });
    } catch (err) {
        console.log("Authentication error:", err);
        return res.status(500).send({ msg: "Failed to authenticate user" });
    }
}



/*
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
    
}*/

// Get user info (token-based)
async function getCurrentUser(req, res) {
    try {
        // The token verification middleware adds the 'user' data to the request object
        const userId = req.user.userId;  // Extract userId from the decoded JWT token

        // Fetch user details from the database using the userId from the token
        const user = await usersModel.getUserById(userId);

        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        // Return the user data
        return res.status(200).send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Failed to get current user" });
    }
}
/*
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
}*/

async function createUser(req, res) {
    try {
        const { email, username, password } = req.body;

        // Insert user into database
        const newUser = await usersModel.createUser(email, username, password);
        console.log('New user created:', newUser); // Log the user object

        if (!newUser || !newUser.id) {
            return res.status(500).json({ msg: 'Failed to create user' });
        }

        const token = generateToken(newUser);
        console.log('Generated token:', token); // Log the token

        return res.status(201).json({ msg: 'User created successfully', token });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ msg: 'Failed to create user' });
    }
}
/*
// Create user
async function createUser(req, res) {
    const { email, username, password } = req.body;

    try {
        const result = await usersModel.createUser(email, username, password);
        if (result === "All identifiers used") {
            return res.status(500).send({ msg: "All identifiers used for this username" });
        }

        const token = generateToken(result);
        return res.status(200).send({ msg: "Created user", token });
    } catch (err) {
        console.log("Failed to create user", err);
        return res.status(500).send({ msg: "Failed to create user" });
    }
}*/

/*
async function changeStartPage(req, res) {
    const result = await usersModel.changeStartPage(req.session.user.email, req.session.user.password, req.body.startPage);
    if(result){
        return res.status(200).send({msg:"Changed start page"});
    }
    else{
        return res.status(500).send({msg:"Failed to change start page"});
    }
}*/

// Change start page
async function changeStartPage(req, res) {
    try {
        const result = await usersModel.changeStartPage(req.user.email, req.body.startPage);
        if (result) {
            return res.status(200).send({ msg: "Changed start page" });
        }
        return res.status(500).send({ msg: "Failed to change start page" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error changing start page" });
    }
}

/*
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
*/


// Change password
async function changePassword(req, res) {
    try {
        const result = await usersModel.changePassword(req.user.email, req.body.password);
        if (result) {
            return res.status(200).send({ msg: "Changed user's password" });
        }
        return res.status(500).send({ msg: "Failed to change password" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error changing password" });
    }
}

/*
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
*/
// Delete user
async function deleteUser(req, res) {
    try {
        const result = await usersModel.deleteUser(req.user.email);
        if (result) {
            return res.status(200).send({ msg: "Deleted user" });
        }
        return res.status(500).send({ msg: "Failed to delete user" });
    } catch (err) {
        console.log("Failed to delete user", err);
        return res.status(500).send({ msg: "Error deleting user" });
    }
}




module.exports = {
    userAuth,
    getCurrentUser,    
    createUser,
    deleteUser,
    changeStartPage,
    changePassword,
    verifyToken
}




