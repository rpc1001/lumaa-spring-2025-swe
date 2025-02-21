require("dotenv").config();
const express = require("express");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cors());

const bcrypt = require("bcrypt");
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

app.get("/", (req, res) => {
  res.send("working");
});

app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert user into db
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Port: ${PORT}`));