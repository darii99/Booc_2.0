const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const path = require('path');
const router = require("./userRoutes");
const PORT = 3200;

require('dotenv').config({path: require('find-config')('.env')});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let isReady = false;         //readiness flag
const SLEEP_TIME = 10000;    //10000ms = 10 seconds


// OS-specific temporary directory for the startup file
const tmpDir = os.tmpdir();
const startupFile = path.join(tmpDir, 'started');



// route definitions
app.use("/user", router);
app.get('/', (req, res) => {
  res.send('This is the User Microservice');
});

app.get('/healthz', (req, res) => {
  res.status(200).send('Users microservice is healthy');
});

app.get('/health/readiness', (req, res) => {
  if (isReady) {
    res.status(200).send('Users microservice is ready');
  } else {
    res.status(500).send('Users microservice is not ready');
  }
});




// sleep function
const sleep = ms => new Promise(resolve => {
  console.log(`Sleeping for ${ms} ms`);
  setTimeout(resolve, ms);
});



async function simulateStartup() {
  console.log("Starting the Users microservice...");

  await sleep(SLEEP_TIME);  // startup delay


  // write startup file to indicate "started" for the startup probe
  try {
    fs.writeFileSync(startupFile, 'started user ms');
    console.log(`Wrote file ${startupFile} for 'User' startup probe`);
  } catch(err) {
    console.error('Error writing startup file for user ms:', err);
  }


  await sleep(SLEEP_TIME);  // time between startup and ready
  isReady = true;
  console.log('Users microservice is ready');


  // start server
  app.listen(PORT, () => {
    console.log(`"Users" microservice is running on port ${PORT}`);
  });
}

simulateStartup();


