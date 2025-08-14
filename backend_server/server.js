const express = require('express')
const utils = require('./utils')



const app = express()
app.use(express.json())
app.use(express.urlencoded())







const staffRouter = require('./routes/staff')
app.use('/staff',staffRouter)



const studentGroupRouter = require('./routes/studentGroup')
app.use('/student-group',studentGroupRouter)


app.listen(4000,'0.0.0.0',() =>{
    console.log(`server started on port 4000`)
})