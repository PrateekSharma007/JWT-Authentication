const mongoose = require('mongoose');
const user = require('../database/model')
const db = require('../database/db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const emailValidator = require('email-validator');
const nodemailer = require("nodemailer");
require('dotenv').config() 

//transporter


const transporter = nodemailer.createTransport({
    service : "Gmail" ,
    auth : { 
        user: process.env.Auth_email,   
        pass: process.env.Auth_pass,
    }
})


//generateotp 

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };
  
  // Send OTP email
  const sendOtpEmail = async (email, otp) => {
    try {
      const mailOptions = {
        from: process.env.Auth_email,
        to: email,
        subject: 'OTP Verification',
        html: `<p>Your OTP: ${otp}</p>`,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  };


//Delete otp ; 

const deleteotp = async(email) => { 
    try {
        await user.deleteOne({email});
    } catch (error) {
        throw error;
    }
}



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
            password: password,
           
        });




        const token = jwt.sign(
            { user_id: User._id },
            process.env.Secret_key,
            {
                expiresIn: "3h",
            }
        );

        User.token = token;
        const otp = generateOtp();
        User.otp = otp;
        
        const save = await User.save();
        await sendOtpEmail(email, otp);
        // res.json({ msg: token });
        res.send(`Otp has been sent succesfully to ${email} , please verify it!`)
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
                            process.env.Secret_key,

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


//otp verification 

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
      if (!email || !otp) {
        throw new Error("Missing email or OTP");
      }
  
      const User = await user.findOne({ email }); 
  
      if (!User) {
        throw new Error("User not found");
      }
  
      if (User.expiresat < Date.now()) {
        throw new Error("OTP has expired");
      }
  
      if (User.otp === otp) {
        res.status(200).json({ msg: "Sign up successful" });
      } else {
        await deleteotp(email);
        res.status(401).json({ msg: "Otp is wrong, please do the sign up again" });//change to wrong otp
      }
    } catch (err) {
        await deleteotp(email);
      res.status(400).json({ error: err.message });
    }
  };
  


module.exports = { signup, login,verifyOTP }