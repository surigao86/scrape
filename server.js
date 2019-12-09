//Dependencies
//=====================================
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require('mongoose');
const logger = require("morgan");
const route = require("./controllers/fetch.js");
const routes = require('./routes/index.js');

// Variable Port
//======================================
const PORT = process.env.PORT || 8080;

//Middleware
//======================================
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use(express.static("public"));

// Creating the Handlebars View Engine
//======================================
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routing
//======================================

// app.use(route);
app.use("/", route);


// (app, passport);


//Mongoose connection
mongoose.Promise = global.Promise;
const configDB = require('./config/database.js');
mongoose.connect(configDB.url);

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once("open", function() {
  console.log("Mongoose connection successful.");
  app.listen(process.env.PORT || PORT, function() {
  console.log("Listening on PORT: " + PORT);
	});
});