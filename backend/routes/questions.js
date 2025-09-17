const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { QUESTIONS_TABLE } = require("../config/index");

const { successResponse, errorResponse } = require("../utils/apiResponse");

//  Get all questions
router.get("/all-questions", (request, response) => {
  const sql = `SELECT * FROM ${QUESTIONS_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No questions found."));
    }

    return response.send(successResponse(results));
  });
});

//  Get by ID
router.get("/question/:id", (request, response) => {
  const { id } = request.params;
  const sql = `SELECT * FROM ${QUESTIONS_TABLE} WHERE question_id = ?`;

  pool.execute(sql, [id], (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(errorResponse("Question not found."));
    }

    return response.send(successResponse(results[0]));
  });
});

// Add new question
router.post("/add-question", (request, response) => {
  const { question_text, quiz_id } = request.body;

  if (!question_text || !quiz_id) {
    return response.send(errorResponse("Missing required fields"));
  }

  const createdTimestamp = new Date();
  const sql = `INSERT INTO ${QUESTIONS_TABLE} (question_text, quiz_id, createdTimestamp) VALUES (?, ?, ?)`;

  pool.execute(sql, [question_text, quiz_id, createdTimestamp], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    return response.send(successResponse({ insertId: result.insertId, message: "Question added successfully" }));
  });
});

// Update
router.put("/update-question/:id", (request, response) => {
  const { id } = request.params;
  const { question_text, quiz_id } = request.body;

  const sql = `UPDATE ${QUESTIONS_TABLE} SET question_text = ?, quiz_id = ? WHERE question_id = ?`;

  pool.execute(sql, [question_text, quiz_id, id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.send(errorResponse("No question found to update"));
    }

    return response.send(successResponse("Question updated successfully"));
  });
});

// Delete question
router.delete("/delete-question/:id", (request, response) => {
  const { id } = request.params;

  const sql = `DELETE FROM ${QUESTIONS_TABLE} WHERE question_id = ?`;

  pool.execute(sql, [id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.send(errorResponse("No question found to delete"));
    }

    return response.send(successResponse("Question deleted successfully"));
  });
});

module.exports = router;
