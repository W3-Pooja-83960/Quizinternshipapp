const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router();



router.get('/',(request,response) =>{
    const statement = `SELECT * FROM staff`
    db.pool.query(statement,(error,result) =>{
        response.send(utils.createResult(error,result))
    })
})

router.post('/',(request,response) =>{
    const {firstName,lastName,email,password} = request.body
    const statement = `insert into staff (firstName,lastName,email,password) values (?,?,?,?)`
    db.pool.execute(statement,[firstName,lastName,email,password],(error,result) =>{
        response.send(utils.createResult(error,result))
    })

})

router.put('/:id',(request,response) =>{
    const {id} = request.params
    const {firstName,lastName,email,password} = request.body
    const statement = `update staff set firstName=?,lastName=?,email=?,password=? where id=?`
    db.pool.execute(statement,[firstName,lastName,email,password,id],(error,result) =>{
        response.send(utils.createResult(error,result))
    })
})
 router.delete('/:id',(request,response) =>{
        const {id} = request.params
        const statement = `update staff set is_active = 0 where id=?`
        db.pool.execute(statement,[id] , (error,result) =>{
            response.send(utils.createResult(error,result))
        })
    
})

module.exports = router



