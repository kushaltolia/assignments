// Middleware for handling auth
const {Admin} = require("../db/");
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const username = req.headers.username;
    const password = req.headers.password;
    const verifiedAdmin = await Admin.findOne({username : username, password : password});
    if(! verifiedAdmin) {
        res.status(401).send("Unauthorized user");
    } else {
        next();
    }
    
}

module.exports = adminMiddleware;