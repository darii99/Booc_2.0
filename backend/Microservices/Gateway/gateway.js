const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const PORT = 4000; 



const corsconfig = {
  origin: "http://9.223.144.115:5000",
  credentials: true,
}

//app.options("*", cors(corsconfig))  // the star allows all IP to connect, but not if you use credentials: true in cors
app.use(cors(corsconfig));


//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let isReady = false;         //readiness flag
const SLEEP_TIME = 10000;    //10000ms = 10 seconds


// OS-specific temporary directory for the startup file
const tmpDir = os.tmpdir();
const startupFile = path.join(tmpDir, 'started');

/* 
// Microservice endpoints
const services = {
  user: 'http://10.0.24.134:3200',
  event: 'http://10.0.127.225:3400',
  group: 'http://10.0.57.4:3600'
};
*/

/* 
// proxy middleware for microservices
app.use('/user', createProxyMiddleware({ target: services.user, changeOrigin: true }));
app.use('/event', createProxyMiddleware({ target: services.event, changeOrigin: true }));
app.use('/group', createProxyMiddleware({ target: services.group, changeOrigin: true }));
*/

/* 
// proxy middleware for microservices
app.use('/api', createProxyMiddleware({ target: services.user, changeOrigin: true, pathRewrite: {'^/api': '/users'} }));
app.use('/api', createProxyMiddleware({ target: services.event, changeOrigin: true, pathRewrite: {'^/api': '/event'} }));
app.use('/api', createProxyMiddleware({ target: services.group, changeOrigin: true, pathRewrite: {'^/api': '/group'} }));
*/


function createDynamicProxy(targetIP) 
{
  return createProxyMiddleware({ 
    target: `http://${targetIP}`, 
    changeOrigin: true,
    onProxyReq:(proxyReq, req, res) => 
      {
      if(req.body) 
      {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    // Ensure proxied responses have correct CORS headers
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = 'http://9.223.144.115:5000';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
  });
}

app.use('api/users', createDynamicProxy('10.0.24.134'));
app.use('api/event', createDynamicProxy('10.0.127.225'));
app.use('api/group', createDynamicProxy('10.0.57.4'));



app.get('/', (req, res) => {
    res.send('This is the Gateway Microservice');
});


app.get('/healthz', (req, res) => {
  res.status(200).send('User microservice is healthy');
});

app.get('/health/readiness', (req, res) => {
  if (isReady) {
      res.status(200).send('User microservice is ready');
  } else {
      res.status(500).send('User microservice is not ready');
  }
});




// sleep function
const sleep = ms => new Promise(resolve => {
    console.log(`Sleeping for ${ms} ms`);
    setTimeout(resolve, ms);
  });





async function simulateStartup() {
  console.log("Starting the Gateway microservice...");

  await sleep(SLEEP_TIME);  // startup delay


  // write startup file to indicate "started" for the startup probe
  try {
    fs.writeFileSync(startupFile, 'started gateway ms');
    console.log(`Wrote file ${startupFile} for 'Gateway' startup probe`);
  } catch(err) {
    console.error('Error writing startup file for gateway ms:', err);
  }


  await sleep(SLEEP_TIME);  // time between startup and ready
  isReady = true;
  console.log('Gateway microservice is ready');


  // start server
  app.listen(PORT, () => {
    console.log(`"Gateway" is running on port ${PORT}`);
  });
}

simulateStartup();



