require("../../src/app/db/connection");
require("../../src/app/models/user");
const Task = require("../../src/app/models/task");

// Get the user details for the task.

const findTaskUser = async () => {
  const task = await Task.findById("6194b76e919bd4b074931918");
  await task.populate("user_id");
  console.log(task);
};

findTaskUser();
