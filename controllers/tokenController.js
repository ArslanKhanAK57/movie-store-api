

module.exports = function (tokenModel) {

    var tokenController = {

        addToken : function(token, next) {

            removeTokens(token.userId, function(err, rowsEffected) {

                if ( err ) {
                    next(err, null);
                }
                else {
                    var newToken = new tokenModel({
                        token: token.token,
                        userId: token.userId,
                        isDeleted: false,
                        createdDate: new Date()
                    });

                    newToken.save(newToken, function (err) {
                        next(err, newToken);
                    });
                }
            });
        },

        findOne : function(query, next) {
            tokenModel.findOne(query, function(err, token){
                next(err, token);
            });
        }
    };

    var removeTokens = function(userId, next) {
        tokenModel.update({userId : userId, isDeleted : false}, {$set : { isDeleted : true}}, {}, function(err, rowsEffected) {
            next(err, rowsEffected);
        });
    };

    return tokenController;
};