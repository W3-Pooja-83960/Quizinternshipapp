const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { BATCH_COURSE_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();


router.get("/all-batch_course", (request, response) => {
  const sql = `SELECT * FROM ${BATCH_COURSE_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No course Found."));
    }

    return response.send(successResponse(results));
  });
});
router.post('/add-batch_course',(request,response)=>{
    const{batch_id,course_id }=request.body
    const statement=`insert into ${BATCH_COURSE_TABLE}(batch_id,course_id) values (?,?)`
    pool.execute(statement,[batch_id,course_id ],(error,result)=>{
        console.log ("error",error)
      if (error) {

        if(error.code === "ER_DUP_ENTRY")
        return response.send(errorResponse("course already exists in batch"));


        return response.send(errorResponse(error));
      }
      return response.send(successResponse(result));
  
  
    });
  });
  router.delete('/delete-batch_course/:batch_id/:course_id', (request, response) => {
    const { batch_id, course_id } = request.params;
  
    const statement = `DELETE FROM ${BATCH_COURSE_TABLE} WHERE batch_id = ? AND course_id = ?`;
    
    pool.execute(statement, [batch_id, course_id], (error, result) => {
      if (error) {
        return response.send(errorResponse(error));
      }
  
      if (result.affectedRows === 0) {
        return response.send(errorResponse("No matching record found."));
      }
  
      return response.send(successResponse(`Deleted ${result.affectedRows} record(s).`));
    });
  });

  
  router.put("/update-batch_course", (request, response) => {
    const { oldbatch_id,oldcourse_id,newbatch_id,newcourse_id } = request.body;
   
    
    const statement = `UPDATE ${BATCH_COURSE_TABLE} SET batch_id = ? ,course_id = ? WHERE batch_id = ? AND course_id = ?`;
  
    pool.execute(statement, [newbatch_id , newcourse_id, oldbatch_id, oldcourse_id], (error, result) => {
      if (error) {
        return response.send(errorResponse(error));
      }
  
      if (result.affectedRows === 0) {
        return response.send(errorResponse(`No course found in batch`));
      }
  
      return response.send(successResponse(`Course updated successfully `));
    });
  });
 module.exports = router;
