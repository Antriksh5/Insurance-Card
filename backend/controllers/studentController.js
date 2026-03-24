const { pool } = require("../db");

const getStudentByRollNo = async (req, res) => {
  const { rollNo } = req.params;
  if (!rollNo?.trim()) return res.status(400).json({ error: "Roll number is required" });
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE UPPER(roll_no) = UPPER($1)",
      [rollNo.trim()]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Student not found" });
    const s = result.rows[0];
    return res.json({
      card_no: s.card_no, name: s.name, gender: s.gender,
      age: s.age, roll_no: s.roll_no, corporate_name: s.corporate_name,
      valid_from: s.valid_from, branch: s.branch, year: s.year,
    });
  } catch (err) {
    console.error("getStudentByRollNo failed:", err.message);
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : `Database request failed: ${err.message}`;
    return res.status(500).json({ error: message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT roll_no, name, branch, year FROM students ORDER BY roll_no");
    return res.json(result.rows);
  } catch (err) {
    console.error("getAllStudents failed:", err.message);
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : `Database request failed: ${err.message}`;
    return res.status(500).json({ error: message });
  }
};

module.exports = { getStudentByRollNo, getAllStudents };
