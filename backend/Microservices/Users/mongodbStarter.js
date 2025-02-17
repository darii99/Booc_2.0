const { MongoClient } = require("mongodb");
const {mongoose} = require("mongoose");
const dotenv = require("dotenv");

function startMongodb(){
    //`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booc.oduvk.mongodb.net/?retryWrites=true&w=majority&appName=Booc `
    const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booc.oduvk.mongodb.net/Booc?retryWrites=true&w=majority&appName=Booc `;
    return new MongoClient(connectionString);
}

async function startmongoose(){
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booc.oduvk.mongodb.net/Booc?retryWrites=true&w=majority&appName=Booc `);
}

module.exports = {
    startMongodb,
    startmongoose
}
