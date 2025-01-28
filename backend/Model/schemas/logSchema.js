const mongoose = require('mongoose');
const { Schema } = mongoose;


const logSchema = new Schema({
    serviceName: {type: String},
    message: {type: String},
    // metadata: Object,
    //logLevel: {type: String},
    timestamp: {type: Date},

},
{
    collection: "Logs",
    timestamps: true
});




module.exports = mongoose.model('Log', logSchema);



