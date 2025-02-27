var express = require('express');
var router = express.Router();

const {getCurrentUser,
    createUser, 
    deleteUser, 
    changePassword,
    changeStartPage,
    userAuth} = require('./usersController');
const {addFriend, deleteFriend} = require('./friendController');
const {authenicate, authStatus, removeAuth} = require("./authController");



//Users
router.get("/users", getCurrentUser);
router.post("/users", createUser);
router.put("/users", changeStartPage);
router.delete("/users", deleteUser);
router.put("/password", changePassword);
router.get("/auth", userAuth);

//Auth
router.post("/auth", authenicate);
router.get("/auth", authStatus);
router.delete("/auth", removeAuth);

//Friend
router.post("/users/addFriend", addFriend);
router.delete("/users/deleteFriend", deleteFriend);




module.exports = router;

