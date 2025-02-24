require("dotenv").config();
const { Pool } = require("pg");

const dbName = process.env.DB_NAME || "task_management";

// temp connect to the default pg database to check if DB exists
const tempPool = new Pool({
  user: process.env.DB_USER,
  database: "postgres",
});

const initDB = async () => {
  try {
    // check if database exists
    const dbExists = await tempPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (dbExists.rowCount === 0) {
      await tempPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created.`);
    }

    // close temp connection and switch to the correct database
    await tempPool.end();

    const pool = new Pool({
      user: process.env.DB_USER,
      database: dbName,
    });

    // create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          isComplete BOOLEAN DEFAULT FALSE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log(" Tables ensured in database.");

    return pool;
  } catch (err) {
    console.error(" Error setting up database:", err);
    process.exit(1);
  }
};

const poolPromise = initDB();

module.exports = poolPromise;