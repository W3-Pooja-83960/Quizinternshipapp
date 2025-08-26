const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // pool is exported directly
const { successResponse, errorResponse } = require("../utils/apiResponse");

console.log("Quiz routes loaded");

// ✅ Get all quizzes
router.get("/all-quiz", (request, response) => {
  console.log("Fetching all quizzes...");
  const sql = `
    SELECT q.*, m.module_name, s.firstName AS staff_firstName, s.lastName AS staff_lastName
    FROM quiz q
    JOIN Module m ON q.module_id = m.module_id
    JOIN Staff s ON q.staff_id = s.staff_id
    WHERE q.is_active = 1
  `;

  pool.query(sql, (error, results) => {
    console.log("Error:", error);
    console.log("Results:", results);

    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No quiz found."));
    }

    return response.send(successResponse(results));
  });
});

// ✅ Get quiz by ID
router.get("/:quiz_id", (request, response) => {
  const { quiz_id } = request.params;
  const sql = `
    SELECT q.*, m.module_name, s.firstName AS staff_firstName, s.lastName AS staff_lastName
    FROM quiz q
    JOIN Module m ON q.module_id = m.module_id
    JOIN Staff s ON q.staff_id = s.staff_id
    WHERE q.quiz_id = ? AND q.is_active = 1
  `;

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

// ✅ Add quiz
router.post("/add-quiz", (request, response) => {
  const { quiz_title, duration, marks, module_id, staff_id } = request.body;
  const sql = `
    INSERT INTO quiz (quiz_title, duration, marks, module_id, staff_id, is_active)
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

// ✅ Update quiz
router.put("/update-quiz/:quiz_id", (request, response) => {
  const { quiz_id } = request.params;
  const { quiz_title, duration, marks, module_id, staff_id } = request.body;

  if (!quiz_title) {
    return response.status(400).json(errorResponse("Quiz title is required."));
  }

  const sql = `
    UPDATE quiz
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

// ✅ Delete (soft delete) quiz
router.delete("/delete-quiz/:quiz_id", (request, response) => {
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
