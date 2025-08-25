const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { STUDENTS_QUIZ_TABLE } = require("../config");
const { QUIZ_TABLE } = require("../config");
const { STUDENTS_ANS_TABLE } = require("../config");
const { MODULE_TABLE } = require("../config");
const { QUESTIONS_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");


// ✅ Get all quiz attempts of a student with details
router.get("/all-quiz/:student_id", (req, res) => {
  const { student_id } = req.params;

  console.log(`Fetching all quiz attempts for student_id= ${student_id}`);

 const sql = `SELECT  sq.quiz_id, q.quiz_title, m.module_name,
              COUNT(sa.questions_id) AS total_attempted,
              SUM(sa.is_correct) AS correct_answers,
              SUM(sq.score) AS total_score
              FROM ${STUDENTS_QUIZ_TABLE} sq
              JOIN ${QUIZ_TABLE} q ON sq.quiz_id = q.quiz_id
              JOIN ${MODULE_TABLE} m ON q.module_id = m.module_id
              LEFT JOIN ${STUDENTS_ANS_TABLE} sa ON sq.attempt_id = sa.attempt_id
              WHERE sq.student_id = ?
              GROUP BY sq.quiz_id, q.quiz_title, m.module_name `;

  console.log("Running DB query for student quiz attempts...")
pool.query(sql, [student_id], (error, results) => {
    if (error) {
      return res.send(errorResponse(error));
    }

    if (results.length === 0) {
      return res.send(successResponse("No quiz data found for this student."));
    }

     if (results.length === 0) return res.send(errorResponse("Student not found"));

    return res.send(successResponse(results));
  });
});


// ✅ Get a specific quiz attempt of a student
router.get("/student-quiz/:student_id/:attempt_id", (req, res) => {
  const { student_id, attempt_id } = req.params;
  console.log(`Fetching attempt_id=${attempt_id} for student_id=${student_id}`);

  const sql = ` SELECT sq.attempt_id, q.quiz_id, q.quiz_title, m.module_name,
                        sa.questions_id, sa.is_correct, sq.score
                FROM ${STUDENTS_QUIZ_TABLE} sq
                JOIN ${QUIZ_TABLE} q ON sq.quiz_id = q.quiz_id
                JOIN ${MODULE_TABLE} m ON q.module_id = m.module_id
                LEFT JOIN ${STUDENTS_ANS_TABLE} sa ON sq.attempt_id = sa.attempt_id
                WHERE sq.student_id = ? AND sq.attempt_id = ?  `;

  pool.query(sql, [student_id, attempt_id], (error, results) => {
    if (error) {
      return res.send(errorResponse(error));
    }

    if (results.length === 0) {
      return res.send(successResponse("No data found for this attempt."));
    }

    return res.send(successResponse(results));
  });
});




// ✅ Get question attempts for a specific quiz
router.get("/:student_id/quiz/:quiz_id/questions", (req, res) => {
  const { student_id, quiz_id } = req.params;
  console.log(`Fetching question attempts for student_id=${student_id}, quiz_id=${quiz_id}`);

  const sql = ` SELECT q.question_id, q.question_text,
                       sa.is_correct,
                       sq.score
                FROM ${STUDENTS_QUIZ_TABLE} sq
                JOIN ${STUDENTS_ANS_TABLE} sa ON sq.attempt_id = sa.attempt_id
                JOIN ${QUESTIONS_TABLE} q ON sa.questions_id = q.question_id
                         WHERE sq.student_id = ? AND sq.quiz_id = ? `;

  pool.query(sql, [student_id, quiz_id], (error, results) => {
    if (error) return res.send(errorResponse(error));

    if (results.length === 0) {
      return res.send(successResponse("No question attempts found for this quiz."));
    }

    return res.send(successResponse(results));
  });
});


// ✅ Add a new quiz attempt with answers
router.post("/add-quiz-attempt", (req, res) => {
  const { student_id, quiz_id, score, answers } = req.body;

  // 1. Validate input
  if (!student_id || !quiz_id || score === undefined || !answers || !answers.length) {
    return res.send({ status: "error", message: "All fields required including answers" });
  }

  // 2. Insert into StudentQuiz  
  const insertQuizSql = `INSERT INTO ${STUDENTS_QUIZ_TABLE}  (student_id, quiz_id, score) VALUES (?, ?, ?)`;
  pool.query(insertQuizSql, [student_id, quiz_id, score], (err, result) => {
    if (err) return res.send({ status: "error", message: err.sqlMessage });

    const attempt_id = result.insertId; // Get the new attempt_id

    // 3. Prepare answers for insertion
    const answerData = answers.map(a => [attempt_id, a.question_id, a.is_correct]);

    // 4. Insert all answers into STUDENTS_ANS_TABLE
    const insertAnswerSql = `INSERT INTO ${STUDENTS_ANS_TABLE} (attempt_id, questions_id, is_correct) VALUES ?`;
    pool.query(insertAnswerSql, [answerData], (err2) => {
      if (err2) return res.send({ status: "error", message: err2.sqlMessage });

      // 5. Send success response
      res.send({ status: "success", message: `Quiz attempt added with id=${attempt_id}` });
    });
  });
});


// ✅ PUT - Update student's answer for a question and update total score
router.put("/update-answer", (req, res) => {
  const { attempt_id, question_id, is_correct } = req.body;

  if (!attempt_id || !question_id || is_correct === undefined) {
    return res.send({ status: "error", message: "All fields are required" });
  }

  // 1. Update the answer in STUDENTS_ANS_TABLE
  const updateAnswerSql = ` UPDATE ${STUDENTS_ANS_TABLE} SET is_correct = ? 
                             WHERE attempt_id = ? AND questions_id = ?  `;

  pool.query(updateAnswerSql, [is_correct, attempt_id, question_id], (err) => {
    if (err) return res.send({ status: "error", message: err.sqlMessage });

    // 2. Recalculate total correct answers for this attempt
    const recalcScoreSql = ` SELECT SUM(is_correct) AS total_score
                              FROM ${ STUDENTS_ANS_TABLE } WHERE attempt_id = ? `;

    pool.query(recalcScoreSql, [attempt_id], (err2, result) => {
      if (err2) return res.send({ status: "error", message: err2.sqlMessage });

      const newScore = result[0].total_score || 0;

      // 3. Update STUDENTS_QUIZ_TABLE with new total score
      const updateQuizScoreSql = ` UPDATE ${ STUDENTS_QUIZ_TABLE } SET score = ?  WHERE attempt_id = ? `;

      pool.query(updateQuizScoreSql, [newScore, attempt_id], (err3) => {
        if (err3) return res.send({ status: "error", message: err3.sqlMessage });

        return res.send({
          status: "success",
          message: "Answer updated and score synchronized",
          attempt_id,
          newScore
        });
      });
    });
  });
});


// ✅ DELETE - Remove a quiz attempt
router.delete("/delete/:attempt_id/", (req, res) => {
  const { attempt_id } = req.params;

  if (!attempt_id) return res.send({ status: "error", message: "attempt_id required" });

  // 1. Delete from STUDENTS_ANS_TABLE first
  const deleteAnswersSql = `DELETE FROM ${STUDENTS_ANS_TABLE} WHERE attempt_id = ? `;

  pool.query(deleteAnswersSql, [attempt_id], (err) => {
    if (err) return res.send({ status: "error", message: err.sqlMessage });

    // 2. Delete from STUDENTS_QUIZ_TABLE
    const deleteQuizSql = `DELETE FROM ${ STUDENTS_QUIZ_TABLE } WHERE attempt_id = ?`
    pool.query(deleteQuizSql, [attempt_id], (err2) => {
      if (err2) return res.send({ status: "error", message: err2.sqlMessage });

      res.send({ status: "success", message: `Attempt ${attempt_id} deleted successfully` });
    });
  });
});


 module.exports = router;
