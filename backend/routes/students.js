const express = require("express");
const router = express.Router();
const { getStudentByRollNo, getAllStudents } = require("../controllers/studentController");

router.get("/", getAllStudents);
router.get("/:rollNo", getStudentByRollNo);

module.exports = router;
