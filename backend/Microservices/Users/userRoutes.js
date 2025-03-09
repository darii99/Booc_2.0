var express = require('express');
var router = express.Router();

const {getCurrentUser,
    createUser, 
    deleteUser, 
    changePassword,
    changeStartPage,
    userAuth} = require('./usersController');
const {addFriend, deleteFriend} = require('./friendController');
const {authenticate, checkAuthStatus, removeAuth} = require("./authController");



//Users
router.get("/users", getCurrentUser);
router.post("/users", createUser);
router.put("/users", changeStartPage);
router.delete("/users", deleteUser);
router.put("/password", changePassword);
router.get("/auth", userAuth);

//Auth
router.post("/auth", authenticate);
router.get("/auth", checkAuthStatus);
router.delete("/auth", removeAuth);

//Friend
router.post("/users/addFriend", addFriend);
router.delete("/users/deleteFriend", deleteFriend);




module.exports = router;

