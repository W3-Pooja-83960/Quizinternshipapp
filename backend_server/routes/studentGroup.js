const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

router.get("/all-student-group", (request, response) => {
  const sql = `SELECT * FROM student_group`

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No student group found."));
    }

    return response.send(successResponse(results));
  });
});

router.post("/student-group", (request, response) => {
   const { student_id, module_id } = request.body;

  const sql = `INSERT INTO student_group (student_id, module_id) VALUES (?, ?)`;

  pool.execute(sql, [student_id, module_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    return response.send(successResponse({
      message: "Student Group created successfully",
      studentId: result.insertId
    }));
  });
});


router.put("/:group_id", (request, response) => {
    const { student_id, module_id } = request.body

  const sql = ` UPDATE student_group
        SET student_id = ?, module_id = ?
        WHERE group_id = ?`

  pool.execute(sql, [student_id, module_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    return response.send(successResponse({
      message: "Student Group created successfully",
      studentId: result.insertId
    }));
  });
});

router.delete('/',(request,response) =>{
    
})

module.exports = router