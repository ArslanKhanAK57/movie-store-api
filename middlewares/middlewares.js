

module.exports = function(jwt, config, controllers, apiRoles){

    var middlewares = {};

    middlewares.validateRequest = require('./validateRequest')(jwt, config);
    middlewares.authorizeRequest = require('./authorizeRequest')(jwt, config, controllers, apiRoles);

    return middlewares;

};