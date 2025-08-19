const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

router.get('/',(request,response) =>{
    const statement = `select id,student_id, module_id from student_group is_active=1`
    db.pool.query(statement,(error,result) =>{
        response.send(utils.createResult(error,result))
    })
})

router.post('/',(request,response) =>{
    const {student_id, module_id} = request.body
    const statement = `insert into student_group (student_id, module_id) values (?,?)`
    db.pool.execute(statement,[student_id, module_id],(error,result) =>{
        response.send(utils.createResult(error,result))
    })

})

router.put('/:id',(request,response) =>{
    const {id} = request.params
    const {student_id, module_id} = request.body
    const statement = `update student_group set student_id=?, module_id=? where id=?`
    db.pool.execute(statement,[student_id, module_id,id],(error,result) =>{
        response.send(utils.createResult(error,result))
    })
})

 router.delete('/:id',(request,response) =>{
        const {id} = request.params
        const statement = `update student_group set is_active = 0 where id=?`
        db.pool.execute(statement,[id] , (error,result) =>{
            response.send(utils.createResult(error,result))
        })
    
})

module.exports = router

















// router.get("/all-student-group", (request, response) => {
//   const sql = `SELECT * FROM student_group`

//   pool.query(sql, (error, results) => {
//     if (error) {
//       return response.send(errorResponse(error));
//     }

//     if (results.length === 0) {
//       return response.send(successResponse("No student group found."));
//     }

//     return response.send(successResponse(results));
//   });
// });

// router.post("/student-group", (request, response) => {
//    const { student_id, module_id } = request.body;

//   const sql = `INSERT INTO student_group (student_id, module_id) VALUES (?, ?)`;

//   pool.execute(sql, [student_id, module_id], (error, result) => {
//     if (error) {
//       return response.send(errorResponse(error));
//     }

//     return response.send(successResponse({
//       message: "Student Group created successfully",
//       studentId: result.insertId
//     }));
//   });
// });


// router.put("/:group_id", (request, response) => {
//     const { student_id, module_id } = request.body

//   const sql = ` UPDATE student_group
//         SET student_id = ?, module_id = ?
//         WHERE group_id = ?`

//   pool.execute(sql, [student_id, module_id], (error, result) => {
//     if (error) {
//       return response.send(errorResponse(error));
//     }

//     return response.send(successResponse({
//       message: "Student Group created successfully",
//       studentId: result.insertId
//     }));
//   });
// });

// router.delete('/',(request,response) =>{
    
// })

