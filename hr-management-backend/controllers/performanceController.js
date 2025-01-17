// controllers/performanceController.js

const Performance = require("../models/Performance");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

// @desc    Create a new Performance record
// @route   POST /api/performance
// @access  HR/Admin
exports.createPerformance = asyncHandler(async (req, res) => {
  const { hr_id, employee_id, performance_review, bonuses } = req.body;

  // Validate HR and Employee existence
  const hr = await require("../models/HR").findById(hr_id);
  const employee = await Employee.findById(employee_id);

  if (!hr) {
    res.status(404);
    throw new Error("HR not found");
  }

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const performance = new Performance({
    hr_id,
    employee_id,
    performance_review,
    bonuses,
  });

  const savedPerformance = await performance.save();
  res.status(201).json(savedPerformance);
});

// @desc    Get all Performance records
// @route   GET /api/performance
// @access  HR/Admin
exports.getAllPerformances = asyncHandler(async (req, res) => {
  const performances = await Performance.find()
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");
  res.status(200).json(performances);
});

// @desc    Get a single Performance record by ID
// @route   GET /api/performance/:id
// @access  HR/Admin
exports.getPerformanceById = asyncHandler(async (req, res) => {
  const performance = await Performance.findById(req.params.id)
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");

  if (!performance) {
    res.status(404);
    throw new Error("Performance record not found");
  }

  res.status(200).json(performance);
});

// @desc    Update a Performance record
// @route   PUT /api/performance/:id
// @access  HR/Admin
exports.updatePerformance = asyncHandler(async (req, res) => {
  const { performance_review, bonuses } = req.body;

  const performance = await Performance.findById(req.params.id);

  if (!performance) {
    res.status(404);
    throw new Error("Performance record not found");
  }

  performance.performance_review =
    performance_review || performance.performance_review;
  performance.bonuses = bonuses || performance.bonuses;

  const updatedPerformance = await performance.save();
  res.status(200).json(updatedPerformance);
});

// @desc    Delete a Performance record
// @route   DELETE /api/performance/:id
// @access  HR/Admin
exports.deletePerformance = asyncHandler(async (req, res) => {
  const performance = await Performance.findById(req.params.id);

  if (!performance) {
    res.status(404);
    throw new Error("Performance record not found");
  }

  await performance.remove();
  res.status(200).json({ message: "Performance record removed" });
});
