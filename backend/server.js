// SETUP:
// 1. cd backend && cp .env.example .env  (fill in DB password)
// 2. psql -U postgres -d insurance_portal -f db/schema.sql
// 3. npm install && npm run dev
// Frontend: cd frontend && npm install && npm run dev
// Open: http://localhost:5173 - type 24UCS134 to test

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/students");
const { verifyDatabaseConnection } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/students", studentRoutes);
app.get("/api/health", async (req, res) => {
  try {
    await verifyDatabaseConnection();
    return res.json({ status: "ok", database: "connected" });
  } catch (err) {
    return res.status(500).json({ status: "error", database: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
