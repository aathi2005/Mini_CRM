const asyncHandler = require('express-async-handler');
const Lead = require('../models/Lead');

// @desc   Get all leads (search, filter, paginate)
// @route  GET /api/leads
// @access Private
const getLeads = asyncHandler(async (req, res) => {
  const { search, status, source, assignedTo, page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) query.status = status;
  if (source) query.source = source;
  if (assignedTo) query.assignedTo = assignedTo;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Lead.countDocuments(query);

  const leads = await Lead.find(query)
    .populate('company', 'name industry')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    leads,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

// @desc   Get single lead
// @route  GET /api/leads/:id
// @access Private
const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .populate('company', 'name industry website phone')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name');

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  res.json({ success: true, lead });
});

// @desc   Create lead
// @route  POST /api/leads
// @access Private
const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, status, source, company, assignedTo, notes } = req.body;

  const lead = await Lead.create({
    name, email, phone, status, source, company, assignedTo, notes,
    createdBy: req.user._id,
  });

  const populated = await Lead.findById(lead._id)
    .populate('company', 'name industry')
    .populate('assignedTo', 'name email');

  res.status(201).json({ success: true, lead: populated });
});

// @desc   Update lead
// @route  PUT /api/leads/:id
// @access Private
const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('company', 'name industry')
    .populate('assignedTo', 'name email');

  res.json({ success: true, lead: updated });
});

// @desc   Soft delete lead
// @route  DELETE /api/leads/:id
// @access Private
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  await Lead.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ success: true, message: 'Lead deleted successfully' });
});

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead };
