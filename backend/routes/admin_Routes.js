
const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const { BATCH_TABLE } = require("../../config");
const { COURSE_TABLE } = require("../../config");
const { STUDENT_BATCH_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();


//GET-Get all staffs

//POST-Adds a new staff

//PUT-Updates staff details by staffId

//DELETE-Removes staff by Id

//GET- Get all registered students
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



//POST- Adds student to a batch

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

//POST- Adds multiple students to a batch
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

//GET- Get all students which are present in a batch

//POST- Adds student to a course

//POST- Adds multiple students to a course

//GET - Get all students which are present in a batch
router.get("/all-students-with-batch/:batch_id", (req, res) => {
  const { batch_id } = req.params;

  const sql = `SELECT s.student_id, s.firstName, s.lastName, s.email, s.prnNo, 
                      c.course_name,
                      b.batch_name
                    FROM ${STUDENTS_TABLE} s
                    JOIN ${COURSE_TABLE } c ON s.course_id = c.course_id
                    JOIN ${BATCH_TABLE} b ON s.batch_id = b.batch_id
                    WHERE b.batch_id = 1`;  

  pool.query(sql, [batch_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ status: "error", message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        status: "success",
        message: "No students found in this batch",
        data: []
      });
    }

    res.json({ status: "success", data: results });
  });
});

//POST- Adds student to a course 

//POST- Adds multiple students to a course

//GET- Get all students which are present in a course

//PUT- Updates student record batch and course
router.put("/update-student-record/:student_id", (req, res) => {
  const { student_id } = req.params;
  const data = req.body;

  if (!Object.keys(data).length) return res.send({ status: "error", message: "No data given" });

  console.log("Updating student ID:", student_id, "with data:", data);

  const sql = `UPDATE ${STUDENTS_TABLE} SET ? WHERE student_id=?`;

  pool.query(sql, [data, student_id], (err, result) => {
    if (err) return res.send({ status: "error", message: "DB error" });
    if (result.affectedRows === 0) return res.send({ status: "error", message: "Student not found" });
    res.send({ status: "success", message: "Student updated" });
  });
});

//GET-Shows all assigned students (optional: courseId, groupId)







module.exports = router;

