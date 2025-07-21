const express = require('express');
const router = express.Router();
const NGO = require('../models/ngo');
const Task = require('../models/task');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const authenticateAdmin = [authMiddleware, roleMiddleware(['admin'])];


router.get('/adminSumm', authenticateAdmin, async (req, res) => {
    try {
    const ngos = await NGO.find();
    const tasks = await Task.find();

    const ngoCount = await NGO.countDocuments();
    const taskCount = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      data: { ngos, recentTasks: tasks, stats : {ngoCount,taskCount,completedTasks }}
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ngos/map', authenticateAdmin, async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json({
        success: true,
        data: ngos.map(ngo => ({
        id: ngo._id,
        name: ngo.name,
        lat: ngo.location.coordinates[1],
        lng: ngo.location.coordinates[0],
        contact: ngo.contact
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/tasks', authenticateAdmin, async (req, res) => {
    try {
    const { status, ngo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (ngo) filter.ngo = ngo;

    const tasks = await Task.find(filter);
    console.log("Tasks : ",tasks);

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;



