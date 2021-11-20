require("../../src/app/db/connection");
require("../../src/app/models/task")
const User = require("../../src/app/models/user");

// Get all tasks created by a user

const findUserTasks = async () => {
  const user = await User.findById("61949536666a989a90ccd7fa");
  await user.populate("tasks");
  console.log(user.tasks);
};

findUserTasks();