const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const pool = require("../config");
const { STUDENT_GROUP_TABLE } = require("../config");

const router = express.Router();

// Get all student groups
router.get("/all", (request, response) => {
  const sql = `SELECT * FROM ${STUDENT_GROUP_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No student groups found."));
    return response.send(successResponse(results));
  });
});

// Get a student group by ID
router.get("/:id", (request, response) => {
  const { id } = request.params;
  const sql = `SELECT * FROM ${STUDENT_GROUP_TABLE} WHERE id = ?`;
  pool.execute(sql, [id], (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No student group found with ID: " + id));
    return response.send(successResponse(results[0]));
  });
});

// Add a new student group
router.post("/add", (request, response) => {
  const { studentId, moduleId } = request.body;
  const sql = `INSERT INTO ${STUDENT_GROUP_TABLE} (studentId, moduleId) VALUES (?, ?)`;
  pool.execute(sql, [studentId, moduleId], (error, result) => {
    if (error) return response.send(errorResponse(error));
    return response.send(successResponse({
      message: "Student group created successfully",
      groupId: result.insertId
    }));
  });
});

// Update a student group
router.put("/update/:id", (request, response) => {
  const { id } = request.params;
  const { studentId, moduleId } = request.body;
  const sql = `UPDATE ${STUDENT_GROUP_TABLE} SET studentId = ?, moduleId = ? WHERE id = ?`;
  pool.execute(sql, [studentId, moduleId, id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No student group found with ID: " + id));
    return response.send(successResponse("Student group updated successfully"));
  });
});

// Soft delete a student group
router.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const sql = `UPDATE ${STUDENT_GROUP_TABLE} SET is_active = 0 WHERE id = ?`;
  pool.execute(sql, [id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No student group found with ID: " + id));
    return response.send(successResponse("Student group deleted successfully"));
  });
});

module.exports = router;
