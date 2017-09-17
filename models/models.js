

module.exports = function(mongoose){

    var models = {};

    models.userModel = require('./user')(mongoose);
    models.customerModel = require('./customer')(mongoose);
    models.movieModel = require('./movie')(mongoose);
    models.auditModel = require('./audit')(mongoose);

    return models;

};