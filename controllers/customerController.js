

module.exports = function (customerModel) {

    var customerController = {

        addCustomer : function(userId, next) {

            var newCustomer = new customerModel({
                userId : userId,
                totalRented : 0,
                createdDate: new Date(),
                updateDate: new Date()
            });

            newCustomer.save(newCustomer, function(err) {
                next(err, newCustomer);
            });
        },

        findOne : function(query, next) {
            customerModel.findOne(query, function(err, customer){
                next(err, customer);
            });
        }
    };

    return customerController;
};