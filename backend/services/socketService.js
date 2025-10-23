const Task = require("../models/task");
const authService = require("./authService");
const socketIo = require("socket.io");

let io;

const init = (server, options = {}) => {
    const { allowedOrigins = [], corsOptions = {} } = options;
    const allowAll = allowedOrigins.includes("*");
    const normalizedOrigins = allowedOrigins
        .filter((origin) => origin && origin !== "*")
        .map((origin) => origin.replace(/\/$/, ""));

    const corsConfig = {
        methods: ["GET", "POST"],
        credentials: true,
        ...corsOptions,
    };

    if (!corsConfig.origin) {
        corsConfig.origin = (origin, callback) => {
            if (
                !origin ||
                allowAll ||
                normalizedOrigins.includes(origin.replace(/\/$/, ""))
            ) {
                return callback(null, true);
            }
            return callback(new Error("Socket origin not allowed"));
        };
    }

    io = socketIo(server, {
        cors: corsConfig,
    });

    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.query?.token ||
                socket.handshake.headers?.authorization?.replace("Bearer ", "");

            if (!token) {
                return next(new Error("Authentication token missing"));
            }

            const user = await authService.verifyToken(token);
            if (!user) {
                return next(new Error("Invalid authentication token"));
            }

            socket.user = user;
            return next();
        } catch (err) {
            return next(err);
        }
    });

    io.on("connection", (socket) => {
        const username =
            socket?.user?.userName || socket?.user?.username || "anonymous";
        console.log(`Socket connected: ${username} (${socket.id})`);

        const ensureAuthenticated = () => {
            if (!socket.user || !socket.user._id) {
                socket.emit("error", {
                    message: "Unauthorized socket session",
                });
                return false;
            }
            return true;
        };

        socket.on("join-task", async (taskId) => {
            if (!ensureAuthenticated()) return;

            try {
                const task = await Task.findById(taskId);
                if (!task) throw new Error("Task not found");

                const userId = socket.user._id;

                const isParticipant = [task.assignedTo, task.createdBy]
                    .filter(Boolean)
                    .some((id) =>
                        id.equals
                            ? id.equals(userId)
                            : String(id) === String(userId)
                    );

                if (!isParticipant) {
                    throw new Error("Unauthorized access to task channel");
                }

                socket.join(`task-${taskId}`);
                console.log(`${username} joined task: ${taskId}`);
                socket.emit("task-state", task);
            } catch (err) {
                socket.emit("error", { message: err.message });
            }
        });

        socket.on("update-task", async (update) => {
            if (!ensureAuthenticated()) return;

            try {
                const { taskId, changes } = update;
                const task = await Task.findById(taskId);
                if (!task) throw new Error("Task not found");

                const userId = socket.user._id;
                const canEdit = [task.createdBy, task.assignedTo]
                    .filter(Boolean)
                    .some((id) =>
                        id.equals
                            ? id.equals(userId)
                            : String(id) === String(userId)
                    );

                if (!canEdit) {
                    throw new Error("Not authorized to update this task");
                }

                const allowedUpdates = [
                    "status",
                    "assignedTo",
                    "completionProof",
                    "dueDate",
                ];
                const filteredChanges = Object.keys(changes || {})
                    .filter((key) => allowedUpdates.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = changes[key];
                        return obj;
                    }, {});

                const updatedTask = await Task.findByIdAndUpdate(
                    taskId,
                    { ...filteredChanges, updatedAt: new Date() },
                    { new: true, runValidators: true }
                ).populate("assignedTo createdBy", "username email");

                if (!updatedTask) throw new Error("Update failed");

                io.to(`task-${taskId}`).emit("task-updated", updatedTask);

                if (
                    filteredChanges.assignedTo &&
                    task.assignedTo &&
                    filteredChanges.assignedTo !== String(task.assignedTo)
                ) {
                    io.to(`user_${filteredChanges.assignedTo}`).emit(
                        "task-assigned",
                        updatedTask
                    );
                }
            } catch (err) {
                socket.emit("error", { message: err.message });
                console.error("Update error:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

const emitTaskUpdate = (taskId, update) => {
    if (!io) {
        console.warn("Socket server has not been initialised yet");
        return;
    }

    io.to(`task-${taskId}`).emit("task-updated", update);
};

module.exports = { init, emitTaskUpdate };
