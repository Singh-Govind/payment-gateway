const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// const { connectDB } = require("./src/config/dbConf");
const db = require("./models");

// routes importing
const authMiddleware = require("./src/middleware/auth-middleware")

// other imports
const errorHandler = require("./src/middleware/error-handler");

// app configs
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(authMiddleware);

app.get("/", (req, res) => {
  res.json({ msg: "yes its working!" });
});

app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, async () => {
  console.log("server started at", PORT);
  await db.sequelize.authenticate();
  console.log("sequelize authenticated!");
});
