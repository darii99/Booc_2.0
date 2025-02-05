const formatHTTPLoggerResponse = (
    req,
    res,
    responseBody
) => {

    return {

        request: {

            headers: req.headers,
            host: req.headers.host,
            baseUrl: req.baseUrl,
            url: req.url,

            method: req.method,
            body: req.body,
            params: req?.params,
            query: req?.query,

            //clientIp: req.headers['x-forwarded-for'] ?? req?.socket.remoteAddress,
        },

        response: {

            headers: res.getHeaders(),
            statusCode: res?.statusCode,
            body: responseBody,
        }
    };
};




module.exports = formatHTTPLoggerResponse;

