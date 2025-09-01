const express = require("express");
const app = express();

const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const course_moduleRoutes = require("./routes/course_moduleRoutes");
const optionsRoutes = require("./routes/optionsRoutes");
const course_moduleRoutes = require("./routes/course_moduleRoutes");
const admin_Routes = require("./routes/admin_Routes");
const { PORT } = require("./config");
const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");
const questionRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quiz");
const adminRoutes = require("./routes/admin");
// middlewares
app.use(express.json());

// routes
app.use("/student", studentsRoutes);
app.use("/course_module", course_moduleRoutes);
app.use("/module", moduleRoutes);
app.use("/batch_course", batchcourseRoutes);
app.use("/options", optionsRoutes);
app.use("/course_module", course_moduleRoutes);
app.use("/student_batch",admin_Routes);
app.use("/staff",staff_Routes);
app.use("/batch",batchRoutes)
app.use("/course",courseRoutes);

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

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
