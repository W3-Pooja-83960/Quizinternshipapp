const express = require("express");
const app = express();
const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");
const optionsRoutes = require("./routes/optionsRoutes");
const course_moduleRoutes = require("./routes/course_moduleRoutes");
const admin_Routes = require("./routes/admin_Routes");
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
app.use("/staff",staff_Routes);

// route not found
app.use(routeNotFound);

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
