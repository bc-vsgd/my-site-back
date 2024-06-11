const mongoose = require("mongoose");
const dbTasks = mongoose.createConnection(`${process.env.MONGODB_URI}tasks`);

const taskSchema = mongoose.Schema({
  name: String,
  isDone: Boolean,
});

const Task = dbTasks.model("Task", taskSchema);

module.exports = Task;
