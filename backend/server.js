const express = require("express");
const app = express();
const moduleRoutes = require("./routes/moduleRoutes");
const batchcourseRoutes = require("./routes/batchcourseRoutes");

const { PORT } = require("./config");
const routeNotFound = require("./middlewares/routeNotFound");

// middlewares
app.use(express.json());

// routes
app.use("/module", moduleRoutes);
app.use("/batch_course", batchcourseRoutes);


// route not found
app.use(routeNotFound);

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
