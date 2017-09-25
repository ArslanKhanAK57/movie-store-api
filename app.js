

var express = require('express');
var app = express();

var swaggerJSDoc = require('swagger-jsdoc');
var swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:4000',
    basePath: '/',
};

var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

var swaggerSpec = swaggerJSDoc(options);

var config = require('./config/config');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
mongoose.connect(config.dbURL, {
    useMongoClient : true
});
var models = require('./models/models')(mongoose);
var jstoxml = require('jstoxml');
var errorCodes = require('./errorCodes.json');
var controllers = require('./controllers/controllers')(models, jwt, config, errorCodes);
var port = process.env.PORT || 4000;
var env = process.env.NODE_ENV || 'development';

var apiRoles = require('./routes/apiroles.json');
var middlewares = require('./middlewares/middlewares')(jwt, config, controllers, apiRoles);

var swaggerJSDoc = require('swagger-jsdoc');

app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.all('/api/v1/*', [middlewares.authenticateRequest, middlewares.authorizeRequest]);
require('./routes/routes')(express, app, controllers, jstoxml, swaggerSpec);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(port, function() {
    console.log('Movie Store API running on port: ' + port);
    console.log('Environment: ' + env);
});