const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors");     
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const emailValidator = require('email-validator');



//sign up

const signup = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        if (!emailValidator.validate(email)) {
            return res.status(400).send({ msg: "Invalid email format" });
        }

        user.findOne({ email }).then((result) => {
            if (result) {
                return res.status(404).send({msg : "Email already registered"})
            }
            
        })

        if(!name || !email || !password) return res.status(400).send({msg : "Please Enter Proper details"})
        else if(password.length <5) return res.status(400).send({msg : "Short Password , Bad request"}) ;
        
        console.log('to add the user request')
        const User = await new user({
            name: name,
            email: email,
            password: password
        })
        
        const token = jwt.sign(
            { user_id: user._id },
            '544b7617c7a21c12f27eacbbfa9d38c914345d04f8760e5ac6ee77c814b747bd',
            {
              expiresIn: "3h",
            }
          );
    
        user.token = token;
        // console.log(token)
        const save = await User.save();
        res.send(token);

    } catch (err) {
      
        res.status(404).json(err);
    }
}
 
//login 

const login = async (req,res,next) =>{
    try{
        const {email, password } = req.body;
        
        user.findOne({ email })
        .then(user => {
            
            if (!user) return res.status(400).json({ msg: "User not exist" })

            
            bcrypt.compare(password, user.password, (err, data) => {
          
                if (err) throw err

                if (data) {
                    const token = jwt.sign(
                        { user_id: user._id, },
                        '544b7617c7a21c12f27eacbbfa9d38c914345d04f8760e5ac6ee77c814b747bd',

                        {
                          expiresIn: "3h",
                        }
                      );
                
                      user.token = token;
                      res.send(token);
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }

            })

        })
    }
    catch(err){
        res.json(err);
    }
}


module.exports = { signup,login }