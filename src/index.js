'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");

const app = express();
const usersRoute = require("./routes/usersRoute");
const coursesRoute = require("./routes/coursesRoute");
const reviewsRoute = require("./routes/reviewsRoute")
const bodyParser = require("body-parser")
const jsonParser = require("body-parser").json;
const session = require("express-session");

app.use(session({
  secret:"mr wible wobble",
  resave: true,
  saveUninitialized: false
}));

app.use(jsonParser());  // place before routes
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/users", usersRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/courses", coursesRoute);
// set our 
app.set('port', process.env.PORT || 5000);
// db connection
mongoose.connect('mongodb://localhost:27017/course-api')
let db= mongoose.connection;


db.on("error", function (error){
  console.log("connection error", error)
})
db.once("open", function(){
  console.log("db connection successfull")
  
  
});

// morgan gives us http request logging
app.use(morgan('dev'));

// TODO add additional routes here

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

//uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  //console.log("wibble");
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
