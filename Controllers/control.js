const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors");
const { signaccesstoken } = require('../Jwt/jwt1');



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
        res.json(accesstoken)
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
        const check = await user.findOne({ email }).then((result) => {
            if (result && result.length > 0) {
                res.send("Found")
            }
        })
        

    }
    catch(err){
        res.send(err);
    }
}

module.exports = { signup,login }