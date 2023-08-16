const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors")



//sign up

const signup = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        const check = await user.find({ email }).then((result) => {
            if (result && result.length>0) {
                throw createError.BadRequest("Email is already registered")
               console.log('user is already there');
            }else{
                console.log('to add the user request')
                const User = new user({
                    name: name,
                    email: email,
                    password: password

                })
                const save = User.save();
                res.json(save);
            }
        })



    } catch (err) {
        console.log('some error',err)
        res.status(404).json(err);
    }
}


module.exports = {signup}