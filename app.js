

var express = require('express');
var app = express();
var config = require('./config/config');
var mongoose = require('mongoose');
mongoose.connect(config.dbURL, {
    useMongoClient : true
});
var models = require('./models/models')(mongoose);
var controllers = require('./controllers/controllers')(models);
var xml = require('xml');
var jsontoxml = require('jsontoxml');
var port = process.env.PORT || 4000;
var env = process.env.NODE_ENV || 'development';

require('./routes/routes')(express, app, controllers, jsontoxml)

app.listen(port, function() {
    console.log('Movie Store API running on port: ' + port);
    console.log('Environment: ' + env);
});