const express = require("express") ; 
const app = express() ; 
const router = express.Router() ;

router.post('/signup' , (req,res) => { 
    res.send("Signup here")
})


router.post("/login" ,(req,res) => { 
    res.send("Login here") ;
})

router.post('/refresh-token',(req,res) => { 
    res.send("register route")
})

router.delete('/logout',(req,res) => { 
    res.send("logout route") ;
})

module.exports = router;