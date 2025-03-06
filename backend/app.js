var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//import session from "express-session";
var session = require("express-session")
var logger = require('morgan');
var cors = require("cors");
const dotenv = require("dotenv").config();
var MongoDBStore = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require("./routes/api");

const PORT = 6400;

const responseHandler = require('./services/responseHandler');


var app = express();
//Creates socket connection server
const http = require('http');
const {Server} = require("socket.io");

/* 
const corsconfig = {
  origin: "http://9.223.144.115:5000",
  credentials: true,
}

app.options("*", cors(corsconfig))  // the star allows all IP to connect, but not if you use credentials: true in cors
app.use(cors(corsconfig));
*/


const server = http.createServer(app);
io = new Server(server,{
  cors: {
    origin: "http://9.223.144.115:5000",
    credentials: true,
  }
});

app.io = io;

app.use(function(req, res, next){
  //console.log("Testing")
  next();
})


//Creates mongoDB connection for session storage, https://www.npmjs.com/package/connect-mongodb-session
var store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booc.oduvk.mongodb.net/Booc?retryWrites=true&w=majority&appName=Booc `,
  databaseName: "Booc",
  collection: 'mySessions',
});

//Catches errors with storing sessions
store.on('error', function(error) {
  console.log(error);
});


//Implements sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false, //turns off storing empty sessions
  resave: false,
  cookie: {
    maxAge: 1000*60*60*24, //24 hours
  },
  store: store,
}));

io.engine.use(session);

io.on('connection', (socket) => {
  console.log("Connection 1");

  socket.on('connect', function(socket){
    console.log("Connection 2");
  try{
    const sessionId = socket.request.session.id;
    console.log("You get ", sessionId);
    // the session ID is used as a room
    socket.join(sessionId);
  }
  catch(err){
    console.log("Failed to establish socket connection");
    console.log(err);
  }
  })
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(responseHandler);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



/** 
//runs the code only when app.js is the entry point
if (require.main === module){
  app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
  });
}
*/

//server.listen(6400);

server.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});




module.exports = {app,io};


