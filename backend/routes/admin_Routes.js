
const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const {STUDENTS_TABLE, BATCH_TABLE, BATCH_COURSE_TABLE } = require("../config");
const pool = require("../config/db");


const router = express.Router();
/*
 * GET http://localhost:4444/student_batch/assign-student-to-batch
 * Fetch all student-batch assignments (shubhsbhykr07)

const router = express.Router();


// Get all staff
router.get("/all-staff", (request, response) => {
  const sql = `SELECT * FROM ${STAFF_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No staff found."));
    return response.send(successResponse(results));
  });
});

// add a staff
router.post("/add", (request, response) => {
  const { firstName, lastName, email, password } = request.body;
  const sql = `INSERT INTO ${STAFF_TABLE} (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
  pool.execute(sql, [firstName, lastName, email, password], (error, result) => {
    if (error) return response.send(errorResponse(error));
    return response.send(successResponse({
      message: "Staff created successfully",
      staffId: result.insertId
    }));
  });
});

// Update a staff
router.put("/update/:id", (request, response) => {
  const { id } = request.params;
  const { firstName, lastName, email, password } = request.body;
  const sql = `UPDATE ${STAFF_TABLE} SET firstName = ?, lastName = ?, email = ?, password = ? WHERE staff_id = ?`;
  pool.execute(sql, [firstName, lastName, email, password, id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No staff found with ID: " + id));
    return response.send(successResponse("Staff updated successfully"));
  });
});

//  delete a staff
router.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const sql = `DELETE FROM ${STAFF_TABLE} WHERE staff_id = ?`;
  pool.execute(sql, [id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No staff found with ID: " + id));
    return response.send(successResponse("Staff deleted successfully"));
  });
});

// Get- all student (shubhsbhykr07) 
//Get all registered students

router.get("/all-students", (request, response) => {
  const sql = `SELECT * FROM ${STUDENTS_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No students found."));
    }

    return response.send(successResponse(results));
  });
});



//GET- Get all registered students which present in a batch
 /* GET url: http://localhost:4444/student_batch/assign-student-to-batch
 * Fetch all student-batch table (shubhsbhykr07)

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

/** POST Add Student to a Batch(shubhsbhykr07)
 * url: http://localhost:4444/student_batch/assign-student-to-batch
 * Assign-a-student-to-a-batch 
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


//POST- Adds students to a batch
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

