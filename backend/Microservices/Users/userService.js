const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const router = require("./userRoutes");
const PORT = 3200;

const os = require('os');
const path = require('path');
const tmpDir = os.tmpdir();

const startupFile = path.join(tmpDir, 'started');

require('dotenv').config({path: require('find-config')('.env')});

app.use(cors()); // for requests from the gateway
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const SLEEP_TIME = 5000;    //5000ms = 5 seconds
const HEALTHZ_TIME = 20000;  //20000ms = 20 seconds



//sleep function
const sleep = ms => new Promise(resolve => {
  console.log(`Sleeping for ${ms} ms`);
  setTimeout(resolve, ms);
});




//simulate startup for probes
async function simulateStartup() 
{
  console.log("Starting the Users microservice...");

  const app = express();
  console.log("Express app created");


  //set the startup timestamp
  const startupTimestamp = new Date();
  console.log(`Set startupTimestamp to ${startupTimestamp.toLocaleTimeString('sv-SE')}`);


  //microservice route
  app.use("/user", router);
  app.get('/', (req, res) => {
    res.send('This is the User Microservice');
  });


  //respond to HTTP GET requests on the /healthz path to indicate "alive" for liveness probe
  app.get('/healthz', async (req, res) => {
      const current = new Date();
      console.log(`Route /healthz hit at time ${current.toLocaleTimeString('sv-SE')}, Elapsed seconds since startup: ${(current - startupTimestamp)/1000}`);


      if (current - startupTimestamp < HEALTHZ_TIME) 
      {
          console.log('Route /healthz returning status 200');
          res.sendStatus(200); // If within 20 seconds of the microservice's "startupTimestamp", return status "200" (ok)
      } 
      else 
      {
          console.log('Route /healthz returning status 500');
          res.sendStatus(500); // If not within 20 seconds of the microservice's "startupTimestamp", return status "500" (internal server error)
      }
  });



  // sleep for 5 seconds to simulate startup time
  await sleep(SLEEP_TIME);



  // write startup file to indicate "started" for the startup probe
  try {
      fs.writeFileSync(startupFile, 'started');
      console.log(`Wrote file ${startupFile} for startup probe`);
  } catch(err) {
      console.error('Error writing startup file:', err);
  }



  // sleep for 10 seconds to simulate time between startup and ready
  await sleep(SLEEP_TIME);




  app.listen(PORT, () => {
    console.log(`"Users" microservice is running on port ${PORT}`);
  });
  
}


simulateStartup();



/** 
//routes
app.use("/user", router);

app.get('/', (req, res) => {
  res.send('This is the User Microservice');
});


//startup probe endpoint to chack if initialization is complete
app.get('/health/startup', (req, res) => {
  if (isStarted) {
    res.status(200).send('Users microservice has started');
  } else {
    res.status(500).send('Users microservice has not started');
  }
});


//readiness probe endpoint to check if the microservice is ready to accept requests
app.get('/health/readiness', (req, res) => {
  if (isReady) {
    res.status(200).send('Users microservice is ready');
  } else {
    res.status(500).send('Users microservice is not ready');
  }
});


//liveness probe endpoint to check if the microservice is alive
app.get('/healthz', (req, res) => {
  res.status(200).send('Users microservice is healthy');
});




app.listen(PORT, () => {
  console.log(`"Users" microservice is running on port ${PORT}`);
});
*/
