const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
//const pool = require("../config/db");
const { OPTIONS_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();


router.get("/all-options", (request, response) => {
  const sql = `SELECT * FROM ${OPTIONS_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No options Found."));
    }

    return response.send(successResponse(results));
  });
});


router.post('/add-options',(request,response)=>{
    const{option_id ,question_id, option_text}=request.body
    const statement=`insert into ${OPTIONS_TABLE}(option_id ,question_id ,option_text ) values (? , ? , ?)`
    pool.execute(statement,[option_id ,question_id,option_text],(error,result)=>{
      if (error) {
        return response.send(errorResponse(error));
      }
      return response.send(successResponse(result));
  
  
    });
  });


  router.delete('/delete-options/:option_id', (request, response) => {
    const { option_id } = request.params;
  
    const statement = `DELETE FROM ${OPTIONS_TABLE} WHERE option_id = ? `;
    
    pool.execute(statement, [option_id], (error, result) => {
      if (error) {
        return response.send(errorResponse(error));
      }
  
      if (result.affectedRows === 0) {
        return response.send(errorResponse("No matching record found."));
      }
  
      return response.send(successResponse(`Deleted ${result.affectedRows} record(s).`));
    });
  });

//   router.put("/update-options/:option_id", (request, response) => {
//     const { option_id,question_id,option_text } = request.body;
   
    
//     const statement = `UPDATE ${OPTIONS_TABLE}  SET question_id = ?, option_text = ?, is_correct = ?WHERE option_id = ?
//   `;;
  
//     pool.execute(statement, [ option_id,question_id,option_text], (error, result) => {
//       if (error) {
//         return response.send(errorResponse(error));
//       }
  
//       if (result.affectedRows === 0) {
//         return response.send(errorResponse(`No option found `));
//       }
  
//       return response.send(successResponse(`option updated successfully `));
//     });
//   });



router.put("/update-options/:option_id", (request, response) => {
    const { question_id, option_text, is_correct } = request.body;
    const { option_id } = request.params;
  
    const statement = `
      UPDATE ${OPTIONS_TABLE}  
      SET question_id = ?, option_text = ?, is_correct = ?
      WHERE option_id = ?
    `;
  
    pool.execute(statement, [question_id, option_text, is_correct, option_id], (error, result) => {
      if (error) {
        return response.send(errorResponse(error.message)); // show actual error
      }
  
      if (result.affectedRows === 0) {
        return response.send(errorResponse(`No option found with id ${option_id}`));
      }
  
      return response.send(successResponse(`Option updated successfully`));
    });
  });
module.exports = router;
