const express = require("express");
const router = express.Router();
const pool = require("../config/db"); 
const {MODULE_TABLE, STAFF_TABLE, QUIZ_TABLE, COURSE_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

// Apply authentication to all routes
router.use(checkAuthentication);

console.log("Quiz routes loaded");

// ✅ Get all quizzes
router.get("/all-quiz",checkRoles(["admin", "coordinator", "mentor"]), (request, response) => {
  console.log("Fetching all quizzes...");
  const sql = ` SELECT q.*, 
                      m.module_name,  
                      c.course_name,              
                      s.firstName AS staff_firstName,
                      s.lastName AS staff_lastName
                FROM ${QUIZ_TABLE} q
                LEFT JOIN ${COURSE_TABLE} c ON q.course_id = c.course_id
                LEFT JOIN ${MODULE_TABLE} m ON q.module_id = m.module_id
                LEFT JOIN ${STAFF_TABLE} s ON q.staff_id = s.staff_id
                WHERE q.is_active = 1 `;
         

  pool.query(sql, (error, results) => {
    console.log("Error:", error);
    console.log("Results:", results);

    if (error) {
      return response.send(errorResponse(error));
    }
    if (results.length === 0) return response.send(successResponse([]));
       return response.send(successResponse(results));
     });
});

   
 


// ✅ Get quiz by ID
router.get("/:quiz_id",checkRoles(["admin"]), (request, response) => {
  const { quiz_id } = request.params;
  const sql = ` SELECT q.*, m.module_name, s.firstName AS staff_firstName, s.lastName AS staff_lastName
                      FROM ${QUIZ_TABLE} q
                      JOIN ${MODULE_TABLE} m ON q.module_id = m.module_id
                      JOIN ${STAFF_TABLE} s ON q.staff_id = s.staff_id
                      WHERE q.quiz_id = ? AND q.is_active = 1  `;

  pool.query(sql, [quiz_id], (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("Quiz not found."));
    }

    return response.send(successResponse(results[0]));
  });
});

//  Add new quiz
router.post("/add-quiz",checkRoles(["admin","coordinator"]), (request, response) => {
  const { quiz_title, duration, marks, module_id, staff_id ,is_active,course_id, group_name} = request.body;

  // Default to 1 (active) if not provided in request
  const quizStatus = (is_active !== undefined) ? is_active : 1;

  const sql = `
    INSERT INTO ${QUIZ_TABLE} (quiz_title, duration, marks, module_id, staff_id, is_active,course_id, group_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)  `;

  console.log("Incoming body:", request.body);
  console.log("Running DB query...");

  pool.query(sql, [quiz_title, duration, marks, module_id, staff_id, quizStatus, course_id, group_name], (error, result) => {
    console.log("DB query callback fired");

    if (error) {
      console.error("DB error:", error);
      return response.status(500).send(errorResponse(error));
    }

    console.log("Quiz inserted successfully");
    return response.send(successResponse("Quiz added successfully."));
  });
});


// Update quiz
router.put("/update-quiz/:quiz_id",checkRoles(["admin"]), (request, response) => {
  const { quiz_id } = request.params;
  const { quiz_title, duration, marks, module_id, staff_id ,is_active,course_id, group_name} = request.body;

  if (!quiz_title) {
    return response.status(400).json(errorResponse("Quiz title is required."));
  }
   // Default: keep active status if not provided
  const quizStatus = (is_active !== undefined) ? is_active : 1;

  const sql = `
    UPDATE ${QUIZ_TABLE}
    SET quiz_title = ?, duration = ?, marks = ?, module_id = ?, staff_id = ?,is_active = ?,course_id=? , group_name=?
    WHERE quiz_id = ?   `;

  pool.query(sql, [quiz_title, duration, marks, module_id, staff_id,quizStatus, course_id, group_name, quiz_id], (error, result) => {
    if (error) {
      return response.status(500).json(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.status(404).json(successResponse("Quiz not found."));
    }

    return response.json(successResponse("Quiz updated successfully."));
  });
});

// ✅ Delete (soft delete) quiz
router.delete("/delete-quiz/:quiz_id",checkRoles(["admin"]), (request, response) => {
  const { quiz_id } = request.params;
  const sql = `UPDATE quiz SET is_active = 0 WHERE quiz_id = ?`;

  pool.query(sql, [quiz_id], (error, result) => {
    if (error) {
      return response.status(500).json(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.status(404).json(successResponse("Quiz not found."));
    }

    return response.json(successResponse("Quiz deleted successfully."));
  });
});

module.exports = router;
