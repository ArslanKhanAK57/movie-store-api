

module.exports = function (userModel, customerController, errorCodes) {

    var userController = {

        signup : function(req, res) {

            var userToBeCreated = req.body;

            if ( !userToBeCreated.email || !userToBeCreated.password || !userToBeCreated.role || !userToBeCreated.address || !userToBeCreated.name ) {
                res.sendResponse("COMM_ERR_0001", "ERROR", null, errorCodes["COMM_ERR_0001"], 400);
            }
            else {
                if (userToBeCreated.role.toUpperCase() === 'CUSTOMER') {

                    userModel.findOne({email: userToBeCreated.email}, function (err, user) {

                        if (err) {
                            res.sendResponse("USR_ERR_0002", "ERROR", null, errorCodes["USR_ERR_0002"], 200);
                        }
                        else if (user) {
                            res.sendResponse("USR_ERR_0001", "ERROR", null, errorCodes["USR_ERR_0001"], 409);
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
                                                res.sendResponse("0", "OK", newCustomer, errorCodes["0"], 201);
                                            }
                                        });
                                    }
                                    else {
                                        res.sendResponse("0", "OK", newUser, errorCodes["0"], 201);
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    res.sendResponse("USR_ERR_0005", "ERROR", null, errorCodes["USR_ERR_0005"], 400);
                }
            }
        },

        addAdminUser : function(req, res) {

            var userToBeCreated = req.body;

            if ( !userToBeCreated.email || !userToBeCreated.password || !userToBeCreated.role || !userToBeCreated.address || !userToBeCreated.name ) {
                res.sendResponse("COMM_ERR_0001", "ERROR", null, errorCodes["COMM_ERR_0001"], 400);
            }
            else {
                if (userToBeCreated.role.toUpperCase() === 'ADMIN') {

                    userModel.findOne({email: userToBeCreated.email}, function (err, user) {

                        if (err) {
                            res.sendResponse("USR_ERR_0002", "ERROR", null, errorCodes["USR_ERR_0002"], 200);
                        }
                        else if (user) {
                            res.sendResponse("USR_ERR_0001", "ERROR", null, errorCodes["USR_ERR_0001"], 409);
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
                                    res.sendResponse("0", "OK", newUser, errorCodes["0"], 201);
                                }
                            });
                        }
                    });
                }
                else {
                    res.sendResponse("USR_ERR_0005", "ERROR", null, errorCodes["USR_ERR_0005"], 400);
                }
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