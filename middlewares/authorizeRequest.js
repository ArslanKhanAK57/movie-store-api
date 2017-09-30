

module.exports = function (jwt, config, controllers, apiRoles, errorCodes) {

    return function(req, res, next) {

        var token = req.get('signatureToken');

        controllers.tokenController.findOne({token : token, isDeleted : false}, function(err, token) {
            if ( token ) {
                controllers.userController.findOne({_id : token.userId}, function(err, user) {
                    if ( user ) {
                        var path = req.path;
                        var replacedPath = path.replace(/[a-f0-9]{24}/g, ":id");
                        var allowedRoles = apiRoles[replacedPath][req.method].split("|");
                        if ( allowedRoles.indexOf(user.role) >= 0 ) {
                            next();
                        }
                        else {
                            res.sendResponse("AUTH_ERR_0010", "ERROR", null, errorCodes["AUTH_ERR_0010"], 401);
                        }
                    }
                    else {
                        res.sendResponse("AUTH_ERR_0009", "ERROR", null, errorCodes["AUTH_ERR_0009"], 404);
                    }
                });
            }
            else {
                res.sendResponse("AUTH_ERR_0008", "ERROR", null, errorCodes["AUTH_ERR_0008"], 404);
            }
        });
    }
};