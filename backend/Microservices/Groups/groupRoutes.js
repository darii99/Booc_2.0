var express = require('express');
var router = express.Router();

//const {userAuth} = require('../Users/usersController');
const {getGroup,
    getAllGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup} = require("./groupController");



//Group
router.get("/group", getGroup);
router.post("/group", createGroup);
router.put("/group", updateGroup);
router.delete("/group", deleteGroup);

//Groups
router.get("/groups", getAllGroups);
router.delete("/groups", leaveGroup);

//User
//router.get("/auth", userAuth);



module.exports = router;
