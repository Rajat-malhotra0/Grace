const Task = require("../models/task");

async function createTask(data) {
    try {
        const task = new Task(data);
        await task.save();
        return task;
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

async function readTasks(filter = {}) {
    try {
        const tasks = await Task.find(filter);
        return tasks;
    } catch (error) {
        console.error("Error reading tasks:", error);
    }
}

async function updateTask(filter = {}, data = {}) {
    try {
        const task = await Task.findOneAndUpdate(filter, data, {
            new: true,
        });
        return task;
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

async function deleteTask(filter = {}) {
    try {
        await Task.deleteOne(filter);
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

module.exports = {
    createTask,
    readTasks,
    updateTask,
    deleteTask,
};
