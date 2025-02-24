const express = require('express');
const app = express();
const cors = require('cors');
const router = require("./userRoutes");
const PORT = 3200;

require('dotenv').config({path: require('find-config')('.env')});

app.use(cors()); // for requests from the gateway
app.use(express.json());



app.use("/user", router);


app.get('/', (req, res) => {
  res.send('This is the User Microservice');
});



app.listen(PORT, () => {
  console.log(`"Users" microservice is running on port ${PORT}`);
});

