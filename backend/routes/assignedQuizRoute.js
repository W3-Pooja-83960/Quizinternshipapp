const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {  STUDENTS_QUIZ_TABLE,STUDENTS_GROUP_TABLE,QUIZ_QUESTIONS_TABLE,QUIZ_TABLE, STAFF_TABLE } = require("../config");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");


// Apply authentication to all routes
router.use(checkAuthentication);

// POST /assign-quiz-to-group
router.post("/assign-quiz",checkRoles(["admin", "coordinator"]), (req, res) => {
  const { quiz_id, selected_questions, group_id } = req.body;

  if (!quiz_id || !selected_questions?.length || !group_id) {
    return res.status(400).json({ status: "error", message: "quiz_id, selected_questions, group_id required" });
  }

  // 1️⃣ Get staff info from quiz
  pool.query(`SELECT staff_id FROM ${QUIZ_TABLE} WHERE quiz_id = ?`, [quiz_id], (err, quizResult) => {
    if (err || !quizResult.length) return res.status(404).json({ status: "error", message: "Quiz not found" });

    const staff_id = quizResult[0].staff_id;

    // 2️⃣ Get staff name
    pool.query(`SELECT firstName, lastName FROM ${ STAFF_TABLE } WHERE staff_id = ?`, [staff_id], (err, staffResult) => {
      const firstName = staffResult?.[0]?.firstName || "";
      const lastName = staffResult?.[0]?.lastName || "";

      // 3️⃣ Assign questions to quiz
      const questionValues = selected_questions.map(q => [quiz_id, q]);
      pool.query(`INSERT IGNORE INTO ${QUIZ_QUESTIONS_TABLE} (quiz_id, question_id) VALUES ?`, [questionValues], (err) => {
        if (err) return res.status(500).json({ status: "error", message: err.sqlMessage });

        // 4️⃣ Assign quiz to all students in the group
        pool.query(`SELECT student_id FROM ${STUDENTS_GROUP_TABLE} WHERE group_id = ?`, [group_id], (err, students) => {
          if (err || !students.length) return res.status(404).json({ status: "error", message: "No students found in this group" });

          const studentValues = students.map(s => [s.student_id, quiz_id]);
          pool.query(`INSERT IGNORE INTO ${STUDENTS_QUIZ_TABLE} (student_id, quiz_id) VALUES ?`, [studentValues], (err) => {
            if (err) return res.status(500).json({ status: "error", message: err.sqlMessage });

            // ✅ Success response
            res.json({
              status: "success",
              message: `${selected_questions.length} questions selected. Quiz assigned to group ${group_id} by staff ${firstName} ${lastName} (ID: ${staff_id})`,
              assigned_by: { staff_id, firstName, lastName }
            });
          });
        });
      });
    });
  });
});

module.exports = router;
