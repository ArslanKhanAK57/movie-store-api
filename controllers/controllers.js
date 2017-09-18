

module.exports = function(models, jwt, config){

    var controllers = {};

    controllers.userController = require('./userController')(models.userModel);
    controllers.authController = require('./authController')(controllers.userController, jwt, config);
    controllers.movieController = require('./movieController')(models.movieModel);

    return controllers;

};