const wLogger = require("./logger");
const formatHTTPLoggerResponse = require("./formatHTTPReqRes");


const responseHandler = (req, res, next) => {

  const originalSend = res.send;

  res.send = function (data) 
  {
    const response = formatHTTPLoggerResponse(req, res, data);  //format the response
    wLogger.info(response);     //log the formatted response
    originalSend.call(this, data);
  };

  next();   

};

module.exports = responseHandler;

