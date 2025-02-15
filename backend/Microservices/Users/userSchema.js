const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {type: String, unique:true},
    username: String,
    identifier: {type: Number, default: 0},
    description: {type: String, default: ""},
    password: String,
    startingPage: {type: Number, default: 0},
    friendList: [{username: String, identifier: String, _id: false}],
},{
    collection:"Users"
})

//Constraint so only one username with a certain identifier can exist
userSchema.index({username:1, identifier:1}, {unique:true})

module.exports = mongoose.model('User', userSchema);
