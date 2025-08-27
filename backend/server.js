// server.js
const express = require("express");
const app = express();
const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");
const adminRoutes = require("./routes/admin_Routes")

const { PORT } = require("./config");
const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");

// middlewares
app.use(express.json());

// routes
app.use("/module", moduleRoutes);
app.use("/batch_course", batchcourseRoutes);

app.use("/batch",batchRoutes)
app.use("/course",courseRoutes);
app.use("/student_course", adminRoutes)
// route not found
app.use("/routeNotFound",routeNotFound);


// Start server

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});


