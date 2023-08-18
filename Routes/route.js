const express = require("express") ; 
const app = express() ; 
const router = express.Router() ;
// const control = require("../Controllers/control")
const {signup,login} = require('../Controllers/control')


router.post('/signup' ,signup )


router.post("/login" , login)



module.exports = router;