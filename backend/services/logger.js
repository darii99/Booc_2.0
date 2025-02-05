
const winston = require('winston');

require('winston-mongodb');

const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';


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

    transports: [
        new winston.transports.Console(),
        new winston.transports.MongoDB({
            db: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booc.oduvk.mongodb.net/Booc?retryWrites=true&w=majority`,
            options: { useUnifiedTopology: true },
            collection: 'Logs',
            level: 'info',
        })
    ],

  });



module.exports = wLogger;



