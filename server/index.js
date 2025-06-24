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
app.get("/api/horses",authenticate, async (req, res) => {
    console.log("GET /api/horses called by user");
    await db.poolConnect; // ensure database is connected
    try {
        const result = await db.pool.request()
            .input("userId", db.sql.Int, req.user.userId) // use user ID from authenticated request
            .query("SELECT * FROM Horse WHERE UserId = @userId"); // fetch horses for the authenticated user
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching horses:", error);
        res.status(500).send({ error: "Failed to fetch horses" });
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
        res.status(500).send({ error: "Failed to add horse" });
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
        const hashed = await bcrypt.hash(password, 10);

        // insert new user into database
        await db.pool.request()
            .input("email", db.sql.VarChar, email)
            .input("hash", db.sql.VarChar, hashed)
            .query("INSERT INTO Users (Email, PasswordHash) VALUES (@email, @hash)");

        res.status(201).send("User registered");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send({ error: "Failed to register user" });
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
        const token = jwt.sign({ userId: user.UserID }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token }); // send the token back to the client
    } catch (error) {
        console.error("login error:", error);
        res.status(500).send({ error: "Login Failed" });
    }
});

// GET horse by ID
app.get("/api/horses/:id", authenticate, async (req, res) => {
    const horseId = req.params.id;
    const userId = req.user.userId; // Get user ID from authenticated request

    await db.poolConnect;

    try {
        const result = await db.pool
            .request()
            .input("id", db.sql.Int, parseInt(horseId)) // parse horseId to integer
            .input("userId", db.sql.Int, userId)
            .query("SELECT * FROM Horse WHERE HorseID = @id AND UserId = @userId");
        if (result.recordset.length === 0) {
            return res.status(404).send("Horse not found");
        }
        res.json(result.recordset[0]); // return the horse details
    } catch (error) {
        console.error("Error fetching horse details:", error);
        res.status(500).send({ error: "Failed to fetch horse details" });
    }
});

// PUT horse by ID
app.put("/api/horses/:id", authenticate, async (req, res) => {
    const { name, breed, age, weight } = req.body;
    const horseId = req.params.id;
    const userId = req.user.userId; // Get user ID from authenticated request
    await db.poolConnect;
    try {
        const reult = await db.pool.request()
            .input("id", db.sql.Int, parseInt(horseId)) 
            .input("userId", db.sql.Int, userId)
            .input("name", db.sql.VarChar, name)
            .input("breed", db.sql.VarChar, breed)
            .input("age", db.sql.Int, age)
            .input("weight", db.sql.Int, weight)
            .query(`
                UPDATE Horse
                SET Name = @name, Breed = @breed, Age = @age, CurrentWeight = @weight
                WHERE HorseID = @id AND UserId = @userId
            `);
        res.send("Horse updated");
    } catch (error) {
        console.error("Error updating horse:", error);
        res.status(500).send({ error: "Failed to update horse" });
    }
});

// DELETE horse by ID
app.delete("/api/horses/:id", authenticate, async (req, res) => {
    const horseId = req.params.id;
    const userId = req.user.userId; // Get user ID from authenticated request
    await db.poolConnect;

    try {
        await db.pool.request()
            .input("id", db.sql.Int, parseInt(horseId))
            .input("userId", db.sql.Int, userId)
            .query("DELETE FROM Horse WHERE HorseID = @id AND UserId = @userId");
        res.send("Horse deleted");
    } catch (error) {
        console.error("Error deleting horse:", error);
        res.status(500).send({ error: "Failed to delete horse" });
    }
});

// GET weight entries for a horse
app.get("/api/horses/:id/weights", authenticate, async (req, res) => {
    const horseId = req.params.id;
    await db.poolConnect;

    try {
         const result = await db.pool.request()
            .input("id", db.sql.Int, parseInt(horseId))
            .query("SELECT * FROM WeightHistory WHERE HorseID = @id ORDER BY EntryDate DESC");
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching weight history:", error);
        res.status(500).send({ error: "Failed to fetch weight history" });
    }
});

// POST weight entry for a horse
app.post("/api/horses/:id/weights", authenticate, async (req, res) => {
    const horseId = req.params.id;
    const { weight } = req.body;
    await db.poolConnect;

    try {
        const query = `INSERT INTO WeightHistory (HorseID, Weight, EntryDate)
            VALUES (@horseId, @weight, GETDATE())`; // use GETDATE() to insert current date`;
        await db.pool.request()
            .input("horseId", db.sql.Int, parseInt(horseId))
            .input("weight", db.sql.Int, weight)
            .query(query);
        res.status(201).send("Weight entry added");
    } catch (error) {
        console.error("Error adding weight entry:", error);
        res.status(500).send({ error: "Failed to add weight entry" });
    }
});

// POST a new care reminder by horse
app.post("/api/reminders", authenticate, async (req, res) => {
    const { horseId, type, dueDate } = req.body; // get horse ID, type and due date from request body
    await db.poolConnect;
    try {
        await db.pool.request()
            .input("horseId", db.sql.Int, horseId)
            .input("type", db.sql.VarChar, type)
            .input("dueDate", db.sql.Date, dueDate)
            .query("INSERT INTO CareReminder (HorseID, Type, DueDate) VALUES (@horseId, @type, @dueDate)");
        res.status(201).send("Care reminder added");
    } catch (error) {
        console.error("Error adding care reminder:", error);
        res.status(500).send({ error: "Failed to add care reminder" });
    }
});

// GET all care reminders for all horses belonging to logged in user
app.get("/api/reminders", authenticate, async (req, res) => {
    const userId = req.user.userId;
    await db.poolConnect;

    try {
        const query = `
            SELECT r.*, h.Name AS HorseName
            FROM CareReminder r
            JOIN Horse h ON r.HorseID = h.HorseID
            WHERE h.UserId = @userId
            ORDER BY r.DueDate ASC
        `;
        const result = await db.pool.request()
            .input("userId", db.sql.Int, userId)
            .query(query);
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching care reminders:", error);
        res.status(500).send({ error: "Failed to fetch care reminders" });
    }
});