

module.exports = function(models, jwt, config, errorCodes){

    var controllers = {};

    controllers.tokenController = require('./tokenController')(models.tokenModel);
    controllers.customerController = require('./customerController')(models.customerModel);
    controllers.userController = require('./userController')(models.userModel, controllers.customerController, errorCodes);
    controllers.authController = require('./authController')(controllers.userController, controllers.tokenController, jwt, config, errorCodes);
    controllers.movieController = require('./movieController')(models.movieModel, errorCodes);

    return controllers;

};