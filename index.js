const express = require("express") 
const app = express() ; 
const morgan = require('morgan') //middleware
const createError = require('http-errors') 
const route = require('./Routes/route')
const db =require("./database/db")
const mongoose = require("mongoose")

app.use(express.json({limit : '5mb'}));
app.use(express.urlencoded({extended : true}));

app.use(morgan('dev'))
app.use('/',route)


app.get("/",async (req,res) => { 
    res.send('Auth Started')
})
//if route is not mentioned this will fire up
// app.use(async (req,res,next) => { 
//     next(createError.NotFound());
// }) //next passes control to the middleware 




app.listen(3000, () => {
    console.log("Port 3000 is working")
}) 