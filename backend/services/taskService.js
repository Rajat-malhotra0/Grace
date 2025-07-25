const Task = require("../models/task");

async function createTask(data) {
    try {
        const task = new Task(data);
        await task.save();
        return task;
    } catch (error) {
        throw error;
    }
}

async function readTasks(filter = {}) {
    try {
        const tasks = await Task.find(filter);
        return tasks;
    } catch (error) {
        throw error;
    }
}

async function updateTask(filter = {}, data = {}) {
    try {
        const task = await Task.findOneAndUpdate(filter, data, {
            new: true,
        });
        return task;
    } catch (error) {
        throw error;
    }
}

async function deleteTask(filter = {}) {
    try {
        await Task.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createTask,
    readTasks,
    updateTask,
    deleteTask,
};
