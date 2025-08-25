
const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { STUDENT_BATCH_TABLE } = require("../config");
const pool = require("../config/db");

const router = express.Router();
/*
 * GET http://localhost:4444/student_batch/assign-student-to-batch
 * Fetch all student-batch assignments (shubhsbhykr07)
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

/**  api no -> 05 (shubhsbhykr07)
 * POST http://localhost:4444/student_batch/assign-student-to-batch
 * Assign a student to a batch
 * {
  "student_id": 3,
  "batch_id": 4
}
**/
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


  // api no:- (w3-pooja-83960)
// /assign-students-to-batch (multiple student added in batch)

router.post("/assign-students-to-batch", (req, res) => {
  const { batch_id, student_id } = req.body;

  if (!batch_id || !Array.isArray(student_id) || student_id.length === 0) {
    return res.send(errorResponse("batch_id and student_ids array are required."));
  }
  
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

