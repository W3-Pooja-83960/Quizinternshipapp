const express = require("express");
const { successResponse, errorResponse } = require('../utils')
const db = require('../db')

const router = express.Router();

// Get all staff
router.get("/all-staff", (request, response) => {
  const sql = `SELECT * FROM staff`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No staff found."));
    }

    return response.send(successResponse(results));
  });
});

// Get a staff by ID
router.get("/:staff_id", (request, response) => {
  const { staff_id } = request.params;
  const sql = `SELECT * FROM staff WHERE staff_id = ?`;

  pool.execute(sql, [staff_id], (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No staff found with ID: " + staff_id));
    }

    return response.send(successResponse(results[0]));
  });
});

// Add a new staff
router.post("/add-staff", (request, response) => {
  const { firstName, lastName, email, password, prnNo, course_id } = request.body;

  const sql = `INSERT INTO staff (firstName, lastName, email, password, prnNo, course_id)
    VALUES (?, ?, ?, ?, ?, ?)`;

  pool.execute(sql, [firstName, lastName, email, password, prnNo, course_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    return response.send(successResponse({
      message: "Staff created successfully",
      studentId: result.insertId
    }));
  });
});

// Update a staff
router.put("/update-staff/:staff_id", (request, response) => {
  const { staff_id } = request.params;
  const { firstName, lastName, email, password, prnNo, course_id } = request.body;

  const sql = ` UPDATE staff SET firstName = ?, lastName = ?, 
                            email = ?, password = ?, prnNo = ?, course_id = ? WHERE staff_id = ? `;

  pool.execute(sql, [firstName, lastName, email, password, prnNo, course_id, staff_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.send(successResponse("No staff found with ID: " + staff_id));
    }

    return response.send(successResponse("Staff updated successfully"));
  });
});

// Delete a staff
router.delete("/delete-staff/:staff_id", (request, response) => {
  const { staff_id } = request.params;

  const sql = `DELETE FROM staff WHERE staff_id = ?`;

  pool.execute(sql, [staff_id], (error, result) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return response.send(successResponse("No staff found with ID: " + staff_id));
    }

    return response.send(successResponse("Staff deleted successfully"));
  });
});

module.exports = router;