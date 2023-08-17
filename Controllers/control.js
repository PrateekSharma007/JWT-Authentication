const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors");
const { signaccesstoken } = require('../Jwt/jwt1');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



//sign up

const signup = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        const check = await user.findOne({ email }).then((result) => {
            if (result && result.length > 0) {
                throw createError.BadRequest("Email is already registered")
                console.log('user is already there');
            }
        })
        console.log('to add the user request')
        const User = await new user({
            name: name,
            email: email,
            password: password
        })
        const save = await User.save();
        const token = jwt.sign(
            { user_id: user._id, email },
            "c304a44766afb7c1174f138c00e629b9a3e24dd06b4258b3f5f25e09818c5507",
            {
              expiresIn: "1h",
            }
          );
    
        user.token = token;
        res.json(user)
        // res.json(save)

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
                        "c304a44766afb7c1174f138c00e629b9a3e24dd06b4258b3f5f25e09818c5507",
                        {
                          expiresIn: "1h",
                        }
                      );
                
                      user.token = token;
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