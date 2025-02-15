const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    groupName: {type:String, unique:true},
    owners: [{username: String, identifier: String, _id:false}], //Username and identifier
    members: [{username: String, identifier: String, _id:false}],
},{
    collection:"Groups"
})

//Constraint so only one username with a certain identifier can exist
//userSchema.index({username:1, identifier:1}, {unique:true})

module.exports = mongoose.model('group', groupSchema);