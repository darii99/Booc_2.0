var express = require('express');

const {getCurrentUser,
    createUser, 
    deleteUser, 
    changePassword,
    changeStartPage,
    userAuth} = require('./usersController');

var router = express.Router();


//Password
router.put("/password", changePassword);

//Authorization
router.get("/auth", userAuth);

//Users
router.get("/users", getCurrentUser);
router.post("/users", createUser);
router.put("/users", changeStartPage);
router.delete("/users", deleteUser);


module.exports = router;

