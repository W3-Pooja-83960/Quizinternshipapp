const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
//const pool = require("../config/db");
const { OPTIONS_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");


// Apply authentication to all routes
router.use(checkAuthentication);

// Get all options
router.get("/all-options", checkRoles(["admin", "coordinator"]), (request, response) => {
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

// Add new option
router.post('/add-options',checkRoles(["admin"]),(request,response)=>{
    const{option_id ,question_id, option_text}=request.body
    const statement=`insert into ${OPTIONS_TABLE}(option_id ,question_id ,option_text ) values (? , ? , ?)`
    pool.execute(statement,[option_id ,question_id,option_text],(error,result)=>{
      if (error) {
        return response.send(errorResponse(error));
      }
      return response.send(successResponse(result));
  
  
    });
  });

  
  // Add multiple options
router.post('/add-mult-options', checkRoles(["admin"]), (req, res) => {
    console.log("Body received:", req.body);

    const { options } = req.body;

    if (!options || !options.length) {
        return res.send({ status: "error", message: "Options are required" });
    }

    // Prepare values for multiple insert
    const values = options.map(o => [o.option_id || null, o.question_id, o.option_text]);

    const sql = `INSERT INTO ${OPTIONS_TABLE} (option_id, question_id, option_text) VALUES ?`;

    pool.query(sql, [values], (err, result) => {
        if (err) return res.send({ status: "error", message: err });

        res.send({ status: "success", inserted: result.affectedRows });
    });
});

// Delete option by ID
  router.delete('/delete-options/:option_id',checkRoles(["admin"]), (request, response) => {
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

// Update option by ID
router.put("/update-options/:option_id",checkRoles(["admin"]), (request, response) => {
    const { question_id, option_text, is_correct } = request.body;
    const { option_id } = request.params;
  
    const statement = `
      UPDATE ${OPTIONS_TABLE}  
      SET question_id = ?, option_text = ?, is_correct = ?
      WHERE option_id = ?     `;
  
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
