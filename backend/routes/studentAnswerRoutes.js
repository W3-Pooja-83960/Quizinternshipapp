const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { STUDENTS_ANS_TABLE } = require("../config");
const {STUDENTS_QUIZ_TABLE} = require("../config");
const { QUESTIONS_TABLE } = require("../config");
const { STUDENTS_TABLE } = require("../config");



// GET /stud-answers/:quiz_id/:student_id
router.get("/stud-answers/:quiz_id/:student_id", (req, res) => {
    const { quiz_id, student_id } = req.params;

    const sql = ` SELECT s.student_id, s.firstName,s.lastName,s.prnNo,s.course_id,
                         q.question_id,q.question_text,q.quiz_id,
                         sq.attempt_id,
                         sa.studentAnswer_id,sa.questions_id,sa.is_correct
                  FROM ${STUDENTS_ANS_TABLE} sa
                  JOIN ${STUDENTS_QUIZ_TABLE} sq ON sq.attempt_id = sa.attempt_id
                  JOIN ${STUDENTS_TABLE}s ON s.student_id = sq.student_id
                  JOIN ${QUESTIONS_TABLE} q ON q.question_id = sa.questions_id
                  WHERE sq.quiz_id = ?`;

    pool.query(sql, [quiz_id, student_id], (err, answers) => {
        if (err) return res.status(500).json({ status: "error", error: err.message });

        res.json({ status: "success", data: answers });
    });
});


//post /submit-answer
router.post("/stud-ans/add-single-ans", (req, res) => {
  const { attempt_id, questions_id, is_correct } = req.body;

  if (attempt_id === undefined || questions_id === undefined || is_correct === undefined) {
   return res.json({ error: "Missing required fields" });
}
  
  const sql = `INSERT INTO ${ STUDENTS_ANS_TABLE } (attempt_id, questions_id, is_correct) 
               VALUES (?, ?, ?)`;

  pool.query(sql, [attempt_id, questions_id,  is_correct], (err, result) => {
   if (err) {
  console.error("❌ SQL Error:", err); // logs full error in terminal
  return res.status(500).json({
                                  status: "error",
                                  message: "Database error occurred",
                                  error: {
                                    code: err.code,
                                    errno: err.errno,
                                    sqlState: err.sqlState,
                                    sqlMessage: err.sqlMessage,
                                    sql: err.sql
                                  }
                               });
}
    res.status(201).json({
      success: true,
      studentAnswer_id: result.insertId,
    });
  });
});


//post
router.post("/add-multiple-ans", (req, res) => {
  const { answers } = req.body;

  // Validation
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Answers array is required" });
  }

  // Convert objects to array of arrays for MySQL
  const values = answers.map(a => [a.attempt_id, a.questions_id, a.is_correct]);

  // Single query for all answers
  const statement = `
    INSERT INTO studentAnswer (attempt_id, questions_id, is_correct)
    VALUES ?
    ON DUPLICATE KEY UPDATE is_correct = VALUES(is_correct)
  `;

  pool.query(statement, [values], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ status: "success", message: "All answers saved/updated" });
  });
});


//put method
router.put("/update/:studentAnswer_id", (req, res) => {
  const { attempt_id, questions_id, is_correct } = req.body;

  // validation 
  if ( attempt_id === undefined || questions_id === undefined || is_correct === undefined ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const statement = `UPDATE ${ STUDENTS_ANS_TABLE } SET is_correct = ? WHERE attempt_id = ? AND questions_id = ? `;

  pool.execute( statement,[is_correct, attempt_id, questions_id],(error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Answer not found" });
      }

      return res.json({ status: "success", message: "Answer updated" });
    }
  );
});

module.exports = router;