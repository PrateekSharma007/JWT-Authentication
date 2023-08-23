const express = require("express") ; 
const app = express() ; 
const router = express.Router() ;
// const control = require("../Controllers/control")
const {signup,login, verifyOTP , forgot_password,reset} = require('../Controllers/control');
const { verify } = require("jsonwebtoken");


router.post('/signup' ,signup )


router.post("/login" , login)


router.post("/signup/verify" , verifyOTP)

router.post("/login/forgot_password", forgot_password )

router.post("/login/forgot_password/reset" , reset) ;

module.exports = router;