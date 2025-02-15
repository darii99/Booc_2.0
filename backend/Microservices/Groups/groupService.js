const express = require('express');
const app = express();
const router = require("./groupRoutes");
const PORT = 3600;

app.use(express.json());
require('dotenv').config({path: require('find-config')('.env')})


app.use("/group", router);


app.listen(PORT, () => {
  console.log(`"Group" microservice is running on port ${PORT}`);
});
