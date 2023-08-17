const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {


    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        console.log("here1")
        const decoded = jwt.verify(token, "c304a44766afb7c1174f138c00e629b9a3e24dd06b4258b3f5f25e09818c5507");
        req.user = decoded;
    } catch (err) {
        console.log("here2")
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;