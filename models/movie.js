

module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var movie = new Schema({
        name : {
            type : String,
            trim : true,
            required : true
        },
        writer : {
            type : String,
            trim : true,
            required : true
        },
        director : {
            type : String,
            trim : true,
            required : true
        },
        producer : {
            type : String,
            trim : true,
            required : true
        },
        editor : {
            type : String,
            trim : true,
            required : true
        },
        actors : {
            type : String,
            trim : true,
            required : true
        },
        year : {
            type : Number,
            required : true
        },
        status : {
            type : String,
            enum : ['ISSUED', 'AVAILABLE', 'NON_ISSUABLE'],
            required : true,
            upperCase : true
        },
        timesRented : Number,
        currentlyRentedBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Customer'
        },
        createdDate: {
            type : Date,
            default : Date.now()
        },
        updateDate : {
            type : Date,
            default : Date.now()
        }
    });

    return mongoose.model('Movie', movie);
};