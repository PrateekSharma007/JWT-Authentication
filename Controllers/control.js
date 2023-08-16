const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors")



//sign up

const signup = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        const check = await user.find({ email }).then((result) => {
            if (result) {
                throw createError.Conflict("User with same email");
            }  
        })
        const newuser = await new details({
            name: name,
            email: email,
            password: password

        })
        const save = await newuser.save();
        res.send(save);


    } catch (err) {
        res.send(err);
    }
}


module.exports = {signup}