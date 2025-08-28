const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { COURSE_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");

console.log("course routes loaded");

// Get all courses
router.get("/all-course", (request, response) => {
  console.log("Fetching all courses...");
  const sql = `SELECT * FROM ${COURSE_TABLE}`;

  pool.query(sql, (error, results) => {
    console.log("Error:", error);
    console.log("Results:", results);
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No course found."));
    }

    return response.send(successResponse(results));
  });
});

// Get course by ID
router.get("/:id", (request, response) => {
  const { id } = request.params;
  const sql = `SELECT * FROM ${COURSE_TABLE} WHERE course_id = ?`;

  pool.query(sql, [id], (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("Course not found."));
    }

    return response.send(successResponse(results[0]));
  });
});



//add batch
router.post("/add-course", (req, res) => {
  const { course_id, course_name } = req.body;
  const sql = `INSERT INTO ${COURSE_TABLE} (course_id, course_name) VALUES (?, ?)`;

  pool.query(sql, [course_id, course_name], (error, result) => {
    console.log("DB query callback fired");
    if (error) {
      console.error("DB error:", error);
      return res.status(500).send(errorResponse(error));
    }
    console.log("Course inserted successfully");
    return res.send(successResponse("Course added successfully."));
  });
});


// Update course
router.put("/update-course/:id", (req, res) => {
  const { id } = req.params;                
  const { course_name } = req.body;         

  if (!course_name) {
    return res.status(400).json(errorResponse("Course name is required."));
  }

  const sql = `UPDATE ${COURSE_TABLE} SET course_name = ? WHERE course_id = ?`;

  pool.query(sql, [course_name, id], (error, result) => {
    if (error) {
      return res.status(500).json(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return res.status(404).json(successResponse("Course not found."));
    }

    return res.json(successResponse("Course updated successfully."));
  });
});


// ✅ Delete batch
router.delete("/delete-course/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM ${COURSE_TABLE} WHERE course_id = ?`;

  pool.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return res.status(404).json(successResponse("Course not found."));
    }

    return res.json(successResponse("Course deleted successfully."));
  });
});



module.exports = router;
