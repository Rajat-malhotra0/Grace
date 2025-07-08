const Task = require("../models/task");
const socketIo = require("socket.io");
let io;

const init = (server) => {
    io = socketIo(server,{
        cors : {
            origin : process.env.CLIENT_URL,
            methods : ['GET','POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username} (${socket.id})`);

        socket.on('join-task', async (taskId) => {
        try {
            const task = await Task.findById(taskId);
            if (!task) throw new Error('Task not found');

            if ([task.assignedTo, task.createdBy].includes(socket.user._id)) {
            socket.join(`task-${taskId}`);
            console.log(`${socket.user.username} joined task : ${taskId}`);
            socket.emit('task-state',task);
            }
            else{
                throw new Error('Unauthoried Access');
            }
        } catch (err) {
            socket.emit('error', err);
        }
        });

        socket.on('update-task', async (update) => {
        try {
            const { taskId, changes } = update;
            const task = await Task.findById(taskId);

            if (![task.createdBy, task.assignedTo].some(id => id.equals(socket.user._id))) {
            throw new Error('Not authorized to update this task');
            }
            
            const allowedUpdates = ['status', 'assignedTo', 'completionProof', 'dueDate'];
            const filteredChanges = Object.keys(changes)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = changes[key];
                return obj;
            }, {});

            const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { ...filteredChanges, updatedAt: new Date() },
            { new: true, runValidators: true }
            ).populate('assignedTo createdBy', 'username email');

            if (!updatedTask) throw new Error('Update failed');

            io.to(`task-${taskId}`).emit('task-updated', updatedTask);

            //task reassigned
            if (filteredChanges.assignedTo && !filteredChanges.assignedTo.equals(task.assignedTo)) {
            io.to(`user_${filteredChanges.assignedTo}`).emit('task-assigned', updatedTask);
            }

        } catch (err) {
            socket.emit('error', { message: err.message });
            console.error('Update error:', err);
        }
        });

        socket.on('disconnect',() => {
            console.log(`Client Disconnected : ${socket.id}`);
        });
    });
};

const emitTaskUpdate = (taskId,update) => {
    io.to(`task-${taskId}`).emit('task-updated',update);
};

module.exports = {init,emitTaskUpdate};