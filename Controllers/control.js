const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const createError = require("http-errors");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const emailValidator = require('email-validator');



//sign up

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please enter proper details" });
    }

    if (!emailValidator.validate(email)) {
        return res.status(400).json({ msg: "Invalid email format" });
    }

    try {
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        if (password.length < 5) {
            return res.status(400).json({ msg: "Password length should be greater than 5, Bad request" });
        }

        const User = await new user({
            name: name,
            email: email,
            password: password
        });

        const token = jwt.sign(
            { user_id: User._id },
            '544b7617c7a21c12f27eacbbfa9d38c914345d04f8760e5ac6ee77c814b747bd',
            {
                expiresIn: "3h",
            }
        );

        User.token = token;
        const save = await User.save();
        res.json({ "token": token });
    } catch (err) {
        res.json({ msg: err });
    }
};


//login 

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        user.findOne({ email })
            .then(user => {

                if (!user) return res.status(400).json({ msg: "User not exist" })


                bcrypt.compare(password, user.password, (err, data) => {

                    if (err) res.json(err);

                    if (data) {
                        const token = jwt.sign(
                            { user_id: user._id, },
                            '544b7617c7a21c12f27eacbbfa9d38c914345d04f8760e5ac6ee77c814b747bd',

                            {
                                expiresIn: "3h",
                            }
                        );

                        user.token = token;
                        res.json({ "token": token });
                    } else {
                        return res.status(401).json({ msg: "Invalid credencial" })
                    }

                })

            })
    }
    catch (err) {
        res.json(err);
    }
}


module.exports = { signup, login }