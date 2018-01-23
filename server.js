//dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require("express-jwt");

//setup dev environment
var dbSyncOptions = { force: false }
if (process.env.NODE_ENV.trim() === "development"){
    require('dotenv').config(); //grab local copy of env vars
    dbSyncOptions.force = true;
}

//setup server
var port = process.env.PORT || 3000;
var app = express();

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//setup logger
app.use(morgan("dev"));
//setup handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setup routes
app.use(express.static("public"));
require("./routes/authRoutes.js")(app);
require("./routes/pageRoutes.js")(app);
//requre json web tokens for all future routes
app.use(jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
}));

require("./routes/apiRoutes.js")(app);

//start server
db.sequelize.sync(dbSyncOptions).then(function() {
    app.listen(port, function() {
        console.log("App listening on PORT " + port);
    });
});