const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const pool = require("../config/db");
const { STUDENTS_GROUP_TABLE } = require("../config");

const router = express.Router();

// Get all student groups
router.get("/all", (request, response) => {
  const sql = `SELECT * FROM ${STUDENTS_GROUP_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No student groups found."));
    return response.send(successResponse(results));
  });
});

// Get a student group by ID
router.get("/:group_id", (request, response) => {
  const { group_id } = request.params;
  const sql = `SELECT * FROM ${STUDENTS_GROUP_TABLE} WHERE group_id = ?`;
  pool.execute(sql, [group_id], (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No student group found with ID: " + group_id));
    return response.send(successResponse(results[0]));
  });
});


// Add a new student group
router.post("/add", (request, response) => {
  const { student_id, module_id } = request.body;
  const sql = `INSERT INTO ${STUDENTS_GROUP_TABLE} (student_id, module_id) VALUES (?, ?)`;
  pool.execute(sql, [student_id, module_id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    return response.send(successResponse({
      message: "Student group created successfully",
      groupId: result.insertId
    }));
  });
});

// Update a student group
router.put("/update/:group_id", (request, response) => {
  const { group_id } = request.params;
  const { student_id,module_id } = request.body;

  const sql = `UPDATE ${STUDENTS_GROUP_TABLE} 
               SET student_id = ?, module_id = ? 
               WHERE group_id = ?`;

  pool.execute(sql, [student_id, module_id, group_id], (error, result) => {
    if (error) return response.send(errorResponse(error));

    if (result.affectedRows === 0)
      return response.send(successResponse("No student group found with group ID: " + group_id));

    return response.send(successResponse("Student group updated successfully"));
  });
});




// delete a student group
router.delete("/delete/:group_id", (request, response) => {
  const { group_id } = request.params;
  const sql = `DELETE FROM ${STUDENTS_GROUP_TABLE} WHERE group_id = ?`;
  pool.execute(sql, [group_id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No student group found with ID: " + group_id));
    return response.send(successResponse("Student group deleted successfully"));
  });
});

module.exports = router;
