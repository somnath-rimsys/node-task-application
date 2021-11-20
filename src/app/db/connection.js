const mongoose = require("mongoose");
const chalk = require("chalk");
const connectionString = process.env.MONGODB_URL;

mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => {
    console.log(chalk.green("Database connected"));
  })
  .catch((e) => {
    console.log(chalk.red("Unable to connect to database."));
  });
