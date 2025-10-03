const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const pool = require("../config/db");
const { STAFF_TABLE } = require("../config");
const router = express.Router();
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

// Apply authentication to all routes
router.use(checkAuthentication);

// Get all staff
router.get("/all-staff", checkRoles(["admin", "coordinator"]),(request, response) => {
  const sql = `SELECT * FROM ${STAFF_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return response.send(errorResponse(error));
       if (results.length === 0) return response.send(successResponse([]));
return response.send(successResponse(results));
  });
});

// Get a staff by ID
router.get("/:id", checkRoles(["admin", "coordinator"]),(request, response) => {
  const { id } = request.params;
  const sql = `SELECT * FROM ${STAFF_TABLE} WHERE staff_id = ?`;
  pool.execute(sql, [id], (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No staff found with ID: " + id));
    return response.send(successResponse(results[0]));
  });
});

// Add a new staff
router.post("/add", checkRoles(["admin"]),(req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const sql = `INSERT INTO ${STAFF_TABLE} (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`;
  pool.execute(sql, [firstName, lastName, email, password, role], (error, result) => {
    if (error) return res.send(errorResponse(error));

    return res.send(successResponse({
      message: "Staff created successfully",
      staffId: result.insertId
    }));
  });
});


// Update a staff
router.put("/update/:id",checkRoles(["admin"]), (request, response) => {
  const { id } = request.params;
  const { firstName, lastName, email, password } = request.body;
  const sql = `UPDATE ${STAFF_TABLE} SET firstName = ?, lastName = ?, email = ?, password = ? WHERE staff_id = ?`;
  pool.execute(sql, [firstName, lastName, email, password, id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No staff found with ID: " + id));
    return response.send(successResponse("Staff updated successfully"));
  });
});

//  delete a staff
router.delete("/delete/:id",checkRoles(["admin"]), (request, response) => {
  const { id } = request.params;
  const sql = `DELETE FROM ${STAFF_TABLE} WHERE staff_id = ?`;
  pool.execute(sql, [id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No staff found with ID: " + id));
    return response.send(successResponse("Staff deleted successfully"));
  });
});

module.exports = router;
