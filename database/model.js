const mongoose = require('mongoose') ;
const Schema = mongoose.Schema()


const Details = new Schema({
    name: {
        type : String,
        required : true,
    },
    email:{
        type :String, 
        required : true,
        lowercase : true,
        unique : true,
    },
    password : {
        type: String, 
        requires : true ,

    }
})


module.exports  = mongoose.model('user',Details) ;