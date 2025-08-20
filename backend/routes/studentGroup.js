const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

router.get('/',(request,response) =>{
    const statement = `select * from student_group`
    db.pool.query(statement,(error,result) =>{
        response.send(utils.createResult(error,result))
    })
})

router.post('/',(request,response) =>{
    const {studentId, moduleId} = request.body
    const statement = `insert into student_group (studentId, moduleId) values (?,?)`
    db.pool.execute(statement,[studentId, moduleId],(error,result) =>{
        response.send(utils.createResult(error,result))
    })

})

router.put('/:id',(request,response) =>{
    const {id} = request.params
    const {studentId, moduleId} = request.body
    const statement = `update student_group set studentId=?, moduleId=? where id=?`
    db.pool.execute(statement,[studentId, moduleId,id],(error,result) =>{
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


