

module.exports = function (tokenModel) {

    var addToken = function(token, next) {

        removeTokens(token.userId, function(err, rowsEffected) {

            var newToken = new tokenModel({
                token : token.token,
                userId : token.userId,
                isDeleted : false,
                createdDate : new Date()
            });

            newToken.save(newToken, function(err) {
                next();
            });
        });
    };

    var removeTokens = function(userId, next) {
        tokenModel.update({userId : userId, isDeleted : false}, {$set : { isDeleted : true}}, {}, next);
    };

    var findOne = function(query, next) {
        tokenModel.findOne(query, function(err, token){
            next(err, token);
        });
    };

    return {
        addToken : addToken,
        findOne : findOne
    };

};