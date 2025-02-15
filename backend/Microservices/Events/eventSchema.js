const mongoose = require('mongoose');
const { Schema } = mongoose;



const eventSchema = new Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    fromTime: {type: Date, required: true},
    toTime: {type: Date, required: true},
    location: {type: String},
    description: {type: String},
    color: {type: String, default: '#0000FF'},
    repeat: {
        type: [String],
        enum: ['never', 'daily', 'weekly', 'monthly', 'yearly'],    //repeatability options
        default: ['never']
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],                                //visibility options
        default: 'private'
    },
    invitePeople:[{username: {type: String}, identifier: {type: String}, _id:false}],                               //array of usernames of invited people
    //createdBy: [{ username: String, identifier: String, _id: false}],
    createdBy: {
        username: String,
        identifier: String,
    }
},
{
    collection:"Events",
    timestamps: true                                                //adds createdAt field
});



module.exports = mongoose.model('Event', eventSchema);
