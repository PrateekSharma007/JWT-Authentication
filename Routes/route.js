const express = require("express") ; 
const app = express() ; 
const router = express.Router() ;
// const control = require("../Controllers/control")
const {signup} = require('../Controllers/control')


router.post('/signup' ,signup )


// router.post("/login" ,(req,res) => { 
//     res.send("Login here");
// })

// router.post('/refresh-token',(req,res) => { 
//     res.send("register route")
// })

// router.delete('/logout',(req,res) => { 
//     res.send("logout route") ;
// })

module.exports = router;