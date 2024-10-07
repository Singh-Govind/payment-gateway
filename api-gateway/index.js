const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const verifyToken = require("./middleware/authorization");
const injectLoggedFlag = require("./middleware/injectFlag");

require("dotenv").config();


// app configs
const app = express();

const USER_SERVICE_URL = "http://localhost:5000";
const DASHBOARD_SERVICE = "http://localhost:5001";

// k8s
// const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
// const STORE_SERVICE_URL = process.env.STORE_SERVICE_URL;
// const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL;

app.use(verifyToken);

app.use(
  "/api/users",
  injectLoggedFlag,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/users/",
    },
  })
);

app.use(
  "/api/dashboard",
  injectLoggedFlag,
  createProxyMiddleware({
    target: DASHBOARD_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/dashboard/",
    },
  })
);

app.get("/", (req, res) => {
    res.send("welcome to the gateway!")
})

const PORT = 3000;
app.listen(PORT, async () => {
  console.log("server started at", PORT);
});
