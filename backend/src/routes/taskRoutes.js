const express = require("express");
const authToken = require("../middleware/authMiddleware");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");

const router = express.Router();

router.post("/", authToken, createTask);
router.get("/", authToken, getTasks);
router.put("/:id", authToken, updateTask);
router.delete("/:id", authToken, deleteTask);

module.exports = router;