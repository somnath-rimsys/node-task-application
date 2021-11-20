const express = require("express");
const multer = require("multer");
const chalk = require("chalk");
const path = require("path");
const upload = multer({ dest: "uploads/" });

const app = express();
const PORT = process.env.PORT || 9000;

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "upload.html"));
});

app.post("/upload", upload.single("avatar"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send();
});

app.listen(PORT, () => {
  console.log(chalk.green("App started at http://localhost:" + PORT));
  console.log(chalk.green("Upload a file..."));
});
