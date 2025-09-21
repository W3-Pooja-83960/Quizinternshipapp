const express = require("express"); 
const router = express.Router(); 
const pool = require("../config/db"); 
const { STUDENTS_QUIZ_TABLE } = require("../config"); 
const { QUIZ_TABLE } = require("../config"); 
const { STUDENTS_ANS_TABLE } = require("../config"); 
const { MODULE_TABLE } = require("../config"); 
const { QUESTIONS_TABLE } = require("../config"); 
const { STUDENTS_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");


// Apply authentication to all routes
router.use(checkAuthentication);

// GET - all quiz attempts of a student
router.get("/all-quiz/:student_id", checkRoles(["admin", "coordinator"]), (req, res) => {
  const { student_id } = req.params; 

  const sql = `
                  SELECT st.firstName, st.lastName, st.email, st.prnNo,
                        sq.quiz_id, q.quiz_title, m.module_name,
                        COUNT(sa.questions_id) AS total_attempted,
                        SUM(sa.is_correct) AS correct_answers,
                        SUM(sq.score) AS total_score
                  FROM ${STUDENTS_QUIZ_TABLE} sq
                  JOIN ${STUDENTS_TABLE} st ON sq.student_id = st.student_id
                  JOIN ${QUIZ_TABLE} q ON sq.quiz_id = q.quiz_id
                  JOIN ${MODULE_TABLE} m ON q.module_id = m.module_id
                  LEFT JOIN ${STUDENTS_ANS_TABLE} sa ON sq.attempt_id = sa.attempt_id
                  WHERE sq.student_id = ?
                  GROUP BY sq.quiz_id, q.quiz_title, m.module_name, st.firstName, st.lastName, st.email, st.prnNo  `;

  pool.query(sql, [student_id], (error, results) => {
    if (error) return res.send(errorResponse(error));

    if (results.length === 0) {
      return res.send(successResponse("No quiz attempts found for this student."));
    }

    return res.send(successResponse(results));
  });
});




// GET - specific quiz attempt of a student
router.get("/stud-quiz/:student_id/:attempt_id", checkRoles(["admin", "coordinator"]),(req, res) => {
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




// GET-question attempts for a specific quiz
router.get("/:student_id/quiz/:quiz_id/questions",checkRoles(["admin", "coordinator"]), (req, res) => {
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





// POST - Add new quiz attempt with answers and group_id
router.post("/add-quiz-attempt", checkRoles(["admin", "coordinator"]),(req, res) => {
  const { student_id, quiz_id, group_id, answers } = req.body;

  // Validate input
  if (!student_id || !quiz_id || !group_id || !answers || !answers.length) {
    return res.send({ status: "error", message: "All fields required including answers and group_id" });
  }

  // Calculate score from answers
  const score = answers.filter(a => a.is_correct === 1).length;

  // Insert 
  const insertQuizSql = `INSERT INTO ${STUDENTS_QUIZ_TABLE} (student_id, quiz_id, group_id, score) VALUES (?, ?, ?, ?)`;

  pool.query(insertQuizSql, [student_id, quiz_id, group_id, score], (err, result) => {
    if (err) return res.send({ status: "error", message: err.sqlMessage || err });

    // Get the generated attempt_id
    const attempt_id = result.insertId || null;

    if (!attempt_id) {
   
      console.warn("Warning: insertId is 0. Your table might not have AUTO_INCREMENT primary key.");
    }

    // Prepare answers for insertion
    const answerData = answers.map(a => [attempt_id, a.question_id, a.is_correct]);

    const insertAnswerSql = `INSERT INTO ${STUDENTS_ANS_TABLE} (attempt_id, questions_id, is_correct) VALUES ?`;

    pool.query(insertAnswerSql, [answerData], (err2) => {
      if (err2) return res.send({ status: "error", message: err2.sqlMessage || err2 });

      return res.send({
        status: "success",
        message: `Quiz attempt added${attempt_id ? ` with id=${attempt_id}` : ""}`,
        attempt_id,
        score
      });
    });
  });
});


// PUT - update quiz attempt answers
router.put("/update-answer/:attempt_id", checkRoles(["admin", "coordinator"]), (req, res) => {
  const attempt_id = req.params.attempt_id;
  const { student_id, quiz_id, group_id, answers } = req.body;

  // Validate i/p
  if (!attempt_id || !student_id || !quiz_id || !group_id || !answers || !answers.length) {
    return res.send({ status: "error", message: "All fields required including answers, student_id, quiz_id, group_id" });
  }

  // Loop through answers and update them one by one
  let completed = 0;
  for (let i = 0; i < answers.length; i++) {
    const { question_id, is_correct } = answers[i];
    const updateAnswerSql = `UPDATE ${STUDENTS_ANS_TABLE} SET is_correct = ? 
                             WHERE attempt_id = ? AND questions_id = ?`;

    pool.query(updateAnswerSql, [is_correct, attempt_id, question_id], (err) => {
      if (err) return res.send({ status: "error", message: err.sqlMessage });

      completed++;

      // When all answers are updated, recalc score
      if (completed === answers.length) {
        const recalcScoreSql = `SELECT SUM(is_correct) AS total_score
                                 FROM ${STUDENTS_ANS_TABLE} WHERE attempt_id = ?`;

        pool.query(recalcScoreSql, [attempt_id], (err2, result) => {
          if (err2) return res.send({ status: "error", message: err2.sqlMessage });

          const newScore = result[0].total_score || 0;

          // Update quiz table with new score and other fields
          const updateQuizSql = `UPDATE ${STUDENTS_QUIZ_TABLE} 
                                 SET score = ?, student_id = ?, quiz_id = ?, group_id = ?
                                 WHERE attempt_id = ?`;

          pool.query(updateQuizSql, [newScore, student_id, quiz_id, group_id, attempt_id], (err3) => {
            if (err3) return res.send({ status: "error", message: err3.sqlMessage });

            return res.send({
              status: "success",
              message: "Answers updated and quiz attempt synchronized",
              attempt_id,
              newScore
            });
          });
        });
      }
    });
  }
});


// DELETE - Remove quiz attempt
router.delete("/delete/:attempt_id/", checkRoles(["admin", "coordinator"]), (req, res) => {
  const { attempt_id } = req.params;

  if (!attempt_id) return res.send({ status: "error", message: "attempt_id required" });
 
  //delete from STUDENTS_ANS_TABLE-fk constraint
  const deleteAnswersSql = `DELETE FROM ${STUDENTS_ANS_TABLE} WHERE attempt_id = ? `;
  
  pool.query(deleteAnswersSql, [attempt_id], (err) => {
    if (err) return res.send({ status: "error", message: err.sqlMessage });

    //delete from STUDENTS_QUIZ_TABLE
    const deleteQuizSql = `DELETE FROM ${ STUDENTS_QUIZ_TABLE } WHERE attempt_id = ?`
    pool.query(deleteQuizSql, [attempt_id], (err2) => {
      if (err2) return res.send({ status: "error", message: err2.sqlMessage });

      res.send({ status: "success", message: `Attempt ${attempt_id} deleted successfully` });
    });
  });
});


 module.exports = router;
