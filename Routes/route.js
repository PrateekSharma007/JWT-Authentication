const express = require("express") ; 
const app = express() ; 
const router = express.Router() ;
// const control = require("../Controllers/control")
const {signup,login, verifyOTP} = require('../Controllers/control');
const { verify } = require("jsonwebtoken");


router.post('/signup' ,signup )


router.post("/login" , login)


router.post("/signup/verify" , verifyOTP)

module.exports = router;