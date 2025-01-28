const axios = require('axios');

async function logEvent(logLevel, message, metadata = {}) {
  await axios.post('http://logging-service/api/logs', {     //välj en logging service
    serviceName: 'AuthService',
    logLevel,
    message,
    metadata,
    timestamp: new Date()
  });
}

module.exports = {
  logInfo: (message, metadata) => logEvent('INFO', message, metadata),
  logError: (message, metadata) => logEvent('ERROR', message, metadata)
};

