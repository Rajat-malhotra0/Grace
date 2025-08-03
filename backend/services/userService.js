const User = require("../models/user");
const Task = require("../models/task");
const UserNgoRelation = require("../models/userNgoRelation");

const { calculateImpact, calculateLevel } = require("./scoringService");

async function getLeaderboard(limit = 10) {
    try {
        const users = await User.find({
            isActive: true,
            role: { $in: ["volunteer", "ngoMember"] },
        });

        users.sort((a, b) => b.score - a.score);
        const topUsers = users.slice(0, limit);

        return topUsers.map((user, index) => ({
            id: user._id.toString(),
            rank: index + 1,
            name: user.userName,
            location: user.location?.city || "Unknown",
            hours: user.leaderboardStats?.hours || 0,
            activities: user.leaderboardStats?.tasksCompleted || 0,
            impact: user.leaderboardStats?.impactScore || 0,
            streak: user.leaderboardStats?.currentStreak || 0,
            joined: user.createdAt,
            level: user.leaderboardStats?.level || "Beginner",
        }));
    } catch (error) {
        throw error;
    }
}

async function completeTask(taskId, userId, hoursSpent = 1) {
    try {
        const task = await Task.findById(taskId);
        if (!task) throw new Error("Task not found");

        task.status = "done";
        task.completedAt = new Date();
        await task.save();

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const currentHours = user.leaderboardStats?.hours || 0;
        const currentTasks = user.leaderboardStats?.tasksCompleted || 0;
        const currentStreak = user.leaderboardStats?.currentStreak || 0;

        const newHours = currentHours + hoursSpent;
        const newTasks = currentTasks + 1;

        const newImpact = calculateImpact(newTasks, newHours);
        const newLevel = calculateLevel(newTasks);

        const today = new Date();
        const lastActive = user.lastActiveDate;
        let newStreak = 1;

        if (lastActive) {
            const daysDiff = Math.floor(
                (today - lastActive) / (1000 * 60 * 60 * 24)
            );
            if (daysDiff === 1) {
                newStreak = currentStreak + 1;
            } else if (daysDiff === 0) {
                newStreak = currentStreak;
            }
        }

        const points = 10 + hoursSpent * 5;

        user.score = user.score + points;
        user.leaderboardStats = {
            hours: newHours,
            tasksCompleted: newTasks,
            impactScore: newImpact,
            currentStreak: newStreak,
            level: newLevel,
        };
        user.lastActiveDate = today;

        await user.save();

        return { user, task, pointsEarned: points };
    } catch (error) {
        throw error;
    }
}

async function getUsersByNgo(ngoId) {
    try {
        const relations = await UserNgoRelation.find({ ngo: ngoId })
            .populate("user", "userName email _id role")
            .select("user");

        return relations.map((relation) => relation.user);
    } catch (error) {
        console.error("Error getting users by NGO:", error);
        throw error;
    }
}

async function createUser(data) {
    try {
        const user = new User(data);
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}

async function readUsers(filter = {}) {
    try {
        const users = await User.find(filter);
        return users;
    } catch (error) {
        throw error;
    }
}

async function updateUser(filter = {}, data = {}) {
    try {
        const user = await User.findOneAndUpdate(filter, data, { new: true });
        return user;
    } catch (error) {
        throw error;
    }
}

async function deleteUser(filter = {}) {
    try {
        await User.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    readUsers,
    getLeaderboard,
    updateUser,
    deleteUser,
    completeTask,
    getUsersByNgo,
};
