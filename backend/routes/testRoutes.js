const express = require("express");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const pool = require("../config/db");
const { BOOK_TABLE } = require("../config");
const router = express.Router();

// test route
router.get("/demo1", (request, response) => {
  response.send(successResponse("Hello World!!!!!"));
});

// get all books
router.get("/all-books", (request, response) => {
  const sql = `SELECT * FROM ${BOOK_TABLE}`;

  pool.query(sql, (error, results) => {
    if (error) {
      return response.send(errorResponse(error));
    }

    if (results.length === 0) {
      return response.send(successResponse("No Books Found."));
    }

    return response.send(successResponse(results));
  });
});

module.exports = router;
