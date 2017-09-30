

module.exports = function (jwt, config, errorCodes) {

    return function(req, res, next) {

        var token = (req.body && req.body.signatureToken) || (req.query && req.query.signatureToken) || (req.get('signatureToken'));

        if (token) {
            try {
                var decoded = jwt.decode(token, config.secret);

                if (decoded.exp <= Date.now()) {
                    res.sendResponse("AUTH_ERR_0005", "ERROR", null, errorCodes["AUTH_ERR_0005"], 400);
                    return;
                }
                next();
            }
            catch (e) {
                res.sendResponse("COMM_ERR_0002", "ERROR", null, errorCodes["COMM_ERR_0002"], 500);
            }
        }
        else {
            res.sendResponse("AUTH_ERR_0006", "ERROR", null, errorCodes["AUTH_ERR_0006"], 401);
        }
    }
};