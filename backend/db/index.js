const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL && !process.env.DB_PASSWORD) {
  throw new Error(
    "Missing database configuration. Set DATABASE_URL or the DB_* variables and restart the backend."
  );
}

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("render.com")
        ? { rejectUnauthorized: false }
        : undefined,
    })
  : new Pool({
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
