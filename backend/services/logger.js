
const winston = require('winston');
require('winston-mongodb');
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';



//format for the log entries
const logFormat = printf(({ level, message, timestamp, ...data }) => {
    const response = { level, message, data };
    return JSON.stringify(response);
});


const wLogger = winston.createLogger({
    format: combine(
        timestamp({ format: timestampFormat }), 
        json(),
        logFormat
    ),

    
    //destinations for the log entries (currently both console and database)
    transports: [
        new winston.transports.Console(),
        new winston.transports.MongoDB({
            db: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booc.oduvk.mongodb.net/Booc?retryWrites=true&w=majority`,
            collection: 'Logs',
            level: 'info',      //other log levels that can be used are: error, warn, info, http, verbose, debug, silly
        })
    ],
  });


module.exports = wLogger;


