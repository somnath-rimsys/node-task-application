const express = require("express");
const path = require("path");

// Database connection.
require("./app/db/connection");

// App configuration.
const app = express();
const publicPath = path.join(__dirname, "../public");

// App routes
const userRoute = require("./app/routers/user");
const taskRoute = require("./app/routers/task");

// App rgister
app.use(express.static(publicPath));
app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

module.exports = app;