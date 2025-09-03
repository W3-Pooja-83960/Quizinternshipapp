const express = require("express");
const app = express();
const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");
const optionsRoutes = require("./routes/optionsRoutes");
const course_moduleRoutes = require("./routes/course_moduleRoutes");
const admin_Routes = require("./routes/admin_Routes");
const batch_Routes = require("./routes/batch_Routes");
const course_Routes = require("./routes/course_Routes");
const studentquiz_Routes = require("./routes/studentquiz_Routes");
//const studentAnswer_Routes = require("./routes/studentAnswer_Routes");
const quiz_Routes = require("./routes/quiz_Routes");
const staff_Routes = require("./routes/staff_Routes");
const studentGroup_Routes = require("./routes/studentGroup_routes");
const students_Routes = require("./routes/students_Routes");
const studentAnswer_Routes = require("./routes/studentAnswer_Routes");







const { PORT } = require("./config");
const routeNotFound = require("./middlewares/routeNotFound");

// middlewares
app.use(express.json());

// routes
app.use("/module", moduleRoutes);
app.use("/batch_course", batchcourseRoutes);
app.use("/options", optionsRoutes);
app.use("/course_module", course_moduleRoutes);
app.use("/student_batch",admin_Routes);
app.use("/batch",batch_Routes);
app.use("/course",course_Routes);
app.use("/studentquiz",studentquiz_Routes);
//app.use("/studentAnswer",studentAnswer_Routes);
app.use("/quiz",quiz_Routes);
app.use("/staff",staff_Routes);
app.use("/studentGroup",studentGroup_Routes);
app.use("/students", students_Routes);
app.use("/studentsAnswer", studentAnswer_Routes);
app.use("/admin_Routes", admin_Routes);









//app.use("/staff",staff_Routes);

// route not found
app.use(routeNotFound);

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
