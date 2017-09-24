module.exports = function (userController, tokenController, jwt, config, errorCodes) {

    var auth = {
        login : function(req, res) {
            var userName = req.body.userName || '';
            var password = req.body.password || '';

            if ( userName === '' || password === '' ) {
                res.sendResponse("AUTH_ERR_0001", "ERROR", null, errorCodes["AUTH_ERR_0001"], 400);
            }

            userController.findOne({email : userName, password: password}, function(err, user) {
                if ( err ) {
                    res.sendResponse("AUTH_ERR_0002", "ERROR", null, errorCodes["AUTH_ERR_0002"], 200);
                }
                else if ( !user ) {
                    res.sendResponse("AUTH_ERR_0003", "ERROR", null, errorCodes["AUTH_ERR_0003"], 401);
                }
                else {
                    var token = generateToken(user);
                    tokenController.addToken(token, function(err, token) {
                        if ( err ) {
                            res.sendResponse("AUTH_ERR_0004", "ERROR", null, errorCodes["AUTH_ERR_0004"], 200);
                        }
                        else {
                            res.sendResponse("0", "OK", token, errorCodes["0"], 200);
                        }
                    });
                }
            })
        }
    };

    function generateToken(user) {
        var expirationDate = expiresIn(7);
        var token = jwt.encode({
            exp: expirationDate
        }, config.secret);

        return {
            token : token,
            userId : user._id,
            expirationDate : expirationDate
        }
    }

    function expiresIn(numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }

    return auth;
};