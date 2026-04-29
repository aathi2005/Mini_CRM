const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');
const Lead = require('../models/Lead');

// @desc   Get all companies
// @route  GET /api/companies
// @access Private
const getCompanies = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { industry: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Company.countDocuments(query);
  const companies = await Company.find(query)
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    companies,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
  });
});

// @desc   Get single company + associated leads
// @route  GET /api/companies/:id
// @access Private
const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate('createdBy', 'name');
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  const leads = await Lead.find({ company: req.params.id })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  res.json({ success: true, company, leads });
});

// @desc   Create company
// @route  POST /api/companies
// @access Private
const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, company });
});

// @desc   Update company
// @route  PUT /api/companies/:id
// @access Private
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, company: updated });
});

// @desc   Soft delete company
// @route  DELETE /api/companies/:id
// @access Private
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  await Company.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ success: true, message: 'Company deleted successfully' });
});

module.exports = { getCompanies, getCompany, createCompany, updateCompany, deleteCompany };
