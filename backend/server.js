require("dotenv").config();
const express = require("express");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("working");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Port: ${PORT}`));
