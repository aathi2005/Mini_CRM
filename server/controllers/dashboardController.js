const asyncHandler = require('express-async-handler');
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const Company = require('../models/Company');

// @desc   Get dashboard aggregated stats
// @route  GET /api/dashboard
// @access Private
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalLeads,
    qualifiedLeads,
    newLeads,
    contactedLeads,
    lostLeads,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    doneTasks,
    totalCompanies,
    recentLeads,
    upcomingTasks,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'Qualified' }),
    Lead.countDocuments({ status: 'New' }),
    Lead.countDocuments({ status: 'Contacted' }),
    Lead.countDocuments({ status: 'Lost' }),
    Task.countDocuments(),
    Task.countDocuments({ status: 'Pending' }),
    Task.countDocuments({ status: 'In Progress' }),
    Task.countDocuments({ status: 'Done' }),
    Company.countDocuments(),
    Lead.find()
      .populate('company', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
    Task.find({ status: { $ne: 'Done' } })
      .populate('assignedTo', 'name')
      .populate('lead', 'name')
      .sort({ dueDate: 1 })
      .limit(5),
  ]);

  const leadsByStatus = [
    { status: 'New', count: newLeads },
    { status: 'Contacted', count: contactedLeads },
    { status: 'Qualified', count: qualifiedLeads },
    { status: 'Lost', count: lostLeads },
  ];

  const tasksByStatus = [
    { status: 'Pending', count: pendingTasks },
    { status: 'In Progress', count: inProgressTasks },
    { status: 'Done', count: doneTasks },
  ];

  res.json({
    success: true,
    stats: {
      totalLeads,
      qualifiedLeads,
      totalTasks,
      pendingTasks,
      doneTasks,
      totalCompanies,
    },
    leadsByStatus,
    tasksByStatus,
    recentLeads,
    upcomingTasks,
  });
});

module.exports = { getDashboard };
