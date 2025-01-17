// controllers/firingController.js

const Firing = require("../models/Firing");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

// @desc    Create a new Firing record
// @route   POST /api/firing
// @access  HR/Admin
exports.createFiring = asyncHandler(async (req, res) => {
  const {
    hr_id,
    employee_id,
    reason_for_termination,
    termination_date,
    final_salary_settlement,
  } = req.body;

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

  const firing = new Firing({
    hr_id,
    employee_id,
    reason_for_termination,
    termination_date,
    final_salary_settlement,
  });

  const savedFiring = await firing.save();
  res.status(201).json(savedFiring);
});

// @desc    Get all Firing records
// @route   GET /api/firing
// @access  HR/Admin
exports.getAllFirings = asyncHandler(async (req, res) => {
  const firings = await Firing.find()
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");
  res.status(200).json(firings);
});

// @desc    Get a single Firing record by ID
// @route   GET /api/firing/:id
// @access  HR/Admin
exports.getFiringById = asyncHandler(async (req, res) => {
  const firing = await Firing.findById(req.params.id)
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");

  if (!firing) {
    res.status(404);
    throw new Error("Firing record not found");
  }

  res.status(200).json(firing);
});

// @desc    Update a Firing record
// @route   PUT /api/firing/:id
// @access  HR/Admin
exports.updateFiring = asyncHandler(async (req, res) => {
  const { reason_for_termination, termination_date, final_salary_settlement } =
    req.body;

  const firing = await Firing.findById(req.params.id);

  if (!firing) {
    res.status(404);
    throw new Error("Firing record not found");
  }

  firing.reason_for_termination =
    reason_for_termination || firing.reason_for_termination;
  firing.termination_date = termination_date || firing.termination_date;
  firing.final_salary_settlement =
    final_salary_settlement || firing.final_salary_settlement;

  const updatedFiring = await firing.save();
  res.status(200).json(updatedFiring);
});

// @desc    Delete a Firing record
// @route   DELETE /api/firing/:id
// @access  HR/Admin
exports.deleteFiring = asyncHandler(async (req, res) => {
  const firing = await Firing.findById(req.params.id);

  if (!firing) {
    res.status(404);
    throw new Error("Firing record not found");
  }

  await firing.remove();
  res.status(200).json({ message: "Firing record removed" });
});
