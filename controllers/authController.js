module.exports = function (userController, tokenController, jwt, config) {

    var auth = {
        login : function(req, res) {
            var userName = req.body.userName || '';
            var password = req.body.password || '';

            if ( userName === '' || password === '' ) {
                res.status(401);
                res.json({
                    status : 401,
                    message : "Invalid credentials"
                });
                return;
            }

            userController.findOne({email : userName, password: password}, function(err, user) {
                if ( err || !user ) {
                    res.status(401);
                    res.json({
                        status : 401,
                        message : "Invalid credentials"
                    });
                    return;
                }
                else {
                    var token = generateToken(user);
                    tokenController.addToken(token, function() {
                        res.json(token);
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