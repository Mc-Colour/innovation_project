const authenticate = require('./authMiddleware'); // import middleware for authentication
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bcrypt = require('bcrypt'); // brings in bcrypt for password hashing
const jwt = require('jsonwebtoken'); 
const JWT_SECRET = process.env.JWT_SECRET; // bring in secret key for JWT from enviornment variables

const db = require('./db'); // import database connection
const app = express(); // creates an instance of express
app.use(cors()); // aplows front end to access backend even if on different ports
app.use(express.json()); 

// GET horses
app.get("/api/horses", async (req, res) => {
    console.log("GET /api/horses called");
    await db.poolConnect; // ensure database is connected
    try {
        const result = await db.pool.request().query("SELECT * FROM Horse");
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching horses:", error);
        res.status(500).json({ error: "Failed to fetch horses" });
    }
});

// POST horse
app.post("/api/horses", authenticate, async (req, res) => {
    // Extract horse data form request body
    const { name, breed, age, weight } = req.body;
    const userId = req.user.userId; // Get user ID from authenticated request
    console.log("Decoded token:", req.user);
    await db.poolConnect; // ensure database is connected
    try {
        //insert new horse into database linking to authenticated user
        const query = `
            INSERT INTO Horse (Name, Breed, Age, CurrentWeight, UserId)
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
    } catch (error) {
        console.error("Error adding horse:", error);
        res.status(500).json({ error: "Failed to add horse" });
    }
});

// server listens on port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// POST register user
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    await db.poolConnect; 

    try {
        // hash the password securely before storing it
        const hased = await bcrypt.hash(password, 10);

        // insert new user into database
        await db.pool.request()
            .input("email", db.sql.VarChar, email)
            .input("hash", db.sql.VarChar, hashed)
            .query("INSERT INTO Users (Email, PasswordHash) VALUES (@email, @hash)");

        res.status(201).send("User registered");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});


// POST login user
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    await db.poolConnect;

    try {
        // check if user exists against the provided email
        const result = await db.pool.request()
            .input("email", db.sql.VarChar, email)
            .query("SELECT * FROM Users WHERE Email = @email");
        const user = result.recordset[0];
        // if no user found, return 401 unauthorised
        if (!user) return res.status(401).send("Invalid email");
        // compare provided password with stored hash
        const match = await bcrypt.compare(password, user.PasswordHash);
        if (!match) return res.status(401).send("Invalid password");
        // if auth is successful create a JWT token,
        // the token contains the user ID and signed with secret key
        //this token can be used to authenticate future requests
        const token = jwt.sign({ userId: user.UserID }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); // send the token back to the client
    } catch (error) {
        console.error("login error:", error);
        res.status(500).send({ error: "Login Failed" });
    }
});