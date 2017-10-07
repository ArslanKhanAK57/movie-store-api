

var express = require('express');
var app = express();
var config = require('./config/config');
var port = process.env.PORT || 4000;
var path = require('path');

var swaggerJSDoc = require('swagger-jsdoc');
var swaggerDefinition = {
    info: {
        title: 'Online Movie Rental Store RESTful APIs',
        version: '0.0.1',
        description: 'Documentation of Online Movie Rental Store RESTful APIs'
    },
    host: config.host === "localhost" ? config.host + ":" + port : config.host,
    basePath: '/'
};

var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

var swaggerSpec = swaggerJSDoc(options);

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
mongoose.connect(config.dbURL, {
    useMongoClient : true
});
var models = require('./models/models')(mongoose);
var errorCodes = require('./errorCodes.json');
var controllers = require('./controllers/controllers')(models, jwt, config, errorCodes);
var env = process.env.NODE_ENV || 'development';

var apiRoles = require('./routes/apiroles.json');
var middlewares = require('./middlewares/middlewares')(jwt, config, controllers, apiRoles, errorCodes);

app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization,signatureToken');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// prepare response
app.use(function(req, res, next) {
    res.sendResponse = function(responseCode, responseStatus, responseData, responseMessage, httpCode) {
        var response = {
            responseCode : responseCode,
            responseStatus : responseStatus,
            responseData : responseData,
            responseMessage : responseMessage
        };

        res.header('Content-Type', 'application/json');
        res.status(httpCode);
        res.json(response);
    };

    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.all('/api/v1/*', [middlewares.authenticateRequest, middlewares.authorizeRequest]);
require('./routes/routes')(express, app, controllers, swaggerSpec);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(port, function() {
    console.log('Movie Store API running on port: ' + port);
    console.log('Environment: ' + env);
});