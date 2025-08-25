const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
//const pool = require("../config/db");
const { STUDENT_BATCH_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();


/**
 * GET /all-student-batches
 * Fetch all student-batch assignments
 */

router.get("/all-student-batches", (request, response) => {
  const sql = "SELECT * FROM ${STUDENT_BATCH_TABLE}";

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

/**
  * POST /assign-student-to-batch
 * Assign a student to a batch
 * {
 *   student_id: 1,
 *   batch_id: 2
 * }
 */

router.post("/assign-students-to-batch", (req, res) => {
  const { batch_id, student_id } = req.body;

  if (!batch_id || !Array.isArray(student_id) || student_id.length === 0) {
    return res.send(errorResponse("batch_id and student_ids array are required."));
  }

  // Table name constant
  const sql = `INSERT INTO ${STUDENT_BATCH_TABLE} (student_id, batch_id) VALUES ?`;

  // Convert student_ids to array of arrays for bulk insert
  const values = student_id.map(id => [id, batch_id]);

  pool.query(sql, [values], (error, result) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.send(errorResponse("One or more students are already assigned to this batch."));
      }
      return res.send(errorResponse(error));
    }

    return res.send(successResponse({
      message: "Students assigned to batch successfully",
      affectedRows: result.affectedRows
    }));
  });
});

module.exports = router;