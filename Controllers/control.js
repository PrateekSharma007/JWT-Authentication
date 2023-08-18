const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors");     
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



//sign up

const signup = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        const check = await user.findOne({ email }).then((result) => {
            if (result && result.length > 0) {
                // throw createError.BadRequest("Email is already registered")
                // res.json({"email" :"email is registered"})
                res.send("error")
                // console.log('user is already there');
            }
        })
        console.log('to add the user request')
        const User = await new user({
            name: name,
            email: email,
            password: password
        })
        
        const token = jwt.sign(
            { user_id: user._id, email },
            '544b7617c7a21c12f27eacbbfa9d38c914345d04f8760e5ac6ee77c814b747bd',
            {
              expiresIn: "2h",
            }
          );
    
        user.token = token;
        console.log(token)
        const save = await User.save();
        // res.json(user)
        res.json(save)

    } catch (err) {
        console.log('some error', err)
        res.status(404).json(err);
    }
}

//login 

const login =async (req,res,next) =>{
    try{
        const { name, email, password } = req.body;
        // const result = await user.validateAsync(req.body)
        ans = true ;
        user.findOne({ email })
        .then(user => {
            
            if (!user) return res.status(400).json({ msg: "User not exist" })

            
            bcrypt.compare(password, user.password, (err, data) => {
          
                if (err) throw err

                if (data) {
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        '544b7617c7a21c12f27eacbbfa9d38c914345d04f8760e5ac6ee77c814b747bd',

                        {
                          expiresIn: "1h",
                        }
                      );
                
                      user.token = token;
                      console.log(token)
                      res.json(user)
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