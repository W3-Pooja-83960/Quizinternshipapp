const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
//const pool = require("../config/db");
const { MODULE_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();


router.get("/all-module", (request, response) => {
  const sql = `SELECT * FROM ${MODULE_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No module Found."));
    }

    return response.send(successResponse(results));
  });
});

router.post('/addmodule',(request,response)=>{
  const{module_name }=request.body
  const statement=`insert into ${MODULE_TABLE}(module_name) values (?)`
  pool.execute(statement,[module_name ],(error,result)=>{
    if (error) {
      return response.send(errorResponse(error));
    }
    return response.send(successResponse(result));


  })
})
router.delete('/deletemodule/:module_id', (request, response) => {
  const {module_id} = request.params;

  const statement = `DELETE FROM ${MODULE_TABLE} WHERE module_id = ?`;
  pool.execute(statement, [module_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }
    return response.send(successResponse(result));
      
  });
});

router.put('/updatemodule/:module_id', (request, response) => {
  const {module_id} = request.params;

const{module_name}=request.body;

  const statement = `UPDATE ${MODULE_TABLE} SET module_name = ?  where module_id = ?` 

  pool.execute(statement, [module_name,module_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }
    if(result.affectedRows === 0)
    {
      return response.send(successResponse("No Module Found with ID: " +module_id));

    }
    return response.send(successResponse("Module Updated Successfully"));
      
  });
});
module.exports = router;
