const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

// @desc   Get all tasks
// @route  GET /api/tasks
// @access Private
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo, lead, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  if (lead) query.lead = lead;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('lead', 'name status')
    .populate('createdBy', 'name')
    .sort({ dueDate: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    tasks,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
  });
});

// @desc   Get single task
// @route  GET /api/tasks/:id
// @access Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('lead', 'name status email')
    .populate('createdBy', 'name');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ success: true, task });
});

// @desc   Create task
// @route  POST /api/tasks
// @access Private
const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('lead', 'name status');
  res.status(201).json({ success: true, task: populated });
});

// @desc   Update task
// @route  PUT /api/tasks/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Restrict status updates: only the assigned user can change status
  if (req.body.status && req.body.status !== task.status) {
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isAssigned && !isAdmin) {
      res.status(403);
      throw new Error('Only the assigned user or admin can update task status');
    }
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('assignedTo', 'name email')
    .populate('lead', 'name status');

  res.json({ success: true, task: updated });
});

// @desc   Soft delete task
// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await Task.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ success: true, message: 'Task deleted successfully' });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
