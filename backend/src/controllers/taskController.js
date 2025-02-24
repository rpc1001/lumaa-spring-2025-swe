const poolPromise = require("../config/db");

const createTask = async (req, res) => {
  try {
    const pool = await poolPromise;
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
};

const getTasks = async (req, res) => {
  try {
    const pool = await poolPromise;
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
};

const updateTask = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;
    const { title, description, isComplete } = req.body;
    const user_id = req.user.user_id; // get user_id from token instead of req

    // check if tasks belongs to the authenticated user
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, user_id]);
    if (task.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to update this task" });
    }

    // going to make the query dynamically based on provided fields
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
};

const deleteTask = async (req, res) => {
  try {
    const pool = await poolPromise;
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
};

module.exports = { createTask, getTasks, updateTask, deleteTask };