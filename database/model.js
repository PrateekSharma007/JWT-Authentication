const mongoose = require('mongoose') ;
// const Schema = mongoose.Schema()
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

    }
})

Details.pre('save', function(next){
    try {
       
        if (this.isNew) {
          const salt =  bcrypt.genSalt(10)
          const hash =  bcrypt.hash(this.password, salt)
          this.password = hash
        }
        next()
      } catch (error) {
        next(error)
      }
})

Details.methods.isValidPassword = async function(password){
  try{
    return await bcrypt.compare(password,this.password) ;
  }
  catch(err){
    throw err;
  }
}




module.exports  = mongoose.model('user',Details) ;