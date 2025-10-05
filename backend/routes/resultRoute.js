const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");
const { successResponse, errorResponse } = require("../utils/apiResponse");

router.use(checkAuthentication);

router.get("/view-results", checkRoles(["admin", "coordinator"]), (req, res) => {
  const { course_id, group_name, quiz_id } = req.query;

  // Join StudentQuiz, students, quiz, and courses to get all info
  let sql = `
    SELECT s.firstName, s.lastName, c.course_name, sq.group_name, q.quiz_title, sq.score
    FROM StudentQuiz sq
    JOIN students s ON s.student_id = sq.student_id
    JOIN quiz q ON q.quiz_id = sq.quiz_id
    JOIN course c ON c.course_id = s.course_id
    WHERE 1=1
  `;

  const params = [];

  if (course_id) {
    sql += " AND c.course_id = ?";
    params.push(course_id);
  }
  if (group_name) {
    sql += " AND sq.group_name = ?";
    params.push(group_name);
  }
  if (quiz_id) {
    sql += " AND q.quiz_id = ?";
    params.push(quiz_id);
  }

  pool.query(sql, params, (err, results) => {
    if (err) return res.send(errorResponse(err));

    return res.send(successResponse(results));
  });
});

module.exports = router;
