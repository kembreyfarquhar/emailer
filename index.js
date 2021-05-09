const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const authRouter = require("./api/routers/AuthRouter");

const errorHandler = require("./api/middleware/errorHandler");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));
app.use(cors());

// "Sanity Test" endpoint
app.get("/", (_req, res) => {
  res.send("Server is up and running");
});

app.use("/auth", authRouter);

app.use(errorHandler);

// Set up server
const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`\n*** Server listening on port:${port} ***\n`);
});
