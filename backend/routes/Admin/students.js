const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const { STUDENT_BATCH_TABLE } = require("../../config");
const { STUDENTS_TABLE } = require("../../config");
const { BATCH_TABLE } = require("../../config");


// GET all students in a batch with full details
router.get("/all-students-with-batch/:batch_id", (req, res) => {
  const { batch_id } = req.params;

  const sql = ` SELECT  s.student_id, s.firstName, s.lastName, s.prnNo, s.email, s.course_id,
                        b.batch_id, b.batch_name,
                        sb.assigned_at
                FROM ${STUDENT_BATCH_TABLE} sb
                JOIN ${STUDENTS_TABLE} s ON sb.student_id = s.student_id
                JOIN ${BATCH_TABLE} b ON sb.batch_id = b.batch_id
                WHERE sb.batch_id = ?`;

  pool.query(sql, [batch_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: "error", message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({ status: "success", message: "No students found in this batch", data: [] });
    }

    res.json({ status: "success", data: results });
  });
});

module.exports = router;
