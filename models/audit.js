

module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var audit = new Schema({
        action : {
            type : String,
            enum : ['ADDED', 'UPDATED', 'ISSUED', 'RETURNED'],
            required : true,
            upperCase : true
        },
        movieId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
        },
        customerId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Customer',
        },
        createdDate: {
            type : Date,
            default : Date.now()
        }
    });

    return mongoose.model('Audit', audit);
};