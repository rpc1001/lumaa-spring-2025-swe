require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

module.exports = pool;