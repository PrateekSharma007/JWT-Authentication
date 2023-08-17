const express = require("express") ; 
const app = express() ; 
const router = express.Router() ;
// const control = require("../Controllers/control")
const {signup,login} = require('../Controllers/control')


router.post('/signup' ,signup )


router.post("/login" , login)

// router.post('/refresh-token',(req,res) => { 
//     res.send("register route")
// })

// router.delete('/logout',(req,res) => { 
//     res.send("logout route") ;
// })

module.exports = router;