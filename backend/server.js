const express = require("express");
const app = express();
const testRoutes = require("./routes/testRoutes");
const { PORT } = require("./config");
const routeNotFound = require("./middlewares/routeNotFound");

// middlewares
app.use(express.json());

// routes
app.use("/test", testRoutes);

// route not found
app.use(routeNotFound);

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
