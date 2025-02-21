require("dotenv").config();
const express = require("express");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cors());

const bcrypt = require("bcrypt");
const { Pool } = require('pg');

const jwt = require("jsonwebtoken");

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

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

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

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user exists
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // gen JWT Token
    const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const authToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified; // attach user info to the request
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

app.post("/tasks", authToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    const user_id = req.user.user_id; // get user_id from token instead of req

    if (!title) {
      return res.status(400).json({ error: "Title required." });
    }

    //insert task into db
    const newTask = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, user_id]
    );

    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server err");
  }
})

app.get("/tasks", authToken, async (req, res) => {
  try {
    const user_id = req.user.user_id; // get user_id from token instead of req  

    // get task from db
    const tasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [user_id]
    );

    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/tasks/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;
    const user_id = req.user.user_id; // get user_id from token instead of req

    // check if tasks belongs to the authenticated user
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, user_id]);
    if (task.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to update this task" });
    }

    // going to make the  query dynamically based on provided fields
    let query = "UPDATE tasks SET";
    let values = [];
    let count = 1;

    if (title) {
      query += ` title = $${count++},`;
      values.push(title);
    }

    if (description) {
      query += ` description = $${count++},`;
      values.push(description);
    }

    if (isComplete !== undefined) {
      query += ` isComplete = $${count++},`;
      values.push(isComplete);
    }

    // get rid of that last comma
    query = query.slice(0, -1);
    query += ` WHERE id = $${count} RETURNING *`;
    values.push(id);

    const updatedTask = await pool.query(query, values);

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


app.delete("/tasks/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id; // get user_id from token instead of req

    if (!id) {
      return res.status(400).json({ error: "Invalid task ID." });
    }

    // check if tasks belongs to the authenticated user
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, user_id]);
    if (task.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to update this task" });
    }

    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Port: ${PORT}`));