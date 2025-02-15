const express = require('express');
const app = express();
const router = require("./userRoutes");
const PORT = 3200;

app.use(express.json());
require('dotenv').config({path: require('find-config')('.env')})


app.use("/user", router);


app.listen(PORT, () => {
  console.log(`"Users" microservice is running on port ${PORT}`);
});

