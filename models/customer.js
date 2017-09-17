

module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var customer = new Schema({
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        totalRented : Number,
        createdDate: {
            type : Date,
            default : Date.now()
        },
        updateDate : {
            type : Date,
            default : Date.now()
        }
    });

    return mongoose.model('Customer', customer);
};