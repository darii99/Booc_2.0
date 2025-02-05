
const winston = require('winston');
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';


const wLogger = winston.createLogger({
    format: combine(
        timestamp({ format: timestampFormat }),
        json(),
        printf(({ level, message, timestamp, ...data }) => {
            const response = { level, message, data };
            return JSON.stringify(response);
        })
    ),

    transports: [new winston.transports.Console()],
    
  });



module.exports = wLogger;



