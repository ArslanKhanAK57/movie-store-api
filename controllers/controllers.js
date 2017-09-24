

module.exports = function(models, jwt, config){

    var controllers = {};

    controllers.tokenController = require('./tokenController')(models.tokenModel);
    controllers.customerController = require('./customerController')(models.customerModel);
    controllers.userController = require('./userController')(models.userModel, controllers.customerController);
    controllers.authController = require('./authController')(controllers.userController, controllers.tokenController, jwt, config);
    controllers.movieController = require('./movieController')(models.movieModel);

    return controllers;

};