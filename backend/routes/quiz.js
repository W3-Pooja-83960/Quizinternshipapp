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

// Delete (soft delete) quiz
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



//send quiz to grp only if it contains questions
// Use promise wrapper
const promisePool = pool.promise();

//send quiz to grp only if it contains questions
router.post("/send-quiz-to-group", checkRoles(["admin", "coordinator"]), async (req, res) => {
  try {
    const { quiz_id, group_name } = req.body;

    if (!quiz_id || !group_name) {
      return res.status(400).json({ status: "error", message: "Quiz ID and Group Name are required" });
    }

    // Check if quiz has questions
    const [quizCheck] = await promisePool.query(
      "SELECT COUNT(*) AS count FROM question_bank WHERE quiz_id = ?",
      [quiz_id]
    );

    if (!quizCheck || quizCheck[0].count === 0) {
      return res.status(400).json({ status: "error", message: "Cannot assign quiz without questions" });
    }

    // Check if already assigned
    const [existingAssignment] = await promisePool.query(
      "SELECT * FROM assigned_quiz WHERE quiz_id = ? AND group_name = ?",
      [quiz_id, group_name]
    );

    if (existingAssignment.length > 0) {
      return res.status(400).json({ status: "error", message: "Quiz already assigned to this group" });
    }

    // Assign quiz
    await promisePool.query(
      "INSERT INTO assigned_quiz (quiz_id, group_name) VALUES (?, ?)",
      [quiz_id, group_name]
    );

    res.json({ status: "success", message: "Quiz successfully assigned to the group" });

  } catch (err) {
    console.error("Error assigning quiz to group:", err);
    res.status(500).json({ status: "error", message: "Server error while assigning quiz" });
  }
});



// Get question count for all quizzes
router.get("/question-counts", checkRoles(["admin", "coordinator"]), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT quiz_id, COUNT(*) AS count
      FROM question_bank
      GROUP BY quiz_id
    `);

    // Return as object mapping quiz_id -> count
    const counts = {};
    rows.forEach(r => { counts[r.quiz_id] = r.count; });
    
    res.json({ status: "success", data: counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


//react-native app 
// GET /quiz/assigned-quizzes/:group_name
router.get("/assigned-quizzes/:group_name", checkAuthentication, async (req, res) => {
  const { group_name } = req.params;
  try {
    const [rows] = await pool
      .promise()
      .query(
        `SELECT q.* 
         FROM quiz q
         JOIN assigned_quiz a ON q.quiz_id = a.quiz_id
         WHERE a.group_name = ? AND q.is_active = 1`,
        [group_name]
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});





module.exports = router;
