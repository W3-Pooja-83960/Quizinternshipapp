const express = require("express");
const app = express();

const pool = require("./config/db"); // ✅ added

const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");
const { PORT } = require("./config/index");
const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");
const questionRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quiz");
const adminRoutes = require("./routes/admin");
// middlewares
app.use(express.json());

// routes
app.use("/batch_course", batchcourseRoutes);
app.use("/questions", questionRoutes);
app.use("/module", moduleRoutes);
app.use("/batch", batchRoutes);
app.use("/course", courseRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/admin", adminRoutes);
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
