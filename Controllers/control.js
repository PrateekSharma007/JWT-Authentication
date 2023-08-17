const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors");
const { signaccesstoken } = require('../Jwt/jwt1');
const bcrypt = require("bcrypt")



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
        // res.json(save);
        const accesstoken = await signaccesstoken(save.id);
        // console.log(accesstoken)
        // res.json(accesstoken)
        // res.json(save)
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
            //if user not exist than return status 400
            if (!user) return res.status(400).json({ msg: "User not exist" })

            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            bcrypt.compare(password, user.password, (err, data) => {
                //if error than throw error
                if (err) throw err

                //if both match than you can do anything
                if (data) {
                    return res.status(200).json({ msg: "Login success" })
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