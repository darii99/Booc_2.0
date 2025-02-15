var express = require('express');
var router = express.Router();

const {getCurrentUser,
    createUser, 
    deleteUser, 
    changePassword,
    changeStartPage,
    userAuth} = require('./usersController');


//Users
router.get("/users", getCurrentUser);
router.post("/users", createUser);
router.put("/users", changeStartPage);
router.delete("/users", deleteUser);
router.put("/password", changePassword);
router.get("/auth", userAuth);



module.exports = router;

