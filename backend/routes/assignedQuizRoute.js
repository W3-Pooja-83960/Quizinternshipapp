const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const {  STUDENTS_QUIZ_TABLE,QUIZ_TABLE, STUDENTS_ANS_TABLE,QUESTION_BANK_TABLE , MODULE_TABLE } = require("../config");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

// Apply authentication to all routes
router.use(checkAuthentication);



// Fetch Assigned Quiz
router.get("/assigned-quizzes/:group_name", (req, res) => {
  const group_name = req.params.group_name;
  const sql = `SELECT * FROM ${QUIZ_TABLE} WHERE group_name = ? AND is_active = 1`;

  pool.query(sql, [group_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Fetch Questions for a Quiz
router.get("/questions/:quiz_id",(req, res) => {
  const quiz_id = req.params.quiz_id;
  const sql = `
    SELECT question_id, question_text, option_a, option_b, option_c, option_d
    FROM ${QUESTION_BANK_TABLE}
    WHERE quiz_id = ?`;
  
  pool.query(sql, [quiz_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Start Attempt
router.post("/start-attempt",(req, res) => {
  const { student_id, quiz_id, group_name } = req.body;
  const sql = `INSERT INTO ${STUDENTS_QUIZ_TABLE} (student_id, quiz_id, group_name) VALUES (?, ?, ?)`;

  pool.query(sql, [student_id, quiz_id, group_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Attempt started", attempt_id: result.insertId });
  });
});

// Submit answers route
router.post("/submit-answers", checkAuthentication, async (req, res) => {
  const { attempt_id, answers, quiz_id } = req.body;
  const student_id = req.user.userId;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Answers array is required" });
  }

  try {
    // Verify this attempt belongs to logged-in student
    const [attemptRows] = await pool.promise().query(
      `SELECT * FROM ${STUDENTS_QUIZ_TABLE} WHERE attempt_id = ? AND student_id = ?`,
      [attempt_id, student_id]
    );

    if (attemptRows.length === 0) {
      return res.status(403).json({ error: "Unauthorized attempt" });
    }

    // Process all answers
    await Promise.all(
      answers.map(async (a) => {
        // Get correct answer for this question
        const [questionRows] = await pool.promise().query(
          `SELECT option_a, option_b, option_c, option_d, answer AS answer_key FROM ${QUESTION_BANK_TABLE} WHERE question_id = ?`,
          [a.question_id]
        );

        if (!questionRows[0]) throw new Error("Question not found");

        const key = questionRows[0].answer_key;
        const correctAnswerText = questionRows[0][key];

        const isCorrect = a.answer === key || a.answer === correctAnswerText ? 1 : 0;

        // Insert student answer
        await pool.promise().query(
          `INSERT INTO ${STUDENTS_ANS_TABLE} (attempt_id, questions_id, answer, is_correct)
           VALUES (?, ?, ?, ?)`,
          [attempt_id, a.question_id, a.answer, isCorrect]
        );
      })
    );

    // Update obtained score in STUDENTS_QUIZ_TABLE
    await pool.promise().query(
      `
      UPDATE ${STUDENTS_QUIZ_TABLE} sq
      JOIN (
        SELECT sa.attempt_id, SUM(q.marks) AS total_obtained
        FROM ${STUDENTS_ANS_TABLE} sa
        JOIN ${QUESTION_BANK_TABLE} q ON sa.questions_id = q.question_id
        WHERE sa.attempt_id = ? AND sa.is_correct = 1
        GROUP BY sa.attempt_id
      ) t ON sq.attempt_id = t.attempt_id
      SET sq.score = t.total_obtained
      WHERE sq.attempt_id = ?
      `,
      [attempt_id, attempt_id]
    );

    // Fetch obtained and total marks
    const [[scoreResult]] = await pool.promise().query(
      `SELECT score AS obtained_score FROM ${STUDENTS_QUIZ_TABLE} WHERE attempt_id = ?`,
      [attempt_id]
    );

    const [[totalResult]] = await pool.promise().query(
      `SELECT SUM(marks) AS total_score FROM ${QUESTION_BANK_TABLE} WHERE quiz_id = ?`,
      [quiz_id]
    );

    return res.json({
      message: "Answers submitted and score updated",
      obtained_score: scoreResult?.obtained_score || 0,
      total_score: totalResult?.total_score || 0,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || err });
  }
});
////////////////////////////////////////////////////////////////////////////////

// routes/resultRoutes.js 
router.get("/student-results", checkAuthentication, (req, res) => {
  const student_id = req.user.userId; 

  const sql = `
    SELECT 
      sq.attempt_id, 
      sq.score AS obtained_score, 
      sq.group_name, 
      q.quiz_id, 
      q.quiz_title,
      (SELECT SUM(marks) FROM ${QUESTION_BANK_TABLE} WHERE quiz_id = q.quiz_id) AS total_score
    FROM ${STUDENTS_QUIZ_TABLE} sq
    JOIN ${QUIZ_TABLE} q ON sq.quiz_id = q.quiz_id
    WHERE sq.student_id = ?
    ORDER BY sq.attempt_id DESC
  `;

  pool.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ status: "success", data: results });
  });
});





// Get most recent quiz score for logged-in student
router.get("/recent-score", checkAuthentication, (req, res) => {
  const student_id = req.user.userId;

  const sql = `
    SELECT 
      sq.attempt_id, 
      q.quiz_title, 
      sq.score AS obtained_score,
      (SELECT IFNULL(SUM(marks),0) FROM ${QUESTION_BANK_TABLE} WHERE quiz_id = q.quiz_id) AS total_score,
      sq.group_name
    FROM ${STUDENTS_QUIZ_TABLE} sq
    JOIN ${QUIZ_TABLE} q ON sq.quiz_id = q.quiz_id
    WHERE sq.student_id = ?
    ORDER BY sq.attempt_id DESC
    LIMIT 1
  `;

  pool.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.json({ message: "No quizzes attempted yet" });
    return res.json({ data: results[0] });
  });
});


module.exports = router;