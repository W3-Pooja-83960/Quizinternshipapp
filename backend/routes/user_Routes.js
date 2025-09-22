const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { STAFF_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


// GET: TEST API
router.get("/test", (request, response) => {
  return response.send(("Testing user api"));
});


// POST: register a user
router.post("/register", (req, resp) => {
  const { firstName, lastName, email, password,role } = req.body;

  const key =bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password,key);

  // STEP 1: check is user already exists
  const checkSQL = `SELECT * FROM ${STAFF_TABLE} WHERE email = ?`;

  pool.query(checkSQL, [email], (error, result) => {
    if (error) return resp.send(errorResponse(error));

    if (result.length > 0)
      return resp.send(errorResponse("Email already exists."));

    // STEP 2: insert new user into database
    const insertSQL = `INSERT INTO ${STAFF_TABLE} (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`;

    pool.query( insertSQL, [firstName, lastName, email, hashPassword, role], (error, insertResult) => {
        if (error) return resp.send(errorResponse(error));

        return resp.send(successResponse("Registrartion successful."));
      }
    );
  });
});


// POST: login a user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // STEP 1: fetch user by email
  const sql = `SELECT * FROM ${STAFF_TABLE} WHERE email = ?`;

  pool.query(sql, [email], (error, result) => {
    if (error) return res.send(errorResponse(error));

    if (result.length === 0)
      return res.send(errorResponse("Invalid email"));

    const user = result[0];

    // STEP 2: compare password with hashed password
    const isPasswordValid = password === user.password;

    if (!isPasswordValid)
      return res.send(errorResponse("Invalid password!"));

    // STEP 3: create JWT payload
   const payload = {
                        userId: user.staff_id,
                        firstName: user.firstName,
                        lastName: user.lastName,   
                        role: user.role,
                      };
    delete user.password; // remove password from user object    

    // STEP 4: generate token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    return res.send(
      successResponse({
        token,
        message: "Login Successful",
      })
    );
  });
});




module.exports = router;