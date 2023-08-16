const jwt = require("jsonwebtoken") ;
const createError = require("http-errors") 





module.exports = {
    signaccesstoken : (userId) => {
        return new Promise((resolve,reject) => { 
            const payload = {
                name : "prateek" 
            }
            const secret = "secret"
            const options = {}
            jwt.sign(payload,secret,options ,(err,token) =>{
                if(err) reject(err)
                resolve(token)
            })
        })
    }
}