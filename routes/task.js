const express = require("express");
const Task = require("../models/task");
const taskRouter = express.Router();
const isAuth = require("../middleware/passport");

// Add task
taskRouter.post("/add", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const result = await newTask.save();
    res.status(200).send({ task: result, msg: "Task successfully added" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to add task", error });
  }
});

// Get all tasks
taskRouter.get("/", async (req, res) => {
  try {
    const result = await Task.find();
    res.status(200).send({ tasks: result, msg: "All tasks" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to fetch tasks", error });
  }
});

// Delete task
taskRouter.delete("/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ msg: "Task not found" });
    }
    res.status(200).send({ msg: "Task is deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to delete task", error });
  }
});

// Update task
taskRouter.put("/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!result) {
      return res.status(404).send({ msg: "Task not found" });
    }
    res.status(200).send({ msg: "Task is updated", task: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to update task", error });
  }
});

module.exports = taskRouter;
