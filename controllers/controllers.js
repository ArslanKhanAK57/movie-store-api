

module.exports = function(models){

    var controllers = {};

    controllers.userController = require('./userController')(models.userModel);
    controllers.movieController = require('./movieController')(models.movieModel);

    return controllers;

};