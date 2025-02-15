const express = require('express');
const app = express();
const router = require("./eventRoutes");
const PORT = 3400;

app.use(express.json());
require('dotenv').config({path: require('find-config')('.env')})


app.use("/event", router);


app.listen(PORT, () => {
  console.log(`"Event" microservice is running on port ${PORT}`);
});


