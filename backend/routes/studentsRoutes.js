const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { STUDENTS_TABLE } = require("../config/index");
const pool = require("../config");
//const { app } = require(".../server");

const router = express.Router();

//const { PORT } = require("../config/");
//const routeNotFound = require("./middlewares/routeNotFound");



// Get all students
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

// Get a student by ID
router.get("/student/:student_id", (request, response) => {
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
router.post("/add-student", (request, response) => {
  const { firstName, lastName, email, password, prnNo, course_id } = request.body;

  const sql = `
    INSERT INTO ${STUDENTS_TABLE} (firstName, lastName, email, password, prnNo, course_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  pool.execute(sql, [firstName, lastName, email, password, prnNo, course_id], (error, result) => {
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
router.put("/update-student/:student_id", (request, response) => {
  const { student_id } = request.params;
  const { firstName, lastName, email, password, prnNo, course_id } = request.body;

  const sql = `
    UPDATE ${STUDENTS_TABLE}
    SET firstName = ?, lastName = ?, email = ?, password = ?, prnNo = ?, course_id = ?
    WHERE student_id = ?
  `;

  pool.execute(sql, [firstName, lastName, email, password, prnNo, course_id, student_id], (error, result) => {
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
router.delete("/delete-student/:student_id", (request, response) => {
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


app.use("/students", studentsRoutes);
