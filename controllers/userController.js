

module.exports = function (userModel) {

    var signup = function(userToBeCreated, next) {
        var newUser = new userModel({
            email : userToBeCreated.email,
            password : userToBeCreated.password,
            role : userToBeCreated.role.toUpperCase(),
            address : userToBeCreated.address,
            name : userToBeCreated.name,
            status : 'ACTIVE',
            createdDate : new Date(),
            updateDate : new Date()
        });

        newUser.save(newUser, function(err) {
            next();
        });
    };

    var findOne = function(query, next) {
        userModel.findOne(query, function(err, user){
            next(err, user);
        });
    };

    return {
        signup : signup,
        findOne : findOne
    };

};