const mongoose = require('mongoose') ;
const bcrypt = require("bcrypt");


const Details = mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    email:{
        type :String, 
        required : true,
        lowercase : true,
        unique : true,
        // email validation
    },
    password : {
        type: String, 
        requires : true ,
        minlength : 5,
        maxlength: 30

    },
    token : {
      type: String
    },
    verification : {
      Boolean : false
    }
})

Details.pre('save',async function(next){
  try {
     
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password, salt)
        this.password = hash
      }
      next()
    } catch (error) {
      next(error)
    }
})


module.exports  = mongoose.model('user',Details) ;