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

            method: req.method,     //GET, POST, PUT, DELETE
            body: req.body,
            params: req?.params,
            query: req?.query,

        },

        response: {

            headers: res.getHeaders(),
            statusCode: res?.statusCode,
            body: responseBody,
        }
    };
};




module.exports = formatHTTPLoggerResponse;

