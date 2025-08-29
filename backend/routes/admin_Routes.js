
const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const { BATCH_TABLE } = require("../config");
const { COURSE_TABLE } = require("../config");
const{ STUDENTS_TABLE } = require("../config")
const { STUDENT_BATCH_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();


//GET-Get all staffs
router.get("/all-staff", (request, response) => {
  const sql = `SELECT * FROM ${STAFF_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No staff found."));
    return response.send(successResponse(results));
  });
});

//POST-Adds a new staff
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

//PUT-Updates staff details by staffId
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

//DELETE-Removes staff by Id
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
/** api no -> (W2-83955-Shubham)
 * POST http://localhost:4444/student_course/assign-students-to-course
 * {
 *   "course_id": 2001,
 *   "student_ids": [1, 2, 5]
 * }
 */
router.post("/assign-students-to-course", (req, res) => {
  console.log("current api");
  const { course_id, student_ids } = req.body;

  if (!course_id || !Array.isArray(student_ids) || student_ids.length === 0) {
    return res.send(errorResponse("course_id and student_ids array are required."));
  }

  const sql = `UPDATE ${STUDENTS_TABLE} SET course_id = ? WHERE student_id = ?`;

  let updatedCount = 0;
  let errors = [];

  student_ids.forEach((id, index) => {
    pool.execute(sql, [course_id, id], (err, result) => {
      if (err) {
        errors.push({ student_id: id, error: err.message });
      } else if (result.affectedRows > 0) {
        updatedCount++;
      }

      // send response after all queries processed
      if (index === student_ids.length - 1) {
        return res.send(successResponse({
          message: "Bulk student-course assignment complete",
          updatedCount,
          errors
        }));
      }
    });
  });
});
/** api no -> (shubham banarse)
 * POST http://localhost:4444/student_course/assign-students-to-course
 * {
 *   "course_id": 2001,
 *   "student_ids": [1, 2, 5]
 * }
 */
router.post("/assign-students-to-course", (req, res) => {
  const { course_id, student_ids } = req.body;

  if (!course_id || !Array.isArray(student_ids) || student_ids.length === 0) {
    return res.send(errorResponse("course_id and student_ids array are required."));
  }

  const sql = `UPDATE ${STUDENTS_TABLE} SET course_id = ? WHERE student_id = ?`;

  let updatedCount = 0;
  let errors = [];

  student_ids.forEach((id, index) => {
    pool.execute(sql, [course_id, id], (err, result) => {
      if (err) {
        errors.push({ student_id: id, error: err.message });
      } else if (result.affectedRows > 0) {
        updatedCount++;
      }

      // send response after all queries processed
      if (index === student_ids.length - 1) {
        return res.send(successResponse({
          message: "Bulk student-course assignment complete",
          updatedCount,
          errors
        }));
      }
    });
  });
});

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

