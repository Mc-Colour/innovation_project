const authenticate = require("./authMiddleware"); // import middleware for authentication
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcrypt"); // brings in bcrypt for password hashing
// bcrypt is used to hash passwords before storing them in the database
// and to compare hashed passwords during login
// this is a security measure to protect user passwords
const jwt = require("jsonwebtoken");
const JWT_SECRET = "yoursecretkey"; // note to self, move to environment variable in production

const db = require("./db"); // brings in the database connection setup from db.js
const app = express();  // creates an Express application instance
app.use(cors()); // allows frontend to access backend even if on different ports
app.use(express.json()); 

// GET all horses
app.get("/api/horses", async (req, res) => {
  console.log("GET /api/horses called");
  await db.poolConnect; // ensure database is connected
  try {
    const result = await db.pool.request().query("SELECT * FROM Horse"); // query to get all horses
    res.json(result.recordset); // send result to frontend
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).send("Error fetching horses");
  }
});

// POST a new horse
app.post("/api/horses", authenticate, async (req, res) => {
    // Extract horse data from request body
  const { name, breed, age, weight } = req.body;
  const userId = req.userId; // Get user ID from authenticated request

  await db.poolConnect; // ensure database is connected
  try {
    //Insert new horse into the database linking it to the authenticated user
    const query = `
      INSERT INTO Horse (Name, Breed, Age, CurrentWeight, UserID)
      VALUES (@name, @breed, @age, @weight, @userId)
    `;
    await db.pool.request()
      .input("name", db.sql.VarChar, name)
      .input("breed", db.sql.VarChar, breed)
      .input("age", db.sql.Int, age)
      .input("weight", db.sql.Int, weight)
      .input("userId", db.sql.Int, userId)
      .query(query);

    res.status(201).send("Horse added");
  } catch (err) {
    console.error("Error adding horse:", err);
    res.status(500).send("Failed to add horse");
  }
});

// server listens on port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// POST register user
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  await db.poolConnect;

  try {
    // hash the password securely before storing it
    const hashed = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.pool.request()
      .input("email", db.sql.VarChar, email)
      .input("hash", db.sql.VarChar, hashed)
      .query("INSERT INTO Users (Email, PasswordHash) VALUES (@email, @hash)");

    res.status(201).send("User registered");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Registration failed");
  }
});


// POST login user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  await db.poolConnect;

  try {
    // Check if user exists with the provided email
    const result = await db.pool.request()
      .input("email", db.sql.VarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    const user = result.recordset[0];
    // If no user found, return 401 Unauthorized
    if (!user) return res.status(401).send("Invalid email");

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) return res.status(401).send("Incorrect password");

    // If authentication is successful, create a JWT token
    // The token contains the user ID and is signed with a secret key
    // The token will expire in 1 hour
    // This token can be used to authenticate future requests
    // The token is sent back to the client to be stored
    const token = jwt.sign({ userId: user.UserID }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Login failed");
  }
});