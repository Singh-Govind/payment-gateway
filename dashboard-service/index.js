const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const db = require("./models");

// routes importing
const dashboardRoutes = require("./src/routes/dashboard-route");
const merchantRoutes = require("./src/routes/merchant-route");

// other imports
const authMiddleware = require("./src/middleware/auth-middleware");
const dataExtracter = require("./src/middleware/data-extracter");
const errorHandler = require("./src/middleware/error-handler");

// app configs
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(dataExtracter);
app.use(authMiddleware);

app.use("/dashboard", dashboardRoutes);
app.use("/merchant", merchantRoutes);

app.get("/", (req, res) => {
  res.json({ msg: "yes its working!" });
});

app.use(errorHandler);

const PORT = 5001;

app.listen(PORT, async () => {
  console.log("server started at", PORT);
  await db.sequelize.authenticate();
  console.log("sequelize authenticated!");
});
