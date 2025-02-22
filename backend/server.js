require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", require("./src/routes/authRoutes"));
app.use("/tasks", require("./src/routes/taskRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Port: ${PORT}`));