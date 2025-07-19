const NGO = require("../models/ngo");
const Task = require("../models/task");
const User = require("../models/user");

async function getDashboardSummary() {
  try {
    const ngoCount = await NGO.countDocuments();
    const taskCount = await Task.countDocuments();
    const userCount = await User.countDocuments();

    const recentTasks = await Task.find().limit(5);
    const recentNgos = await NGO.find().limit(5);

    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const volunteers = await User.countDocuments({ role: 'volunteer' });

    return {
      stats: { ngoCount, taskCount, userCount, pendingTasks, completedTasks, volunteers },
      recentTasks,
      recentNgos
    };
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    throw error;
  }
}

async function getNGOMapData() {
  try {
    const ngos = await NGO.find();

    return ngos.map(ngo => ({
      id: ngo._id,
      name: ngo.name,
      description: ngo.description,
      contact: ngo.contact,
      coordinates: {
        lat: ngo.location?.coordinates?.latitude,
        lng: ngo.location?.coordinates?.longitude
      },
      address: ngo.location?.address
    }));
  } catch (error) {
    console.error("NGO Map Data Error:", error);
    throw error;
  }
}

async function getTaskAnalytics(filters = {}) {
  try {
    const Conditions = {};
    
    if (filters.ngo) {
      Conditions.ngo = filters.ngo;
    }

    if (filters.timeRange) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - filters.timeRange);
      Conditions.createdAt = {
        $gte: startDate
      };
    }

    const tasks = await Task.find(Conditions);

    const statusCounts = {};
    const categoryCounts = {};
    const statusDurations = {};

    for (const task of tasks) {
      const taskStatus = task.status || "unknown";
      if (!statusCounts[taskStatus]) {
        statusCounts[taskStatus] = 0;
        statusDurations[taskStatus] = 0;
      }
      statusCounts[taskStatus] += 1;

      if (task.updatedAt && task.createdAt) {
        const durationMs = task.updatedAt - task.createdAt;
        statusDurations[taskStatus] += durationMs;
      }

      const taskCategory = task.category || "uncategorized";
      categoryCounts[taskCategory] = (categoryCounts[taskCategory] || 0) + 1;
    }

    const statusResults = [];
    for (const status in statusCounts) {
      const count = statusCounts[status];
      const totalDuration = statusDurations[status];
      const avgHours = totalDuration / count / (1000 * 60 * 60);
      statusResults.push({
        status: status,
        count: count,
        avgCompletionTime: Number(avgHours.toFixed(2))
      });
    }

    const categoryResults = [];
    for (const category in categoryCounts) {
      categoryResults.push({
        category: category,
        count: categoryCounts[category]
      });
    }

    return { 
      byStatus: statusResults, 
      byCategory: categoryResults 
    };
    
  } catch (error) {
    console.error("Error while generating task analytics:", error);
    throw error;
  }
}



async function getRecentActivity() {
  try {
    const [recentTasks, recentNGOs, recentUsers] = await Promise.all([
      Task.find().sort({ updatedAt: -1 }),
      NGO.find().sort({ createdAt: -1 }),
      User.find().sort({ createdAt: -1 })
    ]);

    const taskActivities = recentTasks.map(task => ({
      type: 'task',
      title: task.title,
      date: task.updatedAt
    }));

    const ngoActivities = recentNGOs.map(ngo => ({
      type: 'ngo',
      title: ngo.name,
      date: ngo.createdAt
    }));

    const userActivities = recentUsers.map(user => ({
      type: 'user',
      title: user.name,
      date: user.createdAt
    }));

    return [...taskActivities, ...ngoActivities, ...userActivities]
      .sort((a, b) => b.date - a.date);
      
  } catch (error) {
    console.error("Error fetching recent activity:", error.message);
    throw new Error("Could not retrieve recent activity data");
  }
}


async function getTasksForManagement(filters = {}) {
  try {
    const {
      status: statusFilter,
      ngo: ngoFilter,
      search: searchText
    } = filters;

    const query = {};

    if (statusFilter) {
      query.status = statusFilter;
    }

    if (ngoFilter) {
      query.ngo = ngoFilter;
    }

    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query);

    return { tasks };
    
  } catch (error) {
    console.error("Error getting tasks for management:", error);
    throw new Error("Could not retrieve tasks. Please try again later.");
  }
}




module.exports = {
  getDashboardSummary,
  getNGOMapData,
  getTaskAnalytics,
  getRecentActivity,
  getTasksForManagement
};
