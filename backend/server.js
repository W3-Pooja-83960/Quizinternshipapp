const express = require("express");
const app = express();
const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");
const { PORT } = require("./config");   // Only get PORT from config
const pool = require("./config/db");    // Import pool from db.js
const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");
//const questionRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quiz");
const adminRoutes = require("./routes/admin_Routes");
// middlewares
app.use(express.json());

// routes
app.use("/module", moduleRoutes);
app.use("/batch_course", batchcourseRoutes);
app.use("/batch", batchRoutes);
app.use("/course", courseRoutes);
//app.use("/questions", questionRoutes);
app.use("/quiz", quizRoutes);
app.use("/adminRoutes",adminRoutes);
// route not found
app.use("/routeNotFound", routeNotFound);

// Test DB connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error(" Database connection failed:", err.message);
  } else {
    console.log(" Database connected successfully!");
    connection.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
