//const axios = require('axios');
const Log = require('./Model/schemas/logSchema.js');

async function logEvent(serviceName, logLevel, message, metadata = {}) {
    try {
        const logEntry = new Log({
            serviceName,
            message,
            metadata,
            timestamp: new Date(),
        });

        await logEntry.save();
        console.log( `[${logLevel}] ${message}`);
    } catch (err) {
        console.error('Failed to log event: ', err.message);
    }
}

module.exports = {
  logInfo: (serviceName, message, metadata) => logEvent(serviceName, 'INFO', message, metadata),
  logError: (serviceName, message, metadata) => logEvent(serviceName, 'ERROR', message, metadata)
};

