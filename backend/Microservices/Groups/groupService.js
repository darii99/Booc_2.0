const express = require('express');
const app = express();
const cors = require('cors');
const router = require("./groupRoutes");
const PORT = 3600;

require('dotenv').config({path: require('find-config')('.env')});

app.use(cors()); // for requests from the gateway
app.use(express.json());



app.use("/group", router);


app.get('/', (req, res) => {
  res.send('This is the Group Microservice');
});



app.listen(PORT, () => {
  console.log(`"Group" microservice is running on port ${PORT}`);
});
