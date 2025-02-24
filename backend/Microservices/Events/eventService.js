const express = require('express');
const app = express();
const cors = require('cors');
const router = require("./eventRoutes");
const PORT = 3400;

require('dotenv').config({path: require('find-config')('.env')});

app.use(cors()); // for requests from the gateway
app.use(express.json());



app.use("/event", router);


app.get('/', (req, res) => {
  res.send('This is the Event Microservice');
});



app.listen(PORT, () => {
  console.log(`"Event" microservice is running on port ${PORT}`);
});


