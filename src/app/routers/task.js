const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Task = require("../models/task");

/*
 *
 *  type: post
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: {
 *           description(String),
 *           completed(Boolean)(optional)
 *        }
 *  description: Create a new task
 *
 */
router.post("/task/create", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user_id: req.user._id });
    await task.save();
    await task.populate("user_id");
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: get
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  query: ?completetd=true&limit=2&skip=1&sortBy=
 *  description: Get all tasks
 *
 */
// GET task/all?completed=true
// GET task/all?limit=2&skip=2
// GET task/all?sortBy=createdBy:asc

router.get("/task/all", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) match.completed = req.query.completed === "true";
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
      populate: {
        path: "user_id",
        select: "name email age",
      },
    });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: get
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  param: id
 *  description: Get single task by id
 *
 */
router.get("/task/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, user_id: req.user._id });
    if (!task) return res.status(400).send();
    await task.populate("user_id");
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: patch
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: {
 *          description(String),
 *          completed(Boolean)(Optional)
 *        }
 *  param: id
 *  description: Update a task by id
 *
 */
router.patch("/task/:id", auth, async (req, res) => {
  const allowedUpdateKeys = ["description", "completed"];
  const updateKeys = Object.keys(req.body);

  if (!updateKeys.length)
    return res.status(400).send({
      error: `Invalid upates!`,
    });

  const isValidKeys = updateKeys.every((value) =>
    allowedUpdateKeys.includes(value)
  );

  if (!isValidKeys)
    return res.status(400).send({
      error: `Invalid upates!`,
    });

  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, user_id: req.user._id });
    if (!task) return res.status(400).send();

    updateKeys.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: delete
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  param: id
 *  description: Delete a task by id
 *
 */
router.delete("/task/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOneAndDelete({
      _id: id,
      user_id: req.user._id,
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
