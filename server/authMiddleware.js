const jwt = require('jsonwebtoken');
// birngs in jsonwebtoken library to decode and verify JWTs
require('dotenv').config(); // Load environment variables from .env file
const JWT_SECRET = process.env.JWT_SECRET;
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization; // Get the Auth header from the request
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send("Missing or invalid token");
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the header
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user id to request
        next();
    } catch (error) {
        console.error("JWT error:", error);
        res.status(401).send("Invalid token");
    }
}

module.exports = authenticate; // Export the authenticate middleware function