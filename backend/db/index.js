const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DB_PASSWORD) {
  throw new Error(
    "Missing DB_PASSWORD in backend/.env. Set your PostgreSQL password and restart the backend."
  );
}

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "insurance_portal",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

async function verifyDatabaseConnection() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}

pool.on("connect", () => console.log("Connected to PostgreSQL"));
pool.on("error", (err) => console.error("DB error:", err));

module.exports = { pool, verifyDatabaseConnection };
