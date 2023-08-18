const express = require("express") 
const app = express() ; 
const morgan = require('morgan') //middleware
const createError = require('http-errors') 
const route = require('./Routes/route')
const db =require("./database/db")
const mongoose = require("mongoose")
const auth = require("./Controllers/verifytoken")
const jwt = require("jsonwebtoken")



app.use(express.json({limit : '5mb'}));
app.use(express.urlencoded({extended : true}));

app.use(morgan('dev'))
app.use('/',route )

app.post("/", auth, (req, res) => {
    res.status(200).send("JWT AUTH");
})



app.get("/",async (req,res) => { 
    res.send('Auth Started')
})



app.listen(3000, () => {
    console.log("Port 3000 is working")
}) 