

module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var token = new Schema({
        token : {
            type : String,
            trim : true,
            required : true
        },
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        isDeleted : {
            type : Boolean,
            required : true
        },
        createdDate: {
            type : Date,
            default : Date.now()
        }
    });

    return mongoose.model('Token', token);
};