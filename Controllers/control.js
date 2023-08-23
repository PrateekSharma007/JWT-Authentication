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
       
        res.send(`Otp has been sent succesfully to ${email} , please verify it!`)
    } catch (err) {
        res.json({ msg: err });
    }
};


//login 

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const User = await user.findOne({ email });
    console.log(User)
    if (!User) {

      return res.status(400).json({ msg: "User not exist" });
    }
    // console.log("here")
    const isPasswordMatch = await bcrypt.compare(password, User.password);
    // console.log("password")
    if (isPasswordMatch) {
      // console.log(User.verification)
      if (User.verification === false) {
        // console.log("1")
        const otp = generateOtp() ;
        User.expiresat = Date.now() +1*60*1000;
        User.otp = otp;
        
        await User.save();
        await sendOtpEmail(email, otp);
        // res.json({ msg: token });
        res.send(`Otp has been sent succesfully to ${email} , please verify it!`)
      }
      


      const token = jwt.sign(
        { user_id: User._id },
        process.env.Secret_key,
        { expiresIn: "3h" }
      );

      User.token = token;
      await User.save();
      
      res.send("Login successfull")
    } else {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

      
  } catch (err) {
    res.json(err);
  }
};



//otp verification 
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const User = await user.findOne({ email });
  
  try {
    if (!email || !otp) {
      throw new Error("Missing email or OTP");
    }

    if (!User) {
      throw new Error("User not found");
    }

    if (User.expiresat < Date.now()) {
      throw new Error("OTP has expired");
    }

    if (User.otp === otp) {
      User.verification = true;
      await User.save(); 

      res.status(200).json({ msg: "Verification successful" });
    } else {
      res.status(401).json({ msg: "Incorrect OTP, please try again" });
    }
  } catch (err) {
    User.otp = "";
    res.status(400).json({ error: err.message });
  }
};



// 

const verifyOTPpass = async ({email, otp}) => {
  try {
    const User = await user.findOne( {email} );
    
    if (!email || !otp) {
      throw new Error("Missing email or OTP");
    }

    
    if (!User) {v  
      throw new Error("User not found");
    }

    if (User.expiresat < Date.now()) {

      throw new Error("OTP has expired");
    }

    if (User.otp === otp) {
      // User.verification = true;
      await User.save();
      // res.status(200).json({ msg: "Verification successful" });
      return true ;
    } else {
      // res.status(401).json({ msg: "Incorrect OTP, please try again" });
      return false ; 
    }
  } catch (err) {
    // res.status(400).json({ error: err.message });
    throw err
  }
};


const sendOtpEmailpass = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.Auth_email,
      to: email,
      subject: 'Password reset',
      html: `<p>Your OTP: ${otp}</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

const passwordresetotp = async (email) => {
  try {
    const User = await user.findOne({ email });
    if (!User) throw new Error("No such email found, first sign up");

    if (!User.verification) throw new Error("Please verify your email first");

    const otp = generateOtp();
    User.otp = otp;
    User.expiresat = Date.now() + 1 * 60 * 1000; 
    await User.save();

    await sendOtpEmailpass(User.email, otp);
  } catch (err) {
    throw err;
  }
};

const forgot_password = async (req,res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("An email is required");

    await passwordresetotp(email);

    res.status(200).json({ msg: "Password reset OTP sent successfully" });
  } catch (error) {
    console.log("forgot_password")
    res.status(400).json({ error: error.message });
  }
};

const resetpass = async ({ email, otp, newpassword }) => {
  try {
    const isOTPVerified = await verifyOTPpass( {email, otp });

    if (isOTPVerified) {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const User = await user.findOne({ email });
      User.password = hashedPassword;
      User.otp = "";
      await User.save();
      return true; 
    } else {
      return false; 
    }
  } catch (err) {
    throw err;
  }
};



const reset = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;
    if (!email || !otp || !newpassword) {
      throw new Error("All fields are required");
    }

    if (newpassword.length < 5) {
      throw new Error("Password length should be greater than 5");
    }

    const isPasswordResetSuccessful = await resetpass({ email, otp, newpassword });

    if (isPasswordResetSuccessful) {
      res.status(200).json({ msg: "Password reset successful" });
    } else {
      res.status(400).json({ msg: "Password reset failed due to incorrect OTP" });
    }
  } catch (error) {
    console.error("Error in reset:", error);
    res.status(400).json({ error: error.message });
  }
};



module.exports = { signup, login, verifyOTP, forgot_password, reset };
