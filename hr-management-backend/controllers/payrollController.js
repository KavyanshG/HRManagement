// controllers/payrollController.js

const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

// @desc    Create a new Payroll record
// @route   POST /api/payroll
// @access  HR/Admin
exports.createPayroll = asyncHandler(async (req, res) => {
  const {
    hr_id,
    employee_id,
    monthly_or_quarterly_payments,
    promotions,
    bonus_schedule,
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

  const payroll = new Payroll({
    hr_id,
    employee_id,
    monthly_or_quarterly_payments,
    promotions,
    bonus_schedule,
  });

  const savedPayroll = await payroll.save();
  res.status(201).json(savedPayroll);
});

// @desc    Get all Payroll records
// @route   GET /api/payroll
// @access  HR/Admin
exports.getAllPayrolls = asyncHandler(async (req, res) => {
  const payrolls = await Payroll.find()
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");
  res.status(200).json(payrolls);
});

// @desc    Get a single Payroll record by ID
// @route   GET /api/payroll/:id
// @access  HR/Admin
exports.getPayrollById = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findById(req.params.id)
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");

  if (!payroll) {
    res.status(404);
    throw new Error("Payroll record not found");
  }

  res.status(200).json(payroll);
});

// @desc    Update a Payroll record
// @route   PUT /api/payroll/:id
// @access  HR/Admin
exports.updatePayroll = asyncHandler(async (req, res) => {
  const { monthly_or_quarterly_payments, promotions, bonus_schedule } =
    req.body;

  const payroll = await Payroll.findById(req.params.id);

  if (!payroll) {
    res.status(404);
    throw new Error("Payroll record not found");
  }

  payroll.monthly_or_quarterly_payments =
    monthly_or_quarterly_payments || payroll.monthly_or_quarterly_payments;
  payroll.promotions = promotions || payroll.promotions;
  payroll.bonus_schedule = bonus_schedule || payroll.bonus_schedule;

  const updatedPayroll = await payroll.save();
  res.status(200).json(updatedPayroll);
});

// @desc    Delete a Payroll record
// @route   DELETE /api/payroll/:id
// @access  HR/Admin
exports.deletePayroll = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findById(req.params.id);

  if (!payroll) {
    res.status(404);
    throw new Error("Payroll record not found");
  }

  await payroll.remove();
  res.status(200).json({ message: "Payroll record removed" });
});
