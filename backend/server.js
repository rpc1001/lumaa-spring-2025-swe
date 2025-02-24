require("dotenv").config();
const express = require("express");
const cors = require("cors");

const poolPromise = require("./src/config/db");


const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", require("./src/routes/authRoutes"));
app.use("/tasks", require("./src/routes/taskRoutes"));

const PORT = process.env.PORT || 3000;

poolPromise.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to init database", err);
});
