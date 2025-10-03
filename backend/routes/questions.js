
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { QUESTIONS_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

// Apply authentication to all routes
router.use(checkAuthentication);

//  Get all questions
router.get("/all-questions", checkRoles(["admin", "coordinator"]), (request, response) => {
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
router.get("/question/:id", checkRoles(["admin", "coordinator"]),(request, response) => {
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

//  Get by module id
router.get("/module/:module_id", checkRoles(["admin", "coordinator"]),(request, response) => {
  const { module_id } = request.params;
  const sql = `SELECT question_id, question_text FROM ${QUESTIONS_TABLE} WHERE module_id = ?`;

  pool.execute(sql, [module_id], (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(errorResponse("Question not found."));
    }

    return response.send(successResponse(results));
  });
});

// Add new question
router.post("/add-question", checkRoles(["admin"]),(req, res) => {
  const { question_text, quiz_id, module_id } = req.body;

  if (!question_text || !quiz_id) {
    return res.send({ status: "error", message: "Missing required fields" });
  }

  const values = [quiz_id, question_text, module_id || null];
  const sql = `INSERT INTO ${QUESTIONS_TABLE} (quiz_id, question_text, module_id) VALUES (?, ?, ?)`;

  pool.query(sql, values, (err, result) => {
    if (err) return res.send({ status: "error", message: err });

    res.send({ status: "success", insertId: result.insertId, message: "Question added successfully" });
  });
});


//add multiple questions
router.post("/add-questions",checkRoles(["admin"]), (req, res) => {
    console.log("Body received:", req.body); 
  const { questions } = req.body;

  if (!questions || !questions.length) {
    return res.send({ status: "error", message: "Questions are required" });
  }

  //multiple insert
  const values = questions.map(q => [ q.quiz_id, q.question_text, q.module_id || null]);

  const sql = `INSERT INTO ${QUESTIONS_TABLE} (quiz_id, question_text, module_id) VALUES ?`;

  pool.query(sql, [values], (err, result) => {
    if (err) return res.send({ status: "error", message: err });

    res.send({ status: "success", inserted: result.affectedRows });
  });
});


// Update a question
router.put("/update-question/:question_id", checkRoles(["admin"]),(req, res) => {
  const { question_id } = req.params;
  const { question_text, quiz_id, module_id } = req.body;

  if (!question_text || !quiz_id) {
    return res.send({ status: "error", message: "question_text and quiz_id are required" });
  }

  const sql = `UPDATE ${QUESTIONS_TABLE} 
               SET question_text = ?, quiz_id = ?, module_id = ? 
               WHERE question_id = ?`;

  pool.query(sql, [question_text, quiz_id, module_id || null, question_id], (err, result) => {
    if (err) return res.send({ status: "error", message: err });

    if (result.affectedRows === 0) {
      return res.send({ status: "error", message: "No question found to update" });
    }

    res.send({ status: "success", message: "Question updated successfully" });
  });
});


// Delete question
router.delete("/delete-question/:id", checkRoles(["admin"]),(request, response) => {
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


