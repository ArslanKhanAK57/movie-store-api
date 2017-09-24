

module.exports = function (userModel, customerController, errorCodes) {

    var userController = {

        signup : function(req, res) {

            var userToBeCreated = req.body;

            if ( userToBeCreated.role.toUpperCase() === 'CUSTOMER' ) {

                userModel.findOne({email: userToBeCreated.email}, function (err, user) {

                    if (err) {
                        res.sendResponse("USR_ERR_0002", "ERROR", null, errorCodes["USR_ERR_0002"], 200);
                    }
                    else if (user) {
                        res.sendResponse("USR_ERR_0001", "ERROR", null, errorCodes["USR_ERR_0001"], 200);
                    }
                    else {
                        var newUser = new userModel({
                            email: userToBeCreated.email,
                            password: userToBeCreated.password,
                            role: userToBeCreated.role.toUpperCase(),
                            address: userToBeCreated.address,
                            name: userToBeCreated.name,
                            status: 'ACTIVE',
                            createdDate: new Date(),
                            updateDate: new Date()
                        });

                        newUser.save(newUser, function (err) {
                            if (err) {
                                res.sendResponse("USR_ERR_0003", "ERROR", null, errorCodes["USR_ERR_0003"], 200);
                            }
                            else {
                                if (newUser.role === 'CUSTOMER') {
                                    customerController.addCustomer(newUser._id, function (err, newCustomer) {
                                        if (err) {
                                            res.sendResponse("USR_ERR_0004", "ERROR", null, errorCodes["USR_ERR_0004"], 200);
                                        }
                                        else {
                                            res.sendResponse("0", "OK", newCustomer, errorCodes["0"], 200);
                                        }
                                    })
                                }
                                else {
                                    res.sendResponse("0", "OK", newUser, errorCodes["0"], 200);
                                }
                            }
                        });
                    }
                });
            }
            else {
                res.sendResponse("USR_ERR_0005", "ERROR", null, errorCodes["USR_ERR_0005"], 200);
            }
        },

        addAdminUser : function(req, res) {

            var userToBeCreated = req.body;

            if ( userToBeCreated.role.toUpperCase() === 'ADMIN' ) {

                userModel.findOne({email: userToBeCreated.email}, function (err, user) {

                    if (err) {
                        res.sendResponse("USR_ERR_0002", "ERROR", null, errorCodes["USR_ERR_0002"], 200);
                    }
                    else if (user) {
                        res.sendResponse("USR_ERR_0001", "ERROR", null, errorCodes["USR_ERR_0001"], 200);
                    }
                    else {
                        var newUser = new userModel({
                            email: userToBeCreated.email,
                            password: userToBeCreated.password,
                            role: userToBeCreated.role.toUpperCase(),
                            address: userToBeCreated.address,
                            name: userToBeCreated.name,
                            status: 'ACTIVE',
                            createdDate: new Date(),
                            updateDate: new Date()
                        });

                        newUser.save(newUser, function (err) {
                            if (err) {
                                res.sendResponse("USR_ERR_0003", "ERROR", null, errorCodes["USR_ERR_0003"], 200);
                            }
                            else {
                                res.sendResponse("0", "OK", newUser, errorCodes["0"], 200);
                            }
                        });
                    }
                });
            }
            else {
                res.sendResponse("USR_ERR_0005", "ERROR", null, errorCodes["USR_ERR_0005"], 200);
            }
        },

        findOne : function(query, next) {
            userModel.findOne(query, function(err, user){
                next(err, user);
            });
        }
    };

    return userController;
};