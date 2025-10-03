const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const pool = require("../config/db");
const { STUDENTS_GROUP_TABLE } = require("../config");
const router = express.Router();
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

// Apply authentication to all routes
router.use(checkAuthentication);

// Get all student groups
router.get("/all", checkRoles(["admin", "coordinator"]),(request, response) => {
  const sql = `SELECT * FROM ${STUDENTS_GROUP_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No student groups found."));
    return response.send(successResponse(results));
  });
});


// Get a student group by ID
router.get("/:group_id",checkRoles(["admin", "coordinator"]), (request, response) => {
  const { group_id } = request.params;

  const sql = `SELECT * FROM ${STUDENTS_GROUP_TABLE} WHERE group_id = ?`;
  pool.execute(sql, [group_id], (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No student group found with ID: " + group_id));
    return response.send(successResponse(results[0]));
  });
});

// Add a new student group
router.post("/add-student-grp",checkRoles(["admin"]), (request, response) => {
  const { group_name, student_id, course_id } = request.body;

  const statement = `INSERT INTO ${STUDENTS_GROUP_TABLE}(group_name, student_id, course_id) VALUES (?, ?, ?)`;

  pool.execute(statement, [group_name, student_id, course_id], (error, result) => {
    console.log("error", error);
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return response.send(errorResponse("Group name already exists"));
      }

      return response.send(errorResponse(error));
    }

    return response.send(successResponse(result));
  });
});


// Update course for a student in a group
router.put("/update/:student_id", checkRoles(["admin"]),(req, res) => {
  const { course_id, group_name  } = req.body;
  const { student_id } = req.params;


  if (!student_id || !course_id || !group_name) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }

  const sql = `UPDATE ${STUDENTS_GROUP_TABLE} 
               SET course_id = ? ,group_name = ?
               WHERE  student_id = ?`;

  pool.query(sql, [course_id, group_name, student_id ], (err, result) => {
    if (err) return res.status(500).json({ status: "error", message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "Student in this group not found" });
    }

    res.json({ status: "success", message: " course id and group name updated successfully" });
  });
});



// delete a student group
router.delete("/delete/:group_name",checkRoles(["admin"]), (request, response) => {
  const { group_name } = request.params;

  const sql = `DELETE FROM ${STUDENTS_GROUP_TABLE} WHERE group_name = ?`;
  pool.execute(sql, [group_name], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No student group found with name: " + group_name));
    return response.send(successResponse("Student group deleted successfully"));
  });
});

module.exports = router;
