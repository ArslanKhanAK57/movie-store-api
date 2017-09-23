

module.exports = function (jwt, config) {

    return function(req, res, next) {

        var token = (req.body && req.body.signatureToken) || (req.query && req.query.signatureToken) || (req.get('signatureToken'));

        if (token) {
            try {
                var decoded = jwt.decode(token, config.secret);

                if (decoded.exp <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "Token Expired"
                    });
                    return;
                }
                next();
            }
            catch (e) {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Oops something went wrong",
                    "error": e
                });
            }
        }
        else {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid Token or Key"
            });
            return;
        }
    }
};