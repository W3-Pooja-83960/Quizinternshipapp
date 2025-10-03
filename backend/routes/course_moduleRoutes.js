const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { COURSE_MODULE_TABLE } = require("../config");
const pool = require("../config/db");
const router = express.Router();
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

// Apply authentication to all routes
router.use(checkAuthentication);

router.get("/all-course_module",checkRoles(["admin", "coordinator"]), (request, response) => {
  const sql = `SELECT * FROM ${COURSE_MODULE_TABLE} `;

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

// Example: GET /course/:courseId/modules
router.get("/course/:courseId/modules",  checkRoles(["admin", "coordinator"]),  (req, res) => {
    const { courseId } = req.params;
    const sql = `SELECT * FROM ${COURSE_MODULE_TABLE} WHERE course_id = ?`;

    pool.query(sql, [courseId], (error, results) => {
      if (error) return res.send(errorResponse(error));

      if (results.length === 0) {
        return res.send(successResponse("No module found for this course."));
      }

      return res.send(successResponse(results));
    });
  }
);


//add course_module
router.post("/add-course_module", checkRoles(["admin"]),(request, response) => {
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

//update course_module
router.put("/update-course_module", checkRoles(["admin"]),(request, response) => {
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


router.delete("/delete-course_module/:course_id/:module_id", checkRoles(["admin"]),(request, response) => {
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

module.exports = router;
