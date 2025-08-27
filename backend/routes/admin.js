const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { STUDENTS_TABLE, BATCH_TABLE, BATCH_COURSE_TABLE } = require("../config");

// Get all students in a batch
router.get("/all-students-with-batch/:batchId", (req, res) => {
  const { batchId } = req.params;

  const sql = `
    SELECT s.student_id, s.firstName, s.lastName, s.email, s.prnNo, b.batch_name
    FROM ${STUDENTS_TABLE} s
    INNER JOIN ${BATCH_COURSE_TABLE} bc ON s.course_id = bc.course_id
    INNER JOIN ${BATCH_TABLE} b ON bc.batch_id = b.batch_id
    WHERE b.batch_id = ?
  `;

  pool.execute(sql, [batchId], (error, results) => {
    if (error) {
      return res.send(errorResponse(error));
    }

    if (results.length === 0) {
      return res.send(successResponse(`No students found in batch ID: ${batchId}`));
    }

    return res.send(successResponse(results));
  });
});

module.exports = router;
