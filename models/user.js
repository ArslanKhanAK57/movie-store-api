

module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var user = new Schema({
        email : {
            type : String,
            trim : true,
            lowerCase : true,
            required : true
        },
        password : {
            type : String,
            trim : true,
            required : true
        },
        role : {
            type : String,
            enum : ['ADMIN', 'CUSTOMER'],
            required : true,
            upperCase : true
        },
        address : {
            type : String,
            trim : true,
            required : true
        },
        name : {
            type : String,
            trim : true,
            required : true
        },
        status : {
            type : String,
            enum : ['ACTIVE', 'INACTIVE'],
            upperCase : true,
            required : true
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

    return mongoose.model('User', user);
};