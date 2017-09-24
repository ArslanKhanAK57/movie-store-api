

module.exports = function(jwt, config, controllers, apiRoles){

    var middlewares = {};

    middlewares.authenticateRequest = require('./authenticateRequest')(jwt, config);
    middlewares.authorizeRequest = require('./authorizeRequest')(jwt, config, controllers, apiRoles);

    return middlewares;

};