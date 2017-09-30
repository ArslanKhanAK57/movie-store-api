

module.exports = function(jwt, config, controllers, apiRoles, errorCodes){

    var middlewares = {};

    middlewares.authenticateRequest = require('./authenticateRequest')(jwt, config, errorCodes);
    middlewares.authorizeRequest = require('./authorizeRequest')(jwt, config, controllers, apiRoles, errorCodes);

    return middlewares;

};