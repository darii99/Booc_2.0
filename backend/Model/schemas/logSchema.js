const mongoose = require('mongoose');
const { Schema } = mongoose;


const logSchema = new Schema({
    timestamp: {type: Date},
    serviceName: {type: String},
    //logLevel: {type: String},
    message: {type: String},
   // metadata: Object

},
{
    collection: "Logs",
    timestamps: true
});




module.exports = mongoose.model('Log', logSchema);



