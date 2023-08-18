const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {


    const token =
        req.body.token || req.query.token || req.headers['token'];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // console.log("here1")
        console.log("token")
        const decoded = jwt.verify(token, "544b7617c7a21c12f27eacbbfa9d38c914345d04f8760e5ac6ee77c814b747bd");
        req.user = decoded;
        res.send(decoded)
        // console.log(decoded)
    } catch (err) {
        // console.log("here2")
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;