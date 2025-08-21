// server.js
const express = require("express");

const app = express();

const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");



const { PORT } = require("./config/index");


const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");
const questionRoutes = require("./routes/questions");
// middlewares
app.use(express.json());

// routes

app.use("/batch_course", batchcourseRoutes);
app.use("/questions", questionRoutes);
app.use("/module", moduleRoutes);

app.use("/batch",batchRoutes)
app.use("/course",courseRoutes);


// route not found
app.use("/routeNotFound",routeNotFound);


// Start server

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});


