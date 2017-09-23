

module.exports = function(models, jwt, config){

    var controllers = {};

    controllers.tokenController = require('./tokenController')(models.tokenModel);
    controllers.userController = require('./userController')(models.userModel);
    controllers.authController = require('./authController')(controllers.userController, controllers.tokenController, jwt, config);
    controllers.movieController = require('./movieController')(models.movieModel);

    return controllers;

};