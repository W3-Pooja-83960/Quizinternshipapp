const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { STUDENTS_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");


// Apply authentication to all routes
router.use(checkAuthentication);

// Get all students
router.get("/all-students", checkRoles(["admin", "coordinator"]),(request, response) => {
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

// Get a student by ID
router.get("/student/:student_id", checkRoles(["admin"]),(request, response) => {
  const { student_id } = request.params;
  const sql = `SELECT * FROM ${STUDENTS_TABLE} WHERE student_id = ?`;

  pool.execute(sql, [student_id], (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No student found with ID: " + student_id));
    }

    return response.send(successResponse(results[0]));
  });
});

// Add a new student
router.post("/add-student", checkRoles(["admin"]),(request, response) => {
  const { firstName, lastName, email, password, prnNo, course_id,batch_id,group_name } = request.body;

  const sql = `
    INSERT INTO ${STUDENTS_TABLE} (firstName, lastName, email, password, prnNo, course_id, batch_id, group_name)
    VALUES (?, ?, ?, ?, ?, ?,?,?)  `;

  pool.execute(sql, [firstName, lastName, email, password, prnNo, course_id,batch_id,group_name], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    return response.send(successResponse({
      message: "Student created successfully",
      studentId: result.insertId
    }));
  });
});

// Update a student
router.put("/update-student/:student_id", checkRoles(["admin"]),(request, response) => {
  const { student_id } = request.params;
  const { firstName, lastName, email, password, prnNo, course_id, batch_id, group_name} = request.body;

  const sql = ` UPDATE ${STUDENTS_TABLE}
    SET firstName = ?, lastName = ?, email = ?, password = ?, prnNo = ?, course_id = ? ,batch_id = ?, group_name = ?
    WHERE student_id = ?  `;

  pool.execute(sql, [firstName, lastName, email, password, prnNo, course_id,batch_id, group_name, student_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.send(successResponse("No student found with ID: " + student_id));
    }

    return response.send(successResponse("Student updated successfully"));
  });
});

// Delete a student
router.delete("/delete-student/:student_id",checkRoles(["admin"]), (request, response) => {
  const { student_id } = request.params;

  const sql = `DELETE FROM ${STUDENTS_TABLE} WHERE student_id = ?`;

  pool.execute(sql, [student_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.send(successResponse("No student found with ID: " + student_id));
    }

    return response.send(successResponse("Student deleted successfully"));
  });
});





module.exports = router;
