const zod = require('zod');
const jwt = require('jsonwebtoken');
const secret = require("../config.js")
// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const authHeader = req.headers.authorization;
    const words = authHeader.split(" ");
    const jwtToken = words[1];
    const decodedValue = jwt.verify(jwtToken, secret);
    if(decodedValue.username) {
        next();
    } else {
        res.status(403).json({
            msg : "You are not authorised"
        })
    }
}

module.exports = adminMiddleware;