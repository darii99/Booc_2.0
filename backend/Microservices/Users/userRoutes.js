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
router.get("/api/users", getCurrentUser);
router.post("/api/users", createUser);
router.put("/api/users", changeStartPage);
router.delete("/api/users", deleteUser);
router.put("/api/password", changePassword);
router.get("/api/auth", userAuth);

//Auth
router.post("/api/auth", authenicate);
router.get("/api/auth", authStatus);
router.delete("/api/auth", removeAuth);

//Friend
router.post("/api/users/addFriend", addFriend);
router.delete("/api/users/deleteFriend", deleteFriend);




module.exports = router;

