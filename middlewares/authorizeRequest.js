

module.exports = function (jwt, config, controllers, apiRoles, errorCodes) {

    return function(req, res, next) {

        var token = (req.body && req.body.signatureToken) || (req.query && req.query.signatureToken) || (req.get('signatureToken'));

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
                            res.status(401);
                            res.json({
                                "status": 401,
                                "message": "Unauthorized"
                            });
                            return;
                        }
                    }
                    else {
                        res.status(404);
                        res.json({
                            "status": 404,
                            "message": "User not found"
                        });
                        return;
                    }
                });
            }
            else {
                res.status(404);
                res.json({
                    "status": 404,
                    "message": "Signature token not found"
                });
                return;
            }
        });
    }
};