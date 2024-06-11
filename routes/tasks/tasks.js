const express = require("express");
const router = express.Router();
const Task = require("../../models/tasks/Task");

router.get("/tasks", async (req, res) => {
  try {
    const tasksFound = await Task.find();
    return res.status(200).json({ message: "Home", data: tasksFound });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.post("/task/create", async (req, res) => {
  try {
    const { name } = req.body;
    if (name) {
      const newTask = new Task({ name: name, isDone: false });
      await newTask.save();
      return res.status(200).json({ message: "Task created", data: newTask });
    } else return res.status(400).json({ message: "Task name required" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.put("/task/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { isDone } = req.body;
    await Task.findByIdAndUpdate(id, { isDone: isDone });
    const updatedTask = await Task.findById(id);
    return res.status(200).json({ message: "Task updated", data: updatedTask });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.delete("/task/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.delete("/tasks/delete", async (req, res) => {
  try {
    await Task.collection.drop();
    return res.status(200).json({ message: "Tasks collection dropped" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = router;
