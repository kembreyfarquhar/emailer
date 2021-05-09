// Third party packages
const express = require("express");
require("dotenv").config();

// Routers
const authRouter = require("./api/routers/AuthRouter");
const usersRouter = require("./api/routers/UsersRouter");

// Error Handler
const errorHandler = require("./api/middleware/errorHandler");

// Initialize App
const app = express();

// Use middleware
app.use(express.json());
app.use(require("helmet")());
app.use(require("morgan")("combined"));
app.use(require("cors")());

// "Sanity Test" endpoint
app.get("/", (_req, res) => {
  res.send("Server is up and running");
});

// Use Routers
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Use Error Handler
app.use(errorHandler);

// Set up server
const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`\n*** Server listening on port:${port} ***\n`);
});
