const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { BATCH_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

console.log("Batch routes loaded");

// Apply authentication to all routes
router.use(checkAuthentication);

// --------------------
// GET ALL BATCHES
// Accessible by: admin, coordinator
// --------------------
router.get("/all-batch", checkRoles(["admin", "coordinator"]), (req, res) => {
  const sql = `SELECT * FROM ${BATCH_TABLE}`;
  pool.query(sql, (error, results) => {
    if (error) return res.status(500).send(errorResponse(error));
    if (results.length === 0) return res.status(404).send(successResponse("No batch found."));
    return res.send(successResponse(results));
  });
});

// --------------------
// GET BATCH BY ID
// Accessible by: admin, coordinator
// --------------------
router.get("/:id", checkRoles(["admin", "coordinator"]), (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM ${BATCH_TABLE} WHERE batch_id = ?`;
  pool.query(sql, [id], (error, results) => {
    if (error) return res.status(500).send(errorResponse(error));
    if (results.length === 0) return res.status(404).send(successResponse("Batch not found."));
    return res.send(successResponse(results[0]));
  });
});

// --------------------
// ADD BATCH
// Accessible by: admin only
// --------------------
router.post("/add-batch", checkRoles(["admin"]), (req, res) => {
  const { batch_id,batch_name, start_date, end_date } = req.body;

  if (!batch_name) return res.status(400).send(errorResponse("batch_name is required."));
  if (!start_date) return res.status(400).send(errorResponse("start_date is required."));
  if (!end_date) return res.status(400).send(errorResponse("end_date is required."));

  const sql = `INSERT INTO ${BATCH_TABLE} (batch_id,batch_name, start_date, end_date) VALUES (?, ?, ?, ?)`;
  pool.query(sql, [batch_id, batch_name, start_date, end_date], (error, result) => {
    if (error) return res.status(500).send(errorResponse(error));
    return res.send(successResponse("Batch added successfully."));
  });
});

// --------------------
// UPDATE BATCH
// Accessible by: admin only
// --------------------
router.put("/update-batch/:id", checkRoles(["admin"]), (req, res) => {
  const { id } = req.params;
  const { batch_name, start_date, end_date } = req.body;

  if (!batch_name) return res.status(400).send(errorResponse("batch_name is required."));
  if (!start_date) return res.status(400).send(errorResponse("start_date is required."));
  if (!end_date) return res.status(400).send(errorResponse("end_date is required."));

  const sql = `UPDATE ${BATCH_TABLE} SET batch_name = ?, start_date = ?, end_date = ? WHERE batch_id = ?`;
  pool.query(sql, [batch_name, start_date, end_date, id], (error, result) => {
    if (error) return res.status(500).send(errorResponse(error));
    if (result.affectedRows === 0) return res.status(404).send(errorResponse("Batch not found."));
    return res.send(successResponse("Batch updated successfully."));
  });
});

// --------------------
// DELETE BATCH
// Accessible by: admin only
// --------------------
router.delete("/delete-batch/:id", checkRoles(["admin"]), (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM ${BATCH_TABLE} WHERE batch_id = ?`;
  pool.query(sql, [id], (error, result) => {
    if (error) return res.status(500).send(errorResponse(error));
    if (result.affectedRows === 0) return res.status(404).send(errorResponse("Batch not found."));
    return res.send(successResponse("Batch deleted successfully."));
  });
});

module.exports = router;