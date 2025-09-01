const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const {  STUDENTS_TABLE,  STUDENTS_QUIZ_TABLE } = require("../config");

//assign quiz to students of a particular batch and course
router.post("/assign-module-quiz", (req, res) => {
  const { batch_id, course_id, quiz_id } = req.body;

  if (!batch_id || !course_id || !quiz_id) {
    return res.status(400).send({
      status: "error",
      message: "batch_id, course_id, and quiz_id are required"
    });
  }

  // Get all students from that batch and course
  const getStudentsSql = `
    SELECT student_id 
    FROM ${STUDENTS_TABLE} 
    WHERE batch_id = ? AND course_id = ?
  `;
  pool.query(getStudentsSql, [batch_id, course_id], (err, students) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).send({ status: "error", message: "Server error" });
    }

    if (students.length === 0) {
      return res.send({ status: "error", message: "No students found for this batch and course" });
    }

    //insert values
    const values = students.map(s => [s.student_id, quiz_id]);

    //insert into StudentQuiz
    const insertSql = `
      INSERT INTO ${STUDENTS_QUIZ_TABLE} (student_id, quiz_id) VALUES ?
    `;
    pool.query(insertSql, [values], (err2, result) => {
      if (err2) {
        console.error("MySQL error:", err2);
        return res.status(500).send({ status: "error", message: "Server error" });
      }

      res.send({
        status: "success",
        message: `Quiz assigned to ${students.length} students`
      });
    });
  });
});

module.exports = router;








