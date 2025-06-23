const jwt = require("jsonwebtoken");

// birngs in jsonwebtoken library so one cand decode and verify JWT tokens
const JWT_SECRET = "yoursecretkey"; // note to self, move to environment variable in production

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization; // Get the Authorization header from the request

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Check if the header is present and starts with "Bearer "
    return res.status(401).send("Missing or invalid token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach user id to request
    next(); // Continue to route
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).send("Invalid token");
  }
}

module.exports = authenticate;