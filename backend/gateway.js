const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 4000; // API gateway port


app.use(cors());
app.use(express.json());


// Microservice endpoints
const services = {
    user: 'http://localhost:3200',
    event: 'http://localhost:3400',
    group: 'http://localhost:3600'
};


// proxy middleware for microservices
app.use('/user', createProxyMiddleware({ target: services.user, changeOrigin: true }));
app.use('/event', createProxyMiddleware({ target: services.event, changeOrigin: true }));
app.use('/group', createProxyMiddleware({ target: services.group, changeOrigin: true }));



app.listen(PORT, () => {
    console.log(`Gateway API running on port ${PORT}`);
});

