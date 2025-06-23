const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/api/horses", async (req, res) => {
  console.log("GET /api/horses called");
  await db.poolConnect;
  try {
    const result = await db.pool.request().query("SELECT * FROM Horse");
    console.log("✅ DB result:", result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).send("Error fetching horses");
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));