// server.js
const express = require("express");
const app = express();
<<<<<<< HEAD
const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");

=======
>>>>>>> sayali
const { PORT } = require("./config");
const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");

// middlewares
app.use(express.json());

// routes
<<<<<<< HEAD
app.use("/module", moduleRoutes);
app.use("/batch_course", batchcourseRoutes);

=======
app.use("/batch",batchRoutes)
app.use("/course",courseRoutes);
>>>>>>> sayali

// route not found
app.use("/routeNotFound",routeNotFound);


// Start server

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});


