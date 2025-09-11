const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // pool is exported directly
const { QUIZ_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");

console.log("Quiz routes loaded");

//  Get all active quizzes
router.get("/", (req, res) => {
  const sql = `SELECT * FROM ${QUIZ_TABLE} WHERE is_active = 1`;
  
  pool.query(sql, (error, results) => {
    if (error) return res.status(500).send(errorResponse(error));
    if (results.length === 0) return res.send(successResponse("No active quiz found."));
    return res.send(successResponse(results));
  });
});


// Get quiz by ID
router.get("/:quiz_id", (request, response) => {
  const { quiz_id } = request.params;
  const sql = `SELECT * FROM ${QUIZ_TABLE} WHERE quiz_id = ?`;

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
router.post("/add-quiz", (request, response) => {
  const { quiz_title, duration, marks, module_id, staff_id } = request.body;
  const sql = `
    INSERT INTO ${QUIZ_TABLE} (quiz_title, duration, marks, module_id, staff_id, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `;

  console.log("Incoming body:", request.body);
  console.log("Running DB query...");

  pool.query(sql, [quiz_title, duration, marks, module_id, staff_id], (error, result) => {
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
router.put("/update-quiz/:quiz_id", (request, response) => {
  const { quiz_id } = request.params;
  const { quiz_title, duration, marks, module_id, staff_id } = request.body;

  if (!quiz_title) {
    return response.status(400).json(errorResponse("Quiz title is required."));
  }

  const sql = `
    UPDATE ${QUIZ_TABLE}
    SET quiz_title = ?, duration = ?, marks = ?, module_id = ?, staff_id = ?
    WHERE quiz_id = ? AND is_active = 1
  `;

  pool.query(sql, [quiz_title, duration, marks, module_id, staff_id, quiz_id], (error, result) => {
    if (error) {
      return response.status(500).json(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.status(404).json(successResponse("Quiz not found."));
    }

    return response.json(successResponse("Quiz updated successfully."));
  });
});
 
//  Delete (soft delete) quiz
router.delete("/delete-quiz/:quiz_id", (request, response) => {
  const { quiz_id } = request.params;
  const sql = `UPDATE ${QUIZ_TABLE} SET is_active = 0 WHERE quiz_id = ?`;
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
