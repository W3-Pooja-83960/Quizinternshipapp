
const express = require("express");
const app = express();
const cors = require("cors");
const { PORT } = require("./config");

const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");

const studentsQuizRoutes = require("./routes/studentQuizRoutes");
const studentAnswersRoutes = require("./routes/studentAnswerRoutes");
const admin_Routes = require("./routes/admin_Routes");
const assignedQuizRoute = require("./routes/assignedQuizRoute");

const moduleRoutes = require("./routes/moduleRoutes");
const batch_courseRoutes = require("./routes/batch_courseRoutes");
const optionsRoutes = require("./routes/optionsRoutes");

const studentsRoutes = require("./routes/studentsRoutes");
const course_moduleRoutes = require("./routes/course_moduleRoutes");

const studentsGroupRoutes = require("./routes/studentGroup");
const staffRoutes = require("./routes/staff");

const quizRoutes = require("./routes/quiz");

const questionsRoutes = require("./routes/questions");

const userRoutes = require("./routes/user_Routes");


// middlewares
app.use(express.json());
app.use(cors());



// Dummy GET API
app.get('/test', (req, res) => {
  console.log('Request received!');  
  res.send({ status: 'ok' });
});



//Admin routes
app.use("/admin_routes",admin_Routes);

// routes
app.use("/batch",batchRoutes)
app.use("/course",courseRoutes);
app.use("/student-quiz",studentsQuizRoutes);
app.use("/student-answers", studentAnswersRoutes);
app.use("/assigned_quiz",assignedQuizRoute);

app.use("/module",moduleRoutes)
app.use("/batch_course",batch_courseRoutes);
app.use("/options",optionsRoutes)

app.use("/students",studentsRoutes);
app.use("/course_module",course_moduleRoutes);
app.use("/students_group",studentsGroupRoutes);

app.use("/staff",staffRoutes);
app.use("/quiz", quizRoutes);
app.use("/questions",questionsRoutes);

app.use("/user",userRoutes);




// route not found
app.use("/routeNotFound",routeNotFound);


// Start server

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});






