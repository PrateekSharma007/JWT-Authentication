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
    },
    password : {
        type: String, 
        requires : true ,

    },
    token : {
      type: String
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