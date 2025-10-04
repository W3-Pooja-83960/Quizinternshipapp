const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { STUDENTS_ANS_TABLE } = require("../config");
const {STUDENTS_QUIZ_TABLE} = require("../config");
const { QUESTIONS_TABLE } = require("../config");
const { STUDENTS_TABLE } = require("../config");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

// Apply authentication to all routes
router.use(checkAuthentication);

// GET
router.get("/stud-answers/:quiz_id/:student_id",checkRoles(["admin", "coordinator"]), (req, res) => {
    const { quiz_id, student_id } = req.params;

    const sql = ` SELECT s.student_id, s.firstName,s.lastName,s.prnNo,s.course_id,
                         q.question_id,q.question_text,q.quiz_id,
                         sq.attempt_id,
                         sa.studentAnswer_id,sa.questions_id,sa.is_correct
                  FROM ${STUDENTS_ANS_TABLE} sa
                  JOIN ${STUDENTS_QUIZ_TABLE} sq ON sq.attempt_id = sa.attempt_id
                  JOIN ${STUDENTS_TABLE} s ON s.student_id = sq.student_id
                  JOIN ${QUESTIONS_TABLE} q ON q.question_id = sa.questions_id
                  WHERE sq.quiz_id = ?`;

    pool.query(sql, [quiz_id, student_id], (err, answers) => {
        if (err) return res.status(500).json({ status: "error", error: err.message });

        res.json({ status: "success", data: answers });
    });
});


//post-to add single answer
router.post("/stud-ans/add-single-ans",checkRoles(["admin"]), (req, res) => {
  const { attempt_id, questions_id, is_correct } = req.body;

  if (attempt_id === undefined || questions_id === undefined || is_correct === undefined) {
    return res.json({ status: "error", message: "Missing required fields" });
  }

  const insertSql = `INSERT INTO ${STUDENTS_ANS_TABLE} (attempt_id, questions_id, is_correct) VALUES (?, ?, ?)`;

  pool.query(insertSql, [attempt_id, questions_id, is_correct], (err, result) => {
    if (err) return res.status(500).json({ status: "error", message: err.sqlMessage });

    // Recalculate total score
    const recalcSql = `SELECT SUM(is_correct) AS total_score FROM ${STUDENTS_ANS_TABLE} WHERE attempt_id = ?`;
    pool.query(recalcSql, [attempt_id], (err2, scoreResult) => {
      if (err2) return res.status(500).json({ status: "error", message: err2.sqlMessage });

      const newScore = scoreResult[0].total_score || 0;

      const updateQuizSql = `UPDATE ${STUDENTS_QUIZ_TABLE} SET score = ? WHERE attempt_id = ?`;
      pool.query(updateQuizSql, [newScore, attempt_id], (err3) => {
        if (err3) return res.status(500).json({ status: "error", message: err3.sqlMessage });

        return res.status(201).json({
          status: "success",
          message: "Answer added and score updated",
          attempt_id,
          studentAnswer_id: result.insertId,
          newScore
        });
      });
    });
  });
});


//POST-to add multiple answers and update score
router.post("/add-multiple-ans",checkRoles(["admin"]), (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ status: "error", message: "Answers array is required" });
  }

  const values = answers.map(a => [a.attempt_id, a.questions_id, a.is_correct]);

  const insertSql = `
    INSERT INTO ${STUDENTS_ANS_TABLE} (attempt_id, questions_id, is_correct)
    VALUES ?
    ON DUPLICATE KEY UPDATE is_correct = VALUES(is_correct)   `;

  pool.query(insertSql, [values], (err) => {
    if (err) return res.status(500).json({ status: "error", message: err.sqlMessage });

    // Recalculate score 
    const attempt_id = answers[0].attempt_id;
    const recalcSql = `SELECT SUM(is_correct) AS total_score FROM ${STUDENTS_ANS_TABLE} WHERE attempt_id = ?`;
    
    pool.query(recalcSql, [attempt_id], (err2, scoreResult) => {
      if (err2) return res.status(500).json({ status: "error", message: err2.sqlMessage });

      const newScore = scoreResult[0].total_score || 0;

      const updateQuizSql = `UPDATE ${STUDENTS_QUIZ_TABLE} SET score = ? WHERE attempt_id = ?`;
      pool.query(updateQuizSql, [newScore, attempt_id], (err3) => {
        if (err3) return res.status(500).json({ status: "error", message: err3.sqlMessage });

        return res.json({ status: "success", message: "Answers saved and score updated", newScore });
      });
    });
  });
});

//PUT- update existing answer and synchronize the score
router.put("/update/:studentAnswer_id", checkRoles(["admin"]),(req, res) => {
  const { attempt_id, questions_id, is_correct } = req.body;
const { studentAnswer_id } = req.params;

const updateAnswerSql = `UPDATE ${STUDENTS_ANS_TABLE}
                         SET is_correct = ?
                         WHERE studentAnswer_id = ?`;

pool.query(updateAnswerSql, [is_correct, studentAnswer_id], (err, result) => {
  if (err) return res.status(500).json({ error: err.message });
  if (result.affectedRows === 0) return res.status(404).json({ message: "Answer not found" });

  // Recalculate total score 
  const recalcScoreSql = `SELECT SUM(is_correct) AS total_score FROM ${STUDENTS_ANS_TABLE} WHERE attempt_id = ?`;
  pool.query(recalcScoreSql, [attempt_id], (err2, scoreResult) => {
    if (err2) return res.status(500).json({ error: err2.message });

    const newScore = scoreResult[0].total_score || 0;

    const updateQuizSql = `UPDATE ${STUDENTS_QUIZ_TABLE} SET score = ? WHERE attempt_id = ?`;
    pool.query(updateQuizSql, [newScore, attempt_id], (err3) => {
      if (err3) return res.status(500).json({ error: err3.message });

      return res.json({
        status: "success",
        message: "Answer updated and score synchronized",
        attempt_id,
        newScore
      });
    });
  });
});
});


module.exports = router;