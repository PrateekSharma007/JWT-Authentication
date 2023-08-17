const jwt = require("jsonwebtoken") ;
const createError = require("http-errors") 





// module.exports = {
//     signaccesstoken : (userId) => {
//         return new Promise((resolve,reject) => { 
//             const payload = {
//             }
//             const secret = "c304a44766afb7c1174f138c00e629b9a3e24dd06b4258b3f5f25e09818c5507"
//             const options = {
//                 expiresIn : "1h",

//             }
//             jwt.sign(payload,secret,options ,(err,token) =>{
//                 if(err) reject(err)
//                 resolve(token)
//             })
//         })
//     }
// }