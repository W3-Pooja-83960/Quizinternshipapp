const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const { COURSE_MODULE_TABLE } = require("../config/index");

const pool = require("../config");
const router = express.Router();

router.get("/all-course_module", (request, response) => {
  const sql = `SELECT * FROM ${COURSE_MODULE_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No module found for any course."));
    }

    return response.send(successResponse(results));
  });
});

router.post("/add-course_module", (request, response) => {
  const { course_id, module_id } = request.body;
  const statement = `INSERT INTO ${COURSE_MODULE_TABLE}(course_id, module_id) VALUES (?, ?)`;

  pool.execute(statement, [course_id, module_id], (error, result) => {
    console.log("error", error);
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return response.send(errorResponse("Module already exists in course"));
      }

      return response.send(errorResponse(error));
    }

    return response.send(successResponse(result));
  });
});

router.delete("/delete-course_module/:course_id/:module_id", (request, response) => {
  const { course_id, module_id } = request.params;

  const statement = `DELETE FROM ${COURSE_MODULE_TABLE} WHERE course_id = ? AND module_id = ?`;

  pool.execute(statement, [course_id, module_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.send(errorResponse("No matching record found."));
    }

    return response.send(successResponse(`Deleted ${result.affectedRows} record(s).`));
  });
});

router.put("/update-course_module", (request, response) => {
  const { oldcourse_id, oldmodule_id, newcourse_id, newmodule_id } = request.body;

  const statement = `UPDATE ${COURSE_MODULE_TABLE} SET course_id = ?, module_id = ? WHERE course_id = ? AND module_id = ?`;

  pool.execute(
    statement,
    [newcourse_id, newmodule_id, oldcourse_id, oldmodule_id],
    (error, result) => {
      if (error) {
        return response.send(errorResponse(error));
      }

      if (result.affectedRows === 0) {
        return response.send(errorResponse("No module found in course"));
      }

      return response.send(successResponse("Module updated successfully"));
    }
  );
});

module.exports = router;

module.exports = router;

