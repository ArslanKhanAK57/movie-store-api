

module.exports = function (jwt, config, errorCodes) {

    return function(req, res, next) {

        var token = req.get('signatureToken');

        if (token) {
            try {
                var decoded = jwt.decode(token, config.secret);

                if (decoded.exp <= Date.now()) {
                    res.sendResponse("AUTH_ERR_0005", "ERROR", null, errorCodes["AUTH_ERR_0005"], 401);
                }
                else {
                    next();
                }
            }
            catch (e) {
                res.sendResponse("AUTH_ERR_0006", "ERROR", null, errorCodes["AUTH_ERR_0006"], 401);
            }
        }
        else {
            res.sendResponse("AUTH_ERR_0007", "ERROR", null, errorCodes["AUTH_ERR_0007"], 400);
        }
    }
};