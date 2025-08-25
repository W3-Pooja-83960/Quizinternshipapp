// routes/studentBatch.js

const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { STUDENT_BATCH_TABLE } = require("../config");
const pool = require("../config/db");

const router = express.Router();

/*
 * GET http://localhost:4444/student_batch/assign-student-to-batch
 * Fetch all student-batch assignments
 */

router.get("/all-student-batches", (request, response) => {
  const sql = `SELECT * FROM ${STUDENT_BATCH_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No student assigned to any batch."));
    }

    return response.send(successResponse(results));
  });
});

/**  api no -> 05
 * POST http://localhost:4444/student_batch/assign-student-to-batch
 * Assign a student to a batch
 * {
  "student_id": 3,
  "batch_id": 4
}

 */
router.post("/assign-student-to-batch", (request, response) => {
  const { student_id, batch_id } = request.body;

  if (!student_id || !batch_id) {
    return response.send(errorResponse("student_id and batch_id are required."));
  }

  const sql = `INSERT INTO ${STUDENT_BATCH_TABLE} (student_id, batch_id) VALUES (?, ?)`;

  pool.execute(sql, [student_id, batch_id], (error, result) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return response.send(errorResponse("Student already assigned to this batch."));
      }

      return response.send(errorResponse(error));
    }

    return response.send(successResponse({
      message: "Student assigned to batch successfully",
      insertId: result.insertId
    }));
  });
});




module.exports = router;
