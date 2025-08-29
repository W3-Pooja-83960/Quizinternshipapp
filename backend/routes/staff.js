const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const pool = require("../config/db");
const { STAFF_TABLE } = require("../config");

const router = express.Router();

// Get all staff
router.get("/all-staff", (request, response) => {
  const sql = `SELECT * FROM ${STAFF_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No staff found."));
    return response.send(successResponse(results));
  });
});

// Get a staff by ID
router.get("/:id", (request, response) => {
  const { id } = request.params;
  const sql = `SELECT * FROM ${STAFF_TABLE} WHERE staff_id = ?`;
  pool.execute(sql, [id], (error, results) => {
    if (error) return response.send(errorResponse(error));
    if (results.length === 0) return response.send(successResponse("No staff found with ID: " + id));
    return response.send(successResponse(results[0]));
  });
});

// Add a new staff
router.post("/add", (request, response) => {
  const { firstName, lastName, email, password } = request.body;
  const sql = `INSERT INTO ${STAFF_TABLE} (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
  pool.execute(sql, [firstName, lastName, email, password], (error, result) => {
    if (error) return response.send(errorResponse(error));
    return response.send(successResponse({
      message: "Staff created successfully",
      staffId: result.insertId
    }));
  });
});

// Update a staff
router.put("/update/:id", (request, response) => {
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
router.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const sql = `DELETE FROM ${STAFF_TABLE} WHERE staff_id = ?`;
  pool.execute(sql, [id], (error, result) => {
    if (error) return response.send(errorResponse(error));
    if (result.affectedRows === 0) return response.send(successResponse("No staff found with ID: " + id));
    return response.send(successResponse("Staff deleted successfully"));
  });
});

module.exports = router;
