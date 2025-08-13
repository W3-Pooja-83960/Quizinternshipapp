// server.js
const express = require("express");
const app = express();
const { PORT } = require("./config");
const routeNotFound = require("./middlewares/routeNotFound");
const batchRoutes = require("./routes/batch");
const courseRoutes = require("./routes/course");

// middlewares
app.use(express.json());

// Dummy GET API
app.get("/hello", (req, res) => {
  res.json({ message: "Hello, this is a dummy API!" });
});

// routes
app.use("/batch",batchRoutes)
app.use("/course",courseRoutes);

// route not found
app.use("/routeNotFound",routeNotFound);


// Start server

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});


