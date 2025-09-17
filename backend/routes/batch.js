const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { BATCH_TABLE } = require("../config/index");

const { successResponse, errorResponse } = require("../utils/apiResponse");

console.log("Batch routes loaded");

// Get all batches
router.get("/all-batch", (request, response) => {
  console.log("Fetching all batches...");
  const sql = `SELECT * FROM ${BATCH_TABLE}`;

  pool.query(sql, (error, results) => {
    console.log("Error:", error);
    console.log("Results:", results);
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No batch found."));
    }

    return response.send(successResponse(results));
  });
});

// Get batch by ID
router.get("/:id", (request, response) => {
  const { id } = request.params;
  const sql = `SELECT * FROM ${BATCH_TABLE} WHERE batch_id = ?`;

  pool.query(sql, [id], (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("Batch not found."));
    }

    return response.send(successResponse(results[0]));
  });
});



//add batch
router.post("/add-batch", (req, res) => {
  const { batch_name, start_date, end_date } = req.body;

  // Check 
  if (!batch_name) {
    return res.status(400).json({ status: "error",  message: "batch_name is required.", });
  }
  if (!start_date) {
    return res.status(400).json({ status: "error",  message: "start_date is required.", });
  }
  if (!end_date) {
    return res.status(400).json({ status: "error",  message: "end_date is required.",  });
  }

  const sql = `INSERT INTO ${BATCH_TABLE} (batch_name, start_date, end_date) VALUES (?, ?, ?)`;

  console.log("Incoming body:", req.body);
pool.query(sql, [batch_name, start_date, end_date], (error, result) => {
  if (error) {
    console.error("DB error:", error);
    return res.status(500).send(errorResponse(error));
  }
  console.log("Batch inserted successfully");
  return res.send(successResponse("Batch added successfully."));
});

});


// ✅ Update batch
router.put("/update-batch/:id", (req, res) => {
  const { id } = req.params;
  const { batch_name,start_date,end_date } = req.body;


  // Check fields 
  if (!batch_name) {
    return res.status(400).json({status: "error", message: "batch_name is required."  });
  }
  if (!start_date) {
    return res.status(400).json({status: "error", message: "start_date is required."});
  }
  if (!end_date) {
    return res.status(400).json({status: "error",message: "end_date is required." });
  }

  const sql = `UPDATE ${BATCH_TABLE} SET batch_name = ?, start_date = ?, end_date = ? WHERE batch_id = ?`;

  pool.query(sql, [batch_name, start_date, end_date, id], (error, result) => {
    if (error) {
      return res.status(500).json(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return res.status(404).json(errorResponse("Batch not found."));
    }

    return res.json(successResponse("Batch updated successfully."));
  });
});


// Delete batch
router.delete("/delete-batch/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM ${BATCH_TABLE} WHERE batch_id = ?`;

  pool.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json(errorResponse(error));
    }

    if (result.affectedRows === 0) {
      return res.status(404).json(successResponse("Batch not found."));
    }

    return res.json(successResponse("Batch deleted successfully."));
  });
});



module.exports = router;
